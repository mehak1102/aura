import { ROUTES } from '@/routes/paths'

export type NavLink = {
  label: string
  to: string
}

export type NavGroup = {
  title: string
  links: NavLink[]
}

export const primaryNav: NavLink[] = [
  { label: 'Ingredients', to: ROUTES.ingredients },
  { label: 'Gift sets', to: ROUTES.giftSets },
  { label: 'Contact', to: ROUTES.contact },
]

export const menuGroups: NavGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: ROUTES.shop },
      { label: 'Gift Sets', to: ROUTES.giftSets },
      { label: 'Best Sellers', to: ROUTES.bestSellers },
      { label: 'New Arrivals', to: ROUTES.newArrivals },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Skin Care', to: ROUTES.skinCare },
      { label: 'Body Care', to: ROUTES.bodyCare },
      { label: 'Hair Care', to: ROUTES.hairCare },
      { label: 'Essential Oils', to: ROUTES.essentialOils },
      { label: 'Cold Pressed Oils', to: ROUTES.coldPressedOils },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Our Story', to: ROUTES.ourStory },
      { label: 'Ingredients', to: ROUTES.ingredients },
      { label: 'FAQ', to: ROUTES.faq },
      { label: 'Contact', to: ROUTES.contact },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', to: ROUTES.account },
      { label: 'Wishlist', to: ROUTES.wishlist },
      { label: 'Orders', to: ROUTES.orderHistory },
      { label: 'Sign In', to: ROUTES.login },
    ],
  },
]

export const footerGroups: NavGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Gift Sets', to: ROUTES.giftSets },
      { label: 'Essential Oils', to: ROUTES.essentialOils },
      { label: 'Best Sellers', to: ROUTES.bestSellers },
      { label: 'New Arrivals', to: ROUTES.newArrivals },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', to: ROUTES.ourStory },
      { label: 'Ingredients', to: ROUTES.ingredients },
      { label: 'Contact', to: ROUTES.contact },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', to: ROUTES.faq },
      { label: 'Shipping', to: ROUTES.shipping },
      { label: 'Returns', to: ROUTES.returns },
      { label: 'Privacy', to: ROUTES.privacy },
    ],
  },
]
