import { View, Text, StyleSheet } from 'react-native'
import { useTikTokHashtags, useInstagramHashtags } from '@/src/hooks/useSocial'
import { ReelFeed } from '@/src/shared/ui/ReelFeed'

export default function FeedScreen() {
  // Buscar posts com hashtags padrão
  const tikTokQuery = useTikTokHashtags(
    {
      tags: ['michelin', 'restaurants'],
      limit: 30,
    },
    true,
  )

  const instagramQuery = useInstagramHashtags(
    {
      tags: ['michelin', 'restaurants'],
      limit: 30,
    },
    true,
  )

  const { data: tikTokData, isLoading: tikTokLoading } = tikTokQuery
  const { data: instagramData, isLoading: instagramLoading } = instagramQuery

  const isLoading = tikTokLoading || instagramLoading

  // Interleave TikTok and Instagram posts for variety
  const posts = (() => {
    const tiktokPosts = tikTokData || []
    const instagramPosts = instagramData || []

    const interleaved: any[] = []
    const maxLength = Math.max(tiktokPosts.length, instagramPosts.length)

    for (let i = 0; i < maxLength; i++) {
      if (i < tiktokPosts.length) interleaved.push(tiktokPosts[i])
      if (i < instagramPosts.length) interleaved.push(instagramPosts[i])
    }

    return interleaved
  })()

  return isLoading ? (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  ) : (
    <ReelFeed posts={posts} />
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
})
