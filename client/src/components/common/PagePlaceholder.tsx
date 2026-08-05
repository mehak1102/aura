import { useNavigate } from 'react-router-dom'
import { Body, Display, Eyebrow, Button } from '@components/ui'
import { Seo } from '@components/seo/Seo'
import { ROUTES } from '@/routes/paths'

type PagePlaceholderProps = {
  title: string
  description?: string
  phase?: string
  seoDescription?: string
  noindex?: boolean
}

/** Temporary shell until each page is built in its phase */
export function PagePlaceholder({
  title,
  description = 'This page will be implemented in an upcoming phase.',
  phase = 'Aura of Nature',
  seoDescription,
  noindex = false,
}: PagePlaceholderProps) {
  const navigate = useNavigate()

  return (
    <>
      <Seo
        title={title}
        description={seoDescription || description}
        noindex={noindex}
      />
      <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-[var(--spacing-gutter)] pb-24 pt-32 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 50% 20%, rgba(184,151,92,0.12), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(90,107,72,0.1), transparent 60%)',
          }}
        />
        <Eyebrow tone="olive">{phase}</Eyebrow>
        <Display as="h1" size="xl" className="mt-5 max-w-3xl text-forest">
          {title}
        </Display>
        <Body muted className="mx-auto mt-5 max-w-md">
          {description}
        </Body>
        <div className="mt-10">
          <Button variant="outline" onClick={() => navigate(ROUTES.home)}>
            Back Home
          </Button>
        </div>
      </main>
    </>
  )
}
