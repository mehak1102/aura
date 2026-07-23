import { Seo } from '@components/seo/Seo'
import { PolicyLayout } from '@components/content'
import { returnPolicy } from '@/data/legal'

export default function ReturnPolicyPage() {
  return (
    <>
      <Seo
        title="Return Policy"
        description="Aura of Nature return and refund policy — 15-day returns on unopened products."
      />
      <PolicyLayout policy={returnPolicy} />
    </>
  )
}
