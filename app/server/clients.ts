import { createServerFn } from '@tanstack/react-start'
import { desc, eq, inArray, and, isNull, sql } from 'drizzle-orm'
import {
  db,
  clients,
  reports,
  users,
  clientDataSources,
  clientLocations,
  locationMonthlyMetrics,
  type Client,
  type ClientDataSource,
  type ClientLocation,
} from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'
import { logActivity } from './activity-logger'

export type DataSourceStatus = 'connected' | 'no_access' | 'not_applicable'

export interface AssignedStaffSummary {
  id: string
  name: string | null
  email: string
  avatarUrl: string | null
}

export interface ClientWithReportCount extends Client {
  reportCount: number
  partner?: {
    id: string
    name: string | null
    email: string
  } | null
  assignedStaff?: AssignedStaffSummary | null
  dataSources?: Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus>
  missingSources?: Array<'gsc' | 'ga4' | 'gbp'>
  locationCount?: number
  locations?: ClientLocation[]
  latestReport?: {
    id: string
    periodStart: Date
    periodEnd: Date
    reportMonth: string
    createdAt: Date
  } | null
}

export interface PartnerSummary {
  id: string
  name: string | null
  email: string
  isActive: boolean
}

export interface ClientDataSourceItem {
  id: string
  clientId: string
  source: 'gsc' | 'ga4' | 'gbp'
  status: DataSourceStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Server Function: Get clients with report counts, partner info, and data source access status.
 * If user is a partner, scopes results strictly to clients where partner_id === auth.userId.
 */
export const getClientsServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { partnerId?: string; sort?: string; order?: 'asc' | 'desc' }) => data || {})
  .handler(
    async ({ data }): Promise<{ clients: ClientWithReportCount[]; partners: PartnerSummary[] }> => {
      const auth = await assertActiveSession()
      if (auth.role === 'client') {
        throw new Error('Unauthorized: Client accounts cannot view client listings')
      }

      const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

      // Helper to query and construct data sources map
      const buildDataSourcesMaps = async (ids: string[]) => {
        const dataSourcesMap: Record<string, Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus>> = {}
        const missingSourcesMap: Record<string, Array<'gsc' | 'ga4' | 'gbp'>> = {}
        if (ids.length === 0) return { dataSourcesMap, missingSourcesMap }

        const rows = await db
          .select()
          .from(clientDataSources)
          .where(inArray(clientDataSources.clientId, ids))

        for (const id of ids) {
          dataSourcesMap[id] = { gsc: 'connected', ga4: 'connected', gbp: 'connected' }
          missingSourcesMap[id] = []
        }

        for (const row of rows) {
          const s = row.source as 'gsc' | 'ga4' | 'gbp'
          const st = row.status as DataSourceStatus
          if (dataSourcesMap[row.clientId]) {
            dataSourcesMap[row.clientId][s] = st
          }
        }

        for (const id of ids) {
          const ds = dataSourcesMap[id]
          const missing: Array<'gsc' | 'ga4' | 'gbp'> = []
          if (ds.gsc === 'no_access') missing.push('gsc')
          if (ds.ga4 === 'no_access') missing.push('ga4')
          if (ds.gbp === 'no_access') missing.push('gbp')
          missingSourcesMap[id] = missing
        }

        return { dataSourcesMap, missingSourcesMap }
      }

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
        const locCountMap: Record<string, number> = {}
        const latestReportMap: Record<string, { id: string; periodStart: Date; periodEnd: Date; reportMonth: string; createdAt: Date }> = {}
        if (clientIds.length > 0) {
          const partnerReports = await db
            .select({
              id: reports.id,
              clientId: reports.clientId,
              periodStart: reports.periodStart,
              periodEnd: reports.periodEnd,
              reportMonth: reports.reportMonth,
              createdAt: reports.createdAt,
            })
            .from(reports)
            .where(inArray(reports.clientId, clientIds))
            .orderBy(desc(reports.periodStart), desc(reports.createdAt))

          for (const r of partnerReports) {
            if (r.clientId) {
              if (!latestReportMap[r.clientId]) {
                latestReportMap[r.clientId] = {
                  id: r.id,
                  periodStart: r.periodStart,
                  periodEnd: r.periodEnd,
                  reportMonth: r.reportMonth,
                  createdAt: r.createdAt,
                }
              }
              countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
            }
          }

          const partnerLocs = await db
            .select({ clientId: clientLocations.clientId })
            .from(clientLocations)
            .where(and(inArray(clientLocations.clientId, clientIds), eq(clientLocations.isActive, true)))
          for (const l of partnerLocs) {
            if (l.clientId) {
              locCountMap[l.clientId] = (locCountMap[l.clientId] || 0) + 1
            }
          }
        }

        const { dataSourcesMap, missingSourcesMap } = await buildDataSourcesMaps(clientIds)

        // Fetch assigned staff members for these clients
        const staffIds = partnerClients.map((c) => c.assignedStaffId).filter(Boolean) as string[]
        const staffUsers = staffIds.length > 0
          ? await db
              .select({
                id: users.id,
                name: users.name,
                email: users.email,
                avatarUrl: users.avatarUrl,
              })
              .from(users)
              .where(inArray(users.id, staffIds))
          : []
        const staffMap = new Map(staffUsers.map((u) => [u.id, u]))

        const clientList: ClientWithReportCount[] = partnerClients.map((c) => ({
          ...c,
          reportCount: countMap[c.id] || 0,
          locationCount: locCountMap[c.id] || 0,
          partner: null,
          assignedStaff: c.assignedStaffId ? staffMap.get(c.assignedStaffId) || null : null,
          dataSources: dataSourcesMap[c.id] || { gsc: 'connected', ga4: 'connected', gbp: 'connected' },
          missingSources: missingSourcesMap[c.id] || [],
          latestReport: latestReportMap[c.id] || null,
        }))

        if (data?.sort) {
          const sortKey = data.sort
          const isDesc = data.order === 'desc'
          clientList.sort((a, b) => {
            let comp = 0
            if (sortKey === 'name' || sortKey === 'client') {
              comp = (a.businessName || a.name || '').localeCompare(b.businessName || b.name || '')
            } else if (sortKey === 'website') {
              comp = (a.websiteUrl || '').localeCompare(b.websiteUrl || '')
            } else if (sortKey === 'reports') {
              comp = a.reportCount - b.reportCount
            } else if (sortKey === 'last_report' || sortKey === 'lastReport') {
              const timeA = a.latestReport ? new Date(a.latestReport.periodStart).getTime() : 0
              const timeB = b.latestReport ? new Date(b.latestReport.periodStart).getTime() : 0
              comp = timeA - timeB
            } else if (sortKey === 'access') {
              comp = (a.missingSources?.length || 0) - (b.missingSources?.length || 0)
            }
            return isDesc ? -comp : comp
          })
        }

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
      const locCountMap: Record<string, number> = {}
      const latestReportMap: Record<string, { id: string; periodStart: Date; periodEnd: Date; reportMonth: string; createdAt: Date }> = {}

      if (clientIds.length > 0) {
        const matchingReports = await db
          .select({
            id: reports.id,
            clientId: reports.clientId,
            periodStart: reports.periodStart,
            periodEnd: reports.periodEnd,
            reportMonth: reports.reportMonth,
            createdAt: reports.createdAt,
          })
          .from(reports)
          .where(inArray(reports.clientId, clientIds))
          .orderBy(desc(reports.periodStart), desc(reports.createdAt))

        for (const r of matchingReports) {
          if (r.clientId) {
            if (!latestReportMap[r.clientId]) {
              latestReportMap[r.clientId] = {
                id: r.id,
                periodStart: r.periodStart,
                periodEnd: r.periodEnd,
                reportMonth: r.reportMonth,
                createdAt: r.createdAt,
              }
            }
            countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
          }
        }

        const matchingLocs = await db
          .select({ clientId: clientLocations.clientId })
          .from(clientLocations)
          .where(and(inArray(clientLocations.clientId, clientIds), eq(clientLocations.isActive, true)))
        for (const l of matchingLocs) {
          if (l.clientId) {
            locCountMap[l.clientId] = (locCountMap[l.clientId] || 0) + 1
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

      const partnerMap = new Map(partnerUsers.map((p) => [p.id, p]))

      const { dataSourcesMap, missingSourcesMap } = await buildDataSourcesMaps(clientIds)

      // Fetch assigned staff members for superadmin view
      const allStaffIds = allClients.map((c) => c.assignedStaffId).filter(Boolean) as string[]
      const allStaffUsers = allStaffIds.length > 0
        ? await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              avatarUrl: users.avatarUrl,
            })
            .from(users)
            .where(inArray(users.id, allStaffIds))
        : []
      const allStaffMap = new Map(allStaffUsers.map((u) => [u.id, u]))

      const clientList: ClientWithReportCount[] = allClients.map((c) => {
        const partner = c.partnerId ? partnerMap.get(c.partnerId) || null : null
        return {
          ...c,
          reportCount: countMap[c.id] || 0,
          locationCount: locCountMap[c.id] || 0,
          partner: partner
            ? {
                id: partner.id,
                name: partner.name,
                email: partner.email,
              }
            : null,
          assignedStaff: c.assignedStaffId ? allStaffMap.get(c.assignedStaffId) || null : null,
          dataSources: dataSourcesMap[c.id] || { gsc: 'connected', ga4: 'connected', gbp: 'connected' },
          missingSources: missingSourcesMap[c.id] || [],
          latestReport: latestReportMap[c.id] || null,
        }
      })

      if (data?.sort) {
        const sortKey = data.sort
        const isDesc = data.order === 'desc'
        clientList.sort((a, b) => {
          let comp = 0
          if (sortKey === 'name' || sortKey === 'client') {
            comp = (a.businessName || a.name || '').localeCompare(b.businessName || b.name || '')
          } else if (sortKey === 'website') {
            comp = (a.websiteUrl || '').localeCompare(b.websiteUrl || '')
          } else if (sortKey === 'reports') {
            comp = a.reportCount - b.reportCount
          } else if (sortKey === 'last_report' || sortKey === 'lastReport') {
            const timeA = a.latestReport ? new Date(a.latestReport.periodStart).getTime() : 0
            const timeB = b.latestReport ? new Date(b.latestReport.periodStart).getTime() : 0
            comp = timeA - timeB
          } else if (sortKey === 'access') {
            comp = (a.missingSources?.length || 0) - (b.missingSources?.length || 0)
          } else if (sortKey === 'agency') {
            comp = (a.partner?.name || a.partner?.email || '').localeCompare(b.partner?.name || b.partner?.email || '')
          }
          return isDesc ? -comp : comp
        })
      }

      return {
        clients: clientList,
        partners: partnerUsers,
      }
    }
  )

/**
 * Server Function: Get a single client by ID with their reports and data sources
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

    const rawDataSources = await db
      .select()
      .from(clientDataSources)
      .where(eq(clientDataSources.clientId, data.id))

    // Ensure all 3 sources exist in dataSources map
    const dataSources: Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus> = {
      gsc: 'connected',
      ga4: 'connected',
      gbp: 'connected',
    }
    for (const r of rawDataSources) {
      if (['gsc', 'ga4', 'gbp'].includes(r.source)) {
        dataSources[r.source as 'gsc' | 'ga4' | 'gbp'] = r.status as DataSourceStatus
      }
    }

    let assignedStaff = null
    if (client.assignedStaffId) {
      const [staffUser] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(eq(users.id, client.assignedStaffId))
      assignedStaff = staffUser || null
    }

    return {
      client: { ...client, assignedStaff },
      reports: clientReports,
      dataSources,
      rawDataSources,
      locations: [],
    }
  })

/**
 * Server Function: Get full data source records with notes for a client
 */
export const getClientDataSourcesServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client accounts cannot view data source configuration')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [targetClient] = await db
      .select()
      .from(clients)
      .where(
        effectivePartnerId
          ? and(eq(clients.id, data.clientId.trim()), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt))
          : and(eq(clients.id, data.clientId.trim()), isNull(clients.deletedAt))
      )
    if (!targetClient) {
      throw new Error(effectivePartnerId ? 'Unauthorized: Client does not belong to your partner account' : 'Client not found')
    }

    const rows = await db
      .select()
      .from(clientDataSources)
      .where(eq(clientDataSources.clientId, targetClient.id))

    const sourcesMap: Record<string, ClientDataSource> = {}
    for (const r of rows) {
      sourcesMap[r.source] = r
    }

    const standardSources: Array<'gsc' | 'ga4' | 'gbp'> = ['gsc', 'ga4', 'gbp']
    const result: ClientDataSource[] = []

    for (const s of standardSources) {
      if (sourcesMap[s]) {
        result.push(sourcesMap[s])
      } else {
        const now = new Date()
        const [inserted] = await db
          .insert(clientDataSources)
          .values({
            clientId: targetClient.id,
            source: s,
            status: 'connected',
            notes: null,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoNothing()
          .returning()
        if (inserted) {
          result.push(inserted)
        } else {
          const [existing] = await db
            .select()
            .from(clientDataSources)
            .where(and(eq(clientDataSources.clientId, targetClient.id), eq(clientDataSources.source, s)))
          if (existing) result.push(existing)
        }
      }
    }

    return { dataSources: result }
  })

