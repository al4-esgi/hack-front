import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppRoutes } from '../../constants/routes.constant'
import type { RootStackParamList } from '../../navigation/navigation.types'
import { useAuthStore } from '../../stores/auth.store'

type Props = NativeStackScreenProps<RootStackParamList, typeof AppRoutes.AUTH_CALLBACK>

export default function AuthCallbackScreen({ navigation, route }: Props) {
  const setToken = useAuthStore((state) => state.setToken)

  useEffect(() => {
    const jwt = route.params?.jwt ?? route.params?.token ?? route.params?.access_token

    if (jwt) {
      setToken(jwt)
      navigation.replace(AppRoutes.ROOT)
      return
    }

    navigation.replace(AppRoutes.LOGIN)
  }, [navigation, route.params, setToken])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.label}>Connexion en cours...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
  },
  label: {
    color: '#333333',
    fontSize: 14,
  },
})
