import React, { useCallback, useRef, useState } from 'react'
import { FlatList, StyleSheet, View, type ViewToken } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRestaurantById, type RestaurantDetails } from '@/src/api/restaurants.api'
import { getCurrentUser, getUserListItemsByName, type UserListItem } from '@/src/api/users.api'
import { colors } from '@/src/app/theme/tokens'
import { StaleTimes } from '@/src/constants/query.constant'
import { AppRoutes } from '@/src/constants/routes.constant'
import type { RootStackParamList } from '@/src/navigation/navigation.types'
import { useAuthStore } from '@/src/stores/auth.store'
import { AwardCode, PriceLevel, type Restaurant } from '@/src/types/restaurant.type'
import { EmptyState, ErrorState, LoadingState, PageHeader, RestaurantCard, Screen } from '@/src/shared/ui'

type SavedScreenProps = {
  isAuthenticated: boolean
  onRequestLogin: () => void
}
type RootNavigation = NativeStackNavigationProp<RootStackParamList>

function toAwardCode(details: RestaurantDetails | undefined): AwardCode {
  if (!details) {
    return AwardCode.Selected
  }

  if (details.distinctions.includes('star')) {
    return AwardCode.MichelinStar
  }
  if (details.distinctions.includes('bib')) {
    return AwardCode.BibGourmand
  }

  return AwardCode.Selected
}

function toPriceLevel(value: number | undefined): PriceLevel {
  if (value === 1 || value === 2 || value === 3 || value === 4) {
    return value
  }

  return PriceLevel.Moderate
}

function buildRestaurantCardModel(item: UserListItem, details: RestaurantDetails | undefined): Restaurant {
  return {
    id: Number(item.itemId),
    name: details?.name ?? item.name,
    images: details?.images ?? [],
    address: item.address ?? '',
    description: details?.description ?? null,
    sourceUrl: '',
    websiteUrl: null,
    latitude: '',
    longitude: '',
    phoneNumber: null,
    createdAt: item.addedAt ?? new Date().toISOString(),
    city: details?.city ?? item.city ?? item.country ?? 'Ville inconnue',
    country: item.country ?? '',
    awardCode: toAwardCode(details),
    stars: details?.distinctions.includes('star') ? 1 : null,
    hasGreenStar: details?.distinctions.includes('green-star') ?? false,
    cuisines: details?.cuisine ? [details.cuisine] : [],
    facilities: [],
    priceLevel: toPriceLevel(details?.priceLevel),
    distanceMeters: null,
  }
}

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 10 }

export default function SavedScreen({ isAuthenticated, onRequestLogin }: SavedScreenProps) {
  const navigation = useNavigation<RootNavigation>()
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()
  const inFlightDetails = useRef(new Set<string>())
  const failedDetails = useRef(new Set<string>())
  const [restaurantDetailsById, setRestaurantDetailsById] = useState<Record<string, RestaurantDetails>>({})

  const prefetchRestaurantDetails = useCallback(async (restaurantIds: string[]) => {
    const uniqueRestaurantIds = [...new Set(restaurantIds)]

    const tasks = uniqueRestaurantIds.map(async (restaurantId) => {
      if (inFlightDetails.current.has(restaurantId)) {
        return
      }
      if (failedDetails.current.has(restaurantId)) {
        return
      }

      const cachedDetail = queryClient.getQueryData<RestaurantDetails>(['restaurant-details', restaurantId])
      if (cachedDetail) {
        setRestaurantDetailsById((prev) => {
          if (prev[restaurantId]) {
            return prev
          }

          return { ...prev, [restaurantId]: cachedDetail }
        })
        return
      }

      inFlightDetails.current.add(restaurantId)

      try {
        const detail = await queryClient.fetchQuery({
          queryKey: ['restaurant-details', restaurantId],
          queryFn: () => getRestaurantById(restaurantId),
          staleTime: StaleTimes.FIVE_MINUTES,
        })

        setRestaurantDetailsById((prev) => {
          if (prev[restaurantId]) {
            return prev
          }

          return { ...prev, [restaurantId]: detail }
        })
      } catch {
        failedDetails.current.add(restaurantId)
        // If details are unavailable, we keep the card with base list data.
      } finally {
        inFlightDetails.current.delete(restaurantId)
      }
    })

    await Promise.all(tasks)
  }, [queryClient])

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: ['current-user', token],
    queryFn: getCurrentUser,
    enabled: isAuthenticated && Boolean(token),
    staleTime: StaleTimes.FIVE_MINUTES,
    refetchOnMount: 'always',
  })

  const {
    data: likedList,
    isLoading: isLikedLoading,
    isError: isLikedError,
    refetch: refetchLikedList,
  } = useQuery({
    queryKey: ['saved-liked-list', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'liked'),
    enabled: isAuthenticated && Boolean(token) && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
    refetchOnMount: 'always',
  })

  const likedRestaurants = (likedList?.items ?? []).filter((item) => item.itemType === 'restaurant')

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken<UserListItem>> }) => {
      const restaurants = likedRestaurants ?? []
      const restaurantIdsToPrefetch: string[] = []

      for (const viewableItem of viewableItems) {
        const current = viewableItem.item
        if (!current) {
          continue
        }

        restaurantIdsToPrefetch.push(current.itemId)

        if (typeof viewableItem.index === 'number') {
          const next = restaurants[viewableItem.index + 1]
          if (next) {
            restaurantIdsToPrefetch.push(next.id)
          }
        }
      }

      if (restaurantIdsToPrefetch.length > 0) {
        void prefetchRestaurantDetails(restaurantIdsToPrefetch)
      }
    },
    [likedRestaurants, prefetchRestaurantDetails],
  )

  if (!isAuthenticated) {
    return (
      <Screen scrollable>
        <PageHeader title="Saved" subtitle="Retrouve tes adresses mises de côté." />
        <EmptyState
          title="Connexion requise"
          description="Connecte-toi pour accéder à tes favoris."
          actionLabel="Se connecter"
          onAction={onRequestLogin}
        />
      </Screen>
    )
  }

  const isLoading = isCurrentUserLoading || isLikedLoading

  return (
    <Screen>
      <View style={styles.container}>
        <PageHeader title="Saved" subtitle="Tes restaurants favoris." />

        {isLoading ? <LoadingState label="Chargement des favoris..." /> : null}
        {isCurrentUserError ? (
          <ErrorState message="Impossible de charger ton profil." onRetry={() => void refetchCurrentUser()} />
        ) : null}
        {isLikedError ? (
          <ErrorState message="Impossible de charger la liste des favoris." onRetry={() => void refetchLikedList()} />
        ) : null}

        {!isLoading && !isCurrentUserError && !isLikedError ? (
          <FlatList
            data={likedRestaurants ?? []}
            keyExtractor={(item) => `${item.itemType}-${item.itemId}`}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            renderItem={({ item }) => {
              const details = restaurantDetailsById[item.itemId]
              const restaurant = buildRestaurantCardModel(item, details)

              return (
                <RestaurantCard
                  restaurant={restaurant}
                  onPress={() =>
                    navigation.navigate(AppRoutes.RESTAURANT_DETAILS, { restaurantId: restaurant.id })
                  }
                />
              )
            }}
            ListEmptyComponent={
              <EmptyState
                title="Aucun favori"
                description="Ajoute des restaurants à la liste liked pour les retrouver ici."
              />
            }
          />
        ) : null}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: colors.backgroundSubtle,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  separator: {
    height: 8,
  },
})
