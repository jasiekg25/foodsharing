import axios from "axios";
import {history} from "./index"

const baseUrl = process.env.REACT_APP_BACKEND_SERVICE_URL;

axios.interceptors.request.use(
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


axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        const accessToken = localStorage.getItem("accessToken");

        // // when the refresh time has expired remove token from storage and log out
        // if(["ExpiredRefreshError", "InvalidTokenHeader"].includes(error.response.data.error)) {
        //     history.push('/timeout')
        // }

        if (
            accessToken &&
            error.response.data.error === "ExpiredAccessError" && // 401
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
                })
        } else if (accessToken && error.response.status === 401) {
            history.push('/timeout')
        }
        return Promise.reject(error);
    }
);

const api = {
    register: (body) => {
        return axios.post(`${baseUrl}/auth/register`, body);
    },
    login: (body) => {
        return axios.post(`${baseUrl}/auth/login`, body);
    },
    refreshToken: (body) => {
        return axios.post(`${baseUrl}/auth/refresh`, body);
    },
    getOffers: () => {
        return axios.get(`${baseUrl}/offers`);
    },
    postOffers: (body) => {
        return axios.post(`${baseUrl}/offers`, body);
    },
    postOrder: (body) => {
        return axios.post(`${baseUrl}/orders`, body)
    },
    getTags: () => {
        return axios.get(`${baseUrl}/tags`)
    }
};


export default api;
