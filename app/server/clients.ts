import { createServerFn } from '@tanstack/react-start'
import { desc, eq, inArray, and, isNull, sql } from 'drizzle-orm'
import { db, clients, reports, users, type Client } from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'
import { logActivity } from './activity-logger'

export interface ClientWithReportCount extends Client {
  reportCount: number
  partner?: {
    id: string
    name: string | null
    email: string
  } | null
}

export interface PartnerSummary {
  id: string
  name: string | null
  email: string
  isActive: boolean
}

/**
 * Server Function: Get clients with report counts and partner info.
 * If user is a partner, scopes results strictly to clients where partner_id === auth.userId.
 */
export const getClientsServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { partnerId?: string }) => data || {})
  .handler(
    async ({ data }): Promise<{ clients: ClientWithReportCount[]; partners: PartnerSummary[] }> => {
      const auth = await assertActiveSession()
      if (auth.role === 'client') {
        throw new Error('Unauthorized: Client accounts cannot view client listings')
      }

      const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

      // 1. If user is a partner or partner employee, only fetch their assigned agency clients.
      // For partner and partner_employee, the partnerId argument is ignored entirely and scoped to getEffectivePartnerId(auth).
      if (!isSuperadmin) {
        const effectivePartnerId = getEffectivePartnerId(auth)
        if (!effectivePartnerId) {
          return { clients: [], partners: [] }
        }

        const partnerClients = await db
          .select()
          .from(clients)
          .where(and(eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
          .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

        const clientIds = partnerClients.map((c) => c.id)
        const countMap: Record<string, number> = {}
        if (clientIds.length > 0) {
          const partnerReports = await db
            .select({ clientId: reports.clientId })
            .from(reports)
            .where(inArray(reports.clientId, clientIds))
          for (const r of partnerReports) {
            if (r.clientId) {
              countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
            }
          }
        }

        const clientList: ClientWithReportCount[] = partnerClients.map((c) => ({
          ...c,
          reportCount: countMap[c.id] || 0,
          partner: null,
        }))

        return { clients: clientList, partners: [] }
      }

      // 2. Superadmin / Admin: partnerId filter argument is honoured ONLY for superadmin
      const conditions = [isNull(clients.deletedAt)]
      if (data?.partnerId === 'unassigned') {
        conditions.push(isNull(clients.partnerId))
      } else if (data?.partnerId && data.partnerId !== 'all') {
        conditions.push(eq(clients.partnerId, data.partnerId))
      }

      const allClients = await db
        .select()
        .from(clients)
        .where(and(...conditions))
        .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

      const clientIds = allClients.map((c) => c.id)
      const countMap: Record<string, number> = {}
      if (clientIds.length > 0) {
        const matchingReports = await db
          .select({ clientId: reports.clientId })
          .from(reports)
          .where(inArray(reports.clientId, clientIds))
        for (const r of matchingReports) {
          if (r.clientId) {
            countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
          }
        }
      }

      const partnerUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          isActive: users.isActive,
        })
        .from(users)
        .where(and(eq(users.role, 'partner'), isNull(users.deletedAt)))
        .orderBy(sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`)

      const partnerMap: Record<string, { id: string; name: string | null; email: string }> = {}
      for (const p of partnerUsers) {
        partnerMap[p.id] = { id: p.id, name: p.name, email: p.email }
      }

      const clientList: ClientWithReportCount[] = allClients.map((c) => ({
        ...c,
        reportCount: countMap[c.id] || 0,
        partner: c.partnerId ? partnerMap[c.partnerId] || null : null,
      }))

      return {
        clients: clientList,
        partners: partnerUsers,
      }
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
    const auth = await assertActiveSession()

    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
    if (!client) {
      throw new Error('Client not found')
    }

    // Protection: If partner or employee, ensure client belongs to this partner
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId && client.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized access to client record')
    }

    // IDOR Protection: If client role, ensure they only fetch their own record
    if (auth.role === 'client' && auth.clientId !== data.id) {
      throw new Error('Unauthorized access to client record')
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
      partnerId?: string | null
    }) => {
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    let assignedPartnerId: string | null = null
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      // Partners & partner employees can only create clients assigned to their agency
      assignedPartnerId = effectivePartnerId
    } else {
      assignedPartnerId = data.partnerId && data.partnerId.trim() ? data.partnerId.trim() : null
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
        partnerId: assignedPartnerId,
      })
      .returning()

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'create_client',
    })

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
      partnerId?: string | null
    }) => {
      if (!data.id) throw new Error('Client ID is required')
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    const [existing] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
    if (!existing) throw new Error('Client not found')

    const updateFields: Record<string, any> = {
      name: data.name.trim(),
      businessName: data.businessName.trim(),
      websiteUrl: data.websiteUrl?.trim() || null,
      logoUrl: data.logoUrl?.trim() || null,
      primaryColor: data.primaryColor?.trim() || '#2563eb',
      secondaryColor: data.secondaryColor?.trim() || '#1e293b',
      isWhiteLabel: !!data.isWhiteLabel,
      partnerName: data.partnerName?.trim() || null,
      partnerLogoUrl: data.partnerLogoUrl?.trim() || null,
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      if (existing.partnerId !== effectivePartnerId) {
        throw new Error('Unauthorized: You can only edit your own assigned clients')
      }
      // Keep existing partnerId
    } else {
      // Superadmin can reassign partner
      if (data.partnerId !== undefined) {
        updateFields.partnerId = data.partnerId && data.partnerId.trim() ? data.partnerId.trim() : null
      }
    }

    const [updated] = await db
      .update(clients)
      .set(updateFields)
      .where(eq(clients.id, data.id))
      .returning()

    return { success: true, client: updated }
  })

/**
 * Server Function: Delete a client (Soft delete)
 */
export const deleteClientServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    const [existing] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
    if (!existing) throw new Error('Client not found')

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId && existing.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: You can only delete your own assigned clients')
    }

    await db
      .update(clients)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(clients.id, data.id))

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'delete_client',
    })

    return { success: true }
  })
