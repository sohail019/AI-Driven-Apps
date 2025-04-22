import store from "@/store";
import { setRefreshToken } from "@/store/slices/auth-slice";
import axios from "axios";
import moment from "moment";
const baseURL =
  import.meta.env.BOILERPLATE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const state = store.getState().auth;
  const tokenExpiryDate = moment(state.tokenExpiryDate);
  const currentDate = moment();

  const differenceInMinutes = tokenExpiryDate.diff(currentDate, "minutes");

  if (differenceInMinutes < 30 && state.refreshToken) {
    try {
      const response = await axios.post(`${baseURL}/auth/refreshToken`, {
        refreshToken: state.refreshToken,
      });
      console.log(response.data);
      const { token, refreshToken, tokenExpiryDate } = response.data.data;
      store.dispatch(
        setRefreshToken({
          newToken: token,
          newRefreshToken: refreshToken,
          newExpiryDate: tokenExpiryDate,
        })
      );

      // Update the config with the new token
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to refresh token", err);
    }
  } else if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      //? don't remove token, we need fresh token. we got key and time, by default we have token, we have expiry time, don't use axiosInstance, use axios  directly,
      // window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
