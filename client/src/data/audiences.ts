import { ROUTES } from '@/routes/paths'
import type { ProductCategory } from '@/types/shop'

export type AudienceId = 'men' | 'women'

export type AudienceLanding = {
  id: AudienceId
  path: string
  eyebrow: string
  headline: string
  body: string
  heroImage: string
  categories: { label: string; to: string; description: string }[]
  routineTitle: string
  routine: { step: string; title: string; body: string }[]
  /** daypart routine for women */
  dayparts?: { id: string; title: string; body: string }[]
  shopConcerns: { label: string; to: string }[]
  featuredSlugs: string[]
  articleSlugs: string[]
  /** Optional facial map zones (women) */
  facialMap?: { id: string; label: string; tip: string; x: number; y: number }[]
  categoryFilter?: ProductCategory[]
}

export const audienceLandings: Record<AudienceId, AudienceLanding> = {
  men: {
    id: 'men',
    path: ROUTES.men,
    eyebrow: 'For him',
    headline: 'Modern Ayurvedic Grooming',
    body: 'Clean formulas for face, beard, hair, and body — built for daily rituals that feel sharp, not complicated.',
    heroImage:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
    categories: [
      {
        label: 'Face wash',
        to: `${ROUTES.shop}?category=skin-care&q=wash`,
        description: 'Clarify without the tight after-feel',
      },
      {
        label: 'Beard care',
        to: `${ROUTES.shop}?ingredient=jojoba`,
        description: 'Oils that soften whiskers and skin beneath',
      },
      {
        label: 'Hair care',
        to: ROUTES.hairCare,
        description: 'Scalp oils for stronger-looking hair',
      },
      {
        label: 'Body care',
        to: ROUTES.bodyCare,
        description: 'Soaps and lotions with honest botanicals',
      },
      {
        label: 'Essential oils',
        to: ROUTES.essentialOils,
        description: 'Tea tree, eucalyptus, lavender — used right',
      },
    ],
    routineTitle: 'Men’s 3-step ritual',
    routine: [
      {
        step: '01',
        title: 'Cleanse',
        body: 'Coffee face wash or charcoal soap — clear the day off your skin.',
      },
      {
        step: '02',
        title: 'Moisturize',
        body: 'Jojoba or watermelon seed oil while skin is still damp.',
      },
      {
        step: '03',
        title: 'Protect',
        body: 'Black cumin on scalp twice weekly; tea tree diluted for spots.',
      },
    ],
    shopConcerns: [
      { label: 'Acne', to: `${ROUTES.concerns}/acne` },
      { label: 'Hair fall', to: `${ROUTES.concerns}/hairfall` },
      { label: 'Oily skin', to: `${ROUTES.concerns}/oily-skin` },
      { label: 'Dandruff', to: `${ROUTES.concerns}/dandruff` },
    ],
    featuredSlugs: [
      'fresh-coffee-face-wash',
      'activated-charcoal-soap',
      'tea-tree-essential-oil',
      'black-cumin-cold-pressed-oil',
      'jojoba-cold-pressed-oil',
    ],
    articleSlugs: [
      'morning-skincare-ritual',
      'understanding-ayurvedic-skin-types',
    ],
  },
  women: {
    id: 'women',
    path: ROUTES.women,
    eyebrow: 'For her',
    headline: "Nature's care for radiant skin",
    body: 'Botanical face, body, hair, and oil rituals designed for glow that feels earned — not filtered.',
    heroImage:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80',
    categories: [
      {
        label: 'Face care',
        to: ROUTES.skinCare,
        description: 'Cleansers and soaps for daily radiance',
      },
      {
        label: 'Body care',
        to: ROUTES.bodyCare,
        description: 'Peach lotion and soft botanical moisture',
      },
      {
        label: 'Hair care',
        to: ROUTES.hairCare,
        description: 'Oils that love scalp and length',
      },
      {
        label: 'Essential oils',
        to: ROUTES.essentialOils,
        description: 'Lavender evenings, carrot seed glow',
      },
      {
        label: 'Gift sets',
        to: ROUTES.giftSets,
        description: 'Curated boxes for every occasion',
      },
    ],
    routineTitle: 'Daypart skin ritual',
    routine: [],
    dayparts: [
      {
        id: 'morning',
        title: 'Morning',
        body: 'Coffee cleanse → watermelon oil → peach lotion. Light, luminous, SPF-ready.',
      },
      {
        id: 'work',
        title: 'At work',
        body: 'Mist or blot; keep jojoba in your bag for dry patches only.',
      },
      {
        id: 'night',
        title: 'Night',
        body: 'Soft cleanse → facial massage with oil → lavender on pulse points.',
      },
    ],
    shopConcerns: [
      { label: 'Acne', to: `${ROUTES.concerns}/acne` },
      { label: 'Pigmentation', to: `${ROUTES.concerns}/pigmentation` },
      { label: 'Hair fall', to: `${ROUTES.concerns}/hairfall` },
      { label: 'Dark circles', to: `${ROUTES.concerns}/dark-circles` },
    ],
    featuredSlugs: [
      'nourishing-peach-lotion-kumkumadi-oil',
      'goat-milk-soap',
      'watermelon-seed-cold-pressed-oil',
      'lavender-essential-oil',
      'cucumber-seed-cold-pressed-oil',
      'carrot-seed-essential-oil',
    ],
    articleSlugs: [
      'morning-skincare-ritual',
      'understanding-ayurvedic-skin-types',
    ],
    facialMap: [
      {
        id: 'forehead',
        label: 'Forehead',
        tip: 'Sweep oil upward in soft strokes — release tension from screen hours.',
        x: 50,
        y: 18,
      },
      {
        id: 'under-eye',
        label: 'Under eyes',
        tip: 'Pat cucumber seed oil with ring finger — never drag.',
        x: 35,
        y: 38,
      },
      {
        id: 'cheeks',
        label: 'Cheeks',
        tip: 'Circular massage from nose toward ears encourages glow.',
        x: 72,
        y: 48,
      },
      {
        id: 'jaw',
        label: 'Jawline',
        tip: 'Drain outward along the jaw to soften tightness.',
        x: 58,
        y: 72,
      },
    ],
  },
}
