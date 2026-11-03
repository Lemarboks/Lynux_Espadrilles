import { saveOrder } from '../../../lib/orders-db'
import { checkPayment, Env, json, paystack, PaystackTransaction } from '../../../lib/payments'

// POST /api/admin/import
// Copies successful payments from Paystack into the portal, including orders placed before
// the portal existed. Safe to run repeatedly: existing orders are left untouched and no emails are sent.

export async function onRequestPost({ env }: { env: Env & { DB: NonNullable<Env['DB']> } }) {
  let imported = 0
  let scanned = 0
  for (let page = 1; page <= 10; page++) {
    const txs = await paystack<PaystackTransaction[]>(env, `/transaction?status=success&perPage=100&page=${page}`)
    for (const tx of txs) {
      if (tx.currency !== 'ZAR') continue
      scanned++
      if (await saveOrder(env.DB, checkPayment(tx))) imported++
    }
    if (txs.length < 100) break
  }
  return json({ imported, scanned })
}
