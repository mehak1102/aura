export const storyHero = {
  eyebrow: 'Our story',
  title: 'From a kitchen table to your ritual',
  description:
    'What began as homemade oils for family and friends grew into a brand built on trust, transparency, and the quiet power of plants.',
  image:
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80',
}

/**
 * Our Story hero bento gallery. Order matters — tiles 1, 3, 4 and 6 are tall,
 * the rest are landscape, and tile 3 is the one that fills the screen.
 */
export const storyBento = {
  eyebrow: 'Our story',
  title: 'From a kitchen table to your ritual',
  description:
    'What began as homemade oils for family and friends grew into a brand built on trust, transparency, and the quiet power of plants.',
  hint: 'Scroll to follow the journey',
  images: [
    {
      src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&h=1200&q=80',
      alt: 'Botanical oils and dried herbs on a studio table',
    },
    {
      src: '/ingredients-showcase/jojoba.png',
      alt: 'Goat milk soap bar with fresh milk and leaves',
    },
    {
      src: '/hero/hero-fullscreen.png',
      alt: 'Radiance face serum with saffron and white blossom',
    },
    {
      src: '/ingredients-botanicals/rosemary.jpg',
      alt: 'Fresh rosemary plant',
    },
    {
      src: '/hero/story-jojoba.png',
      alt: 'Aura of Nature cold-pressed jojoba oil with its carton',
    },
    {
      src: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&h=1200&q=80',
      alt: 'Green botanical leaves harvested for our formulas',
    },
    {
      src: '/reviews/image.png',
      alt: 'Nourishing peach lotion with fresh peaches',
    },
    {
      src: '/ingredients-showcase/watermelon.png',
      alt: 'Tea tree sprigs and oil on a stone podium',
    },
  ],
}

export const whyAura = {
  eyebrow: 'Why Aura',
  title: 'Welcome to Aura of Nature',
  lead: 'We bring to you a diverse range of 100% natural oils and natural products. Our aim is to enhance your overall well-being and increase the energy of your aura.',
  paragraphs: [
    'Our natural products have been extensively researched, sourced, and curated with utmost care. We have a unique and talented team who use only the best practices, with no compromises at all.',
    'Every single product has its own set of unique properties and is of the highest quality. Our products address a variety of concerns and are for beautification purposes that primarily include skin care, body care, and hair care.',
  ],
  image: '/hero/hero-product-stage.png',
}

export const storyMission = {
  eyebrow: 'Our mission',
  title: 'Luxury that belongs in everyday life',
  paragraphs: [
    'We are obsessed with high quality and at the same time we make sure we are mindful about pricing. We want these luxury products to be affordable, so that more people can inculcate them as part of their daily routine.',
    'We want to make a positive impact on each of our customers’ lives by providing products that will help enhance their overall well-being to the very best of our ability.',
  ],
  closing: ['Our journey continues.', 'Live well. Keep healthy. Be happy.'],
  founders: [
    { name: 'Kartik Metre', role: 'Founder' },
    { name: 'Reena Metre', role: 'Co-founder' },
  ],
}

export type StoryPromise = {
  title: string
  body: string
  icon: 'certified' | 'pure' | 'cruelty' | 'ayurvedic' | 'handcrafted' | 'honest'
}

export const storyPromises: StoryPromise[] = [
  {
    title: 'Certified organic',
    body: 'Derived from nature, all our oils are 100% pure and are manufactured at organic USDA certified units.',
    icon: 'certified',
  },
  {
    title: '100% pure',
    body: 'No mineral oils, artificial colours, fragrances, sulfates, parabens, or GMOs.',
    icon: 'pure',
  },
  {
    title: 'Cruelty-free',
    body: 'Non-toxic, hypo-allergenic, and never tested on animals — our products adhere to the highest ethical and sustainable practices.',
    icon: 'cruelty',
  },
  {
    title: 'Ayurvedic rituals',
    body: 'Following ancient Ayurvedic rituals, we harvest plants at their maximum potency and prepare them using unaltered recipes.',
    icon: 'ayurvedic',
  },
  {
    title: 'Expertly handcrafted',
    body: 'Our researched, handcrafted products are prepared manually in small batches by trained and experienced staff until they are perfected.',
    icon: 'handcrafted',
  },
  {
    title: 'Honesty and transparency',
    body: 'We believe in making beauty inclusive, transparent, and wholesome. We declare all ingredients used in our products to ensure your safety.',
    icon: 'honest',
  },
]

