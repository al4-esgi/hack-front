import { create } from 'zustand'
import type { AwardCode, GetRestaurantsParams, RestaurantSortBy } from '../types/restaurant'
import type { SortDirection } from '../types/pagination'

interface RestaurantsState {
  params: GetRestaurantsParams
  setParams: (params: Partial<GetRestaurantsParams>) => void
  setSearch: (search: string) => void
  setCountry: (countryId: number | undefined) => void
  setCity: (cityId: number | undefined) => void
  setCuisines: (cuisineIds: number[]) => void
  setFacilities: (facilityIds: number[]) => void
  setAward: (awardCode: AwardCode | undefined) => void
  setStars: (min?: number, max?: number) => void
  setPriceLevel: (min?: number, max?: number) => void
  setGreenStar: (greenStar: boolean | undefined) => void
  setSort: (sortBy?: RestaurantSortBy, sortDirection?: SortDirection) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  clearFilters: () => void
}

const defaultParams: GetRestaurantsParams = {
  page: 0,
  pageSize: 20,
  sortBy: 'name',
  sortDirection: 'ASC',
}

export const useRestaurantStore = create<RestaurantsState>((set) => ({
  params: { ...defaultParams },

  setParams: (newParams) =>
    set((state) => ({
      params: { ...state.params, ...newParams, page: 0 },
    })),

  setSearch: (search) =>
    set((state) => ({
      params: { ...state.params, search, page: 0 },
    })),

  setCountry: (countryId) =>
    set((state) => ({
      params: { ...state.params, countryId, page: 0 },
    })),

  setCity: (cityId) =>
    set((state) => ({
      params: { ...state.params, cityId, page: 0 },
    })),

  setCuisines: (cuisineIds) =>
    set((state) => ({
      params: { ...state.params, cuisineIds, page: 0 },
    })),

  setFacilities: (facilityIds) =>
    set((state) => ({
      params: { ...state.params, facilityIds, page: 0 },
    })),

  setAward: (awardCode) =>
    set((state) => ({
      params: { ...state.params, awardCode, page: 0 },
    })),

  setStars: (minStars, maxStars) =>
    set((state) => ({
      params: { ...state.params, minStars, maxStars, page: 0 },
    })),

  setPriceLevel: (minPriceLevel, maxPriceLevel) =>
    set((state) => ({
      params: { ...state.params, minPriceLevel, maxPriceLevel, page: 0 },
    })),

  setGreenStar: (greenStar) =>
    set((state) => ({
      params: { ...state.params, greenStar, page: 0 },
    })),

  setSort: (sortBy, sortDirection) =>
    set((state) => ({
      params: {
        ...state.params,
        sortBy,
        sortDirection,
        page: 0,
      },
    })),

  setPage: (page) =>
    set((state) => ({
      params: { ...state.params, page },
    })),

  setPageSize: (pageSize) =>
    set((state) => ({
      params: { ...state.params, pageSize, page: 0 },
    })),

  clearFilters: () =>
    set(() => ({
      params: { ...defaultParams },
    })),
}))
