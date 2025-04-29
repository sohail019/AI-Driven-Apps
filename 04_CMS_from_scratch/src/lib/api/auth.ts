import axiosInstance from "../axios";

export type UserRole = "Admin" | "SuperAdmin";

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/admin/login", {
      email,
      password,
    });
    return response.data;
  },

  superAdminLogin: async (email: string, password: string) => {
    const response = await axiosInstance.post("/superadmin/login", {
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
    const response = await axiosInstance.post("/superadmin/admins", {
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
