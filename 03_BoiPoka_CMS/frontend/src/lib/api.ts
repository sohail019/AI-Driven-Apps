import axiosInstance from "@/utils/axios-instance";

export async function getStudents(
  offset: number,
  pageLimit: number,
  token: string
) {
  try {
    const res = await axiosInstance.get(
      `/admin/users?offset=${offset}&pageLimit=${pageLimit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