/**
 * Server Function: Update data source status & notes for a client
 * Staff (partner_employee), partners, and superadmins are allowed.
 */
export const updateClientDataSourceServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      source: 'gsc' | 'ga4' | 'gbp'
      status: 'connected' | 'no_access' | 'not_applicable'
      notes?: string | null
    }) => {
      if (!data.clientId) throw new Error('Client ID is required')
      if (!['gsc', 'ga4', 'gbp'].includes(data.source)) throw new Error('Invalid data source')
      if (!['connected', 'no_access', 'not_applicable'].includes(data.status)) throw new Error('Invalid status')
      return data
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Staff or admin access required')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [targetClient] = await db
      .select()
      .from(clients)
      .where(
        effectivePartnerId
          ? and(eq(clients.id, data.clientId.trim()), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt))
          : and(eq(clients.id, data.clientId.trim()), isNull(clients.deletedAt))
      )
    if (!targetClient) {
      throw new Error(effectivePartnerId ? 'Unauthorized: Client does not belong to your partner account' : 'Client not found')
    }

    const now = new Date()
    const [upserted] = await db
      .insert(clientDataSources)
      .values({
        clientId: targetClient.id,
        source: data.source,
        status: data.status,
        notes: data.notes?.trim() || null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [clientDataSources.clientId, clientDataSources.source],
        set: {
          status: data.status,
          notes: data.notes?.trim() || null,
          updatedAt: now,
        },
      })
      .returning()

    await logActivity({
      userId: auth.userId || null,
      userEmail: auth.email || null,
      role: auth.role,
      action: 'update_client_data_source',
    })

    return { success: true, dataSource: upserted }
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
      logoBgColor?: string
      primaryColor?: string
      secondaryColor?: string
      isWhiteLabel?: boolean
      partnerName?: string
      partnerLogoUrl?: string
      partnerLogoBgColor?: string
      partnerId?: string | null
      assignedStaffId?: string | null
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
        logoBgColor: data.logoBgColor?.trim() || '#ffffff',
        primaryColor: data.primaryColor?.trim() || '#2563eb',
        secondaryColor: data.secondaryColor?.trim() || '#1e293b',
        isWhiteLabel: !!data.isWhiteLabel,
        partnerName: data.partnerName?.trim() || null,
        partnerLogoUrl: data.partnerLogoUrl?.trim() || null,
        partnerLogoBgColor: data.partnerLogoBgColor?.trim() || '#ffffff',
        partnerId: assignedPartnerId,
        assignedStaffId: data.assignedStaffId && data.assignedStaffId.trim() ? data.assignedStaffId.trim() : null,
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
      logoBgColor?: string
      primaryColor?: string
      secondaryColor?: string
      isWhiteLabel?: boolean
      partnerName?: string
      partnerLogoUrl?: string
      partnerLogoBgColor?: string
      partnerId?: string | null
      assignedStaffId?: string | null
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
      logoBgColor: data.logoBgColor?.trim() || '#ffffff',
      primaryColor: data.primaryColor?.trim() || '#2563eb',
      secondaryColor: data.secondaryColor?.trim() || '#1e293b',
      isWhiteLabel: !!data.isWhiteLabel,
      partnerName: data.partnerName?.trim() || null,
      partnerLogoUrl: data.partnerLogoUrl?.trim() || null,
      partnerLogoBgColor: data.partnerLogoBgColor?.trim() || '#ffffff',
    }

    if (data.assignedStaffId !== undefined) {
      updateFields.assignedStaffId = data.assignedStaffId && data.assignedStaffId.trim() ? data.assignedStaffId.trim() : null
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

/**
 * Server Function: Get all locations for a client
 */
export const getClientLocationsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }): Promise<{ locations: ClientLocation[] }> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client' && auth.clientId !== data.clientId) {
      throw new Error('Unauthorized access to client locations')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [targetClient] = await db
      .select()
      .from(clients)
      .where(
        effectivePartnerId
          ? and(eq(clients.id, data.clientId.trim()), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt))
          : and(eq(clients.id, data.clientId.trim()), isNull(clients.deletedAt))
      )
    if (!targetClient) {
      throw new Error('Client not found')
    }

    const locs = await db
      .select()
      .from(clientLocations)
      .where(eq(clientLocations.clientId, targetClient.id))
      .orderBy(clientLocations.name)

    return { locations: locs }
  })

