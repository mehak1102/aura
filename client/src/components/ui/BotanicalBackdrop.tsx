import { cn } from '@utils/index'

/**
 * Botanical still-life photo that dissolves into the page cream.
 * Sits behind page content as a soft top band.
 */
export function BotanicalBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden md:h-[42rem]',
        className,
      )}
    >
      <img
        src="/wishlist/wishlist-bg.png"
        alt=""
        className="h-full w-full object-cover object-[center_top] opacity-70"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cream)]/25 via-[var(--color-cream)]/70 to-[var(--color-cream)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-cream)] via-[var(--color-cream)]/35 to-transparent" />
    </div>
  )
}
