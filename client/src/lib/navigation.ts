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
  { label: 'Women', to: ROUTES.women },
  { label: 'Men', to: ROUTES.men },
  { label: 'Skin concerns', to: ROUTES.concerns },
  { label: 'Ingredients', to: ROUTES.ingredients },
  { label: 'Gift sets', to: ROUTES.giftSets },
  { label: 'About', to: ROUTES.about },
  { label: 'Blogs', to: ROUTES.blog },
  { label: 'Contact', to: ROUTES.contact },
]

export const menuGroups: NavGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Women', to: ROUTES.women },
      { label: 'Men', to: ROUTES.men },
      { label: 'All Products', to: ROUTES.shop },
      { label: 'Skin Concerns', to: ROUTES.concerns },
      { label: 'Gift Sets', to: ROUTES.giftSets },
      { label: 'Best Sellers', to: ROUTES.bestSellers },
      { label: 'New Arrivals', to: ROUTES.newArrivals },
      { label: 'Skin Quiz', to: ROUTES.skinQuiz },
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
      { label: 'Combos', to: ROUTES.combos },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'About', to: ROUTES.about },
      { label: 'Our Story', to: ROUTES.ourStory },
      { label: 'Ingredients', to: ROUTES.ingredients },
      { label: 'Blogs', to: ROUTES.blog },
      { label: 'FAQ', to: ROUTES.faq },
      { label: 'Store Locator', to: ROUTES.storeLocator },
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
      { label: 'Women', to: ROUTES.women },
      { label: 'Men', to: ROUTES.men },
      { label: 'Skin Concerns', to: ROUTES.concerns },
      { label: 'Gift Sets', to: ROUTES.giftSets },
      { label: 'Essential Oils', to: ROUTES.essentialOils },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: ROUTES.about },
      { label: 'Our Story', to: ROUTES.ourStory },
      { label: 'Ingredients', to: ROUTES.ingredients },
      { label: 'Contact', to: ROUTES.contact },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Skin Quiz', to: ROUTES.skinQuiz },
      { label: 'FAQ', to: ROUTES.faq },
      { label: 'Shipping', to: ROUTES.shipping },
      { label: 'Returns', to: ROUTES.returns },
      { label: 'Privacy', to: ROUTES.privacy },
    ],
  },
]
