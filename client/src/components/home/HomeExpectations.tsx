import { LuxurySlider } from '@components/slider'
import { luxurySlides } from '@/data/home'

/** Homepage ritual spotlight — three-column edit with featured + up-next cards. */
export function HomeExpectations() {
  return (
    <LuxurySlider
      slides={luxurySlides}
      eyebrow="The ritual edit"
    />
  )
}
