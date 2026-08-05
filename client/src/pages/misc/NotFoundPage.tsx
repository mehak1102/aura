import { useNavigate } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow, Button } from '@components/ui'
import { ROUTES } from '@/routes/paths'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <Seo title="Page not found" noindex />
      <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-[var(--spacing-gutter)] pb-24 pt-32 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 50% 30%, rgba(184,151,92,0.1), transparent 70%)',
          }}
        />
        <Eyebrow tone="olive">404</Eyebrow>
        <Display as="h1" size="xl" className="mt-5 text-forest">
          This page has wandered off
        </Display>
        <Body muted className="mx-auto mt-5 max-w-md">
          The ritual you are looking for does not exist — perhaps it moved, or the
          link is outdated.
        </Body>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate(ROUTES.home)}>
            Back home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.shop)}
          >
            Browse shop
          </Button>
        </div>
      </main>
    </>
  )
}
