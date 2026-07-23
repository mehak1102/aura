export type StoreLocation = {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  hours: string
  lat: number
  lng: number
}

export const storeLocations: StoreLocation[] = [
  {
    id: 'blr-studio',
    name: 'Aura Studio — Bengaluru',
    address: '42, Indiranagar 100 Feet Road, HAL 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 80 4567 8900',
    hours: 'Mon–Sat 10 AM – 7 PM',
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: 'mum-flagship',
    name: 'Aura Flagship — Mumbai',
    address: 'Shop 12, Palladium Mall, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    phone: '+91 22 4567 8901',
    hours: 'Mon–Sun 11 AM – 9 PM',
    lat: 18.9946,
    lng: 72.8258,
  },
  {
    id: 'del-store',
    name: 'Aura — Delhi',
    address: 'Ground Floor, Select Citywalk, Saket',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    phone: '+91 11 4567 8902',
    hours: 'Mon–Sun 11 AM – 9 PM',
    lat: 28.5244,
    lng: 77.2066,
  },
  {
    id: 'hyd-store',
    name: 'Aura — Hyderabad',
    address: 'Unit 8, Inorbit Mall, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    phone: '+91 40 4567 8903',
    hours: 'Mon–Sun 11 AM – 9 PM',
    lat: 17.4435,
    lng: 78.3772,
  },
]

export const contactInfo = {
  email: 'hello@auraofnature.com',
  support: 'support@auraofnature.com',
  phone: '+91 80 4567 8900',
  whatsapp: '+91 98765 43210',
  address: 'Aura of Nature, Indiranagar, Bengaluru 560038, India',
  hours: 'Mon–Sat, 10 AM – 6 PM IST',
}

export const contactHero = {
  eyebrow: 'Contact',
  title: 'We would love to hear from you',
  description:
    'Questions about a product, an order, or a custom ritual? Our team responds within one business day.',
}

export const storeHero = {
  eyebrow: 'Store locator',
  title: 'Visit us in person',
  description:
    'Experience our products, speak with our advisors, and discover your ritual at an Aura studio near you.',
}
