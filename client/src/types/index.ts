export type SkinType =
  | 'normal'
  | 'dry'
  | 'oily'
  | 'combination'
  | 'sensitive'
  | 'all'

export type HairType =
  | 'straight'
  | 'wavy'
  | 'curly'
  | 'coily'
  | 'damaged'
  | 'all'

export type ProductVariant = {
  id: string
  name: string
  sku: string
  mrp: number
  price: number
  discountPercent: number
  stock: number
  weight?: string
  size?: string
}

export type ProductMedia = {
  url: string
  alt: string
  type: 'image' | 'video'
  isPrimary?: boolean
}

export type ProductReview = {
  id: string
  userName: string
  rating: number
  title?: string
  comment: string
  createdAt: string
  verified?: boolean
  status?: 'pending' | 'published' | 'hidden'
}

export type ProductFaq = {
  question: string
  answer: string
}

export type Product = {
  id: string
  title: string
  slug: string
  description: string
  benefits: string[]
  ingredients: string[]
  howToUse: string[]
  skinTypes: SkinType[]
  hairTypes: HairType[]
  tags: string[]
  reviews: ProductReview[]
  ratingAverage: number
  ratingCount: number
  faqs: ProductFaq[]
  images: ProductMedia[]
  gallery: ProductMedia[]
  videos: ProductMedia[]
  stock: number
  variants: ProductVariant[]
  mrp: number
  discountPercent: number
  category: string
  subcategory?: string
  relatedProductIds: string[]
  isBestSeller?: boolean
  isNewArrival?: boolean
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string | null
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  avatar?: string
  mustChangePassword?: boolean
  addresses?: Address[]
  createdAt?: string
}

export type Address = {
  id: string
  label: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export type CartItem = {
  productId: string
  variantId: string
  quantity: number
  product?: Product
  variant?: ProductVariant
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}
