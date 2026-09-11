import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, sql, inArray } from 'drizzle-orm'
import crypto from 'crypto'
import {
  db,
  clients,
  reports,
  users,
  monthlyMetrics,
  clientDataSources,
  type Report,
  type Client,
  type ClientSnapshot,
  type DeliverablesSnapshot,
} from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'
import { logActivity } from './activity-logger'
import {
  parseReportPeriod,
  parseDecimalValue,
  parseNullableInt,
  parseNullableDecimal,
  collectDeliverablesSnapshot,
} from './reports-helpers'

async function getClientDataSourceMap(clientId: string): Promise<Record<'gsc' | 'ga4' | 'gbp', 'connected' | 'no_access' | 'not_applicable'>> {
  const rows = await db
    .select()
    .from(clientDataSources)
    .where(eq(clientDataSources.clientId, clientId))

  const map: Record<'gsc' | 'ga4' | 'gbp', 'connected' | 'no_access' | 'not_applicable'> = {
    gsc: 'connected',
    ga4: 'connected',
    gbp: 'connected',
  }
  for (const row of rows) {
    if (row.source === 'gsc' || row.source === 'ga4' || row.source === 'gbp') {
      map[row.source] = row.status as any
    }
  }
  return map
}


export interface QueryItem {
  query: string
  clicks: number | string
  impressions: number | string
  position: number | string
}

export interface PageItem {
  path: string
  impressions: number | string
  position: number | string
  clicks?: number | string
  users?: number | string
}

export interface DisplayOptions {
  show_agency_info?: boolean
  show_contact_person?: boolean
  show_date_generated?: boolean
  show_summary?: boolean
  show_tables?: boolean
  show_next_steps?: boolean
}

/**
 * Safely parse integer or decimal strings/numbers (e.g. 2.6, '2.6%', ' 2.6 ') into a clean float
 */

export interface ReportWithClient extends Report {
  clientName: string
  clientBusinessName: string
  clientLogoUrl: string | null
  clientPrimaryColor: string | null
  clientSecondaryColor: string | null
  clientWebsiteUrl: string | null
  clientIsWhiteLabel: boolean
  clientPartnerName: string | null
  clientPartnerLogoUrl: string | null
  creatorName?: string | null
  creatorEmail?: string | null
  creatorNameOrEmail?: string | null
}

/**
 * Server Function: Get all reports with associated client branding info (Admin only)
 */
export const getReportsServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { clientId?: string; partnerId?: string; sort?: string; order?: 'asc' | 'desc' }) => {
    return data || {}
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized access: Admin or Partner role required')
    }

    const conditions = []
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      conditions.push(eq(clients.partnerId, effectivePartnerId))
    } else if (data?.partnerId && (auth.role === 'superadmin' || auth.role === 'admin')) {
      conditions.push(eq(clients.partnerId, data.partnerId))
    }
    if (data?.clientId) {
      conditions.push(eq(reports.clientId, data.clientId))
    }

    let query = db
      .select({
        id: reports.id,
        clientId: reports.clientId,
        title: reports.title,
        reportMonth: reports.reportMonth,
        periodStart: reports.periodStart,
        periodEnd: reports.periodEnd,
        clientSnapshot: reports.clientSnapshot,
        previousReportId: reports.previousReportId,
        // GBP Metrics
        gbpCalls: reports.gbpCalls,
        gbpDirections: reports.gbpDirections,
        gbpViews: reports.gbpViews,
        gbpWebsiteClicks: reports.gbpWebsiteClicks,
        prevGbpCalls: reports.prevGbpCalls,
        prevGbpDirections: reports.prevGbpDirections,
        prevGbpViews: reports.prevGbpViews,
        prevGbpWebsiteClicks: reports.prevGbpWebsiteClicks,
        gbpRating: reports.gbpRating,
        gbpReviewCount: reports.gbpReviewCount,
        gbpReviewsCount: reports.gbpReviewsCount,
        prevGbpReviewsCount: reports.prevGbpReviewsCount,
        // GSC Metrics
        gscClicks: reports.gscClicks,
        gscImpressions: reports.gscImpressions,
        gscCtr: reports.gscCtr,
        gscPosition: reports.gscPosition,
        prevGscClicks: reports.prevGscClicks,
        prevGscImpressions: reports.prevGscImpressions,
        prevGscCtr: reports.prevGscCtr,
        prevGscPosition: reports.prevGscPosition,
        // GA4 Metrics
        gaUsers: reports.gaUsers,
        gaNewUsers: reports.gaNewUsers,
        gaEngagementRate: reports.gaEngagementRate,
        gaSessions: reports.gaSessions,
        gaViews: reports.gaViews,
        prevGaUsers: reports.prevGaUsers,
        prevGaNewUsers: reports.prevGaNewUsers,
        prevGaEngagementRate: reports.prevGaEngagementRate,
        prevGaSessions: reports.prevGaSessions,
        prevGaViews: reports.prevGaViews,
        // Section Display Customizer
        displayOptions: reports.displayOptions,
        // Deep Metric Tables
        topQueries: reports.topQueries,
        topPages: reports.topPages,
        // Narrative Fields
        summaryTitle: reports.summaryTitle,
        summary: reports.summary,
        workCompleted: reports.workCompleted,
        nextSteps: reports.nextSteps,
        version: reports.version,
        deliverablesSnapshot: reports.deliverablesSnapshot,
        createdByUserId: reports.createdByUserId,
        shareToken: reports.shareToken,
        shareRevokedAt: reports.shareRevokedAt,
        createdAt: reports.createdAt,
        // Creator Join
        creatorName: users.name,
        creatorEmail: users.email,
        // Client Join
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        clientLogoUrl: clients.logoUrl,
        clientPrimaryColor: clients.primaryColor,
        clientSecondaryColor: clients.secondaryColor,
        clientWebsiteUrl: clients.websiteUrl,
        clientIsWhiteLabel: clients.isWhiteLabel,
        clientPartnerName: clients.partnerName,
        clientPartnerLogoUrl: clients.partnerLogoUrl,
      })
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .leftJoin(users, eq(reports.createdByUserId, users.id))
      .orderBy(sql`${reports.periodStart} desc nulls last`, sql`${reports.version} desc nulls last`)

    if (conditions.length === 1) {
      // @ts-expect-error drizzle query builder with where
      query = query.where(conditions[0])
    } else if (conditions.length > 1) {
      // @ts-expect-error drizzle query builder with where
      query = query.where(and(...conditions))
    }

    const rows = await query

    // Deduplicate: keep only the latest version per (clientId, periodStart).
    // Rows are already ordered by periodStart DESC, version DESC so the first
    // occurrence of each (clientId+periodStart) key is the latest version.
    // We also count how many versions exist so the UI can show history badges.
    const seenKeys = new Map<string, number>() // key -> index in deduped
    const deduped: typeof rows = []
    for (const r of rows) {
      const key = `${r.clientId ?? ''}|${r.periodStart ? new Date(r.periodStart as any).toISOString() : ''}`
      if (seenKeys.has(key)) {
        // Increment version count for the already-selected latest row
        const idx = seenKeys.get(key)!
        ;(deduped[idx] as any).__versionCount = ((deduped[idx] as any).__versionCount || 1) + 1
      } else {
        seenKeys.set(key, deduped.length)
        ;(r as any).__versionCount = 1
        deduped.push(r)
      }
    }

    const mapped = deduped.map((r: any) => {
      const snap = r.clientSnapshot
      return {
        ...r,
        versionCount: r.__versionCount ?? 1,
        creatorNameOrEmail: r.creatorName || r.creatorEmail || null,
        clientName: snap?.businessName || r.clientName || '',
        clientBusinessName: snap?.businessName || r.clientBusinessName || '',
        clientLogoUrl: snap?.logoUrl !== undefined ? snap.logoUrl : r.clientLogoUrl,
        clientPrimaryColor: snap?.primaryColor || r.clientPrimaryColor,
        clientSecondaryColor: snap?.secondaryColor || r.clientSecondaryColor,
        clientIsWhiteLabel: snap?.isWhiteLabel !== undefined ? snap.isWhiteLabel : Boolean(r.clientIsWhiteLabel),
        clientPartnerName: snap?.partnerName !== undefined ? snap.partnerName : r.clientPartnerName,
        clientPartnerLogoUrl: snap?.partnerLogoUrl !== undefined ? snap.partnerLogoUrl : r.clientPartnerLogoUrl,
      }
    })

    if (data?.sort) {
      const sortKey = data.sort
      const isDesc = data.order === 'desc'
      mapped.sort((a, b) => {
        let comp = 0
        if (sortKey === 'client') {
          comp = (a.clientBusinessName || a.clientName || '').localeCompare(b.clientBusinessName || b.clientName || '')
        } else if (sortKey === 'period') {
          const timeA = a.periodStart ? new Date(a.periodStart as any).getTime() : 0
          const timeB = b.periodStart ? new Date(b.periodStart as any).getTime() : 0
          comp = timeA - timeB
        } else if (sortKey === 'version') {
          comp = (Number(a.version) || 1) - (Number(b.version) || 1)
        } else if (sortKey === 'clicks' || sortKey === 'gscClicks') {
          comp = (Number(a.gscClicks) || 0) - (Number(b.gscClicks) || 0)
        } else if (sortKey === 'sessions' || sortKey === 'gaSessions') {
          comp = (Number(a.gaSessions) || 0) - (Number(b.gaSessions) || 0)
        } else if (sortKey === 'calls' || sortKey === 'gbpCalls') {
          comp = (Number(a.gbpCalls) || 0) - (Number(b.gbpCalls) || 0)
        } else if (sortKey === 'created' || sortKey === 'createdAt') {
          const timeA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0
          const timeB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0
          comp = timeA - timeB
        } else if (sortKey === 'status' || sortKey === 'share') {
          const statusA = a.shareRevokedAt ? 'revoked' : a.shareToken ? 'active' : 'draft'
          const statusB = b.shareRevokedAt ? 'revoked' : b.shareToken ? 'active' : 'draft'
          comp = statusA.localeCompare(statusB)
        }
        return isDesc ? -comp : comp
      })
    }

    return { reports: mapped as (ReportWithClient & { versionCount: number })[] }
  })

