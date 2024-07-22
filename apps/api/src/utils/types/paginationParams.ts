export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}


export interface PaginationParams {
  page: number;
  limit: number;
}
