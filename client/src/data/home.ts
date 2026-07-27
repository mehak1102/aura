import { ROUTES } from '@/routes/paths'
import { productPath } from '@/lib/seo'
import type { LuxurySlide } from '@components/slider'

/** Homepage content — Aura of Nature as content reference, original copy */

export const heroContent = {
  eyebrow: 'Nature. Purity. You.',
  titleLines: ['Nature', 'Crafted.', 'Science', 'Perfected.'] as [
    string,
    string,
    string,
    string,
  ],
  subtitle:
    'Herbal skincare inspired by ancient wisdom and perfected through modern science.',
  image: '/hero/hero-fullscreen.png',
  imageAlt: 'Aura of Nature Radiance Face Serum in a forest portal scene',
}

export const storyContent = {
  eyebrow: 'Our Story',
  title: 'We are not just a formula. We are part of your ritual.',
  body: 'Following ancient Ayurvedic wisdom, we harvest plants at peak potency and prepare them by hand in small batches — unaltered recipes, transparent ingredients, honest care.',
  cta: { label: 'More about us', to: ROUTES.ourStory },
  image: '/hero/story-jojoba.png',
  imageAlt: 'Aura of Nature Jojoba Cold Pressed Oil',
  productSlug: 'jojoba-cold-pressed-oil',
}

export const collections = [
  {
    title: 'Skin Care',
    subtitle: 'Clarify · Nourish · Restore',
    to: ROUTES.skinCare,
    image: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
  },
  {
    title: 'Body Care',
    subtitle: 'Soft · Scented · Grounded',
    to: ROUTES.bodyCare,
    image: '/products/Goad-Milk-Soap/Goat-Milk-01-card.png',
  },
  {
    title: 'Hair Care',
    subtitle: 'Strengthen · Shine · Balance',
    to: ROUTES.hairCare,
    image: '/products/Black-Cumin/Black-Cumin-02-card.png',
  },
  {
    title: 'Essential Oils',
    subtitle: 'Aroma · Focus · Calm',
    to: ROUTES.essentialOils,
    image: '/products/Lavender-Oil/Lavender-oil-01-card.png',
  },
  {
    title: 'Cold Pressed Oils',
    subtitle: 'Raw · Potent · Pure',
    to: ROUTES.coldPressedOils,
    image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
  },
]

