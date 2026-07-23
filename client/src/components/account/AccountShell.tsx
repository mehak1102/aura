import type { ReactNode } from 'react'
import { AccountNav } from './AccountNav'

type AccountShellProps = {
  children: ReactNode
}

export function AccountShell({ children }: AccountShellProps) {
  return (
    <section className="pt-28 md:pt-32">
      <div className="container-aura flex flex-col gap-10 pb-[var(--spacing-section)] lg:flex-row lg:gap-16">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}
