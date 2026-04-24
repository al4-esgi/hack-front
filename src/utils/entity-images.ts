const DEFAULT_IMAGE_KEYS = [
  'firstImageUrl',
  'first_image_url',
  'images',
  'imageUrls',
  'imageUrl',
  'image',
  'coverImageUrl',
  'displayUrl',
  'photos',
  'gallery',
  'slideshowImages',
] as const
const IMAGE_OBJECT_KEYS = ['url', 'src', 'imageUrl', 'displayUrl', 'originalUrl', 'mainImageUrl'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function pushImageUrl(value: unknown, collector: string[]) {
  if (typeof value !== 'string') {
    return
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return
  }

  collector.push(trimmed)
}

function pushFromUnknown(value: unknown, collector: string[]) {
  if (typeof value === 'string') {
    pushImageUrl(value, collector)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => pushFromUnknown(item, collector))
    return
  }

  if (!isRecord(value)) {
    return
  }

  IMAGE_OBJECT_KEYS.forEach((key) => {
    pushImageUrl(value[key], collector)
  })
}

export function extractImageUrls(
  entity: unknown,
  customKeys: string[] = [],
): string[] {
  if (!isRecord(entity)) {
    return []
  }

  const collected: string[] = []

  // Keep main image first when available.
  pushImageUrl(entity.mainImageUrl, collected)

  const keys = [...DEFAULT_IMAGE_KEYS, ...customKeys]
  keys.forEach((key) => {
    pushFromUnknown(entity[key], collected)
  })

  return [...new Set(collected)]
}
