import { CuisineFilter, FacilityFilter, RestaurantDetail } from '@/src/types/restaurant.type'
import apiClient from '../axios'

export class RestaurantApi {
  async getCuisines(q?: string, limit?: number): Promise<CuisineFilter[]> {
    return (
      await apiClient.get<CuisineFilter[]>('/api/v1/restaurants/filters/cuisines', {
        params: { q, limit },
      })
    ).data
  }

  async getFacilities(q?: string, limit?: number): Promise<FacilityFilter[]> {
    return (
      await apiClient.get<FacilityFilter[]>('/api/v1/restaurants/filters/facilities', {
        params: { q, limit },
      })
    ).data
  }

  async getById(restaurantId: number): Promise<RestaurantDetail> {
    return (await apiClient.get<RestaurantDetail>(`/api/v1/restaurants/${restaurantId}`)).data
  }
}

export const restaurantApi = new RestaurantApi()
