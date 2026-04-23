import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { colors, radius, spacing, typography } from '@/src/app/theme/tokens'
import { DistinctionBadge, HotelKeyBadge } from './DistinctionBadge'
import { FavoriteButton } from './FavoriteButton'
import { LocationMeta } from './LocationMeta'
import type { Hotel } from '@/src/types/hotel.type'

type HotelCardProps = {
  hotel: Hotel
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onPress?: () => void
}

export function HotelCard({
  hotel,
  isFavorite = false,
  onToggleFavorite,
  onPress,
}: HotelCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={hotel.name}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{hotel.name}</Text>
        {onToggleFavorite ? (
          <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
        ) : null}
      </View>
      <View style={styles.badges}>
        {hotel.distinctions && (
          <HotelKeyBadge level={hotel.distinctions} />
        )}
        {hotel.isPlus && <DistinctionBadge type="PLUS" />}
        {hotel.sustainableHotel && <DistinctionBadge type="SUSTAINABLE" />}
      </View>
      <LocationMeta city={hotel.city} area={hotel.address} country={hotel.country} />
      {hotel.content ? (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
            {hotel.content}
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
    flexWrap: 'wrap',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
    fontWeight: typography.fontWeight.bold,
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