/**
 * Server Function: Get the most recent report for a specific client (to autofill previous metrics)
 */
export const getLatestReportForClientServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized access: Admin or Partner role required')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, data.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: Client does not belong to your partner account')
      }
    }

    const [latest] = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, data.clientId))
      .orderBy(sql`${reports.periodStart} desc nulls last`)
      .limit(1)

    return { report: latest || null }
  })


/**
 * Server Function: Get a single report by ID with client branding
 * IDOR Protection: Client users can only view reports where report.clientId === currentUser.clientId
 */
export const getReportByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    const [row] = await db
      .select({
        report: reports,
        client: clients,
      })
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .where(eq(reports.id, data.id))

    if (!row) {
      throw new Error('Report not found')
    }

    // Protection: Partner can ONLY view reports for their assigned clients
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId && row.client && row.client.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: You do not have permission to view this report')
    }

    // IDOR Protection: Client users can ONLY view their own client's report
    if (auth.role === 'client' && (!auth.clientId || auth.clientId !== row.report.clientId)) {
      throw new Error('Unauthorized: You do not have permission to view this report')
    }

    const snap = row.report.clientSnapshot
    const client = row.client || {
      id: row.report.clientId || '',
      name: snap?.name || snap?.businessName || '',
      businessName: snap?.businessName || '',
      websiteUrl: snap?.websiteUrl || null,
      logoUrl: snap?.logoUrl || null,
      logoBgColor: snap?.logoBgColor || '#ffffff',
      primaryColor: snap?.primaryColor || '#2563eb',
      secondaryColor: snap?.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(snap?.isWhiteLabel),
      partnerName: snap?.partnerName || null,
      partnerLogoUrl: snap?.partnerLogoUrl || null,
      partnerLogoBgColor: snap?.partnerLogoBgColor || '#ffffff',
      partnerId: null,
      assignedStaffId: null,
      createdAt: row.report.createdAt,
      deletedAt: null,
    }

    // Fetch all versions for the same (clientId, periodStart) so the UI can render
    // a version switcher. Only available for admin-level roles (not client portal).
    let availableVersions: Array<{ id: string; version: number; createdAt: Date | string | null }> = []
    if (auth.role !== 'client' && row.report.clientId && row.report.periodStart) {
      availableVersions = await db
        .select({ id: reports.id, version: reports.version, createdAt: reports.createdAt })
        .from(reports)
        .where(and(eq(reports.clientId, row.report.clientId), eq(reports.periodStart, row.report.periodStart)))
        .orderBy(sql`${reports.version} desc nulls last`)
    }

    return { report: row.report, client, availableVersions }
  })

/**
 * Server Function: Get reports for the authenticated client's portal
 */
