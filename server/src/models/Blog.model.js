import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Journal' },
    author: { type: String, default: 'Aura Editorial' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

blogSchema.methods.toAdminJSON = function toAdminJSON() {
  return {
    id: this._id.toString(),
    slug: this.slug,
    title: this.title,
    category: this.category,
    author: this.author,
    excerpt: this.excerpt,
    content: this.content,
    coverImage: this.coverImage,
    status: this.status,
    publishedAt: this.publishedAt
      ? this.publishedAt.toISOString().slice(0, 10)
      : null,
    createdAt: this.createdAt?.toISOString?.(),
    updatedAt: this.updatedAt?.toISOString?.(),
  }
}

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
