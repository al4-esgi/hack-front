import { useQuery } from '@tanstack/react-query'
import { restaurantApi } from '../api/restaurants'
import { useRestaurantStore } from '../stores/restaurant.store'

export function useRestaurants() {
  const params = useRestaurantStore((state) => state.params)

  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantApi.getRestaurants(params),
  })
}

export function useCountries(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'countries', q, limit],
    queryFn: () => restaurantApi.getCountries(q, limit),
    enabled,
    select: (data) => data.countries,
  })
}

export function useCities(q?: string, limit?: number, countryId?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'cities', q, limit, countryId],
    queryFn: () => restaurantApi.getCities(q, limit, countryId),
    enabled,
    select: (data) => data.cities,
  })
}

export function useCuisines(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'cuisines', q, limit],
    queryFn: () => restaurantApi.getCuisines(q, limit),
    enabled,
    select: (data) => data.cuisines,
  })
}

export function useFacilities(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'filters', 'facilities', q, limit],
    queryFn: () => restaurantApi.getFacilities(q, limit),
    enabled,
    select: (data) => data.facilities,
  })
}

export function useRestaurantDetail(restaurantId: number, enabled = true) {
  return useQuery({
    queryKey: ['restaurants', 'restaurant', restaurantId],
    queryFn: () => restaurantApi.getById(restaurantId),
    enabled: enabled && !!restaurantId,
    select: (data) => data.restaurant,
  })
}
