import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '../config/env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_FILE = path.resolve(__dirname, '../../.cache/instagram-feed.json')
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const IMAGE_CACHE_DIR = path.resolve(__dirname, '../../.cache/instagram-images')
const MAX_POSTS = 12

const USERNAME = () =>
  (env.instagram.username || 'auraofnatureofficial').replace(/^@/, '').trim()

const PROFILE_URL = () => `https://www.instagram.com/${USERNAME()}/`

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

function isUsableSecret(value) {
  if (!value || typeof value !== 'string') return false
  const v = value.trim().toLowerCase()
  if (!v) return false
  return !(
    v.includes('your_') ||
    v.includes('replace') ||
    v === 'changeme' ||
    v === 'xxx'
  )
}

/** Always-available local fallback — UI must never be empty */
const FALLBACK = {
  profile: {
    displayName: 'Aura of Nature',
    handle: '@auraofnatureofficial',
    profileUrl: 'https://www.instagram.com/auraofnatureofficial/',
    avatarSrc: '/instagram/profile.png',
    bio: 'Pure · Natural · Nourishing botanical rituals for skin, body & hair.',
    verified: true,
    stats: { posts: 163, followers: 7200, following: 0 },
  },
  posts: [
    {
      id: 'fallback-1',
      image: '/products/fresh-coffee-face-wash/04-hero-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Fresh Coffee Face Wash',
      isVideo: false,
    },
    {
      id: 'fallback-2',
      image: '/products/Lavender-Oil/Lavender-oil-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Lavender Essential Oil',
      isVideo: false,
    },
    {
      id: 'fallback-3',
      image: '/products/Wild-Apricot/Wild-Apricot-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Wild Apricot Cold Pressed Oil',
      isVideo: false,
    },
    {
      id: 'fallback-4',
      image: '/products/Eucalyptus-Oil/Eucalyptus-Oil-01-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Eucalyptus Essential Oil',
      isVideo: true,
    },
    {
      id: 'fallback-5',
      image: '/products/Jojoba-oil/Jojoba-Oil-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Jojoba Cold Pressed Oil',
      isVideo: false,
    },
    {
      id: 'fallback-6',
      image: '/products/Black-Cumin/Black-Cumin-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Black Cumin Cold Pressed Oil',
      isVideo: false,
    },
    {
      id: 'fallback-7',
      image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Tea Tree Essential Oil',
      isVideo: true,
    },
    {
      id: 'fallback-8',
      image: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Nourishing Peach Lotion',
      isVideo: false,
    },
    {
      id: 'fallback-9',
      image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Watermelon Seed Oil',
      isVideo: false,
    },
    {
      id: 'fallback-10',
      image: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
      url: 'https://www.instagram.com/auraofnatureofficial/',
      alt: 'Activated Charcoal Soap',
      isVideo: false,
    },
  ],
}

/** @type {{ at: number, payload: object } | null} */
let memoryCache = null

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function decodeHtml(str = '') {
  return String(str)
    .replace(/&#38;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function parseCount(raw) {
  if (raw == null) return null
  const s = String(raw).trim().toUpperCase().replace(/,/g, '')
  const m = s.match(/^([\d.]+)\s*([KMB])?$/)
  if (!m) {
    const n = Number(s)
    return Number.isFinite(n) ? Math.round(n) : null
  }
  const n = Number(m[1])
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[m[2]] || 1
  return Math.round(n * mult)
}

function readFileCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
    if (!raw?.payload?.posts?.length) return null
    return { at: Number(raw.at) || 0, payload: raw.payload }
  } catch {
    return null
  }
}

function writeFileCache(payload) {
  try {
    ensureDir(path.dirname(CACHE_FILE))
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ at: Date.now(), payload }, null, 2),
      'utf8',
    )
  } catch (err) {
    console.warn('[instagram] cache write failed:', err?.message)
  }
}

function isAllowedCdnHost(hostname) {
  const h = hostname.toLowerCase()
  return (
    h === 'cdninstagram.com' ||
    h.endsWith('.cdninstagram.com') ||
    h === 'fbcdn.net' ||
    h.endsWith('.fbcdn.net') ||
    h.endsWith('.instagram.com') ||
    h === 'imginn.com' ||
    h.endsWith('.imginn.com')
  )
}

