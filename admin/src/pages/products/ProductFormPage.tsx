import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Input, PageHeader, Textarea } from '@components/ui'
import { adminApi } from '@services/api/admin'
import { ADMIN_ROUTES } from '@/routes/paths'
import type { AdminProduct } from '@/types'

type FormState = {
  title: string
  slug: string
  description: string
  category: string
  mrp: string
  discountPercent: string
  stock: string
  imageUrl: string
  imageAlt: string
  isActive: boolean
  isBestSeller: boolean
  isNewArrival: boolean
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  category: 'skin-care',
  mrp: '',
  discountPercent: '0',
  stock: '0',
  imageUrl: '',
  imageAlt: '',
  isActive: true,
  isBestSeller: false,
  isNewArrival: false,
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toPayload(form: FormState): Partial<AdminProduct> {
  const mrp = Number(form.mrp) || 0
  const discountPercent = Number(form.discountPercent) || 0
  const stock = Math.max(0, Number(form.stock) || 0)
  const price = Math.round(mrp * (1 - discountPercent / 100))
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || slugify(form.title),
    description: form.description.trim(),
    category: form.category.trim(),
    mrp,
    discountPercent,
    stock,
    isActive: form.isActive,
    isBestSeller: form.isBestSeller,
    isNewArrival: form.isNewArrival,
    images: form.imageUrl
      ? [{ url: form.imageUrl, alt: form.imageAlt || form.title, isPrimary: true }]
      : [],
    variants: [
      {
        id: `var-${slugify(form.title || 'product')}-1`,
        name: 'Standard',
        mrp,
        price,
        discountPercent,
        stock,
      },
    ],
  }
}

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories(),
  })

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminApi.product(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (!product) return
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      category: product.category,
      mrp: String(product.mrp ?? ''),
      discountPercent: String(product.discountPercent ?? 0),
      stock: String(product.stock ?? 0),
      imageUrl: product.images?.[0]?.url || '',
      imageAlt: product.images?.[0]?.alt || '',
      isActive: product.isActive !== false,
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
    })
  }, [product])

  const save = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form)
      if (!payload.title) throw new Error('Title is required')
      if (!payload.category) throw new Error('Category is required')
      if (isEdit && id) return adminApi.saveProduct(id, payload)
      return adminApi.createProduct(payload)
    },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory'] })
      navigate(ADMIN_ROUTES.products)
      if (saved?.id) {
        void queryClient.invalidateQueries({
          queryKey: ['admin-product', saved.id],
        })
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Save failed')
    },
  })

  const set =
    (key: keyof FormState) =>
    (value: string | boolean) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value }
        if (key === 'title' && !isEdit && !prev.slug) {
          next.slug = slugify(String(value))
        }
        return next
      })
    }

  const onUpload = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await adminApi.uploadImage(file, form.title || file.name)
      setForm((prev) => ({
        ...prev,
        imageUrl: uploaded.url,
        imageAlt: uploaded.alt || prev.imageAlt || prev.title,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isEdit && isLoading) {
    return <div className="text-sm text-charcoal/60">Loading product…</div>
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit product' : 'New product'}
        description="Catalog details, pricing, stock, and primary image."
        action={
          <Link
            to={ADMIN_ROUTES.products}
            className="text-sm text-forest underline-offset-2 hover:underline"
          >
            Back to products
          </Link>
        }
      />

      <Card className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => set('slug')(e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => set('description')(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-charcoal/70">
              Category
            </span>
            <select
              className="w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => set('category')(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set('stock')(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="MRP (₹)"
            type="number"
            min={0}
            value={form.mrp}
            onChange={(e) => set('mrp')(e.target.value)}
          />
          <Input
            label="Discount %"
            type="number"
            min={0}
            max={90}
            value={form.discountPercent}
            onChange={(e) => set('discountPercent')(e.target.value)}
          />
        </div>

        <p className="rounded-md bg-cream px-3 py-2 text-sm text-charcoal/75">
          Sale price:{' '}
          <span className="font-medium text-forest">
            ₹
            {Math.round(
              (Number(form.mrp) || 0) *
                (1 - (Number(form.discountPercent) || 0) / 100),
            ).toLocaleString('en-IN')}
          </span>
          {Number(form.discountPercent) > 0 && Number(form.mrp) > 0 && (
            <span className="ml-2 text-charcoal/45 line-through">
              ₹{Number(form.mrp).toLocaleString('en-IN')}
            </span>
          )}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => set('imageUrl')(e.target.value)}
            placeholder="https://…"
          />
          <Input
            label="Image alt"
            value={form.imageAlt}
            onChange={(e) => set('imageAlt')(e.target.value)}
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-charcoal/70">
            Or upload image
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => void onUpload(e.target.files?.[0] || null)}
            className="block w-full text-xs text-charcoal/70"
          />
          {uploading && (
            <span className="mt-1 block text-xs text-charcoal/50">
              Uploading…
            </span>
          )}
        </label>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt={form.imageAlt || form.title}
            className="h-40 w-40 rounded-md object-cover"
          />
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive')(e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => set('isBestSeller')(e.target.checked)}
            />
            Best seller
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => set('isNewArrival')(e.target.checked)}
            />
            New arrival
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="button"
            disabled={save.isPending}
            onClick={() => {
              setError(null)
              save.mutate()
            }}
          >
            {save.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ADMIN_ROUTES.products)}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
