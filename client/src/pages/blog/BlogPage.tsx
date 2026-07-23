import { useMemo, useState } from 'react'
import { Seo } from '@components/seo/Seo'
import { EditorialHero, BlogCard } from '@components/content'
import { blogArticles, blogHero } from '@/data/blog'
import {
  useGsap,
  revealCommerceBlocks,
  revealCommerceGrid,
} from '@animations/gsap'
import { cn } from '@utils/index'

const CATEGORIES = [
  'All',
  'Hair Care',
  'Face Care',
  'Ayurveda',
  'Lifestyle',
  'Nutrition',
  'Rituals',
  'Ingredients',
  'Wellness',
  'Seasonal',
] as const

export default function BlogPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')

  const filtered = useMemo(() => {
    if (category === 'All') return blogArticles
    if (category === 'Face Care') {
      return blogArticles.filter(
        (a) =>
          a.category === 'Rituals' ||
          a.title.toLowerCase().includes('skin') ||
          a.title.toLowerCase().includes('face'),
      )
    }
    if (category === 'Lifestyle' || category === 'Nutrition') {
      return blogArticles.filter(
        (a) => a.category === 'Wellness' || a.category === 'Seasonal',
      )
    }
    return blogArticles.filter((a) => a.category === category)
  }, [category])

  const scope = useGsap(() => {
    if (!scope.current) return
    revealCommerceBlocks(scope.current)
    revealCommerceGrid(scope.current)
  }, [category])

  return (
    <>
      <Seo
        title="Journal"
        description="Ayurvedic skincare guides, ingredient deep-dives, and botanical wellness stories from Aura of Nature."
      />
      <main ref={scope} className="pb-24">
        <EditorialHero
          eyebrow={blogHero.eyebrow}
          title={blogHero.title}
          description={blogHero.description}
        />

        <section data-block-reveal="" className="container-aura pt-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  'border px-3 py-1.5 text-micro tracking-[0.12em] uppercase transition-colors',
                  category === cat
                    ? 'border-forest bg-forest text-warm-white'
                    : 'border-charcoal/15 text-charcoal hover:border-forest',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section data-block-reveal="" className="section-aura">
          <div className="container-aura grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="container-aura mt-8 text-sm text-olive">
              No articles in this category yet — browse All for the full journal.
            </p>
          )}
        </section>
      </main>
    </>
  )
}
