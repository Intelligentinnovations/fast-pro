export interface ProductDetails {
  id: string
  name: string;
  description: string
  price: number
  vendorName: string;
  images: string [];
  specifications: { name: string; value: string }[];
  variants: { id: string; name: string; price: number }[];
}