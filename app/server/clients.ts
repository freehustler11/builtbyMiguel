import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { db, clients, reports, users, type Client } from '../db'
import { getSessionData, hashPassword } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'admin_session'

export interface ClientWithReportCount extends Client {
  reportCount: number
  portalUser?: {
    id: string
    email: string
    isActive: boolean
    createdAt: Date | string
  } | null
}

/**
 * Server Function: Get all clients with report counts and portal user logins
 */
export const getClientsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized access')
    }

    const allClients = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.createdAt))

    // Fetch report counts per client
    const allReports = await db.select({ clientId: reports.clientId }).from(reports)
    const countMap: Record<string, number> = {}
    for (const r of allReports) {
      countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
    }

    // Fetch portal users per client
    const allClientUsers = await db
      .select({
        id: users.id,
        email: users.email,
        clientId: users.clientId,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'client'))

    const userMap: Record<
      string,
      { id: string; email: string; isActive: boolean; createdAt: Date | string }
    > = {}
    for (const u of allClientUsers) {
      if (u.clientId) {
        userMap[u.clientId] = {
          id: u.id,
          email: u.email,
          isActive: u.isActive,
          createdAt: u.createdAt,
        }
      }
    }

    const clientList: ClientWithReportCount[] = allClients.map((c) => ({
      ...c,
      reportCount: countMap[c.id] || 0,
      portalUser: userMap[c.id] || null,
    }))

    return { clients: clientList }
  }
)

/**
 * Server Function: Get a single client by ID with their reports
 */
export const getClientByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session) {
      throw new Error('Unauthorized access')
    }

    // If client role, ensure they only fetch their own record
    if (session.role === 'client' && session.clientId !== data.id) {
      throw new Error('Unauthorized access to client record')
    }

    const [client] = await db.select().from(clients).where(eq(clients.id, data.id))
    if (!client) {
      throw new Error('Client not found')
    }

    const clientReports = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, data.id))
      .orderBy(desc(reports.createdAt))

    return { client, reports: clientReports }
  })

/**
 * Server Function: Create a new client
 */
export const createClientServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      name: string
      businessName: string
      websiteUrl?: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
      isWhiteLabel?: boolean
      partnerName?: string
      partnerLogoUrl?: string
    }) => {
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const [created] = await db
      .insert(clients)
      .values({
        name: data.name.trim(),
        businessName: data.businessName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        primaryColor: data.primaryColor?.trim() || '#2563eb',
        secondaryColor: data.secondaryColor?.trim() || '#1e293b',
        isWhiteLabel: !!data.isWhiteLabel,
        partnerName: data.partnerName?.trim() || null,
        partnerLogoUrl: data.partnerLogoUrl?.trim() || null,
      })
      .returning()

    return { success: true, client: created }
  })

/**
 * Server Function: Update an existing client
 */
export const updateClientServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      name: string
      businessName: string
      websiteUrl?: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
      isWhiteLabel?: boolean
      partnerName?: string
      partnerLogoUrl?: string
    }) => {
      if (!data.id) throw new Error('Client ID is required')
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const [updated] = await db
      .update(clients)
      .set({
        name: data.name.trim(),
        businessName: data.businessName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        primaryColor: data.primaryColor?.trim() || '#2563eb',
        secondaryColor: data.secondaryColor?.trim() || '#1e293b',
        isWhiteLabel: !!data.isWhiteLabel,
        partnerName: data.partnerName?.trim() || null,
        partnerLogoUrl: data.partnerLogoUrl?.trim() || null,
      })
      .where(eq(clients.id, data.id))
      .returning()

    return { success: true, client: updated }
  })

/**
 * Server Function: Toggle active status for a client user (Admin only)
 */
export const toggleClientUserActiveServerFn = createServerFn({ method: 'POST' })
  .validator((data: { userId: string; isActive: boolean }) => {
    if (!data.userId) throw new Error('User ID is required')
    return {
      userId: data.userId,
      isActive: Boolean(data.isActive),
    }
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const [targetUser] = await db.select().from(users).where(eq(users.id, data.userId))
    if (!targetUser) throw new Error('User account not found')

    // Block admins from toggling off their own superadmin account
    if (session.userId === targetUser.id && !data.isActive) {
      throw new Error('Action blocked: You cannot deactivate your own administrative account.')
    }
    if (
      targetUser.role === 'admin' &&
      !data.isActive &&
      (session.email === targetUser.email || session.userId === targetUser.id)
    ) {
      throw new Error('Action blocked: You cannot deactivate your own administrative account.')
    }

    const [updated] = await db
      .update(users)
      .set({
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.userId))
      .returning()

    return {
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        isActive: updated.isActive,
      },
    }
  })

/**
 * Server Function: Create or update a client portal login account
 */
export const createOrUpdateClientUserServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      email: string
      password?: string
      isActive?: boolean
    }) => {
      if (!data.clientId?.trim()) throw new Error('Client ID is required')
      if (!data.email?.trim() || !data.email.includes('@')) throw new Error('A valid email address is required')
      if (data.password && data.password.length < 6) throw new Error('Password must be at least 6 characters')
      return {
        clientId: data.clientId.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password ? data.password.trim() : undefined,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      }
    }
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    // Verify client exists
    const [client] = await db.select().from(clients).where(eq(clients.id, data.clientId))
    if (!client) throw new Error('Client not found')

    // Check if client already has a portal user
    const [existingClientUser] = await db
      .select()
      .from(users)
      .where(eq(users.clientId, data.clientId))

    if (existingClientUser) {
      // Check if email changed and is taken by another account
      if (data.email !== existingClientUser.email) {
        const [taken] = await db.select().from(users).where(eq(users.email, data.email))
        if (taken) {
          throw new Error('An account with this email address already exists.')
        }
      }

      // Block admin from deactivating themselves if this user happens to be their account
      if (session.userId === existingClientUser.id && !data.isActive) {
        throw new Error('Action blocked: You cannot deactivate your own administrative account.')
      }

      const updateData: {
        email: string
        isActive: boolean
        updatedAt: Date
        passwordHash?: string
      } = {
        email: data.email,
        isActive: data.isActive,
        updatedAt: new Date(),
      }

      if (data.password) {
        updateData.passwordHash = await hashPassword(data.password)
      }

      const [updated] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, existingClientUser.id))
        .returning()

      return {
        success: true,
        user: {
          id: updated.id,
          email: updated.email,
          isActive: updated.isActive,
        },
      }
    }

    // Creating new user: password is required
    if (!data.password) {
      throw new Error('Password is required when creating a new portal login')
    }

    // Check if email is already taken by another account
    const [existingWithEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))

    if (existingWithEmail) {
      throw new Error('An account with this email address already exists.')
    }

    const passwordHash = await hashPassword(data.password)

    // Insert new client user
    const [created] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash,
        role: 'client',
        clientId: data.clientId,
        isActive: data.isActive,
      })
      .returning()

    return {
      success: true,
      user: {
        id: created.id,
        email: created.email,
        isActive: created.isActive,
      },
    }
  })

/**
 * Server Function: Delete a client
 */
export const deleteClientServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    await db.delete(clients).where(eq(clients.id, data.id))
    return { success: true }
  })
