import { createServerFn } from '@tanstack/react-start'
import { desc, asc, eq, and, or, inArray, isNull, isNotNull, sql } from 'drizzle-orm'
import {
  db,
  clients,
  users,
  reports,
  monthlyMetrics,
  locationMonthlyMetrics,
  clientLocations,
  clientDataSources,
  landingPages,
  clientArticles,
  tasks,
  citations,
  type MonthlyMetric,
  type LocationMonthlyMetric,
  type ClientLocation,
} from '../db'
import { assertActiveSession, getEffectivePartnerId, type ActiveSession } from './auth'
import { recordMonthlyMetrics, type MonthlyMetricsInput, type LocationMonthlyMetricsInput } from './metrics'

export type DataSourceStatus = 'connected' | 'no_access' | 'not_applicable'

export interface KpiGridLocationRow {
  locationId: string
  locationName: string
  address: string | null
  accessStatus: DataSourceStatus
  gbpCalls: number | null
  gbpViews: number | null
  gbpDirections: number | null
  gbpWebsiteClicks: number | null
  gbpRating: number | null
  gbpReviewsCount: number | null
}

export interface KpiGridClientRow {
  clientId: string
  clientName: string
  businessName: string
  websiteUrl: string | null
  partnerId: string | null
  partnerName: string | null
  dataSources: Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus>
  metrics: {
    gscClicks: number | null
    gscImpressions: number | null
    gscCtr: number | null
    gscPosition: number | null
    gaSessions: number | null
    gaUsers: number | null
    gaNewUsers: number | null
    gaViews: number | null
    gaEngagementRate: number | null
    gbpCalls: number | null
    gbpViews: number | null
    gbpDirections: number | null
    gbpWebsiteClicks: number | null
    gbpRating: number | null
    gbpReviewsCount: number | null
    semrushAuthorityScore: number | null
    semrushRankedKeywords: number | null
  }
  isSaved: boolean
  hasMetrics: boolean
  updatedAt: Date | null
  locations: KpiGridLocationRow[]
}

/**
 * 1. Get Monthly KPI Grid data for all scoped clients for a selected month & year
 */
