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
}

export interface ProductFilters extends QueryParams {
  productCategoryNames?: string[];
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
}