export const getPortalReportsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const auth = await assertActiveSession()

    let targetClientId = auth.clientId

    // If admin is viewing portal without specific clientId, pick the first client
    if (auth.role === 'admin' && !targetClientId) {
      const [firstClient] = await db.select().from(clients).where(isNull(clients.deletedAt)).limit(1)
      if (firstClient) {
        targetClientId = firstClient.id
      }
    }

    if (!targetClientId) {
      return { client: null, reports: [] }
    }

    const [client] = await db.select().from(clients).where(and(eq(clients.id, targetClientId), isNull(clients.deletedAt)))
    if (!client) {
      throw new Error('Client profile not found')
    }

    const clientReports = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, targetClientId))
      .orderBy(sql`${reports.periodStart} desc nulls last`, sql`${reports.version} desc nulls last`)

    // Strictly internal: never expose createdByUserId to client portal.
    // Also deduplicate: if multiple versions exist for the same periodStart, show only the latest version.
    const seenPeriods = new Set<string>()
    const sanitizedReports: Array<Omit<Report, 'createdByUserId'>> = []

    for (const rep of clientReports) {
      const periodKey = rep.periodStart ? new Date(rep.periodStart).toISOString() : rep.reportMonth
      if (!seenPeriods.has(periodKey)) {
        seenPeriods.add(periodKey)
        const { createdByUserId: _omitted, ...rest } = rep
        sanitizedReports.push(rest)
      }
    }

    return {
      client,
      reports: sanitizedReports,
    }
  }
)


/**
 * Server Function: Pre-flight check and auto-population data endpoint
 * Returns monthly_metrics, prior metrics, deliverables count, or blocks if metrics are missing.
 */
export const getReportPreflightDataServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string; reportMonth: string }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    if (!data.reportMonth) throw new Error('Report month is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
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

    const { periodStart, periodEnd, nextMonthStart, month, year } = parseReportPeriod(data.reportMonth)

    // Compute previous month
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year

    // Check monthly_metrics for current period
    const [currentMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, targetClient.id),
          eq(monthlyMetrics.month, month),
          eq(monthlyMetrics.year, year)
        )
      )

    // Check monthly_metrics for prior month
    const [prevMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, targetClient.id),
          eq(monthlyMetrics.month, prevMonth),
          eq(monthlyMetrics.year, prevYear)
        )
      )

    const dataSources = await getClientDataSourceMap(targetClient.id)

    if (!currentMetrics) {
      return {
        ready: false,
        missing: 'monthly_metrics' as const,
        missingFields: [] as string[],
        month,
        year,
        clientName: targetClient.businessName || targetClient.name,
        message: `Monthly metrics for ${data.reportMonth} have not been recorded for ${targetClient.businessName || targetClient.name}. You must enter monthly metrics before generating a report.`,
        metricsFormUrl: `/admin/workspace?tab=metrics&client=${targetClient.id}`,
        metrics: null,
        prevMetrics: null,
        deliverables: null,
        dataSources,
      }
    }

    // Check required metric fields on connected data sources
    const missingFields: string[] = []
    if (dataSources.gsc === 'connected') {
      if (currentMetrics.gscClicks === null || currentMetrics.gscClicks === undefined) {
        missingFields.push('GSC Clicks')
      }
      if (currentMetrics.gscImpressions === null || currentMetrics.gscImpressions === undefined) {
        missingFields.push('GSC Impressions')
      }
    }
    if (dataSources.ga4 === 'connected') {
      if (currentMetrics.gaUsers === null || currentMetrics.gaUsers === undefined) {
        missingFields.push('GA4 Total Users')
      }
      if (currentMetrics.gaSessions === null || currentMetrics.gaSessions === undefined) {
        missingFields.push('GA4 Sessions')
      }
    }
    if (dataSources.gbp === 'connected') {
      if (currentMetrics.gbpViews === null || currentMetrics.gbpViews === undefined) {
        missingFields.push('GBP Views')
      }
      if (currentMetrics.gbpCalls === null || currentMetrics.gbpCalls === undefined) {
        missingFields.push('GBP Calls')
      }
    }

    if (missingFields.length > 0) {
      return {
        ready: false,
        missing: 'metrics_fields' as const,
        missingFields,
        month,
        year,
        clientName: targetClient.businessName || targetClient.name,
        message: `Monthly metrics for ${data.reportMonth} are incomplete for ${targetClient.businessName || targetClient.name}. The following required fields are missing for connected data sources: ${missingFields.join(', ')}. Please update monthly metrics or change data source access before generating a report.`,
        metricsFormUrl: `/admin/workspace?tab=metrics&client=${targetClient.id}`,
        metrics: currentMetrics,
        prevMetrics: prevMetrics || null,
        deliverables: null,
        dataSources,
      }
    }

    // Collect deliverables snapshot preview
    const deliverables = await collectDeliverablesSnapshot(targetClient.id, periodStart, nextMonthStart)

    return {
      ready: true,
      missing: null,
      missingFields: [],
      month,
      year,
      clientName: targetClient.businessName || targetClient.name,
      message: null,
      metricsFormUrl: null,
      metrics: currentMetrics,
      prevMetrics: prevMetrics || null,
      deliverables,
      dataSources,
    }
  })

/**
 * Server Function: Create a new report (Admin or Partner)
 */
