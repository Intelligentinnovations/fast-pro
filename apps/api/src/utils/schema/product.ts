import { z } from 'zod';

const ImageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean(),
});

const SpecificationSchema = z.object({
  title: z.string(),
  value: z.string(),
});

const VariantSchema = z.object({
  name: z.string(),
  quantity: z.number().int().min(0),
  price: z.string(),
});

export const AddProductSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  price: z.string(),
  quantity: z.number().nonnegative(),
  description: z.string(),
  images: z.array(ImageSchema).optional(),
  specifications: z.array(SpecificationSchema).optional(),
  variants: z.array(VariantSchema).optional(),
});
export type AddProductPayload = z.infer<typeof AddProductSchema>;