/**
 * Server Function: Create a location for a client (Staff and above)
 */
export const createClientLocationServerFn = createServerFn({ method: 'POST' })
  .validator((data: {
    clientId: string
    name: string
    address?: string
    gbpPlaceId?: string
    accessStatus?: 'connected' | 'no_access' | 'not_applicable'
    accessNotes?: string
    isActive?: boolean
  }) => {
    if (!data.clientId?.trim()) throw new Error('Client ID is required')
    if (!data.name?.trim()) throw new Error('Location name is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Staff or partner role required')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [targetClient] = await db
      .select()
      .from(clients)
      .where(
        effectivePartnerId
          ? and(eq(clients.id, data.clientId.trim()), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt))
          : and(eq(clients.id, data.clientId.trim()), isNull(clients.deletedAt))
      )
    if (!targetClient) throw new Error('Client not found')

    const now = new Date()
    const [created] = await db
      .insert(clientLocations)
      .values({
        clientId: targetClient.id,
        name: data.name.trim(),
        address: data.address?.trim() || null,
        gbpPlaceId: data.gbpPlaceId?.trim() || null,
        accessStatus: data.accessStatus || 'connected',
        accessNotes: data.accessNotes?.trim() || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    await logActivity({
      userId: auth.userId || null,
      userEmail: auth.email || null,
      role: auth.role,
      action: 'create_client_location',
    })

    return { success: true, location: created }
  })

/**
 * Server Function: Update a client location (Staff and above)
 */
export const updateClientLocationServerFn = createServerFn({ method: 'POST' })
  .validator((data: {
    id: string
    name?: string
    address?: string | null
    gbpPlaceId?: string | null
    accessStatus?: 'connected' | 'no_access' | 'not_applicable'
    accessNotes?: string | null
    isActive?: boolean
  }) => {
    if (!data.id?.trim()) throw new Error('Location ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Staff or partner role required')
    }

    const [existing] = await db
      .select()
      .from(clientLocations)
      .where(eq(clientLocations.id, data.id.trim()))
    if (!existing) throw new Error('Location not found')

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, existing.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: Location belongs to another agency client')
      }
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    }
    if (data.name !== undefined) {
      if (!data.name.trim()) throw new Error('Location name cannot be empty')
      updateFields.name = data.name.trim()
    }
    if (data.address !== undefined) updateFields.address = data.address?.trim() || null
    if (data.gbpPlaceId !== undefined) updateFields.gbpPlaceId = data.gbpPlaceId?.trim() || null
    if (data.accessStatus !== undefined) updateFields.accessStatus = data.accessStatus
    if (data.accessNotes !== undefined) updateFields.accessNotes = data.accessNotes?.trim() || null
    if (data.isActive !== undefined) updateFields.isActive = data.isActive

    const [updated] = await db
      .update(clientLocations)
      .set(updateFields)
      .where(eq(clientLocations.id, existing.id))
      .returning()

    return { success: true, location: updated }
  })

