import axios from "axios";
import { store } from "../store";
import { setRefreshToken, logout } from "../store/slices/authSlice";
import moment from "moment";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://ec2-13-60-94-109.eu-north-1.compute.amazonaws.com:3333/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.request.use(async (config) => {
  const state = store.getState().auth;
  const tokenExpiryDate = moment(state.tokenExpiryDate);
  const currentDate = moment();

  const differenceInMinutes = tokenExpiryDate.diff(currentDate, "minutes");

  if (differenceInMinutes < 30 && state.refreshToken) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refreshToken`, {
        refreshToken: state.refreshToken,
      });
      const { token, refreshToken, tokenExpiryDate } = response.data.data;

      store.dispatch(
        setRefreshToken({
          newToken: token,
          newRefreshToken: refreshToken,
          newExpiryDate: tokenExpiryDate,
        })
      );

      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to refresh token", err);
      store.dispatch(logout());
      window.location.href = "/login";
    }
  } else if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }

  return config;
});

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is 401 and we haven't tried to refresh the token yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh the token
//         const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
//         const { token } = response.data;

//         // Save the new token
//         localStorage.setItem("token", token);

//         // Update the authorization header
//         originalRequest.headers.Authorization = `Bearer ${token}`;

//         // Retry the original request
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // If refresh token fails, log out the user
//         store.dispatch(logout());
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     // Handle other errors
//     if (error.response?.status === 401) {
//       store.dispatch(logout());
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const state = store.getState().auth;
      if (state.refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refreshToken`,
            {
              refreshToken: state.refreshToken,
            }
          );
          const { token, refreshToken, tokenExpiryDate } = response.data.data;

          store.dispatch(
            setRefreshToken({
              newToken: token,
              newRefreshToken: refreshToken,
              newExpiryDate: tokenExpiryDate,
            })
          );

          // Retry the original request with the new token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          store.dispatch(logout());
          window.location.href = "/login";
        }
      } else {
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
