import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

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

  const filteredSuggestions = SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(query.trim().toLowerCase()),
  ).slice(0, 5)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recherches</Text>
      <Text style={styles.subtitle}>Lance une recherche et retrouve des suggestions rapides.</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        placeholder="Rechercher un lieu, une catégorie..."
        placeholderTextColor="#777777"
      />

      <View style={styles.results}>
        {filteredSuggestions.length === 0 ? (
          <Text style={styles.emptyState}>Aucun résultat pour cette recherche.</Text>
        ) : (
          filteredSuggestions.map((item) => (
            <View key={item} style={styles.resultCard}>
              <Text style={styles.resultLabel}>{item}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#101010',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: '#5a5a5a',
    fontSize: 15,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111111',
  },
  results: {
    marginTop: 14,
    gap: 10,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 15,
    color: '#222222',
  },
  emptyState: {
    color: '#555555',
    fontSize: 15,
  },
})
