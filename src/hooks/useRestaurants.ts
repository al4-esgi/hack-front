import { useQuery } from '@tanstack/react-query'
import { restaurantApi } from '../api/restaurants'

export function useCuisines(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'cuisines', q, limit],
    queryFn: () => restaurantApi.getCuisines(q, limit),
    enabled,
    select: (data) => data,
  })
}

export function useFacilities(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'facilities', q, limit],
    queryFn: () => restaurantApi.getFacilities(q, limit),
    enabled,
    select: (data) => data,
  })
}

export function useRestaurantDetail(restaurantId: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'restaurant', restaurantId],
    queryFn: () => restaurantApi.getById(restaurantId),
    enabled: enabled && !!restaurantId,
    select: (data) => data,
  })
}
