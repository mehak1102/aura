import { MotionPathPlugin } from './core'

type PathEaseConfig = {
  /** Drift slightly to smooth reverse curves (true → 7, or a custom sample window) */
  smooth?: boolean | number
  /** Sampling density along the path (higher = more accurate, more work) */
  precision?: number
  /** Axis to keep steady relative to scroll */
  axis?: 'x' | 'y'
}

function resolvePathEl(path: string | Element | Element[]): SVGPathElement {
  if (typeof path === 'string') {
    const found = document.querySelector(path)
    if (!found) throw new Error(`pathEase: no element for "${path}"`)
    return found as SVGPathElement
  }
  if (Array.isArray(path)) {
    if (!path[0]) throw new Error('pathEase: empty path array')
    return path[0] as SVGPathElement
  }
  return path as SVGPathElement
}

/**
 * Ease that bends time so a motion-path target moves steadily on one axis
 * as scroll progress advances linearly (GreenSock pathEase helper).
 */
export function pathEase(
  path: string | Element | Element[],
  config: PathEaseConfig = {},
): (p: number) => number {
  const axis = config.axis || 'y'
  const precision = config.precision || 1
  const rawPath = MotionPathPlugin.cacheRawPathMeasurements(
    MotionPathPlugin.getRawPath(resolvePathEl(path)),
    Math.round(precision * 12),
  )
  const useX = axis === 'x'
  const start = rawPath[0][useX ? 0 : 1]
  const lastSeg = rawPath[rawPath.length - 1]
  const end = lastSeg[lastSeg.length - (useX ? 2 : 1)]
  const range = end - start
  const l = Math.round(precision * 200)
  const inc = 1 / l
  const positions: number[] = [0]
  const a: number[] = [0]
  let minIndex = 0
  const smoothIdx: number[] = [0]
  const minChange = (1 / l) * 0.6
  const smoothRange =
    config.smooth === true ? 7 : Math.round(Number(config.smooth)) || 0
  const fullSmoothRange = smoothRange * 2

  const getClosest = (p: number) => {
    while (positions[minIndex]! <= p && minIndex++ < l) {
      /* advance */
    }
    const prev = positions[minIndex - 1]!
    const next = positions[minIndex]!
    a.push(((p - prev) / (next - prev)) * inc + minIndex * inc)
    if (
      smoothRange &&
      a.length > smoothRange &&
      a[a.length - 1]! - a[a.length - 2]! < minChange
    ) {
      smoothIdx.push(a.length - smoothRange)
    }
  }

  for (let i = 1; i < l; i++) {
    const pos = MotionPathPlugin.getPositionOnPath(rawPath, i / l) as {
      x: number
      y: number
    }
    positions[i] = (pos[axis] - start) / range
  }
  positions[l] = 1

  for (let i = 0; i < l; i++) {
    getClosest(i / l)
  }
  a.push(1)

  if (smoothRange) {
    smoothIdx.push(l - fullSmoothRange + 1)
    smoothIdx.forEach((idx) => {
      let i = idx
      const startVal = a[i]!
      const j = Math.min(i + fullSmoothRange, l)
      const step = (a[j]! - startVal) / (j - i)
      let c = 1
      i++
      for (; i < j; i++) {
        a[i] = startVal + step * c++
      }
    })
  }

  const last = a.length - 1
  return (p: number) => {
    const i = p * last
    const s = a[i | 0]!
    return i ? s + (a[Math.ceil(i)]! - s) * (i % 1) : 0
  }
}
