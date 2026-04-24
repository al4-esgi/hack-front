import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { colors, radius, spacing, typography } from '@/src/app/theme/tokens'
import type { Hotel } from '@/src/types/hotel.type'
import { extractImageUrls } from '@/src/utils/entity-images'
import { DistinctionBadge, HotelKeyBadge } from './DistinctionBadge'

type HotelCardProps = {
  hotel: Hotel
  isFavorite?: boolean
  isVisited?: boolean
  actionDisabled?: boolean
  onToggleFavorite?: () => void
  onToggleVisited?: () => void
  onPress?: () => void
}

export function HotelCard({
  hotel,
  isFavorite = false,
  isVisited = false,
  actionDisabled = false,
  onToggleFavorite,
  onToggleVisited,
  onPress,
}: HotelCardProps) {
  const imageUrl = extractImageUrls(hotel)[0]

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={hotel.name}
    >
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={2}>
              {hotel.name}
            </Text>
            {(hotel.city || hotel.country) && (
              <Text style={styles.location}>
                {hotel.city}
                {hotel.city && hotel.country ? ', ' : ''}
                {hotel.country}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.badges}>
          {hotel.distinctions ? <HotelKeyBadge level={hotel.distinctions} /> : null}
          {hotel.isPlus ? <DistinctionBadge type="PLUS" /> : null}
          {hotel.sustainableHotel ? <DistinctionBadge type="SUSTAINABLE" /> : null}
        </View>

        <View style={styles.meta}>
          {hotel.distanceMeters != null ? (
            <Text style={styles.distance}>{(hotel.distanceMeters / 1000).toFixed(1)} km</Text>
          ) : null}
          {hotel.bookable ? (
            <View style={styles.bookableBadge}>
              <Text style={styles.bookableText}>Réservable</Text>
            </View>
          ) : null}
        </View>

        {hotel.amenities.length > 0 ? (
          <Text style={styles.amenities} numberOfLines={1}>
            {hotel.amenities.join(' · ')}
          </Text>
        ) : null}

        {hotel.content ? (
          <Text style={styles.description} numberOfLines={2}>
            {hotel.content}
          </Text>
        ) : null}

        {onToggleFavorite || onToggleVisited ? (
          <View style={styles.quickActions}>
            {onToggleFavorite ? (
              <Pressable
                style={[styles.quickActionButton, isFavorite ? styles.quickActionButtonActive : undefined]}
                onPress={(event) => {
                  event.stopPropagation()
                  if (actionDisabled) {
                    return
                  }
                  onToggleFavorite()
                }}
              >
                <Text style={[styles.quickActionLabel, isFavorite ? styles.quickActionLabelActive : undefined]}>
                  {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
                </Text>
              </Pressable>
            ) : null}
            {onToggleVisited ? (
              <Pressable
                style={[styles.quickActionButton, isVisited ? styles.quickActionButtonActive : undefined]}
                onPress={(event) => {
                  event.stopPropagation()
                  if (actionDisabled) {
                    return
                  }
                  onToggleVisited()
                }}
              >
                <Text style={[styles.quickActionLabel, isVisited ? styles.quickActionLabelActive : undefined]}>
                  {isVisited ? 'Visité' : 'Ajouter aux visités'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgb(205, 205, 205)',
    shadowColor: 'rgb(25, 25, 25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: colors.backgroundSubtle,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing[3],
    gap: spacing[2],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  titleContainer: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    fontWeight: typography.fontWeight.semibold,
  },
  location: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    lineHeight: typography.lineHeight.small,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  distance: {
    color: colors.primary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  bookableBadge: {
    backgroundColor: colors.textSecondary,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  bookableText: {
    color: colors.backgroundPrimary,
    fontSize: typography.fontSize.small - 2,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amenities: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.subText,
    lineHeight: typography.lineHeight.subText,
    fontStyle: 'italic',
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.subText,
    lineHeight: typography.lineHeight.subText,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  quickActionButton: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 6,
    backgroundColor: colors.backgroundSubtle,
  },
  quickActionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(189, 35, 51, 0.1)',
  },
  quickActionLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  quickActionLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
})
