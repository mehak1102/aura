import { useCallback, useEffect, useRef, useState } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'
import {
  INSTAGRAM_URL,
  instagramPosts,
  instagramProfile,
  type InstagramPost,
} from '@/data/home'
import { instagramApi } from '@/services/api/instagram'
import { useInView } from '@hooks/useInView'
import { cn } from '@utils/index'

const MAX_POSTS = 12
/** First N tiles can start loading sooner; the rest wait for scroll into view */
const EAGER_TILES = 4

type SiteInstagramProps = {
  profile?: typeof instagramProfile
  posts?: InstagramPost[]
  /** Skip API and use static posts only */
  staticOnly?: boolean
}

function formatStat(n: number) {
  return new Intl.NumberFormat('en-IN').format(n)
}

function takePosts(list: InstagramPost[]) {
  return list.slice(0, MAX_POSTS)
}

function BrandAvatarFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-white text-[#b8975c]',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 28 26" className="h-9 w-9" fill="none">
        <path
          d="M14 2C11.2 7.2 9.5 11.5 9.5 15.2a4.5 4.5 0 0 0 9 0C18.5 11.5 16.8 7.2 14 2Z"
          fill="currentColor"
        />
        <path d="M14 8.5v10.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ProfileAvatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const showImg = Boolean(src) && !failed

  return (
    <div className="h-20 w-20 overflow-hidden rounded-full bg-white sm:h-24 sm:w-24">
      {showImg ? (
        <img
          src={src}
          alt={`${name} profile`}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <BrandAvatarFallback />
      )}
    </div>
  )
}