function proxyImageUrl(remoteUrl) {
  if (!remoteUrl) return FALLBACK.profile.avatarSrc
  if (remoteUrl.startsWith('/')) return remoteUrl
  try {
    const host = new URL(remoteUrl).hostname
    if (!isAllowedCdnHost(host)) return remoteUrl
  } catch {
    return remoteUrl
  }
  const path = `/api/instagram/image?url=${encodeURIComponent(remoteUrl)}`
  // Absolute URL when API is on a different host than the static client (Render)
  return env.publicApiUrl ? `${env.publicApiUrl}${path}` : path
}

function mapWebEdge(edge) {
  const node = edge?.node || edge
  if (!node) return null
  const shortcode = node.shortcode || node.code
  const id = String(node.id || shortcode || '')
  if (!id) return null
  const isVideo = Boolean(node.is_video || node.media_type === 2)
  const image =
    node.thumbnail_src ||
    node.display_url ||
    node.image_versions2?.candidates?.[0]?.url ||
    ''
  const caption =
    node.edge_media_to_caption?.edges?.[0]?.node?.text ||
    node.caption?.text ||
    node.accessibility_caption ||
    'Aura of Nature on Instagram'

  return {
    id,
    shortcode: shortcode || id,
    image: proxyImageUrl(image),
    url: shortcode
      ? `https://www.instagram.com/p/${shortcode}/`
      : PROFILE_URL(),
    alt: String(caption).slice(0, 140),
    isVideo,
  }
}

function mapWebProfile(user) {
  const username = user.username || USERNAME()
  const edges =
    user.edge_owner_to_timeline_media?.edges ||
    user.edge_felix_video_timeline?.edges ||
    []

  const posts = edges.map(mapWebEdge).filter(Boolean).slice(0, MAX_POSTS)

  return {
    profile: {
      displayName: user.full_name || 'Aura of Nature',
      handle: `@${username}`,
      profileUrl: `https://www.instagram.com/${username}/`,
      avatarSrc: FALLBACK.profile.avatarSrc,
      bio: user.biography || FALLBACK.profile.bio,
      verified: Boolean(user.is_verified),
      stats: {
        posts: user.edge_owner_to_timeline_media?.count ?? posts.length,
        followers:
          user.edge_followed_by?.count ?? FALLBACK.profile.stats.followers,
        following: user.edge_follow?.count ?? FALLBACK.profile.stats.following,
      },
    },
    posts,
    source: 'web',
  }
}

async function fetchWebProfile() {
  const username = USERNAME()
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': CHROME_UA,
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-IG-App-ID': '936619743392459',
      'X-ASBD-ID': '129477',
      Referer: `https://www.instagram.com/${username}/`,
      Origin: 'https://www.instagram.com',
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`web_profile_info ${res.status}: ${text.slice(0, 160)}`)
  }

  const json = await res.json()
  const user = json?.data?.user
  if (!user) throw new Error('web_profile_info: missing data.user')

  const mapped = mapWebProfile(user)
  if (!mapped.posts.length) throw new Error('web_profile_info: no posts')
  return mapped
}

