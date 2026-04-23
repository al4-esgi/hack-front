export type Distinction = '1_KEY' | '2_KEY' | '3_KEY'

export type Hotel = {
  id: number
  name: string
  address: string
  content: string
  canonicalUrl: string
  mainImageUrl: string
  lat: string
  lng: string
  phone: string
  city: string
  country: string
  createdAt: string
  distinctions: Distinction
  isPlus: boolean
  sustainableHotel: boolean
  bookable: boolean
  amenities: string[]
  distanceMeters: number | null
}
