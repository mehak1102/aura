import crypto from 'node:crypto'

/** In-memory reviews when Mongo is unavailable (dev / fallback). */
const memoryReviews = new Map()

export function reviewProductKey(productId) {
  return String(productId)
}

export function listMemoryReviews(productId) {
  return [...(memoryReviews.get(reviewProductKey(productId)) || [])]
}

export function listAllMemoryReviews() {
  const all = []
  for (const list of memoryReviews.values()) {
    all.push(...list)
  }
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function createMemoryReview({
  productId,
  userName,
  rating,
  title,
  comment,
}) {
  const review = {
    id: crypto.randomUUID(),
    productId: String(productId),
    userName,
    rating: Number(rating),
    title: title?.trim() || undefined,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    verified: false,
    status: 'pending',
  }
  const key = reviewProductKey(productId)
  const list = memoryReviews.get(key) || []
  list.unshift(review)
  memoryReviews.set(key, list)
  return review
}

export function updateMemoryReview(id, patch) {
  for (const [key, list] of memoryReviews.entries()) {
    const index = list.findIndex((r) => r.id === id)
    if (index === -1) continue
    const next = {
      ...list[index],
      ...patch,
      id: list[index].id,
      productId: list[index].productId,
    }
    list[index] = next
    memoryReviews.set(key, list)
    return next
  }
  return null
}

export function deleteMemoryReview(id) {
  for (const [key, list] of memoryReviews.entries()) {
    const index = list.findIndex((r) => r.id === id)
    if (index === -1) continue
    list.splice(index, 1)
    memoryReviews.set(key, list)
    return true
  }
  return false
}

export function publishedMemoryReviews(productId) {
  return listMemoryReviews(productId).filter((r) => r.status === 'published')
}
