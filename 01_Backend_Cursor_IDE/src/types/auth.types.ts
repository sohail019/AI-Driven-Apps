import { Document } from "mongoose";

/**
 * Interface for registration request data
 */
export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

/**
 * Interface for login request data
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for authentication response data
 */
export interface IAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    mobile: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Interface for password reset request
 */
export interface IPasswordResetRequest {
  email: string;
}

/**
 * Interface for password reset confirmation
 */
export interface IPasswordResetConfirm {
  token: string;
  newPassword: string;
}

/**
 * Interface for email verification response
 */
export interface IEmailVerificationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
}

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

export interface ISuccessResponse<T> {
  status: "success";
  data: T;
}
