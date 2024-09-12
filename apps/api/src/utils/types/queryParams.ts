import { OrderStatus, ProcurementStatus } from './database';

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface QueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductFilters extends QueryParams {
  productCategoryNames?: string[];
  minPrice?: string;
  maxPrice?: string;
}

export interface ProcurementFilters extends QueryParams {
  status?: ProcurementStatus;
}

export interface OrderFilters extends QueryParams {
  status?: OrderStatus;
}
