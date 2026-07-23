import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from '@/lib/seo'

type JsonLd = Record<string, unknown> | Record<string, unknown>[]

type SeoProps = {
  title?: string
  description?: string
  canonical?: string
  image?: string
  type?: 'website' | 'product' | 'article'
  noindex?: boolean
  jsonLd?: JsonLd
}

function upsertMeta(
  selector: string,
  create: () => HTMLElement,
  content: string,
) {
  let el = document.querySelector(selector) as HTMLElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

function upsertLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
  return link
}

/** Head manager — titles, meta, Open Graph, Twitter, JSON-LD */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const { pathname } = useLocation()
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = canonical ? absoluteUrl(canonical) : absoluteUrl(pathname)
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    document.title = pageTitle

    upsertMeta(
      'meta[name="description"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'description')
        return m
      },
      description,
    )

    upsertMeta(
      'meta[name="robots"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'robots')
        return m
      },
      noindex ? 'noindex,nofollow' : 'index,follow',
    )

    upsertLink('canonical', url)

    const ogTags: [string, string][] = [
      ['og:title', pageTitle],
      ['og:description', description],
      ['og:type', type],
      ['og:url', url],
      ['og:site_name', SITE_NAME],
      ['og:image', image],
      ['og:locale', 'en_IN'],
    ]

    for (const [property, content] of ogTags) {
      upsertMeta(
        `meta[property="${property}"]`,
        () => {
          const m = document.createElement('meta')
          m.setAttribute('property', property)
          return m
        },
        content,
      )
    }

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'twitter:card')
        return m
      },
      'summary_large_image',
    )
    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'twitter:title')
        return m
      },
      pageTitle,
    )
    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'twitter:description')
        return m
      },
      description,
    )
    upsertMeta(
      'meta[name="twitter:image"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('name', 'twitter:image')
        return m
      },
      image,
    )

    const existing = document.getElementById('aura-jsonld')
    existing?.remove()

    if (jsonLd) {
      const script = document.createElement('script')
      script.id = 'aura-jsonld'
      script.type = 'application/ld+json'
      script.textContent = jsonLdKey
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById('aura-jsonld')?.remove()
    }
  }, [pageTitle, description, url, image, type, noindex, jsonLdKey, pathname])

  return null
}
