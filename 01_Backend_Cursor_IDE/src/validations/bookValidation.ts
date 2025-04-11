import { z } from "zod";

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    ISBN: z.string().min(10, "ISBN must be at least 10 characters"),
    quantity: z.number().int().min(0, "Quantity must be non-negative"),
    availableQuantity: z
      .number()
      .int()
      .min(0, "Available quantity must be non-negative"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    publishedYear: z
      .number()
      .int()
      .min(1000)
      .max(new Date().getFullYear())
      .optional(),
    status: z.enum(["available", "unavailable"]).default("available"),
  }),
});

export const updateBookSchema = createBookSchema.deepPartial();

export const bookIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid book ID"),
  }),
});
