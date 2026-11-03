import { describeLine, priceOrder } from '../../lib/order'
import { Env, json, paystack } from '../../lib/payments'

// POST /api/checkout
// Body: { customer: {...}, items: [{ id, size, colour, jute, toe, quantity }] }
// Prices the cart on the server and opens a Paystack transaction for exactly that amount.

const field = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (!env.PAYSTACK_SECRET_KEY) return json({ error: 'Payments are not configured yet.' }, 500)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const order = priceOrder(body.items)
  if (!order) return json({ error: 'Your cart has changed. Please refresh and add your items again.' }, 400)

  const c = (body.customer ?? {}) as Record<string, unknown>
  const email = field(c.email, 200)
  const customer = {
    fullName: field(c.fullName, 120),
    phone: field(c.phone, 30),
    address: [c.street, c.suburb, c.city, c.province, c.postalCode].map(v => field(v, 120)).join(', '),
    notes: field(c.notes, 1000),
  }
  if (!customer.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || customer.phone.replace(/\D/g, '').length < 10) {
    return json({ error: 'Please check your contact details.' }, 400)
  }

  const rand = crypto.getRandomValues(new Uint32Array(2))
  const reference = `LYN-${Date.now().toString(36)}-${rand[0].toString(36)}${rand[1].toString(36)}`.toUpperCase()

  try {
    const tx = await paystack<{ access_code: string; authorization_url: string; reference: string }>(env, '/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: String(order.amountCents),
        currency: 'ZAR',
        reference,
        callback_url: `${new URL(request.url).origin}/checkout/`,
        metadata: {
          order: {
            lines: order.lines.map(({ id, size, colour, jute, toe, quantity }) => ({ id, size, colour, jute, toe, quantity })),
            customer,
          },
          // Shown as labelled rows on the transaction page in the Paystack dashboard
          custom_fields: [
            { display_name: 'Items', variable_name: 'items', value: order.lines.map(l => `${l.quantity}× ${l.name} (${describeLine(l)})`).join('; ') },
            { display_name: 'Name', variable_name: 'full_name', value: customer.fullName },
            { display_name: 'Phone', variable_name: 'phone', value: customer.phone },
            { display_name: 'Delivery address', variable_name: 'address', value: customer.address },
            { display_name: 'Notes', variable_name: 'notes', value: customer.notes || '-' },
          ],
        },
      }),
    })
    return json({ accessCode: tx.access_code, authorizationUrl: tx.authorization_url, reference: tx.reference })
  } catch (err) {
    console.error(err)
    return json({ error: 'We couldn’t start the payment. Please try again.' }, 500)
  }
}
