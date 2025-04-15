import { z } from "zod";

export const shelfValidation = {
  createShelfSchema: z.object({
    name: z.string().min(1, "Shelf name is required"),
    description: z.string().optional(),
    libraryId: z.string().min(1, "Library ID is required"),
  }),

  updateShelfSchema: z.object({
    name: z.string().min(1, "Shelf name is required").optional(),
    description: z.string().optional(),
  }),
};
