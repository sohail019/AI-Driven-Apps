import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmNewPassword: z
    .string()
    .min(8, "Confirm new password must be at least 8 characters"),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
});






