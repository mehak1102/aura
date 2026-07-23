import { ROUTES } from '@/routes/paths'
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
      secondary: '/products/Goad-Milk-Soap/Goat-Milk-01-card.png',
      secondaryAlt: 'Goat Milk Handmade Soap',
      tall: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
      tallAlt: 'Watermelon Seed Cold Pressed Oil',
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
      main: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
      mainAlt: 'Nourishing Peach Lotion',
      overlap: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
      overlapAlt: 'Tea Tree Essential Oil',
      detail: '/products/Lavender-Oil/Lavender-oil-02-card.png',
      detailAlt: 'Lavender Essential Oil',
    },
  },
  book: {
    title: 'Shop now',
    body: [
      'In every Aura ritual, guests share care, scent, and quiet moments that feel personal.',
      'Our atelier accompanies each formula from harvest to bottle — so you never have to wonder what is inside.',
    ],
    cta: { label: 'Experiences', to: ROUTES.bestSellers },
    images: {
      main: '/products/Wild-Apricot/Wild-Apricot-02-card.png',
      mainAlt: 'Wild Apricot Cold Pressed Oil',
      overlap: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
      overlapAlt: 'Activated Charcoal Handmade Soap',
    },
  },
}

/** Grand Hotel–style Restaurant & Bar split */
export const featuredSplit = {
  title: 'Skin & Oils',
  badge: 'Craft',
  bridgeImage: '/products/fresh-coffee-face-wash/04-hero-card.png',
  bridgeAlt: 'Fresh Coffee Face Wash',
  panels: [
    {
      title: 'Skin Care',
      description:
        'Clarify, nourish, and restore — botanicals that become a ritual of taste for the skin.',
      to: ROUTES.skinCare,
      image: '/products/_split/skin-care.png',
      imageAlt: 'Nourishing Peach Lotion',
    },
    {
      title: 'Essential Oils',
      description:
        'The perfect place for calm meetings with scent — pure, potent, and honest.',
      to: ROUTES.essentialOils,
      image: '/products/_split/essential-oils.png',
      imageAlt: 'Lavender Essential Oil',
    },
  ],
}

export const concerns = [
  { label: 'Acne & Blemishes', to: `${ROUTES.shop}?concern=acne` },
  { label: 'Dryness', to: `${ROUTES.shop}?concern=dryness` },
  { label: 'Dullness', to: `${ROUTES.shop}?concern=dullness` },
  { label: 'Hair Fall', to: `${ROUTES.shop}?concern=hairfall` },
  { label: 'Pigmentation', to: `${ROUTES.shop}?concern=pigmentation` },
  { label: 'Sensitivity', to: `${ROUTES.shop}?concern=sensitivity` },
]

/** Luxury slider slides — Grand Hotel editorial layout */
export const luxurySlides: LuxurySlide[] = [
  {
    id: 'coffee',
    titleLines: ['Morning', 'Grounding'],
    subtitle: 'Skin care ritual',
    description:
      'Fresh Coffee Face Wash — antioxidant-rich botanicals that awaken skin with a natural glow, every morning.',
    image: '/products/fresh-coffee-face-wash/02-bottle-front.png',
    imageAlt: 'Fresh Coffee Face Wash',
    cta: { label: 'Discover', to: ROUTES.skinCare },
  },
  {
    id: 'peach',
    titleLines: ['Soft Skin', 'All Day'],
    subtitle: 'Body nourishment',
    description:
      'Nourishing Peach Lotion — lightweight moisture with the warmth of ripe peach and hand-finished botanical oils.',
    image: '/products/Peach-Lotion/Peach-Lotion-02.png',
    imageAlt: 'Nourishing Peach Lotion',
    cta: { label: 'Discover', to: ROUTES.bodyCare },
  },
  {
    id: 'lavender',
    titleLines: ['Calm In', 'Every Drop'],
    subtitle: 'Essential oils',
    description:
      'Lavender Essential Oil — distilled at peak bloom for serene aroma, restful evenings, and mindful rituals.',
    image: '/products/Lavender-Oil/Lavender-oil-02.png',
    imageAlt: 'Lavender Essential Oil',
    cta: { label: 'Discover', to: ROUTES.essentialOils },
  },
  {
    id: 'goat',
    titleLines: ['Gentle', 'Cleansing'],
    subtitle: 'Handmade soap',
    description:
      'Goat Milk Soap — creamy lather and honest ingredients for skin that feels soft, never stripped.',
    image: '/products/Goad-Milk-Soap/Goat-Milk-01.png',
    imageAlt: 'Goat Milk Soap',
    cta: { label: 'Discover', to: ROUTES.bodyCare },
  },
  {
    id: 'tea-tree',
    titleLines: ['Clear &', 'Balanced'],
    subtitle: 'Targeted care',
    description:
      'Tea Tree Essential Oil — clarifying botanical power for blemish-prone skin and a refreshed scalp ritual.',
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01.png',
    imageAlt: 'Tea Tree Essential Oil',
    cta: { label: 'Discover', to: ROUTES.essentialOils },
  },
  {
    id: 'jojoba',
    titleLines: ['Pure Oil', 'Pure Skin'],
    subtitle: 'Cold pressed',
    description:
      'Jojoba Cold Pressed Oil — lightweight, vitamin-rich moisture that mirrors your skin\'s natural balance.',
    image: '/products/Jojoba-oil/Jojoba-Oil-02.png',
    imageAlt: 'Jojoba Cold Pressed Oil',
    cta: { label: 'Discover', to: ROUTES.coldPressedOils },
  },
  {
    id: 'cumin',
    titleLines: ['Strength', 'From Roots'],
    subtitle: 'Hair ritual',
    description:
      'Black Cumin Hair Oil — Ayurvedic botanicals to nourish roots, add shine, and restore confidence.',
    image: '/products/Black-Cumin/Black-Cumin-02.png',
    imageAlt: 'Black Cumin Hair Oil',
    cta: { label: 'Discover', to: ROUTES.hairCare },
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
