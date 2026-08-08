import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, Instagram } from 'lucide-react'
import { instagramProfile, type InstagramPost } from '@/data/home'
import { instagramApi } from '@/services/api/instagram'
import { useInView } from '@hooks/useInView'
import { cn } from '@utils/index'

type SiteInstagramProps = {
  profile?: typeof instagramProfile
  posts?: InstagramPost[]
  /** Skip API and use static profile only */
  staticOnly?: boolean
}

function formatStat(n: number) {
  return new Intl.NumberFormat('en-IN').format(n)
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

/**
 * Instagram-style brand strip — profile header above the footer via RootLayout.
 * Post carousel temporarily removed.
 */
export function SiteInstagram({
  profile: profileProp,
  staticOnly = false,
}: SiteInstagramProps = {}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const nearView = useInView(sectionRef, { threshold: 0.01, rootMargin: '160px 0px' })

  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState(profileProp ?? instagramProfile)

  useEffect(() => {
    if (nearView) setReady(true)
  }, [nearView])

  useEffect(() => {
    if (!ready) return
    let cancelled = false

    async function run() {
      if (staticOnly || profileProp) {
        if (!cancelled) setProfile(profileProp ?? instagramProfile)
        return
      }

      try {
        const feed = await instagramApi.getProfile()
        if (!cancelled) setProfile(feed.profile)
      } catch {
        if (!cancelled) setProfile(instagramProfile)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [ready, profileProp, staticOnly])

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
    </section>
  )
}
