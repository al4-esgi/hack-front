import { Hotel } from './hotel.type'
import type { PaginationMeta, QueryParams } from './pagination.type'
import { AwardCode, Restaurant } from './restaurant.type'

export type SearchSortBy = 'name' | 'createdAt' | 'distance' | 'stars'

export interface CountryFilter {
  id: number
  name: string
}

export interface CityFilter {
  id: number
  name: string
}

export interface GetSearchParams extends QueryParams {
  sortBy?: SearchSortBy
  search?: string
  countryId?: number
  cityId?: number
  cuisineIds?: number[]
  facilityIds?: number[]
  awardCode?: AwardCode
  minStars?: number
  maxStars?: number
  greenStar?: boolean
  minPriceLevel?: number
  maxPriceLevel?: number
}

export interface SearchResponse {
  restaurants: Restaurant[]
  hotels: Hotel[]
  meta: PaginationMeta
}