export type StoryMilestone = {
  year: string
  title: string
  body: string
  icon: 'mortar' | 'leaf' | 'dropper' | 'people'
  image: string
}

export const storyTimeline: StoryMilestone[] = [
  {
    year: '2018',
    title: 'The first batch',
    body: 'Cold-pressed oils blended by hand in a small kitchen, from family Ayurvedic recipes.',
    icon: 'mortar',
    image: '/timeline/01-timeline.png',
  },
  {
    year: '2020',
    title: 'Aura of Nature is born',
    body: 'Friends asked for more, so we formalised the brand: pure ingredients, honest labels, no shortcuts.',
    icon: 'leaf',
    image: '/timeline/02-timeline.png',
  },
  {
    year: '2022',
    title: 'Small-batch studio',
    body: 'A studio of our own — still made by hand, harvested at peak potency, prepared in small runs.',
    icon: 'dropper',
    image: '/timeline/03-timeline.png',
  },
  {
    year: 'Today',
    title: 'Your daily ritual',
    body: 'Thousands across India trust Aura for skin, body, and hair care that genuinely works.',
    icon: 'people',
    image: '/reviews/03-peach.png',
  },
]

export const storyQuote = {
  text: 'We are not just a formula. We are part of your ritual.',
  author: 'Founder, Aura of Nature',
  image: '/ingredients-showcase/06-eucalyptus.png',
}

export const ingredientsHero = {
  eyebrow: 'Ingredients',
  title: 'Every botanical has a purpose',
  description:
    'We source the finest plant extracts, cold-pressed oils, and essential oils — each chosen for a specific benefit to skin, body, or hair.',
  image:
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1600&q=80',
}

export const ingredientSpotlight = [
  {
    name: 'Neem',
    latin: 'Azadirachta indica',
    benefit: 'Antibacterial, clarifies acne-prone skin',
    usedIn: 'Neem & Tea Tree Face Wash, Acne Control Serum',
    image:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rosehip',
    latin: 'Rosa canina',
    benefit: 'Rich in vitamins A & C, fades scars and evens tone',
    usedIn: 'Rosehip Renewal Oil, Vitamin C Brightening Serum',
    image:
      'https://images.unsplash.com/photo-1615485500707-6d97bb7f4f94?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Aloe Vera',
    latin: 'Aloe barbadensis',
    benefit: 'Deep hydration, soothes irritation and redness',
    usedIn: 'Aloe Hydrating Gel, Soothing Body Lotion',
    image:
      'https://images.unsplash.com/photo-1629198688000-300f7251061e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bhringraj',
    latin: 'Eclipta prostrata',
    benefit: 'Strengthens hair roots, reduces hair fall',
    usedIn: 'Bhringraj Hair Oil, Anti-Hairfall Shampoo',
    image:
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Turmeric',
    latin: 'Curcuma longa',
    benefit: 'Anti-inflammatory, brightens dull complexion',
    usedIn: 'Turmeric Glow Mask, Ubtan Body Scrub',
    image:
      'https://images.unsplash.com/photo-1615485500707-6d97bb7f4f94?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Lavender',
    latin: 'Lavandula angustifolia',
    benefit: 'Calming aroma, promotes restful sleep',
    usedIn: 'Lavender Essential Oil, Sleep Ritual Set',
    image:
      'https://images.unsplash.com/photo-1598579130668-885883a0ad45?auto=format&fit=crop&w=800&q=80',
  },
]

export const sourcingNote = {
  title: 'How we source',
  body: 'We partner with small farms and cooperatives across India. Plants are harvested at peak potency, cold-pressed within hours, and never treated with synthetic preservatives before they reach our studio.',
}
