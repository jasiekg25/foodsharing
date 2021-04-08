import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_SERVICE_URL;

//request interceptor to add the auth token header to requests
export const authInterceptor = axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor to refresh token on receiving token expired error
export const refreshInterceptor = axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    const accessToken = localStorage.getItem("accessToken");

    // when the refresh time has expired remove token from storage and log out
    if(error.response.data.error == "ExpiredRefreshError") {
        localStorage.removeItem("accessToken");
        console.log("Elapsed token removed!")
        window.location.href = `/login`;
    }

    if (
        accessToken &&
        error.response.status === 401 &&
        !originalRequest._retry
        ) {
        originalRequest._retry = true;
        return axios
            .get(`${baseUrl}/auth/refresh`)
            .then((res) => {
            if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.access_token);
                console.log("Access token refreshed!");
                return axios(originalRequest);
            }
            });
        }
    return Promise.reject(error);
  }
);

// doesnt work when refreshing because this is not called