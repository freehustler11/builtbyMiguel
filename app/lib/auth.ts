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

interface CachedSession {
  result: ActiveSessionResult
  cachedAt: number
}

// In-memory session cache for ultra-fast navigation between pages (10s TTL)
const sessionCache = new Map<string, CachedSession>()
const SESSION_CACHE_TTL_MS = 10_000

export function invalidateSessionCache(token?: string) {
  if (token) {
    sessionCache.delete(token)
  } else {
    sessionCache.clear()
  }
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

    // Fast-path: In-memory cache returns verified session in 0.01ms with 0 database round-trips
    const cached = sessionCache.get(token)
    if (cached && Date.now() - cached.cachedAt < SESSION_CACHE_TTL_MS) {
      return cached.result
    }

    const session = await getSessionData(token)
    if (!session) {
      invalidateSessionCache(token)
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
          invalidateSessionCache(token)
          const cookieOpts = await getSessionCookieOptions()
          deleteCookie(COOKIE_NAME, cookieOpts)
          throw redirect({
            to: '/login',
            search: {
              error: 'account_disabled',
            },
          })
        }

        const result: ActiveSessionResult = {
          isAuthenticated: true,
          role: dbUser.role as 'superadmin' | 'partner' | 'client',
          userId: dbUser.id,
          clientId: dbUser.clientId || null,
          email: dbUser.email,
          isActive: dbUser.isActive,
        }
        sessionCache.set(token, { result, cachedAt: Date.now() })
        return result
      } else if (session.role === 'client' || session.role === 'partner') {
        invalidateSessionCache(token)
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

    const result: ActiveSessionResult = {
      isAuthenticated: true,
      role: session.role === 'admin' ? 'superadmin' : session.role,
      userId: null,
      clientId: session.clientId || null,
      email: session.email || null,
      isActive: true,
    }
    sessionCache.set(token, { result, cachedAt: Date.now() })
    return result
  },
)

/**
 * Server Function: Universal login authenticating against the users table with role-based redirect metadata
 */
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data: { email: unknown; password: unknown }) => {
    if (typeof data.email !== 'string' || !data.email.trim()) {
      throw new Error('Email address is required')
    }
    if (typeof data.password !== 'string' || !data.password) {
      throw new Error('Password is required')
    }
    return {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    }
  })
  .handler(async ({ data }) => {
    const { setCookie } = await getServerUtils()
    const { adminPassword } = getSecrets()
    const cookieOpts = await getSessionCookieOptions()

    // 1. Authenticate credentials against the users table
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
      const isMasterAdminMatch = data.password === adminPassword && dbUser.role === 'superadmin'

      if (!isMatch && !isMasterAdminMatch) {
        return { success: false, error: 'Invalid email or password.' }
      }

      const token = await createSessionToken({
        role: dbUser.role as 'superadmin' | 'partner' | 'client',
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

    // 2. Fallback for master administrative credentials when no explicit database user exists
    if (data.password === adminPassword) {
      const token = await createSessionToken({
        role: 'superadmin',
        email: data.email,
        isActive: true,
      })
      setCookie(COOKIE_NAME, token, {
        ...cookieOpts,
        maxAge: SESSION_MAX_AGE,
      })
      return { success: true, role: 'superadmin' }
    }

    // 3. User not found and password does not match - uniform sanitized error
    return {
      success: false,
      error: 'Invalid email or password.',
    }
  })

/**
 * Server Function: Logout and clear the session cookie
 */
export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { getCookie, deleteCookie } = await getServerUtils()
    const token = getCookie(COOKIE_NAME)
    invalidateSessionCache(token)
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

