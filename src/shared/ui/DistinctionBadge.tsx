import { StyleSheet, Text, View } from 'react-native'
import { colors, radius, typography } from '@/src/app/theme/tokens'
import { AwardCode } from '@/src/types/restaurant.type'
import type { Distinction } from '@/src/types/hotel.type'

export type RestaurantDistinctionType = AwardCode | 'GREEN_STAR'
export type HotelDistinctionType = Distinction | 'PLUS' | 'SUSTAINABLE'
export type DistinctionType = RestaurantDistinctionType | HotelDistinctionType

type DistinctionBadgeProps = {
  type: RestaurantDistinctionType | HotelDistinctionType
  stars?: number | null
}

const DISTINCTION_CONFIG: Record<
  string,
  { label: string; icon: string; borderColor: string; backgroundColor: string; textColor: string }
> = {
  [AwardCode.MichelinStar]: {
    label: 'Etoile',
    icon: '★',
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    textColor: colors.backgroundPrimary,
  },
  [AwardCode.BibGourmand]: {
    label: 'Bib Gourmand',
    icon: 'BIB',
    borderColor: colors.primary,
    backgroundColor: colors.backgroundPrimary,
    textColor: colors.primary,
  },
  [AwardCode.Selected]: {
    label: 'Selected',
    icon: 'S',
    borderColor: colors.textSecondary,
    backgroundColor: colors.backgroundPrimary,
    textColor: colors.textSecondary,
  },
  GREEN_STAR: {
    label: 'Green Star',
    icon: '●',
    borderColor: colors.success,
    backgroundColor: 'rgba(132, 189, 0, 0.12)',
    textColor: colors.success,
  },
  PLUS: {
    label: 'Michelin Plus',
    icon: '+',
    borderColor: colors.accent,
    backgroundColor: 'rgba(88, 44, 131, 0.12)',
    textColor: colors.accent,
  },
  SUSTAINABLE: {
    label: 'Sustainable',
    icon: '◎',
    borderColor: colors.travel,
    backgroundColor: 'rgba(23, 167, 143, 0.12)',
    textColor: colors.travel,
  },
}

export function DistinctionBadge({ type, stars }: DistinctionBadgeProps) {
  const config = DISTINCTION_CONFIG[type]
  if (!config) return null
  
  const displayIcon = type === AwardCode.MichelinStar && stars ? `${stars}★` : config.icon

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={config.label}
      style={[styles.base, { borderColor: config.borderColor, backgroundColor: config.backgroundColor }]}
    >
      <Text style={[styles.label, { color: config.textColor }]}>{displayIcon}</Text>
    </View>
  )
}

export function HotelKeyBadge({ level }: { level: Distinction }) {
  const keyCount = parseInt(level?.[0] || '1', 10) || 1
  const config = {
    label: `${level} Keys`,
    icon: '◆'.repeat(Math.min(keyCount, 3)),
    borderColor: colors.accent,
    backgroundColor: 'rgba(88, 44, 131, 0.12)',
    textColor: colors.accent,
  }

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={config.label}
      style={[styles.base, { borderColor: config.borderColor, backgroundColor: config.backgroundColor }]}
    >
      <Text style={[styles.label, { color: config.textColor }]}>{config.icon}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: {
    fontSize: typography.fontSize.small - 1, // 11px para badge
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
})