/**
 * Server Function: Delete / deactivate a location
 */
export const deleteClientLocationServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id?.trim()) throw new Error('Location ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Staff or partner role required')
    }

    const [existing] = await db
      .select()
      .from(clientLocations)
      .where(eq(clientLocations.id, data.id.trim()))
    if (!existing) throw new Error('Location not found')

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, existing.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: Location belongs to another agency client')
      }
    }

    // Delete any child monthly location metrics first, then delete the location permanently
    await db.delete(locationMonthlyMetrics).where(eq(locationMonthlyMetrics.locationId, existing.id))
    await db.delete(clientLocations).where(eq(clientLocations.id, existing.id))

    return { success: true }
  })



/**
 * Server Function: Assign or reassign a staff member to a client
 */
export const assignClientStaffServerFn = createServerFn({ method: 'POST' })
  .validator((data: { clientId: string; staffId: string | null }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client' || auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Only agency owners and superadmins can assign staff to clients')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [existing] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, data.clientId), isNull(clients.deletedAt)))

    if (!existing) throw new Error('Client not found')

    if (effectivePartnerId && existing.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: Client does not belong to your agency')
    }

    const [updated] = await db
      .update(clients)
      .set({
        assignedStaffId: data.staffId && data.staffId.trim() ? data.staffId.trim() : null,
      })
      .where(eq(clients.id, data.clientId))
      .returning()

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'assign_client_staff',
    })

    return { success: true, client: updated }
  })
