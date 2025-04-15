import { z } from "zod";
import { Role, Permission } from "../types/rbac.types";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const createAdminSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number format"),
    role: z.enum([Role.ADMIN, Role.SUPERADMIN]),
    permissions: z.array(
      z.enum(Object.values(Permission) as [Permission, ...Permission[]])
    ),
  }),
});

export const adminValidation = {
  createAdmin: z.object({
    body: z.object({
      username: z.string().min(3).max(50),
      email: z.string().email(),
      password: z.string().min(8),
      permissions: z.array(
        z.enum(Object.values(Permission) as [Permission, ...Permission[]])
      ),
    }),
  }),

  updateAdmin: z.object({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      permissions: z
        .array(
          z.enum(Object.values(Permission) as [Permission, ...Permission[]])
        )
        .optional(),
      isActive: z.boolean().optional(),
    }),
  }),
};
