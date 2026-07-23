import type { ProductConcern } from '@/types/shop'
import { ROUTES } from '@/routes/paths'

export type ConcernSlug =
  | 'acne'
  | 'oily-skin'
  | 'pigmentation'
  | 'hairfall'
  | 'dandruff'
  | 'dark-circles'
  | 'sensitive-skin'
  | 'dryness'
  | 'dullness'

export type ConcernPage = {
  slug: ConcernSlug
  title: string
  eyebrow: string
  headline: string
  body: string
  image: string
  /** Maps to catalog ProductConcern when filtering shop */
  shopConcern?: ProductConcern
  /** Extra product slugs to always recommend */
  productSlugs: string[]
  routine: { step: string; title: string; body: string }[]
  articleSlugs: string[]
}

export const concernPages: ConcernPage[] = [
  {
    slug: 'acne',
    title: 'Acne',
    eyebrow: 'Skin concern',
    headline: 'Clarify without stripping',
    body: 'Calm congestion with charcoal, tea tree, and gentle botanical cleansers that respect your barrier.',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'acne',
    productSlugs: [
      'activated-charcoal-soap',
      'fresh-coffee-face-wash',
      'tea-tree-essential-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Cleanse',
        body: 'Use charcoal soap or coffee face wash morning and night.',
      },
      {
        step: '02',
        title: 'Treat',
        body: 'Spot-dilute tea tree on blemishes — never neat on broken skin.',
      },
      {
        step: '03',
        title: 'Balance',
        body: 'Finish with a light oil like jojoba so skin does not rebound-oil.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual', 'understanding-ayurvedic-skin-types'],
  },
  {
    slug: 'oily-skin',
    title: 'Oily skin',
    eyebrow: 'Skin concern',
    headline: 'Balance excess oil, keep glow',
    body: 'Clarify pores and regulate sebum with lightweight botanicals — never harsh strips that make oil worse.',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'acne',
    productSlugs: [
      'fresh-coffee-face-wash',
      'activated-charcoal-soap',
      'watermelon-seed-cold-pressed-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Gentle cleanse',
        body: 'Coffee face wash lifts excess oil without tight, squeaky skin.',
      },
      {
        step: '02',
        title: 'Light moisture',
        body: 'Watermelon seed oil absorbs fast — hydration without heaviness.',
      },
      {
        step: '03',
        title: 'Weekly reset',
        body: 'Charcoal soap 2–3 evenings a week for a deeper clear.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual'],
  },
  {
    slug: 'pigmentation',
    title: 'Pigmentation',
    eyebrow: 'Skin concern',
    headline: 'Even tone, patiently',
    body: 'Support clearer tone with carrot seed, watermelon, and kumkumadi-rich rituals used consistently.',
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'pigmentation',
    productSlugs: [
      'carrot-seed-essential-oil',
      'watermelon-seed-cold-pressed-oil',
      'nourishing-peach-lotion-kumkumadi-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Cleanse',
        body: 'Start with coffee face wash to refresh dull, uneven skin.',
      },
      {
        step: '02',
        title: 'Brighten',
        body: 'Massage diluted carrot seed or watermelon oil into face and neck.',
      },
      {
        step: '03',
        title: 'Seal',
        body: 'Peach lotion with kumkumadi locks in moisture and glow.',
      },
    ],
    articleSlugs: ['understanding-ayurvedic-skin-types'],
  },
  {
    slug: 'hairfall',
    title: 'Hair fall',
    eyebrow: 'Hair concern',
    headline: 'Strengthen from scalp to strand',
    body: 'Nourish the scalp with black cumin, tea tree, and weekly oil rituals that support thicker-looking hair.',
    image:
      'https://images.unsplash.com/photo-1522338242992-e1a517061127?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'hairfall',
    productSlugs: [
      'black-cumin-cold-pressed-oil',
      'tea-tree-essential-oil',
      'wild-apricot-cold-pressed-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Scalp oil',
        body: 'Warm black cumin oil; massage for 5 minutes before wash day.',
      },
      {
        step: '02',
        title: 'Clarify',
        body: 'A drop of tea tree in carrier oil keeps scalp fresh.',
      },
      {
        step: '03',
        title: 'Seal ends',
        body: 'Wild apricot on mid-lengths after wash for softness.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual'],
  },
  {
    slug: 'dandruff',
    title: 'Dandruff',
    eyebrow: 'Hair concern',
    headline: 'Calm an itchy, flaky scalp',
    body: 'Tea tree and eucalyptus help refresh the scalp while oils keep it from drying into more flakes.',
    image:
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'hairfall',
    productSlugs: [
      'tea-tree-essential-oil',
      'eucalyptus-essential-oil',
      'black-cumin-cold-pressed-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Treat',
        body: 'Dilute tea tree in black cumin; leave 20 minutes pre-wash.',
      },
      {
        step: '02',
        title: 'Rinse ritual',
        body: 'Eucalyptus steam or diluted rinse for a clean finish.',
      },
      {
        step: '03',
        title: 'Maintain',
        body: 'Repeat 2× weekly until scalp feels calm.',
      },
    ],
    articleSlugs: [],
  },
  {
    slug: 'dark-circles',
    title: 'Dark circles',
    eyebrow: 'Skin concern',
    headline: 'Restored under-eyes, gently',
    body: 'Cooling cucumber and lightweight oils support the delicate eye area — consistency over intensity.',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'dullness',
    productSlugs: [
      'cucumber-seed-cold-pressed-oil',
      'jojoba-cold-pressed-oil',
      'lavender-essential-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Cool',
        body: 'Pat cucumber seed oil under eyes morning and night.',
      },
      {
        step: '02',
        title: 'Nourish',
        body: 'Jojoba mimics skin oils — ideal for thin under-eye skin.',
      },
      {
        step: '03',
        title: 'Rest',
        body: 'Lavender on pulse points supports deeper evening wind-down.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual'],
  },
  {
    slug: 'sensitive-skin',
    title: 'Sensitive skin',
    eyebrow: 'Skin concern',
    headline: 'Soft rituals for reactive skin',
    body: 'Goat milk, lavender, and cucumber keep care simple — fewer actives, more comfort.',
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'sensitivity',
    productSlugs: [
      'goat-milk-soap',
      'lavender-essential-oil',
      'cucumber-seed-cold-pressed-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Cleanse soft',
        body: 'Goat milk soap — no fragrance overload, no harsh foam.',
      },
      {
        step: '02',
        title: 'Soothe',
        body: 'Cucumber seed oil calms tightness after cleanse.',
      },
      {
        step: '03',
        title: 'Calm aroma',
        body: 'One drop lavender in carrier on wrists, never neat on face.',
      },
    ],
    articleSlugs: ['understanding-ayurvedic-skin-types'],
  },
  {
    slug: 'dryness',
    title: 'Dryness',
    eyebrow: 'Skin concern',
    headline: 'Restore softness that lasts',
    body: 'Layer rich oils and goat milk cleansers so dryness eases without heavy residue.',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'dryness',
    productSlugs: [
      'goat-milk-soap',
      'jojoba-cold-pressed-oil',
      'wild-apricot-cold-pressed-oil',
      'nourishing-peach-lotion-kumkumadi-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Cleanse',
        body: 'Goat milk soap keeps the barrier comfortable.',
      },
      {
        step: '02',
        title: 'Oil',
        body: 'Jojoba or apricot while skin is damp.',
      },
      {
        step: '03',
        title: 'Seal',
        body: 'Peach lotion as the final cushion.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual'],
  },
  {
    slug: 'dullness',
    title: 'Dullness',
    eyebrow: 'Skin concern',
    headline: 'Wake up tired, flat skin',
    body: 'Coffee, watermelon, and bright oils bring back life without abrasive polish.',
    image:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1400&q=80',
    shopConcern: 'dullness',
    productSlugs: [
      'fresh-coffee-face-wash',
      'watermelon-seed-cold-pressed-oil',
      'carrot-seed-essential-oil',
    ],
    routine: [
      {
        step: '01',
        title: 'Polish gently',
        body: 'Coffee face wash for a soft morning wake-up.',
      },
      {
        step: '02',
        title: 'Feed',
        body: 'Watermelon seed oil for light luminosity.',
      },
      {
        step: '03',
        title: 'Boost',
        body: 'Carrot seed diluted in a carrier 2–3 nights a week.',
      },
    ],
    articleSlugs: ['morning-skincare-ritual'],
  },
]

export function getConcernBySlug(slug: string) {
  return concernPages.find((c) => c.slug === slug)
}

export function concernPath(slug: string) {
  return `${ROUTES.concerns}/${slug}`
}
