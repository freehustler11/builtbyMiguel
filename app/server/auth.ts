import { eq } from 'drizzle-orm'
import { getCookie, deleteCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { db, users } from '../db'
import { getSessionData, getSessionCookieOptions } from '../lib/auth'

const COOKIE_NAME = 'admin_session'

export interface ActiveSession {
  role: 'superadmin' | 'partner' | 'admin' | 'client'
  userId: string | null
  clientId: string | null
  email: string | null
  isActive: boolean
}

/**
 * Assert that the request has an active, authenticated session verified in real-time against PostgreSQL.
 * If user is deactivated or missing, immediately destroys the cookie and redirects to /login?error=account_disabled.
 */
export async function assertActiveSession(): Promise<ActiveSession> {
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
        email: users.email,
      })
      .from(users)
      .where(userFilter)

    if (dbUser) {
      if (!dbUser.isActive) {
        deleteCookie(COOKIE_NAME, getSessionCookieOptions())
        throw redirect({
          to: '/login',
          search: {
            error: 'account_disabled',
          },
        })
      }

      return {
        role: dbUser.role as 'superadmin' | 'partner',
        userId: dbUser.id,
        clientId: dbUser.clientId || null,
        email: dbUser.email,
        isActive: dbUser.isActive,
      }
    } else if (session.role === 'client') {
      deleteCookie(COOKIE_NAME, getSessionCookieOptions())
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
    clientId: session.clientId || null,
    email: session.email || null,
    isActive: true,
  }
}

/**
 * Assert that the current session is a Superadmin (blocks partner agency accounts)
 */
export async function assertSuperadminSession(): Promise<ActiveSession> {
  const session = await assertActiveSession()
  if (session.role === 'partner') {
    throw new Error('Unauthorized: Superadmin privileges required')
  }
  return session
}

