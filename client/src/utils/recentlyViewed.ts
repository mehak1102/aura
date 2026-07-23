const KEY = 'aura_recently_viewed'
const MAX = 8

export function getRecentlyViewedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function pushRecentlyViewed(slug: string) {
  const next = [slug, ...getRecentlyViewedSlugs().filter((s) => s !== slug)].slice(
    0,
    MAX,
  )
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
