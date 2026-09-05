import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, sql } from 'drizzle-orm'
import { db, users, clients } from '../db'
import { hashPassword } from '../lib/auth'
import { assertSuperadminSession } from './auth'

export interface PartnerItem {
  id: string
  name: string | null
  email: string
  isActive: boolean
  createdAt: Date | string
  clientCount: number
}

/**
 * Server Function: Get all partner agency accounts with their assigned client counts (Superadmin only)
 */
export const getPartnersServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ partners: PartnerItem[] }> => {
    await assertSuperadminSession()

    const partnerUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.role, 'partner'), isNull(users.deletedAt)))
      .orderBy(sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`)

    const allClients = await db
      .select({
        id: clients.id,
        partnerId: clients.partnerId,
      })
      .from(clients)
      .where(isNull(clients.deletedAt))

    const clientCountMap: Record<string, number> = {}
    for (const c of allClients) {
      if (c.partnerId) {
        clientCountMap[c.partnerId] = (clientCountMap[c.partnerId] || 0) + 1
      }
    }

    const partners: PartnerItem[] = partnerUsers.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      isActive: p.isActive,
      createdAt: p.createdAt,
      clientCount: clientCountMap[p.id] || 0,
    }))

    return { partners }
  }
)

/**
 * Server Function: Create a new Partner Agency account (Superadmin only)
 */
export const createPartnerServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      name: string
      email: string
      password: string
      isActive?: boolean
    }) => {
      if (!data.name?.trim()) throw new Error('Partner agency name is required')
      if (!data.email?.trim() || !data.email.includes('@')) throw new Error('Valid email is required')
      if (!data.password || data.password.length < 6) throw new Error('Password must be at least 6 characters')
      return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      }
    }
  )
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    // Check if email already taken
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))

    if (existing) {
      throw new Error('An account with this email address already exists.')
    }

    const passwordHash = await hashPassword(data.password)

    const [created] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'partner',
        isActive: data.isActive,
      })
      .returning()

    return {
      success: true,
      partner: {
        id: created.id,
        name: created.name,
        email: created.email,
        isActive: created.isActive,
        createdAt: created.createdAt,
        clientCount: 0,
      },
    }
  })

/**
 * Server Function: Update a Partner Agency account (Superadmin only)
 */
export const updatePartnerServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      name: string
      email: string
      password?: string
      isActive?: boolean
    }) => {
      if (!data.id) throw new Error('Partner ID is required')
      if (!data.name?.trim()) throw new Error('Partner name is required')
      if (!data.email?.trim() || !data.email.includes('@')) throw new Error('Valid email is required')
      if (data.password && data.password.length < 6) throw new Error('Password must be at least 6 characters')
      return {
        id: data.id,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password?.trim(),
        isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
      }
    }
  )
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const [partner] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))
    if (!partner || partner.role !== 'partner') {
      throw new Error('Partner account not found')
    }

    // Check email clash if email changed
    if (data.email !== partner.email) {
      const [clash] = await db.select().from(users).where(and(eq(users.email, data.email), isNull(users.deletedAt)))
      if (clash) {
        throw new Error('An account with this email address already exists.')
      }
    }

    const updateFields: {
      name: string
      email: string
      updatedAt: Date
      isActive?: boolean
      passwordHash?: string
    } = {
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    }

    if (typeof data.isActive === 'boolean') {
      updateFields.isActive = data.isActive
    }

    if (data.password) {
      updateFields.passwordHash = await hashPassword(data.password)
    }

    const [updated] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, data.id))
      .returning()

    return {
      success: true,
      partner: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        isActive: updated.isActive,
      },
    }
  })

/**
 * Server Function: Toggle active status for a Partner Agency account (Superadmin only)
 */
export const togglePartnerActiveServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; isActive: boolean }) => {
    if (!data.id) throw new Error('Partner ID is required')
    return {
      id: data.id,
      isActive: Boolean(data.isActive),
    }
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const [partner] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))
    if (!partner || partner.role !== 'partner') {
      throw new Error('Partner account not found')
    }

    const [updated] = await db
      .update(users)
      .set({
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id))
      .returning()

    return {
      success: true,
      partner: {
        id: updated.id,
        isActive: updated.isActive,
      },
    }
  })

/**
 * Server Function: Assign a client to a partner or reset to direct Superadmin client (Superadmin only)
 */
export const assignClientPartnerServerFn = createServerFn({ method: 'POST' })
  .validator((data: { clientId: string; partnerId: string | null }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return {
      clientId: data.clientId,
      partnerId: data.partnerId && data.partnerId.trim() ? data.partnerId.trim() : null,
    }
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    if (data.partnerId) {
      const [partner] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, data.partnerId), eq(users.role, 'partner'), isNull(users.deletedAt)))

      if (!partner) {
        throw new Error('Partner account not found')
      }
    }

    const [updated] = await db
      .update(clients)
      .set({
        partnerId: data.partnerId,
      })
      .where(and(eq(clients.id, data.clientId), isNull(clients.deletedAt)))
      .returning()

    return {
      success: true,
      client: updated,
    }
  })
