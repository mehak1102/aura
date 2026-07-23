import type { HairType, Product, SkinType } from '@/types'

export type ProductCategory =
  | 'skin-care'
  | 'body-care'
  | 'hair-care'
  | 'essential-oils'
  | 'cold-pressed-oils'
  | 'combos'

export type ProductConcern =
  | 'acne'
  | 'dryness'
  | 'dullness'
  | 'hairfall'
  | 'pigmentation'
  | 'sensitivity'

export type ProductGender = 'men' | 'women' | 'unisex'

export type CatalogProduct = Product & {
  concerns: ProductConcern[]
  category: ProductCategory
  gender?: ProductGender
}

export type ShopSort =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'

export type ShopFilters = {
  category?: ProductCategory | 'all'
  concern?: ProductConcern | 'all'
  skinType?: SkinType | 'all'
  hairType?: HairType | 'all'
  gender?: ProductGender | 'all'
  ingredient?: string
  query?: string
  minPrice?: number
  maxPrice?: number
  bestSeller?: boolean
  newArrival?: boolean
  sort?: ShopSort
}

export const CATEGORY_META: Record<
  ProductCategory | 'all' | 'best-sellers' | 'new-arrivals',
  { title: string; description: string; eyebrow: string }
> = {
  all: {
    title: 'Shop All',
    eyebrow: 'Collections',
    description:
      'Botanical rituals for skin, body, hair, and oils — handcrafted in small batches.',
  },
  'skin-care': {
    title: 'Skin Care',
    eyebrow: 'Clarify · Nourish · Restore',
    description: 'Face washes, soaps, and serums rooted in plant clarity.',
  },
  'body-care': {
    title: 'Body Care',
    eyebrow: 'Soft · Scented · Grounded',
    description: 'Body oils and baths that soften without overwhelm.',
  },
  'hair-care': {
    title: 'Hair Care',
    eyebrow: 'Strengthen · Shine · Balance',
    description: 'Oils and treatments for scalp calm and lasting shine.',
  },
  'essential-oils': {
    title: 'Essential Oils',
    eyebrow: 'Aroma · Focus · Calm',
    description: 'Pure distillations for ritual, pulse points, and blends.',
  },
  'cold-pressed-oils': {
    title: 'Cold Pressed Oils',
    eyebrow: 'Raw · Potent · Pure',
    description: 'Nutrient-rich oils pressed without heat.',
  },
  combos: {
    title: 'Combos',
    eyebrow: 'Curated sets',
    description: 'Thoughtful pairings for complete rituals at a quieter price.',
  },
  'best-sellers': {
    title: 'Best Sellers',
    eyebrow: 'Loved rituals',
    description: 'The formulas our circle returns to again and again.',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    eyebrow: 'Just released',
    description: 'Fresh batches and seasonal botanicals, newly arrived.',
  },
}

export const CONCERN_OPTIONS: { value: ProductConcern; label: string }[] = [
  { value: 'acne', label: 'Acne & Blemishes' },
  { value: 'dryness', label: 'Dryness' },
  { value: 'dullness', label: 'Dullness' },
  { value: 'hairfall', label: 'Hair Fall' },
  { value: 'pigmentation', label: 'Pigmentation' },
  { value: 'sensitivity', label: 'Sensitivity' },
]

export const GENDER_OPTIONS: { value: ProductGender; label: string }[] = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
]

export const SKIN_OPTIONS: { value: SkinType; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive', label: 'Sensitive' },
]

export const HAIR_OPTIONS: { value: HairType; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'wavy', label: 'Wavy' },
  { value: 'curly', label: 'Curly' },
  { value: 'coily', label: 'Coily' },
  { value: 'damaged', label: 'Damaged' },
]

export const SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]
