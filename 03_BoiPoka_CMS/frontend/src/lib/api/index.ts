import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  login: (email: string, password: string) =>
    api.post("/admin/login", { email, password }),
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    permissions: string[];
  }) => api.post("/admin/register", data),
  getProfile: () => api.get("/admin/profile"),
};

export const superadminApi = {
  login: (email: string, password: string) =>
    api.post("/superadmin/login", { email, password }),
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post("/superadmin/register", data),
  getProfile: () => api.get("/superadmin/profile"),
};
