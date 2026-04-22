import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';
const baseStyle = isWeb ? 'flex flex-col relative z-0' : '';

export const cardStyle = tva({
  base: baseStyle,
  variants: {
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    variant: {
      elevated: 'bg-background-0 border border-outline-200 rounded-lg',
      outline: 'border border-outline-200 rounded-lg',
      ghost: 'rounded-lg',
      filled: 'bg-background-50 border border-outline-200 rounded-lg',
    },
  },
});
