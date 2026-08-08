import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CircleHelp,
  Droplets,
  FlaskConical,
  Heart,
  Leaf,
  Moon,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Wind,
} from 'lucide-react'
import type { CatalogProduct } from '@/types/shop'
import { cn } from '@utils/index'
import { motionEase } from '@animations/framer/presets'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'

type SectionId = 'benefits' | 'ingredients' | 'howto' | 'types' | 'faqs'

type NavItem = {
  id: SectionId
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
}

type ProductTabsProps = {
  product: CatalogProduct
}

const FOREST = '#173728'
const ACCENT = '#C7A66A'
const BOX = '#fffbef'
const BORDER = 'rgba(199,166,106,0.55)'
const RADIUS = '24px'

const SECTION_IMAGES: Record<SectionId, string> = {
  benefits: '/product-info/benefits.png',
  ingredients: '/product-info/ingredients.png',
  howto: '/product-info/howto.png',
  types: '/product-info/skin-hair.png',
  faqs: '/product-info/faqs.png',
}

const NAV: NavItem[] = [
  {
    id: 'benefits',
    title: 'Benefits',
    subtitle: "Nature's goodness for your skin",
    icon: Leaf,
  },
  {
    id: 'ingredients',
    title: 'Ingredients',
    subtitle: 'Botanicals inside every bottle',
    icon: FlaskConical,
  },
  {
    id: 'howto',
    title: 'How to use',
    subtitle: 'Your simple daily ritual',
    icon: Droplets,
  },
  {
    id: 'types',
    title: 'Skin & hair',
    subtitle: 'Face, hair, scalp & body',
    icon: Wind,
  },
  {
    id: 'faqs',
    title: 'FAQs',
    subtitle: 'Shipping, returns & care',
    icon: CircleHelp,
  },
]

const BENEFIT_COPY: Record<string, string> = {
  'removes skin impurities and toxins':
    'Deeply cleanses and purifies skin, drawing out dirt and toxins naturally.',
  'sls free':
    'Gentle on sensitive skin — free from harsh foaming agents.',
  'paraben free':
    'Formulated without harmful preservatives or chemicals.',
  'natural and hand-crafted':
    'Small-batch crafted with care for a pure daily ritual.',
  'natural & handcrafted':
    'Small-batch crafted with care for a pure daily ritual.',
  'rejuvenates skin':
    'Nourishes and renews for a softer, fresher look each day.',
  'moisturizes skin':
    'Locks in hydration for lasting comfort and a healthy glow.',
}

const INGREDIENT_META: Record<
  string,
  { latin: string; blurb: string; features: string[] }
> = {
  charcoal: {
    latin: 'Carbo activatus',
    blurb: 'Activated charcoal draws impurities for clearer, refreshed skin.',
    features: ['Deep cleanse', 'Draws toxins', 'Mattifying', 'Handmade', 'Cruelty free'],
  },
  'goat milk': {
    latin: 'Lac caprae',
    blurb: 'Nourishing goat milk softens and comforts dry, sensitive skin.',
    features: ['Moisturising', 'Gentle cleanse', 'Softens', 'Handmade', 'Cruelty free'],
  },
  coffee: {
    latin: 'Coffea arabica',
    blurb: 'Antioxidant-rich coffee awakens dull skin with gentle polish.',
    features: ['Antioxidants', 'Awakens skin', 'Natural polish', 'Pure', 'Cruelty free'],
  },
  peach: {
    latin: 'Prunus persica',
    blurb: 'Peach extract with kumkumadi-inspired care for soft, hydrated skin.',
    features: ['Hydrating', 'Smoothing', 'Glow', 'Natural', 'Cruelty free'],
  },
  'tea tree': {
    latin: 'Melaleuca alternifolia',
    blurb: 'Clarifying tea tree for skin and scalp rituals that feel fresh.',
    features: ['100% Pure', 'Steam distilled', 'Clarifying', 'Antibacterial', 'Cruelty free'],
  },
  lavender: {
    latin: 'Lavandula angustifolia',
    blurb: 'Calming lavender essential oil for skin, hair, and aromatic ease.',
    features: ['100% Pure', 'Calming', 'Hair vitality', 'Steam distilled', 'Cruelty free'],
  },
  eucalyptus: {
    latin: 'Eucalyptus globulus',
    blurb: 'Invigorating eucalyptus for air clarity and a crisp botanical scent.',
    features: ['100% Pure', 'Steam Distilled', 'Air disinfectant', 'Mosquito repellent', 'Cruelty free'],
  },
  carrot: {
    latin: 'Daucus carota',
    blurb: 'Cold-pressed carrot seed oil for radiance and nourishing lipids.',
    features: ['Cold pressed', 'Radiance', 'Nourishing', 'Pure', 'Cruelty free'],
  },
  watermelon: {
    latin: 'Citrullus lanatus',
    blurb: 'Lightweight watermelon seed oil that absorbs fast for everyday glow.',
    features: ['Lightweight', 'Fast absorb', 'Cold pressed', 'Glow', 'Cruelty free'],
  },
  jojoba: {
    latin: 'Simmondsia chinensis',
    blurb: 'Skin-mimicking jojoba lipids that balance and soften without heaviness.',
    features: ['Cold pressed', 'Balances', 'Softens', 'Lab tested', 'Cruelty free'],
  },
  apricot: {
    latin: 'Prunus armeniaca',
    blurb: 'Light apricot kernel oil that softens skin and supports elasticity.',
    features: ['Light oil', 'Softens', 'Cold pressed', 'Farm to home', 'Cruelty free'],
  },
  cumin: {
    latin: 'Nigella sativa',
    blurb: 'Black cumin oil for ultra-smooth massage and hair-fall care.',
    features: ['Massage oil', 'Hair care', 'Cold pressed', 'Pure', 'Cruelty free'],
  },
  cucumber: {
    latin: 'Cucumis sativus',
    blurb: 'Cooling cucumber seed oil for lightweight daily softness.',
    features: ['Cooling', 'Lightweight', 'Cold pressed', 'Softens', 'Cruelty free'],
  },
}

