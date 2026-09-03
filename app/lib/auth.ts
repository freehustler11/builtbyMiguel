import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

function getSecrets() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'builtbymiguel_admin_2026'
  const sessionSecret =
    process.env.SESSION_SECRET ||
    'builtbymiguel-secure-auth-secret-key-32chars!'
  return { adminPassword, sessionSecret }
}

/**
 * Sign and serialize a session token using standard Web Crypto API
 */
export async function createSessionToken(): Promise<string> {
  const { sessionSecret } = getSecrets()
  const payload = {
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  }
  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(sessionSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(serialized),
  )
  const sigBase64 = Buffer.from(signature).toString('base64url')

  return `${serialized}.${sigBase64}`
}

/**
 * Verify HMAC signature and expiry of a session token
 */
export async function verifySessionToken(
  token?: string | null,
): Promise<boolean> {
  if (!token || typeof token !== 'string') return false
  const [serialized, signature] = token.split('.')
  if (!serialized || !signature) return false

  const { sessionSecret } = getSecrets()

  try {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(sessionSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const sigBuf = Buffer.from(signature, 'base64url')
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuf,
      enc.encode(serialized),
    )

    if (!isValid) return false

    const payload = JSON.parse(
      Buffer.from(serialized, 'base64url').toString('utf8'),
    )
    if (!payload.exp || Date.now() > payload.exp) {
      return false
    }
    return payload.role === 'admin'
  } catch {
    return false
  }
}

/**
 * Server Function: Check if the current request has a valid admin session
 */
export const checkAuthServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(COOKIE_NAME)
    const isValid = await verifySessionToken(token)
    return { isAuthenticated: isValid }
  },
)

/**
 * Server Function: Authenticate admin with password and issue secure cookie
 */
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data: { password: unknown }) => {
    if (typeof data.password !== 'string' || !data.password) {
      throw new Error('Password is required')
    }
    return { password: data.password }
  })
  .handler(async ({ data }) => {
    const { adminPassword } = getSecrets()

    // Validate password
    if (data.password !== adminPassword) {
      return {
        success: false,
        error: 'Incorrect admin password. Please try again.',
      }
    }

    // Generate secure signed session token
    const token = await createSessionToken()

    // Set secure HTTP-only cookie
    setCookie(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
    })

    return { success: true }
  })

/**
 * Server Function: Logout and clear the admin session cookie
 */
export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    deleteCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return { success: true }
  },
)

/**
 * Auth Route Guard: Require authentication on protected routes.
 * Call this in `beforeLoad` of any protected route or layout.
 */
export async function requireAuth({
  location,
}: {
  location: { href: string }
}) {
  const { isAuthenticated } = await checkAuthServerFn()
  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
  return { isAuthenticated }
}
