import { create } from 'zustand'
import type { SortDirection } from '../types/pagination.type'
import { GetSearchParams, SearchSortBy, SearchType } from '../types/search.type'
import { AwardCode, PriceLevel } from '../types/restaurant.type'

interface SearchState {
  params: GetSearchParams
  setParams: (params: Partial<GetSearchParams>) => void
  setSearch: (search: string) => void
  setTypes: (types: SearchType[]) => void
  setCountry: (countryId: number | undefined) => void
  setCity: (cityId: number | undefined) => void
  setGeo: (lat: number, lng: number, radiusKm?: number) => void
  setCuisines: (cuisineIds: number[]) => void
  setFacilities: (facilityIds: number[]) => void
  setAmenities: (amenityIds: number[]) => void
  setAward: (awardCode: AwardCode | undefined) => void
  setStars: (min?: number, max?: number) => void
  setPriceLevel: (min?: PriceLevel, max?: PriceLevel) => void
  setGreenStar: (greenStar: boolean | undefined) => void
  setSustainableHotel: (sustainable: boolean) => void
  setBookable: (bookable: boolean) => void
  setPlus: (isPlus: boolean) => void
  setDistinction: (distinction: string) => void
  setSort: (sortBy?: SearchSortBy, sortDirection?: SortDirection) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  clearFilters: () => void
}

const defaultParams: GetSearchParams = {
  page: 1,
  pageSize: 20,
  sortBy: 'name',
  sortDirection: 'ASC',
}

export const useSearchStore = create<SearchState>((set) => ({
  params: { ...defaultParams },

  setParams: (newParams) =>
    set((state) => ({
      params: { ...state.params, ...newParams, page: 1 },
    })),

  setSearch: (search) =>
    set((state) => ({
      params: { ...state.params, search, page: 1 },
    })),

  setTypes: (types) =>
    set((state) => ({
      params: { ...state.params, types, page: 1 },
    })),

  setCountry: (countryId) =>
    set((state) => ({
      params: { ...state.params, countryId, cityId: undefined, page: 1 },
    })),

  setCity: (cityId) =>
    set((state) => ({
      params: { ...state.params, cityId, page: 1 },
    })),

  setGeo: (lat, lng, radiusKm) =>
    set((state) => ({
      params: { ...state.params, lat, lng, radiusKm, page: 1 },
    })),

  setCuisines: (cuisineIds) =>
    set((state) => ({
      params: { ...state.params, cuisineIds, page: 1 },
    })),

  setFacilities: (facilityIds) =>
    set((state) => ({
      params: { ...state.params, facilityIds, page: 1 },
    })),

  setAmenities: (amenityIds) =>
    set((state) => ({
      params: { ...state.params, amenityIds, page: 1 },
    })),

  setAward: (awardCode) =>
    set((state) => ({
      params: { ...state.params, awardCode, page: 1 },
    })),

  setStars: (minStars, maxStars) =>
    set((state) => ({
      params: { ...state.params, minStars, maxStars, page: 1 },
    })),

  setPriceLevel: (minPriceLevel, maxPriceLevel) =>
    set((state) => ({
      params: { ...state.params, minPriceLevel, maxPriceLevel, page: 1 },
    })),

  setGreenStar: (greenStar) =>
    set((state) => ({
      params: { ...state.params, greenStar, page: 1 },
    })),

  setSustainableHotel: (sustainableHotel) =>
    set((state) => ({
      params: { ...state.params, sustainableHotel, page: 1 },
    })),

  setBookable: (bookable) =>
    set((state) => ({
      params: { ...state.params, bookable, page: 1 },
    })),

  setPlus: (isPlus) =>
    set((state) => ({
      params: { ...state.params, isPlus, page: 1 },
    })),

  setDistinction: (distinction) =>
    set((state) => ({
      params: { ...state.params, distinction, page: 1 },
    })),

  setSort: (sortBy, sortDirection) =>
    set((state) => ({
      params: {
        ...state.params,
        sortBy,
        sortDirection,
        page: 1,
      },
    })),

  setPage: (page) =>
    set((state) => ({
      params: { ...state.params, page },
    })),

  setPageSize: (pageSize) =>
    set((state) => ({
      params: { ...state.params, pageSize, page: 1 },
    })),

  clearFilters: () =>
    set(() => ({
      params: { ...defaultParams },
    })),
}))