const BENEFIT_ICONS = [Sparkles, ShieldCheck, Droplets, Leaf, Check, Heart]

const panelMotion = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.45, ease: motionEase },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: motionEase },
  },
}

function benefitDescription(title: string) {
  return (
    BENEFIT_COPY[title.trim().toLowerCase()] ??
    'A thoughtful botanical benefit woven into this daily ritual.'
  )
}

function resolveIngredient(product: CatalogProduct) {
  const hay =
    `${product.slug} ${product.title} ${product.ingredients.join(' ')}`.toLowerCase()
  const found = Object.entries(INGREDIENT_META).find(([k]) => hay.includes(k))?.[1]
  return {
    latin: found?.latin ?? product.ingredients[0] ?? 'Botanical extract',
    blurb:
      found?.blurb ??
      product.description.slice(0, 140) +
        (product.description.length > 140 ? '…' : ''),
    features:
      found?.features ??
      [...product.benefits.slice(0, 4), 'Cruelty free'].slice(0, 5),
  }
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-7 md:mb-8">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
          style={{ borderColor: BORDER, color: FOREST }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <h3
          className="font-display text-[clamp(1.85rem,3vw,2.5rem)] leading-none tracking-tight"
          style={{ color: FOREST }}
        >
          {title}
        </h3>
      </div>
      <div className="mt-4 h-px w-12" style={{ backgroundColor: 'rgba(23,55,40,0.15)' }} />
      <p className="mt-3 text-[0.9rem] text-[#6b655c]">{subtitle}</p>
    </div>
  )
}

function FeatureRow({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  body: string
}) {
  return (
    <motion.li variants={fadeUp} className="flex min-w-0 gap-3.5">
      <span
        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(23,55,40,0.18)', color: FOREST }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.92rem] font-semibold leading-snug" style={{ color: FOREST }}>
          {title}
        </p>
        <p className="mt-1 break-words text-[0.82rem] leading-relaxed text-[#6b655c]">
          {body}
        </p>
      </div>
    </motion.li>
  )
}

