import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { colors, radius } from '../app/theme/tokens'
import { AppRoutes } from '../constants/routes.constant'
import type { RootStackParamList } from '../navigation/navigation.types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export default function NotFound() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { t } = useTranslation('notFound')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>
      <Text style={styles.description}>{t('description')}</Text>
      <Pressable style={styles.button} onPress={() => navigation.replace(AppRoutes.ROOT)}>
        <Text style={styles.buttonLabel}>Retour a l'accueil</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '600',
  },
})
