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
import { formatCurrency } from '@utils/index'
import type { AdminCoupon } from '@/types'

const empty = {
  code: '',
  description: '',
  discountType: 'percent' as 'percent' | 'flat',
  discountValue: '',
  minOrder: '0',
  maxDiscount: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
}

export default function CouponsPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminApi.coupons(),
  })

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
      }
      if (!payload.code) throw new Error('Code is required')
      if (!payload.discountValue) throw new Error('Discount value is required')
      if (editingId) return adminApi.updateCoupon(editingId, payload)
      return adminApi.createCoupon(payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
      setForm(empty)
      setEditingId(null)
      setShowForm(false)
      setError(null)
    },
    onError: (err) =>
      setError(err instanceof Error ? err.message : 'Could not save coupon'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  })

  const startEdit = (row: AdminCoupon) => {
    setEditingId(row.id)
    setShowForm(true)
    setForm({
      code: row.code,
      description: row.description || '',
      discountType: row.discountType,
      discountValue: String(row.discountValue),
      minOrder: String(row.minOrder ?? 0),
      maxDiscount: row.maxDiscount != null ? String(row.maxDiscount) : '',
      usageLimit: row.usageLimit != null ? String(row.usageLimit) : '',
      expiresAt: row.expiresAt ? row.expiresAt.slice(0, 10) : '',
      isActive: row.isActive,
    })
  }

  if (isLoading) {
    return <div className="text-sm text-charcoal/60">Loading coupons…</div>
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Promotional codes, usage limits, and campaign performance."
        action={
          <Button
            type="button"
            onClick={() => {
              setEditingId(null)
              setForm(empty)
              setShowForm((v) => !v)
            }}
          >
            {showForm ? 'Close form' : 'Add coupon'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-8 max-w-3xl space-y-4">
          <h2 className="font-display text-xl text-forest">
            {editingId ? 'Edit coupon' : 'New coupon'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Code"
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
              }
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-charcoal/70">
                Type
              </span>
              <select
                className="w-full rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm"
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountType: e.target.value as 'percent' | 'flat',
                  }))
                }
              >
                <option value="percent">Percent</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </label>
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Discount value"
              type="number"
              value={form.discountValue}
              onChange={(e) =>
                setForm((f) => ({ ...f, discountValue: e.target.value }))
              }
            />
            <Input
              label="Min order"
              type="number"
              value={form.minOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, minOrder: e.target.value }))
              }
            />
            <Input
              label="Max discount"
              type="number"
              value={form.maxDiscount}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxDiscount: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Usage limit"
              type="number"
              value={form.usageLimit}
              onChange={(e) =>
                setForm((f) => ({ ...f, usageLimit: e.target.value }))
              }
            />
            <Input
              label="Expires"
              type="date"
              value={form.expiresAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiresAt: e.target.value }))
              }
            />
          </div>
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
            {save.isPending ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
          </Button>
        </Card>
      )}

      <DataTable<AdminCoupon>
        rows={coupons}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'description', header: 'Description' },
          {
            key: 'discount',
            header: 'Discount',
            render: (row) =>
              row.discountType === 'flat'
                ? formatCurrency(row.discountValue)
                : `${row.discountValue}%`,
          },
          {
            key: 'minOrder',
            header: 'Min order',
            render: (row) => formatCurrency(row.minOrder),
          },
          {
            key: 'usedCount',
            header: 'Used',
            render: (row) =>
              row.usageLimit
                ? `${row.usedCount} / ${row.usageLimit}`
                : row.usedCount,
          },
          {
            key: 'isActive',
            header: 'Status',
            render: (row) => (
              <button
                type="button"
                onClick={() =>
                  adminApi
                    .updateCoupon(row.id, { isActive: !row.isActive })
                    .then(() =>
                      queryClient.invalidateQueries({
                        queryKey: ['admin-coupons'],
                      }),
                    )
                }
              >
                <Badge tone={row.isActive ? 'success' : 'danger'}>
                  {row.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </button>
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
                  onClick={() => startEdit(row)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs text-red-600 underline-offset-2 hover:underline"
                  onClick={() => {
                    if (window.confirm(`Delete coupon ${row.code}?`)) {
                      remove.mutate(row.id)
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
