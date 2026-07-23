import { Seo } from '@components/seo/Seo'
import { PolicyLayout } from '@components/content'
import { privacyPolicy } from '@/data/legal'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Aura of Nature collects, uses, and protects your personal information."
      />
      <PolicyLayout policy={privacyPolicy} />
    </>
  )
}
