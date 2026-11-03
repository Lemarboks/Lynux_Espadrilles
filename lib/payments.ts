import { describeLine, priceOrder, PricedOrder } from './order'
import { products } from './products'
import type { D1Database } from './orders-db'

// Server-only helpers for the Cloudflare Pages Functions. Never import this from app/ or components/.

export interface Env {
  PAYSTACK_SECRET_KEY: string
  // Optional: order emails via Resend (https://resend.com). Leave unset to skip emails.
  RESEND_API_KEY?: string
  ORDER_EMAIL_FROM?: string
  ORDER_NOTIFY_EMAIL?: string
  // Management portal: D1 binding plus the Cloudflare Access app that guards /admin
  DB?: D1Database
  ACCESS_TEAM_DOMAIN?: string
  ACCESS_AUD?: string
}

export interface Customer {
  fullName: string
  phone: string
  address: string
  notes: string
}

export interface PaystackTransaction {
  status: string
  reference: string
  amount: number
  currency: string
  paid_at?: string
  created_at?: string
  customer?: { email?: string }
  metadata?: unknown
}

export type PaymentStatus = 'paid' | 'mismatch' | 'pending' | 'failed'

export interface CheckedPayment {
  status: PaymentStatus
  reference: string
  amountPaid: number
  paidAt: string | null
  email: string
  customer: Customer | null
  order: PricedOrder | null
  // What the customer chose, even when it couldn't be priced (e.g. a product since renamed)
  rawItems: { name: string; quantity: number; details: string }[]
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export class PaystackError extends Error {
  constructor(message: string, readonly httpStatus: number) {
    super(message)
  }
}

export async function paystack<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  const body = (await res.json()) as { status: boolean; message: string; data: T }
  if (!res.ok || !body.status) throw new PaystackError(`Paystack ${path} failed: ${body.message}`, res.status)
  return body.data
}

const parseMetadata = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return {} }
  }
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
}

// Re-prices the order from the catalogue and checks Paystack actually collected that amount.
// Anyone holding the public key can open a Paystack payment with any amount and metadata,
// so a "success" status on its own is not enough.
export function checkPayment(tx: PaystackTransaction): CheckedPayment {
  const meta = parseMetadata(tx.metadata)
  const orderMeta = parseMetadata(meta.order)
  // Orders from the old browser-priced checkout stored items by name at the top level
  const legacy = !Array.isArray(orderMeta.lines) && Array.isArray(meta.items)
  const rawLines = (legacy ? meta.items : orderMeta.lines) as Record<string, unknown>[] | undefined
  const lines = legacy
    ? rawLines!.map(i => ({ ...i, id: products.find(p => p.name === i.name)?.id }))
    : rawLines
  const order = priceOrder(lines)
  const rawItems = (Array.isArray(rawLines) ? rawLines : []).slice(0, 50).map(i => ({
    name: String(i.name ?? products.find(p => p.id === i.id)?.name ?? `Product #${i.id}`),
    quantity: Number(i.quantity) || 0,
    details: [i.size ? `Size ${i.size}` : '', i.colour, i.jute, i.toe].filter(Boolean).map(String).join(' · '),
  }))
  const c = legacy ? meta : parseMetadata(orderMeta.customer)
  const customer: Customer | null = typeof c.fullName === 'string'
    ? { fullName: c.fullName, phone: String(c.phone ?? ''), address: String(c.address ?? ''), notes: String(c.notes ?? '') }
    : null

  let status: PaymentStatus
  if (tx.status !== 'success') status = tx.status === 'failed' || tx.status === 'abandoned' ? 'failed' : 'pending'
  else if (!order || tx.currency !== 'ZAR' || tx.amount !== order.amountCents) status = 'mismatch'
  else status = 'paid'

  return {
    status,
    reference: tx.reference,
    amountPaid: tx.amount / 100,
    paidAt: tx.paid_at ?? tx.created_at ?? null,
    email: tx.customer?.email ?? '',
    customer,
    order,
    rawItems,
  }
}

export const verifyTransaction = async (env: Env, reference: string) =>
  checkPayment(await paystack<PaystackTransaction>(env, `/transaction/verify/${encodeURIComponent(reference)}`))

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')

export async function isValidPaystackSignature(secret: string, rawBody: string, signature: string | null) {
  if (!signature) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const expected = toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)))
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

