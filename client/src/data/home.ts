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

/** Pinned FLIP split journey — after Shop by Concern */
export const splitJourney = {
  eyebrow: 'The botanical path',
  title: 'A ritual that moves with you',
  titleItalic: 'moves',
  subtitle: 'Scroll through three pure botanicals — each pause a different kind of care.',
  slides: [
    {
      id: 'lavender',
      step: '01',
      label: 'Evening Calm',
      titleLines: ['Breathe in', 'the quiet'],
      titleItalic: 'quiet',
      description:
        'Lavender Essential Oil — distilled at peak bloom for serene aroma, softer evenings, and rituals that ask nothing more.',
      note: '100% pure oil · Skin & mind',
      image: '/products/_ritual/lavender.png',
      imageAlt: 'Lavender Essential Oil in a botanical setting',
      cta: { label: 'Shop Lavender', to: productPath('lavender-essential-oil') },
    },
    {
      id: 'tea-tree',
      step: '02',
      label: 'Clarify',
      titleLines: ['Clear skin,', 'clear mind'],
      titleItalic: 'clear mind',
      description:
        'Tea Tree Essential Oil — a crisp, clarifying botanical for blemish-prone skin and a refreshed scalp ritual.',
      note: 'Clarifying · Targeted care',
      image: '/products/_ritual/tea-tree.png',
      imageAlt: 'Tea Tree Essential Oil bottle',
      cta: { label: 'Shop Tea Tree', to: productPath('tea-tree-essential-oil') },
    },
    {
      id: 'jojoba',
      step: '03',
      label: 'Cold Pressed',
      titleLines: ['Balance', 'that lasts'],
      titleItalic: 'lasts',
      description:
        'Jojoba Cold Pressed Oil — lightweight liquid gold that mirrors skin’s own oils for lasting, quiet moisture.',
      note: 'Cold pressed · Vitamin rich',
      image: '/products/_ritual/jojoba.png',
      imageAlt: 'Jojoba Cold Pressed Oil',
      cta: { label: 'Shop Jojoba', to: productPath('jojoba-cold-pressed-oil') },
    },
  ],
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

export type IngredientShowcaseItem = {
  id: string
  indexLabel: string
  name: string
  kicker: string
  description: string
  benefits: [string, string, string]
  badges: [string, string, string]
  navBenefit: string
  heroImage: string
  navImage: string
  theme: string
  to: string
  products: Array<{
    name: string
    subtitle: string
    image: string
    to: string
  }>
}

export const ingredientShowcaseItems: IngredientShowcaseItem[] = [
  {
    id: 'charcoal',
    indexLabel: '01 / 13',
    name: 'Activated Charcoal',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Detoxifying mineral care that lifts buildup, clears congestion, and resets the skin cleanly.',
    benefits: ['Detox', 'Refine', 'Cleanse'],
    badges: ['Mineral Rich', 'Deep Clean', 'Handcrafted'],
    navBenefit: 'Detoxifies & removes impurities',
    heroImage: '/ingredients-showcase/01-charcoal.png',
    navImage: '/ingredients-showcase/01-charcoal.png',
    theme: 'charcoal',
    to: productPath('activated-charcoal-soap'),
    products: [],
  },
  {
    id: 'black-cumin',
    indexLabel: '02 / 13',
    name: 'Black Cumin',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'An ultra-smooth seed oil for scalp and skin rituals that need deeper nourishment.',
    benefits: ['Strengthen', 'Nourish', 'Protect'],
    badges: ['Cold Pressed', 'Hair & Skin', 'Pure'],
    navBenefit: 'Nourishes scalp & controls hairfall',
    heroImage: '/ingredients-showcase/02-black-cumin.png',
    navImage: '/ingredients-showcase/02-black-cumin.png',
    theme: 'black-cumin',
    to: productPath('black-cumin-cold-pressed-oil'),
    products: [],
  },
  {
    id: 'carrot-seed',
    indexLabel: '03 / 13',
    name: 'Carrot Seed',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'A restorative seed oil known for supporting clearer-looking tone and natural glow.',
    benefits: ['Brighten', 'Repair', 'Glow'],
    badges: ['Pure Distilled', 'Skin Loving', 'Natural'],
    navBenefit: 'Supports glow & even tone',
    heroImage: '/ingredients-showcase/03-carrot-seed.png',
    navImage: '/ingredients-showcase/03-carrot-seed.png',
    theme: 'carrot-seed',
    to: productPath('carrot-seed-essential-oil'),
    products: [],
  },
  {
    id: 'coffee',
    indexLabel: '04 / 13',
    name: 'Coffee',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Antioxidant-rich coffee extract for a fresher cleanse, tighter-feeling pores, and natural glow.',
    benefits: ['Glow', 'Refresh', 'Tone'],
    badges: ['Antioxidant', 'Daily Cleanse', 'All Skin'],
    navBenefit: 'Brightens & refreshes daily',
    heroImage: '/ingredients-showcase/04-coffee.png',
    navImage: '/ingredients-showcase/04-coffee.png',
    theme: 'coffee',
    to: productPath('fresh-coffee-face-wash'),
    products: [],
  },
  {
    id: 'cucumber-seed',
    indexLabel: '05 / 13',
    name: 'Cucumber Seed',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Cooling antioxidant-rich seed oil that supports softer skin and a fresher everyday feel.',
    benefits: ['Cool', 'Protect', 'Refresh'],
    badges: ['Antioxidant', 'Cold Pressed', 'Lightweight'],
    navBenefit: 'Cools skin & supports softness',
    heroImage: '/ingredients-showcase/05-cucumber-seed.png',
    navImage: '/ingredients-showcase/05-cucumber-seed.png',
    theme: 'cucumber-seed',
    to: productPath('cucumber-seed-cold-pressed-oil'),
    products: [],
  },
  {
    id: 'eucalyptus',
    indexLabel: '06 / 13',
    name: 'Eucalyptus',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'A clarifying aromatic oil that freshens the air, supports ease, and keeps rituals crisp.',
    benefits: ['Freshen', 'Clarify', 'Ease'],
    badges: ['100% Pure', 'Aromatic', 'Therapeutic'],
    navBenefit: 'Freshens air & eases joints',
    heroImage: '/ingredients-showcase/06-eucalyptus.png',
    navImage: '/ingredients-showcase/06-eucalyptus.png',
    theme: 'eucalyptus',
    to: productPath('eucalyptus-essential-oil'),
    products: [],
  },
  {
    id: 'goat-milk',
    indexLabel: '07 / 13',
    name: 'Goat Milk',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Creamy, comforting care that moisturizes gently and leaves skin soft without stripping.',
    benefits: ['Moisturize', 'Soothe', 'Nourish'],
    badges: ['Handmade', 'Gentle', 'Natural'],
    navBenefit: 'Rejuvenates & moisturizes skin',
    heroImage: '/ingredients-showcase/07-goat-milk.png',
    navImage: '/ingredients-showcase/07-goat-milk.png',
    theme: 'goat-milk',
    to: productPath('goat-milk-soap'),
    products: [],
  },
  {
    id: 'jojoba',
    indexLabel: '08 / 13',
    name: 'Jojoba',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'A skin-mirroring oil that balances, cushions, and keeps moisture close without feeling heavy.',
    benefits: ['Balance', 'Nourish', 'Soften'],
    badges: ['100% Pure', 'Barrier Friendly', 'Everyday Use'],
    navBenefit: 'Balances oil & deeply nourishes',
    heroImage: '/ingredients-showcase/08-jojoba.png',
    navImage: '/ingredients-showcase/08-jojoba.png',
    theme: 'jojoba',
    to: productPath('jojoba-cold-pressed-oil'),
    products: [],
  },
  {
    id: 'lavender',
    indexLabel: '09 / 13',
    name: 'Lavender',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'A calming floral note for quieter evenings, comforted skin, and a softer sensory routine.',
    benefits: ['Calm', 'Soothe', 'Restore'],
    badges: ['Aromatic', 'Skin Loving', 'Pure Distilled'],
    navBenefit: 'Calms the mind & soothes skin',
    heroImage: '/ingredients-showcase/09-lavender.png',
    navImage: '/ingredients-showcase/09-lavender.png',
    theme: 'lavender',
    to: productPath('lavender-essential-oil'),
    products: [],
  },
  {
    id: 'peach',
    indexLabel: '10 / 13',
    name: 'Peach',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Soft peach nourishment with Kumkumadi care for ultra-hydrated, smoother-feeling skin.',
    benefits: ['Hydrate', 'Repair', 'Smooth'],
    badges: ['Body Care', 'Rich Moisture', 'Daily Ritual'],
    navBenefit: 'Hydrates & softens body skin',
    heroImage: '/ingredients-showcase/10-peach.png',
    navImage: '/ingredients-showcase/10-peach.png',
    theme: 'peach',
    to: productPath('nourishing-peach-lotion-kumkumadi-oil'),
    products: [],
  },
  {
    id: 'tea-tree',
    indexLabel: '11 / 13',
    name: 'Tea Tree',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Naturally purifies skin, helps reduce blemishes, and promotes a fresher scalp ritual.',
    benefits: ['Purify', 'Clarify', 'Renew'],
    badges: ['100% Pure', 'Natural', 'Therapeutic Grade'],
    navBenefit: 'Purifies & promotes healthy hair',
    heroImage: '/ingredients-showcase/11-tea-tree.png',
    navImage: '/ingredients-showcase/11-tea-tree.png',
    theme: 'tea-tree',
    to: productPath('tea-tree-essential-oil'),
    products: [],
  },
  {
    id: 'watermelon',
    indexLabel: '12 / 13',
    name: 'Watermelon Seed',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'Lightweight cold-pressed hydration that supports glow, elasticity, and an easy everyday finish.',
    benefits: ['Hydrate', 'Glow', 'Balance'],
    badges: ['Cold Pressed', 'Vitamin Rich', 'Lightweight'],
    navBenefit: 'Hydrates & improves skin elasticity',
    heroImage: '/ingredients-showcase/12-watermelon.png',
    navImage: '/ingredients-showcase/12-watermelon.png',
    theme: 'watermelon',
    to: productPath('watermelon-seed-cold-pressed-oil'),
    products: [],
  },
  {
    id: 'wild-apricot',
    indexLabel: '13 / 13',
    name: 'Wild Apricot',
    kicker: 'SHOP BY INGREDIENT',
    description:
      'A light cold-pressed oil that softens skin and supports a smoother, comforted finish.',
    benefits: ['Soften', 'Nourish', 'Smooth'],
    badges: ['Cold Pressed', 'Lightweight', 'Lab Tested'],
    navBenefit: 'Softens skin & reduces dryness',
    heroImage: '/ingredients-showcase/13-wild-apricot.png',
    navImage: '/ingredients-showcase/13-wild-apricot.png',
    theme: 'wild-apricot',
    to: productPath('wild-apricot-cold-pressed-oil'),
    products: [],
  },
]

export const categories = [
  { name: 'Skin Care', to: ROUTES.skinCare, count: '2 products' },
  { name: 'Body Care', to: ROUTES.bodyCare, count: '2 products' },
  { name: 'Essential Oils', to: ROUTES.essentialOils, count: '4 products' },
  { name: 'Cold Pressed Oils', to: ROUTES.coldPressedOils, count: '5 products' },
]

export type BestSellerPill = {
  label: string
  icon: 'leaf' | 'drop' | 'sprout' | 'spark' | 'heart' | 'sun' | 'hand'
}

export const bestSellers = [
  {
    title: 'Activated Charcoal Handmade Soap',
    slug: 'activated-charcoal-soap',
    pills: [
      { label: 'Detox', icon: 'spark' },
      { label: 'Clean', icon: 'drop' },
      { label: 'Handmade', icon: 'hand' },
    ] satisfies BestSellerPill[],
    price: 299,
    mrp: 399,
    rating: 4.9,
    reviewCount: 126,
    image: '/products/_bestsellers/charcoal-card-sm.webp',
  },
  {
    title: 'Tea Tree Essential Oil',
    slug: 'tea-tree-essential-oil',
    pills: [
      { label: 'Purify', icon: 'leaf' },
      { label: 'Clarify', icon: 'drop' },
      { label: 'Natural', icon: 'sprout' },
    ] satisfies BestSellerPill[],
    price: 525,
    mrp: 650,
    rating: 4.8,
    reviewCount: 98,
    image: '/products/_bestsellers/tea-tree-card-sm.webp',
  },
  {
    title: 'Watermelon Seed Cold Pressed Oil',
    slug: 'watermelon-seed-cold-pressed-oil',
    pills: [
      { label: 'Brighten', icon: 'sun' },
      { label: 'Hydrate', icon: 'drop' },
      { label: 'Pressed', icon: 'leaf' },
    ] satisfies BestSellerPill[],
    price: 650,
    mrp: 750,
    rating: 4.9,
    reviewCount: 84,
    image: '/products/_bestsellers/watermelon-card-sm.webp',
  },
  {
    title: 'Lavender Essential Oil',
    slug: 'lavender-essential-oil',
    pills: [
      { label: 'Calming', icon: 'heart' },
      { label: 'Soothing', icon: 'drop' },
      { label: 'Natural', icon: 'sprout' },
    ] satisfies BestSellerPill[],
    price: 525,
    mrp: 650,
    rating: 4.9,
    reviewCount: 112,
    image: '/products/_bestsellers/lavender-card-sm.webp',
  },
  {
    title: 'Fresh Coffee Face Wash',
    slug: 'fresh-coffee-face-wash',
    pills: [
      { label: 'Antiox', icon: 'spark' },
      { label: 'Pores', icon: 'drop' },
      { label: 'Glow', icon: 'sun' },
    ] satisfies BestSellerPill[],
    price: 425,
    mrp: 499,
    rating: 4.8,
    reviewCount: 156,
    image: '/products/_bestsellers/coffee-card-sm.webp',
  },
  {
    title: 'Nourishing Peach Lotion with Kumkumadi Oil',
    slug: 'nourishing-peach-lotion-kumkumadi-oil',
    pills: [
      { label: 'Hydrate', icon: 'drop' },
      { label: 'Nourish', icon: 'heart' },
      { label: 'Soft', icon: 'leaf' },
    ] satisfies BestSellerPill[],
    price: 499,
    mrp: 590,
    rating: 4.9,
    reviewCount: 91,
    image: '/products/_bestsellers/peach-card-sm.webp',
  },
  {
    title: 'Goat Milk Handmade Soap',
    slug: 'goat-milk-soap',
    pills: [
      { label: 'Moisture', icon: 'drop' },
      { label: 'Handmade', icon: 'hand' },
      { label: 'Gentle', icon: 'heart' },
    ] satisfies BestSellerPill[],
    price: 349,
    mrp: 399,
    rating: 4.8,
    reviewCount: 143,
    image: '/products/_bestsellers/goat-milk-card-sm.webp',
  },
  {
    title: 'Jojoba Cold Pressed Oil',
    slug: 'jojoba-cold-pressed-oil',
    pills: [
      { label: 'Hydrate', icon: 'drop' },
      { label: 'Soften', icon: 'heart' },
      { label: 'Pressed', icon: 'sprout' },
    ] satisfies BestSellerPill[],
    price: 650,
    mrp: 750,
    rating: 4.9,
    reviewCount: 107,
    image: '/products/_bestsellers/jojoba-card-sm.webp',
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

export const INSTAGRAM_URL = 'https://www.instagram.com/auraofnatureofficial/'

/** Site-wide Instagram brand strip (ACG-style) */
export const instagramProfile = {
  displayName: 'Aura of Nature',
  handle: '@auraofnatureofficial',
  profileUrl: INSTAGRAM_URL,
  avatarSrc: '/instagram/profile.png',
  bio: 'Pure · Natural · Nourishing botanical rituals for skin, body & hair.',
  verified: true,
  stats: {
    posts: 163,
    followers: 7200,
    following: 0,
  },
}

export type InstagramPost = {
  id: string
  image: string
  url: string
  alt: string
  isVideo?: boolean
}

/** Packaging lineup matching @auraofnatureofficial — live feed overrides via /api/instagram/profile */
export const instagramPosts: InstagramPost[] = [
  {
    id: 'ig-1',
    image: '/products/fresh-coffee-face-wash/04-hero-card.png',
    url: INSTAGRAM_URL,
    alt: 'Fresh Coffee Face Wash',
  },
  {
    id: 'ig-2',
    image: '/products/Lavender-Oil/Lavender-oil-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Lavender Essential Oil',
  },
  {
    id: 'ig-3',
    image: '/products/Wild-Apricot/Wild-Apricot-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Wild Apricot Cold Pressed Oil',
  },
  {
    id: 'ig-4',
    image: '/products/Eucalyptus-Oil/Eucalyptus-Oil-01-card.png',
    url: INSTAGRAM_URL,
    alt: 'Eucalyptus Essential Oil',
    isVideo: true,
  },
  {
    id: 'ig-5',
    image: '/products/Jojoba-oil/Jojoba-Oil-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Jojoba Cold Pressed Oil',
  },
  {
    id: 'ig-6',
    image: '/products/Black-Cumin/Black-Cumin-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Black Cumin Cold Pressed Oil',
  },
  {
    id: 'ig-7',
    image: '/products/Tea-Tree-Oil/Tea-Tree-Oil-01-card.png',
    url: INSTAGRAM_URL,
    alt: 'Tea Tree Essential Oil',
    isVideo: true,
  },
  {
    id: 'ig-8',
    image: '/products/Peach-Lotion/Peach-Lotion-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Nourishing Peach Lotion',
  },
  {
    id: 'ig-9',
    image: '/products/Watermelon/Watermelon-cold-Oil-02-card.png',
    url: INSTAGRAM_URL,
    alt: 'Watermelon Seed Cold Pressed Oil',
  },
  {
    id: 'ig-10',
    image: '/products/Activated-Charcoal/activated-Charcoal-01-card.png',
    url: INSTAGRAM_URL,
    alt: 'Activated Charcoal Handmade Soap',
  },
]

/** @deprecated use instagramPosts — kept for any legacy imports */
export const instagram = instagramPosts.map((p) => p.image)

export const whyUs = [
  { value: 100, suffix: '%', label: 'Natural intent' },
  { value: 50, suffix: '+', label: 'Botanical formulas' },
  { value: 12, suffix: 'k', label: 'Rituals shared' },
  { value: 4.9, suffix: '', label: 'Average rating', decimals: 1 },
  {
    value: 7.2,
    suffix: 'k',
    label: 'Instagram followers',
    href: INSTAGRAM_URL,
    decimals: 1,
  },
]

export const timeline = [
  {
    year: 'Beginning',
    title: 'A kitchen atelier',
    body: 'Small-batch oils and soaps made for family — the first of many little rituals.',
    image: '/timeline/01-timeline.png',
    imageAlt: 'Ceramic jug and bowl of seeds on wood',
  },
  {
    year: 'Craft',
    title: 'Ayurvedic discipline',
    body: 'We rooted every formula in plant timing, texture, and sensory honesty.',
    image: '/timeline/02-timeline.png',
    imageAlt: 'Stone mortar and pestle with fresh herbs',
  },
  {
    year: 'Today',
    title: 'A living collection',
    body: 'Skin, body, hair, and oils — still handcrafted, still transparent.',
    image: '/timeline/03-timeline.png',
    imageAlt: 'Amber dropper bottle and cream jar with botanicals',
  },
]

export const reviews = [
  {
    name: 'Meera K.',
    rating: 5,
    text: 'The charcoal soap clarified my skin without stripping it. Quiet luxury in a simple bar — and the ritual feels calm every evening.',
    product: 'Activated Charcoal Handmade Soap',
    image: '/reviews/01-charcoal.png',
  },
  {
    name: 'Arjun S.',
    rating: 5,
    text: 'Tea tree oil became my evening reset. Clean scent, honest label, beautiful bottle. I recommend Aura of Nature for anyone who wants plant care without the noise.',
    product: 'Tea Tree Essential Oil',
    image: '/reviews/02-tea-tree.png',
  },
  {
    name: 'Nisha R.',
    rating: 5,
    text: 'Watermelon seed oil absorbs like silk. My skin looks rested, not shiny. Flawless on texture, scent, and how it layers under moisturizer.',
    product: 'Watermelon Seed Cold Pressed Oil',
    image: '/reviews/04-watermelon.png',
  },
  {
    name: 'Priya M.',
    rating: 5,
    text: "I've used the peach lotion through two winters. Soft, gentle enough for sensitive skin, and it never feels heavy. Honest care I trust.",
    product: 'Nourishing Peach Lotion',
    image: '/reviews/03-peach.png',
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

/** Typographic manifesto — hotel “strive / exceed” band above footer */
export const manifestoContent = {
  lines: ['We strive to make', 'every ritual feel', 'true to the plant'],
  body: 'Honest botanicals. Handcrafted batches. Care that stays transparent — so your skin feels alive, not layered.',
  watermark: ['Nourish your', 'nature'],
  cta: { label: 'Shop the collection', to: ROUTES.shop },
}
