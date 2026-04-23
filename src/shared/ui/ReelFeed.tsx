import React, { useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  useWindowDimensions,
  FlatList,
  StatusBar,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { typography } from '@/src/app/theme/tokens'
import type { SocialPost, TikTokPost, InstagramPost } from '@/src/types/social.type'

type ReelFeedProps = {
  posts: SocialPost[]
}

type ReelItemProps = {
  post: SocialPost
}

function getEmbedHtml(post: SocialPost): string {
  const isTikTok = 'playCount' in post

  if (isTikTok) {
    const tiktokPost = post as TikTokPost
    const videoId = tiktokPost.url.split('/video/')?.[1]?.split('?')?.[0] || ''

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #000;
            }
            .tiktok-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            iframe {
              width: 100%;
              height: 100vh;
              border: none;
            }
          </style>
          <script>
            (function() {
              window.open = function() { return null; };
              document.addEventListener('click', function(e) {
                if (e.target.href && e.target.href.includes('snssdk://')) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }, true);
            })();
          </script>
        </head>
        <body>
          <div class="tiktok-container">
            <iframe
              src="https://www.tiktok.com/embed/v2/${videoId}?autoplay=1&embed_can_play=1"
              allow="autoplay; fullscreen; encrypted-media"
              allowfullscreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            ></iframe>
          </div>
        </body>
      </html>
    `
  } else {
    const instagramPost = post as InstagramPost
    const postId = instagramPost.url.split('/p/')?.[1]?.split('/')?.[0] || ''

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #000;
            }
            .instagram-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            blockquote.instagram-media {
              width: 100%;
              height: 100%;
              border: none !important;
              border-radius: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          </style>
          <script async src="//www.instagram.com/embed.js"></script>
        </head>
        <body>
          <div class="instagram-container">
            <blockquote
              class="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/p/${postId}/"
              data-instgrm-version="14"
              data-instgrm-captioned
              style="width: 100%; height: 100vh; border: none; border-radius: 0;"
            ></blockquote>
          </div>
        </body>
      </html>
    `
  }
}

function ReelItem({ post }: ReelItemProps) {
  const { height: screenHeight } = useWindowDimensions()
  const reelHeight = screenHeight - 80 - (StatusBar.currentHeight ?? 0)

  const html = getEmbedHtml(post)

  const handleShouldStartLoadWithRequest = (navState: any) => {
    if (
      navState.url.startsWith('snssdk://') ||
      navState.url.startsWith('instagram://') ||
      navState.url.includes('tiktok.com/@') ||
      navState.url.includes('instagram.com/p/')
    ) {
      return false
    }
    return true
  }

  return (
    <View style={[styles.itemContainer, { height: reelHeight }]} key={post.id}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn('WebView error: ', nativeEvent)
          }}
          androidLayerType="hardware"
          androidHardwareAccelerationDisabled={false}
          scalesPageToFit={false}
          bounces={false}
          overScrollMode="never"
        />
      </View>
    </View>
  )
}

export function ReelFeed({ posts }: ReelFeedProps) {
  const { height: screenHeight } = useWindowDimensions()
  const itemHeight = screenHeight - 80 - (StatusBar.currentHeight ?? 0)

  const handleGetItemLayout = useCallback(
    (_data: ArrayLike<SocialPost> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  )

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune vidéo disponible</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <ReelItem post={item} />}
        keyExtractor={(item) => item.id}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={handleGetItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ backgroundColor: 'black' }}
        bounces={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  itemContainer: {
    width: Dimensions.get('window').width,
    overflow: 'hidden',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
    backgroundColor: 'black',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptyText: {
    color: 'white',
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
})
