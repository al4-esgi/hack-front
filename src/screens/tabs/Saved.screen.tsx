import { Pressable, StyleSheet, Text, View } from 'react-native'

type SavedScreenProps = {
  isAuthenticated: boolean
  onRequestLogin: () => void
}

const SAVED_ITEMS = ['Le Petit Rivage', 'Bistro Luna', 'Parc des Arts']

export default function SavedScreen({ isAuthenticated, onRequestLogin }: SavedScreenProps) {
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.lockedMessage}>
          Il faut se connecter pour acceder a cette page.
        </Text>
        <Pressable style={styles.loginButton} onPress={onRequestLogin}>
          <Text style={styles.loginButtonLabel}>Se connecter</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>Tes lieux enregistrés récemment.</Text>

      <View style={styles.savedList}>
        {SAVED_ITEMS.map((item) => (
          <View key={item} style={styles.savedCard}>
            <Text style={styles.savedLabel}>{item}</Text>
          </View>
        ))}
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
  lockedMessage: {
    marginTop: 10,
    marginBottom: 14,
    fontSize: 15,
    color: '#444444',
  },
  loginButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#111111',
    borderRadius: 10,
  },
  loginButtonLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  savedList: {
    gap: 10,
  },
  savedCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  savedLabel: {
    fontSize: 15,
    color: '#222222',
  },
})
