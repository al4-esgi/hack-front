export interface PaginationMeta {
  currentPage: number
  totalItemsCount: number
  totalPagesCount: number
  itemsPerPage: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export type SortDirection = 'ASC' | 'DESC'

export interface SortParams {
  sortBy?: string
  sortDirection?: SortDirection
}

export interface QueryParams extends PaginationParams, SortParams {}

export const DEFAULT_PAGE = 0
export const DEFAULT_PAGE_SIZE = 20
