import { ItemStatus } from './database';

export interface CartItems {
  id: string;
  productId: string;
  quantity: number;
  variantId: string | null;
  productName: string;
  productImage: string;
  remainingStock: number | null;
  price: number;
  total: number;
  vendorName: string;
}

export interface UpdateProcurementItem {
  id: string;
  status: ItemStatus;
  comment?: string;
}
