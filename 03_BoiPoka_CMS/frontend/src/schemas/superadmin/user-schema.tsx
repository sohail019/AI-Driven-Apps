import { z } from "zod";

export const UpdateUserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  mobileNumber: z.string().optional(),
});