export const getMonthlyKpiGridServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data: {
      month: number
      year: number
      partnerId?: string
    }) => {
      const month = Number(data.month) || new Date().getMonth() + 1
      const year = Number(data.year) || new Date().getFullYear()
      return {
        month: Math.min(Math.max(month, 1), 12),
        year: Math.min(Math.max(year, 2000), 2100),
        partnerId: data.partnerId,
      }
    }
  )
  .handler(async ({ data }): Promise<{ month: number; year: number; rows: KpiGridClientRow[] }> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot access KPI grid')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const effectivePartnerId = isSuperadmin && data.partnerId ? data.partnerId : getEffectivePartnerId(auth)

    // 1. Fetch scoped active clients
    const clientConditions = [isNull(clients.deletedAt)]
    if (effectivePartnerId && effectivePartnerId !== 'all') {
      if (effectivePartnerId === 'unassigned') {
        clientConditions.push(isNull(clients.partnerId))
      } else {
        clientConditions.push(eq(clients.partnerId, effectivePartnerId))
      }
    }

    const clientList = await db
      .select({
        id: clients.id,
        name: clients.name,
        businessName: clients.businessName,
        websiteUrl: clients.websiteUrl,
        partnerId: clients.partnerId,
        partnerName: users.name,
      })
      .from(clients)
      .leftJoin(users, eq(clients.partnerId, users.id))
      .where(and(...clientConditions))
      .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

    const clientIds = clientList.map((c) => c.id)
    if (clientIds.length === 0) {
      return { month: data.month, year: data.year, rows: [] }
    }

    // 2. Fetch data sources for these clients
    const dsRows = await db
      .select()
      .from(clientDataSources)
      .where(inArray(clientDataSources.clientId, clientIds))

    const dsMap: Record<string, Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus>> = {}
    for (const id of clientIds) {
      dsMap[id] = { gsc: 'connected', ga4: 'connected', gbp: 'connected' }
    }
    for (const r of dsRows) {
      if (dsMap[r.clientId] && (r.source === 'gsc' || r.source === 'ga4' || r.source === 'gbp')) {
        dsMap[r.clientId][r.source] = r.status as DataSourceStatus
      }
    }

    // 3. Fetch monthly metrics for this month & year
    const metricsRows = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          inArray(monthlyMetrics.clientId, clientIds),
          eq(monthlyMetrics.month, data.month),
          eq(monthlyMetrics.year, data.year)
        )
      )

    const metricsMap = new Map<string, MonthlyMetric>()
    for (const m of metricsRows) {
      metricsMap.set(m.clientId, m)
    }

    // 4. Fetch active locations for these clients
    const locationsRows = await db
      .select()
      .from(clientLocations)
      .where(and(inArray(clientLocations.clientId, clientIds), eq(clientLocations.isActive, true)))
      .orderBy(sql`lower(${clientLocations.name}) asc`)

    const locIds = locationsRows.map((l) => l.id)
    let locMetricsRows: LocationMonthlyMetric[] = []
    if (locIds.length > 0) {
      locMetricsRows = await db
        .select()
        .from(locationMonthlyMetrics)
        .where(
          and(
            inArray(locationMonthlyMetrics.locationId, locIds),
            eq(locationMonthlyMetrics.month, data.month),
            eq(locationMonthlyMetrics.year, data.year)
          )
        )
    }

    const locMetricsMap = new Map<string, LocationMonthlyMetric>()
    for (const lm of locMetricsRows) {
      locMetricsMap.set(lm.locationId, lm)
    }

    const clientLocationsMap = new Map<string, KpiGridLocationRow[]>()
    for (const loc of locationsRows) {
      const lm = locMetricsMap.get(loc.id)
      const locRow: KpiGridLocationRow = {
        locationId: loc.id,
        locationName: loc.name,
        address: loc.address,
        accessStatus: (loc.accessStatus as DataSourceStatus) || 'connected',
        gbpCalls: lm?.gbpCalls ?? null,
        gbpViews: lm?.gbpViews ?? null,
        gbpDirections: lm?.gbpDirections ?? null,
        gbpWebsiteClicks: lm?.gbpWebsiteClicks ?? null,
        gbpRating: lm?.gbpRating ? Number(lm.gbpRating) : null,
        gbpReviewsCount: lm?.gbpReviewsCount ?? null,
      }

      const existing = clientLocationsMap.get(loc.clientId) || []
      existing.push(locRow)
      clientLocationsMap.set(loc.clientId, existing)
    }

    // 5. Construct final grid rows
    const rows: KpiGridClientRow[] = clientList.map((c) => {
      const m = metricsMap.get(c.id)
      const locs = clientLocationsMap.get(c.id) || []
      const hasMetrics = Boolean(
        m &&
          (m.gscClicks !== null ||
            m.gscImpressions !== null ||
            m.gaSessions !== null ||
            m.gaUsers !== null ||
            m.gbpCalls !== null ||
            m.gbpViews !== null)
      )

      return {
        clientId: c.id,
        clientName: c.name,
        businessName: c.businessName || c.name,
        websiteUrl: c.websiteUrl,
        partnerId: c.partnerId,
        partnerName: c.partnerName,
        dataSources: dsMap[c.id] || { gsc: 'connected', ga4: 'connected', gbp: 'connected' },
        metrics: {
          gscClicks: m?.gscClicks ?? null,
          gscImpressions: m?.gscImpressions ?? null,
          gscCtr: m?.gscCtr ? Number(m.gscCtr) : null,
          gscPosition: m?.gscPosition ? Number(m.gscPosition) : null,
          gaSessions: m?.gaSessions ?? null,
          gaUsers: m?.gaUsers ?? null,
          gaNewUsers: m?.gaNewUsers ?? null,
          gaViews: m?.gaViews ?? null,
          gaEngagementRate: m?.gaEngagementRate ? Number(m.gaEngagementRate) : null,
          gbpCalls: m?.gbpCalls ?? null,
          gbpViews: m?.gbpViews ?? null,
          gbpDirections: m?.gbpDirections ?? null,
          gbpWebsiteClicks: m?.gbpWebsiteClicks ?? null,
          gbpRating: m?.gbpRating ? Number(m.gbpRating) : null,
          gbpReviewsCount: m?.gbpReviewsCount ?? null,
          semrushAuthorityScore: m?.semrushAuthorityScore ?? null,
          semrushRankedKeywords: m?.semrushRankedKeywords ?? null,
        },
        isSaved: Boolean(m),
        hasMetrics,
        updatedAt: m?.updatedAt ? new Date(m.updatedAt) : null,
        locations: locs,
      }
    })

    return {
      month: data.month,
      year: data.year,
      rows,
    }
  })

