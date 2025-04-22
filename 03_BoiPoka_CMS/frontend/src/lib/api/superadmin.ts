import axiosInstance from "@/utils/axios-instance";

export const superadminApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/super-admin/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const response = await axiosInstance.post("/super-admin/register", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/super-admin/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post("/super-admin/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/super-admin/profile");
    return response.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    email?: string;
    password?: string;
  }) => {
    const response = await axiosInstance.put("/super-admin/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await axiosInstance.put(
      "/super-admin/change-password",
      data
    );
    return response.data;
  },

  // Admin management
  getAllAdmins: async () => {
    const response = await axiosInstance.get("/super-admin/admins");
    return response.data;
  },

  getAdminById: async (id: string) => {
    const response = await axiosInstance.get(`/super-admin/admins/${id}`);
    return response.data;
  },

  updateAdmin: async (
    id: string,
    data: {
      fullName?: string;
      email?: string;
      privileges?: string[];
      isActive?: boolean;
    }
  ) => {
    const response = await axiosInstance.put(`/super-admin/admins/${id}`, data);
    return response.data;
  },

  deleteAdmin: async (id: string) => {
    const response = await axiosInstance.delete(`/super-admin/admins/${id}`);
    return response.data;
  },
};
