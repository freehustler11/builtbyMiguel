import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and } from 'drizzle-orm'
import { db, clients, reports, type Report, type Client } from '../db'
import { getSessionData } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'admin_session'

export interface QueryItem {
  query: string
  clicks: number
  impressions: number
  position: number
}

export interface PageItem {
  path: string
  clicks: number
  users: number
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
}

/**
 * Server Function: Get all reports with associated client branding info (Admin only)
 */
export const getReportsServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { clientId?: string }) => {
    return data || {}
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized access: Admin role required')
    }

    let query = db
      .select({
        id: reports.id,
        clientId: reports.clientId,
        title: reports.title,
        reportMonth: reports.reportMonth,
        previousReportId: reports.previousReportId,
        // GBP Metrics
        gbpCalls: reports.gbpCalls,
        gbpDirections: reports.gbpDirections,
        gbpViews: reports.gbpViews,
        prevGbpCalls: reports.prevGbpCalls,
        prevGbpDirections: reports.prevGbpDirections,
        prevGbpViews: reports.prevGbpViews,
        gbpRating: reports.gbpRating,
        gbpReviewCount: reports.gbpReviewCount,
        // GSC Metrics
        gscClicks: reports.gscClicks,
        gscImpressions: reports.gscImpressions,
        gscPosition: reports.gscPosition,
        prevGscClicks: reports.prevGscClicks,
        prevGscImpressions: reports.prevGscImpressions,
        prevGscPosition: reports.prevGscPosition,
        // GA4 Metrics
        gaUsers: reports.gaUsers,
        gaSessions: reports.gaSessions,
        gaViews: reports.gaViews,
        prevGaUsers: reports.prevGaUsers,
        prevGaSessions: reports.prevGaSessions,
        prevGaViews: reports.prevGaViews,
        // Deep Metric Tables
        topQueries: reports.topQueries,
        topPages: reports.topPages,
        // Narrative Fields
        summary: reports.summary,
        workCompleted: reports.workCompleted,
        nextSteps: reports.nextSteps,
        createdAt: reports.createdAt,
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
      .innerJoin(clients, eq(reports.clientId, clients.id))
      .orderBy(desc(reports.createdAt))

    if (data?.clientId) {
      // @ts-expect-error drizzle query builder with where
      query = query.where(eq(reports.clientId, data.clientId))
    }

    const rows = await query
    return { reports: rows as ReportWithClient[] }
  })

/**
 * Server Function: Get the most recent report for a client (for auto-filling comparison data)
 */
export const getLatestReportForClientServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized access')
    }

    const [latest] = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, data.clientId))
      .orderBy(desc(reports.createdAt))
      .limit(1)

    return { report: latest || null }
  })

/**
 * Server Function: Get a single report by ID with client branding
 */
export const getReportByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session) {
      throw new Error('Unauthorized access')
    }

    const [row] = await db
      .select({
        report: reports,
        client: clients,
      })
      .from(reports)
      .innerJoin(clients, eq(reports.clientId, clients.id))
      .where(eq(reports.id, data.id))

    if (!row) {
      throw new Error('Report not found')
    }

    // Role-based security check
    if (session.role === 'client' && session.clientId !== row.report.clientId) {
      throw new Error('Unauthorized: You do not have permission to view this report')
    }

    return { report: row.report, client: row.client }
  })

/**
 * Server Function: Get reports for the authenticated client's portal
 */
export const getPortalReportsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session) {
      throw new Error('Unauthorized access: Please log in')
    }

    let targetClientId = session.clientId

    // If admin is viewing portal without specific clientId, pick the first client
    if (session.role === 'admin' && !targetClientId) {
      const [firstClient] = await db.select().from(clients).limit(1)
      if (firstClient) {
        targetClientId = firstClient.id
      }
    }

    if (!targetClientId) {
      return { client: null, reports: [] }
    }

    const [client] = await db.select().from(clients).where(eq(clients.id, targetClientId))
    if (!client) {
      throw new Error('Client profile not found')
    }

    const clientReports = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, targetClientId))
      .orderBy(desc(reports.createdAt))

    return {
      client,
      reports: clientReports,
    }
  }
)

