import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db, users } from '../db'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

async function getServerUtils() {
  return await import(/* @vite-ignore */ '@tanstack/react-start/server')
}

export async function getSessionCookieOptions(rawHost?: string, rawProto?: string) {
  let host = rawHost || ''
  let proto = rawProto || ''
  if (!host) {
    try {
      const { getRequestHeader } = await getServerUtils()
      host = getRequestHeader('host') || ''
      proto = getRequestHeader('x-forwarded-proto') || ''
    } catch {
      // Context unavailable
    }
  }

  const isProd = process.env.NODE_ENV === 'production'
  const isBuiltByMiguelHost = host.toLowerCase().includes('builtbymiguel.net')
  const cookieDomain = isBuiltByMiguelHost ? (process.env.COOKIE_DOMAIN || '.builtbymiguel.net') : undefined

  // Secure cookie check:
  // Must be false if testing over unencrypted HTTP (e.g. raw IP 2.29.45.40:3000 or localhost),
  // otherwise browsers reject and drop the cookie.
  const isHttps = proto.toLowerCase() === 'https' || (!host.includes('localhost') && !host.match(/^\d+\.\d+\.\d+\.\d+/) && isProd && isBuiltByMiguelHost)
  const isSecure = process.env.SECURE_COOKIES === 'true' || isHttps

  return {
    path: '/',
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  }
}

export interface SessionUser {
  role: 'superadmin' | 'partner' | 'admin' | 'client'
  userId?: string
  clientId?: string
  email?: string
  isActive?: boolean
  exp: number
}


function getSecrets() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'L0v3hurt$11290523'
  const sessionSecret =
    process.env.SESSION_SECRET ||
    'builtbymiguel-secure-auth-secret-key-32chars!'
  return { adminPassword, sessionSecret }
}

/**
 * Hash password securely using standard Web Crypto PBKDF2 (zero node:crypto imports)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltBytes = new Uint8Array(16)
  crypto.getRandomValues(saltBytes)
  const saltHex = Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltHex),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `${saltHex}:${hashHex}`
}

/**
 * Verify a plaintext password against a stored salt:hash string
 */
export async function verifyPassword(password: string, combinedHash: string): Promise<boolean> {
  try {
    const [saltHex, key] = combinedHash.split(':')
    if (!saltHex || !key) return false

    const enc = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits'],
    )

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(saltHex),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256,
    )

    const derivedHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return derivedHex === key
  } catch {
    return false
  }
}

/**
 * Sign and serialize a session token with role, userId, and clientId using Web Crypto HMAC-SHA256
 */
