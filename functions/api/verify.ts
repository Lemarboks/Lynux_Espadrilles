import { Env, json, PaystackError, verifyTransaction } from '../../lib/payments'

// GET /api/verify?reference=LYN-...
// Asks Paystack whether the payment really succeeded for the right amount, so the
// success page and on-screen receipt can't be faked by editing the URL.

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const reference = new URL(request.url).searchParams.get('reference') ?? ''
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(reference)) return json({ status: 'failed' }, 400)

  try {
    const p = await verifyTransaction(env, reference)
    // Only what the receipt needs. Phone and address stay out of this public endpoint.
    return json({
      status: p.status,
      reference: p.reference,
      paidAt: p.paidAt,
      fullName: p.customer?.fullName ?? '',
      order: p.status === 'paid' ? p.order : null,
    })
  } catch (err) {
    // Paystack answers 4xx for references it has never seen
    if (err instanceof PaystackError && err.httpStatus >= 400 && err.httpStatus < 500) return json({ status: 'failed' }, 404)
    console.error(err)
    // Not 502: Cloudflare swaps 502 bodies for its own error page
    return json({ status: 'pending' }, 503)
  }
}