export const createReportServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      title: string
      reportMonth: string
      previousReportId?: string | null
      gbpCalls?: number | string | null
      gbpDirections?: number | string | null
      gbpViews?: number | string | null
      gbpWebsiteClicks?: number | string | null
      prevGbpCalls?: number | string | null
      prevGbpDirections?: number | string | null
      prevGbpViews?: number | string | null
      prevGbpWebsiteClicks?: number | string | null
      gbpRating?: number | string | null
      gbpReviewCount?: number | string | null
      gbpReviewsCount?: number | string | null
      prevGbpReviewsCount?: number | string | null
      gscClicks?: number | string | null
      gscImpressions?: number | string | null
      gscCtr?: number | string | null
      gscPosition?: number | string | null
      prevGscClicks?: number | string | null
      prevGscImpressions?: number | string | null
      prevGscCtr?: number | string | null
      prevGscPosition?: number | string | null
      gaUsers?: number | string | null
      gaNewUsers?: number | string | null
      gaEngagementRate?: number | string | null
      gaSessions?: number | string | null
      gaViews?: number | string | null
      prevGaUsers?: number | string | null
      prevGaNewUsers?: number | string | null
      prevGaEngagementRate?: number | string | null
      prevGaSessions?: number | string | null
      prevGaViews?: number | string | null
      displayOptions?: DisplayOptions
      topQueries?: QueryItem[]
      topPages?: PageItem[]
      summaryTitle?: string
      summary?: string
      workCompleted?: string
      nextSteps?: string
    }) => {
      if (!data.clientId?.trim()) throw new Error('Client selection is required')
      if (!data.title?.trim()) throw new Error('Report title is required')
      if (!data.reportMonth?.trim()) throw new Error('Report month is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
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
      throw new Error(effectivePartnerId ? 'Unauthorized: You can only create reports for your assigned clients' : 'Client not found')
    }

    const { periodStart, periodEnd, nextMonthStart, month, year } = parseReportPeriod(data.reportMonth)

    // PRE-FLIGHT CHECK: Block report creation if monthly_metrics is missing
    const [currentMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, targetClient.id),
          eq(monthlyMetrics.month, month),
          eq(monthlyMetrics.year, year)
        )
      )

    if (!currentMetrics) {
      throw new Error(
        `Cannot generate report: Monthly KPI metrics have not been recorded for ${targetClient.businessName || targetClient.name} for ${data.reportMonth}. Please complete the monthly metrics form before generating a report.`
      )
    }

    const dataSources = await getClientDataSourceMap(targetClient.id)

    // Validate required fields for connected data sources
    const missingFields: string[] = []
    if (dataSources.gsc === 'connected') {
      if (currentMetrics.gscClicks === null || currentMetrics.gscClicks === undefined) {
        missingFields.push('GSC Clicks')
      }
      if (currentMetrics.gscImpressions === null || currentMetrics.gscImpressions === undefined) {
        missingFields.push('GSC Impressions')
      }
    }
    if (dataSources.ga4 === 'connected') {
      if (currentMetrics.gaUsers === null || currentMetrics.gaUsers === undefined) {
        missingFields.push('GA4 Total Users')
      }
      if (currentMetrics.gaSessions === null || currentMetrics.gaSessions === undefined) {
        missingFields.push('GA4 Sessions')
      }
    }
    if (dataSources.gbp === 'connected') {
      if (currentMetrics.gbpViews === null || currentMetrics.gbpViews === undefined) {
        missingFields.push('GBP Views')
      }
      if (currentMetrics.gbpCalls === null || currentMetrics.gbpCalls === undefined) {
        missingFields.push('GBP Calls')
      }
    }

    if (missingFields.length > 0) {
      throw new Error(
        `Cannot generate report: The following required fields are missing for connected data sources: ${missingFields.join(', ')}. Please complete monthly metrics or adjust client data sources.`
      )
    }

    // Determine version: Find existing reports for this client and periodStart
    const existingReportsForPeriod = await db
      .select({ version: reports.version })
      .from(reports)
      .where(and(eq(reports.clientId, targetClient.id), eq(reports.periodStart, periodStart)))
      .orderBy(desc(reports.version))

    const nextVersion = existingReportsForPeriod.length > 0 ? (existingReportsForPeriod[0].version || 1) + 1 : 1

    // Collect and freeze period-scoped deliverables
    const deliverablesSnapshot = await collectDeliverablesSnapshot(targetClient.id, periodStart, nextMonthStart)

    const clientSnapshot: ClientSnapshot = {
      businessName: targetClient.businessName || targetClient.name,
      name: targetClient.name || null,
      websiteUrl: targetClient.websiteUrl || null,
      logoUrl: targetClient.logoUrl ?? null,
      logoBgColor: targetClient.logoBgColor ?? '#ffffff',
      primaryColor: targetClient.primaryColor || '#2563eb',
      secondaryColor: targetClient.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(targetClient.isWhiteLabel),
      partnerName: targetClient.partnerName ?? null,
      partnerLogoUrl: targetClient.partnerLogoUrl ?? null,
      partnerLogoBgColor: targetClient.partnerLogoBgColor ?? '#ffffff',
      dataSources,
    }

    const gbpConnected = dataSources.gbp === 'connected'
    const gscConnected = dataSources.gsc === 'connected'
    const ga4Connected = dataSources.ga4 === 'connected'

    const reviewsCount = gbpConnected ? parseNullableInt(data.gbpReviewsCount ?? data.gbpReviewCount) : null

    const [created] = await db
      .insert(reports)
      .values({
        clientId: data.clientId.trim(),
        title: data.title.trim(),
        reportMonth: data.reportMonth.trim(),
        periodStart,
        periodEnd,
        clientSnapshot,
        deliverablesSnapshot,
        version: nextVersion,
        previousReportId: data.previousReportId || null,
        // GBP Current
        gbpCalls: gbpConnected ? parseNullableInt(data.gbpCalls) : null,
        gbpDirections: gbpConnected ? parseNullableInt(data.gbpDirections) : null,
        gbpViews: gbpConnected ? parseNullableInt(data.gbpViews) : null,
        gbpWebsiteClicks: gbpConnected ? parseNullableInt(data.gbpWebsiteClicks ?? data.gbpViews) : null,
        // GBP Previous
        prevGbpCalls: gbpConnected ? parseNullableInt(data.prevGbpCalls) : null,
        prevGbpDirections: gbpConnected ? parseNullableInt(data.prevGbpDirections) : null,
        prevGbpViews: gbpConnected ? parseNullableInt(data.prevGbpViews) : null,
        prevGbpWebsiteClicks: gbpConnected ? parseNullableInt(data.prevGbpWebsiteClicks ?? data.prevGbpViews) : null,
        // GBP Reputation
        gbpRating: gbpConnected ? parseNullableDecimal(data.gbpRating) : null,
        gbpReviewCount: reviewsCount,
        gbpReviewsCount: reviewsCount,
        prevGbpReviewsCount: gbpConnected ? parseNullableInt(data.prevGbpReviewsCount) : null,
        // GSC Current
        gscClicks: gscConnected ? parseNullableInt(data.gscClicks) : null,
        gscImpressions: gscConnected ? parseNullableInt(data.gscImpressions) : null,
        gscCtr: gscConnected ? parseNullableDecimal(data.gscCtr) : null,
        gscPosition: gscConnected ? parseNullableDecimal(data.gscPosition) : null,
        // GSC Previous
        prevGscClicks: gscConnected ? parseNullableInt(data.prevGscClicks) : null,
        prevGscImpressions: gscConnected ? parseNullableInt(data.prevGscImpressions) : null,
        prevGscCtr: gscConnected ? parseNullableDecimal(data.prevGscCtr) : null,
        prevGscPosition: gscConnected ? parseNullableDecimal(data.prevGscPosition) : null,
        // GA4 Current
        gaUsers: ga4Connected ? parseNullableInt(data.gaUsers) : null,
        gaNewUsers: ga4Connected ? parseNullableInt(data.gaNewUsers) : null,
        gaEngagementRate: ga4Connected ? parseNullableDecimal(data.gaEngagementRate) : null,
        gaSessions: ga4Connected ? parseNullableInt(data.gaSessions) : null,
        gaViews: ga4Connected ? parseNullableInt(data.gaViews) : null,
        // GA4 Previous
        prevGaUsers: ga4Connected ? parseNullableInt(data.prevGaUsers) : null,
        prevGaNewUsers: ga4Connected ? parseNullableInt(data.prevGaNewUsers) : null,
        prevGaEngagementRate: ga4Connected ? parseNullableDecimal(data.prevGaEngagementRate) : null,
        prevGaSessions: ga4Connected ? parseNullableInt(data.prevGaSessions) : null,
        prevGaViews: ga4Connected ? parseNullableInt(data.prevGaViews) : null,
        // Display Options
        displayOptions: data.displayOptions || {

          show_agency_info: false,
          show_contact_person: true,
          show_date_generated: false,
          show_summary: true,
          show_tables: true,
          show_next_steps: true,
        },
        // Deep Metric Tables
        topQueries: Array.isArray(data.topQueries) ? data.topQueries : [],
        topPages: Array.isArray(data.topPages) ? data.topPages : [],
        // Narrative Fields
        summaryTitle: data.summaryTitle?.trim() || 'Performance Highlights & Strategic Updates',
        summary: data.summary?.trim() || null,
        workCompleted: data.workCompleted?.trim() || null,
        nextSteps: data.nextSteps?.trim() || null,
        createdByUserId: auth.userId || null,
      })
      .returning()

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'create_report',
    })

    return { success: true, report: created }
  })

