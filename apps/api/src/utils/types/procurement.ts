export interface CartItems {
  id: string;
  productId: string;
  quantity: number;
  variantId: string | null;
  productName: string;
  remainingStock: number | null;
  price: number;
  total: number;
  imageUrl: string | null;
  vendorName: string;
}
