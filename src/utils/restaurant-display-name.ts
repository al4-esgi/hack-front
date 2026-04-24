import type { Restaurant } from '@/src/types/restaurant.type'

function toTitleCaseFromSlug(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getNameFromSourceUrl(sourceUrl: string | null | undefined) {
  if (!sourceUrl) {
    return null
  }

  const parts = sourceUrl.split('/').filter(Boolean)
  const slug = parts[parts.length - 1]
  if (!slug) {
    return null
  }

  return toTitleCaseFromSlug(slug)
}

export function resolveRestaurantDisplayName(restaurant: Pick<Restaurant, 'name' | 'address' | 'sourceUrl'>) {
  const fallbackName = restaurant.name?.trim()
  const fallbackAddressName = restaurant.address?.split(',')[0]?.trim()
  const sourceName = getNameFromSourceUrl(restaurant.sourceUrl)
  const normalizedAddress = restaurant.address?.toLowerCase().trim()
  const normalizedName = fallbackName?.toLowerCase()

  const nameLooksLikeAddress =
    Boolean(fallbackName) &&
    ((Boolean(normalizedAddress && normalizedName && normalizedAddress.startsWith(normalizedName)) &&
      fallbackName.length > 12) ||
      /^[0-9]+\b/.test(fallbackName) ||
      /,\s*\d{4,5}\b/.test(fallbackName))

  if (!nameLooksLikeAddress && fallbackName) {
    return fallbackName
  }

  return sourceName ?? fallbackName ?? fallbackAddressName ?? 'Restaurant'
}
