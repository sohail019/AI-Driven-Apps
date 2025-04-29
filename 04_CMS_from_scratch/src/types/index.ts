import { ThemeMode } from "../store/slices/settingsSlice";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// Common CMS Entity Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  authorId: string;
  metadata?: Record<string, unknown>;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  parentId: string | null;
  order: number;
  children?: MenuItem[];
}

export interface MediaFile extends BaseEntity {
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  alt?: string;
}

// App Configuration
export interface AppConfig {
  apiUrl: string;
  theme: ThemeMode;
  language: string;
  siteTitle: string;
  siteDescription?: string;
  perPage: number;
}

// State Related Types
export interface LoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}