/**
 * 2. Save a single client row's monthly KPIs via the canonical recordMonthlyMetrics gateway
 */
export const saveMonthlyKpiRowServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      month: number
      year: number
      metrics: MonthlyMetricsInput
    }) => {
      if (!data.clientId) throw new Error('Client ID is required')
      const month = Number(data.month)
      const year = Number(data.year)
      if (month < 1 || month > 12) throw new Error('Invalid month')
      if (year < 2000 || year > 2100) throw new Error('Invalid year')
      return {
        clientId: data.clientId,
        month,
        year,
        metrics: data.metrics || {},
      }
    }
  )
  .handler(async ({ data }): Promise<{ success: boolean; metric: MonthlyMetric }> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot edit KPIs')
    }

    const metric = await recordMonthlyMetrics({
      clientId: data.clientId,
      month: data.month,
      year: data.year,
      metrics: data.metrics,
      auth,
    })

    return { success: true, metric }
  })

export interface ReportsDueRow {
  clientId: string
  clientName: string
  businessName: string
  websiteUrl: string | null
  partnerId: string | null
  partnerName: string | null
  metricsComplete: boolean
  metricsSummary: {
    gsc: boolean
    ga4: boolean
    gbp: boolean
    missingSources: string[]
  }
  reportGenerated: boolean
  reportId: string | null
  version: number | null
  reportCreatedAt: Date | null
  isShared: boolean
  shareToken: string | null
}

/**
 * 3. Get Reports Due for a selected month & year (sorted by "Not Generated" first)
 */
