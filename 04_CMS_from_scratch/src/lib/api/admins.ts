import axiosInstance from "../axios";

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isDeleted: boolean;
  isActive: boolean;
}

export const adminAPI = {
  //? Get admins: Working
  getAdmins: async () => {
    const response = await axiosInstance.get(`/superadmin/getAllAdmin`);
    return response.data.data;
  },
};
