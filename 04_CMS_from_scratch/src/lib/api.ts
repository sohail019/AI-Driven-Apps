import axiosInstance from "./axios";

// Authentication API

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
