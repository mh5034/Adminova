import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  category: z
    .string()
    .trim()
    .min(1, "Category is required"),

  price: z.coerce
    .number()
    .nonnegative("Price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),

  status: z.enum(["active", "inactive", "draft"]),

  image_url: z
    .string()
    .url("Invalid image URL")
    .nullable()
    .optional(),
})

export type ProductInput = z.infer<typeof productSchema>