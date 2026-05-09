import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  specifications: z.string().trim().optional(),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  base_price: z.coerce.number().min(0),
  is_featured: z.coerce.boolean().optional()
});

export const materialSchema = z.object({
  name: z.string().trim().min(2),
  type: z.string().trim().optional(),
  size: z.string().trim().optional(),
  finish: z.string().trim().optional(),
  price_modifier: z.coerce.number().min(0),
  description: z.string().trim().optional()
});

export const productDesignSchema = z.object({
  service_id: z.string().uuid("Select a product."),
  title: z.string().trim().min(2),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  is_active: z.coerce.boolean().optional()
});
