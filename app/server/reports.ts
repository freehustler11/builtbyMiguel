import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, sql, inArray } from 'drizzle-orm'
import crypto from 'crypto'
import {
  db,
  clients,
  reports,
  users,
  monthlyMetrics,
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
  collectDeliverablesSnapshot,
} from './reports-helpers'

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
  .validator((data?: { clientId?: string }) => {
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
    const mapped = rows.map((r: any) => {
      const snap = r.clientSnapshot
      return {
        ...r,
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
    return { reports: mapped as ReportWithClient[] }
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
      primaryColor: snap?.primaryColor || '#2563eb',
      secondaryColor: snap?.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(snap?.isWhiteLabel),
      partnerName: snap?.partnerName || null,
      partnerLogoUrl: snap?.partnerLogoUrl || null,
      partnerId: null,
      createdAt: row.report.createdAt,
      deletedAt: null,
    }

    return { report: row.report, client }
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

    if (!currentMetrics) {
      return {
        ready: false,
        missing: 'monthly_metrics' as const,
        month,
        year,
        clientName: targetClient.businessName || targetClient.name,
        message: `Monthly metrics for ${data.reportMonth} have not been recorded for ${targetClient.businessName || targetClient.name}. You must enter monthly metrics before generating a report.`,
        metricsFormUrl: `/admin/workspace?tab=metrics&client=${targetClient.id}`,
        metrics: null,
        prevMetrics: null,
        deliverables: null,
      }
    }

    // Collect deliverables snapshot preview
    const deliverables = await collectDeliverablesSnapshot(targetClient.id, periodStart, nextMonthStart)

    return {
      ready: true,
      missing: null,
      month,
      year,
      clientName: targetClient.businessName || targetClient.name,
      message: null,
      metricsFormUrl: null,
      metrics: currentMetrics,
      prevMetrics: prevMetrics || null,
      deliverables,
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
      previousReportId?: string
      gbpCalls?: number
      gbpDirections?: number
      gbpViews?: number
      gbpWebsiteClicks?: number
      prevGbpCalls?: number
      prevGbpDirections?: number
      prevGbpViews?: number
      prevGbpWebsiteClicks?: number
      gbpRating?: number
      gbpReviewCount?: number
      gbpReviewsCount?: number
      prevGbpReviewsCount?: number
      gscClicks?: number
      gscImpressions?: number
      gscCtr?: number | string
      gscPosition?: number | string
      prevGscClicks?: number
      prevGscImpressions?: number
      prevGscCtr?: number | string
      prevGscPosition?: number | string
      gaUsers?: number
      gaNewUsers?: number
      gaEngagementRate?: number | string
      gaSessions?: number
      gaViews?: number
      prevGaUsers?: number
      prevGaNewUsers?: number
      prevGaEngagementRate?: number | string
      prevGaSessions?: number
      prevGaViews?: number
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
      primaryColor: targetClient.primaryColor || '#2563eb',
      secondaryColor: targetClient.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(targetClient.isWhiteLabel),
      partnerName: targetClient.partnerName ?? null,
      partnerLogoUrl: targetClient.partnerLogoUrl ?? null,
    }

    const reviewsCount = Number(data.gbpReviewsCount ?? data.gbpReviewCount) || 0

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
        gbpCalls: Number(data.gbpCalls) || 0,
        gbpDirections: Number(data.gbpDirections) || 0,
        gbpViews: Number(data.gbpViews) || 0,
        gbpWebsiteClicks: Number(data.gbpWebsiteClicks ?? data.gbpViews) || 0,
        // GBP Previous
        prevGbpCalls: Number(data.prevGbpCalls) || 0,
        prevGbpDirections: Number(data.prevGbpDirections) || 0,
        prevGbpViews: Number(data.prevGbpViews) || 0,
        prevGbpWebsiteClicks: Number(data.prevGbpWebsiteClicks ?? data.prevGbpViews) || 0,
        // GBP Reputation
        gbpRating: parseDecimalValue(data.gbpRating || 5.0),
        gbpReviewCount: reviewsCount,
        gbpReviewsCount: reviewsCount,
        prevGbpReviewsCount: Number(data.prevGbpReviewsCount) || 0,
        // GSC Current
        gscClicks: Number(data.gscClicks) || 0,
        gscImpressions: Number(data.gscImpressions) || 0,
        gscCtr: parseDecimalValue(data.gscCtr),
        gscPosition: parseDecimalValue(data.gscPosition),
        // GSC Previous
        prevGscClicks: Number(data.prevGscClicks) || 0,
        prevGscImpressions: Number(data.prevGscImpressions) || 0,
        prevGscCtr: parseDecimalValue(data.prevGscCtr),
        prevGscPosition: parseDecimalValue(data.prevGscPosition),
        // GA4 Current
        gaUsers: Number(data.gaUsers) || 0,
        gaNewUsers: Number(data.gaNewUsers) || 0,
        gaEngagementRate: parseDecimalValue(data.gaEngagementRate),
        gaSessions: Number(data.gaSessions) || 0,
        gaViews: Number(data.gaViews) || 0,
        // GA4 Previous
        prevGaUsers: Number(data.prevGaUsers) || 0,
        prevGaNewUsers: Number(data.prevGaNewUsers) || 0,
        prevGaEngagementRate: parseDecimalValue(data.prevGaEngagementRate),
        prevGaSessions: Number(data.prevGaSessions) || 0,
        prevGaViews: Number(data.prevGaViews) || 0,
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

    // Collect fresh deliverables snapshot
    const deliverablesSnapshot = await collectDeliverablesSnapshot(existing.clientId, periodStart, nextMonthStart)

    // Update client branding snapshot
    const clientSnapshot: ClientSnapshot = {
      businessName: targetClient.businessName || targetClient.name,
      name: targetClient.name || null,
      websiteUrl: targetClient.websiteUrl || null,
      logoUrl: targetClient.logoUrl ?? null,
      primaryColor: targetClient.primaryColor || '#2563eb',
      secondaryColor: targetClient.secondaryColor || '#1e293b',
      isWhiteLabel: Boolean(targetClient.isWhiteLabel),
      partnerName: targetClient.partnerName ?? null,
      partnerLogoUrl: targetClient.partnerLogoUrl ?? null,
    }

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
        // GBP Current (from monthly_metrics or fallback to existing)
        gbpCalls: currentMetrics.gbpCalls ?? existing.gbpCalls ?? 0,
        gbpDirections: currentMetrics.gbpDirections ?? existing.gbpDirections ?? 0,
        gbpViews: currentMetrics.gbpViews ?? existing.gbpViews ?? 0,
        gbpWebsiteClicks: currentMetrics.gbpWebsiteClicks ?? existing.gbpWebsiteClicks ?? 0,
        // GBP Previous
        prevGbpCalls: prevMetrics?.gbpCalls ?? existing.prevGbpCalls ?? 0,
        prevGbpDirections: prevMetrics?.gbpDirections ?? existing.prevGbpDirections ?? 0,
        prevGbpViews: prevMetrics?.gbpViews ?? existing.prevGbpViews ?? 0,
        prevGbpWebsiteClicks: prevMetrics?.gbpWebsiteClicks ?? existing.prevGbpWebsiteClicks ?? 0,
        // Reputation
        gbpRating: currentMetrics.gbpRating ?? existing.gbpRating ?? 5.0,
        gbpReviewCount: currentMetrics.gbpReviewsCount ?? existing.gbpReviewCount ?? 0,
        gbpReviewsCount: currentMetrics.gbpReviewsCount ?? existing.gbpReviewsCount ?? 0,
        prevGbpReviewsCount: prevMetrics?.gbpReviewsCount ?? existing.prevGbpReviewsCount ?? 0,
        // GSC Current
        gscClicks: currentMetrics.gscClicks ?? existing.gscClicks ?? 0,
        gscImpressions: currentMetrics.gscImpressions ?? existing.gscImpressions ?? 0,
        gscCtr: currentMetrics.gscCtr ?? existing.gscCtr ?? 0,
        gscPosition: currentMetrics.gscPosition ?? existing.gscPosition ?? 0,
        // GSC Previous
        prevGscClicks: prevMetrics?.gscClicks ?? existing.prevGscClicks ?? 0,
        prevGscImpressions: prevMetrics?.gscImpressions ?? existing.prevGscImpressions ?? 0,
        prevGscCtr: prevMetrics?.gscCtr ?? existing.prevGscCtr ?? 0,
        prevGscPosition: prevMetrics?.gscPosition ?? existing.prevGscPosition ?? 0,
        // GA4 Current
        gaUsers: currentMetrics.gaUsers ?? existing.gaUsers ?? 0,
        gaNewUsers: currentMetrics.gaNewUsers ?? existing.gaNewUsers ?? 0,
        gaEngagementRate: currentMetrics.gaEngagementRate ?? existing.gaEngagementRate ?? 0,
        gaSessions: currentMetrics.gaSessions ?? existing.gaSessions ?? 0,
        gaViews: currentMetrics.gaViews ?? existing.gaViews ?? 0,
        // GA4 Previous
        prevGaUsers: prevMetrics?.gaUsers ?? existing.prevGaUsers ?? 0,
        prevGaNewUsers: prevMetrics?.gaNewUsers ?? existing.prevGaNewUsers ?? 0,
        prevGaEngagementRate: prevMetrics?.gaEngagementRate ?? existing.prevGaEngagementRate ?? 0,
        prevGaSessions: prevMetrics?.gaSessions ?? existing.prevGaSessions ?? 0,
        prevGaViews: prevMetrics?.gaViews ?? existing.prevGaViews ?? 0,
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
      previousReportId?: string
      gbpCalls?: number
      gbpDirections?: number
      gbpViews?: number
      gbpWebsiteClicks?: number
      prevGbpCalls?: number
      prevGbpDirections?: number
      prevGbpViews?: number
      prevGbpWebsiteClicks?: number
      gbpRating?: number
      gbpReviewCount?: number
      gbpReviewsCount?: number
      prevGbpReviewsCount?: number
      gscClicks?: number
      gscImpressions?: number
      gscCtr?: number | string
      gscPosition?: number | string
      prevGscClicks?: number
      prevGscImpressions?: number
      prevGscCtr?: number | string
      prevGscPosition?: number | string
      gaUsers?: number
      gaNewUsers?: number
      gaEngagementRate?: number | string
      gaSessions?: number
      gaViews?: number
      prevGaUsers?: number
      prevGaNewUsers?: number
      prevGaEngagementRate?: number | string
      prevGaSessions?: number
      prevGaViews?: number
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

    const clientSnapshot: ClientSnapshot | undefined = clientRow
      ? {
          businessName: clientRow.businessName || clientRow.name,
          name: clientRow.name || null,
          websiteUrl: clientRow.websiteUrl || null,
          logoUrl: clientRow.logoUrl ?? null,
          primaryColor: clientRow.primaryColor || '#2563eb',
          secondaryColor: clientRow.secondaryColor || '#1e293b',
          isWhiteLabel: Boolean(clientRow.isWhiteLabel),
          partnerName: clientRow.partnerName || null,
          partnerLogoUrl: clientRow.partnerLogoUrl || null,
        }
      : undefined

    const reviewsCount = Number(data.gbpReviewsCount ?? data.gbpReviewCount) || 0

    const updatePayload: Record<string, any> = {
      clientId: data.clientId.trim(),
      title: data.title.trim(),
      reportMonth: data.reportMonth.trim(),
      periodStart,
      periodEnd,
      ...(clientSnapshot ? { clientSnapshot } : {}),
      previousReportId: data.previousReportId || null,
      // GBP Current
      gbpCalls: Number(data.gbpCalls) || 0,
      gbpDirections: Number(data.gbpDirections) || 0,
      gbpViews: Number(data.gbpViews) || 0,
      gbpWebsiteClicks: Number(data.gbpWebsiteClicks ?? data.gbpViews) || 0,
      // GBP Previous
      prevGbpCalls: Number(data.prevGbpCalls) || 0,
      prevGbpDirections: Number(data.prevGbpDirections) || 0,
      prevGbpViews: Number(data.prevGbpViews) || 0,
      prevGbpWebsiteClicks: Number(data.prevGbpWebsiteClicks ?? data.prevGbpViews) || 0,
      // GBP Reputation
      gbpRating: parseDecimalValue(data.gbpRating || 5.0),
      gbpReviewCount: reviewsCount,
      gbpReviewsCount: reviewsCount,
      prevGbpReviewsCount: Number(data.prevGbpReviewsCount) || 0,
      // GSC Current
      gscClicks: Number(data.gscClicks) || 0,
      gscImpressions: Number(data.gscImpressions) || 0,
      gscCtr: parseDecimalValue(data.gscCtr),
      gscPosition: parseDecimalValue(data.gscPosition),
      // GSC Previous
      prevGscClicks: Number(data.prevGscClicks) || 0,
      prevGscImpressions: Number(data.prevGscImpressions) || 0,
      prevGscCtr: parseDecimalValue(data.prevGscCtr),
      prevGscPosition: parseDecimalValue(data.prevGscPosition),
      // GA4 Current
      gaUsers: Number(data.gaUsers) || 0,
      gaNewUsers: Number(data.gaNewUsers) || 0,
      gaEngagementRate: parseDecimalValue(data.gaEngagementRate),
      gaSessions: Number(data.gaSessions) || 0,
      gaViews: Number(data.gaViews) || 0,
      // GA4 Previous
      prevGaUsers: Number(data.prevGaUsers) || 0,
      prevGaNewUsers: Number(data.prevGaNewUsers) || 0,
      prevGaEngagementRate: parseDecimalValue(data.prevGaEngagementRate),
      prevGaSessions: Number(data.prevGaSessions) || 0,
      prevGaViews: Number(data.prevGaViews) || 0,
      // Deep Metric Tables
      topQueries: Array.isArray(data.topQueries) ? data.topQueries : [],
      topPages: Array.isArray(data.topPages) ? data.topPages : [],
      // Narrative Fields
      summaryTitle: data.summaryTitle?.trim() || 'Performance Highlights & Strategic Updates',
      summary: data.summary?.trim() || null,
      workCompleted: data.workCompleted?.trim() || null,
      nextSteps: data.nextSteps?.trim() || null,
    }

    if (clientRow) {
      updatePayload.clientSnapshot = {
        businessName: clientRow.businessName || clientRow.name,
        name: clientRow.name || null,
        websiteUrl: clientRow.websiteUrl || null,
        logoUrl: clientRow.logoUrl ?? null,
        primaryColor: clientRow.primaryColor || '#2563eb',
        secondaryColor: clientRow.secondaryColor || '#1e293b',
        isWhiteLabel: Boolean(clientRow.isWhiteLabel),
        partnerName: clientRow.partnerName ?? null,
        partnerLogoUrl: clientRow.partnerLogoUrl ?? null,
      }
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



