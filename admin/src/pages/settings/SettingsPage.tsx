import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, Card, Input, Button } from '@components/ui'
import { adminApi } from '@services/api/admin'
import type { AdminSettings } from '@/types'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminApi.settings(),
  })

  const mutation = useMutation({
    mutationFn: (patch: Partial<AdminSettings>) =>
      adminApi.updateSettings(patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
    },
  })

  if (isLoading || !settings) {
    return <div className="text-sm text-charcoal/60">Loading settings…</div>
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    mutation.mutate({
      storeName: String(fd.get('storeName') || ''),
      supportEmail: String(fd.get('supportEmail') || ''),
      contactPhone: String(fd.get('contactPhone') || ''),
      freeShippingThreshold: Number(fd.get('freeShippingThreshold')),
      lowStockThreshold: Number(fd.get('lowStockThreshold')),
      currency: String(fd.get('currency') || 'INR'),
      notifyLowStock: fd.get('notifyLowStock') === 'on',
      notifyNewOrders: fd.get('notifyNewOrders') === 'on',
    })
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Store configuration, shipping rules, and alert preferences."
      />

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Store name"
            name="storeName"
            defaultValue={settings.storeName}
          />
          <Input
            label="Support email"
            name="supportEmail"
            type="email"
            defaultValue={settings.supportEmail}
          />
          <Input
            label="Contact phone"
            name="contactPhone"
            defaultValue={settings.contactPhone}
          />
          <Input
            label="Free shipping threshold (₹)"
            name="freeShippingThreshold"
            type="number"
            defaultValue={settings.freeShippingThreshold}
          />
          <Input
            label="Low stock threshold (units)"
            name="lowStockThreshold"
            type="number"
            defaultValue={settings.lowStockThreshold}
          />
          <Input
            label="Currency"
            name="currency"
            defaultValue={settings.currency}
          />

          <div className="space-y-3 border-t border-charcoal/10 pt-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="notifyLowStock"
                defaultChecked={settings.notifyLowStock}
                className="rounded border-charcoal/20"
              />
              Email alerts for low stock
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="notifyNewOrders"
                defaultChecked={settings.notifyNewOrders}
                className="rounded border-charcoal/20"
              />
              Email alerts for new orders
            </label>
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save settings'}
          </Button>

          {mutation.isSuccess && (
            <p className="text-xs text-forest">Settings saved.</p>
          )}
        </form>
      </Card>
    </div>
  )
}
