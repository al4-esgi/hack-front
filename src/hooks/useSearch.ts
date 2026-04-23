import { useQuery } from '@tanstack/react-query'
import { StaleTimes } from '../constants/query.constant'
import { searchApi } from '../api/search'
import { useSearchStore } from '../stores/search.store'

export function useSearch() {
  const params = useSearchStore((state) => state.params)

  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchApi.getSearch(params),
    staleTime: StaleTimes.FIVE_MINUTES,
  })
}

export function useCountries(q?: string, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['search', 'filters', 'countries', q, limit],
    queryFn: () => searchApi.getCountries(q, limit),
    enabled,
    staleTime: StaleTimes.THIRTY_MINUTES,
  })
}

export function useCities(q?: string, limit?: number, countryId?: number, enabled = true) {
  return useQuery({
    queryKey: ['search', 'filters', 'cities', q, limit, countryId],
    queryFn: () => searchApi.getCities(q, limit, countryId),
    enabled,
    staleTime: StaleTimes.THIRTY_MINUTES,
  })
}
