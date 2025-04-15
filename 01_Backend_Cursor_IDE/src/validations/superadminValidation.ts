import { z } from "zod";

export const registerSuperAdminSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  }),
});

export const loginSuperAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});
