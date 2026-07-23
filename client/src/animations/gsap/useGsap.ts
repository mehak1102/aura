import { useLayoutEffect, useRef, type DependencyList } from 'react'
import { gsap, registerGsap, prefersReducedMotion } from './core'

type ContextFn = () => void | (() => void)

/** Run GSAP setup in a scoped context; auto-cleans on unmount */
export function useGsap(factory: ContextFn, deps: DependencyList = []) {
  const scope = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    registerGsap()
    if (prefersReducedMotion()) return

    let extraCleanup: void | (() => void)
    const ctx = gsap.context(() => {
      extraCleanup = factory()
    }, scope)

    return () => {
      extraCleanup?.()
      ctx.revert()
    }
    // deps intentionally controlled by caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
