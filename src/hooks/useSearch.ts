import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../api/search'
import { useSearchStore } from '../stores/search.store'

export function useSearch() {
  const params = useSearchStore((state) => state.params)

  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchApi.getSearch(params),
  })
}

export function useCountries(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['search', 'filters', 'countries', q, limit],
    queryFn: () => searchApi.getCountries(q, limit),
    enabled,
    select: (data) => data,
  })
}

export function useCities(q?: string, limit?: number, countryId?: number, enabled = true) {
  return useQuery({
    queryKey: ['search', 'filters', 'cities', q, limit, countryId],
    queryFn: () => searchApi.getCities(q, limit, countryId),
    enabled,
    select: (data) => data,
  })
}
