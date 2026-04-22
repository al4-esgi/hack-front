import type { QueryParams } from './pagination'

export enum AwardCode {
  MichelinStar = 'MICHELIN_STAR',
  BibGourmand = 'BIB_GOURMAND',
  Selected = 'SELECTED',
}

export enum PriceLevel {
  Cheap = 1,
  Moderate = 2,
  Expensive = 3,
  VeryExpensive = 4,
}

export type RestaurantSortBy = 'name' | 'price' | 'rating'

export interface CountryFilter {
  id: number
  name: string
}

export interface CityFilter {
  id: number
  name: string
}

export interface CuisineFilter {
  id: number
  name: string
}

export interface FacilityFilter {
  id: number
  name: string
}

export interface Restaurant {
  id: number
  name: string
  address: string
  description: string | null
  sourceUrl: string
  websiteUrl: string | null
  latitude: string
  longitude: string
  phoneNumber: string | null
  createdAt: string
  city: string
  country: string
  awardCode: AwardCode
  stars: number
  hasGreenStar: boolean
  cuisines: string[]
  facilities: string[]
  priceLevel: PriceLevel
}

export interface RestaurantDetail extends Restaurant {
  cityId: number
  countryId: number
}

export interface GetRestaurantsParams extends QueryParams {
  sortBy?: RestaurantSortBy
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
