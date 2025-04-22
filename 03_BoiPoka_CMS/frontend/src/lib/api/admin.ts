import axiosInstance from "@/utils/axios-instance";

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/admin/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    privileges: string[];
  }) => {
    const response = await axiosInstance.post("/admin/register", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/admin/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post("/admin/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/admin/profile");
    return response.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    email?: string;
    password?: string;
  }) => {
    const response = await axiosInstance.put("/admin/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await axiosInstance.put("/admin/change-password", data);
    return response.data;
  },
};
