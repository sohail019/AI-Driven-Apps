import axiosInstance from "../axios";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profileUrl: string;
  userBookCount: number;
  gender: string;
  address: string;
  state: string;
  pincode: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  fullName?: string;
}

export const userAPI = {
  // Get users with pagination and search
  getUsers: async (params: GetUsersParams = {}) => {
    const { page = 1, limit = 10, sortOrder = "desc", fullName = "" } = params;
    const response = await axiosInstance.get(`/admin/getAllUser`, {
      params: {
        page,
        limit,
        sortOrder,
        fullName,
      },
    });
    return response.data.data as UsersResponse;
  },

  // Get user by id
  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/getUser/${id}`);
    return response.data.data as User;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await axiosInstance.put(
      `/admin/updateUser/${id}`,
      userData
    );
    return response.data.data as User;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/deleteUsers/${id}`);
    console.log(response.data);
    return response.data;
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId: string, isActive: boolean) => {
    const endpoint = isActive ? "/admin/activateUser" : "/admin/deactivateUser";
    const response = await axiosInstance.put(endpoint, { userIds: [userId] });
    return response.data;
  },
};
