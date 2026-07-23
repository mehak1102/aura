/** Design system constants — mirror CSS tokens for JS consumers */
export const colors = {
  cream: '#f4efe6',
  warmWhite: '#faf8f4',
  beige: '#e6dccb',
  beigeDeep: '#d4c6b0',
  forest: '#243528',
  forestDeep: '#1a261c',
  olive: '#5a6b48',
  oliveSoft: '#7a8b68',
  softGold: '#b8975c',
  softGoldLight: '#d4b87a',
  charcoal: '#1a1a18',
  charcoalMuted: '#4a4844',
} as const

export const fonts = {
  display: "'Cormorant Garamond', 'Times New Roman', serif",
  sans: "'Outfit', ui-sans-serif, sans-serif",
} as const

export const easings = {
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOutSoft: 'cubic-bezier(0.45, 0, 0.55, 1)',
} as const

export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  reveal: 1.2,
} as const

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
