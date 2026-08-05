/**
 * Typo-tolerant text matching for search.
 *
 * Scores run 0 (no match) → 1 (exact). Ranked highest-first so callers can
 * both filter and order by relevance.
 */

export type FuzzyField = {
  value: string | undefined | null
  /** Scales this field's score so titles can outrank descriptions. */
  weight?: number
}

/** Below this, a match is too loose to show. */
export const FUZZY_THRESHOLD = 0.34

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s-]+/g, ' ')
    .trim()
}

/** Levenshtein distance, abandoned early once it exceeds `max`. */
function editDistance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i
    let rowBest = curr[0]!

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j]! + 1,
        curr[j - 1]! + 1,
        prev[j - 1]! + cost,
      )
      if (curr[j]! < rowBest) rowBest = curr[j]!
    }

    if (rowBest > max) return max + 1
    ;[prev, curr] = [curr, prev]
  }

  return prev[b.length]!
}

/** Typos allowed for a query token — longer words tolerate more. */
function allowedTypos(length: number) {
  if (length >= 8) return 2
  if (length >= 5) return 1
  if (length >= 4) return 1
  return 0
}

function tokenScore(queryToken: string, textToken: string) {
  if (queryToken === textToken) return 1
  if (textToken.startsWith(queryToken)) return 0.9
  if (textToken.includes(queryToken)) return 0.72

  const max = allowedTypos(queryToken.length)
  if (max === 0) return 0

  const distance = editDistance(queryToken, textToken, max)
  if (distance <= max) return 0.66 - (distance - 1) * 0.12

  // "lavendar oil" — typo against the leading slice of a longer word
  if (textToken.length > queryToken.length) {
    const prefix = textToken.slice(0, queryToken.length)
    const prefixDistance = editDistance(queryToken, prefix, max)
    if (prefixDistance <= max) return 0.58 - (prefixDistance - 1) * 0.12
  }

  return 0
}

/** How well `query` matches `text`, 0 → 1. */
export function fuzzyScore(query: string, text: string) {
  const q = normalizeText(query)
  const t = normalizeText(text)
  if (!q || !t) return 0

  if (t === q) return 1
  if (t.startsWith(q)) return 0.95
  if (t.includes(q)) return 0.85

  const queryTokens = q.split(' ')
  const textTokens = t.split(' ')

  let total = 0
  for (const queryToken of queryTokens) {
    let best = 0
    for (const textToken of textTokens) {
      best = Math.max(best, tokenScore(queryToken, textToken))
      if (best === 1) break
    }
    // Every word in the query has to land somewhere, or it isn't a match.
    if (best === 0) return 0
    total += best
  }

  return (total / queryTokens.length) * 0.8
}

/** Best score across weighted fields. */
export function fuzzyFieldScore(query: string, fields: FuzzyField[]) {
  let best = 0
  for (const field of fields) {
    if (!field.value) continue
    const score = fuzzyScore(query, field.value) * (field.weight ?? 1)
    if (score > best) best = score
  }
  return best
}

/** Filter to matches and order them by relevance. */
export function fuzzyRank<T>(
  query: string,
  items: T[],
  getFields: (item: T) => FuzzyField[],
  options: { limit?: number; threshold?: number } = {},
): T[] {
  const { limit, threshold = FUZZY_THRESHOLD } = options
  if (!normalizeText(query)) return limit ? items.slice(0, limit) : items

  const scored: { item: T; score: number; index: number }[] = []

  items.forEach((item, index) => {
    const score = fuzzyFieldScore(query, getFields(item))
    if (score >= threshold) scored.push({ item, score, index })
  })

  scored.sort((a, b) => b.score - a.score || a.index - b.index)

  const ranked = scored.map((entry) => entry.item)
  return limit ? ranked.slice(0, limit) : ranked
}