const rands = (n: number) => 'R' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function orderTable(order: PricedOrder) {
  const rows = order.lines.map(l => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e8dfd3">
        <strong>${escapeHtml(l.name)}</strong> × ${l.quantity}<br>
        <span style="color:#7a6a5a;font-size:13px">${escapeHtml(describeLine(l))}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #e8dfd3;text-align:right">${rands(l.unitPrice * l.quantity)}</td>
    </tr>`).join('')
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows}
      <tr><td style="padding:8px 0">Subtotal</td><td style="text-align:right">${rands(order.subtotal)}</td></tr>
      <tr><td style="padding:4px 0">Delivery</td><td style="text-align:right">${rands(order.delivery)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold">Total paid</td><td style="text-align:right;font-weight:bold">${rands(order.total)}</td></tr>
    </table>`
}

export function customerReceiptEmail(p: CheckedPayment) {
  const name = p.customer?.fullName.split(' ')[0] ?? 'there'
  return {
    subject: `Your Lynux Espadrilles receipt · ${p.reference}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#2b2118">
        <h1 style="font-weight:normal">Thank you, ${escapeHtml(name)}.</h1>
        <p>We've received your payment. We'll be in touch within 24 hours to confirm your order and delivery.</p>
        <p style="font-size:13px;color:#7a6a5a">Order reference: <strong>${escapeHtml(p.reference)}</strong>${p.paidAt ? `<br>Paid: ${escapeHtml(new Date(p.paidAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }))}` : ''}</p>
        ${p.order ? orderTable(p.order) : ''}
        ${p.customer ? `<p style="font-size:13px;color:#7a6a5a">Delivering to: ${escapeHtml(p.customer.address)}</p>` : ''}
        <p style="font-size:13px;color:#7a6a5a">Questions? Just reply to this email.</p>
      </div>`,
  }
}

export function ownerOrderEmail(p: CheckedPayment) {
  const warning = p.status === 'mismatch'
    ? `<p style="background:#fde2e2;padding:12px;font-weight:bold">⚠️ AMOUNT DOES NOT MATCH THE ITEMS. Paid ${rands(p.amountPaid)}${p.order ? `, expected ${rands(p.order.total)}` : ', order details invalid'}. Do not ship until you've checked this in Paystack.</p>`
    : ''
  const c = p.customer
  return {
    subject: `${p.status === 'mismatch' ? '⚠️ CHECK ' : ''}New order ${p.reference} · ${rands(p.amountPaid)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;color:#2b2118">
        ${warning}
        <h2>New order ${escapeHtml(p.reference)}</h2>
        ${p.order ? orderTable(p.order) : ''}
        <h3>Customer</h3>
        <p>
          ${escapeHtml(c?.fullName ?? '')}<br>
          ${escapeHtml(p.email)}<br>
          ${escapeHtml(c?.phone ?? '')}<br>
          ${escapeHtml(c?.address ?? '')}
        </p>
        ${c?.notes ? `<h3>Notes</h3><p>${escapeHtml(c.notes)}</p>` : ''}
      </div>`,
  }
}

export function shippedEmail(o: { reference: string; fullName: string; tracking: string; items: { name: string; quantity: number; details: string }[] }) {
  const name = o.fullName.split(' ')[0] || 'there'
  const items = o.items.map(i => `<li>${escapeHtml(i.name)} × ${i.quantity} <span style="color:#7a6a5a">(${escapeHtml(i.details)})</span></li>`).join('')
  return {
    subject: `Your Lynux Espadrilles order is on its way · ${o.reference}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#2b2118">
        <h1 style="font-weight:normal">Good news, ${escapeHtml(name)}!</h1>
        <p>Your order has been shipped.</p>
        <ul style="font-size:14px">${items}</ul>
        ${o.tracking ? `<p>Tracking number: <strong>${escapeHtml(o.tracking)}</strong></p>` : ''}
        <p style="font-size:13px;color:#7a6a5a">Order reference: ${escapeHtml(o.reference)}<br>Questions? Just reply to this email.</p>
      </div>`,
  }
}

export async function sendEmail(env: Env, to: string, email: { subject: string; html: string }, replyTo?: string) {
  if (!env.RESEND_API_KEY || !env.ORDER_EMAIL_FROM || !to) return
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.ORDER_EMAIL_FROM, to, subject: email.subject, html: email.html, reply_to: replyTo }),
  })
  if (!res.ok) console.error('Resend error', res.status, await res.text())
}
