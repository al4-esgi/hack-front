import apiClient from '../axios'
import type {
  CityFilter,
  CountryFilter,
  GetSearchParams,
  SearchResponse,
} from '../../types/search.type'

export class SearchApi {
  async getSearch(params: GetSearchParams): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/api/v1/search', {
      params: {
        ...params,
      },
    })
    return response.data
  }

  async getCountries(q?: string, limit?: number): Promise<CountryFilter[]> {
    return (
      await apiClient.get<CountryFilter[]>('/api/v1/search/filters/countries', {
        params: { q, limit },
      })
    ).data
  }

  async getCities(q?: string, limit?: number, countryId?: number): Promise<CityFilter[]> {
    return (
      await apiClient.get<CityFilter[]>('/api/v1/search/filters/cities', {
        params: { q, limit, countryId },
      })
    ).data
  }
}

export const searchApi = new SearchApi()
