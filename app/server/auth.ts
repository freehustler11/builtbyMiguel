import { eq } from 'drizzle-orm'
import { redirect } from '@tanstack/react-router'
import { db, users } from '../db'
import { getSessionData, getSessionCookieOptions } from '../lib/auth'

const COOKIE_NAME = 'admin_session'

async function getServerUtils() {
  return await import(/* @vite-ignore */ '@tanstack/react-start/server')
}

export interface ActiveSession {
  role: 'superadmin' | 'partner' | 'admin' | 'client' | 'partner_employee'
  userId: string | null
  partnerId?: string | null
  clientId: string | null
  email: string | null
  isActive: boolean
}

/**
 * Assert that the request has an active, authenticated session verified in real-time against PostgreSQL.
 * If user is deactivated or missing, immediately destroys the cookie and redirects to /login?error=account_disabled.
 */
export async function assertActiveSession(): Promise<ActiveSession> {
  const { getCookie, deleteCookie } = await getServerUtils()
  const token = getCookie(COOKIE_NAME)
  const session = await getSessionData(token)
  if (!session) {
    throw new Error('Unauthorized: Authentication required')
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
        partnerId: users.partnerId,
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
        role: dbUser.role as 'superadmin' | 'partner' | 'client' | 'partner_employee',
        userId: dbUser.id,
        partnerId: dbUser.partnerId || null,
        clientId: dbUser.clientId || null,
        email: dbUser.email,
        isActive: dbUser.isActive,
      }
    } else if (session.role === 'client' || session.role === 'partner' || session.role === 'partner_employee') {
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
    role: session.role === 'admin' ? 'superadmin' : session.role,
    userId: null,
    partnerId: session.partnerId || null,
    clientId: session.clientId || null,
    email: session.email || null,
    isActive: true,
  }
}

/**
 * Assert that the current session is a Superadmin (blocks partner agency accounts and employees)
 */
export async function assertSuperadminSession(): Promise<ActiveSession> {
  const session = await assertActiveSession()
  if (session.role === 'partner' || session.role === 'partner_employee') {
    throw new Error('Unauthorized: Superadmin privileges required')
  }
  return session
}

/**
 * Helper to get effective partner/agency ID for tenant isolation:
 * - If partner: returns their userId (agency owner ID)
 * - If partner_employee: returns their partnerId (parent agency ID)
 * - Otherwise: returns null (superadmin or client)
 */
export function getEffectivePartnerId(auth: ActiveSession): string | null {
  if (auth.role === 'partner') return auth.userId
  if (auth.role === 'partner_employee') return auth.partnerId || null
  return null
}

