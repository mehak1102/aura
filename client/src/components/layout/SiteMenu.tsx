import { Link, useNavigate } from 'react-router-dom'
import { menuGroups } from '@/lib/navigation'
import { Body, Display, Eyebrow, MagneticButton, TextLink } from '@components/ui'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

type SiteMenuProps = {
  open: boolean
  onClose: () => void
}

export function SiteMenu({ open, onClose }: SiteMenuProps) {
  const navigate = useNavigate()

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[var(--z-menu)] transition-[visibility] duration-0',
        open ? 'visible' : 'invisible delay-500',
      )}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-forest-deep/40 backdrop-blur-sm transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'absolute inset-y-0 left-0 flex w-full max-w-xl flex-col overflow-y-auto bg-cream shadow-[var(--shadow-lift)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:max-w-2xl',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="relative flex flex-1 flex-col px-[var(--spacing-gutter)] pb-12 pt-28">
          <div className="mb-10">
            <Eyebrow tone="olive">Navigate</Eyebrow>
            <Display as="p" size="md" className="mt-3 text-forest">
              Explore the ritual
            </Display>
          </div>

          <div className="grid flex-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-micro text-soft-gold">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={onClose}
                        className="font-display text-2xl text-charcoal transition-colors duration-300 hover:text-forest md:text-[1.65rem]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Body size="sm" muted className="max-w-xs">
              Handcrafted botanicals. Transparent ingredients. Rituals rooted in nature.
            </Body>
            <MagneticButton
              variant="primary"
              onClick={() => {
                onClose()
                navigate(ROUTES.shop)
              }}
            >
              Shop Now
            </MagneticButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            <TextLink to={ROUTES.contact} onClick={onClose}>
              Contact
            </TextLink>
            <TextLink to={ROUTES.privacy} onClick={onClose}>
              Privacy
            </TextLink>
            <TextLink to={ROUTES.terms} onClick={onClose}>
              Terms
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  )
}
