import { IUser } from "./user.types";

export enum Role {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
}

export enum Permission {
  MANAGE_USERS = "manageUsers",
  MANAGE_BOOKS = "manageBooks",
  MANAGE_ADMINS = "manageAdmins",
  MANAGE_LIBRARIES = "manageLibraries",
  MANAGE_SHELVES = "manageShelves",
}

export interface IAccessControl {
  role: Role;
  permissions: Permission[];
}

export interface IUserWithRole extends IUser {
  _id: string;
  role: Role;
  permissions?: Permission[];
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  refreshToken?: string;
}

export interface IAdminCreateRequest {
  username: string;
  email: string;
  password: string;
  permissions: Permission[];
}

export interface IAdminUpdateRequest {
  permissions?: Permission[];
  isActive?: boolean;
}
