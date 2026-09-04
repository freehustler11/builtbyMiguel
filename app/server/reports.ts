import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { db, clients, reports, type Report, type Client } from '../db'
import { verifySessionToken } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'admin_session'

export interface ReportWithClient extends Report {
  clientName: string
  clientBusinessName: string
  clientLogoUrl: string | null
  clientPrimaryColor: string | null
  clientSecondaryColor: string | null
  clientWebsiteUrl: string | null
}

/**
 * Server Function: Get all reports with associated client branding info
 */
export const getReportsServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { clientId?: string }) => {
    return data || {}
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    let query = db
      .select({
        id: reports.id,
        clientId: reports.clientId,
        title: reports.title,
        reportMonth: reports.reportMonth,
        gbpCalls: reports.gbpCalls,
        gbpDirections: reports.gbpDirections,
        gbpViews: reports.gbpViews,
        gscClicks: reports.gscClicks,
        gscImpressions: reports.gscImpressions,
        gscPosition: reports.gscPosition,
        gaUsers: reports.gaUsers,
        gaSessions: reports.gaSessions,
        gaViews: reports.gaViews,
        summary: reports.summary,
        workCompleted: reports.workCompleted,
        nextSteps: reports.nextSteps,
        createdAt: reports.createdAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        clientLogoUrl: clients.logoUrl,
        clientPrimaryColor: clients.primaryColor,
        clientSecondaryColor: clients.secondaryColor,
        clientWebsiteUrl: clients.websiteUrl,
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
 * Server Function: Get a single report by ID with client branding
 */
export const getReportByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
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

    return { report: row.report, client: row.client }
  })

/**
 * Server Function: Create a new report
 */
export const createReportServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      title: string
      reportMonth: string
      gbpCalls?: number
      gbpDirections?: number
      gbpViews?: number
      gscClicks?: number
      gscImpressions?: number
      gscPosition?: number
      gaUsers?: number
      gaSessions?: number
      gaViews?: number
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
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    const [created] = await db
      .insert(reports)
      .values({
        clientId: data.clientId.trim(),
        title: data.title.trim(),
        reportMonth: data.reportMonth.trim(),
        gbpCalls: Number(data.gbpCalls) || 0,
        gbpDirections: Number(data.gbpDirections) || 0,
        gbpViews: Number(data.gbpViews) || 0,
        gscClicks: Number(data.gscClicks) || 0,
        gscImpressions: Number(data.gscImpressions) || 0,
        gscPosition: Number(data.gscPosition) || 0,
        gaUsers: Number(data.gaUsers) || 0,
        gaSessions: Number(data.gaSessions) || 0,
        gaViews: Number(data.gaViews) || 0,
        summary: data.summary?.trim() || null,
        workCompleted: data.workCompleted?.trim() || null,
        nextSteps: data.nextSteps?.trim() || null,
      })
      .returning()

    return { success: true, report: created }
  })

/**
 * Server Function: Update an existing report
 */
export const updateReportServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      clientId: string
      title: string
      reportMonth: string
      gbpCalls?: number
      gbpDirections?: number
      gbpViews?: number
      gscClicks?: number
      gscImpressions?: number
      gscPosition?: number
      gaUsers?: number
      gaSessions?: number
      gaViews?: number
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
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    const [updated] = await db
      .update(reports)
      .set({
        clientId: data.clientId.trim(),
        title: data.title.trim(),
        reportMonth: data.reportMonth.trim(),
        gbpCalls: Number(data.gbpCalls) || 0,
        gbpDirections: Number(data.gbpDirections) || 0,
        gbpViews: Number(data.gbpViews) || 0,
        gscClicks: Number(data.gscClicks) || 0,
        gscImpressions: Number(data.gscImpressions) || 0,
        gscPosition: Number(data.gscPosition) || 0,
        gaUsers: Number(data.gaUsers) || 0,
        gaSessions: Number(data.gaSessions) || 0,
        gaViews: Number(data.gaViews) || 0,
        summary: data.summary?.trim() || null,
        workCompleted: data.workCompleted?.trim() || null,
        nextSteps: data.nextSteps?.trim() || null,
      })
      .where(eq(reports.id, data.id))
      .returning()

    return { success: true, report: updated }
  })

/**
 * Server Function: Delete a report
 */
export const deleteReportServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Report ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    await db.delete(reports).where(eq(reports.id, data.id))
    return { success: true }
  })
