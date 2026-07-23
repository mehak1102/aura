type RazorpaySuccess = {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

type OpenRazorpayArgs = {
  amountInPaise: number
  name: string
  email: string
  phone: string
  description: string
  orderId?: string
  onSuccess: (payload: RazorpaySuccess) => void
  onDismiss?: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: () => void) => void
    }
  }
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Opens Razorpay when VITE_RAZORPAY_KEY_ID is set.
 * Otherwise runs a simulated payment (dev / demo mode).
 * Server-side signature verify lands in Phase 10.
 */
export async function openRazorpayCheckout(args: OpenRazorpayArgs) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined

  if (!key) {
    await new Promise((r) => setTimeout(r, 900))
    args.onSuccess({
      razorpay_payment_id: `pay_demo_${Date.now()}`,
    })
    return { mode: 'demo' as const }
  }

  const ok = await loadScript()
  if (!ok || !window.Razorpay) {
    throw new Error('Unable to load Razorpay. Try again.')
  }

  const rzp = new window.Razorpay({
    key,
    amount: args.amountInPaise,
    currency: 'INR',
    order_id: args.orderId,
    name: 'Aura of Nature',
    description: args.description,
    prefill: {
      name: args.name,
      email: args.email,
      contact: args.phone,
    },
    theme: { color: '#243528' },
    handler: (response: RazorpaySuccess) => args.onSuccess(response),
    modal: {
      ondismiss: () => args.onDismiss?.(),
    },
  })

  rzp.open()
  return { mode: 'live' as const }
}
