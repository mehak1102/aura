import { MessageCircle } from 'lucide-react'
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
      className="fixed bottom-6 left-5 z-[var(--z-overlay)] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-8 md:left-8"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
    </a>
  )
}
