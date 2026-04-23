import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { colors, radius, spacing, typography } from '@/src/app/theme/tokens'
import { DistinctionBadge } from './DistinctionBadge'
import { FavoriteButton } from './FavoriteButton'
import { LocationMeta } from './LocationMeta'
import type { Restaurant } from '@/src/types/restaurant.type'

type RestaurantCardProps = {
  restaurant: Restaurant
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onPress?: () => void
}

export function RestaurantCard({
  restaurant,
  isFavorite = false,
  onToggleFavorite,
  onPress,
}: RestaurantCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={restaurant.name}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{restaurant.name}</Text>
        {onToggleFavorite ? (
          <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
        ) : null}
      </View>
      <View style={styles.badges}>
        {restaurant.awardCode && (
          <DistinctionBadge type={restaurant.awardCode} stars={restaurant.stars} />
        )}
        {restaurant.hasGreenStar && <DistinctionBadge type="GREEN_STAR" />}
      </View>
      {restaurant.cuisines.length > 0 && (
        <Text style={styles.meta}>{restaurant.cuisines.join(', ')}</Text>
      )}
      <LocationMeta city={restaurant.city} area={restaurant.address} country={restaurant.country} />
      {restaurant.description ? (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
            {restaurant.description}
          </Text>
          <Text style={styles.readMore}>{expanded ? 'Voir moins' : 'Lire la suite'}</Text>
        </Pressable>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
card: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    padding: spacing[3],
    gap: spacing[1],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  badges: {
    flexDirection: 'row',
    gap: spacing[1],
    minHeight: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
    fontWeight: typography.fontWeight.bold,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    minHeight: 24,
    alignItems: 'center',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    lineHeight: typography.lineHeight.small,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  readMore: {
    color: colors.primary,
    fontSize: typography.fontSize.subText,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 4,
  },
})