/** Grand Hotel–style horizontal editorial (Groups → Spaces → Book Now) */
export const editorialScroll = {
  groups: {
    title: ['Aura', 'Rituals'] as const,
    badge: 'Craft',
    scrollHint: 'Scroll and discover',
    body: [
      'Aura of Nature crafts botanical care in small batches — soaps, face washes, lotions, and oils prepared with Ayurvedic discipline.',
      'Every ritual begins with plants harvested at peak potency, declared ingredients, and formulas that stay true to the source.',
    ],
    cta: { label: 'Rituals', to: ROUTES.shop },
    images: {
      primary: '/products/fresh-coffee-face-wash/04-hero-card.png',
      primaryAlt: 'Fresh Coffee Face Wash',
      primaryTo: productPath('fresh-coffee-face-wash'),
      secondary: '/products/Goad-Milk-Soap/Goat-Milk-01-card.png',
      secondaryAlt: 'Goat Milk Handmade Soap',
      secondaryTo: productPath('goat-milk-soap'),
      tall: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
      tallAlt: 'Watermelon Seed Cold Pressed Oil',
      tallTo: productPath('watermelon-seed-cold-pressed-oil'),
    },
  },
  spaces: {
    title: 'Spaces',
    body: [
      'From daily face care to aromatic oils — each collection is a space for ritual, not a crowded shelf of noise.',
      'Explore essential oils and cold-pressed botanicals prepared without heat, so nutrients stay vivid and honest.',
    ],
    cta: { label: 'Spaces', to: ROUTES.essentialOils },
    images: {
      hero: '/products/Jojoba-oil/Jojoba-Oil-02-card.png',
      heroAlt: 'Jojoba Cold Pressed Oil',
      heroTo: productPath('jojoba-cold-pressed-oil'),
      main: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
      mainAlt: 'Nourishing Peach Lotion',
      mainTo: productPath('nourishing-peach-lotion-kumkumadi-oil'),
      overlap: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
      overlapAlt: 'Tea Tree Essential Oil',
      overlapTo: productPath('tea-tree-essential-oil'),
      detail: '/products/Lavender-Oil/Lavender-oil-02-card.png',
      detailAlt: 'Lavender Essential Oil',
      detailTo: productPath('lavender-essential-oil'),
    },
  },
  book: {
    title: 'Shop now',
    body: [
      'In every Aura ritual, guests share care, scent, and quiet moments that feel personal.',
      'Oils, soaps, and lotions are chosen for how they feel on skin — not how loudly they claim to transform it.',
      'Our atelier accompanies each formula from harvest to bottle — so you never have to wonder what is inside.',
    ],
    cta: { label: 'Experiences', to: ROUTES.bestSellers },
    images: {
      main: '/products/Wild-Apricot/Wild-Apricot-02-card.png',
      mainAlt: 'Wild Apricot Cold Pressed Oil',
      mainTo: productPath('wild-apricot-cold-pressed-oil'),
      overlap: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
      overlapAlt: 'Activated Charcoal Handmade Soap',
      overlapTo: productPath('activated-charcoal-soap'),
      accent: '/products/Black-Cumin/Black-Cumin-02-card.png',
      accentAlt: 'Black Cumin Cold Pressed Oil',
      accentTo: productPath('black-cumin-cold-pressed-oil'),
      detail: '/products/Carrot-seed-oil/Corrot-Seed-Oil-05-card.png',
      detailAlt: 'Carrot Seed Oil',
      detailTo: productPath('carrot-seed-essential-oil'),
      tertiary: '/products/Goad-Milk-Soap/Goat-Milk-02-card.png',
      tertiaryAlt: 'Goat Milk Handmade Soap',
      tertiaryTo: productPath('goat-milk-soap'),
    },
  },
}

/** Grand Hotel–style Restaurant & Bar split */
export const featuredSplit = {
  eyebrow: 'Our Collections',
  index: '01',
  title: 'Crafted Rituals for Skin & Mind.',
  subtitle:
    'Two quiet paths into care — soft botanicals for the skin, and pure scent for the mind.',
  bridgeImage: '/products/fresh-coffee-face-wash/02-bottle-front.png',
  bridgeImageSecondary: '/products/fresh-coffee-face-wash/01-box-front.png',
  bridgeAlt: 'Fresh Coffee Face Wash',
  bridgeTo: productPath('fresh-coffee-face-wash'),
  panels: [
    {
      label: 'Daily Rituals',
      title: 'Skincare',
      description:
        'Hydrate and nourish — formulas that soften the skin and restore its natural glow.',
      to: ROUTES.skinCare,
      productTo: productPath('nourishing-peach-lotion-kumkumadi-oil'),
      scene: '/products/_split/scene-skincare.png?v=2',
      image: '/products/Peach-Lotion/Peach-Lotion-section-trim.png',
      imageAlt: 'Nourishing Peach Lotion',
      glow: 'rgba(184, 151, 92, 0.35)',
      cta: 'Explore Skincare',
    },
    {
      label: 'Aromatherapy',
      title: 'Essential Oils',
      description:
        'Calming and soothing blends — pure botanicals for calm, breath, and inner balance.',
      to: ROUTES.essentialOils,
      productTo: productPath('lavender-essential-oil'),
      scene: '/products/_split/scene-oils.png?v=4',
      image: '/products/Lavender-Oil/Lavender-set.png?v=4',
      imageAlt: 'Lavender Essential Oil',
      glow: 'rgba(150, 120, 180, 0.3)',
      cta: 'Explore Essential Oils',
    },
  ],
}

