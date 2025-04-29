import axiosInstance from "../axios";

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalInnerCircles: number;
  booksAddedLastMonth: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
}

export interface TopBook {
  _id: string;
  title: string;
  author: string[];
  coverImage: string;
  count: number;
}

export interface DashboardResponse {
  data: DashboardStats;
}

export interface GenreDistributionResponse {
  data: {
    genreDistribution: GenreDistribution[];
  };
}

export interface TopBooksResponse {
  data: {
    topBooks: TopBook[];
  };
}

export const dashboardAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get<DashboardResponse>(
      "/admin/getDashboardCardData"
    );
    return response.data.data;
  },

  // Get genre distribution
  getGenreDistribution: async () => {
    const response = await axiosInstance.get<GenreDistributionResponse>(
      "/admin/getGenreDistribution"
    );
    return response.data.data.genreDistribution;
  },

  // Get top 5 books
  getTopBooks: async () => {
    const response = await axiosInstance.get<TopBooksResponse>(
      "/admin/getTopFiveBooks"
    );
    // Ensure we return an array
    const data = response.data.data.topBooks;
    return Array.isArray(data) ? data : [];
  },
};
