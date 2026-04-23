import { Suspense, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { StaleTimes } from './src/constants/query.constant'
import AppNavigator from './src/navigation/AppNavigator'
import { navigationRef } from './src/navigation/navigation.service'
import './src/i18n/config'
import './src/i18n/types'
import { useAuthStore } from './src/stores/auth.store'

import '@/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: StaleTimes.FIVE_MINUTES,
      gcTime: StaleTimes.ONE_HOUR,
      refetchOnWindowFocus: false,
    },
  },
})

function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Figtree: Figtree_400Regular,
    'Figtree-Medium': Figtree_500Medium,
    'Figtree-SemiBold': Figtree_600SemiBold,
    'Figtree-Bold': Figtree_700Bold,
  })

  const [hasHydrated, setHasHydrated] = useState(useAuthStore.persist.hasHydrated())

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() => setHasHydrated(false))
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true))

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  if (!fontsLoaded || !hasHydrated) {
    return <Loader />
  }

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loader />}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </Suspense>
      </QueryClientProvider>
    </GluestackUIProvider>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
