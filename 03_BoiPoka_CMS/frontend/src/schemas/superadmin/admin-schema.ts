import { z } from "zod";

export const CreateAdminSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  role: z.string().default("Admin"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accessTo: z.array(z.string()).optional(),
});

export const UpdateAdminSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  mobileNumber: z.string().optional(),
  // password: z.string().optional(),
  accessTo: z.array(z.string()).optional(),
});
