import { StyleSheet, Text, View } from 'react-native'

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>Visualise rapidement les zones et les points autour de toi.</Text>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapLabel}>Carte interactive (placeholder)</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  mapPlaceholder: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapLabel: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
})