/**
 * Server Function: Regenerate report (creates version N+1)
 * Preserves prior versions for auditing while refreshing CRM metrics and deliverables
 */
export const regenerateReportServerFn = createServerFn({ method: 'POST' })
  .validator((data: { reportId: string }) => {
    if (!data.reportId) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const [existing] = await db.select().from(reports).where(eq(reports.id, data.reportId))
    if (!existing || !existing.clientId) {
      throw new Error('Report not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const [targetClient] = await db
      .select()
      .from(clients)
      .where(
        effectivePartnerId
          ? and(eq(clients.id, existing.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt))
          : and(eq(clients.id, existing.clientId), isNull(clients.deletedAt))
      )
    if (!targetClient) {
      throw new Error('Unauthorized: You do not have permission to regenerate this report')
    }

    const { periodStart, periodEnd, nextMonthStart, month, year } = parseReportPeriod(existing.reportMonth)

    // Pull current and prior metrics from monthlyMetrics table
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year

    const [currentMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, existing.clientId),
          eq(monthlyMetrics.month, month),
          eq(monthlyMetrics.year, year)
        )
      )

    if (!currentMetrics) {
      throw new Error(
        `Cannot regenerate report: Monthly KPI metrics for ${existing.reportMonth} are missing in the database.`
      )
    }

    const [prevMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, existing.clientId),
          eq(monthlyMetrics.month, prevMonth),
          eq(monthlyMetrics.year, prevYear)
        )
      )

    // Find highest version
    const allVersions = await db
      .select({ version: reports.version })
      .from(reports)
      .where(and(eq(reports.clientId, existing.clientId), eq(reports.periodStart, existing.periodStart)))
      .orderBy(desc(reports.version))

    const nextVersion = (allVersions[0]?.version || existing.version || 1) + 1

    const dataSources = await getClientDataSourceMap(existing.clientId)
    const gbpConnected = dataSources.gbp === 'connected'
    const gscConnected = dataSources.gsc === 'connected'
    const ga4Connected = dataSources.ga4 === 'connected'

    // Update client branding snapshot
    const clientSnapshot: ClientSnapshot = {
      businessName: targetClient.businessName || targetClient.name,
      name: targetClient.name || null,
      websiteUrl: targetClient.websiteUrl || null,
      logoUrl: targetClient.logoUrl ?? null,
      logoBgColor: targetClient.logoBgColor ?? '#ffffff',
      primaryColor: targetClient.primaryColor || '#2563eb',
      secondaryColor: targetClient.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(targetClient.isWhiteLabel),
      partnerName: targetClient.partnerName ?? null,
      partnerLogoUrl: targetClient.partnerLogoUrl ?? null,
      partnerLogoBgColor: targetClient.partnerLogoBgColor ?? '#ffffff',
      dataSources,
    }

    const reviewsCount = gbpConnected ? (currentMetrics.gbpReviewsCount ?? existing.gbpReviewsCount ?? null) : null

    // Collect and freeze deliverables snapshot for regeneration period
    const deliverablesSnapshot = await collectDeliverablesSnapshot(targetClient.id, periodStart, nextMonthStart)

    // Insert new version
    const [newReport] = await db
      .insert(reports)
      .values({
        clientId: existing.clientId,
        title: existing.title,
        reportMonth: existing.reportMonth,
        periodStart,
        periodEnd,
        clientSnapshot,
        deliverablesSnapshot,
        version: nextVersion,
        previousReportId: existing.previousReportId,
        // GBP Current
        gbpCalls: gbpConnected ? (currentMetrics.gbpCalls ?? existing.gbpCalls ?? null) : null,
        gbpDirections: gbpConnected ? (currentMetrics.gbpDirections ?? existing.gbpDirections ?? null) : null,
        gbpViews: gbpConnected ? (currentMetrics.gbpViews ?? existing.gbpViews ?? null) : null,
        gbpWebsiteClicks: gbpConnected ? (currentMetrics.gbpWebsiteClicks ?? existing.gbpWebsiteClicks ?? null) : null,
        // GBP Previous
        prevGbpCalls: gbpConnected ? (prevMetrics?.gbpCalls ?? existing.prevGbpCalls ?? null) : null,
        prevGbpDirections: gbpConnected ? (prevMetrics?.gbpDirections ?? existing.prevGbpDirections ?? null) : null,
        prevGbpViews: gbpConnected ? (prevMetrics?.gbpViews ?? existing.prevGbpViews ?? null) : null,
        prevGbpWebsiteClicks: gbpConnected ? (prevMetrics?.gbpWebsiteClicks ?? existing.prevGbpWebsiteClicks ?? null) : null,
        // Reputation
        gbpRating: gbpConnected ? (currentMetrics.gbpRating ?? existing.gbpRating ?? null) : null,
        gbpReviewCount: reviewsCount,
        gbpReviewsCount: reviewsCount,
        prevGbpReviewsCount: gbpConnected ? (prevMetrics?.gbpReviewsCount ?? existing.prevGbpReviewsCount ?? null) : null,
        // GSC Current
        gscClicks: gscConnected ? (currentMetrics.gscClicks ?? existing.gscClicks ?? null) : null,
        gscImpressions: gscConnected ? (currentMetrics.gscImpressions ?? existing.gscImpressions ?? null) : null,
        gscCtr: gscConnected ? (currentMetrics.gscCtr ?? existing.gscCtr ?? null) : null,
        gscPosition: gscConnected ? (currentMetrics.gscPosition ?? existing.gscPosition ?? null) : null,
        // GSC Previous
        prevGscClicks: gscConnected ? (prevMetrics?.gscClicks ?? existing.prevGscClicks ?? null) : null,
        prevGscImpressions: gscConnected ? (prevMetrics?.gscImpressions ?? existing.prevGscImpressions ?? null) : null,
        prevGscCtr: gscConnected ? (prevMetrics?.gscCtr ?? existing.prevGscCtr ?? null) : null,
        prevGscPosition: gscConnected ? (prevMetrics?.gscPosition ?? existing.prevGscPosition ?? null) : null,
        // GA4 Current
        gaUsers: ga4Connected ? (currentMetrics.gaUsers ?? existing.gaUsers ?? null) : null,
        gaNewUsers: ga4Connected ? (currentMetrics.gaNewUsers ?? existing.gaNewUsers ?? null) : null,
        gaEngagementRate: ga4Connected ? (currentMetrics.gaEngagementRate ?? existing.gaEngagementRate ?? null) : null,
        gaSessions: ga4Connected ? (currentMetrics.gaSessions ?? existing.gaSessions ?? null) : null,
        gaViews: ga4Connected ? (currentMetrics.gaViews ?? existing.gaViews ?? null) : null,
        // GA4 Previous
        prevGaUsers: ga4Connected ? (prevMetrics?.gaUsers ?? existing.prevGaUsers ?? null) : null,
        prevGaNewUsers: ga4Connected ? (prevMetrics?.gaNewUsers ?? existing.prevGaNewUsers ?? null) : null,
        prevGaEngagementRate: ga4Connected ? (prevMetrics?.gaEngagementRate ?? existing.prevGaEngagementRate ?? null) : null,
        prevGaSessions: ga4Connected ? (prevMetrics?.gaSessions ?? existing.prevGaSessions ?? null) : null,
        prevGaViews: ga4Connected ? (prevMetrics?.gaViews ?? existing.prevGaViews ?? null) : null,
        // Retain display options, deep tables & narrative
        displayOptions: existing.displayOptions,
        topQueries: existing.topQueries,
        topPages: existing.topPages,
        summaryTitle: existing.summaryTitle,
        summary: existing.summary,
        workCompleted: existing.workCompleted,
        nextSteps: existing.nextSteps,
        createdByUserId: auth.userId || null,
        // Re-link shareToken to newest version if active
        shareToken: existing.shareToken,
        shareRevokedAt: existing.shareRevokedAt,
      })
      .returning()

    // If existing had shareToken, null it on the old version so the unique constraint points to the latest
    if (existing.shareToken) {
      await db.update(reports).set({ shareToken: null }).where(eq(reports.id, existing.id))
    }

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'regenerate_report',
    })

    return { success: true, report: newReport }
  })

