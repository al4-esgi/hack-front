import type { PaginationMeta } from '../../types/pagination'
import type {
  Restaurant,
  RestaurantDetail,
  CountryFilter,
  CityFilter,
  CuisineFilter,
  FacilityFilter,
} from '../../types/restaurant'

export interface RestaurantsResponse {
  restaurants: Restaurant[]
  meta: PaginationMeta
}

export interface CountriesFilterResponse {
  countries: CountryFilter[]
}

export interface CitiesFilterResponse {
  cities: CityFilter[]
}

export interface CuisinesFilterResponse {
  cuisines: CuisineFilter[]
}

export interface FacilitiesFilterResponse {
  facilities: FacilityFilter[]
}

export interface RestaurantDetailResponse {
  restaurant: RestaurantDetail
}
