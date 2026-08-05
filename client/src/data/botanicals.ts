import { ROUTES } from '@/routes/paths'

export type Botanical = {
  slug: string
  name: string
  latin: string
  image: string
  benefits: string[]
  howItWorks: string
  /** Short hero tagline under the name */
  tagline?: string
  /** Use-case chips for the “Used in” card */
  usedIn?: string[]
  /** Feature bar under products */
  features?: Array<{ label: string; detail: string }>
  /** Substrings matched against product.ingredients */
  matchTerms: string[]
  productSlugs: string[]
}

/** One entry per catalog product hero ingredient. */
export const botanicals: Botanical[] = [
  {
    slug: 'charcoal',
    name: 'Activated charcoal',
    latin: 'Carbo activatus',
    image: '/ingredients-showcase/01-charcoal.png',
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
  {
    slug: 'black-cumin',
    name: 'Black cumin',
    latin: 'Nigella sativa',
    image: '/ingredients-showcase/02-black-cumin.png',
    benefits: [
      'Deep nourishment for scalp and skin',
      'Supports stronger-feeling hair rituals',
      'Rich seed oil with a quiet finish',
      'Cold-pressed purity for daily care',
      'Pairs well with evening oil rituals',
    ],
    tagline: 'The Ancient Ayurvedic Super Seed',
    usedIn: ['Hair Oil', 'Face Oil', 'Beard Care', 'Massage Oil'],
    features: [
      { label: '100% Cold Pressed', detail: 'Pure & Natural' },
      { label: 'Rich In Omega 3 & 6', detail: 'Essential Fatty Acids' },
      { label: 'Ayurvedic Ingredient', detail: 'Ancient Wisdom' },
      { label: 'Suitable For All Hair Types', detail: 'Men & Women' },
    ],
    howItWorks:
      'Cold-pressed black cumin (kalonji) seed oil is prized in Ayurvedic hair and skin care for its dense fatty-acid profile. Use sparingly — a few drops go far on scalp or dry patches.',
    matchTerms: ['black cumin', 'nigella', 'kalonji'],
    productSlugs: ['black-cumin-cold-pressed-oil'],
  },
  {
    slug: 'carrot-seed',
    name: 'Carrot seed',
    latin: 'Daucus carota',
    image: '/ingredients-showcase/03-carrot-seed.png',
    benefits: [
      'Supports clearer-looking tone',
      'Restorative glow companion',
      'Always dilute before skin use',
    ],
    howItWorks:
      'Carrot seed essential oil is distilled from wild carrot seeds and traditionally used for skin that wants a brighter, more even look. Blend a few drops into a cold-pressed carrier before applying.',
    matchTerms: ['carrot seed', 'daucus'],
    productSlugs: ['carrot-seed-essential-oil'],
  },
  {
    slug: 'coffee',
    name: 'Coffee',
    latin: 'Coffea arabica',
    image: '/ingredients-showcase/04-coffee.png',
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
    slug: 'cucumber-seed',
    name: 'Cucumber seed',
    latin: 'Cucumis sativus',
    image: '/ingredients-showcase/05-cucumber-seed.png',
    benefits: [
      'Cooling comfort for everyday skin',
      'Lightweight antioxidant oil',
      'Softens without a heavy film',
    ],
    howItWorks:
      'Cold-pressed cucumber seed oil is naturally light and rich in antioxidants. It sinks in quickly, making it a calm companion for face, neck, and body — day or night.',
    matchTerms: ['cucumber'],
    productSlugs: ['cucumber-seed-cold-pressed-oil'],
  },
  {
    slug: 'eucalyptus',
    name: 'Eucalyptus',
    latin: 'Eucalyptus globulus',
    image: '/ingredients-showcase/06-eucalyptus.png',
    benefits: [
      'Crisp aromatic clarity',
      'Freshens air and ritual space',
      'Dilute before massage use',
    ],
    howItWorks:
      'Eucalyptus essential oil brings a clean, camphoraceous lift to diffusers and diluted body oils. Keep it aromatic-first — never apply undiluted to skin.',
    matchTerms: ['eucalyptus'],
    productSlugs: ['eucalyptus-essential-oil'],
  },
  {
    slug: 'goat-milk',
    name: 'Goat milk',
    latin: 'Caprae lac',
    image: '/ingredients-showcase/07-goat-milk.png',
    benefits: [
      'Creamy moisture without stripping',
      'Gentle cleanse for dry or sensitive skin',
      'Leaves skin soft and comforted',
    ],
    howItWorks:
      'Goat milk’s natural fats and gentle proteins support a soft, non-stripping cleanse. Ideal when skin wants comfort — especially in cooler weather or after long days outdoors.',
    matchTerms: ['goat milk', 'goat'],
    productSlugs: ['goat-milk-soap'],
  },
  {
    slug: 'jojoba',
    name: 'Jojoba',
    latin: 'Simmondsia chinensis',
    image: '/ingredients-showcase/08-jojoba.png',
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
    slug: 'lavender',
    name: 'Lavender',
    latin: 'Lavandula angustifolia',
    image: '/ingredients-showcase/09-lavender.png',
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
    slug: 'peach',
    name: 'Peach',
    latin: 'Prunus persica',
    image: '/ingredients-showcase/10-peach.png',
    benefits: [
      'Soft body moisture with a warm finish',
      'Pairs with Kumkumadi glow care',
      'Daily ritual for dry-to-normal skin',
    ],
    howItWorks:
      'Peach extract brings a soft, hydrating feel to body rituals. In our lotion it sits alongside Kumkumadi and complementary botanicals for skin that wants comfort and a smoother look.',
    matchTerms: ['peach', 'kumkumadi'],
    productSlugs: ['nourishing-peach-lotion-kumkumadi-oil'],
  },
  {
    slug: 'tea-tree',
    name: 'Tea tree',
    latin: 'Melaleuca alternifolia',
    image: '/ingredients-showcase/11-tea-tree.png',
    benefits: [
      'Clarifying for blemish-prone skin',
      'Fresh scalp companion',
      'Potent — always dilute',
    ],
    howItWorks:
      'Tea tree essential oil is prized for its clarifying aroma and traditional skin uses. Always dilute in a carrier; never apply neat to broken or under-eye skin.',
    matchTerms: ['tea tree', 'melaleuca'],
    productSlugs: ['tea-tree-essential-oil', 'fresh-coffee-face-wash'],
  },
  {
    slug: 'watermelon-seed-oil',
    name: 'Watermelon seed',
    latin: 'Citrullus lanatus',
    image: '/ingredients-showcase/12-watermelon.png',
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
    slug: 'wild-apricot',
    name: 'Wild apricot',
    latin: 'Prunus armeniaca',
    image: '/ingredients-showcase/13-wild-apricot.png',
    benefits: [
      'Softens dry, comfort-seeking skin',
      'Light cold-pressed nourishment',
      'Smooth finish for face and body',
    ],
    howItWorks:
      'Wild apricot kernel oil is cold-pressed for a light, comforting glide. Warm a few drops between palms and massage into skin that needs softness without heaviness.',
    matchTerms: ['apricot', 'armeniaca'],
    productSlugs: ['wild-apricot-cold-pressed-oil'],
  },
]

export function getBotanicalBySlug(slug: string) {
  return botanicals.find((b) => b.slug === slug)
}

export function botanicalPath(slug: string) {
  return `${ROUTES.ingredients}/${slug}`
}
