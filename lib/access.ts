import type { Env } from './payments'

// Server-only. Checks the login token Cloudflare Access attaches to requests for /admin.
// The portal API must not rely on Access alone: the same functions are also reachable on
// *.pages.dev URLs that Access doesn't cover, so we verify the signed token ourselves.

interface AccessJwk extends JsonWebKey {
  kid: string
}

let certCache: { team: string; keys: AccessJwk[]; fetchedAt: number } | null = null

async function accessKeys(team: string) {
  if (certCache && certCache.team === team && Date.now() - certCache.fetchedAt < 60 * 60 * 1000) return certCache.keys
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`)
  if (!res.ok) throw new Error(`Access certs ${res.status}`)
  const { keys } = (await res.json()) as { keys: AccessJwk[] }
  certCache = { team, keys, fetchedAt: Date.now() }
  return keys
}

const b64urlDecode = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
const b64urlJson = (s: string) => JSON.parse(new TextDecoder().decode(b64urlDecode(s)))

// Returns the signed-in admin's email, or null. Fails closed if Access isn't configured.
export async function getAdminEmail(request: Request, env: Env): Promise<string | null> {
  const team = env.ACCESS_TEAM_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const aud = env.ACCESS_AUD
  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!team || !aud || !token) return null

  const [headerB64, payloadB64, sigB64] = token.split('.')
  if (!headerB64 || !payloadB64 || !sigB64) return null

  try {
    const header = b64urlJson(headerB64) as { alg: string; kid: string }
    if (header.alg !== 'RS256') return null
    const jwk = (await accessKeys(team)).find(k => k.kid === header.kid)
    if (!jwk) return null

    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlDecode(sigB64), new TextEncoder().encode(`${headerB64}.${payloadB64}`))
    if (!valid) return null

    const payload = b64urlJson(payloadB64) as { aud: string | string[]; iss: string; exp: number; email?: string }
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!audiences.includes(aud) || payload.iss !== `https://${team}` || payload.exp * 1000 < Date.now()) return null
    return payload.email ?? null
  } catch (err) {
    console.error('Access token check failed', err)
    return null
  }
}
