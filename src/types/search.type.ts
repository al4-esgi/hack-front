import { Hotel } from './hotel.type'
import type { PaginationMeta, QueryParams } from './pagination.type'
import { AwardCode, PriceLevel, Restaurant } from './restaurant.type'

export type SearchSortBy = 'name' | 'createdAt' | 'distance' | 'stars'
export type SearchType = 'hotel' | 'restaurant'
export type SearchSortDirection = 'ASC' | 'DESC'

export interface CountryFilter {
  id: number
  name: string
}

export interface CityFilter {
  id: number
  name: string
}

export interface GetSearchParams extends QueryParams {
  // Pagination
  page?: number
  pageSize?: number
  sortBy?: SearchSortBy
  sortDirection?: SearchSortDirection
  
  // Type filter
  types?: SearchType[]
  
  // Text search
  search?: string
  
  // Location filters
  countryId?: number
  cityId?: number
  
  // Geo search
  lat?: number
  lng?: number
  radiusKm?: number
  
  // Hotel-only filters
  amenityIds?: number[]
  sustainableHotel?: boolean
  bookable?: boolean
  isPlus?: boolean
  distinction?: string
  
  // Restaurant-only filters
  cuisineIds?: number[]
  facilityIds?: number[]
  awardCode?: AwardCode
  minStars?: number
  maxStars?: number
  greenStar?: boolean
  minPriceLevel?: number
  maxPriceLevel?: PriceLevel
}

export interface SearchResponse {
  restaurants: Restaurant[]
  hotels: Hotel[]
  meta: PaginationMeta
}