/** Loads image only when the tile is near the viewport (or marked eager). */
function PostImage({
  src,
  alt,
  fallbackSrc,
  eager = false,
}: {
  src: string
  alt: string
  fallbackSrc: string
  eager?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(eager)
  const [current, setCurrent] = useState(eager ? src : '')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (eager || active) return
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '120px 80px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager, active])

  useEffect(() => {
    if (!active) return
    setCurrent(src)
    setFailed(false)
  }, [active, src])

  if (failed) {
    return (
      <div ref={wrapRef} className="h-full w-full">
        <BrandAvatarFallback />
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="h-full w-full bg-neutral-100">
      {active && current ? (
        <img
          src={current}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority="low"
          width={280}
          height={280}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={() => {
            if (current !== fallbackSrc) setCurrent(fallbackSrc)
            else setFailed(true)
          }}
        />
      ) : null}
    </div>
  )
}

/**
 * Instagram-style brand strip (ACG layout) — profile header + dense media carousel.
 * Mounted above the footer on every page via RootLayout.
 */
export function SiteInstagram({
  profile: profileProp,
  posts: postsProp,
  staticOnly = false,
}: SiteInstagramProps = {}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLUListElement | null>(null)
  // Defer network until section is close — keep margin modest to avoid early load storms
  const nearView = useInView(sectionRef, { threshold: 0.01, rootMargin: '160px 0px' })

  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(profileProp ?? instagramProfile)
  const [posts, setPosts] = useState<InstagramPost[]>(
    postsProp ? takePosts(postsProp) : [],
  )
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (nearView) setReady(true)
  }, [nearView])

  useEffect(() => {
    if (!ready) return
    let cancelled = false

    async function run() {
      setLoading(true)
      try {
        if (postsProp) {
          if (!cancelled) {
            setPosts(takePosts(postsProp))
            if (profileProp) setProfile(profileProp)
          }
          return
        }

        if (staticOnly) {
          if (!cancelled) {
            setPosts(takePosts(instagramPosts))
            setProfile(profileProp ?? instagramProfile)
          }
          return
        }

        const feed = await instagramApi.getProfile()
        if (cancelled) return
        setPosts(takePosts(feed.posts))
        setProfile(profileProp ?? feed.profile)
      } catch {
        if (!cancelled) {
          setPosts(takePosts(instagramPosts))
          setProfile(profileProp ?? instagramProfile)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [ready, postsProp, profileProp, staticOnly])

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    if (loading || !ready) return
    const el = trackRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [loading, ready, posts.length, updateScrollState])

  const scrollByTiles = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const tile = el.querySelector<HTMLElement>('[data-ig-tile]')
    const tileW = tile?.getBoundingClientRect().width ?? el.clientWidth / 3
    el.scrollBy({ left: dir * tileW * 2, behavior: 'smooth' })
  }

  const stats = [
    { value: profile.stats.posts, label: 'Posts' },
    { value: profile.stats.followers, label: 'Followers' },
    { value: profile.stats.following, label: 'Following' },
  ]

  return (
    <section
      ref={sectionRef}
      aria-labelledby="site-instagram-heading"
      className="w-full border-t border-black/10 bg-[#f4efe6]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 520px' }}
    >
      {/* 1) Profile header */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6 lg:w-auto lg:flex-1">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 rounded-full bg-white ring-2 ring-[#E1306C]/30 transition hover:ring-[#E1306C]/60"
              aria-label={`${profile.displayName} on Instagram`}
            >
              <ProfileAvatar src={profile.avatarSrc} name={profile.displayName} />
            </a>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <h2
                id="site-instagram-heading"
                className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xl font-bold text-neutral-900 sm:text-2xl lg:justify-start"
              >
                {profile.displayName}
                {profile.verified ? (
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 fill-[#0095F6] text-white"
                    aria-label="Verified"
                  />
                ) : null}
              </h2>

              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-neutral-500 transition hover:text-neutral-800"
              >
                {profile.handle}
              </a>

              {profile.bio ? (
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500 max-[380px]:hidden sm:mx-0">
                  {profile.bio}
                </p>
              ) : null}

              <dl className="mt-4 flex justify-center gap-7 sm:gap-8 lg:justify-start">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-base font-bold tabular-nums text-neutral-900 sm:text-lg">
                      {formatStat(stat.value)}
                    </dd>
                    <p className="text-[0.7rem] text-neutral-500 sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-forest px-6 text-sm font-bold !text-white transition hover:bg-forest-deep"
          >
            <Instagram className="h-4 w-4 text-white" strokeWidth={2.25} aria-hidden />
            <span className="text-white">Follow</span>
          </a>
        </div>
      </div>

      {/* 2) Dense post strip — max 12, lazy per tile */}
      <div className="relative border-t border-black/10">
        {!ready || loading ? (
          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
            aria-busy="true"
            aria-label="Loading Instagram posts"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse border-r border-black/10 bg-neutral-100 last:border-r-0"
              />
            ))}
          </div>
        ) : (
          <>
            <ul
              ref={trackRef}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="list"
            >
              {posts.map((post, index) => (
                <li
                  key={post.id}
                  data-ig-tile
                  className="relative aspect-square w-[33.333%] shrink-0 snap-start border-r border-black/10 sm:w-1/4 md:w-1/5 lg:w-1/6"
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 220px' }}
                >
                  <a
                    href={post.url || INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-full w-full overflow-hidden bg-neutral-100"
                    aria-label={post.alt || 'Instagram post'}
                  >
                    <PostImage
                      src={post.image}
                      alt={post.alt}
                      fallbackSrc={
                        instagramPosts[index % instagramPosts.length]?.image ||
                        '/products/fresh-coffee-face-wash/04-hero-card.png'
                      }
                      eager={index < EAGER_TILES}
                    />

                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/40">
                      <Instagram
                        className="h-7 w-7 text-white opacity-0 transition duration-200 group-hover:opacity-100"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>

                    {post.isVideo ? (
                      <span className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Reel
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>

            {canPrev ? (
              <button
                type="button"
                aria-label="Previous Instagram posts"
                onClick={() => scrollByTiles(-1)}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-3 sm:h-11 sm:w-11"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
            ) : null}

            {canNext ? (
              <button
                type="button"
                aria-label="Next Instagram posts"
                onClick={() => scrollByTiles(1)}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70 sm:right-3 sm:h-11 sm:w-11"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
