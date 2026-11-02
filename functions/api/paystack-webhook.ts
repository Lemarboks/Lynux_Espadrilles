import { checkPayment, customerReceiptEmail, Env, isValidPaystackSignature, ownerOrderEmail, sendEmail, verifyTransaction } from '../../lib/payments'

// POST /api/paystack-webhook
// Set this URL in Paystack: Settings → API Keys & Webhooks → Live Webhook URL.
// Paystack calls it when a payment succeeds; we email the owner the order and the customer a receipt.

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (!env.PAYSTACK_SECRET_KEY) return new Response('Not configured', { status: 500 })
  const raw = await request.text()
  if (!(await isValidPaystackSignature(env.PAYSTACK_SECRET_KEY, raw, request.headers.get('x-paystack-signature')))) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(raw) as { event: string; data: Parameters<typeof checkPayment>[0] }
  if (event.event !== 'charge.success') return new Response('ok')

  // Re-fetch from Paystack rather than trusting the event body alone
  const payment = await verifyTransaction(env, event.data.reference).catch(() => checkPayment(event.data))
  if (payment.status !== 'paid' && payment.status !== 'mismatch') return new Response('ok')

  const tasks = [sendEmail(env, env.ORDER_NOTIFY_EMAIL ?? '', ownerOrderEmail(payment), payment.email)]
  // Customers only get a receipt when the amount matches the items
  if (payment.status === 'paid') tasks.push(sendEmail(env, payment.email, customerReceiptEmail(payment), env.ORDER_NOTIFY_EMAIL))
  await Promise.all(tasks)

  return new Response('ok')
}
