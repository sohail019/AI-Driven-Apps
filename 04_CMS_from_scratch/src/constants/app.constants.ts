// App information
export const APP_NAME = "CMS System";
export const APP_VERSION = "1.0.0";
export const COPYRIGHT_YEAR = new Date().getFullYear();

// API endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // CMS Routes
  CMS: {
    PAGES: "/cms/pages",
    NEW_PAGE: "/cms/pages/new",
    EDIT_PAGE: (id: string) => `/cms/pages/${id}`,
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "cms_auth_token",
  USER: "cms_user",
  THEME: "cms_theme",
  LANGUAGE: "cms_language",
};

// Content status types
export const CONTENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  AUTHOR: "author",
  VIEWER: "viewer",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Unauthorized. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
};