export const concerns = [
  {
    id: 'acne',
    label: 'Acne & Blemishes',
    to: `${ROUTES.shop}?concern=acne`,
    icon: 'scan' as const,
    image: '/products/_ritual/peach.png',
    imageAlt: 'Peach lotion for acne-prone skin',
  },
  {
    id: 'dryness',
    label: 'Dryness',
    to: `${ROUTES.shop}?concern=dryness`,
    icon: 'droplet' as const,
    image: '/products/_ritual/goat-milk.png',
    imageAlt: 'Goat milk soap for dry skin',
  },
  {
    id: 'dullness',
    label: 'Dullness',
    to: `${ROUTES.shop}?concern=dullness`,
    icon: 'sparkles' as const,
    image: '/products/_ritual/tea-tree.png',
    imageAlt: 'Tea tree oil for dull skin',
  },
  {
    id: 'hairfall',
    label: 'Hair Fall',
    to: `${ROUTES.shop}?concern=hairfall`,
    icon: 'wind' as const,
    image: '/products/_ritual/black-cumin.png',
    imageAlt: 'Black cumin oil for hair fall',
  },
  {
    id: 'pigmentation',
    label: 'Pigmentation',
    to: `${ROUTES.shop}?concern=pigmentation`,
    icon: 'sun' as const,
    image: '/products/_ritual/coffee.png',
    imageAlt: 'Coffee face wash for pigmentation',
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity',
    to: `${ROUTES.shop}?concern=sensitivity`,
    icon: 'leaf' as const,
    image: '/products/_ritual/lavender.png',
    imageAlt: 'Lavender oil for sensitive skin',
  },
]

export const concernsQuiz = {
  prompt: 'Not sure? Take our skin quiz and let nature guide you.',
  cta: 'Take the quiz',
  to: ROUTES.skinQuiz,
}

/** Luxury slider slides — Grand Hotel editorial layout */
export const luxurySlides: LuxurySlide[] = [
  {
    id: 'coffee',
    titleLines: ['Morning', 'Grounding'],
    subtitle: 'Skin care ritual',
    description:
      'Fresh Coffee Face Wash — antioxidant-rich botanicals that awaken skin with a natural glow, every morning.',
    image: '/products/_ritual/coffee.png',
    imageAlt: 'Fresh Coffee Face Wash',
    cta: { label: 'Discover Ritual', to: productPath('fresh-coffee-face-wash') },
    features: ['Natural Ingredients', 'Daily Clarity', 'Dermatologically Tested'],
  },
  {
    id: 'peach',
    titleLines: ['Soft Skin', 'All Day'],
    subtitle: 'Body nourishment',
    description:
      'Nourishing Peach Lotion — lightweight moisture with the warmth of ripe peach and hand-finished botanical oils.',
    image: '/products/_ritual/peach.png',
    imageAlt: 'Nourishing Peach Lotion',
    cta: { label: 'Discover Ritual', to: productPath('nourishing-peach-lotion-kumkumadi-oil') },
    features: ['Natural Ingredients', 'Deep Nourishment', 'Dermatologically Tested'],
  },
  {
    id: 'lavender',
    titleLines: ['Calm In', 'Every Drop'],
    subtitle: 'Essential oils',
    description:
      'Lavender Essential Oil — distilled at peak bloom for serene aroma, restful evenings, and mindful rituals.',
    image: '/products/_ritual/lavender.png',
    imageAlt: 'Lavender Essential Oil',
    cta: { label: 'Discover Ritual', to: productPath('lavender-essential-oil') },
    features: ['100% Pure Oil', 'Calming Aroma', 'Skin & Mind'],
  },
  {
    id: 'goat',
    titleLines: ['Gentle', 'Cleansing'],
    subtitle: 'Handmade soap',
    description:
      'Goat Milk Soap — creamy lather and honest ingredients for skin that feels soft, never stripped.',
    image: '/products/_ritual/goat-milk.png',
    imageAlt: 'Goat Milk Soap',
    cta: { label: 'Discover Ritual', to: productPath('goat-milk-soap') },
    features: ['Handmade', 'Creamy Lather', 'Gentle Cleanse'],
  },
  {
    id: 'tea-tree',
    titleLines: ['Clear &', 'Balanced'],
    subtitle: 'Targeted care',
    description:
      'Tea Tree Essential Oil — clarifying botanical power for blemish-prone skin and a refreshed scalp ritual.',
    image: '/products/_ritual/tea-tree.png',
    imageAlt: 'Tea Tree Essential Oil',
    cta: { label: 'Discover Ritual', to: productPath('tea-tree-essential-oil') },
    features: ['Clarifying', 'Targeted Care', 'Botanical Power'],
  },
  {
    id: 'jojoba',
    titleLines: ['Pure Oil', 'Pure Skin'],
    subtitle: 'Cold pressed',
    description:
      'Jojoba Cold Pressed Oil — lightweight, vitamin-rich moisture that mirrors your skin\'s natural balance.',
    image: '/products/_ritual/jojoba.png',
    imageAlt: 'Jojoba Cold Pressed Oil',
    cta: { label: 'Discover Ritual', to: productPath('jojoba-cold-pressed-oil') },
    features: ['Cold Pressed', 'Vitamin Rich', 'Skin Balance'],
  },
  {
    id: 'cumin',
    titleLines: ['Strength', 'From Roots'],
    subtitle: 'Hair ritual',
    description:
      'Black Cumin Hair Oil — Ayurvedic botanicals to nourish roots, add shine, and restore confidence.',
    image: '/products/_ritual/black-cumin.png',
    imageAlt: 'Black Cumin Hair Oil',
    cta: { label: 'Discover Ritual', to: productPath('black-cumin-cold-pressed-oil') },
    features: ['Ayurvedic', 'Root Nourish', 'Natural Shine'],
  },
]

