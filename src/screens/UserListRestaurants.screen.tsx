import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, View, type ViewToken } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Text } from '@/components/ui/text'
import { hotelApi } from '@/src/api/hotels'
import { getRestaurantById, type RestaurantDetails } from '@/src/api/restaurants.api'
import { getUserListItemsById, type UserListItem } from '@/src/api/users.api'
import { colors, radius } from '@/src/app/theme/tokens'
import { StaleTimes } from '@/src/constants/query.constant'
import { AppRoutes } from '@/src/constants/routes.constant'
import type { RootStackParamList } from '@/src/navigation/navigation.types'
import type { HotelDetail, Hotel } from '@/src/types/hotel.type'
import { AwardCode, PriceLevel, type Restaurant } from '@/src/types/restaurant.type'
import { EmptyState, ErrorState, HotelCard, LoadingState, RestaurantCard, Screen } from '@/src/shared/ui'
import { extractImageUrls } from '@/src/utils/entity-images'

type Props = NativeStackScreenProps<RootStackParamList, typeof AppRoutes.USER_LIST_RESTAURANTS>

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

function buildHotelCardModel(item: UserListItem, details: HotelDetail | undefined): Hotel {
  return {
    id: Number(item.itemId),
    name: details?.name ?? item.name,
    images: details ? extractImageUrls(details) : [],
    address: details?.address ?? item.address ?? '',
    content: details?.content ?? '',
    canonicalUrl: details?.canonicalUrl ?? '',
    mainImageUrl: details?.mainImageUrl ?? '',
    lat: details?.lat ?? '',
    lng: details?.lng ?? '',
    phone: details?.phone ?? '',
    city: details?.city ?? item.city ?? item.country ?? 'Ville inconnue',
    country: details?.country ?? item.country ?? '',
    createdAt: details?.createdAt ?? item.addedAt ?? new Date().toISOString(),
    distinctions: details?.distinctions ?? null,
    isPlus: details?.isPlus ?? false,
    sustainableHotel: details?.sustainableHotel ?? false,
    bookable: details?.bookable ?? false,
    amenities: details?.amenities ?? [],
    distanceMeters: details?.distanceMeters ?? null,
  }
}

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 10 }

export default function UserListRestaurantsScreen({ route, navigation }: Props) {
  const { userId, listId, listTitle } = route.params
  const queryClient = useQueryClient()
  const inFlightDetails = useRef(new Set<string>())
  const failedDetails = useRef(new Set<string>())
  const [restaurantDetailsById, setRestaurantDetailsById] = useState<Record<string, RestaurantDetails>>({})
  const [hotelDetailsById, setHotelDetailsById] = useState<Record<string, HotelDetail>>({})

  const prefetchItemsDetails = useCallback(async (itemsToPrefetch: UserListItem[]) => {
    const tasks = itemsToPrefetch.map(async (item) => {
      const itemKey = `${item.itemType}:${item.itemId}`
      if (inFlightDetails.current.has(itemKey) || failedDetails.current.has(itemKey)) {
        return
      }

      inFlightDetails.current.add(itemKey)

      try {
        if (item.itemType === 'hotel') {
          const queryKey = ['hotels', 'hotel', Number(item.itemId)]
          const cachedDetail = queryClient.getQueryData<HotelDetail>(queryKey)
          if (cachedDetail) {
            setHotelDetailsById((previous) => {
              if (previous[item.itemId]) {
                return previous
              }

              return { ...previous, [item.itemId]: cachedDetail }
            })
            return
          }

          const detail = await queryClient.fetchQuery({
            queryKey,
            queryFn: () => hotelApi.getById(Number(item.itemId)),
            staleTime: StaleTimes.FIVE_MINUTES,
          })

          setHotelDetailsById((previous) => {
            if (previous[item.itemId]) {
              return previous
            }

            return { ...previous, [item.itemId]: detail }
          })
          return
        }

        if (item.itemType === 'restaurant') {
          const queryKey = ['restaurant-details', item.itemId]
          const cachedDetail = queryClient.getQueryData<RestaurantDetails>(queryKey)
          if (cachedDetail) {
            setRestaurantDetailsById((previous) => {
              if (previous[item.itemId]) {
                return previous
              }

              return { ...previous, [item.itemId]: cachedDetail }
            })
            return
          }

          const detail = await queryClient.fetchQuery({
            queryKey,
            queryFn: () => getRestaurantById(item.itemId),
            staleTime: StaleTimes.FIVE_MINUTES,
          })

          setRestaurantDetailsById((previous) => {
            if (previous[item.itemId]) {
              return previous
            }

            return { ...previous, [item.itemId]: detail }
          })
        }
      } catch {
        failedDetails.current.add(itemKey)
      } finally {
        inFlightDetails.current.delete(itemKey)
      }
    })

    await Promise.all(tasks)
  }, [queryClient])

  const {
    data: listData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-list-items', userId, listId],
    queryFn: () => getUserListItemsById(userId, listId),
    staleTime: StaleTimes.ONE_MINUTE,
    refetchOnMount: 'always',
  })

  const listItems = useMemo(() => listData?.items ?? [], [listData?.items])

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken<UserListItem>> }) => {
      const itemsToPrefetch: UserListItem[] = []

      for (const viewableItem of viewableItems) {
        const current = viewableItem.item
        if (!current) {
          continue
        }

        itemsToPrefetch.push(current)

        if (typeof viewableItem.index === 'number') {
          const next = listItems[viewableItem.index + 1]
          if (next) {
            itemsToPrefetch.push(next)
          }
        }
      }

      if (itemsToPrefetch.length > 0) {
        void prefetchItemsDetails(itemsToPrefetch)
      }
    },
    [listItems, prefetchItemsDetails],
  )

  return (
    <Screen>
      <View style={styles.container}>
        {isLoading ? <LoadingState label="Chargement de la liste..." /> : null}
        {isError ? (
          <ErrorState
            message="Impossible de charger le contenu de la liste."
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError ? (
          <FlatList
            data={listItems}
            keyExtractor={(item) => `${item.itemType}-${item.itemId}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            renderItem={({ item }) => {
              if (item.itemType === 'hotel') {
                const details = hotelDetailsById[item.itemId]
                const hotel = buildHotelCardModel(item, details)
                return (
                  <HotelCard
                    hotel={hotel}
                    onPress={() =>
                      navigation.navigate(AppRoutes.HOTEL_DETAILS, { hotelId: hotel.id })
                    }
                  />
                )
              }

              if (item.itemType === 'restaurant') {
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
              }

              return (
                <View style={styles.customItemCard}>
                  <Text style={styles.customItemName}>{item.name || 'Item personnalisé'}</Text>
                  <Text style={styles.customItemType}>{item.itemType}</Text>
                </View>
              )
            }}
            ListEmptyComponent={
              <EmptyState
                title="Liste vide"
                description={`Aucun élément dans ${listTitle}.`}
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
    backgroundColor: colors.backgroundPrimary,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  separator: {
    height: 8,
  },
  customItemCard: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    padding: 12,
    gap: 4,
  },
  customItemName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  customItemType: {
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
})
