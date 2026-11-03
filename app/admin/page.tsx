'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FulfilmentStatus, OrderRecord } from '@/lib/orders-db'

// Private order portal. Cloudflare Access guards /admin and /api/admin; the API also
// verifies the Access token itself, so this page shows nothing without a valid login.

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', dateStyle: 'medium', timeStyle: 'short' })

const STATUSES: { value: FulfilmentStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusStyle: Record<FulfilmentStatus, string> = {
  new: 'bg-accent text-cream',
  packed: 'bg-clay text-cream',
  shipped: 'bg-ink-mid text-cream',
  delivered: 'bg-sand-dark text-ink',
  cancelled: 'bg-sand-dark text-ink-light line-through',
}

function OrderCard({ order, onSaved }: { order: OrderRecord; onSaved: (o: OrderRecord) => void }) {
  const [status, setStatus] = useState(order.status)
  const [tracking, setTracking] = useState(order.tracking)
  const [adminNotes, setAdminNotes] = useState(order.adminNotes)
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const dirty = status !== order.status || tracking !== order.tracking || adminNotes !== order.adminNotes
  const becomingShipped = status === 'shipped' && order.status !== 'shipped'

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: order.reference, status, tracking, adminNotes, notifyCustomer: becomingShipped && notifyCustomer }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      onSaved(body.order)
      setMessage(body.warning ?? (body.emailed ? 'Saved · customer emailed' : 'Saved'))
    } catch (err) {
      setMessage(err instanceof Error && err.message ? err.message : 'Couldn’t save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="bg-cream border border-sand-dark p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-cormorant font-normal text-2xl text-ink leading-tight">{order.fullName || 'Unknown customer'}</p>
          <p className="font-dm text-xs text-ink-light mt-1">{formatDate(order.createdAt)} · {order.reference}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-dm text-[11px] uppercase tracking-widest px-2.5 py-1 ${statusStyle[order.status]}`}>{order.status}</span>
          <span className="font-cormorant font-normal text-xl text-ink">{formatPrice(order.amountPaid)}</span>
        </div>
      </div>

      {order.paymentCheck === 'mismatch' && order.items.length === 0 && (
        <div className="mb-4 px-4 py-3 bg-sand border border-sand-dark">
          <p className="font-dm text-sm text-ink-mid">
            This payment didn’t come through the website checkout (e.g. a Paystack payment link or invoice), so there are no item details. Check Paystack for what it was for.
          </p>
        </div>
      )}
      {order.paymentCheck === 'mismatch' && order.items.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200">
          <p className="font-dm text-sm text-red-700">
            ⚠️ Amount paid doesn’t match the items{order.expectedTotal !== null && ` (expected ${formatPrice(order.expectedTotal)})`}. Check this payment in Paystack before shipping.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="font-dm text-xs uppercase tracking-widest text-ink-mid mb-2">Items</p>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>
                  <span className="font-dm text-sm text-ink">{item.name} × {item.quantity}</span>
                  <span className="block font-dm text-xs text-ink-light">{item.details}</span>
                </span>
                {item.lineTotal !== null && <span className="font-dm text-sm text-ink flex-shrink-0">{formatPrice(item.lineTotal)}</span>}
              </li>
            ))}
          </ul>
          {order.customerNotes && (
            <p className="font-dm text-sm text-ink-mid mt-3 bg-sand px-3 py-2">
              <span className="text-xs uppercase tracking-widest text-ink-light block mb-0.5">Customer note</span>
              {order.customerNotes}
            </p>
          )}
        </div>
        <div>
          <p className="font-dm text-xs uppercase tracking-widest text-ink-mid mb-2">Deliver to</p>
          <p className="font-dm text-sm text-ink leading-relaxed">
            {order.address || '-'}
            <br />
            <a href={`tel:${order.phone}`} className="text-clay-dark underline">{order.phone}</a>
            <br />
            <a href={`mailto:${order.email}`} className="text-clay-dark underline break-all">{order.email}</a>
          </p>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-sand-dark grid gap-3 md:grid-cols-[160px_1fr_1fr_auto] md:items-end">
        <label className="font-dm text-xs uppercase tracking-widest text-ink-mid">
          Status
          <select value={status} onChange={e => setStatus(e.target.value as FulfilmentStatus)} className="mt-1.5 w-full font-dm text-sm text-ink normal-case tracking-normal border border-sand-dark bg-cream px-3 py-2.5 focus:outline-none focus:border-clay">
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="font-dm text-xs uppercase tracking-widest text-ink-mid">
          Tracking number
          <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Optional" className="mt-1.5 w-full font-dm text-sm text-ink normal-case tracking-normal border border-sand-dark bg-cream px-3 py-2.5 focus:outline-none focus:border-clay" />
        </label>
        <label className="font-dm text-xs uppercase tracking-widest text-ink-mid">
          Private notes
          <input value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Only you can see these" className="mt-1.5 w-full font-dm text-sm text-ink normal-case tracking-normal border border-sand-dark bg-cream px-3 py-2.5 focus:outline-none focus:border-clay" />
        </label>
        <button onClick={save} disabled={!dirty || saving} className="font-dm text-sm bg-clay hover:bg-clay-dark text-cream px-6 py-2.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {becomingShipped && (
        <label className="mt-3 flex items-center gap-2 font-dm text-sm text-ink-mid">
          <input type="checkbox" checked={notifyCustomer} onChange={e => setNotifyCustomer(e.target.checked)} className="accent-clay" />
          Email the customer that their order is on its way{tracking && ' (includes the tracking number)'}
        </label>
      )}
      {message && <p className="mt-2 font-dm text-xs text-ink-mid">{message}</p>}
    </article>
  )
}

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderRecord[] | null>(null)
  const [admin, setAdmin] = useState('')
  const [filter, setFilter] = useState<FulfilmentStatus | 'all'>('all')
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      setOrders(body.orders)
      setAdmin(body.admin)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Couldn’t load orders.')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const importFromPaystack = async () => {
    setImporting(true)
    setImportMessage('')
    try {
      const res = await fetch('/api/admin/import', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      setImportMessage(`Checked ${body.scanned} Paystack payments · ${body.imported} new order${body.imported === 1 ? '' : 's'} added`)
      await load()
    } catch (err) {
      setImportMessage(err instanceof Error && err.message ? err.message : 'Import failed.')
    } finally {
      setImporting(false)
    }
  }

  const counts = (orders ?? []).reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {})
  const visible = (orders ?? []).filter(o => filter === 'all' || o.status === filter)

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-cormorant font-normal text-4xl lg:text-5xl text-ink">Orders</h1>
            {admin && <p className="font-dm text-xs text-ink-light mt-1">Signed in as {admin}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="font-dm text-sm border border-clay text-clay-dark hover:bg-clay hover:text-cream px-5 py-2.5 transition-all duration-300">
              Refresh
            </button>
            <button onClick={importFromPaystack} disabled={importing} className="font-dm text-sm bg-clay hover:bg-clay-dark text-cream px-5 py-2.5 transition-all duration-300 disabled:opacity-60">
              {importing ? 'Importing…' : 'Import from Paystack'}
            </button>
          </div>
        </div>
        {importMessage && <p className="font-dm text-sm text-ink-mid mb-6">{importMessage}</p>}

        {error ? (
          <div className="bg-cream border border-sand-dark p-8 text-center">
            <p className="font-cormorant font-normal text-2xl text-ink mb-2">You can’t view orders right now</p>
            <p className="font-dm text-sm text-ink-light">{error}</p>
          </div>
        ) : orders === null ? (
          <p className="font-dm text-sm text-ink-light">Loading orders…</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {[{ value: 'all' as const, label: 'All' }, ...STATUSES].map(s => (
                <button
                  key={s.value}
                  onClick={() => setFilter(s.value)}
                  className={`font-dm text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${filter === s.value ? 'bg-ink text-cream border-ink' : 'bg-cream text-ink-mid border-sand-dark hover:border-clay'}`}
                >
                  {s.label} ({s.value === 'all' ? orders.length : counts[s.value] ?? 0})
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <div className="bg-cream border border-sand-dark p-8 text-center">
                <p className="font-dm text-sm text-ink-light">
                  {orders.length === 0 ? 'No orders yet. New paid orders appear here automatically. Use “Import from Paystack” to bring in earlier ones.' : 'No orders with this status.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visible.map(o => (
                  <OrderCard key={o.reference} order={o} onSaved={saved => setOrders(prev => prev!.map(p => (p.reference === saved.reference ? saved : p)))} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
