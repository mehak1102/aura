import { ROUTES } from '@/routes/paths'

export type Botanical = {
  slug: string
  name: string
  latin: string
  image: string
  benefits: string[]
  howItWorks: string
  /** Substrings matched against product.ingredients */
  matchTerms: string[]
  productSlugs: string[]
}

export const botanicals: Botanical[] = [
  {
    slug: 'coffee',
    name: 'Coffee',
    latin: 'Coffea arabica',
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Gently buffs dull surface cells',
      'Wake-up aroma for morning rituals',
      'Supports a clearer-looking complexion',
    ],
    howItWorks:
      'Finely milled coffee provides mild physical polish while antioxidants in the brew support skin that looks more awake. We pair it with plant cleansers so the ritual feels refreshing, never abrasive.',
    matchTerms: ['coffee', 'coffea'],
    productSlugs: ['fresh-coffee-face-wash'],
  },
  {
    slug: 'rosemary',
    name: 'Rosemary',
    latin: 'Rosmarinus officinalis',
    image:
      'https://images.unsplash.com/photo-1515586007056-585861e175a6?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Fresh herbal clarity for scalp and skin',
      'Pairs well with oil rituals',
      'Invigorating scent for focus',
    ],
    howItWorks:
      'Rosemary’s aromatic compounds are traditionally used to refresh the scalp and enliven oil blends. We use it thoughtfully so fragrance supports the ritual without overwhelming sensitive skin.',
    matchTerms: ['rosemary'],
    productSlugs: ['black-cumin-cold-pressed-oil', 'tea-tree-essential-oil'],
  },
  {
    slug: 'watermelon-seed-oil',
    name: 'Watermelon seed oil',
    latin: 'Citrullus lanatus',
    image: '/products/Watermelon/Watermelon-02.png',
    benefits: [
      'Lightweight moisture that absorbs fast',
      'Supports even-looking tone over time',
      'Ideal under SPF or makeup',
    ],
    howItWorks:
      'Cold-pressed watermelon seed oil is naturally rich in essential fatty acids. It sinks in quickly, making it a modern Ayurvedic choice for oily-to-combination skin that still needs true nourishment.',
    matchTerms: ['watermelon'],
    productSlugs: ['watermelon-seed-cold-pressed-oil'],
  },
  {
    slug: 'turmeric',
    name: 'Turmeric',
    latin: 'Curcuma longa',
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Classic Ayurvedic brightening botanical',
      'Supports a calm, even look',
      'Warm golden ritual energy',
    ],
    howItWorks:
      'Turmeric has been used for centuries in ubtan and oil rituals. In modern formulas it is balanced carefully so you get the glow story without staining everyday wear.',
    matchTerms: ['turmeric', 'kumkumadi', 'curcuma'],
    productSlugs: ['nourishing-peach-lotion-kumkumadi-oil'],
  },
  {
    slug: 'aloe-vera',
    name: 'Aloe vera',
    latin: 'Aloe barbadensis',
    image:
      'https://images.unsplash.com/photo-1632383421546-8d27f2c0f3c7?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Cooling comfort after cleanse',
      'Light hydration for reactive skin',
      'Pairs with oils without heaviness',
    ],
    howItWorks:
      'Aloe’s polysaccharide gel soothes and hydrates. We lean on its comfort profile in rituals meant for sensitive or post-cleanse skin.',
    matchTerms: ['aloe'],
    productSlugs: ['cucumber-seed-cold-pressed-oil', 'goat-milk-soap'],
  },
  {
    slug: 'tea-tree',
    name: 'Tea tree',
    latin: 'Melaleuca alternifolia',
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01.png',
    benefits: [
      'Clarifying for blemish-prone skin',
      'Fresh scalp companion',
      'Potent — always dilute',
    ],
    howItWorks:
      'Tea tree essential oil is prized for its clarifying aroma and traditional skin uses. Always dilute in a carrier; never apply neat to broken or under-eye skin.',
    matchTerms: ['tea tree', 'melaleuca'],
    productSlugs: ['tea-tree-essential-oil'],
  },
  {
    slug: 'lavender',
    name: 'Lavender',
    latin: 'Lavandula angustifolia',
    image: '/products/Lavender-Oil/Lavender-oil-02.png',
    benefits: [
      'Calming evening aroma',
      'Gentle companion for sensitive rituals',
      'Softens the close of the day',
    ],
    howItWorks:
      'Lavender’s esters support a quiet nervous system and a softer skin ritual. Ideal on pulse points or diluted in carrier oils before rest.',
    matchTerms: ['lavender', 'lavandula'],
    productSlugs: ['lavender-essential-oil'],
  },
  {
    slug: 'jojoba',
    name: 'Jojoba',
    latin: 'Simmondsia chinensis',
    image: '/products/Jojoba-oil/Jojoba-Oil-02.png',
    benefits: [
      'Mimics skin’s natural oils',
      'Balances without clogging feel',
      'Universal carrier for blends',
    ],
    howItWorks:
      'Jojoba is technically a liquid wax ester — structurally close to human sebum — which is why it feels “right” on most skin types and makes an excellent base for essential oils.',
    matchTerms: ['jojoba', 'simmondsia'],
    productSlugs: ['jojoba-cold-pressed-oil'],
  },
  {
    slug: 'charcoal',
    name: 'Activated charcoal',
    latin: 'Carbo activatus',
    image: '/products/Activated-Charcoal/activated-Charcoal-01.png',
    benefits: [
      'Draws surface impurities',
      'Deep-clean feel without perfume overload',
      'Ideal 2–3× weekly for congested skin',
    ],
    howItWorks:
      'Activated charcoal’s porous structure binds oils and pollutants on the skin’s surface during a cleanse, then rinses away — leaving skin looking clearer.',
    matchTerms: ['charcoal'],
    productSlugs: ['activated-charcoal-soap'],
  },
]

export function getBotanicalBySlug(slug: string) {
  return botanicals.find((b) => b.slug === slug)
}

export function botanicalPath(slug: string) {
  return `${ROUTES.ingredients}/${slug}`
}
