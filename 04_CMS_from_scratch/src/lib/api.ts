import axiosInstance from "./axios";
import { User } from "../store/slices/authSlice";

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/admin/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    mobile: string
  ) => {
    const response = await axiosInstance.post("/super-admin/admins", {
      name,
      email,
      password,
      mobile,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      email,
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (userData: Partial<User>) => {
    const response = await axiosInstance.put("/users/profile", userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.put("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/users?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// Define Page interface for the CMS
export interface Page {
  id?: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
  authorId?: string;
  metadata?: Record<string, unknown>;
}

// Content API - Example for a CMS
export const contentAPI = {
  getPages: async (page = 1, limit = 10, filters = {}) => {
    const response = await axiosInstance.get("/pages", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  getPageById: async (id: string) => {
    const response = await axiosInstance.get(`/pages/${id}`);
    return response.data;
  },

  createPage: async (pageData: Page) => {
    const response = await axiosInstance.post("/pages", pageData);
    return response.data;
  },

  updatePage: async (id: string, pageData: Partial<Page>) => {
    const response = await axiosInstance.put(`/pages/${id}`, pageData);
    return response.data;
  },

  deletePage: async (id: string) => {
    const response = await axiosInstance.delete(`/pages/${id}`);
    return response.data;
  },
};