/**
 * Server Function: Update an existing report (Admin or Partner)
 */
export const updateReportServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      clientId: string
      title: string
      reportMonth: string
      previousReportId?: string | null
      gbpCalls?: number | string | null
      gbpDirections?: number | string | null
      gbpViews?: number | string | null
      gbpWebsiteClicks?: number | string | null
      prevGbpCalls?: number | string | null
      prevGbpDirections?: number | string | null
      prevGbpViews?: number | string | null
      prevGbpWebsiteClicks?: number | string | null
      gbpRating?: number | string | null
      gbpReviewCount?: number | string | null
      gbpReviewsCount?: number | string | null
      prevGbpReviewsCount?: number | string | null
      gscClicks?: number | string | null
      gscImpressions?: number | string | null
      gscCtr?: number | string | null
      gscPosition?: number | string | null
      prevGscClicks?: number | string | null
      prevGscImpressions?: number | string | null
      prevGscCtr?: number | string | null
      prevGscPosition?: number | string | null
      gaUsers?: number | string | null
      gaNewUsers?: number | string | null
      gaEngagementRate?: number | string | null
      gaSessions?: number | string | null
      gaViews?: number | string | null
      prevGaUsers?: number | string | null
      prevGaNewUsers?: number | string | null
      prevGaEngagementRate?: number | string | null
      prevGaSessions?: number | string | null
      prevGaViews?: number | string | null
      displayOptions?: DisplayOptions
      topQueries?: QueryItem[]
      topPages?: PageItem[]
      summaryTitle?: string
      summary?: string
      workCompleted?: string
      nextSteps?: string
    }) => {
      if (!data.id) throw new Error('Report ID is required')
      if (!data.clientId?.trim()) throw new Error('Client is required')
      if (!data.title?.trim()) throw new Error('Report title is required')
      if (!data.reportMonth?.trim()) throw new Error('Report month is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetReport] = await db
        .select({ clientId: reports.clientId })
        .from(reports)
        .where(eq(reports.id, data.id))
      if (!targetReport || !targetReport.clientId) throw new Error('Report not found')

      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, targetReport.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: You can only edit reports for your assigned clients')
      }
    }

    const { periodStart, periodEnd } = parseReportPeriod(data.reportMonth)

    const [clientRow] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, data.clientId.trim()), isNull(clients.deletedAt)))

    const dataSources = await getClientDataSourceMap(data.clientId.trim())
    const gbpConnected = dataSources.gbp === 'connected'
    const gscConnected = dataSources.gsc === 'connected'
    const ga4Connected = dataSources.ga4 === 'connected'

    const clientSnapshot: ClientSnapshot | undefined = clientRow
      ? {
          businessName: clientRow.businessName || clientRow.name,
          name: clientRow.name || null,
          websiteUrl: clientRow.websiteUrl || null,
          logoUrl: clientRow.logoUrl ?? null,
          logoBgColor: clientRow.logoBgColor ?? '#ffffff',
          primaryColor: clientRow.primaryColor || '#2563eb',
          secondaryColor: clientRow.secondaryColor || '#1e293b',
          isWhiteLabel: Boolean(clientRow.isWhiteLabel),
          partnerName: clientRow.partnerName || null,
          partnerLogoUrl: clientRow.partnerLogoUrl || null,
          partnerLogoBgColor: clientRow.partnerLogoBgColor || '#ffffff',
          dataSources,
        }
      : undefined

    const reviewsCount = gbpConnected ? parseNullableInt(data.gbpReviewsCount ?? data.gbpReviewCount) : null

    const updatePayload: Record<string, any> = {
      clientId: data.clientId.trim(),
      title: data.title.trim(),
      reportMonth: data.reportMonth.trim(),
      periodStart,
      periodEnd,
      ...(clientSnapshot ? { clientSnapshot } : {}),
      previousReportId: data.previousReportId || null,
      // GBP Current
      gbpCalls: gbpConnected ? parseNullableInt(data.gbpCalls) : null,
      gbpDirections: gbpConnected ? parseNullableInt(data.gbpDirections) : null,
      gbpViews: gbpConnected ? parseNullableInt(data.gbpViews) : null,
      gbpWebsiteClicks: gbpConnected ? parseNullableInt(data.gbpWebsiteClicks ?? data.gbpViews) : null,
      // GBP Previous
      prevGbpCalls: gbpConnected ? parseNullableInt(data.prevGbpCalls) : null,
      prevGbpDirections: gbpConnected ? parseNullableInt(data.prevGbpDirections) : null,
      prevGbpViews: gbpConnected ? parseNullableInt(data.prevGbpViews) : null,
      prevGbpWebsiteClicks: gbpConnected ? parseNullableInt(data.prevGbpWebsiteClicks ?? data.prevGbpViews) : null,
      // GBP Reputation
      gbpRating: gbpConnected ? parseNullableDecimal(data.gbpRating) : null,
      gbpReviewCount: reviewsCount,
      gbpReviewsCount: reviewsCount,
      prevGbpReviewsCount: gbpConnected ? parseNullableInt(data.prevGbpReviewsCount) : null,
      // GSC Current
      gscClicks: gscConnected ? parseNullableInt(data.gscClicks) : null,
      gscImpressions: gscConnected ? parseNullableInt(data.gscImpressions) : null,
      gscCtr: gscConnected ? parseNullableDecimal(data.gscCtr) : null,
      gscPosition: gscConnected ? parseNullableDecimal(data.gscPosition) : null,
      // GSC Previous
      prevGscClicks: gscConnected ? parseNullableInt(data.prevGscClicks) : null,
      prevGscImpressions: gscConnected ? parseNullableInt(data.prevGscImpressions) : null,
      prevGscCtr: gscConnected ? parseNullableDecimal(data.prevGscCtr) : null,
      prevGscPosition: gscConnected ? parseNullableDecimal(data.prevGscPosition) : null,
      // GA4 Current
      gaUsers: ga4Connected ? parseNullableInt(data.gaUsers) : null,
      gaNewUsers: ga4Connected ? parseNullableInt(data.gaNewUsers) : null,
      gaEngagementRate: ga4Connected ? parseNullableDecimal(data.gaEngagementRate) : null,
      gaSessions: ga4Connected ? parseNullableInt(data.gaSessions) : null,
      gaViews: ga4Connected ? parseNullableInt(data.gaViews) : null,
      // GA4 Previous
      prevGaUsers: ga4Connected ? parseNullableInt(data.prevGaUsers) : null,
      prevGaNewUsers: ga4Connected ? parseNullableInt(data.prevGaNewUsers) : null,
      prevGaEngagementRate: ga4Connected ? parseNullableDecimal(data.prevGaEngagementRate) : null,
      prevGaSessions: ga4Connected ? parseNullableInt(data.prevGaSessions) : null,
      prevGaViews: ga4Connected ? parseNullableInt(data.prevGaViews) : null,
      // Deep Metric Tables
      topQueries: Array.isArray(data.topQueries) ? data.topQueries : [],
      topPages: Array.isArray(data.topPages) ? data.topPages : [],
      // Narrative Fields
      summaryTitle: data.summaryTitle?.trim() || 'Performance Highlights & Strategic Updates',
      summary: data.summary?.trim() || null,
      workCompleted: data.workCompleted?.trim() || null,
      nextSteps: data.nextSteps?.trim() || null,
    }

    if (data.displayOptions) {
      updatePayload.displayOptions = data.displayOptions
    }

    const [updated] = await db
      .update(reports)
      .set(updatePayload)
      .where(eq(reports.id, data.id))
      .returning()

    return { success: true, report: updated }
  })

