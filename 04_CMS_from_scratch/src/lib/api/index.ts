import type { User } from "./users";

// Import all user API functions directly
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "./users";

// Group them under userAPI for namespace organization
export const userAPI = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};

// Export the User type
export type { User };
