export type BlogArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  image: string
  imageAlt: string
  sections: { heading?: string; paragraphs: string[] }[]
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'morning-skincare-ritual',
    title: 'The 5-step morning ritual for glowing skin',
    excerpt:
      'Start your day with intention — a simple Ayurvedic routine that sets your skin up for balance and radiance.',
    category: 'Rituals',
    author: 'Aura Editorial',
    publishedAt: '2026-03-12',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Morning skincare ritual with natural products',
    sections: [
      {
        paragraphs: [
          'Your morning skincare ritual is more than a routine — it is a moment of grounding before the day begins. Ayurveda teaches that morning care should be gentle, warming, and balancing.',
        ],
      },
      {
        heading: 'Step 1 — Cleanse with intention',
        paragraphs: [
          'Use a mild, sulphate-free cleanser suited to your skin type. Massage in upward circles for 60 seconds, then rinse with lukewarm water. Avoid hot water — it strips natural oils.',
        ],
      },
      {
        heading: 'Step 2 — Tone and balance',
        paragraphs: [
          'A botanical toner restores pH and preps skin for hydration. Rose water or neem-infused mist works beautifully for most skin types.',
        ],
      },
      {
        heading: 'Step 3 — Serum and treat',
        paragraphs: [
          'Apply a few drops of serum while skin is still damp. Vitamin C in the morning protects against environmental stress; hyaluronic acid locks in moisture.',
        ],
      },
      {
        heading: 'Step 4 — Moisturise and protect',
        paragraphs: [
          'Seal everything with a light moisturiser, then SPF 30+ — even on cloudy days. UV damage is the leading cause of premature ageing.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-ayurvedic-skin-types',
    title: 'Understanding your Ayurvedic skin type',
    excerpt:
      'Vata, Pitta, Kapha — learn how ancient wisdom maps to modern skincare and find formulas that truly suit you.',
    category: 'Ayurveda',
    author: 'Dr. Priya Sharma',
    publishedAt: '2026-02-28',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Ayurvedic herbs and oils',
    sections: [
      {
        paragraphs: [
          'In Ayurveda, skin reflects your dominant dosha — the elemental constitution that governs how your body and mind respond to the world. Understanding your dosha helps you choose products that work with your nature, not against it.',
        ],
      },
      {
        heading: 'Vata skin — dry, thin, sensitive',
        paragraphs: [
          'Vata-dominant skin tends toward dryness, fine lines, and sensitivity. Rich oils, creamy cleansers, and deep hydration are essential. Avoid harsh exfoliants and alcohol-based toners.',
        ],
      },
      {
        heading: 'Pitta skin — combination, reactive',
        paragraphs: [
          'Pitta skin is often warm, prone to redness, and may break out under stress. Cooling ingredients like aloe, sandalwood, and rose help calm inflammation. SPF is non-negotiable.',
        ],
      },
      {
        heading: 'Kapha skin — oily, thick, resilient',
        paragraphs: [
          'Kapha skin produces more sebum and may feel heavy or congested. Light, clarifying formulas with neem, tea tree, and clay work well. Regular gentle exfoliation keeps pores clear.',
        ],
      },
    ],
  },
  {
    slug: 'benefits-of-cold-pressed-oils',
    title: 'Why cold-pressed oils change everything',
    excerpt:
      'Heat destroys nutrients. Cold pressing preserves vitamins, antioxidants, and the living essence of every seed and nut.',
    category: 'Ingredients',
    author: 'Aura Editorial',
    publishedAt: '2026-02-15',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1474979266404-7ea320f782b0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cold pressed oil bottles',
    sections: [
      {
        paragraphs: [
          'Most commercial oils are extracted using heat and chemical solvents — a process that strips away the very compounds your skin craves. Cold pressing uses mechanical pressure alone, at temperatures below 49°C, preserving the full nutritional profile.',
        ],
      },
      {
        heading: 'What you keep',
        paragraphs: [
          'Cold-pressed oils retain vitamins A, E, and K, essential fatty acids, and polyphenols — all critical for barrier repair, anti-ageing, and deep nourishment.',
        ],
      },
      {
        heading: 'How we use them',
        paragraphs: [
          'Every Aura cold-pressed oil is single-origin, unrefined, and bottled within 48 hours of pressing. Use them as facial oils, hair treatments, or body moisturisers — a little goes a long way.',
        ],
      },
    ],
  },
  {
    slug: 'seasonal-skincare-winter',
    title: 'Winter skincare: protecting your barrier',
    excerpt:
      'Cold air and indoor heating strip moisture fast. Here is how to keep your skin soft, supple, and resilient through the season.',
    category: 'Seasonal',
    author: 'Aura Editorial',
    publishedAt: '2026-01-20',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Winter skincare products',
    sections: [
      {
        paragraphs: [
          'Winter is hard on skin. Low humidity, harsh winds, and central heating create a perfect storm for dryness, flaking, and irritation. The key is layering hydration and protecting your lipid barrier.',
        ],
      },
      {
        heading: 'Switch to richer textures',
        paragraphs: [
          'Replace gel moisturisers with cream or balm formulas. Add a facial oil as the last step at night — rosehip and almond oils are excellent for winter repair.',
        ],
      },
      {
        heading: 'Do not skip SPF',
        paragraphs: [
          'UV rays reflect off snow and penetrate clouds. Continue daily sun protection even when it feels cold outside.',
        ],
      },
    ],
  },
  {
    slug: 'essential-oils-for-sleep',
    title: 'Essential oils for a restful night',
    excerpt:
      'Lavender, chamomile, and vetiver — three botanicals that calm the nervous system and invite deep, restorative sleep.',
    category: 'Wellness',
    author: 'Aura Editorial',
    publishedAt: '2026-01-08',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Lavender essential oil',
    sections: [
      {
        paragraphs: [
          'Sleep is when skin repairs itself. A calming evening ritual — with the right essential oils — can improve both sleep quality and morning radiance.',
        ],
      },
      {
        heading: 'Lavender',
        paragraphs: [
          'The most studied sleep aid in aromatherapy. Diffuse 3–4 drops 30 minutes before bed, or add to a warm foot bath.',
        ],
      },
      {
        heading: 'Chamomile',
        paragraphs: [
          'Gentle and soothing for sensitive types. Blend with a carrier oil and apply to temples and wrists.',
        ],
      },
    ],
  },
  {
    slug: 'hair-oil-massage-guide',
    title: 'The art of Ayurvedic hair oiling',
    excerpt:
      'Scalp massage with warm bhringraj or coconut oil stimulates circulation, strengthens roots, and turns hair care into meditation.',
    category: 'Hair Care',
    author: 'Aura Editorial',
    publishedAt: '2025-12-18',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Hair oil application',
    sections: [
      {
        paragraphs: [
          'Hair oiling — champi — is one of Ayurveda\'s oldest rituals. Warm oil massaged into the scalp nourishes follicles, reduces stress, and improves hair texture over time.',
        ],
      },
      {
        heading: 'How to oil your hair',
        paragraphs: [
          'Warm 2–3 tablespoons of oil between your palms. Section hair and massage scalp in circular motions for 10–15 minutes. Leave on for at least 30 minutes, or overnight for deep treatment. Wash with a gentle shampoo.',
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return blogArticles.find((a) => a.slug === slug)
}

export const blogHero = {
  eyebrow: 'Journal',
  title: 'Stories, rituals & botanical wisdom',
  description:
    'Guides on Ayurvedic skincare, ingredient deep-dives, and the quiet art of self-care.',
}