/**
 * Server Function: Update report section display options in real-time
 */
export const updateReportDisplayOptionsServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; displayOptions: Partial<DisplayOptions> }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const [targetReport] = await db
      .select({ clientId: reports.clientId, displayOptions: reports.displayOptions })
      .from(reports)
      .where(eq(reports.id, data.id))

    if (!targetReport || !targetReport.clientId) throw new Error('Report not found')

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, targetReport.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: You can only edit reports for your assigned clients')
      }
    }

    const mergedOptions = {
      show_agency_info: false,
      show_contact_person: true,
      show_date_generated: false,
      show_summary: true,
      show_tables: true,
      show_next_steps: true,
      ...(targetReport.displayOptions || {}),
      ...data.displayOptions,
    }

    const [updated] = await db
      .update(reports)
      .set({
        displayOptions: mergedOptions,
      })
      .where(eq(reports.id, data.id))
      .returning({ id: reports.id, displayOptions: reports.displayOptions })

    return { success: true, displayOptions: updated?.displayOptions }
  })

/**
 * Server Function: Delete a report (Admin or Partner)
 */
export const deleteReportServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      const [targetReport] = await db
        .select({ clientId: reports.clientId })
        .from(reports)
        .where(eq(reports.id, data.id))
      if (!targetReport || !targetReport.clientId) throw new Error('Report not found')

      const [targetClient] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, targetReport.clientId), eq(clients.partnerId, effectivePartnerId), isNull(clients.deletedAt)))
      if (!targetClient) {
        throw new Error('Unauthorized: You can only delete reports for your assigned clients')
      }
    }

    await db.delete(reports).where(eq(reports.id, data.id))

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'delete_report',
    })

    return { success: true }
  })

