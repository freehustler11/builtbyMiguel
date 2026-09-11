import { eq, and, inArray } from 'drizzle-orm'
import {
  db,
  monthlyMetrics,
  clientLocations,
  locationMonthlyMetrics,
  type MonthlyMetric,
  type LocationMonthlyMetric,
  type ClientLocation,
} from '../db'
import type { ActiveSession } from './auth'

export interface LocationMonthlyMetricsInput {
  locationId: string
  gbpCalls?: number | null
  gbpViews?: number | null
  gbpDirections?: number | null
  gbpWebsiteClicks?: number | null
  gbpRating?: number | null
  gbpReviewsCount?: number | null
}

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
  locationMetrics?: LocationMonthlyMetricsInput[]
}

export type { MonthlyMetric, LocationMonthlyMetric, ClientLocation }

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

  // 1. Fetch active locations for client
  const activeLocations = await db
    .select()
    .from(clientLocations)
    .where(and(eq(clientLocations.clientId, clientId), eq(clientLocations.isActive, true)))

  const locMap = new Map<string, ClientLocation>(activeLocations.map((l) => [l.id, l]))

  // 2. If locationMetrics array provided, upsert each active location's metrics
  if (Array.isArray(metrics.locationMetrics) && metrics.locationMetrics.length > 0) {
    for (const lm of metrics.locationMetrics) {
      const loc = locMap.get(lm.locationId)
      if (!loc) continue // Skip non-matching or inactive location

      const isConnected = loc.accessStatus === 'connected'

      await db
        .insert(locationMonthlyMetrics)
        .values({
          locationId: lm.locationId,
          month,
          year,
          gbpCalls: isConnected ? (lm.gbpCalls ?? null) : null,
          gbpViews: isConnected ? (lm.gbpViews ?? null) : null,
          gbpDirections: isConnected ? (lm.gbpDirections ?? null) : null,
          gbpWebsiteClicks: isConnected ? (lm.gbpWebsiteClicks ?? null) : null,
          gbpRating: isConnected ? (lm.gbpRating ?? null) : null,
          gbpReviewsCount: isConnected ? (lm.gbpReviewsCount ?? null) : null,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [locationMonthlyMetrics.locationId, locationMonthlyMetrics.month, locationMonthlyMetrics.year],
          set: {
            gbpCalls: isConnected ? (lm.gbpCalls ?? null) : null,
            gbpViews: isConnected ? (lm.gbpViews ?? null) : null,
            gbpDirections: isConnected ? (lm.gbpDirections ?? null) : null,
            gbpWebsiteClicks: isConnected ? (lm.gbpWebsiteClicks ?? null) : null,
            gbpRating: isConnected ? (lm.gbpRating ?? null) : null,
            gbpReviewsCount: isConnected ? (lm.gbpReviewsCount ?? null) : null,
            updatedAt: now,
          },
        })
    }
  }

  // 3. Query all location metrics for active locations to calculate rolled-up GBP figures
  let finalGbpCalls = metrics.gbpCalls ?? null
  let finalGbpViews = metrics.gbpViews ?? null
  let finalGbpDirections = metrics.gbpDirections ?? null
  let finalGbpWebsiteClicks = metrics.gbpWebsiteClicks ?? null
  let finalGbpRating = metrics.gbpRating ?? null
  let finalGbpReviewsCount = metrics.gbpReviewsCount ?? null

  if (activeLocations.length > 0) {
    const locIds = activeLocations.map((l) => l.id)
    const storedLocMetrics = await db
      .select()
      .from(locationMonthlyMetrics)
      .where(
        and(
          eq(locationMonthlyMetrics.month, month),
          eq(locationMonthlyMetrics.year, year),
          inArray(locationMonthlyMetrics.locationId, locIds)
        )
      )

    // Calculate rolled-up totals strictly from connected locations
    const connectedLocIds = new Set(
      activeLocations.filter((l) => l.accessStatus === 'connected').map((l) => l.id)
    )

    let sumCalls: number | null = null
    let sumViews: number | null = null
    let sumDirections: number | null = null
    let sumClicks: number | null = null
    let sumReviews: number | null = null
    let ratingSum = 0
    let ratingCount = 0

    for (const sm of storedLocMetrics) {
      if (!connectedLocIds.has(sm.locationId)) continue

      if (sm.gbpCalls !== null) {
        sumCalls = (sumCalls ?? 0) + sm.gbpCalls
      }
      if (sm.gbpViews !== null) {
        sumViews = (sumViews ?? 0) + sm.gbpViews
      }
      if (sm.gbpDirections !== null) {
        sumDirections = (sumDirections ?? 0) + sm.gbpDirections
      }
      if (sm.gbpWebsiteClicks !== null) {
        sumClicks = (sumClicks ?? 0) + sm.gbpWebsiteClicks
      }
      if (sm.gbpReviewsCount !== null) {
        sumReviews = (sumReviews ?? 0) + sm.gbpReviewsCount
      }
      if (sm.gbpRating !== null && sm.gbpRating > 0) {
        ratingSum += Number(sm.gbpRating)
        ratingCount++
      }
    }

    if (storedLocMetrics.length > 0) {
      finalGbpCalls = sumCalls
      finalGbpViews = sumViews
      finalGbpDirections = sumDirections
      finalGbpWebsiteClicks = sumClicks
      finalGbpReviewsCount = sumReviews
      finalGbpRating = ratingCount > 0 ? parseFloat((ratingSum / ratingCount).toFixed(2)) : null
    }
  }

  // 4. Upsert into site-level monthlyMetrics
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
      gbpCalls: finalGbpCalls,
      gbpViews: finalGbpViews,
      gbpDirections: finalGbpDirections,
      gbpWebsiteClicks: finalGbpWebsiteClicks,
      gbpRating: finalGbpRating,
      gbpReviewsCount: finalGbpReviewsCount,
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
        gbpCalls: finalGbpCalls,
        gbpViews: finalGbpViews,
        gbpDirections: finalGbpDirections,
        gbpWebsiteClicks: finalGbpWebsiteClicks,
        gbpRating: finalGbpRating,
        gbpReviewsCount: finalGbpReviewsCount,
        semrushAuthorityScore: metrics.semrushAuthorityScore ?? null,
        semrushRankedKeywords: metrics.semrushRankedKeywords ?? null,
        updatedAt: now,
      },
    })
    .returning()

  return upserted
}
