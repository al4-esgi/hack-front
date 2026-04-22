import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppRoutes } from '../constants/routes.constant'
import type { RootStackParamList } from '../navigation/navigation.types'
import { useAuthStore } from '../stores/auth.store'
import FeedScreen from './tabs/Feed.screen'
import MapScreen from './tabs/Map.screen'
import ProfileScreen from './tabs/Profile.screen'
import SavedScreen from './tabs/Saved.screen'
import SearchesScreen from './tabs/Searches.screen'

type Props = NativeStackScreenProps<RootStackParamList, typeof AppRoutes.ROOT>
type TabKey = 'feed' | 'map' | 'searches' | 'saved' | 'profile'

const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: 'feed', label: 'Feed' },
  { key: 'map', label: 'Map' },
  { key: 'searches', label: 'Recherches' },
  { key: 'saved', label: 'Saved' },
  { key: 'profile', label: 'Profil' },
]

export default function MainTabsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('feed')
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleRequestLogin = () => navigation.navigate(AppRoutes.LOGIN)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedScreen />
      case 'map':
        return <MapScreen />
      case 'searches':
        return <SearchesScreen />
      case 'saved':
        return <SavedScreen isAuthenticated={isAuthenticated} onRequestLogin={handleRequestLogin} />
      case 'profile':
        return <ProfileScreen isAuthenticated={isAuthenticated} onRequestLogin={handleRequestLogin} />
      default:
        return <FeedScreen />
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>{renderTabContent()}</View>

      <View style={styles.navbar}>
        {TAB_ITEMS.map((tab) => {
          const isActive = tab.key === activeTab

          return (
            <Pressable
              key={tab.key}
              style={[styles.navButton, isActive ? styles.navButtonActive : undefined]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.navLabel, isActive ? styles.navLabelActive : undefined]}>
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  navButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dedede',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    borderColor: '#111111',
    backgroundColor: '#111111',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  navLabelActive: {
    color: '#ffffff',
  },
})
