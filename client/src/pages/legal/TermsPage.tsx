import { Seo } from '@components/seo/Seo'
import { PolicyLayout } from '@components/content'
import { termsOfService } from '@/data/legal'

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description="Terms and conditions for using the Aura of Nature website and purchasing products."
      />
      <PolicyLayout policy={termsOfService} />
    </>
  )
}
