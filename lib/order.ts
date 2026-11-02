import { products } from './products'

// Shared by the Cloudflare Pages Functions in /functions. Prices always come from
// lib/products.ts on the server, never from the browser.

export const DELIVERY_RANDS = 65
const MAX_LINES = 20
const MAX_QUANTITY = 20

export interface OrderLineInput {
  id: number
  size: number
  colour: string
  jute: string
  toe: string
  quantity: number
}

export interface OrderLine extends OrderLineInput {
  name: string
  unitPrice: number
}

export interface PricedOrder {
  lines: OrderLine[]
  subtotal: number
  delivery: number
  total: number
  amountCents: number
}

const pickOption = (value: unknown, options: string[]): string | null => {
  const v = typeof value === 'string' ? value : ''
  if (options.length === 0) return v === '' ? '' : null
  return options.includes(v) ? v : null
}

// Returns null if anything in the order doesn't match the catalogue
export function priceOrder(input: unknown): PricedOrder | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_LINES) return null

  const lines: OrderLine[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') return null
    const item = raw as Record<string, unknown>
    const product = products.find(p => p.id === item.id)
    if (!product) return null

    const size = item.size
    const quantity = item.quantity
    if (typeof size !== 'number' || !product.sizes.includes(size)) return null
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null

    const colour = pickOption(item.colour, product.colours.map(c => c.name))
    const jute = pickOption(item.jute, product.juteOptions)
    const toe = pickOption(item.toe, product.toeOptions)
    if (colour === null || jute === null || toe === null) return null

    lines.push({ id: product.id, name: product.name, unitPrice: product.price, size, colour, jute, toe, quantity })
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const total = subtotal + DELIVERY_RANDS
  return { lines, subtotal, delivery: DELIVERY_RANDS, total, amountCents: Math.round(total * 100) }
}

export const describeLine = (l: OrderLine): string =>
  [`Size ${l.size}`, l.colour, l.jute, l.toe].filter(Boolean).join(' · ')
