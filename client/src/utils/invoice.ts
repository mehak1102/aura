import { contactInfo } from '@/data/stores'
import type { Order } from '@utils/orders'
import { formatCurrency } from '@utils/index'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function paymentLabel(order: Order) {
  if (order.paymentMethod === 'cod') return 'Cash on delivery'
  return order.paymentId ? `Razorpay · ${order.paymentId}` : 'Razorpay'
}

function statusLabel(status: Order['status']) {
  return status.replace(/_/g, ' ')
}

/** Build a self-contained branded invoice document for an order. */
export function buildInvoiceHtml(order: Order) {
  const shipped = order.shipping
  const date = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <div class="muted">${escapeHtml(item.variantName)} × ${item.quantity}</div>
        </td>
        <td class="num">${formatCurrency(item.unitPrice)}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${formatCurrency(item.lineTotal)}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice · ${escapeHtml(order.id)} · Aura of Nature</title>
  <style>
    :root {
      --forest: #23452C;
      --cream: #f6f1e8;
      --gold: #b8975c;
      --muted: #6b6b66;
      --line: rgba(35, 69, 44, 0.12);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 40px 32px 56px;
      background: var(--cream);
      color: var(--forest);
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.5;
    }
    .sheet {
      max-width: 720px;
      margin: 0 auto;
      background: #fffef9;
      border: 1px solid var(--line);
      padding: 40px 44px;
    }
    .brand {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      border-bottom: 1px solid var(--line);
      padding-bottom: 24px;
    }
    .mark {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 22px;
      letter-spacing: 0.04em;
      color: var(--forest);
    }
    .tag {
      margin-top: 4px;
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold);
    }
    .meta {
      text-align: right;
      color: var(--muted);
      font-size: 12px;
    }
    .meta strong {
      display: block;
      color: var(--forest);
      font-size: 14px;
      margin-bottom: 4px;
    }
    h1 {
      margin: 28px 0 4px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 28px;
      font-weight: 500;
    }
    .eyebrow {
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin: 28px 0;
    }
    .label {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 8px;
    }
    .muted { color: var(--muted); }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    th {
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
      padding: 10px 0;
      border-bottom: 1px solid var(--line);
    }
    th.num, td.num { text-align: right; }
    td {
      padding: 14px 0;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }
    .totals {
      margin-top: 20px;
      margin-left: auto;
      width: min(280px, 100%);
    }
    .totals div {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 6px 0;
      color: var(--muted);
    }
    .totals .grand {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--line);
      color: var(--forest);
      font-size: 16px;
      font-weight: 600;
    }
    .footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 11px;
    }
    @media print {
      body { background: white; padding: 0; }
      .sheet { border: none; padding: 12px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <div>
        <div class="mark">Aura of Nature</div>
        <div class="tag">Pure · Natural · Nourishing</div>
      </div>
      <div class="meta">
        <strong>Tax invoice</strong>
        ${escapeHtml(contactInfo.address)}<br />
        ${escapeHtml(contactInfo.email)} · ${escapeHtml(contactInfo.phone)}
      </div>
    </div>

    <p class="eyebrow">Order invoice</p>
    <h1>${escapeHtml(order.id)}</h1>
    <p class="muted">${escapeHtml(date)} · Status: ${escapeHtml(statusLabel(order.status))}</p>

    <div class="grid">
      <div>
        <div class="label">Bill / ship to</div>
        <div>
          <strong>${escapeHtml(shipped.fullName)}</strong><br />
          ${escapeHtml(shipped.line1)}${shipped.line2 ? `, ${escapeHtml(shipped.line2)}` : ''}<br />
          ${escapeHtml(shipped.city)}, ${escapeHtml(shipped.state)} ${escapeHtml(shipped.postalCode)}<br />
          ${escapeHtml(shipped.phone || '')}
          ${shipped.email ? `<br />${escapeHtml(shipped.email)}` : ''}
        </div>
      </div>
      <div>
        <div class="label">Payment</div>
        <div>${escapeHtml(paymentLabel(order))}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="num">Price</th>
          <th class="num">Qty</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
      ${(order.giftWrapFee ?? 0) > 0
        ? `<div><span>Gift wrapping</span><span>${formatCurrency(order.giftWrapFee ?? 0)}</span></div>`
        : ''}
      <div>
        <span>Shipping</span>
        <span>${order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
      </div>
      ${order.savings > 0
        ? `<div><span>You saved</span><span>${formatCurrency(order.savings)}</span></div>`
        : ''}
      <div class="grand"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
    </div>

    <div class="footer">
      Thank you for choosing Aura of Nature. For help with this order, write to
      ${escapeHtml(contactInfo.support)}.
    </div>
  </div>
</body>
</html>`
}

/**
 * Open a print-ready invoice window so the shopper can Save as PDF
 * (or print). Falls back to downloading an HTML file if popups are blocked.
 */
export function downloadInvoice(order: Order) {
  const html = buildInvoiceHtml(order)
  const filename = `Aura-Invoice-${order.id}.html`

  const popup = window.open('', '_blank', 'noopener,noreferrer,width=820,height=960')
  if (popup) {
    popup.document.open()
    popup.document.write(html)
    popup.document.close()
    popup.focus()
    // Wait a tick so styles paint before the print dialog.
    window.setTimeout(() => {
      try {
        popup.print()
      } catch {
        /* user can still print manually */
      }
    }, 250)
    return
  }

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
