export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  vendorName: string;
  images: { imageUrl: string; isPrimary: boolean }[];
  specifications: { name: string; value: string }[];
  variants: { id: string; name: string; price: number, quantity: number }[];
}
