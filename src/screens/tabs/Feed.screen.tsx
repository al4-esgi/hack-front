import { ScrollView, StyleSheet, Text, View } from 'react-native'

const FEED_ITEMS = [
  {
    id: '1',
    title: 'Nouveau spot à découvrir',
    description: 'Un lieu populaire autour de toi avec de très bons avis cette semaine.',
  },
  {
    id: '2',
    title: 'Tendance locale',
    description: 'Les utilisateurs enregistrent de plus en plus de lieux dans cette zone.',
  },
  {
    id: '3',
    title: 'Recommandation du jour',
    description: 'Un endroit à visiter maintenant selon ton historique récent.',
  },
]

export default function FeedScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text style={styles.subtitle}>Ta home principale avec les dernières recommandations.</Text>

      <View style={styles.cards}>
        {FEED_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        ))}
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
    fontSize: 15,
    color: '#5a5a5a',
    marginBottom: 18,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },
  cardDescription: {
    color: '#444444',
    lineHeight: 20,
  },
})
