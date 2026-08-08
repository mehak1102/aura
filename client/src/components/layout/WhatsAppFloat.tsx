import { WhatsAppIcon } from '@components/ui'
import { contactInfo } from '@/data/stores'

/** Floating WhatsApp CTA */
export function WhatsAppFloat() {
  const digits = contactInfo.whatsapp.replace(/\D/g, '')
  const href = `https://wa.me/${digits}?text=${encodeURIComponent('Hi Aura of Nature — I’d like help choosing a ritual.')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 left-4 z-[var(--z-overlay)] inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_16px_rgba(37,211,102,0.35)] transition-transform hover:scale-105 md:bottom-8 md:left-8 md:h-12 md:w-12"
    >
      <WhatsAppIcon className="h-[1.15rem] w-[1.15rem] md:h-[1.35rem] md:w-[1.35rem]" />
    </a>
  )
}
