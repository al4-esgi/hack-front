export enum AwardCode {
  MichelinStar = 'MICHELIN_STAR',
  BibGourmand = 'BIB_GOURMAND',
  Selected = 'SELECTED',
}

export enum PriceLevel {
  Cheap = 1,
  Moderate = 2,
  Expensive = 3,
  VeryExpensive = 4,
}

export interface CuisineFilter {
  id: number
  name: string
}

export interface FacilityFilter {
  id: number
  name: string
}

export interface RestaurantDetail extends Restaurant {
  cityId: number
  countryId: number
}

export interface Restaurant {
  id: number
  name: string
  address: string
  description: string | null
  sourceUrl: string
  websiteUrl: string | null
  latitude: string
  longitude: string
  phoneNumber: string | null
  createdAt: string
  city: string
  country: string
  awardCode: AwardCode
  stars: number
  hasGreenStar: boolean
  cuisines: string[]
  facilities: string[]
  priceLevel: PriceLevel
}
