import { describeLine } from './order'
import type { CheckedPayment } from './payments'

// Server-only. Orders saved in Cloudflare D1 for the /admin management portal.

// Just the parts of the D1 API we use, so the project needs no Cloudflare type package
export interface D1Statement {
  bind(...values: unknown[]): D1Statement
  run(): Promise<{ meta: { changes: number } }>
  all<T>(): Promise<{ results: T[] }>
  first<T>(): Promise<T | null>
}
export interface D1Database {
  prepare(query: string): D1Statement
}

export const FULFILMENT_STATUSES = ['new', 'packed', 'shipped', 'delivered', 'cancelled'] as const
export type FulfilmentStatus = (typeof FULFILMENT_STATUSES)[number]

export interface OrderItem {
  name: string
  quantity: number
  details: string
  lineTotal: number | null
}

export interface OrderRecord {
  reference: string
  createdAt: string
  paymentCheck: 'paid' | 'mismatch'
  amountPaid: number
  expectedTotal: number | null
  email: string
  fullName: string
  phone: string
  address: string
  customerNotes: string
  items: OrderItem[]
  status: FulfilmentStatus
  tracking: string
  adminNotes: string
  updatedAt: string | null
}

interface OrderRow {
  reference: string
  created_at: string
  payment_check: 'paid' | 'mismatch'
  amount_paid: number
  expected_total: number | null
  email: string
  full_name: string
  phone: string
  address: string
  customer_notes: string
  items: string
  status: FulfilmentStatus
  tracking: string
  admin_notes: string
  updated_at: string | null
}

// Cheap enough to run per request, and means nobody has to run a migration by hand
async function ensureSchema(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS orders (
    reference TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    payment_check TEXT NOT NULL,
    amount_paid REAL NOT NULL,
    expected_total REAL,
    email TEXT NOT NULL DEFAULT '',
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    customer_notes TEXT NOT NULL DEFAULT '',
    items TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    tracking TEXT NOT NULL DEFAULT '',
    admin_notes TEXT NOT NULL DEFAULT '',
    updated_at TEXT
  )`).run()
}

const fromRow = (r: OrderRow): OrderRecord => ({
  reference: r.reference,
  createdAt: r.created_at,
  paymentCheck: r.payment_check,
  amountPaid: r.amount_paid,
  expectedTotal: r.expected_total,
  email: r.email,
  fullName: r.full_name,
  phone: r.phone,
  address: r.address,
  customerNotes: r.customer_notes,
  items: JSON.parse(r.items),
  status: r.status,
  tracking: r.tracking,
  adminNotes: r.admin_notes,
  updatedAt: r.updated_at,
})

// Returns true if this is the first time we've seen the order (so emails should go out)
export async function saveOrder(db: D1Database, p: CheckedPayment): Promise<boolean> {
  if (p.status !== 'paid' && p.status !== 'mismatch') return false
  await ensureSchema(db)
  const items: OrderItem[] = p.order
    ? p.order.lines.map(l => ({ name: l.name, quantity: l.quantity, details: describeLine(l), lineTotal: l.unitPrice * l.quantity }))
    : p.rawItems.map(i => ({ ...i, lineTotal: null }))
  const result = await db.prepare(
    `INSERT OR IGNORE INTO orders
      (reference, created_at, payment_check, amount_paid, expected_total, email, full_name, phone, address, customer_notes, items)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    p.reference,
    p.paidAt ?? new Date().toISOString(),
    p.status,
    p.amountPaid,
    p.order?.total ?? null,
    p.email,
    p.customer?.fullName ?? '',
    p.customer?.phone ?? '',
    p.customer?.address ?? '',
    p.customer?.notes ?? '',
    JSON.stringify(items),
  ).run()
  return result.meta.changes > 0
}

export async function listOrders(db: D1Database, status?: FulfilmentStatus): Promise<OrderRecord[]> {
  await ensureSchema(db)
  const stmt = status
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT 500').bind(status)
    : db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500')
  return (await stmt.all<OrderRow>()).results.map(fromRow)
}

export async function getOrder(db: D1Database, reference: string): Promise<OrderRecord | null> {
  await ensureSchema(db)
  const row = await db.prepare('SELECT * FROM orders WHERE reference = ?').bind(reference).first<OrderRow>()
  return row ? fromRow(row) : null
}

export async function updateOrder(
  db: D1Database,
  reference: string,
  changes: { status: FulfilmentStatus; tracking: string; adminNotes: string },
) {
  await ensureSchema(db)
  await db.prepare('UPDATE orders SET status = ?, tracking = ?, admin_notes = ?, updated_at = ? WHERE reference = ?')
    .bind(changes.status, changes.tracking, changes.adminNotes, new Date().toISOString(), reference)
    .run()
}
