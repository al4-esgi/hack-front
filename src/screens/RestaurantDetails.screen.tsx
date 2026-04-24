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
import { useRestaurantDetail } from '@/src/hooks/useRestaurants'
import type { RootStackParamList } from '@/src/navigation/navigation.types'
import { OSM_DETAILED_STYLE } from '@/src/screens/tabs/map/map.constants'
import { useAuthStore } from '@/src/stores/auth.store'
import { DistinctionBadge, ErrorState, LoadingState, PriceRange, PrimaryButton, Screen } from '@/src/shared/ui'
import { extractImageUrls } from '@/src/utils/entity-images'
import { resolveRestaurantDisplayName } from '@/src/utils/restaurant-display-name'

type Props = NativeStackScreenProps<RootStackParamList, typeof AppRoutes.RESTAURANT_DETAILS>

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

export default function RestaurantDetailsScreen({ route, navigation }: Props) {
  const { restaurantId } = route.params
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = Boolean(token)
  const { width: windowWidth } = useWindowDimensions()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false)
  const [listActionError, setListActionError] = useState<string | null>(null)
  const [pendingActions, setPendingActions] = useState<Record<string, boolean>>({})

  const {
    data: restaurant,
    isLoading: isRestaurantLoading,
    isError: isRestaurantError,
    refetch: refetchRestaurant,
  } = useRestaurantDetail(restaurantId, true)

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
  } = useQuery({
    queryKey: ['current-user', 'restaurant-details', token],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: StaleTimes.FIVE_MINUTES,
  })

  const { data: userLists = [], refetch: refetchUserLists } = useQuery({
    queryKey: ['restaurant-details-user-lists', currentUser?.id],
    queryFn: () => getUserLists(currentUser!.id),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const { data: likedListRestaurants, refetch: refetchLikedList } = useQuery({
    queryKey: ['restaurant-details-liked-restaurants', currentUser?.id],
    queryFn: () => getUserListItemsByName(currentUser!.id, 'liked'),
    enabled: isAuthenticated && Boolean(currentUser?.id),
    staleTime: StaleTimes.ONE_MINUTE,
  })

  const { data: visitedListRestaurants, refetch: refetchVisitedList } = useQuery({
    queryKey: ['restaurant-details-visited-restaurants', currentUser?.id],
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
      queryKey: ['restaurant-details-custom-list', currentUser?.id, list.id],
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
        queryData?.items?.some(
          (listItem) => listItem.itemType === 'restaurant' && Number(listItem.itemId) === restaurantId,
        ),
      )
    })

    return map
  }, [customListQueries, customLists, restaurantId])

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
        await removeItemFromUserList(currentUser.id, { listName }, { itemType: 'restaurant', itemId: restaurantId })
      } else {
        await addItemToUserList(currentUser.id, { listName }, { itemType: 'restaurant', itemId: restaurantId, name: restaurant?.name })
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
        await removeItemFromUserList(currentUser.id, { listId: list.id }, { itemType: 'restaurant', itemId: restaurantId })
      } else {
        await addItemToUserList(currentUser.id, { listId: list.id }, { itemType: 'restaurant', itemId: restaurantId, name: restaurant?.name })
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

  const latitude = restaurant ? parseCoordinate(restaurant.latitude) : null
  const longitude = restaurant ? parseCoordinate(restaurant.longitude) : null
  const hasValidCoordinates = latitude !== null && longitude !== null
  const imageUrls = useMemo(() => extractImageUrls(restaurant), [restaurant])
  const carouselItemWidth = Math.max(windowWidth - spacing[3] * 4, 240)
  const displayName = restaurant ? resolveRestaurantDisplayName(restaurant) : 'Restaurant'
  const isFavorite = likedItemKeys.has(`restaurant:${restaurantId}`)
  const isVisited = visitedItemKeys.has(`restaurant:${restaurantId}`)
  const isListLoading = isAuthenticated && isCurrentUserLoading

  if (isRestaurantLoading) {
    return (
      <Screen scrollable>
        <LoadingState label="Chargement du restaurant..." />
      </Screen>
    )
  }

  if (!restaurant || isRestaurantError) {
    return (
      <Screen scrollable>
        <ErrorState
          message="Impossible de charger le restaurant."
          onRetry={() => void refetchRestaurant()}
        />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.location}>
            {restaurant.city}
            {restaurant.city && restaurant.country ? ', ' : ''}
            {restaurant.country}
          </Text>
          <Text style={styles.address}>{restaurant.address}</Text>
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
          <Text style={styles.sectionTitle}>Mes listes</Text>

          {!isAuthenticated ? (
            <PrimaryButton label="Se connecter pour gérer les listes" onPress={() => navigation.navigate(AppRoutes.LOGIN)} />
          ) : (
            <View style={styles.listActionsContainer}>
              <View style={styles.primaryActionsGrid}>
                <Pressable
                  style={[styles.toggleActionCard, isFavorite ? styles.toggleActionCardActive : undefined]}
                  onPress={() => void handleToggleNamedList('liked', isFavorite)}
                  disabled={pendingActions[getListActionKey('liked')] === true || isListLoading}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isFavorite, disabled: pendingActions[getListActionKey('liked')] === true || isListLoading }}
                  accessibilityLabel={isFavorite ? 'Retirer ce restaurant des favoris' : 'Ajouter ce restaurant aux favoris'}
                >
                  <Text style={styles.toggleActionTitle}>Favoris</Text>
                  <Text style={[styles.toggleActionStatus, isFavorite ? styles.toggleActionStatusActive : undefined]}>
                    {isFavorite ? 'Ajouté' : 'Non ajouté'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleActionCard, isVisited ? styles.toggleActionCardActive : undefined]}
                  onPress={() => void handleToggleNamedList('visited', isVisited)}
                  disabled={pendingActions[getListActionKey('visited')] === true || isListLoading}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isVisited, disabled: pendingActions[getListActionKey('visited')] === true || isListLoading }}
                  accessibilityLabel={isVisited ? 'Retirer ce restaurant des visités' : 'Ajouter ce restaurant aux visités'}
                >
                  <Text style={styles.toggleActionTitle}>Visité</Text>
                  <Text style={[styles.toggleActionStatus, isVisited ? styles.toggleActionStatusActive : undefined]}>
                    {isVisited ? 'Ajouté' : 'Non ajouté'}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.dropdownTrigger}
                onPress={() => setIsListsDropdownOpen((current) => !current)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isListsDropdownOpen }}
                accessibilityLabel="Ouvrir les listes personnalisées"
              >
                <Text style={styles.dropdownTriggerLabel}>Listes personnalisées</Text>
                <Text style={styles.dropdownTriggerChevron}>{isListsDropdownOpen ? '⌃' : '⌄'}</Text>
              </Pressable>

              {isListsDropdownOpen ? (
                customLists.length > 0 ? (
                  <View style={styles.dropdownPanel}>
                    {customLists.map((list) => {
                      const inList = customMembershipByListId[list.id] === true
                      return (
                        <Pressable
                          key={list.id}
                          style={styles.checkboxRow}
                          onPress={() => void handleToggleCustomList(list, inList)}
                          disabled={pendingActions[getListActionKey(list.id)] === true || isListLoading}
                          accessibilityRole="checkbox"
                          accessibilityState={{
                            checked: inList,
                            disabled: pendingActions[getListActionKey(list.id)] === true || isListLoading,
                          }}
                          accessibilityLabel={list.name}
                        >
                          <View style={[styles.checkboxBox, inList ? styles.checkboxBoxChecked : undefined]}>
                            {inList ? <Text style={styles.checkboxTick}>✓</Text> : null}
                          </View>
                          <View style={styles.checkboxTexts}>
                            <Text style={styles.checkboxLabel}>{list.name}</Text>
                            <Text style={styles.checkboxHint}>
                              {inList ? 'Déjà dans la liste' : 'Ajouter à cette liste'}
                            </Text>
                          </View>
                        </Pressable>
                      )
                    })}
                  </View>
                ) : (
                  <Text style={styles.mutedText}>Aucune liste personnalisée. Crée-en une dans Profil.</Text>
                )
              ) : null}

              {listActionError ? <Text style={styles.listError}>{listActionError}</Text> : null}
            </View>
          )}
        </View>

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
                <Marker id="restaurant-location" lngLat={[longitude!, latitude!]} anchor="bottom">
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
            <Pressable
              style={styles.linkButton}
              onPress={() =>
                void Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)
              }
            >
              <Text style={styles.linkButtonText}>Ouvrir dans Maps</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.badgesRow}>
            {restaurant.awardCode ? <DistinctionBadge type={restaurant.awardCode} stars={restaurant.stars} /> : null}
            {restaurant.hasGreenStar ? <DistinctionBadge type="GREEN_STAR" /> : null}
            <PriceRange level={restaurant.priceLevel as 1 | 2 | 3 | 4} />
          </View>

          {restaurant.cuisines.length > 0 ? (
            <Text style={styles.infoLine}>Cuisines: {restaurant.cuisines.join(' · ')}</Text>
          ) : null}
          {restaurant.facilities.length > 0 ? (
            <Text style={styles.infoLine}>Services: {restaurant.facilities.join(' · ')}</Text>
          ) : null}
          {restaurant.phoneNumber ? <Text style={styles.infoLine}>Téléphone: {restaurant.phoneNumber}</Text> : null}
          {restaurant.websiteUrl ? (
            <Pressable
              onPress={() => void Linking.openURL(ensureUrl(restaurant.websiteUrl!))}
              style={styles.inlineLink}
            >
              <Text style={styles.inlineLinkText}>Site web</Text>
            </Pressable>
          ) : null}
          {restaurant.sourceUrl ? (
            <Pressable onPress={() => void Linking.openURL(restaurant.sourceUrl)} style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Source Michelin</Text>
            </Pressable>
          ) : null}
        </View>

        {restaurant.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>
        ) : null}

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
  primaryActionsGrid: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  toggleActionCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSubtle,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
  },
  toggleActionCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(189, 35, 51, 0.1)',
  },
  toggleActionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  toggleActionStatus: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  toggleActionStatusActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
  },
  dropdownTriggerLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subText,
    fontWeight: typography.fontWeight.semibold,
  },
  dropdownTriggerChevron: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
  },
  dropdownPanel: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    overflow: 'hidden',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.backgroundPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(189, 35, 51, 0.1)',
  },
  checkboxTick: {
    color: colors.primary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
  },
  checkboxTexts: {
    flex: 1,
    gap: 1,
  },
  checkboxLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subText,
    fontWeight: typography.fontWeight.medium,
  },
  checkboxHint: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
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
