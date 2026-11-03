import { FULFILMENT_STATUSES, FulfilmentStatus, getOrder, listOrders, updateOrder } from '../../../lib/orders-db'
import { Env, json, sendEmail, shippedEmail } from '../../../lib/payments'

// GET   /api/admin/orders?status=new   → orders for the portal
// PATCH /api/admin/orders              → { reference, status, tracking, adminNotes, notifyCustomer }
// Auth is handled by _middleware.ts.

type Ctx = { request: Request; env: Env & { DB: NonNullable<Env['DB']> }; data: { adminEmail: string } }

const isStatus = (s: unknown): s is FulfilmentStatus => FULFILMENT_STATUSES.includes(s as FulfilmentStatus)

export async function onRequestGet({ request, env, data }: Ctx) {
  const status = new URL(request.url).searchParams.get('status')
  const orders = await listOrders(env.DB, isStatus(status) ? status : undefined)
  return json({ admin: data.adminEmail, orders })
}

export async function onRequestPatch({ request, env }: Ctx) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const reference = typeof body.reference === 'string' ? body.reference : ''
  const existing = reference ? await getOrder(env.DB, reference) : null
  if (!existing) return json({ error: 'Order not found.' }, 404)
  if (!isStatus(body.status)) return json({ error: 'Unknown status.' }, 400)

  const changes = {
    status: body.status,
    tracking: typeof body.tracking === 'string' ? body.tracking.trim().slice(0, 120) : existing.tracking,
    adminNotes: typeof body.adminNotes === 'string' ? body.adminNotes.slice(0, 2000) : existing.adminNotes,
  }
  await updateOrder(env.DB, reference, changes)

  let emailed = false
  if (body.notifyCustomer === true && changes.status === 'shipped' && existing.email) {
    if (!env.RESEND_API_KEY || !env.ORDER_EMAIL_FROM) {
      return json({ order: await getOrder(env.DB, reference), emailed, warning: 'Saved, but no email was sent: Resend isn’t set up yet.' })
    }
    await sendEmail(env, existing.email, shippedEmail({ ...existing, tracking: changes.tracking }), env.ORDER_NOTIFY_EMAIL)
    emailed = true
  }

  return json({ order: await getOrder(env.DB, reference), emailed })
}
