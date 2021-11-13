import axios from "axios";
import { history } from "./index";

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
  function(error) {
    const originalRequest = error.config;
    const accessToken = localStorage.getItem("accessToken");

    // // when the refresh time has expired remove token from storage and log out
    // if(["ExpiredRefreshError", "InvalidTokenHeader"].includes(error.response.data.error)) {
    //     history.push('/timeout')
    // }

    try {
      if (
        accessToken &&
        error.response.data.error === "ExpiredAccessError" && // 401
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        return axios.get(`${baseUrl}/auth/refresh`).then((res) => {
          if (res.status === 200) {
            localStorage.setItem("accessToken", res.data.access_token);
            console.log("Access token refreshed!");
            return axios(originalRequest);
          }
        });
      } else if (accessToken && error.response.status === 401) {
        history.push("/timeout");
      }
    } catch {}

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
  getOffers: (page, lat, lon, tags, sortBy) => {
    return axios.get(`${baseUrl}/offers?page=${page}&lat=${lat}&lon=${lon}&tags_ids=${tags}&sorted_by=${sortBy}`);
  },
  getOffer: (offer_id) => {
    return axios.get(`${baseUrl}/offers/${offer_id}`)
  },
  getUserCurrentOffers: () => {
    return axios.get(`${baseUrl}/user/profile/offers`)
  },
  putUserCurrentOffers: (body) => {
    return axios.put(`${baseUrl}/user/profile/offers`, body)
  },
  postOffers: (body) => {
    return axios.post(`${baseUrl}/offers`, body);
  },
  getUserOrdersHistory: () => {
    return axios.get(`${baseUrl}/user/profile/orders`)
  },
  putUserOrdersHistory: (body) => {
    return axios.put(`${baseUrl}/user/profile/orders`, body)
  },
  postOrder: (body) => {
    return axios.post(`${baseUrl}/orders`, body);
  },
  getTags: () => {
    return axios.get(`${baseUrl}/tags`);
  },
  getProfile: () => {
    return axios.get(`${baseUrl}/user/profile`)
  },
  putProfile: (body) => {
    return axios.put(`${baseUrl}/user/profile`, body);
  },
  finalizeRegistration: () => {
    return axios.get(`${baseUrl}/auth/finalize`);
  },
  getOtherUserProfile: (id) => {
    return axios.get(`${baseUrl}/user/profile?user-id=${id}`)
  },
  getUserChatRooms: () => {
    return axios.get(`${baseUrl}/user/chat_rooms`);
  },
  putUserChatRoom: (body) => {
    return axios.put(`${baseUrl}/user/chat_rooms`, body);
  },
  getChatMessages: (chat_room_id) => {
    return axios.get(`${baseUrl}/user/chat_rooms/${chat_room_id}`);
  },
  getUserNotifications: () => {
    return axios.get(`${baseUrl}/user/notifications`)
  },
  postSharerRating: (body) => {
    return axios.post(`${baseUrl}/user/rating`, body)
  }
};

export default api;
