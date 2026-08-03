// src/types/api.ts

/**
 * Base pagination parameters for list APIs
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

export interface PaginationParamsOld {
  sortBy?: string; //keyof T;
  pageSize?: number;
  currentPage?: number;
  count?: number;
}

/**
 * Generic pagination query param wrapper
 */
export type PaginationQueryParam<T = Record<string, any>> = PaginationParams & T;
export type PaginationQueryParamOld<T = Record<string, any>> = PaginationParamsOld & T;

/**
 * Base paginated response structure
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginationParamsOld {
  sortBy?: string; //keyof T;
  pageSize?: number;
  currentPage?: number;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages?: number;
}

/**
 * Default pagination values
 */
export const PAGINATION_DEFAULT_VALUE: PaginationParams = {
  page: 0,
  size: 10,
};

export const PAGINATION_DEFAULT_VALUE_OLD: PaginationParamsOld = {
  currentPage: 1,
  pageSize: 10,
};