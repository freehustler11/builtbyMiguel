import { createServerFn } from '@tanstack/react-start'
import { eq, desc, and, isNull, sql } from 'drizzle-orm'
import { db, users } from '../db'
import { hashPassword, verifyPassword, invalidateSessionCache } from '../lib/auth'
import { assertActiveSession, assertSuperadminSession } from './auth'
import { logActivity } from './activity-logger'

export interface ManagedUserItem {
  id: string
  name: string | null
  email: string
  role: 'superadmin' | 'partner' | 'partner_employee' | 'client'
  isActive: boolean
  createdAt: Date | string
  partnerId: string | null
  partnerName?: string | null
}

/**
 * Server Function: Self-service password change for any authenticated user.
 * Requires verifying their current password for security.
 */
export const changeMyPasswordServerFn = createServerFn({ method: 'POST' })
  .validator((data: { currentPassword?: unknown; newPassword?: unknown }) => {
    if (typeof data.currentPassword !== 'string' || !data.currentPassword) {
      throw new Error('Current password is required')
    }
    if (typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long')
    }
    return {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    const adminPassword = process.env.ADMIN_PASSWORD || 'L0v3hurt$11290523'

    // Fetch user record from database
    const userFilter = auth.userId
      ? eq(users.id, auth.userId)
      : auth.email
      ? eq(users.email, auth.email)
      : null

    if (!userFilter) {
      throw new Error('User record could not be resolved')
    }

    let [dbUser] = await db.select().from(users).where(and(userFilter, isNull(users.deletedAt)))

    // Fallback: If superadmin logged in via fallback without explicit DB row, create one
    if (!dbUser && (auth.role === 'superadmin' || auth.role === 'admin')) {
      if (data.currentPassword !== adminPassword) {
        throw new Error('Current password is incorrect')
      }
      const newHash = await hashPassword(data.newPassword)
      const [created] = await db
        .insert(users)
        .values({
          name: 'Superadmin',
          email: auth.email || 'admin@builtbymiguel.net',
          passwordHash: newHash,
          role: 'superadmin',
          isActive: true,
        })
        .returning()
      dbUser = created
    } else {
      if (!dbUser) {
        throw new Error('User account not found')
      }

      // Verify current password
      const isMatch = await verifyPassword(data.currentPassword, dbUser.passwordHash)
      const isMasterMatch =
        dbUser.role === 'superadmin' &&
        data.currentPassword === adminPassword

      if (!isMatch && !isMasterMatch) {
        throw new Error('Current password is incorrect')
      }

      const newHash = await hashPassword(data.newPassword)
      await db
        .update(users)
        .set({
          passwordHash: newHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, dbUser.id))
    }

    // Invalidate cached session so fresh authentication is enforced
    invalidateSessionCache()

    await logActivity({
      userId: dbUser.id,
      userEmail: dbUser.email,
      role: dbUser.role,
      action: 'change_password',
    })

    return {
      success: true,
      message: 'Password updated successfully.',
    }
  })

/**
 * Server Function: Admin-level password reset.
 * - Superadmins can reset passwords for ANY user in the system.
 * - Partner Agency Owners can reset passwords for their OWN agency staff members.
 * - Partner Employees and Clients are strictly unauthorized.
 */
export const adminResetUserPasswordServerFn = createServerFn({ method: 'POST' })
  .validator((data: { userId?: unknown; newPassword?: unknown }) => {
    if (typeof data.userId !== 'string' || !data.userId.trim()) {
      throw new Error('User ID is required')
    }
    if (typeof data.newPassword !== 'string' || data.newPassword.trim().length < 6) {
      throw new Error('New password must be at least 6 characters long')
    }
    return {
      userId: data.userId.trim(),
      newPassword: data.newPassword.trim(),
    }
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    if (auth.role === 'client' || auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Administrative privileges required')
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.userId), isNull(users.deletedAt)))
    if (!targetUser) {
      throw new Error('Target user account not found')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

    // Partner Agency Owner permission check: only allowed to reset their own agency staff
    if (!isSuperadmin) {
      if (targetUser.role !== 'partner_employee' || targetUser.partnerId !== auth.userId) {
        throw new Error('Unauthorized: You can only reset passwords for staff in your agency')
      }
    }

    const passwordHash = await hashPassword(data.newPassword)

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUser.id))

    invalidateSessionCache()

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'admin_reset_password',
    })

    return {
      success: true,
      userId: targetUser.id,
      userEmail: targetUser.email,
      userName: targetUser.name,
      message: `Password for ${targetUser.name || targetUser.email} has been reset.`,
    }
  })

function getUsersOrderBy(sort?: string, order: 'asc' | 'desc' = 'asc') {
  const isDesc = order === 'desc'
  if (sort === 'name') {
    return isDesc
      ? sql`coalesce(lower(${users.name}), lower(${users.email})) desc nulls last`
      : sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'role') {
    return isDesc
      ? sql`lower(${users.role}) desc nulls last`
      : sql`lower(${users.role}) asc nulls last`
  }
  if (sort === 'createdAt') {
    return isDesc
      ? sql`${users.createdAt} desc nulls last`
      : sql`${users.createdAt} asc nulls last`
  }
  if (sort === 'status') {
    return isDesc
      ? sql`case when ${users.isActive} = true then 1 else 0 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`case when ${users.isActive} = true then 0 else 1 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'agency') {
    return isDesc
      ? sql`${users.partnerId} desc nulls last`
      : sql`${users.partnerId} asc nulls last`
  }
  return sql`case when ${users.isActive} = true then 0 else 1 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
}

/**
 * Server Function: Get all users across the system for superadmin password management.
 */
export const getAllUsersForAdminServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { sort?: string; order?: 'asc' | 'desc' }) => data || {})
  .handler(
    async ({ data }): Promise<{ users: ManagedUserItem[] }> => {
      await assertSuperadminSession()

      const allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
          partnerId: users.partnerId,
        })
        .from(users)
        .where(isNull(users.deletedAt))
        .orderBy(getUsersOrderBy(data?.sort, data?.order))

      // Map partner names
      const partnerOwners = allUsers.filter((u) => u.role === 'partner')
      const partnerMap = new Map(partnerOwners.map((p) => [p.id, p.name || p.email]))

      const result: ManagedUserItem[] = allUsers.map((u) => ({
        ...u,
        role: u.role as 'superadmin' | 'partner' | 'partner_employee' | 'client',
        partnerName: u.partnerId ? partnerMap.get(u.partnerId) || null : null,
      }))

      return { users: result }
    }
  )
