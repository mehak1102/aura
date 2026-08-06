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
  /** Prefer the keyId returned by POST /payments/create-order */
  key?: string
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
 * Opens Razorpay Checkout.
 * Uses server-provided keyId when available so test/live keys stay in sync.
 * Falls back to a simulated success only when no key is configured at all.
 */
export async function openRazorpayCheckout(args: OpenRazorpayArgs) {
  const key =
    args.key ||
    (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ||
    ''

  if (!key) {
    await new Promise((r) => setTimeout(r, 900))
    args.onSuccess({
      razorpay_payment_id: `pay_demo_${Date.now()}`,
      razorpay_order_id: args.orderId,
    })
    return { mode: 'demo' as const }
  }

  const ok = await loadScript()
  if (!ok || !window.Razorpay) {
    throw new Error('Unable to load Razorpay. Try again.')
  }

  return new Promise<{ mode: 'live' }>((resolve, reject) => {
    try {
      const rzp = new window.Razorpay!({
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
        handler: (response: RazorpaySuccess) => {
          args.onSuccess(response)
          resolve({ mode: 'live' })
        },
        modal: {
          ondismiss: () => {
            args.onDismiss?.()
            resolve({ mode: 'live' })
          },
        },
      })

      rzp.on('payment.failed', () => {
        args.onDismiss?.()
        reject(
          new Error(
            'Payment was not completed. You can retry with another method or COD.',
          ),
        )
      })

      rzp.open()
    } catch (err) {
      reject(
        err instanceof Error ? err : new Error('Could not open Razorpay checkout'),
      )
    }
  })
}
