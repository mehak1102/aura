/** Shared helpers — expand across phases */
export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function calculateSalePrice(mrp: number, discountPercent: number) {
  return Math.round(mrp * (1 - discountPercent / 100))
}
