import { Seo } from '@components/seo/Seo'
import { PolicyLayout } from '@components/content'
import { shippingPolicy } from '@/data/legal'

export default function ShippingPolicyPage() {
  return (
    <>
      <Seo
        title="Shipping Policy"
        description="Delivery times, shipping costs, and tracking for Aura of Nature orders across India."
      />
      <PolicyLayout policy={shippingPolicy} />
    </>
  )
}
