import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  PageHeader,
  DataTable,
  Badge,
  Button,
  Card,
  Input,
  Textarea,
} from '@components/ui'
import { adminApi } from '@services/api/admin'
import type { AdminCategory } from '@/types'

const empty = {
  name: '',
  slug: '',
  description: '',
  sortOrder: '0',
  isActive: true,
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(empty)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories(),
  })

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      }
      if (!payload.name) throw new Error('Name is required')
      if (editingSlug) return adminApi.updateCategory(editingSlug, payload)
      return adminApi.createCategory(payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setForm(empty)
      setEditingSlug(null)
      setShowForm(false)
      setError(null)
    },
    onError: (err) =>
      setError(err instanceof Error ? err.message : 'Could not save category'),
  })

  const remove = useMutation({
    mutationFn: (slug: string) => adminApi.deleteCategory(slug),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
    onError: (err) =>
      setError(err instanceof Error ? err.message : 'Could not delete'),
  })

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading categories…</div>
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Shop collections and product grouping across the catalog."
        action={
          <Button
            type="button"
            onClick={() => {
              setEditingSlug(null)
              setForm(empty)
              setShowForm((v) => !v)
            }}
          >
            {showForm ? 'Close form' : 'Add category'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-8 max-w-2xl space-y-4">
          <h2 className="font-display text-xl text-forest">
            {editingSlug ? 'Edit category' : 'New category'}
          </h2>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value
              setForm((f) => ({
                ...f,
                name,
                slug: editingSlug ? f.slug : slugify(name),
              }))
            }}
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <Input
            label="Sort order"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: e.target.value }))
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            Active
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
        </Card>
      )}

      <DataTable<AdminCategory>
        rows={categories}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'name', header: 'Category' },
          { key: 'slug', header: 'Slug' },
          {
            key: 'description',
            header: 'Description',
            className: 'max-w-md',
          },
          {
            key: 'productCount',
            header: 'Products',
            render: (row) => (
              <Badge tone={row.productCount > 0 ? 'success' : 'default'}>
                {row.productCount}
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs text-forest underline-offset-2 hover:underline"
                  onClick={() => {
                    setEditingSlug(row.slug)
                    setShowForm(true)
                    setForm({
                      name: row.name,
                      slug: row.slug,
                      description: row.description || '',
                      sortOrder: String(row.sortOrder ?? 0),
                      isActive: row.isActive !== false,
                    })
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs text-red-600 underline-offset-2 hover:underline"
                  onClick={() => {
                    if (window.confirm(`Delete category “${row.name}”?`)) {
                      remove.mutate(row.slug)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
