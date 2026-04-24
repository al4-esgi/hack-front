import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { PageHeader, Screen, SearchResultList, SearchFilters } from '@/src/shared/ui'
import { spacing } from '@/src/app/theme/tokens'

type SearchesScreenProps = {
  isAuthenticated: boolean
  onRequestLogin: () => void
}

export default function SearchesScreen({ isAuthenticated, onRequestLogin }: SearchesScreenProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Screen>
      <View style={styles.container}>
        <PageHeader title="Recherches" />
        <SearchFilters query={query} onSearchChange={setQuery} isLoading={isLoading} />
      </View>
      <SearchResultList
        query={query}
        onLoadingChange={setIsLoading}
        isAuthenticated={isAuthenticated}
        onRequestLogin={onRequestLogin}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
    gap: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
})