export const ingredients = [
  {
    name: 'Tea Tree',
    benefit: 'Removes blemishes and promotes hair growth',
    to: ROUTES.essentialOils,
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
  },
  {
    name: 'Lavender',
    benefit: 'Soothing aromatic oil for skin and hair',
    to: ROUTES.essentialOils,
    image: '/products/Lavender-Oil/Lavender-oil-01-card.png',
  },
  {
    name: 'Watermelon Seed',
    benefit: 'Fights uneven skin tone naturally',
    to: ROUTES.coldPressedOils,
    image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
  },
  {
    name: 'Activated Charcoal',
    benefit: 'Removes skin impurities and toxins',
    to: ROUTES.bodyCare,
    image: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
  },
]

export const categories = [
  { name: 'Skin Care', to: ROUTES.skinCare, count: '2 products' },
  { name: 'Body Care', to: ROUTES.bodyCare, count: '2 products' },
  { name: 'Essential Oils', to: ROUTES.essentialOils, count: '4 products' },
  { name: 'Cold Pressed Oils', to: ROUTES.coldPressedOils, count: '5 products' },
]

export const bestSellers = [
  {
    title: 'Activated Charcoal Handmade Soap',
    slug: 'activated-charcoal-soap',
    price: 299,
    mrp: 299,
    rating: 0,
    image: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
  },
  {
    title: 'Tea Tree Essential Oil',
    slug: 'tea-tree-essential-oil',
    price: 525,
    mrp: 525,
    rating: 0,
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
  },
  {
    title: 'Watermelon Seed Cold Pressed Oil',
    slug: 'watermelon-seed-cold-pressed-oil',
    price: 750,
    mrp: 750,
    rating: 0,
    image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
  },
  {
    title: 'Lavender Essential Oil',
    slug: 'lavender-essential-oil',
    price: 525,
    mrp: 525,
    rating: 0,
    image: '/products/Lavender-Oil/Lavender-oil-01-card.png',
  },
  {
    title: 'Fresh Coffee Face Wash',
    slug: 'fresh-coffee-face-wash',
    price: 499,
    mrp: 499,
    rating: 0,
    image: '/products/fresh-coffee-face-wash/04-hero-card.png',
  },
  {
    title: 'Nourishing Peach Lotion with Kumkumadi Oil',
    slug: 'nourishing-peach-lotion-kumkumadi-oil',
    price: 590,
    mrp: 590,
    rating: 0,
    image: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
  },
]

