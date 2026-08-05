import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@utils/index'

type AccordionVariant = 'default' | 'faq'

type AccordionItemProps = {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
  variant?: AccordionVariant
}

export function AccordionItem({
  title,
  open,
  onToggle,
  children,
  variant = 'default',
}: AccordionItemProps) {
  const isFaq = variant === 'faq'

  return (
    <div
      className={cn(
        'border-b',
        isFaq ? 'border-charcoal/8' : 'border-charcoal/10',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between text-left transition-colors',
          isFaq ? 'gap-4 py-4 hover:text-forest md:py-5' : 'py-5',
        )}
        aria-expanded={open}
      >
        <span
          className={cn(
            isFaq
              ? 'text-[0.95rem] leading-snug font-medium text-forest md:text-[1.02rem]'
              : 'font-display text-xl text-forest',
          )}
        >
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-forest/55 transition-transform duration-300',
            open && 'rotate-180',
          )}
          strokeWidth={1.75}
        />
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className={cn(isFaq ? 'pb-5' : 'pb-6')}>{children}</div>
        </div>
      </div>
    </div>
  )
}

type AccordionProps = {
  items: { title: string; content: ReactNode }[]
  defaultOpen?: number | null
  variant?: AccordionVariant
}

export function Accordion({
  items,
  defaultOpen = 0,
  variant = 'default',
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          open={openIndex === index}
          onToggle={() =>
            setOpenIndex((prev) => (prev === index ? null : index))
          }
          variant={variant}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
