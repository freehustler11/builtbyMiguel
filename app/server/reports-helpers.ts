import { desc, eq, and, gte, lt, inArray } from 'drizzle-orm'
import {
  db,
  landingPages,
  clientArticles,
  tasks,
  keywords,
  keywordRankHistory,
  type DeliverablesSnapshot,
} from '../db'

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

export function parseReportPeriod(monthStr: string): { periodStart: Date; periodEnd: Date; nextMonthStart: Date; month: number; year: number } {
  const now = new Date()
  let y = now.getUTCFullYear()
  let m = now.getUTCMonth()

  if (monthStr && typeof monthStr === 'string') {
    const parts = monthStr.trim().split(/\s+/)
    if (parts.length === 2) {
      const mName = parts[0].toLowerCase()
      const year = parseInt(parts[1], 10)
      if (mName in MONTHS && !isNaN(year)) {
        m = MONTHS[mName]
        y = year
      }
    } else {
      const parsed = new Date(monthStr)
      if (!isNaN(parsed.getTime())) {
        y = parsed.getUTCFullYear()
        m = parsed.getUTCMonth()
      }
    }
  }

  const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999))
  const nextMonthStart = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0, 0))

  return { periodStart: start, periodEnd: end, nextMonthStart, month: m + 1, year: y }
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

/**
 * Helper function: Fetch all period-scoped deliverables and freeze into DeliverablesSnapshot
 * Applies half-open interval convention: >= periodStart AND < nextMonthStart
 */
export async function collectDeliverablesSnapshot(
  clientId: string,
  periodStart: Date,
  nextMonthStart: Date
): Promise<DeliverablesSnapshot> {
  // 1. Landing pages: status = 'live' and wentLiveAt within [periodStart, nextMonthStart)
  const livePages = await db
    .select({
      id: landingPages.id,
      title: landingPages.title,
      targetUrl: landingPages.targetUrl,
      wentLiveAt: landingPages.wentLiveAt,
    })
    .from(landingPages)
    .where(
      and(
        eq(landingPages.clientId, clientId),
        eq(landingPages.status, 'live'),
        gte(landingPages.wentLiveAt, periodStart),
        lt(landingPages.wentLiveAt, nextMonthStart)
      )
    )

  // 2. Client articles: status = 'live' and publishedAt within [periodStart, nextMonthStart)
  const liveArticles = await db
    .select({
      id: clientArticles.id,
      title: clientArticles.title,
      liveUrl: clientArticles.liveUrl,
      publishedAt: clientArticles.publishedAt,
    })
    .from(clientArticles)
    .where(
      and(
        eq(clientArticles.clientId, clientId),
        eq(clientArticles.status, 'live'),
        gte(clientArticles.publishedAt, periodStart),
        lt(clientArticles.publishedAt, nextMonthStart)
      )
    )

  // 3. Tasks: status = 'done' and completedAt within [periodStart, nextMonthStart) and clientId = report client
  // Strictly excludes internal tasks where clientId is null!
  const doneTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      category: tasks.category,
      completedAt: tasks.completedAt,
    })
    .from(tasks)
    .where(
      and(
        eq(tasks.clientId, clientId),
        eq(tasks.status, 'done'),
        gte(tasks.completedAt, periodStart),
        lt(tasks.completedAt, nextMonthStart)
      )
    )

  // 4. Keywords: current state where status = 'targeting_next'
  const targetingKeywords = await db
    .select({
      id: keywords.id,
      keyword: keywords.keyword,
      searchVolume: keywords.searchVolume,
      currentRank: keywords.currentRank,
      previousRank: keywords.previousRank,
      targetUrl: keywords.targetUrl,
    })
    .from(keywords)
    .where(and(eq(keywords.clientId, clientId), eq(keywords.status, 'targeting_next')))

  // 5. Keyword rank history: trailing 6 months for client keywords
  let rankHistoryList: Array<{ keyword: string; month: number; year: number; rank: number | null }> = []
  if (targetingKeywords.length > 0) {
    const kwIds = targetingKeywords.map((k) => k.id)
    const kwMap = new Map<string, string>(targetingKeywords.map((k) => [k.id, k.keyword]))

    const historyRows = await db
      .select({
        keywordId: keywordRankHistory.keywordId,
        month: keywordRankHistory.month,
        year: keywordRankHistory.year,
        rank: keywordRankHistory.rank,
      })
      .from(keywordRankHistory)
      .where(inArray(keywordRankHistory.keywordId, kwIds))
      .orderBy(desc(keywordRankHistory.year), desc(keywordRankHistory.month))
      .limit(100)

    rankHistoryList = historyRows.map((h) => ({
      keyword: kwMap.get(h.keywordId) || '',
      month: h.month,
      year: h.year,
      rank: h.rank,
    }))
  }

  return {
    landingPages: livePages.map((p) => ({
      id: p.id,
      title: p.title,
      targetUrl: p.targetUrl || null,
      wentLiveAt: p.wentLiveAt ? p.wentLiveAt.toISOString() : null,
    })),
    articles: liveArticles.map((a) => ({
      id: a.id,
      title: a.title,
      liveUrl: a.liveUrl || null,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    })),
    tasks: doneTasks.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    })),
    nextKeywords: targetingKeywords.map((k) => ({
      id: k.id,
      keyword: k.keyword,
      searchVolume: k.searchVolume ?? null,
      currentRank: k.currentRank ?? null,
      previousRank: k.previousRank ?? null,
      targetUrl: k.targetUrl ?? null,
    })),
    keywordRankHistory: rankHistoryList,
  }
}
