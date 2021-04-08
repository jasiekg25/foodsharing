import axios from "axios";
import { history } from "./index"

const baseUrl = process.env.REACT_APP_BACKEND_SERVICE_URL;

const authInterceptor = axios.interceptors.request.use(
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
const refreshInterceptor = axios.interceptors.response.use(
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
        history.push('/login')
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
