import { getAdminEmail } from '../../../lib/access'
import { Env, json } from '../../../lib/payments'

// Runs before every /api/admin/* function. No valid Cloudflare Access login, no data.

export async function onRequest(context: { request: Request; env: Env; data: Record<string, unknown>; next: () => Promise<Response> }) {
  const email = await getAdminEmail(context.request, context.env)
  if (!email) return json({ error: 'Not signed in.' }, 401)
  // Changes must come from the portal page itself. Another site can't add this header
  // without a CORS preflight, which is refused, so it can't act on a signed-in admin's behalf.
  if (context.request.method !== 'GET' && context.request.headers.get('X-Lynux-Admin') !== '1') {
    return json({ error: 'Request blocked.' }, 403)
  }
  if (!context.env.DB) return json({ error: 'The orders database isn’t connected yet (missing DB binding).' }, 500)
  context.data.adminEmail = email
  return context.next()
}