function SplitShell({
  children,
  image,
  imageAlt,
  reduced,
}: {
  children: ReactNode
  image: string
  imageAlt: string
  reduced: boolean
}) {
  return (
    <div className="group relative h-full w-full min-w-0 max-w-full overflow-hidden">
      {/*
        Luxury fade: image sits under a full-card cream wash.
        No mask edge on the photo itself — the solid→transparent cream
        gradient is what creates the seamless merge.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        aria-hidden
      >
        <motion.img
          key={image}
          src={image}
          alt=""
          className={cn(
            'absolute inset-y-0 right-0 h-full w-[52%] object-cover object-[72%_center]',
            'origin-right will-change-transform',
            !reduced &&
              'transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]',
          )}
          initial={reduced ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: motionEase }}
        />

        {/* Exact box colour → transparent; long soft ramp, no hard start */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              ${BOX} 0%,
              ${BOX} 46%,
              rgba(255,251,239,0.96) 52%,
              rgba(255,251,239,0.82) 58%,
              rgba(255,251,239,0.58) 66%,
              rgba(255,251,239,0.32) 76%,
              rgba(255,251,239,0.12) 88%,
              rgba(255,251,239,0) 100%
            )`,
          }}
        />
      </div>

      <span className="sr-only">{imageAlt}</span>

      <motion.div
        className="relative z-10 flex h-full w-full min-w-0 flex-col justify-center overflow-x-hidden overflow-y-auto px-5 py-8 sm:px-6 md:px-8 md:py-10 lg:max-w-[48%] lg:px-10 lg:py-12"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── Panels ── */

function BenefitsPanel({
  product,
  reduced,
}: {
  product: CatalogProduct
  reduced: boolean
}) {
  const benefits = product.benefits.slice(0, 4)

  return (
    <SplitShell
      image={SECTION_IMAGES.benefits}
      imageAlt="Benefits ritual bottle"
      reduced={reduced}
    >
      <SectionHeader
        icon={Leaf}
        title="Benefits"
        subtitle="Nature's goodness for your skin."
      />
      <ul className="min-w-0 space-y-5">
        {benefits.map((b, i) => (
          <FeatureRow
            key={b}
            icon={BENEFIT_ICONS[i % BENEFIT_ICONS.length]!}
            title={b}
            body={benefitDescription(b)}
          />
        ))}
      </ul>
    </SplitShell>
  )
}

function IngredientsPanel({
  product,
  reduced,
}: {
  product: CatalogProduct
  reduced: boolean
}) {
  const meta = useMemo(() => resolveIngredient(product), [product])

  return (
    <SplitShell
      image={SECTION_IMAGES.ingredients}
      imageAlt="Botanical ingredients"
      reduced={reduced}
    >
      <SectionHeader
        icon={FlaskConical}
        title="Ingredients"
        subtitle={product.title}
      />
      <motion.p
        variants={fadeUp}
        className="mb-2 font-display text-[1.35rem] italic leading-none tracking-tight"
        style={{ color: FOREST }}
      >
        {meta.latin}
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="mb-7 max-w-md text-[0.9rem] leading-relaxed text-[#5c574f]"
      >
        {meta.blurb}
      </motion.p>
      <motion.ul
        variants={fadeUp}
        className="flex flex-wrap gap-2.5"
      >
        {meta.features.slice(0, 5).map((f) => (
          <li
            key={f}
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.8rem] font-medium"
            style={{
              borderColor: 'rgba(23,55,40,0.14)',
              color: FOREST,
              backgroundColor: 'rgba(255,255,255,0.45)',
            }}
          >
            <Check className="h-3 w-3 shrink-0" strokeWidth={1.8} style={{ color: ACCENT }} />
            {f}
          </li>
        ))}
      </motion.ul>
    </SplitShell>
  )
}

function HowToPanel({
  product,
  reduced,
}: {
  product: CatalogProduct
  reduced: boolean
}) {
  const steps = [
    ...product.howToUse.slice(0, 3),
    ...['Cleanse gently', 'Apply as directed', 'Massage until absorbed'],
  ].slice(0, 3)

  return (
    <SplitShell
      image={SECTION_IMAGES.howto}
      imageAlt="How to apply"
      reduced={reduced}
    >
      <SectionHeader
        icon={Droplets}
        title="How to use"
        subtitle="A simple ritual, morning or night."
      />
      <ul className="space-y-5">
        {steps.map((step, i) => (
          <FeatureRow
            key={`${step}-${i}`}
            icon={i === 0 ? Sun : i === 1 ? Droplets : Moon}
            title={`Step ${i + 1}`}
            body={step}
          />
        ))}
      </ul>
    </SplitShell>
  )
}

function SkinHairPanel({
  product,
  reduced,
}: {
  product: CatalogProduct
  reduced: boolean
}) {
  const areas = [
    {
      title: 'Face',
      body: product.benefits[0] ?? 'Supports a calm, nourished complexion.',
      icon: Sparkles,
    },
    {
      title: 'Hair',
      body:
        product.benefits.find((b) => /hair|scalp|growth/i.test(b)) ??
        'Complements scalp and hair oil rituals.',
      icon: Wind,
    },
    {
      title: 'Scalp',
      body: 'Massage a few drops for comfort and vitality where suitable.',
      icon: Droplets,
    },
    {
      title: 'Body',
      body: 'Use on damp skin for lasting softness after bathing.',
      icon: Heart,
    },
  ]

  return (
    <SplitShell
      image={SECTION_IMAGES.types}
      imageAlt="Skin and hair"
      reduced={reduced}
    >
      <SectionHeader
        icon={Wind}
        title="Skin & hair"
        subtitle={`Suitable for ${product.skinTypes.slice(0, 3).join(', ')} skin.`}
      />
      <ul className="space-y-5">
        {areas.map((a) => (
          <FeatureRow key={a.title} icon={a.icon} title={a.title} body={a.body} />
        ))}
      </ul>
    </SplitShell>
  )
}

function FaqsPanel({ reduced }: { reduced: boolean }) {
  const cards = [
    {
      title: 'Shipping',
      body: 'We ship across India. Orders typically leave within 2–4 business days.',
      icon: Truck,
    },
    {
      title: 'Returns',
      body: 'Unopened products may be returned within 7 days of delivery.',
      icon: RefreshCw,
    },
    {
      title: 'Storage',
      body: 'Keep cool and dry, away from direct sunlight. Cap tightly after use.',
      icon: Package,
    },
    {
      title: 'Shelf life',
      body: 'See the label for dates. Most rituals stay fresh 12–24 months unopened.',
      icon: ShieldCheck,
    },
  ]

  return (
    <SplitShell
      image={SECTION_IMAGES.faqs}
      imageAlt="Care notes"
      reduced={reduced}
    >
      <SectionHeader
        icon={CircleHelp}
        title="FAQs"
        subtitle="Care, shipping, and shelf life."
      />
      <ul className="space-y-5">
        {cards.map((c) => (
          <FeatureRow key={c.title} icon={c.icon} title={c.title} body={c.body} />
        ))}
      </ul>
    </SplitShell>
  )
}

function ContentViewer({
  section,
  product,
  reduced,
}: {
  section: SectionId
  product: CatalogProduct
  reduced: boolean
}) {
  switch (section) {
    case 'benefits':
      return <BenefitsPanel product={product} reduced={reduced} />
    case 'ingredients':
      return <IngredientsPanel product={product} reduced={reduced} />
    case 'howto':
      return <HowToPanel product={product} reduced={reduced} />
    case 'types':
      return <SkinHairPanel product={product} reduced={reduced} />
    case 'faqs':
      return <FaqsPanel reduced={reduced} />
    default:
      return null
  }
}

export function ProductTabs({ product }: ProductTabsProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<SectionId>('benefits')

  const navTeaser = (item: NavItem) => {
    if (item.id === 'ingredients') {
      return product.ingredients[0]
        ? `100% ${product.ingredients[0]}`
        : item.subtitle
    }
    return item.subtitle
  }

  return (
    <section className="relative mt-16 md:mt-24">
      <div className="container-aura py-12 md:py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.85fr)] xl:gap-6">
          {/* LEFT — content viewer only */}
          <div
            className="relative h-auto min-h-[min(28rem,70svh)] w-full min-w-0 max-w-full overflow-hidden border md:h-[min(38rem,75svh)] md:min-h-0 xl:h-[min(40rem,80svh)]"
            style={{
              borderColor: BORDER,
              borderRadius: RADIUS,
              boxShadow: '0 18px 44px rgba(23,55,40,0.05)',
              backgroundColor: BOX,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={panelMotion.transition}
                className="h-full w-full min-w-0 max-w-full"
              >
                <ContentViewer
                  section={active}
                  product={product}
                  reduced={reduced}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — text nav only (no images) */}
          <aside className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
            <nav className="flex flex-col gap-3" aria-label="Product information">
              {NAV.map((item) => {
                const isActive = active === item.id
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    whileHover={reduced ? undefined : { y: -2 }}
                    transition={{ duration: 0.22, ease: motionEase }}
                    className={cn(
                      'flex w-full items-center gap-3.5 border px-4 py-4 text-left transition-colors duration-300 md:px-5 md:py-[1.1rem]',
                      isActive && 'shadow-[0_14px_32px_rgba(23,55,40,0.14)]',
                    )}
                    style={{
                      borderRadius: RADIUS,
                      borderColor: isActive ? FOREST : BORDER,
                      backgroundColor: isActive ? FOREST : BOX,
                    }}
                  >
                    <span
                      className={cn(
                        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                        isActive
                          ? 'border-white/20 bg-white/12 text-white'
                          : 'border-[rgba(23,55,40,0.1)] bg-[#F7F2E9] text-[#173728]',
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block font-display text-[1.2rem] leading-none tracking-tight',
                          isActive ? 'text-white' : 'text-[#173728]',
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          'mt-1.5 block truncate text-[0.78rem] leading-snug',
                          isActive ? 'text-white/65' : 'text-[#7a746a]',
                        )}
                      >
                        {navTeaser(item)}
                      </span>
                    </span>
                    <Plus
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-300',
                        isActive
                          ? 'rotate-45 text-white/80'
                          : 'text-[#173728]/45',
                      )}
                      strokeWidth={1.6}
                    />
                  </motion.button>
                )
              })}
            </nav>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default ProductTabs
