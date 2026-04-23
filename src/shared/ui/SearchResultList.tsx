import { useCallback, useMemo } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { EmptyState, LoadingState, HotelCard, RestaurantCard } from '@/src/shared/ui'
import { useInfiniteSearch } from '@/src/hooks/useSearch'
import type { Hotel } from '@/src/types/hotel.type'
import type { Restaurant } from '@/src/types/restaurant.type'
import { colors, spacing } from '@/src/app/theme/tokens'

type SearchItem = { type: 'restaurant'; data: Restaurant } | { type: 'hotel'; data: Hotel }

function interleaveRandomly<T>(arr1: T[], arr2: T[]): T[] {
  const combined = [...arr1, ...arr2]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }
  return combined
}

interface SearchResultListProps {
  query: string
}

export function SearchResultList({ query }: SearchResultListProps) {
  const { t } = useTranslation('search')
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearch()

  const items: SearchItem[] = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) =>
      interleaveRandomly(
        page.restaurants.map((r) => ({ type: 'restaurant' as const, data: r })),
        page.hotels.map((h) => ({ type: 'hotel' as const, data: h })),
      ),
    )
  }, [data])

  const renderItem = useCallback(({ item }: { item: SearchItem }) => {
    if (item.type === 'restaurant') {
      return <RestaurantCard restaurant={item.data} />
    }
    return <HotelCard hotel={item.data} />
  }, [])

  const keyExtractor = useCallback((item: SearchItem) => `${item.type}-${item.data.id}`, [])

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && data?.pages) {
      const lastPage = data.pages[data.pages.length - 1]
      if (lastPage.meta.currentPage < lastPage.meta.totalPagesCount) {
        fetchNextPage()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data])

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }, [isFetchingNextPage])

  const emptyLabel = query.trim() ? t('noResults') : t('empty')

  if (isLoading) {
    return <LoadingState label={t('loading')} />
  }

  if (items.length === 0) {
    return <EmptyState title={emptyLabel} />
  }

return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      onEndReached={handleEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={renderFooter}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    gap: spacing[3],
  },
  footer: {
    paddingVertical: spacing[5],
    alignItems: 'center',
  },
})