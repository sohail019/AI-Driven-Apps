import { Role, Permission } from "./rbac.types";

export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IAdminResponse {
  id: string;
  username: string;
  email: string;
  mobile: string;
  role: Role;
  permissions: Permission[];
}

export interface IAdminAuthResponse {
  admin: IAdminResponse;
  accessToken: string;
  refreshToken: string;
}

export interface IAdminRefreshTokenRequest {
  refreshToken: string;
}

export interface IAdminAuthenticatedRequest {
  id: string;
  role: Role;
  permissions: Permission[];
}
