import { LuxurySlider } from '@components/slider'
import { luxurySlides } from '@/data/home'

/** Homepage ritual spotlight — linen atelier stage with luminous product panel. */
export function HomeExpectations() {
  return (
    <LuxurySlider
      slides={luxurySlides}
      eyebrow="The ritual edit"
    />
  )
}
