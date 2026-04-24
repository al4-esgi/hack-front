import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import {
  addItemToUserList,
  getCurrentUser,
  getUserListItemsByName,
  ListMutationRouteNotFoundError,
  type ListItemType,
  UserListNotFoundError,
  removeItemFromUserList,
} from '@/src/api/users.api'
import { colors, spacing } from '@/src/app/theme/tokens'
import { StaleTimes } from '@/src/constants/query.constant'
import { AppRoutes } from '@/src/constants/routes.constant'
import { useInfiniteSearch } from '@/src/hooks/useSearch'
import type { RootStackParamList } from '@/src/navigation/navigation.types'
import type { Hotel } from '@/src/types/hotel.type'
import type { Restaurant } from '@/src/types/restaurant.type'
import { useQuery } from '@tanstack/react-query'
import { Text } from '@/components/ui/text'
import { EmptyState } from './EmptyState'
import { HotelCard } from './HotelCard'
import { LoadingState } from './LoadingState'
import { RestaurantCard } from './RestaurantCard'

type SearchItem = { type: 'restaurant'; data: Restaurant } | { type: 'hotel'; data: Hotel }
type RootNavigation = NativeStackNavigationProp<RootStackParamList>
type QuickListName = 'liked' | 'visited'

function interleaveRandomly<T, U>(arr1: T[], arr2: U[]): Array<T | U> {
  const combined: Array<T | U> = [...arr1, ...arr2]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }
  return combined
}

interface SearchResultListProps {
  query: string
  onLoadingChange?: (loading: boolean) => void
  isAuthenticated: boolean
  onRequestLogin: () => void
}

