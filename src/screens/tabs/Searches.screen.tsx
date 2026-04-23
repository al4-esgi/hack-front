import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text'
import {
  EmptyState,
  FilterChip,
  ListHeader,
  PageHeader,
  Screen,
  SearchBar,
  Section,
} from '@/src/shared/ui'
import { colors, radius } from '@/src/app/theme/tokens'

const SUGGESTIONS = [
  'Coffee spots',
  'Brunch du week-end',
  'Activités en groupe',
  'Parcs et extérieur',
  'Restaurants italiens',
  'Musées',
]

export default function SearchesScreen() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'restaurants' | 'hotels'>('all')

  const filteredSuggestions = SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(query.trim().toLowerCase()),
  ).slice(0, 5)

  return (
    <Screen scrollable>
      <PageHeader title="Recherches" subtitle="Trouve rapidement une adresse ou une catégorie." />

      <Section>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Rechercher un lieu, une catégorie..."
        />
      </Section>

      <View style={styles.filters}>
        <FilterChip label="Tout" active={activeFilter === 'all'} onPress={() => setActiveFilter('all')} />
        <FilterChip
          label="Restaurants"
          active={activeFilter === 'restaurants'}
          onPress={() => setActiveFilter('restaurants')}
        />
        <FilterChip
          label="Hôtels"
          active={activeFilter === 'hotels'}
          onPress={() => setActiveFilter('hotels')}
        />
      </View>

      <Section>
        <ListHeader title="Suggestions" subtitle="Résultats rapides" />
        {filteredSuggestions.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            description="Essaie une recherche plus large ou retire un filtre."
          />
        ) : (
          filteredSuggestions.map((item) => (
            <View key={item} style={styles.resultCard}>
              <Text style={styles.resultLabel}>{item}</Text>
            </View>
          ))
        )}
      </Section>
    </Screen>
  )
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultCard: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
})