/**
 * Server Function: Generate a public share link for a report (Admin or Partner)
 * Generates a crypto-secure 32-char URL-safe token.
 */
export const generateReportShareLinkServerFn = createServerFn({ method: 'POST' })
  .validator((data: { reportId: string }) => {
    if (!data.reportId) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const [targetReport] = await db
      .select({ id: reports.id, clientId: reports.clientId })
      .from(reports)
      .where(eq(reports.id, data.reportId))

    if (!targetReport) {
      throw new Error('Report not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      if (!targetReport.clientId) throw new Error('Report not associated with any client')
      const [targetClient] = await db
        .select({ id: clients.id })
        .from(clients)
        .where(
          and(
            eq(clients.id, targetReport.clientId),
            eq(clients.partnerId, effectivePartnerId),
            isNull(clients.deletedAt)
          )
        )
      if (!targetClient) {
        throw new Error('Unauthorized: You can only generate share links for your assigned clients')
      }
    }

    // High entropy 32-character URL-safe string
    const newToken = crypto.randomBytes(24).toString('base64url')

    const [updated] = await db
      .update(reports)
      .set({
        shareToken: newToken,
        shareRevokedAt: null,
      })
      .where(eq(reports.id, data.reportId))
      .returning({
        id: reports.id,
        shareToken: reports.shareToken,
        shareRevokedAt: reports.shareRevokedAt,
      })

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'generate_report_share_link',
    })

    return {
      success: true,
      shareToken: updated.shareToken,
      shareRevokedAt: updated.shareRevokedAt,
      shareUrl: `/r/${updated.shareToken}`,
    }
  })

/**
 * Server Function: Revoke a public share link for a report (Admin or Partner)
 */
export const revokeReportShareLinkServerFn = createServerFn({ method: 'POST' })
  .validator((data: { reportId: string }) => {
    if (!data.reportId) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const [targetReport] = await db
      .select({ id: reports.id, clientId: reports.clientId })
      .from(reports)
      .where(eq(reports.id, data.reportId))

    if (!targetReport) {
      throw new Error('Report not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      if (!targetReport.clientId) throw new Error('Report not associated with any client')
      const [targetClient] = await db
        .select({ id: clients.id })
        .from(clients)
        .where(
          and(
            eq(clients.id, targetReport.clientId),
            eq(clients.partnerId, effectivePartnerId),
            isNull(clients.deletedAt)
          )
        )
      if (!targetClient) {
        throw new Error('Unauthorized: You can only revoke share links for your assigned clients')
      }
    }

    const [updated] = await db
      .update(reports)
      .set({
        shareRevokedAt: new Date(),
      })
      .where(eq(reports.id, data.reportId))
      .returning({
        id: reports.id,
        shareToken: reports.shareToken,
        shareRevokedAt: reports.shareRevokedAt,
      })

    await logActivity({
      userId: auth.userId,
      userEmail: auth.email,
      role: auth.role,
      action: 'revoke_report_share_link',
    })

    return {
      success: true,
      shareToken: updated.shareToken,
      shareRevokedAt: updated.shareRevokedAt,
    }
  })

/**
 * Server Function: Public, unauthenticated endpoint to fetch report by shareToken
 * - Strictly snapshot-only rendering (clientSnapshot, deliverablesSnapshot, frozen metric columns)
 * - NO joins on `users` table
 * - Excludes user IDs, creator emails, creator names, internal database keys
 * - Returns `{ found: false }` if token is missing or revoked
 */
export const getPublicReportByShareTokenServerFn = createServerFn({ method: 'GET' })
  .validator((data: { shareToken: string }) => {
    if (!data.shareToken || typeof data.shareToken !== 'string') {
      throw new Error('Share token is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    const trimmedToken = data.shareToken.trim()
    if (!trimmedToken) {
      return { found: false, report: null }
    }

    const [reportRow] = await db
      .select({
        id: reports.id,
        title: reports.title,
        reportMonth: reports.reportMonth,
        periodStart: reports.periodStart,
        periodEnd: reports.periodEnd,
        clientSnapshot: reports.clientSnapshot,
        // GBP Metrics
        gbpCalls: reports.gbpCalls,
        gbpDirections: reports.gbpDirections,
        gbpViews: reports.gbpViews,
        gbpWebsiteClicks: reports.gbpWebsiteClicks,
        prevGbpCalls: reports.prevGbpCalls,
        prevGbpDirections: reports.prevGbpDirections,
        prevGbpViews: reports.prevGbpViews,
        prevGbpWebsiteClicks: reports.prevGbpWebsiteClicks,
        gbpRating: reports.gbpRating,
        gbpReviewCount: reports.gbpReviewCount,
        gbpReviewsCount: reports.gbpReviewsCount,
        prevGbpReviewsCount: reports.prevGbpReviewsCount,
        // GSC Metrics
        gscClicks: reports.gscClicks,
        gscImpressions: reports.gscImpressions,
        gscCtr: reports.gscCtr,
        gscPosition: reports.gscPosition,
        prevGscClicks: reports.prevGscClicks,
        prevGscImpressions: reports.prevGscImpressions,
        prevGscCtr: reports.prevGscCtr,
        prevGscPosition: reports.prevGscPosition,
        // GA4 Metrics
        gaUsers: reports.gaUsers,
        gaNewUsers: reports.gaNewUsers,
        gaEngagementRate: reports.gaEngagementRate,
        gaSessions: reports.gaSessions,
        gaViews: reports.gaViews,
        prevGaUsers: reports.prevGaUsers,
        prevGaNewUsers: reports.prevGaNewUsers,
        prevGaEngagementRate: reports.prevGaEngagementRate,
        prevGaSessions: reports.prevGaSessions,
        prevGaViews: reports.prevGaViews,
        // Display Options
        displayOptions: reports.displayOptions,
        // Deep Metric Tables
        topQueries: reports.topQueries,
        topPages: reports.topPages,
        // Narrative Fields
        summaryTitle: reports.summaryTitle,
        summary: reports.summary,
        workCompleted: reports.workCompleted,
        nextSteps: reports.nextSteps,
        createdAt: reports.createdAt,
        shareRevokedAt: reports.shareRevokedAt,
      })
      .from(reports)
      .where(eq(reports.shareToken, trimmedToken))

    // If report does not exist or share link has been revoked, return not found
    if (!reportRow || reportRow.shareRevokedAt !== null) {
      return { found: false, report: null }
    }

    return {
      found: true,
      report: reportRow as unknown as Report,
    }
  })