export const getReportsDueServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data: {
      month: number
      year: number
      partnerId?: string
      sort?: string
      order?: 'asc' | 'desc'
    }) => {
      const month = Number(data.month) || new Date().getMonth() + 1
      const year = Number(data.year) || new Date().getFullYear()
      return {
        month: Math.min(Math.max(month, 1), 12),
        year: Math.min(Math.max(year, 2000), 2100),
        partnerId: data.partnerId,
        sort: data.sort,
        order: data.order,
      }
    }
  )
  .handler(async ({ data }): Promise<{ month: number; year: number; rows: ReportsDueRow[] }> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot access reports due')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const effectivePartnerId = isSuperadmin && data.partnerId ? data.partnerId : getEffectivePartnerId(auth)

    // 1. Fetch active clients
    const clientConditions = [isNull(clients.deletedAt)]
    if (effectivePartnerId && effectivePartnerId !== 'all') {
      if (effectivePartnerId === 'unassigned') {
        clientConditions.push(isNull(clients.partnerId))
      } else {
        clientConditions.push(eq(clients.partnerId, effectivePartnerId))
      }
    }

    const clientList = await db
      .select({
        id: clients.id,
        name: clients.name,
        businessName: clients.businessName,
        websiteUrl: clients.websiteUrl,
        partnerId: clients.partnerId,
        partnerName: users.name,
      })
      .from(clients)
      .leftJoin(users, eq(clients.partnerId, users.id))
      .where(and(...clientConditions))
      .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

    const clientIds = clientList.map((c) => c.id)
    if (clientIds.length === 0) {
      return { month: data.month, year: data.year, rows: [] }
    }

    // 2. Fetch data source configurations
    const dsRows = await db
      .select()
      .from(clientDataSources)
      .where(inArray(clientDataSources.clientId, clientIds))

    const dsMap: Record<string, Record<'gsc' | 'ga4' | 'gbp', DataSourceStatus>> = {}
    for (const id of clientIds) {
      dsMap[id] = { gsc: 'connected', ga4: 'connected', gbp: 'connected' }
    }
    for (const r of dsRows) {
      if (dsMap[r.clientId] && (r.source === 'gsc' || r.source === 'ga4' || r.source === 'gbp')) {
        dsMap[r.clientId][r.source] = r.status as DataSourceStatus
      }
    }

    // 3. Fetch monthly metrics for this month & year
    const metricsRows = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          inArray(monthlyMetrics.clientId, clientIds),
          eq(monthlyMetrics.month, data.month),
          eq(monthlyMetrics.year, data.year)
        )
      )

    const metricsMap = new Map<string, MonthlyMetric>()
    for (const m of metricsRows) {
      metricsMap.set(m.clientId, m)
    }

    // 4. Fetch reports generated for this month & year period
    const periodStart = new Date(Date.UTC(data.year, data.month - 1, 1, 0, 0, 0, 0))
    const periodEnd = new Date(Date.UTC(data.year, data.month, 1, 0, 0, 0, 0))

    const reportRows = await db
      .select({
        id: reports.id,
        clientId: reports.clientId,
        version: reports.version,
        shareToken: reports.shareToken,
        createdAt: reports.createdAt,
        periodStart: reports.periodStart,
      })
      .from(reports)
      .where(
        and(
          inArray(reports.clientId, clientIds),
          sql`${reports.periodStart} >= ${periodStart.toISOString()}::timestamptz`,
          sql`${reports.periodStart} < ${periodEnd.toISOString()}::timestamptz`
        )
      )
      .orderBy(desc(reports.version), desc(reports.createdAt))

    // Map latest report per client
    const latestReportMap = new Map<string, (typeof reportRows)[0]>()
    for (const r of reportRows) {
      if (r.clientId && !latestReportMap.has(r.clientId)) {
        latestReportMap.set(r.clientId, r)
      }
    }

    // 5. Build Reports Due rows
    const rows: ReportsDueRow[] = clientList.map((c) => {
      const m = metricsMap.get(c.id)
      const r = latestReportMap.get(c.id)
      const ds = dsMap[c.id] || { gsc: 'connected', ga4: 'connected', gbp: 'connected' }

      const hasGsc = ds.gsc === 'no_access' || (m?.gscClicks !== null && m?.gscClicks !== undefined)
      const hasGa4 = ds.ga4 === 'no_access' || (m?.gaSessions !== null && m?.gaSessions !== undefined)
      const hasGbp = ds.gbp === 'no_access' || (m?.gbpCalls !== null && m?.gbpCalls !== undefined)

      const missingSources: string[] = []
      if (ds.gsc === 'connected' && (m?.gscClicks === null || m?.gscClicks === undefined)) {
        missingSources.push('GSC')
      }
      if (ds.ga4 === 'connected' && (m?.gaSessions === null || m?.gaSessions === undefined)) {
        missingSources.push('GA4')
      }
      if (ds.gbp === 'connected' && (m?.gbpCalls === null || m?.gbpCalls === undefined)) {
        missingSources.push('GBP')
      }

      const metricsComplete = Boolean(m && hasGsc && hasGa4 && hasGbp)

      return {
        clientId: c.id,
        clientName: c.name,
        businessName: c.businessName || c.name,
        websiteUrl: c.websiteUrl,
        partnerId: c.partnerId,
        partnerName: c.partnerName,
        metricsComplete,
        metricsSummary: {
          gsc: hasGsc,
          ga4: hasGa4,
          gbp: hasGbp,
          missingSources,
        },
        reportGenerated: Boolean(r),
        reportId: r ? r.id : null,
        version: r ? r.version : null,
        reportCreatedAt: r?.createdAt ? new Date(r.createdAt) : null,
        isShared: Boolean(r?.shareToken),
        shareToken: r?.shareToken || null,
      }
    })

    // Sort by "Not Generated" first, then by complete metrics, then client name
    rows.sort((a, b) => {
      if (a.reportGenerated !== b.reportGenerated) {
        return a.reportGenerated ? 1 : -1 // Not generated first
      }
      if (a.metricsComplete !== b.metricsComplete) {
        return a.metricsComplete ? -1 : 1 // Complete metrics first so user can click Generate
      }
      return a.businessName.localeCompare(b.businessName)
    })

    return {
      month: data.month,
      year: data.year,
      rows,
    }
  })

export type QueueItemType = 'landing_page' | 'client_article' | 'task' | 'citation'

export interface PublishingQueueItem {
  id: string
  type: QueueItemType
  title: string
  status: string
  stageLabel: string
  clientId: string
  clientName: string
  businessName: string
  targetUrl: string | null
  draftUrl: string | null
  assigneeName: string | null
  assigneeEmail: string | null
  updatedAt: Date
  createdAt: Date
}

/**
 * 4. Get Publishing Queue items across all deliverable types (review & approved items)
 */
