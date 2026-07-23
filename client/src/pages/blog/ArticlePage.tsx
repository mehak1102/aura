import { Link, useNavigate, useParams } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { BlogCard } from '@components/content'
import { Body, Display, Eyebrow, MagneticButton } from '@components/ui'
import { blogArticles, getArticleBySlug } from '@/data/blog'
import { ROUTES } from '@/routes/paths'

export default function ArticlePage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <>
        <Seo title="Article not found" noindex />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--spacing-gutter)] pt-32 text-center">
          <Display as="h1" size="md" className="text-forest">
            Article not found
          </Display>
          <Body muted className="mt-4">
            This story may have moved or the link is outdated.
          </Body>
          <div className="mt-8">
            <MagneticButton onClick={() => navigate(ROUTES.blog)}>
              Back to journal
            </MagneticButton>
          </div>
        </main>
      </>
    )
  }

  const related = blogArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 2)

  const fallbackRelated = blogArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 2)

  const moreArticles = related.length ? related : fallbackRelated

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: { '@type': 'Person', name: article.author },
    datePublished: article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Aura of Nature',
    },
  }

  return (
    <>
      <Seo
        title={article.title}
        description={article.excerpt}
        canonical={`${ROUTES.blog}/${article.slug}`}
        image={article.image}
        type="article"
        jsonLd={jsonLd}
      />
      <main className="pb-24 pt-28 md:pt-32">
        <article className="container-aura max-w-3xl">
          <Eyebrow>{article.category}</Eyebrow>
          <Display as="h1" size="lg" className="mt-3 text-forest">
            {article.title}
          </Display>
          <Body muted className="mt-4">
            {article.author} · {article.readTime} ·{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Body>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-beige">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-12 space-y-10">
            {article.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <Display as="h2" size="sm" className="mb-4 text-forest">
                    {section.heading}
                  </Display>
                )}
                {section.paragraphs.map((p) => (
                  <Body key={p.slice(0, 48)} muted className="mb-4 leading-relaxed">
                    {p}
                  </Body>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-charcoal/10 pt-8">
            <Link
              to={ROUTES.blog}
              className="text-micro text-charcoal-muted underline-offset-4 hover:underline"
            >
              ← Back to journal
            </Link>
          </div>
        </article>

        {moreArticles.length > 0 && (
          <section className="section-aura border-t border-charcoal/10">
            <div className="container-aura">
              <Eyebrow>Continue reading</Eyebrow>
              <Display as="h2" size="md" className="mt-2 text-forest">
                Related stories
              </Display>
              <div className="mt-10 grid gap-12 md:grid-cols-2">
                {moreArticles.map((a) => (
                  <BlogCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
