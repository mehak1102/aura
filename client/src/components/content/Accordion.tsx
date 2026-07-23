import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@utils/index'

type AccordionItemProps = {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export function AccordionItem({
  title,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
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
            'h-4 w-4 shrink-0 transition-transform duration-300',
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

type AccordionProps = {
  items: { title: string; content: ReactNode }[]
  defaultOpen?: number
}

export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
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
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