export const philosophy = [
  {
    title: 'Expertly handcrafted',
    body: 'Prepared manually in small batches by trained artisans until every ritual feels perfected.',
  },
  {
    title: 'Ayurvedic roots',
    body: 'Plants harvested at maximum potency, prepared with unaltered recipes passed through practice.',
  },
  {
    title: 'Honesty & transparency',
    body: 'We declare every ingredient — beauty that is inclusive, wholesome, and clear.',
  },
]

export const whyUs = [
  { value: 100, suffix: '%', label: 'Natural intent' },
  { value: 50, suffix: '+', label: 'Botanical formulas' },
  { value: 12, suffix: 'k', label: 'Rituals shared' },
  { value: 4.9, suffix: '', label: 'Average rating', decimals: 1 },
]

export const timeline = [
  {
    year: 'Origin',
    title: 'A kitchen atelier',
    body: 'Small-batch oils and soaps made for family — the first Aura rituals.',
  },
  {
    year: 'Craft',
    title: 'Ayurvedic discipline',
    body: 'We rooted every formula in plant timing, texture, and sensory honesty.',
  },
  {
    year: 'Today',
    title: 'A living collection',
    body: 'Skin, body, hair, and oils — still handcrafted, still transparent.',
  },
]

export const reviews = [
  {
    name: 'Meera K.',
    rating: 5,
    text: 'The charcoal soap clarified my skin without stripping it. Quiet luxury in a simple bar — and the ritual feels calm every evening.',
    product: 'Activated Charcoal Handmade Soap',
    image: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
  },
  {
    name: 'Arjun S.',
    rating: 5,
    text: 'Tea tree oil became my evening reset. Clean scent, honest label, beautiful bottle. I recommend Aura of Nature for anyone who wants plant care without the noise.',
    product: 'Tea Tree Essential Oil',
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
  },
  {
    name: 'Nisha R.',
    rating: 5,
    text: 'Watermelon seed oil absorbs like silk. My skin looks rested, not shiny. Flawless on texture, scent, and how it layers under moisturizer.',
    product: 'Watermelon Seed Cold Pressed Oil',
    image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
  },
  {
    name: 'Priya M.',
    rating: 5,
    text: "I've used the peach lotion through two winters. Soft, gentle enough for sensitive skin, and it never feels heavy. Honest care I trust.",
    product: 'Nourishing Peach Lotion',
    image: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
  },
]

export const showcaseIngredients = [
  {
    name: 'Coffee & botanicals',
    body: 'Fresh Coffee Face Wash blends neem, turmeric, tulsi, and aloe for daily clarity.',
    image: '/products/fresh-coffee-face-wash/02-bottle-front-card.png',
  },
  {
    name: 'Cold-pressed purity',
    body: 'Oils extracted without heat so nutrients stay vivid and true to the plant.',
    image: '/products/Watermelon/Watermelon-cold-Oil-03-card.png',
  },
]

export const instagram = [
  '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
  '/products/fresh-coffee-face-wash/04-hero-card.png',
  '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
  '/products/Lavender-Oil/Lavender-oil-02-card.png',
  '/products/Peach-Lotion/Peach-Lotion-02-card.png',
  '/products/Wild-Apricot/Wild-Apricot-02-card.png',
]

/** Typographic manifesto — hotel “strive / exceed” band above footer */
export const manifestoContent = {
  lines: ['We strive to make', 'every ritual feel', 'true to the plant'],
  body: 'Honest botanicals. Handcrafted batches. Care that stays transparent — so your skin feels alive, not layered.',
  watermark: ['Nourish your', 'nature'],
  cta: { label: 'Shop the collection', to: ROUTES.shop },
}