export const getPublishingQueueServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { partnerId?: string; type?: string }) => data || {})
  .handler(async ({ data }): Promise<PublishingQueueItem[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot access publishing queue')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const effectivePartnerId = isSuperadmin && data?.partnerId ? data.partnerId : getEffectivePartnerId(auth)

    // Base client scoping condition
    const clientFilter = [isNull(clients.deletedAt)]
    if (effectivePartnerId && effectivePartnerId !== 'all') {
      if (effectivePartnerId === 'unassigned') {
        clientFilter.push(isNull(clients.partnerId))
      } else {
        clientFilter.push(eq(clients.partnerId, effectivePartnerId))
      }
    }

    const items: PublishingQueueItem[] = []

    // A. Landing Pages in 'client_review' or 'design'
    if (!data?.type || data.type === 'all' || data.type === 'landing_pages') {
      const lps = await db
        .select({
          id: landingPages.id,
          title: landingPages.title,
          status: landingPages.status,
          clientId: landingPages.clientId,
          targetUrl: landingPages.targetUrl,
          draftUrl: landingPages.draftUrl,
          updatedAt: landingPages.updatedAt,
          createdAt: landingPages.createdAt,
          clientName: clients.name,
          clientBusinessName: clients.businessName,
          assigneeName: users.name,
          assigneeEmail: users.email,
        })
        .from(landingPages)
        .innerJoin(clients, eq(landingPages.clientId, clients.id))
        .leftJoin(users, eq(landingPages.assignedTo, users.id))
        .where(
          and(
            ...clientFilter,
            or(eq(landingPages.status, 'client_review'), eq(landingPages.status, 'design'))
          )
        )

      for (const lp of lps) {
        items.push({
          id: lp.id,
          type: 'landing_page',
          title: lp.title,
          status: lp.status,
          stageLabel: lp.status === 'client_review' ? 'Client Review' : 'Design Ready',
          clientId: lp.clientId,
          clientName: lp.clientName,
          businessName: lp.clientBusinessName || lp.clientName,
          targetUrl: lp.targetUrl,
          draftUrl: lp.draftUrl,
          assigneeName: lp.assigneeName,
          assigneeEmail: lp.assigneeEmail,
          updatedAt: new Date(lp.updatedAt),
          createdAt: new Date(lp.createdAt),
        })
      }
    }

    // B. Client Articles in 'review' or 'approved'
    if (!data?.type || data.type === 'all' || data.type === 'articles') {
      const arts = await db
        .select({
          id: clientArticles.id,
          title: clientArticles.title,
          status: clientArticles.status,
          clientId: clientArticles.clientId,
          liveUrl: clientArticles.liveUrl,
          draftUrl: clientArticles.draftUrl,
          updatedAt: clientArticles.updatedAt,
          createdAt: clientArticles.createdAt,
          clientName: clients.name,
          clientBusinessName: clients.businessName,
          assigneeName: users.name,
          assigneeEmail: users.email,
        })
        .from(clientArticles)
        .innerJoin(clients, eq(clientArticles.clientId, clients.id))
        .leftJoin(users, eq(clientArticles.writerId, users.id))
        .where(
          and(
            ...clientFilter,
            or(eq(clientArticles.status, 'review'), eq(clientArticles.status, 'approved'))
          )
        )

      for (const a of arts) {
        items.push({
          id: a.id,
          type: 'client_article',
          title: a.title,
          status: a.status,
          stageLabel: a.status === 'approved' ? 'Approved (Ready to Publish)' : 'In Review',
          clientId: a.clientId,
          clientName: a.clientName,
          businessName: a.clientBusinessName || a.clientName,
          targetUrl: a.liveUrl,
          draftUrl: a.draftUrl,
          assigneeName: a.assigneeName,
          assigneeEmail: a.assigneeEmail,
          updatedAt: new Date(a.updatedAt),
          createdAt: new Date(a.createdAt),
        })
      }
    }

    // C. Tasks in 'todo'
    if (!data?.type || data.type === 'all' || data.type === 'tasks') {
      const taskRows = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
          clientId: tasks.clientId,
          updatedAt: tasks.updatedAt,
          createdAt: tasks.createdAt,
          clientName: clients.name,
          clientBusinessName: clients.businessName,
          assigneeName: users.name,
          assigneeEmail: users.email,
        })
        .from(tasks)
        .leftJoin(clients, eq(tasks.clientId, clients.id))
        .leftJoin(users, eq(tasks.assignedTo, users.id))
        .where(
          and(
            eq(tasks.status, 'todo'),
            effectivePartnerId && effectivePartnerId !== 'all'
              ? or(
                  eq(tasks.partnerId, effectivePartnerId),
                  and(isNotNull(tasks.clientId), ...clientFilter)
                )
              : undefined
          )
        )

      for (const t of taskRows) {
        items.push({
          id: t.id,
          type: 'task',
          title: t.title,
          status: t.status,
          stageLabel: 'Task Incomplete',
          clientId: t.clientId || '',
          clientName: t.clientName || 'Internal Agency',
          businessName: t.clientBusinessName || t.clientName || 'Internal Task',
          targetUrl: null,
          draftUrl: null,
          assigneeName: t.assigneeName,
          assigneeEmail: t.assigneeEmail,
          updatedAt: new Date(t.updatedAt),
          createdAt: new Date(t.createdAt),
        })
      }
    }

    // D. Citations in 'submitted'
    if (!data?.type || data.type === 'all' || data.type === 'citations') {
      const citationRows = await db
        .select({
          id: citations.id,
          directory: citations.directory,
          listingUrl: citations.listingUrl,
          status: citations.status,
          clientId: citations.clientId,
          updatedAt: citations.updatedAt,
          createdAt: citations.createdAt,
          clientName: clients.name,
          clientBusinessName: clients.businessName,
        })
        .from(citations)
        .innerJoin(clients, eq(citations.clientId, clients.id))
        .where(and(...clientFilter, eq(citations.status, 'submitted')))

      for (const c of citationRows) {
        items.push({
          id: c.id,
          type: 'citation',
          title: c.directory,
          status: c.status,
          stageLabel: 'Submitted Verification',
          clientId: c.clientId,
          clientName: c.clientName,
          businessName: c.clientBusinessName || c.clientName,
          targetUrl: c.listingUrl,
          draftUrl: null,
          assigneeName: null,
          assigneeEmail: null,
          updatedAt: new Date(c.updatedAt),
          createdAt: new Date(c.createdAt),
        })
      }
    }

    // Sort queue items newest updated first
    items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    return items
  })

