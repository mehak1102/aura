import { ROUTES } from '@/routes/paths'

export type GiftSet = {
  id: string
  slug: string
  title: string
  occasion: 'festive' | 'wedding' | 'corporate' | 'luxury'
  eyebrow: string
  body: string
  priceLabel: string
  image: string
  productSlugs: string[]
  to: string
}

export const giftSets: GiftSet[] = [
  {
    id: 'festive',
    slug: 'festive-box',
    title: 'Festive Box',
    occasion: 'festive',
    eyebrow: 'Celebrate',
    body: 'Charcoal, coffee wash, and a bright oil — a complete reset gift for the season.',
    priceLabel: 'From ₹1,899',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
    productSlugs: [
      'activated-charcoal-soap',
      'fresh-coffee-face-wash',
      'watermelon-seed-cold-pressed-oil',
    ],
    to: `${ROUTES.shop}?q=gift`,
  },
  {
    id: 'wedding',
    slug: 'wedding-gift',
    title: 'Wedding Gift',
    occasion: 'wedding',
    eyebrow: 'For the couple',
    body: 'Soft goat milk, peach lotion, and lavender — rituals for new beginnings.',
    priceLabel: 'From ₹2,499',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    productSlugs: [
      'goat-milk-soap',
      'nourishing-peach-lotion-kumkumadi-oil',
      'lavender-essential-oil',
    ],
    to: ROUTES.combos,
  },
  {
    id: 'corporate',
    slug: 'corporate-gift',
    title: 'Corporate Gift',
    occasion: 'corporate',
    eyebrow: 'Client & team',
    body: 'Refined oils with quiet packaging — professional, memorable, botanical.',
    priceLabel: 'From ₹3,299',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    productSlugs: [
      'jojoba-cold-pressed-oil',
      'tea-tree-essential-oil',
      'eucalyptus-essential-oil',
    ],
    to: ROUTES.combos,
  },
  {
    id: 'luxury',
    slug: 'luxury-gift-box',
    title: 'Luxury Gift Box',
    occasion: 'luxury',
    eyebrow: 'The full ritual',
    body: 'A curated shelf of cold-pressed oils and essentials for the devoted ritualist.',
    priceLabel: 'From ₹4,999',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    productSlugs: [
      'wild-apricot-cold-pressed-oil',
      'black-cumin-cold-pressed-oil',
      'carrot-seed-essential-oil',
      'cucumber-seed-cold-pressed-oil',
    ],
    to: ROUTES.combos,
  },
]

export const giftSetsHero = {
  eyebrow: 'Gift sets',
  title: 'Give a ritual, not just a product',
  description:
    'Festive, wedding, corporate, and luxury boxes — assembled from our most-loved botanicals.',
}
