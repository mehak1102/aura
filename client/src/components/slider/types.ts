export type LuxurySlide = {
  id: string
  /** Single-line title (uppercased in UI) */
  title?: string
  /** Optional two-line editorial title — second line indented like the hotel */
  titleLines?: [string, string]
  subtitle: string
  description: string
  image: string
  imageAlt?: string
  cta?: { label: string; to: string }
}