export async function createSessionToken(payloadData?: {
  role?: 'superadmin' | 'partner' | 'admin' | 'client'
  userId?: string
  clientId?: string
  email?: string
  isActive?: boolean
}): Promise<string> {
  const { sessionSecret } = getSecrets()
  const payload: SessionUser = {
    role: payloadData?.role || 'superadmin',
    userId: payloadData?.userId,
    clientId: payloadData?.clientId,
    email: payloadData?.email,
    isActive: payloadData?.isActive ?? true,
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
 * Extract, verify signature, and return session payload if valid
 */
export async function getSessionData(token?: string | null): Promise<SessionUser | null> {
  if (!token || typeof token !== 'string') return null
  const [serialized, signature] = token.split('.')
  if (!serialized || !signature) return null

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

    if (!isValid) return null

    const payload: SessionUser = JSON.parse(
      Buffer.from(serialized, 'base64url').toString('utf8'),
    )
    if (!payload.exp || Date.now() > payload.exp) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/**
 * Verify HMAC signature and expiry of a session token
 */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  const session = await getSessionData(token)
  return !!session
}

export interface ActiveSessionResult {
  isAuthenticated: boolean
  role: 'superadmin' | 'partner' | 'admin' | 'client' | null
  userId: string | null
  clientId: string | null
  email: string | null
  isActive: boolean | null
}

/**
 * Server Function: Check if the current request has a valid session and return role metadata.
 * Validates real-time active status against PostgreSQL. If deactivated, destroys cookie & redirects.
 */
export const checkAuthServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ActiveSessionResult> => {
    const { getCookie, deleteCookie } = await getServerUtils()
    const token = getCookie(COOKIE_NAME)
    if (!token) {
      return {
        isAuthenticated: false,
        role: null,
        userId: null,
        clientId: null,
        email: null,
        isActive: null,
      }
    }

    const session = await getSessionData(token)
    if (!session) {
      return {
        isAuthenticated: false,
        role: null,
        userId: null,
        clientId: null,
        email: null,
        isActive: null,
      }
    }

    const userFilter = session.userId
      ? eq(users.id, session.userId)
      : session.email
      ? eq(users.email, session.email)
      : null

    if (userFilter) {
      const [dbUser] = await db
        .select({
          id: users.id,
          role: users.role,
          isActive: users.isActive,
          clientId: users.clientId,
          email: users.email,
        })
        .from(users)
        .where(userFilter)

      if (dbUser) {
        if (!dbUser.isActive) {
          const cookieOpts = await getSessionCookieOptions()
          deleteCookie(COOKIE_NAME, cookieOpts)
          throw redirect({
            to: '/login',
            search: {
              error: 'account_disabled',
            },
          })
        }

        return {
          isAuthenticated: true,
          role: dbUser.role as 'superadmin' | 'partner',
          userId: dbUser.id,
          clientId: dbUser.clientId || null,
          email: dbUser.email,
          isActive: dbUser.isActive,
        }
      } else if (session.role === 'client') {
        const cookieOpts = await getSessionCookieOptions()
        deleteCookie(COOKIE_NAME, cookieOpts)
        throw redirect({
          to: '/login',
          search: {
            error: 'account_disabled',
          },
        })
      }
    }

    return {
      isAuthenticated: true,
      role: session.role === 'admin' ? 'superadmin' : session.role,
      userId: null,
      clientId: session.clientId || null,
      email: session.email || null,
      isActive: true,
    }
  },
)

/**
 * Server Function: Authenticate user (Superadmin or Partner Agency) and issue secure cookie
 */
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data: { email?: string; password: unknown }) => {
    if (typeof data.password !== 'string' || !data.password) {
      throw new Error('Password is required')
    }
    return {
      email: typeof data.email === 'string' ? data.email.trim().toLowerCase() : undefined,
      password: data.password,
    }
  })
  .handler(async ({ data }) => {
    const { setCookie } = await getServerUtils()
    const { adminPassword } = getSecrets()
    const cookieOpts = await getSessionCookieOptions()

    // 1. If password matches master admin password, grant superadmin immediately
    if (data.password === adminPassword) {
      const token = await createSessionToken({ role: 'superadmin', email: data.email || undefined })
      setCookie(COOKIE_NAME, token, {
        ...cookieOpts,
        maxAge: SESSION_MAX_AGE,
      })
      return { success: true, role: 'superadmin' }
    }

    // 2. If email is provided, attempt partner login via the `users` table
    if (data.email) {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))

      if (dbUser) {
        if (!dbUser.isActive) {
          return {
            success: false,
            error: 'This account has been deactivated. Please contact support.',
          }
        }

        const isMatch = await verifyPassword(data.password, dbUser.passwordHash)
        if (!isMatch) {
          return { success: false, error: 'Incorrect email or password.' }
        }

        const token = await createSessionToken({
          role: dbUser.role as 'superadmin' | 'partner',
          userId: dbUser.id,
          clientId: dbUser.clientId || undefined,
          email: dbUser.email,
          isActive: dbUser.isActive,
        })

        setCookie(COOKIE_NAME, token, {
          ...cookieOpts,
          maxAge: SESSION_MAX_AGE,
        })

        return { success: true, role: dbUser.role }
      }

      return { success: false, error: 'Account not found with this email address.' }
    }

    // 3. If password-only provided and did not match master admin password
    return {
      success: false,
      error: 'Incorrect administrative password. Please try again.',
    }
  })

/**
 * Server Function: Logout and clear the session cookie
 */
export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { deleteCookie } = await getServerUtils()
    const cookieOpts = await getSessionCookieOptions()
    deleteCookie(COOKIE_NAME, cookieOpts)
    return { success: true }
  },
)

/**
 * Auth Route Guard: Require admin / agency access (Superadmin or Partner).
 * Blocks unauthenticated users and redirects clients to /portal.
 */
export async function requireAdmin({
  location,
}: {
  location: { href: string }
}) {
  const auth = await checkAuthServerFn()
  if (!auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
  if (auth.role === 'client') {
    throw redirect({
      to: '/portal',
    })
  }
  return auth
}

/**
 * Auth Route Guard: Require Superadmin privileges.
 * Blocks partners and redirects them back to /admin/clients.
 */
export async function requireSuperadmin({
  location,
}: {
  location: { href: string }
}) {
  const auth = await checkAuthServerFn()
  if (!auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
  if (auth.role === 'partner') {
    throw redirect({
      to: '/admin/clients',
    })
  }
  if (auth.role === 'client') {
    throw redirect({
      to: '/portal',
    })
  }
  return auth
}

/**
 * Auth Route Guard: Require client or admin session for portal access.
 */
export async function requireClient({
  location,
}: {
  location: { href: string }
}) {
  const auth = await checkAuthServerFn()
  if (!auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
  return auth
}

/**
 * Backward compatibility: Require authenticated superadmin session
 */
export async function requireAuth({
  location,
}: {
  location: { href: string }
}) {
  return requireSuperadmin({ location })
}

