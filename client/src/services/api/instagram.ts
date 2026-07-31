import { api } from './client'
import { API_ENDPOINTS } from './endpoints'
import { resolveApiUrl } from './resolveApiUrl'
import {
  INSTAGRAM_URL,
  instagramPosts,
  instagramProfile,
  type InstagramPost,
} from '@/data/home'
import type { ApiResponse } from '@/types'

export type InstagramFeedProfile = typeof instagramProfile

export type InstagramFeed = {
  profile: InstagramFeedProfile
  posts: InstagramPost[]
  source: 'web' | 'graph' | 'fallback' | string
  cached?: boolean
  stale?: boolean
  warning?: string
}

type InstagramFeedResponse = ApiResponse<InstagramFeed>

const MAX_POSTS = 12

function takePosts(posts: InstagramPost[]) {
  return posts.slice(0, MAX_POSTS).map((post) => ({
    ...post,
    image: resolveApiUrl(post.image),
  }))
}

export const instagramApi = {
  async getProfile(): Promise<InstagramFeed> {
    try {
      const { data } = await api.get<InstagramFeedResponse>(
        API_ENDPOINTS.instagram.profile,
        { timeout: 8000 },
      )
      const feed = data.data
      if (!feed?.posts?.length) {
        return {
          profile: instagramProfile,
          posts: takePosts(instagramPosts),
          source: 'fallback',
        }
      }
      return {
        profile: {
          ...instagramProfile,
          ...feed.profile,
          profileUrl: feed.profile?.profileUrl || INSTAGRAM_URL,
          avatarSrc: feed.profile?.avatarSrc || instagramProfile.avatarSrc,
          handle: feed.profile?.handle || instagramProfile.handle,
        },
        posts: takePosts(feed.posts),
        source: feed.source || 'fallback',
        cached: feed.cached,
        stale: feed.stale,
        warning: feed.warning,
      }
    } catch {
      return {
        profile: instagramProfile,
        posts: takePosts(instagramPosts),
        source: 'fallback',
      }
    }
  },

  /** @deprecated use getProfile */
  async getFeed() {
    return this.getProfile()
  },
}