/**
 * 5. Advance status of a publishing queue item directly
 */
export const advancePublishingQueueItemServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      type: QueueItemType
      targetStatus: string
      liveUrl?: string
    }) => {
      if (!data.id) throw new Error('Item ID is required')
      if (!data.type) throw new Error('Item type is required')
      if (!data.targetStatus) throw new Error('Target status is required')
      return data
    }
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot advance publishing items')
    }

    const now = new Date()

    if (data.type === 'landing_page') {
      await db
        .update(landingPages)
        .set({
          status: data.targetStatus as any,
          targetUrl: data.liveUrl || undefined,
          wentLiveAt: data.targetStatus === 'live' ? now : undefined,
          updatedAt: now,
        })
        .where(eq(landingPages.id, data.id))
    } else if (data.type === 'client_article') {
      await db
        .update(clientArticles)
        .set({
          status: data.targetStatus as any,
          publishedAt: data.targetStatus === 'live' ? now : undefined,
          liveUrl: data.liveUrl || undefined,
          updatedAt: now,
        })
        .where(eq(clientArticles.id, data.id))
    } else if (data.type === 'task') {
      await db
        .update(tasks)
        .set({
          status: data.targetStatus as any,
          completedAt: data.targetStatus === 'done' ? now : undefined,
          updatedAt: now,
        })
        .where(eq(tasks.id, data.id))
    } else if (data.type === 'citation') {
      await db
        .update(citations)
        .set({
          status: data.targetStatus as any,
          listingUrl: data.liveUrl || undefined,
          updatedAt: now,
        })
        .where(eq(citations.id, data.id))
    }

    return { success: true }
  })

export interface NavBlockerCounts {
  missingKpiClientsCount: number
  totalClientsCount: number
  ungeneratedReportsCount: number
  generatedReportsCount: number
  reportsRatio: string // e.g. "0/17"
  publishingQueueCount: number
  hasKpiBlocker: boolean
  hasReportBlocker: boolean
}

/**
 * 6. Get navigation blockers and counts for the active month
 */