/** Public mirror used when Instagram web API is blocked (MGRM-style reliability) */
async function fetchImginnProfile() {
  const username = USERNAME()
  const res = await fetch(`https://imginn.com/${username}/`, {
    headers: {
      'User-Agent': CHROME_UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://imginn.com/',
    },
  })

  if (!res.ok) {
    throw new Error(`imginn ${res.status}`)
  }

  const html = await res.text()
  const posts = []
  const re = /<div class="item">([\s\S]*?)<\/div>\s*<\/div>/g
  let match
  while ((match = re.exec(html)) && posts.length < MAX_POSTS) {
    const block = match[1]
    const shortcode = block.match(/href="\/p\/([^"/]+)/)?.[1]
    const rawImg = block.match(/<img[^>]+src="([^"]+)"/)?.[1]
    const alt = decodeHtml(block.match(/alt="([^"]*)"/)?.[1] || '')
    const isVideo =
      /icon-video|is_video|class="[^"]*video|Reel|play-button/i.test(block) ||
      /video_default_cover|video_dash/i.test(rawImg || '')

    if (!shortcode || !rawImg) continue
    posts.push({
      id: shortcode,
      shortcode,
      image: proxyImageUrl(decodeHtml(rawImg)),
      url: `https://www.instagram.com/p/${shortcode}/`,
      alt: alt.slice(0, 140) || 'Aura of Nature on Instagram',
      isVideo,
    })
  }

  if (!posts.length) throw new Error('imginn: no posts parsed')

  const meta =
    decodeHtml(html.match(/content="([^"]*Followers[^"]*)"/i)?.[1] || '')
  const followers = parseCount(meta.match(/([\d.,]+[KMB]?)\s*Followers/i)?.[1])
  const following = parseCount(meta.match(/([\d.,]+[KMB]?)\s*Following/i)?.[1])
  const postCount = parseCount(meta.match(/([\d.,]+[KMB]?)\s*Posts/i)?.[1])

  const displayName =
    decodeHtml(html.match(/<h1[^>]*>([^<]+)</)?.[1] || '') || 'Aura of Nature'
  const bioRaw =
    html.match(/class="bio"[^>]*>([\s\S]*?)<\/div>/)?.[1] ||
    meta.split('.')[0] ||
    FALLBACK.profile.bio
  const bio = decodeHtml(String(bioRaw).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)

  return {
    profile: {
      displayName,
      handle: `@${username}`,
      profileUrl: PROFILE_URL(),
      avatarSrc: FALLBACK.profile.avatarSrc,
      bio: bio || FALLBACK.profile.bio,
      verified: true,
      stats: {
        posts: postCount ?? Math.max(posts.length, FALLBACK.profile.stats.posts),
        followers: followers ?? FALLBACK.profile.stats.followers,
        following: following ?? FALLBACK.profile.stats.following,
      },
    },
    posts,
    source: 'web',
  }
}

