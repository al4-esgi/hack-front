import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { StaleTimes } from '../constants/query.constant'
import { searchApi } from '../api/search'
import { useSearchStore } from '../stores/search.store'

export function useInfiniteSearch() {
  const params = useSearchStore((state) => state.params)
  const setPage = useSearchStore((state) => state.setPage)

  return useInfiniteQuery({
    queryKey: ['search', params],
    queryFn: ({ pageParam = 1 }) => searchApi.getSearch({ ...params, page: pageParam }),
    initialPageParam: 1,
    staleTime: StaleTimes.FIVE_MINUTES,
    getNextPageParam: (lastPage) => {
      const { currentPage, itemsPerPage, totalPagesCount } = lastPage.meta
      const hasMore = currentPage < totalPagesCount
      return hasMore ? currentPage + 1 : undefined
    },
  })
}

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