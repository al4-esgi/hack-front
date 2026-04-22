import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuthStore } from '../../stores/auth.store'

type ProfileScreenProps = {
  isAuthenticated: boolean
  onRequestLogin: () => void
}

export default function ProfileScreen({ isAuthenticated, onRequestLogin }: ProfileScreenProps) {
  const clearToken = useAuthStore((state) => state.clearToken)

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>
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
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Compte connecté (mode démo).</Text>

      <View style={styles.profileCard}>
        <Text style={styles.profileLabel}>Nom: Demo User</Text>
        <Text style={styles.profileLabel}>Email: demo@hackgroup2.dev</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={clearToken}>
        <Text style={styles.logoutButtonLabel}>Se déconnecter</Text>
      </Pressable>
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
  profileCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    gap: 6,
    marginBottom: 16,
  },
  profileLabel: {
    color: '#222222',
    fontSize: 15,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#ffffff',
  },
  logoutButtonLabel: {
    color: '#111111',
    fontWeight: '600',
  },
})