/** Optional Graph — only when real tokens exist; never required */
async function fetchFromGraphApi() {
  const accessToken = env.instagram.accessToken
  const userId = env.instagram.userId
  if (!isUsableSecret(accessToken) || !isUsableSecret(userId)) return null

  const fields =
    'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
  const url = new URL(`https://graph.instagram.com/v21.0/${userId}/media`)
  url.searchParams.set('fields', fields)
  url.searchParams.set('limit', String(MAX_POSTS))
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph API ${res.status}: ${text.slice(0, 160)}`)
  }
  const json = await res.json()
  const data = Array.isArray(json.data) ? json.data : []
  const posts = data
    .map((item) => {
      const isVideo = item.media_type === 'VIDEO' || item.media_type === 'REELS'
      const image = isVideo
        ? item.thumbnail_url || item.media_url
        : item.media_url
      if (!image) return null
      return {
        id: String(item.id),
        image: proxyImageUrl(image),
        url: item.permalink || PROFILE_URL(),
        alt: (item.caption || 'Aura of Nature on Instagram').slice(0, 140),
        isVideo,
      }
    })
    .filter(Boolean)

  if (!posts.length) return null

  return {
    profile: {
      ...FALLBACK.profile,
      profileUrl: PROFILE_URL(),
      handle: `@${USERNAME()}`,
      stats: {
        ...FALLBACK.profile.stats,
        posts: Math.max(FALLBACK.profile.stats.posts, posts.length),
      },
    },
    posts,
    source: 'graph',
  }
}

function withMeta(payload, { cached = false, stale = false, warning } = {}) {
  const posts = Array.isArray(payload.posts)
    ? payload.posts.slice(0, MAX_POSTS)
    : []
  return {
    ...payload,
    posts,
    cached,
    stale,
    ...(warning ? { warning } : {}),
  }
}

/**
 * Load Instagram profile + posts.
 * Priority: fresh cache → Graph (optional) → IG web API → public mirror → stale cache → static
 */
export async function getInstagramProfile() {
  const now = Date.now()

  if (memoryCache?.payload?.posts?.length && now - memoryCache.at < CACHE_TTL_MS) {
    return withMeta(memoryCache.payload, { cached: true })
  }

  const fileCache = memoryCache || readFileCache()
  if (fileCache?.payload?.posts?.length && now - fileCache.at < CACHE_TTL_MS) {
    memoryCache = fileCache
    return withMeta(fileCache.payload, { cached: true })
  }

  let warning = null

  try {
    const graph = await fetchFromGraphApi()
    if (graph?.posts?.length) {
      memoryCache = { at: now, payload: graph }
      writeFileCache(graph)
      return withMeta(graph, { cached: false })
    }
  } catch (err) {
    warning = err instanceof Error ? err.message : 'Graph fetch failed'
    console.warn('[instagram]', warning)
  }

  try {
    const web = await fetchWebProfile()
    memoryCache = { at: now, payload: web }
    writeFileCache(web)
    return withMeta(web, { cached: false, warning: warning || undefined })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Web fetch failed'
    warning = warning ? `${warning}; ${msg}` : msg
    console.warn('[instagram]', msg)
  }

  try {
    const mirror = await fetchImginnProfile()
    memoryCache = { at: now, payload: mirror }
    writeFileCache(mirror)
    return withMeta(mirror, { cached: false, warning: warning || undefined })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Mirror fetch failed'
    warning = warning ? `${warning}; ${msg}` : msg
    console.warn('[instagram]', msg)
  }

  const stale = fileCache || memoryCache || readFileCache()
  if (stale?.payload?.posts?.length && stale.payload.source !== 'fallback') {
    memoryCache = stale
    return withMeta(stale.payload, { cached: true, stale: true, warning })
  }

  return withMeta(
    {
      ...FALLBACK,
      posts: FALLBACK.posts.slice(0, MAX_POSTS),
      source: 'fallback',
    },
    { cached: false, warning },
  )
}

export function warmInstagramCache() {
  const fileCache = readFileCache()
  if (fileCache?.payload?.posts?.length) {
    memoryCache = fileCache
    console.log('[instagram] warmed cache from disk')
  }
}

export function isAllowedInstagramImageUrl(rawUrl) {
  try {
    const u = new URL(rawUrl)
    if (u.protocol !== 'https:') return false
    return isAllowedCdnHost(u.hostname)
  } catch {
    return false
  }
}

function imageCachePath(url) {
  const hash = Buffer.from(url).toString('base64url').slice(0, 64)
  return path.join(IMAGE_CACHE_DIR, hash)
}

async function tryCloudinaryMirror(remoteUrl) {
  const { cloudName, apiKey, apiSecret } = env.cloudinary
  if (!cloudName || !apiKey || !apiSecret) return null
  try {
    const { v2: cloudinary } = await import('cloudinary')
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    const result = await cloudinary.uploader.upload(remoteUrl, {
      folder: 'aura-instagram',
      overwrite: false,
      type: 'upload',
    })
    return result?.secure_url || null
  } catch (err) {
    console.warn('[instagram] cloudinary mirror failed:', err?.message)
    return null
  }
}

export async function fetchProxiedImage(remoteUrl) {
  if (!isAllowedInstagramImageUrl(remoteUrl)) {
    throw Object.assign(new Error('Host not allowed'), { status: 400 })
  }

  ensureDir(IMAGE_CACHE_DIR)
  const diskPath = imageCachePath(remoteUrl)
  const metaPath = `${diskPath}.meta.json`

  try {
    if (fs.existsSync(diskPath) && fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      if (Date.now() - (meta.at || 0) < IMAGE_CACHE_TTL_MS) {
        if (meta.redirectUrl) return { redirectUrl: meta.redirectUrl }
        return {
          buffer: fs.readFileSync(diskPath),
          contentType: meta.contentType || 'image/jpeg',
        }
      }
    }
  } catch {
    /* ignore */
  }

  // Prefer fast disk/proxy path — Cloudinary upload was blocking every image and freezing the UI
  const res = await fetch(remoteUrl, {
    headers: {
      'User-Agent': CHROME_UA,
      Referer: 'https://imginn.com/',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  })

  if (!res.ok) {
    // Last resort: try Cloudinary only if upstream fails
    const mirrored = await tryCloudinaryMirror(remoteUrl)
    if (mirrored) return { redirectUrl: mirrored }
    throw Object.assign(new Error(`Upstream image ${res.status}`), {
      status: 502,
    })
  }

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())

  try {
    fs.writeFileSync(diskPath, buffer)
    fs.writeFileSync(metaPath, JSON.stringify({ at: Date.now(), contentType }))
  } catch {
    /* ignore */
  }

  return { buffer, contentType }
}
