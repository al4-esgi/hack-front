import React, { useMemo, useState } from 'react'
import { Image, Linking, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import { Camera, Map, Marker } from '@maplibre/maplibre-react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Text } from '@/components/ui/text'
import {
  addItemToUserList,
  getCurrentUser,
  getUserListItemsById,
  getUserListItemsByName,
  getUserLists,
  ListMutationRouteNotFoundError,
  UserListNotFoundError,
  removeItemFromUserList,
  type UserList,
} from '@/src/api/users.api'
import { colors, radius, spacing, typography } from '@/src/app/theme/tokens'
import { StaleTimes } from '@/src/constants/query.constant'
import { AppRoutes } from '@/src/constants/routes.constant'
import { useHotelDetail } from '@/src/hooks/useHotels'
import type { RootStackParamList } from '@/src/navigation/navigation.types'
import { OSM_DETAILED_STYLE } from '@/src/screens/tabs/map/map.constants'
import { useAuthStore } from '@/src/stores/auth.store'
import { DistinctionBadge, ErrorState, LoadingState, PrimaryButton, Screen } from '@/src/shared/ui'
import { HotelKeyBadge } from '@/src/shared/ui/DistinctionBadge'
import { extractImageUrls } from '@/src/utils/entity-images'

type Props = NativeStackScreenProps<RootStackParamList, typeof AppRoutes.HOTEL_DETAILS>

const RESERVED_LIST_NAMES = new Set(['liked', 'visited'])

function normalizeListName(name: string) {
  return name.trim().toLowerCase()
}

function parseCoordinate(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function ensureUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return `https://${url}`
}

function getListActionKey(listNameOrId: string) {
  return `list-action-${listNameOrId}`
}

export default function HotelDetailsScreen({ route, navigation }: Props) {
  const { hotelId } = route.params
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = Boolean(token)
  const { width: windowWidth } = useWindowDimensions()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [listActionError, setListActionError] = useState<string | null>(null)
  const [pendingActions, setPendingActions] = useState<Record<string, boolean>>({})

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError: isHotelError,
    refetch: refetchHotel,
  } = useHotelDetail(hotelId, true)

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
  } = useQuery({
    queryKey: ['current-user', 'hotel-details', token],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: StaleTimes.FIVE_MINUTES,
  })

  const { data: userLists = [], refetch: refetchUserLists } = useQuery({
    queryKey: ['hotel-details-user-lists', currentUser?.id],
    queryFn: () => getUserLists(currentUser!.id),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const { data: likedListRestaurants, refetch: refetchLikedList } = useQuery({
    queryKey: ['hotel-details-liked-list', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'liked'),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const { data: visitedListRestaurants, refetch: refetchVisitedList } = useQuery({
    queryKey: ['hotel-details-visited-list', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'visited'),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const customLists = useMemo(
    () => userLists.filter((list) => !RESERVED_LIST_NAMES.has(normalizeListName(list.name))),
    [userLists],
  )

  const customListQueries = useQueries({
    queries: customLists.map((list) => ({
      queryKey: ['hotel-details-custom-list', currentUser?.id, list.id],
      queryFn: () => getUserListItemsById(currentUser!.id, list.id),
      enabled: isAuthenticated && Boolean(currentUser?.id),
      staleTime: StaleTimes.ONE_MINUTE,
    })),
  })

  const likedItemKeys = useMemo(
    () => new Set((likedListRestaurants?.items ?? []).map((item) => `${item.itemType}:${item.itemId}`)),
    [likedListRestaurants],
  )

  const visitedItemKeys = useMemo(
    () => new Set((visitedListRestaurants?.items ?? []).map((item) => `${item.itemType}:${item.itemId}`)),
    [visitedListRestaurants],
  )

  const customMembershipByListId = useMemo(() => {
    const map: Record<string, boolean> = {}

    customLists.forEach((list, index) => {
      const queryData = customListQueries[index]?.data
      map[list.id] = Boolean(
        queryData?.items?.some((listItem) => listItem.itemType === 'hotel' && Number(listItem.itemId) === hotelId),
      )
    })

    return map
  }, [customListQueries, customLists, hotelId])

  const imageUrls = useMemo(() => extractImageUrls(hotel), [hotel])
  const carouselItemWidth = Math.max(windowWidth - spacing[3] * 4, 240)
  const latitude = hotel ? parseCoordinate(hotel.lat) : null
  const longitude = hotel ? parseCoordinate(hotel.lng) : null
  const hasValidCoordinates = latitude !== null && longitude !== null
  const isFavorite = likedItemKeys.has(`hotel:${hotelId}`)
  const isVisited = visitedItemKeys.has(`hotel:${hotelId}`)
  const isListLoading = isAuthenticated && isCurrentUserLoading

  const setPendingAction = (key: string, value: boolean) => {
    setPendingActions((current) => {
      if (value) {
        return { ...current, [key]: true }
      }

      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function handleToggleNamedList(listName: 'liked' | 'visited', isInList: boolean) {
    if (!isAuthenticated) {
      navigation.navigate(AppRoutes.LOGIN)
      return
    }

    if (!currentUser?.id) {
      return
    }

    const actionKey = getListActionKey(listName)
    setPendingAction(actionKey, true)
    setListActionError(null)

    try {
      if (isInList) {
        await removeItemFromUserList(currentUser.id, { listName }, { itemType: 'hotel', itemId: hotelId })
      } else {
        await addItemToUserList(currentUser.id, { listName }, { itemType: 'hotel', itemId: hotelId, name: hotel?.name })
      }

      if (listName === 'liked') {
        await refetchLikedList()
      } else {
        await refetchVisitedList()
      }
    } catch (error) {
      if (error instanceof ListMutationRouteNotFoundError) {
        setListActionError('Mutation liste-item indisponible sur l’API.')
      } else if (error instanceof UserListNotFoundError) {
        setListActionError('La liste demandée est introuvable.')
      } else {
        setListActionError('Impossible de mettre à jour la liste.')
      }
    } finally {
      setPendingAction(actionKey, false)
    }
  }

  async function handleToggleCustomList(list: UserList, isInList: boolean) {
    if (!isAuthenticated) {
      navigation.navigate(AppRoutes.LOGIN)
      return
    }

    if (!currentUser?.id) {
      return
    }

    const actionKey = getListActionKey(list.id)
    setPendingAction(actionKey, true)
    setListActionError(null)

    try {
      if (isInList) {
        await removeItemFromUserList(currentUser.id, { listId: list.id }, { itemType: 'hotel', itemId: hotelId })
      } else {
        await addItemToUserList(currentUser.id, { listId: list.id }, { itemType: 'hotel', itemId: hotelId, name: hotel?.name })
      }

      const customQueryIndex = customLists.findIndex((customList) => customList.id === list.id)
      if (customQueryIndex !== -1) {
        await customListQueries[customQueryIndex].refetch()
      }
      await refetchUserLists()
    } catch (error) {
      if (error instanceof ListMutationRouteNotFoundError) {
        setListActionError('Mutation liste-item indisponible sur l’API.')
      } else if (error instanceof UserListNotFoundError) {
        setListActionError('La liste demandée est introuvable.')
      } else {
        setListActionError('Impossible de mettre à jour cette liste.')
      }
    } finally {
      setPendingAction(actionKey, false)
    }
  }

  if (isHotelLoading) {
    return (
      <Screen scrollable>
        <LoadingState label="Chargement de l’hôtel..." />
      </Screen>
    )
  }

  if (!hotel || isHotelError) {
    return (
      <Screen scrollable>
        <ErrorState message="Impossible de charger l’hôtel." onRetry={() => void refetchHotel()} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>{hotel.name}</Text>
          <Text style={styles.location}>
            {hotel.city}
            {hotel.city && hotel.country ? ', ' : ''}
            {hotel.country}
          </Text>
          <Text style={styles.address}>{hotel.address}</Text>
        </View>

        {imageUrls.length > 0 ? (
          <View style={styles.section}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const currentOffset = event.nativeEvent.contentOffset.x
                const nextIndex = Math.round(currentOffset / carouselItemWidth)
                setActiveImageIndex(nextIndex)
              }}
              scrollEventThrottle={16}
              snapToInterval={carouselItemWidth}
              decelerationRate="fast"
            >
              {imageUrls.map((url, index) => (
                <Image
                  key={`${url}-${index}`}
                  source={{ uri: url }}
                  style={[styles.carouselImage, { width: carouselItemWidth }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {imageUrls.length > 1 ? (
              <View style={styles.paginationDots}>
                {imageUrls.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.paginationDot,
                      index === Math.min(activeImageIndex, imageUrls.length - 1) ? styles.paginationDotActive : undefined,
                    ]}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.mapContainer}>
            {hasValidCoordinates ? (
              <Map style={styles.map} mapStyle={OSM_DETAILED_STYLE} logo={false} attribution={false}>
                <Camera
                  initialViewState={{
                    center: [longitude!, latitude!],
                    zoom: 13,
                  }}
                />
                <Marker id="hotel-location" lngLat={[longitude!, latitude!]} anchor="bottom">
                  <View style={styles.mapPin} />
                </Marker>
              </Map>
            ) : (
              <View style={styles.mapFallback}>
                <Text style={styles.mapFallbackText}>Coordonnées indisponibles</Text>
              </View>
            )}
          </View>
          {hasValidCoordinates ? (
            <Pressable style={styles.linkButton} onPress={() => void Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)}>
              <Text style={styles.linkButtonText}>Ouvrir dans Maps</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.badgesRow}>
            {hotel.distinctions ? <HotelKeyBadge level={hotel.distinctions} /> : null}
            {hotel.isPlus ? <DistinctionBadge type="PLUS" /> : null}
            {hotel.sustainableHotel ? <DistinctionBadge type="SUSTAINABLE" /> : null}
          </View>

          {hotel.amenities.length > 0 ? (
            <Text style={styles.infoLine}>Services: {hotel.amenities.join(' · ')}</Text>
          ) : null}
          {hotel.phone ? <Text style={styles.infoLine}>Téléphone: {hotel.phone}</Text> : null}
          {hotel.canonicalUrl ? (
            <Pressable onPress={() => void Linking.openURL(ensureUrl(hotel.canonicalUrl))} style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Site web</Text>
            </Pressable>
          ) : null}
        </View>

        {hotel.content ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{hotel.content}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes listes</Text>
          {!isAuthenticated ? (
            <PrimaryButton label="Se connecter pour gérer les listes" onPress={() => navigation.navigate(AppRoutes.LOGIN)} />
          ) : (
            <View style={styles.listActionsContainer}>
              <View style={styles.quickListsRow}>
                <Pressable
                  style={[styles.pillButton, isFavorite ? styles.pillButtonActive : undefined]}
                  onPress={() => void handleToggleNamedList('liked', isFavorite)}
                  disabled={pendingActions[getListActionKey('liked')] === true || isListLoading}
                >
                  <Text style={[styles.pillLabel, isFavorite ? styles.pillLabelActive : undefined]}>
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.pillButton, isVisited ? styles.pillButtonActive : undefined]}
                  onPress={() => void handleToggleNamedList('visited', isVisited)}
                  disabled={pendingActions[getListActionKey('visited')] === true || isListLoading}
                >
                  <Text style={[styles.pillLabel, isVisited ? styles.pillLabelActive : undefined]}>
                    {isVisited ? 'Retirer des visités' : 'Ajouter aux visités'}
                  </Text>
                </Pressable>
              </View>

              {customLists.length > 0 ? (
                <View style={styles.customListsWrap}>
                  {customLists.map((list) => {
                    const inList = customMembershipByListId[list.id] === true
                    return (
                      <Pressable
                        key={list.id}
                        style={[styles.pillButton, inList ? styles.pillButtonActive : undefined]}
                        onPress={() => void handleToggleCustomList(list, inList)}
                        disabled={pendingActions[getListActionKey(list.id)] === true || isListLoading}
                      >
                        <Text style={[styles.pillLabel, inList ? styles.pillLabelActive : undefined]}>
                          {inList ? `Retirer de ${list.name}` : `Ajouter à ${list.name}`}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              ) : (
                <Text style={styles.mutedText}>Aucune liste personnalisée. Crée-en une dans Profil.</Text>
              )}

              {listActionError ? <Text style={styles.listError}>{listActionError}</Text> : null}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[3],
    gap: spacing[3],
  },
  section: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    padding: spacing[3],
    gap: spacing[2],
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
    fontWeight: typography.fontWeight.bold,
  },
  location: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.subText,
  },
  address: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  carouselImage: {
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSubtle,
    marginRight: spacing[2],
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.borderSubtle,
  },
  paginationDotActive: {
    width: 14,
    backgroundColor: colors.primary,
  },
  mapContainer: {
    height: 220,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSubtle,
  },
  mapFallbackText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.subText,
  },
  mapPin: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.backgroundPrimary,
  },
  linkButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    backgroundColor: colors.backgroundSubtle,
  },
  linkButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    alignItems: 'center',
  },
  infoLine: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subText,
    lineHeight: typography.lineHeight.subText,
  },
  inlineLink: {
    alignSelf: 'flex-start',
  },
  inlineLinkText: {
    color: colors.primary,
    fontSize: typography.fontSize.subText,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.subText,
    lineHeight: typography.lineHeight.subText,
  },
  listActionsContainer: {
    gap: spacing[2],
  },
  quickListsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  customListsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  pillButton: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSubtle,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  pillButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(189, 35, 51, 0.1)',
  },
  pillLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  pillLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  mutedText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  listError: {
    color: colors.primary,
    fontSize: typography.fontSize.small,
  },
})
