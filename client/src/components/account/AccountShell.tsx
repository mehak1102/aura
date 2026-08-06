import type { ReactNode } from 'react'
import { AccountNav } from './AccountNav'
import { LeafWatermarks } from '@components/ui'

type AccountShellProps = {
  children: ReactNode
}

export function AccountShell({ children }: AccountShellProps) {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <LeafWatermarks />

      <div className="container-aura relative flex flex-col gap-8 pb-[var(--spacing-section)] lg:flex-row lg:gap-12">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}