/**
 * Server Function: Create a new report (Admin only)
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
      prevGbpCalls?: number
      prevGbpDirections?: number
      prevGbpViews?: number
      gbpRating?: number
      gbpReviewCount?: number
      gscClicks?: number
      gscImpressions?: number
      gscPosition?: number
      prevGscClicks?: number
      prevGscImpressions?: number
      prevGscPosition?: number
      gaUsers?: number
      gaSessions?: number
      gaViews?: number
      prevGaUsers?: number
      prevGaSessions?: number
      prevGaViews?: number
      topQueries?: QueryItem[]
      topPages?: PageItem[]
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
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const [created] = await db
      .insert(reports)
      .values({
        clientId: data.clientId.trim(),
        title: data.title.trim(),
        reportMonth: data.reportMonth.trim(),
        previousReportId: data.previousReportId || null,
        // GBP Current
        gbpCalls: Number(data.gbpCalls) || 0,
        gbpDirections: Number(data.gbpDirections) || 0,
        gbpViews: Number(data.gbpViews) || 0,
        // GBP Previous
        prevGbpCalls: Number(data.prevGbpCalls) || 0,
        prevGbpDirections: Number(data.prevGbpDirections) || 0,
        prevGbpViews: Number(data.prevGbpViews) || 0,
        // GBP Reputation
        gbpRating: Number(data.gbpRating) || 5.0,
        gbpReviewCount: Number(data.gbpReviewCount) || 0,
        // GSC Current
        gscClicks: Number(data.gscClicks) || 0,
        gscImpressions: Number(data.gscImpressions) || 0,
        gscPosition: Number(data.gscPosition) || 0,
        // GSC Previous
        prevGscClicks: Number(data.prevGscClicks) || 0,
        prevGscImpressions: Number(data.prevGscImpressions) || 0,
        prevGscPosition: Number(data.prevGscPosition) || 0,
        // GA4 Current
        gaUsers: Number(data.gaUsers) || 0,
        gaSessions: Number(data.gaSessions) || 0,
        gaViews: Number(data.gaViews) || 0,
        // GA4 Previous
        prevGaUsers: Number(data.prevGaUsers) || 0,
        prevGaSessions: Number(data.prevGaSessions) || 0,
        prevGaViews: Number(data.prevGaViews) || 0,
        // Deep Metric Tables
        topQueries: Array.isArray(data.topQueries) ? data.topQueries : [],
        topPages: Array.isArray(data.topPages) ? data.topPages : [],
        // Narrative Fields
        summary: data.summary?.trim() || null,
        workCompleted: data.workCompleted?.trim() || null,
        nextSteps: data.nextSteps?.trim() || null,
      })
      .returning()

    return { success: true, report: created }
  })

/**
 * Server Function: Update an existing report (Admin only)
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
      prevGbpCalls?: number
      prevGbpDirections?: number
      prevGbpViews?: number
      gbpRating?: number
      gbpReviewCount?: number
      gscClicks?: number
      gscImpressions?: number
      gscPosition?: number
      prevGscClicks?: number
      prevGscImpressions?: number
      prevGscPosition?: number
      gaUsers?: number
      gaSessions?: number
      gaViews?: number
      prevGaUsers?: number
      prevGaSessions?: number
      prevGaViews?: number
      topQueries?: QueryItem[]
      topPages?: PageItem[]
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
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const [updated] = await db
      .update(reports)
      .set({
        clientId: data.clientId.trim(),
        title: data.title.trim(),
        reportMonth: data.reportMonth.trim(),
        previousReportId: data.previousReportId || null,
        // GBP Current
        gbpCalls: Number(data.gbpCalls) || 0,
        gbpDirections: Number(data.gbpDirections) || 0,
        gbpViews: Number(data.gbpViews) || 0,
        // GBP Previous
        prevGbpCalls: Number(data.prevGbpCalls) || 0,
        prevGbpDirections: Number(data.prevGbpDirections) || 0,
        prevGbpViews: Number(data.prevGbpViews) || 0,
        // GBP Reputation
        gbpRating: Number(data.gbpRating) || 5.0,
        gbpReviewCount: Number(data.gbpReviewCount) || 0,
        // GSC Current
        gscClicks: Number(data.gscClicks) || 0,
        gscImpressions: Number(data.gscImpressions) || 0,
        gscPosition: Number(data.gscPosition) || 0,
        // GSC Previous
        prevGscClicks: Number(data.prevGscClicks) || 0,
        prevGscImpressions: Number(data.prevGscImpressions) || 0,
        prevGscPosition: Number(data.prevGscPosition) || 0,
        // GA4 Current
        gaUsers: Number(data.gaUsers) || 0,
        gaSessions: Number(data.gaSessions) || 0,
        gaViews: Number(data.gaViews) || 0,
        // GA4 Previous
        prevGaUsers: Number(data.prevGaUsers) || 0,
        prevGaSessions: Number(data.prevGaSessions) || 0,
        prevGaViews: Number(data.prevGaViews) || 0,
        // Deep Metric Tables
        topQueries: Array.isArray(data.topQueries) ? data.topQueries : [],
        topPages: Array.isArray(data.topPages) ? data.topPages : [],
        // Narrative Fields
        summary: data.summary?.trim() || null,
        workCompleted: data.workCompleted?.trim() || null,
        nextSteps: data.nextSteps?.trim() || null,
      })
      .where(eq(reports.id, data.id))
      .returning()

    return { success: true, report: updated }
  })

/**
 * Server Function: Delete a report (Admin only)
 */
export const deleteReportServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const session = await getSessionData(token)
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    await db.delete(reports).where(eq(reports.id, data.id))
    return { success: true }
  })

