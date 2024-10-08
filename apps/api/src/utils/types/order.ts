import { OrderStatus } from './database';

interface IOrder {
  productId: string;
  variantId?: string | null;
  productName: string;
  productImage: string;
  vendorName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface CreateOrderPayload {
  procurementId: string;
  organizationId: string;
  vendorId: string;
  organizationName: string;
  amount: string;
  itemDetails: string;
  requestedBy: string;
  requiredDate: Date;
  orderItems: IOrder[];
}

export interface UpdateOrderPayload {
  status: OrderStatus;
}
