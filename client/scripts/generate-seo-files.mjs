import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const catalogPath = path.join(root, 'server/src/data/catalog.json')
const publicDir = path.join(__dirname, '../public')

const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(
  /\/$/,
  '',
)

const staticPaths = [
  '/',
  '/about',
  '/our-story',
  '/ingredients',
  '/shop',
  '/shop/skin-care',
  '/shop/body-care',
  '/shop/hair-care',
  '/shop/essential-oils',
  '/shop/cold-pressed-oils',
  '/shop/combos',
  '/shop/best-sellers',
  '/shop/new-arrivals',
  '/search',
  '/blog',
  '/faq',
  '/contact',
  '/store-locator',
  '/privacy-policy',
  '/return-policy',
  '/shipping-policy',
  '/terms',
]

const blogSlugs = [
  'morning-skincare-ritual',
  'understanding-ayurvedic-skin-types',
  'benefits-of-cold-pressed-oils',
  'seasonal-skincare-winter',
  'essential-oils-for-sleep',
  'hair-oil-massage-guide',
]

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const productPaths = catalog.map((p) => `/product/${p.slug}`)
const blogPaths = blogSlugs.map((s) => `/blog/${s}`)
const allPaths = [...staticPaths, ...productPaths, ...blogPaths]

const urls = allPaths
  .map(
    (loc) => `  <url>
    <loc>${siteUrl}${loc}</loc>
    <changefreq>${loc.startsWith('/product/') || loc.startsWith('/blog/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${loc === '/' ? '1.0' : loc.startsWith('/product/') ? '0.8' : loc.startsWith('/blog/') ? '0.7' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `User-agent: *
Allow: /

Disallow: /account
Disallow: /auth
Disallow: /cart
Disallow: /checkout
Disallow: /order

Sitemap: ${siteUrl}/sitemap.xml
`

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots)

console.log(
  `Generated sitemap (${allPaths.length} URLs) and robots.txt for ${siteUrl}`,
)
