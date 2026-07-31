/**
 * Resolve API-relative asset paths against VITE_API_URL.
 * On Render the client and API are different hosts — `/api/...` in <img src>
 * would hit the static site and 404; rewrite to the absolute API origin.
 */
export function resolveApiUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith('data:')) {
    return pathOrUrl
  }

  const base = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api'

  // Dev / same-origin proxy — leave site-relative paths alone
  if (base === '/api' || base.startsWith('/')) {
    return pathOrUrl
  }

  // VITE_API_URL is absolute, e.g. https://api.example.com/api
  if (pathOrUrl.startsWith('/api/')) {
    return `${base}${pathOrUrl.slice(4)}`
  }

  if (pathOrUrl.startsWith('/')) {
    return `${base}${pathOrUrl}`
  }

  return pathOrUrl
}
