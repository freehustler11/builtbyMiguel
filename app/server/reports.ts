import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, sql } from 'drizzle-orm'
import { db, clients, reports, users, type Report, type Client, type ClientSnapshot } from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'
import { logActivity } from './activity-logger'

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

export function parseReportPeriod(monthStr: string): { periodStart: Date; periodEnd: Date } {
  if (!monthStr || typeof monthStr !== 'string') {
    const now = new Date()
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999))
    return { periodStart: start, periodEnd: end }
  }

  const parts = monthStr.trim().split(/\s+/)
  if (parts.length === 2) {
    const mName = parts[0].toLowerCase()
    const year = parseInt(parts[1], 10)
    if (mName in MONTHS && !isNaN(year)) {
      const monthIdx = MONTHS[mName]
      const start = new Date(Date.UTC(year, monthIdx, 1, 0, 0, 0, 0))
      const end = new Date(Date.UTC(year, monthIdx + 1, 0, 23, 59, 59, 999))
      return { periodStart: start, periodEnd: end }
    }
  }

  const parsed = new Date(monthStr)
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getUTCFullYear()
    const m = parsed.getUTCMonth()
    return {
      periodStart: new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)),
      periodEnd: new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999)),
    }
  }

  const now = new Date()
  return {
    periodStart: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)),
    periodEnd: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)),
  }
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
export function parseDecimalValue(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  const cleaned = String(val).replace(/[^0-9.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

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
        createdByUserId: reports.createdByUserId,
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
      .orderBy(sql`${reports.periodStart} desc nulls last`)

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
      .orderBy(sql`${reports.periodStart} desc nulls last`)

    // Strictly internal: never expose createdByUserId to client portal
    const sanitizedReports = clientReports.map(({ createdByUserId: _omitted, ...rest }) => rest)

    return {
      client,
      reports: sanitizedReports,
    }
  }
)

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

    const { periodStart, periodEnd } = parseReportPeriod(data.reportMonth)
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

    const reviewsCount = Number(data.gbpReviewsCount ?? data.gbpReviewCount) || 0

    const updatePayload: Record<string, any> = {
      clientId: data.clientId.trim(),
      title: data.title.trim(),
      reportMonth: data.reportMonth.trim(),
      periodStart,
      periodEnd,
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