export function SearchResultList({
  query,
  onLoadingChange,
  isAuthenticated,
  onRequestLogin,
}: SearchResultListProps) {
  const navigation = useNavigation<RootNavigation>()
  const { t } = useTranslation('search')
  const [listActionError, setListActionError] = useState<string | null>(null)
  const [pendingListActions, setPendingListActions] = useState<Record<string, boolean>>({})

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSearch()

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
  } = useQuery({
    queryKey: ['current-user', 'search-lists'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: StaleTimes.FIVE_MINUTES,
  })

  const {
    data: likedList,
    isLoading: isLikedLoading,
    refetch: refetchLiked,
  } = useQuery({
    queryKey: ['search-list-liked', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'liked'),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const {
    data: visitedList,
    isLoading: isVisitedLoading,
    refetch: refetchVisited,
  } = useQuery({
    queryKey: ['search-list-visited', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'visited'),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  const items: SearchItem[] = useMemo(() => {
    if (!data?.pages) {
      return []
    }

    return data.pages.flatMap((page) =>
      interleaveRandomly(
        page.restaurants.map((restaurant) => ({ type: 'restaurant' as const, data: restaurant })),
        page.hotels.map((hotel) => ({ type: 'hotel' as const, data: hotel })),
      ),
    )
  }, [data])

  const likedItemKeys = useMemo(
    () =>
      new Set(
        (likedList?.items ?? []).map((item) => `${item.itemType}:${item.itemId}`),
      ),
    [likedList],
  )
  const visitedItemKeys = useMemo(
    () =>
      new Set(
        (visitedList?.items ?? []).map((item) => `${item.itemType}:${item.itemId}`),
      ),
    [visitedList],
  )

  const isListStateLoading = isCurrentUserLoading || isLikedLoading || isVisitedLoading

  const setPending = (placeId: number, itemType: ListItemType, listName: QuickListName, isPending: boolean) => {
    const key = `${listName}-${itemType}-${placeId}`
    setPendingListActions((current) => {
      if (isPending) {
        return { ...current, [key]: true }
      }

      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const isPending = (placeId: number, itemType: ListItemType, listName: QuickListName) =>
    pendingListActions[`${listName}-${itemType}-${placeId}`] === true

  async function handleToggleQuickList(
    placeId: number,
    itemType: ListItemType,
    itemName: string,
    listName: QuickListName,
    alreadyInList: boolean,
  ) {
    if (!isAuthenticated) {
      onRequestLogin()
      return
    }

    if (!currentUser?.id) {
      return
    }

    setPending(placeId, itemType, listName, true)
    setListActionError(null)

    try {
      if (alreadyInList) {
        await removeItemFromUserList(currentUser.id, { listName }, { itemType, itemId: placeId })
      } else {
        await addItemToUserList(currentUser.id, { listName }, { itemType, itemId: placeId, name: itemName })
      }

      if (listName === 'liked') {
        await refetchLiked()
      } else {
        await refetchVisited()
      }
    } catch (error) {
      if (error instanceof ListMutationRouteNotFoundError) {
        setListActionError('Ajout rapide indisponible: endpoint API liste-item non trouvé.')
      } else if (error instanceof UserListNotFoundError) {
        setListActionError('La liste demandée est introuvable.')
      } else {
        setListActionError('Impossible de mettre à jour la liste pour le moment.')
      }
    } finally {
      setPending(placeId, itemType, listName, false)
    }
  }

  const renderItem = ({ item }: { item: SearchItem }) => {
    if (item.type === 'hotel') {
      const hotelId = item.data.id
      const membershipKey = `hotel:${hotelId}`
      const isFavorite = likedItemKeys.has(membershipKey)
      const isVisited = visitedItemKeys.has(membershipKey)
      const actionDisabled =
        isListStateLoading || isPending(hotelId, 'hotel', 'liked') || isPending(hotelId, 'hotel', 'visited')

      return (
        <HotelCard
          hotel={item.data}
          isFavorite={isFavorite}
          isVisited={isVisited}
          actionDisabled={actionDisabled}
          onToggleFavorite={() => void handleToggleQuickList(hotelId, 'hotel', item.data.name, 'liked', isFavorite)}
          onToggleVisited={() => void handleToggleQuickList(hotelId, 'hotel', item.data.name, 'visited', isVisited)}
          onPress={() => navigation.navigate(AppRoutes.HOTEL_DETAILS, { hotelId })}
        />
      )
    }

    const restaurantId = item.data.id
    const membershipKey = `restaurant:${restaurantId}`
    const isFavorite = likedItemKeys.has(membershipKey)
    const isVisited = visitedItemKeys.has(membershipKey)
    const actionDisabled =
      isListStateLoading ||
      isPending(restaurantId, 'restaurant', 'liked') ||
      isPending(restaurantId, 'restaurant', 'visited')

    return (
      <RestaurantCard
        restaurant={item.data}
        isFavorite={isFavorite}
        isVisited={isVisited}
        actionDisabled={actionDisabled}
        onToggleFavorite={() => void handleToggleQuickList(restaurantId, 'restaurant', item.data.name, 'liked', isFavorite)}
        onToggleVisited={() => void handleToggleQuickList(restaurantId, 'restaurant', item.data.name, 'visited', isVisited)}
        onPress={() => navigation.navigate(AppRoutes.RESTAURANT_DETAILS, { restaurantId })}
      />
    )
  }

  const keyExtractor = (item: SearchItem) => `${item.type}-${item.data.id}`

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && data?.pages) {
      const lastPage = data.pages[data.pages.length - 1]
      if (lastPage.meta.currentPage < lastPage.meta.totalPagesCount) {
        fetchNextPage()
      }
    }
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }

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
      ListHeaderComponent={
        listActionError ? (
          <View style={styles.listActionError}>
            <Text style={styles.listActionErrorText}>{listActionError}</Text>
          </View>
        ) : null
      }
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
  listActionError: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: 'rgba(189, 35, 51, 0.06)',
    padding: 10,
  },
  listActionErrorText: {
    color: colors.primary,
    fontSize: 12,
  },
})
