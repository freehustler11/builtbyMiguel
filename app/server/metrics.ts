import { eq, and } from 'drizzle-orm'
import { db, monthlyMetrics, type MonthlyMetric } from '../db'
import type { ActiveSession } from './auth'

export interface MonthlyMetricsInput {
  gscClicks?: number | null
  gscImpressions?: number | null
  gscCtr?: number | null
  gscPosition?: number | null
  gaSessions?: number | null
  gaUsers?: number | null
  gaNewUsers?: number | null
  gaViews?: number | null
  gaEngagementRate?: number | null
  gbpCalls?: number | null
  gbpViews?: number | null
  gbpDirections?: number | null
  gbpWebsiteClicks?: number | null
  gbpRating?: number | null
  gbpReviewsCount?: number | null
  semrushAuthorityScore?: number | null
  semrushRankedKeywords?: number | null
}

export type { MonthlyMetric }

/**
 * Canonical service function: Future API Seam for monthly metrics ingestion.
 * Single entry surface called by:
 * 1) Manual Monthly KPI Form (saveMonthlyMetricsServerFn)
 * 2) Future automated Google OAuth sync jobs (GSC, GA4, GBP API sync)
 */
export async function recordMonthlyMetrics(params: {
  clientId: string
  month: number
  year: number
  metrics: MonthlyMetricsInput
  auth?: ActiveSession
  isSystemSync?: boolean
}): Promise<MonthlyMetric> {
  const { clientId, month, year, metrics } = params

  if (month < 1 || month > 12) {
    throw new Error('Invalid month: must be between 1 and 12')
  }
  if (year < 2000 || year > 2100) {
    throw new Error('Invalid year: must be between 2000 and 2100')
  }

  const now = new Date()

  const [upserted] = await db
    .insert(monthlyMetrics)
    .values({
      clientId,
      month,
      year,
      gscClicks: metrics.gscClicks ?? null,
      gscImpressions: metrics.gscImpressions ?? null,
      gscCtr: metrics.gscCtr ?? null,
      gscPosition: metrics.gscPosition ?? null,
      gaSessions: metrics.gaSessions ?? null,
      gaUsers: metrics.gaUsers ?? null,
      gaNewUsers: metrics.gaNewUsers ?? null,
      gaViews: metrics.gaViews ?? null,
      gaEngagementRate: metrics.gaEngagementRate ?? null,
      gbpCalls: metrics.gbpCalls ?? null,
      gbpViews: metrics.gbpViews ?? null,
      gbpDirections: metrics.gbpDirections ?? null,
      gbpWebsiteClicks: metrics.gbpWebsiteClicks ?? null,
      gbpRating: metrics.gbpRating ?? null,
      gbpReviewsCount: metrics.gbpReviewsCount ?? null,
      semrushAuthorityScore: metrics.semrushAuthorityScore ?? null,
      semrushRankedKeywords: metrics.semrushRankedKeywords ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [monthlyMetrics.clientId, monthlyMetrics.month, monthlyMetrics.year],
      set: {
        gscClicks: metrics.gscClicks ?? null,
        gscImpressions: metrics.gscImpressions ?? null,
        gscCtr: metrics.gscCtr ?? null,
        gscPosition: metrics.gscPosition ?? null,
        gaSessions: metrics.gaSessions ?? null,
        gaUsers: metrics.gaUsers ?? null,
        gaNewUsers: metrics.gaNewUsers ?? null,
        gaViews: metrics.gaViews ?? null,
        gaEngagementRate: metrics.gaEngagementRate ?? null,
        gbpCalls: metrics.gbpCalls ?? null,
        gbpViews: metrics.gbpViews ?? null,
        gbpDirections: metrics.gbpDirections ?? null,
        gbpWebsiteClicks: metrics.gbpWebsiteClicks ?? null,
        gbpRating: metrics.gbpRating ?? null,
        gbpReviewsCount: metrics.gbpReviewsCount ?? null,
        semrushAuthorityScore: metrics.semrushAuthorityScore ?? null,
        semrushRankedKeywords: metrics.semrushRankedKeywords ?? null,
        updatedAt: now,
      },
    })
    .returning()

  return upserted
}
