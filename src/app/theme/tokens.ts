export const colors = {
  // Brand
  red: 'rgb(186, 11, 47)',

  // Text
  textPrimary: 'rgb(25, 25, 25)',
  textSecondary: 'rgb(117, 117, 117)',
  textTertiary: 'rgb(72, 72, 74)',

  // Backgrounds
  backgroundPrimary: 'rgb(255, 255, 255)',
  backgroundSubtle: 'rgb(248, 248, 248)',

  // Borders
  borderSubtle: 'rgb(230, 230, 230)',
  divider: 'rgb(238, 238, 238)',
} as const

export const typography = {
  fontSize: {
    title: 20,
    body: 16,
    subText: 14,
    small: 12,
  },
  lineHeight: {
    title: 28,
    body: 24,
    subText: 20,
    small: 16,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  fontFamily: {
    regular: 'Figtree',
    medium: 'Figtree-Medium',
    semibold: 'Figtree-SemiBold',
    bold: 'Figtree-Bold',
  },
} as const

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
} as const

export const radius = {
  sm: 3,
  lg: 8,
  full: 999,
} as const

export const shadow = {
  card: {
    shadowColor: 'rgb(25, 25, 25)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
} as const
