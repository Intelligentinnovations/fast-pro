export interface Pagination {
  page: number;
  size: number;
  totalPages?: number;
  totalItems?: number;
}

export interface PaginatedData<T = unknown> {
  results: T[];
  pagination: Pagination;
}

