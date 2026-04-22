import apiClient from '../axios'
import type { GetRestaurantsParams } from '../../types/restaurant'
import type {
  RestaurantsResponse,
  CountriesFilterResponse,
  CitiesFilterResponse,
  CuisinesFilterResponse,
  FacilitiesFilterResponse,
  RestaurantDetailResponse,
} from './types'

export class RestaurantApi {
  async getRestaurants(params: GetRestaurantsParams): Promise<RestaurantsResponse> {
    const response = await apiClient.get<RestaurantsResponse>('/api/v1/restaurants', {
      params: {
        ...params,
        cuisineIds: params.cuisineIds?.join(','),
        facilityIds: params.facilityIds?.join(','),
      },
    })
    return response.data
  }

  async getCountries(q?: string, limit?: number): Promise<CountriesFilterResponse> {
    return (
      await apiClient.get<CountriesFilterResponse>('/api/v1/restaurants/filters/countries', {
        params: { q, limit },
      })
    ).data
  }

  async getCities(q?: string, limit?: number, countryId?: number): Promise<CitiesFilterResponse> {
    return (
      await apiClient.get<CitiesFilterResponse>('/api/v1/restaurants/filters/cities', {
        params: { q, limit, countryId },
      })
    ).data
  }

  async getCuisines(q?: string, limit?: number): Promise<CuisinesFilterResponse> {
    return (
      await apiClient.get<CuisinesFilterResponse>('/api/v1/restaurants/filters/cuisines', {
        params: { q, limit },
      })
    ).data
  }

  async getFacilities(q?: string, limit?: number): Promise<FacilitiesFilterResponse> {
    return (
      await apiClient.get<FacilitiesFilterResponse>('/api/v1/restaurants/filters/facilities', {
        params: { q, limit },
      })
    ).data
  }

  async getById(restaurantId: number): Promise<RestaurantDetailResponse> {
    return (await apiClient.get<RestaurantDetailResponse>(`/api/v1/restaurants/${restaurantId}`))
      .data
  }
}

export const restaurantApi = new RestaurantApi()
