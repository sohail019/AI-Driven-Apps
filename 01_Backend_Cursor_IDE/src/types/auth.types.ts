/**
 * Interface for registration request data
 */
export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
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
    isVerified: boolean;
    createdAt: Date;
  };
  token: string;
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
  success: boolean;
  message: string;
}
