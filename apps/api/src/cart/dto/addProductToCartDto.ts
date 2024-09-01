import { z } from 'zod';

export const AddProductToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().nonnegative().min(1),
});
export type AddProductToCartPayload = z.infer<typeof AddProductToCartSchema>;

export const UpdateProductToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().nonnegative().min(1),
});
export type UpdateProductToCartPayload = z.infer<
  typeof UpdateProductToCartSchema
>;
