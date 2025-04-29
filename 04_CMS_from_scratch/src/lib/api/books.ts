import axiosInstance from "../axios";

export interface Book {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  author: string[];
  ISBN: string[];
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  title?: string;
}

export const booksAPI = {
  // Get books with pagination and search
  getBooks: async (params: GetBooksParams = {}) => {
    const { page = 1, limit = 10, title = "" } = params;
    const response = await axiosInstance.get(`/admin/getAllBooks`, {
      params: {
        page,
        limit,
        title,
      },
    });
    return response.data.data as BooksResponse;
  },

  // Get book by id
  getBookById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/getBook/${id}`);
    return response.data.data as Book;
  },

  // Update book
  updateBook: async (id: string, bookData: Partial<Book>) => {
    const response = await axiosInstance.put(
      `/admin/updateBook/${id}`,
      bookData
    );
    return response.data.data as Book;
  },

  // Delete book
  deleteBook: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/deleteBook/${id}`);
    return response.data;
  },
};
