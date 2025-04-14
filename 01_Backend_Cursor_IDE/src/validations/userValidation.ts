import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must not exceed 30 characters"),
    email: z.string().email("Invalid email format"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password must not exceed 50 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password must not exceed 50 characters"),
  }),
  params: z.object({
    token: z.string().min(1, "Reset token is required"),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});
