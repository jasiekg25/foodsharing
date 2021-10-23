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
    return axios.get(`${baseUrl}/current_offers`)
  },
  putUserCurrentOffers: (body) => {
    return axios.put(`${baseUrl}/current_offers`, body)
  },
  postOffers: (body) => {
    return axios.post(`${baseUrl}/offers`, body);
  },
  getUserOrdersHistory: () => {
    return axios.get(`${baseUrl}/profile_orders`)
  },
  putUserOrdersHistory: (body) => {
    return axios.put(`${baseUrl}/profile_orders`, body)
  },
  postOrder: (body) => {
    return axios.post(`${baseUrl}/orders`, body);
  },
  getTags: () => {
    return axios.get(`${baseUrl}/tags`);
  },
  getProfile: () => {
    return axios.get(`${baseUrl}/user_profile`)
  },
  putProfile: (body) => {
    return axios.put(`${baseUrl}/user_profile`, body);
  },
  finalizeRegistration: () => {
    return axios.get(`${baseUrl}/auth/finalize`)
    .then(res => localStorage.setItem("accessToken", res.data.access_token))
    .then(() => history.push('/offers'));
  },
  getOtherUserProfile: (id) => {
    return axios.get(`${baseUrl}/user_profile?user-id=${id}`)
  },
  getUserChatRooms: () => {
    return axios.get(`${baseUrl}/chat_rooms`);
  },
  putUserChatRoom: (body) => {
    return axios.put(`${baseUrl}/chat_rooms`, body);
  },
  getChatMessages: (id) => {
    return axios.get(`${baseUrl}/chat_messages?chat_room_id=${id}`);
  },
  getUserNotifications: () => {
    return axios.get(`${baseUrl}/user_notifications`)
  },
  postSharerRating: (body) => {
    return axios.post(`${baseUrl}/rating`, body)
  }
};

export default api;