export const getNavBlockersServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      month?: number
      year?: number
      partnerId?: string
    }) => {
      const now = new Date()
      const month = Number(data?.month) || now.getMonth() + 1
      const year = Number(data?.year) || now.getFullYear()
      return {
        month: Math.min(Math.max(month, 1), 12),
        year: Math.min(Math.max(year, 2000), 2100),
        partnerId: data?.partnerId,
      }
    }
  )
  .handler(async ({ data }): Promise<NavBlockerCounts> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      return {
        missingKpiClientsCount: 0,
        totalClientsCount: 0,
        ungeneratedReportsCount: 0,
        generatedReportsCount: 0,
        reportsRatio: '0/0',
        publishingQueueCount: 0,
        hasKpiBlocker: false,
        hasReportBlocker: false,
      }
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const effectivePartnerId = isSuperadmin && data.partnerId ? data.partnerId : getEffectivePartnerId(auth)

    // Active clients
    const clientFilter = [isNull(clients.deletedAt)]
    if (effectivePartnerId && effectivePartnerId !== 'all') {
      if (effectivePartnerId === 'unassigned') {
        clientFilter.push(isNull(clients.partnerId))
      } else {
        clientFilter.push(eq(clients.partnerId, effectivePartnerId))
      }
    }

    const clientRows = await db
      .select({ id: clients.id })
      .from(clients)
      .where(and(...clientFilter))

    const totalClientsCount = clientRows.length
    if (totalClientsCount === 0) {
      return {
        missingKpiClientsCount: 0,
        totalClientsCount: 0,
        ungeneratedReportsCount: 0,
        generatedReportsCount: 0,
        reportsRatio: '0/0',
        publishingQueueCount: 0,
        hasKpiBlocker: false,
        hasReportBlocker: false,
      }
    }

    const clientIds = clientRows.map((c) => c.id)

    // A. Count monthly metrics entered
    const metricsRows = await db
      .select({ clientId: monthlyMetrics.clientId })
      .from(monthlyMetrics)
      .where(
        and(
          inArray(monthlyMetrics.clientId, clientIds),
          eq(monthlyMetrics.month, data.month),
          eq(monthlyMetrics.year, data.year)
        )
      )

    const enteredClientIds = new Set(metricsRows.map((m) => m.clientId))
    const missingKpiClientsCount = totalClientsCount - enteredClientIds.size
    const hasKpiBlocker = missingKpiClientsCount > 0

    // B. Count generated reports for this month period
    const periodStart = new Date(Date.UTC(data.year, data.month - 1, 1, 0, 0, 0, 0))
    const periodEnd = new Date(Date.UTC(data.year, data.month, 1, 0, 0, 0, 0))

    const reportRows = await db
      .select({ clientId: reports.clientId })
      .from(reports)
      .where(
        and(
          inArray(reports.clientId, clientIds),
          sql`${reports.periodStart} >= ${periodStart.toISOString()}::timestamptz`,
          sql`${reports.periodStart} < ${periodEnd.toISOString()}::timestamptz`
        )
      )

    const reportedClientIds = new Set(reportRows.map((r) => r.clientId).filter(Boolean))
    const generatedReportsCount = reportedClientIds.size
    const ungeneratedReportsCount = Math.max(0, totalClientsCount - generatedReportsCount)
    const hasReportBlocker = ungeneratedReportsCount > 0
    const reportsRatio = `${generatedReportsCount}/${totalClientsCount}`

    // C. Count items in publishing queue
    const [lpCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(landingPages)
      .innerJoin(clients, eq(landingPages.clientId, clients.id))
      .where(
        and(
          ...clientFilter,
          or(eq(landingPages.status, 'client_review'), eq(landingPages.status, 'design'))
        )
      )

    const [artCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(clientArticles)
      .innerJoin(clients, eq(clientArticles.clientId, clients.id))
      .where(
        and(
          ...clientFilter,
          or(eq(clientArticles.status, 'review'), eq(clientArticles.status, 'approved'))
        )
      )

    const publishingQueueCount = (lpCountRes?.count || 0) + (artCountRes?.count || 0)

    return {
      missingKpiClientsCount,
      totalClientsCount,
      ungeneratedReportsCount,
      generatedReportsCount,
      reportsRatio,
      publishingQueueCount,
      hasKpiBlocker,
      hasReportBlocker,
    }
  })
