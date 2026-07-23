import { Link } from 'react-router-dom'
import type { BlogArticle } from '@/data/blog'
import { ROUTES } from '@/routes/paths'
import { Body, Eyebrow } from '@components/ui'

type BlogCardProps = {
  article: BlogArticle
}

export function BlogCard({ article }: BlogCardProps) {
  return (
    <Link
      to={`${ROUTES.blog}/${article.slug}`}
      data-product-card=""
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-beige">
        <img
          src={article.image}
          alt={article.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <Eyebrow className="mt-5">{article.category}</Eyebrow>
      <h2 className="mt-2 font-display text-2xl text-forest transition-colors group-hover:text-olive">
        {article.title}
      </h2>
      <Body muted size="sm" className="mt-3 line-clamp-2">
        {article.excerpt}
      </Body>
      <Body size="sm" className="mt-4 text-charcoal-muted">
        {article.readTime} ·{' '}
        {new Date(article.publishedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Body>
    </Link>
  )
}
