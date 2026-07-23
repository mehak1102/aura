import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { cn } from '@utils/index'
import { Body, Eyebrow } from '@components/ui'

type ProductTabsProps = {
  product: CatalogProduct
}

function AccordionItem({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-charcoal/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-xl text-forest">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [open, setOpen] = useState('benefits')

  const toggle = (id: string) => setOpen((prev) => (prev === id ? '' : id))

  return (
    <section className="mt-16 border-t border-charcoal/10 pt-2">
      <AccordionItem
        title="Benefits"
        open={open === 'benefits'}
        onToggle={() => toggle('benefits')}
      >
        <ul className="space-y-3">
          {product.benefits.map((b) => (
            <li key={b} className="flex gap-3 text-charcoal-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-soft-gold" />
              {b}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Ingredients"
        open={open === 'ingredients'}
        onToggle={() => toggle('ingredients')}
      >
        <div className="flex flex-wrap gap-2">
          {product.ingredients.map((ing) => (
            <span
              key={ing}
              className="rounded-full border border-charcoal/10 px-3 py-1.5 text-sm"
            >
              {ing}
            </span>
          ))}
        </div>
      </AccordionItem>

      <AccordionItem
        title="How to use"
        open={open === 'howto'}
        onToggle={() => toggle('howto')}
      >
        <ol className="space-y-3">
          {product.howToUse.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="text-micro text-soft-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Body muted>{step}</Body>
            </li>
          ))}
        </ol>
      </AccordionItem>

      <AccordionItem
        title="Skin & hair"
        open={open === 'types'}
        onToggle={() => toggle('types')}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Eyebrow tone="gold">Skin types</Eyebrow>
            <p className="mt-2 text-sm capitalize text-charcoal-muted">
              {product.skinTypes.join(', ')}
            </p>
          </div>
          <div>
            <Eyebrow tone="gold">Hair types</Eyebrow>
            <p className="mt-2 text-sm capitalize text-charcoal-muted">
              {product.hairTypes.join(', ')}
            </p>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem
        title="FAQs"
        open={open === 'faqs'}
        onToggle={() => toggle('faqs')}
      >
        <div className="space-y-5">
          {product.faqs.map((faq) => (
            <div key={faq.question}>
              <p className="font-medium text-charcoal">{faq.question}</p>
              <Body muted className="mt-2">
                {faq.answer}
              </Body>
            </div>
          ))}
        </div>
      </AccordionItem>
    </section>
  )
}
