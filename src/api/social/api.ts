import { PaginatedSocialPosts } from '@/src/types/social.type'
import type { HashtagSearchParams, UserSearchParams, TikTokPost, InstagramPost } from '@/src/types/social.type'
import apiClient from '../axios'

export class TikTokScrapingApi {
  async searchByHashtags(params: HashtagSearchParams): Promise<TikTokPost[]> {
    console.log('[TikTokScraping] searchByHashtags params:', JSON.stringify(params, null, 2))
    const response = await apiClient.get<TikTokPost[]>('/api/v1/tiktok-scraping/hashtags', {
      params: {
        tags: params.tags.join(','),
        city: params.city,
        addressContains: params.addressContains,
        locationRequired: params.locationRequired,
        limit: params.limit,
      },
    })
    console.log('[TikTokScraping] searchByHashtags response:', JSON.stringify(response.data, null, 2))
    return response.data
  }

  async searchByUsers(params: UserSearchParams): Promise<TikTokPost[]> {
    console.log('[TikTokScraping] searchByUsers params:', JSON.stringify(params, null, 2))
    const response = await apiClient.get<TikTokPost[]>('/api/v1/tiktok-scraping/users', {
      params: {
        usernames: params.usernames.join(','),
        city: params.city,
        addressContains: params.addressContains,
        locationRequired: params.locationRequired,
        limit: params.limit,
      },
    })
    console.log('[TikTokScraping] searchByUsers response:', JSON.stringify(response.data, null, 2))
    return response.data
  }
}

export class InstagramScrapingApi {
  async searchByHashtags(params: HashtagSearchParams): Promise<InstagramPost[]> {
    console.log('[InstagramScraping] searchByHashtags params:', JSON.stringify(params, null, 2))
    const response = await apiClient.get<InstagramPost[]>('/api/v1/instagram-scraping/hashtags', {
      params: {
        tags: params.tags.join(','),
        limit: params.limit,
        locationRequired: params.locationRequired,
      },
    })
    console.log('[InstagramScraping] searchByHashtags response:', JSON.stringify(response.data, null, 2))
    return response.data
  }

  async searchByUsers(params: UserSearchParams): Promise<InstagramPost[]> {
    console.log('[InstagramScraping] searchByUsers params:', JSON.stringify(params, null, 2))
    const response = await apiClient.get<InstagramPost[]>('/api/v1/instagram-scraping/users', {
      params: {
        usernames: params.usernames.join(','),
        limit: params.limit,
        locationRequired: params.locationRequired,
      },
    })
    console.log('[InstagramScraping] searchByUsers response:', JSON.stringify(response.data, null, 2))
    return response.data
  }
}

export const tiktokScrapingApi = new TikTokScrapingApi()
export const instagramScrapingApi = new InstagramScrapingApi()
