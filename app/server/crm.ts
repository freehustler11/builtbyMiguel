import { createServerFn } from '@tanstack/react-start'
import { desc, asc, eq, and, or, isNull, isNotNull, inArray, sql } from 'drizzle-orm'
import {
  db,
  clients,
  users,
  landingPages,
  clientArticles,
  keywords,
  keywordRankHistory,
  tasks,
  monthlyMetrics,
  type LandingPage,
  type ClientArticle,
  type Keyword,
  type Task,
  type MonthlyMetric,
} from '../db'
export type { MonthlyMetric }
import { assertActiveSession, getEffectivePartnerId, type ActiveSession } from './auth'

/**
 * Helper: Verify client ownership and tenant isolation.
 * Throws an error if client does not belong to the caller's partner agency.
 */
async function assertClientAccess(
  clientId: string,
  auth: ActiveSession,
  effectivePartnerId: string | null
) {
  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
  const [clientRecord] = await db
    .select({
      id: clients.id,
      name: clients.name,
      businessName: clients.businessName,
      partnerId: clients.partnerId,
      deletedAt: clients.deletedAt,
    })
    .from(clients)
    .where(and(eq(clients.id, clientId), isNull(clients.deletedAt)))

  if (!clientRecord) {
    throw new Error('Client not found')
  }

  if (!isSuperadmin && clientRecord.partnerId !== effectivePartnerId) {
    throw new Error('Unauthorized: Client does not belong to your agency')
  }

  return clientRecord
}

/**
 * Resolve effective target partner ID for queries:
 * Superadmin can pass partnerId; partner/staff is strictly scoped to own agency.
 */
function resolveQueryPartnerId(auth: ActiveSession, requestedPartnerId?: string): string | null {
  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
  if (isSuperadmin && requestedPartnerId) {
    return requestedPartnerId
  }
  return getEffectivePartnerId(auth)
}

// =================================================================
// 1. LANDING PAGES
// =================================================================

export interface LandingPageItem extends LandingPage {
  clientName?: string
  clientBusinessName?: string
  assigneeName?: string | null
  assigneeEmail?: string | null
}

export const getLandingPagesServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { clientId?: string; partnerId?: string }) => data || {})
  .handler(async ({ data }): Promise<LandingPageItem[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to agencies and administrators')
    }

    const effectivePartnerId = resolveQueryPartnerId(auth, data?.partnerId)

    if (data?.clientId) {
      await assertClientAccess(data.clientId, auth, effectivePartnerId)
    }

    const query = db
      .select({
        id: landingPages.id,
        clientId: landingPages.clientId,
        title: landingPages.title,
        targetUrl: landingPages.targetUrl,
        focusKeyword: landingPages.focusKeyword,
        ctaGoal: landingPages.ctaGoal,
        status: landingPages.status,
        wentLiveAt: landingPages.wentLiveAt,
        assignedTo: landingPages.assignedTo,
        createdAt: landingPages.createdAt,
        updatedAt: landingPages.updatedAt,
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
          isNull(clients.deletedAt),
          data?.clientId
            ? eq(landingPages.clientId, data.clientId)
            : effectivePartnerId
              ? eq(clients.partnerId, effectivePartnerId)
              : sql`1=1`
        )
      )
      .orderBy(desc(landingPages.createdAt))

    return (await query) as LandingPageItem[]
  })

export const createLandingPageServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      title: string
      targetUrl?: string
      focusKeyword?: string
      ctaGoal?: string
      assignedTo?: string
      status?: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable creation restricted')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isLive = data.status === 'live'

    const [created] = await db
      .insert(landingPages)
      .values({
        clientId: data.clientId,
        title: data.title.trim(),
        targetUrl: data.targetUrl?.trim() || null,
        focusKeyword: data.focusKeyword?.trim() || null,
        ctaGoal: data.ctaGoal?.trim() || null,
        assignedTo: data.assignedTo || null,
        status: data.status || 'planning',
        wentLiveAt: isLive ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return created
  })

export const updateLandingPageStatusServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      status: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
      liveUrl?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable updates restricted')
    }

    const [existing] = await db
      .select({
        id: landingPages.id,
        clientId: landingPages.clientId,
        status: landingPages.status,
        wentLiveAt: landingPages.wentLiveAt,
      })
      .from(landingPages)
      .where(eq(landingPages.id, data.id))

    if (!existing) {
      throw new Error('Landing page not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isTransitioningToLive = data.status === 'live' && existing.status !== 'live'

    const [updated] = await db
      .update(landingPages)
      .set({
        status: data.status,
        targetUrl: data.liveUrl?.trim() || undefined,
        wentLiveAt: isTransitioningToLive ? now : existing.wentLiveAt,
        updatedAt: now,
      })
      .where(eq(landingPages.id, data.id))
      .returning()

    return updated
  })

export const updateLandingPageServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      title: string
      targetUrl?: string
      focusKeyword?: string
      ctaGoal?: string
      assignedTo?: string | null
      status: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable updates restricted')
    }

    const [existing] = await db
      .select({
        id: landingPages.id,
        clientId: landingPages.clientId,
        status: landingPages.status,
        wentLiveAt: landingPages.wentLiveAt,
      })
      .from(landingPages)
      .where(eq(landingPages.id, data.id))

    if (!existing) {
      throw new Error('Landing page not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isTransitioningToLive = data.status === 'live' && existing.status !== 'live'

    const [updated] = await db
      .update(landingPages)
      .set({
        title: data.title.trim(),
        targetUrl: data.targetUrl?.trim() || null,
        focusKeyword: data.focusKeyword?.trim() || null,
        ctaGoal: data.ctaGoal?.trim() || null,
        assignedTo: data.assignedTo || null,
        status: data.status,
        wentLiveAt: isTransitioningToLive ? now : existing.wentLiveAt,
        updatedAt: now,
      })
      .where(eq(landingPages.id, data.id))
      .returning()

    return updated
  })

export const deleteLandingPageServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deletion restricted')
    }

    const [existing] = await db
      .select({ id: landingPages.id, clientId: landingPages.clientId })
      .from(landingPages)
      .where(eq(landingPages.id, data.id))

    if (!existing) {
      throw new Error('Landing page not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    await db.delete(landingPages).where(eq(landingPages.id, data.id))
    return { success: true }
  })

// =================================================================
// 2. CLIENT ARTICLES (NOT "blogs" — deliverable articles)
// =================================================================

export interface ClientArticleItem extends ClientArticle {
  clientName?: string
  clientBusinessName?: string
  writerName?: string | null
  writerEmail?: string | null
}

export const getClientArticlesServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { clientId?: string; partnerId?: string }) => data || {})
  .handler(async ({ data }): Promise<ClientArticleItem[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to agencies and administrators')
    }

    const effectivePartnerId = resolveQueryPartnerId(auth, data?.partnerId)

    if (data?.clientId) {
      await assertClientAccess(data.clientId, auth, effectivePartnerId)
    }

    const query = db
      .select({
        id: clientArticles.id,
        clientId: clientArticles.clientId,
        title: clientArticles.title,
        draftUrl: clientArticles.draftUrl,
        liveUrl: clientArticles.liveUrl,
        targetKeyword: clientArticles.targetKeyword,
        status: clientArticles.status,
        publishedAt: clientArticles.publishedAt,
        writerId: clientArticles.writerId,
        createdAt: clientArticles.createdAt,
        updatedAt: clientArticles.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        writerName: users.name,
        writerEmail: users.email,
      })
      .from(clientArticles)
      .innerJoin(clients, eq(clientArticles.clientId, clients.id))
      .leftJoin(users, eq(clientArticles.writerId, users.id))
      .where(
        and(
          isNull(clients.deletedAt),
          data?.clientId
            ? eq(clientArticles.clientId, data.clientId)
            : effectivePartnerId
              ? eq(clients.partnerId, effectivePartnerId)
              : sql`1=1`
        )
      )
      .orderBy(desc(clientArticles.createdAt))

    return (await query) as ClientArticleItem[]
  })

export const createClientArticleServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      title: string
      draftUrl?: string
      liveUrl?: string
      targetKeyword?: string
      writerId?: string
      status?: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable creation restricted')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isLive = data.status === 'live'

    const [created] = await db
      .insert(clientArticles)
      .values({
        clientId: data.clientId,
        title: data.title.trim(),
        draftUrl: data.draftUrl?.trim() || null,
        liveUrl: data.liveUrl?.trim() || null,
        targetKeyword: data.targetKeyword?.trim() || null,
        writerId: data.writerId || null,
        status: data.status || 'idea',
        publishedAt: isLive ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return created
  })

export const updateClientArticleStatusServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      status: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
      liveUrl?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable updates restricted')
    }

    const [existing] = await db
      .select({
        id: clientArticles.id,
        clientId: clientArticles.clientId,
        status: clientArticles.status,
        publishedAt: clientArticles.publishedAt,
      })
      .from(clientArticles)
      .where(eq(clientArticles.id, data.id))

    if (!existing) {
      throw new Error('Article not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isTransitioningToLive = data.status === 'live' && existing.status !== 'live'

    const [updated] = await db
      .update(clientArticles)
      .set({
        status: data.status,
        liveUrl: data.liveUrl?.trim() || undefined,
        publishedAt: isTransitioningToLive ? now : existing.publishedAt,
        updatedAt: now,
      })
      .where(eq(clientArticles.id, data.id))
      .returning()

    return updated
  })

export const updateClientArticleServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      title: string
      draftUrl?: string
      liveUrl?: string
      targetKeyword?: string
      writerId?: string | null
      status: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deliverable updates restricted')
    }

    const [existing] = await db
      .select({
        id: clientArticles.id,
        clientId: clientArticles.clientId,
        status: clientArticles.status,
        publishedAt: clientArticles.publishedAt,
      })
      .from(clientArticles)
      .where(eq(clientArticles.id, data.id))

    if (!existing) {
      throw new Error('Article not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    const now = new Date()
    const isTransitioningToLive = data.status === 'live' && existing.status !== 'live'

    const [updated] = await db
      .update(clientArticles)
      .set({
        title: data.title.trim(),
        draftUrl: data.draftUrl?.trim() || null,
        liveUrl: data.liveUrl?.trim() || null,
        targetKeyword: data.targetKeyword?.trim() || null,
        writerId: data.writerId || null,
        status: data.status,
        publishedAt: isTransitioningToLive ? now : existing.publishedAt,
        updatedAt: now,
      })
      .where(eq(clientArticles.id, data.id))
      .returning()

    return updated
  })

export const deleteClientArticleServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deletion restricted')
    }

    const [existing] = await db
      .select({ id: clientArticles.id, clientId: clientArticles.clientId })
      .from(clientArticles)
      .where(eq(clientArticles.id, data.id))

    if (!existing) {
      throw new Error('Article not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    await db.delete(clientArticles).where(eq(clientArticles.id, data.id))
    return { success: true }
  })

// =================================================================
// 3. KEYWORDS & RANK HISTORY
// =================================================================

export interface KeywordItem extends Keyword {
  clientName?: string
  clientBusinessName?: string
  movement?: number | null // positive = improved (+ places), negative = dropped
}

export const getKeywordsServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      clientId?: string
      partnerId?: string
      status?: 'research' | 'targeting_next' | 'in_progress' | 'ranking'
      sort?: string
      order?: 'asc' | 'desc'
    }) => data || {}
  )
  .handler(async ({ data }): Promise<KeywordItem[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to agencies and administrators')
    }

    const effectivePartnerId = resolveQueryPartnerId(auth, data?.partnerId)

    if (data?.clientId) {
      await assertClientAccess(data.clientId, auth, effectivePartnerId)
    }

    const isDesc = data?.order === 'desc'
    let orderClause = desc(keywords.createdAt)

    if (data?.sort === 'keyword') {
      orderClause = isDesc
        ? sql`lower(${keywords.keyword}) desc`
        : sql`lower(${keywords.keyword}) asc`
    } else if (data?.sort === 'volume') {
      orderClause = isDesc
        ? sql`${keywords.searchVolume} desc nulls last`
        : sql`${keywords.searchVolume} asc nulls last`
    } else if (data?.sort === 'rank') {
      orderClause = isDesc
        ? sql`${keywords.currentRank} desc nulls last`
        : sql`${keywords.currentRank} asc nulls last`
    } else if (data?.sort === 'location') {
      orderClause = isDesc
        ? sql`lower(${keywords.location}) desc nulls last`
        : sql`lower(${keywords.location}) asc nulls last`
    }

    const rows = await db
      .select({
        id: keywords.id,
        clientId: keywords.clientId,
        keyword: keywords.keyword,
        location: keywords.location,
        searchVolume: keywords.searchVolume,
        estimatedTraffic: keywords.estimatedTraffic,
        currentRank: keywords.currentRank,
        previousRank: keywords.previousRank,
        targetUrl: keywords.targetUrl,
        status: keywords.status,
        createdAt: keywords.createdAt,
        updatedAt: keywords.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
      })
      .from(keywords)
      .innerJoin(clients, eq(keywords.clientId, clients.id))
      .where(
        and(
          isNull(clients.deletedAt),
          data?.clientId
            ? eq(keywords.clientId, data.clientId)
            : effectivePartnerId
              ? eq(clients.partnerId, effectivePartnerId)
              : sql`1=1`,
          data?.status ? eq(keywords.status, data.status) : sql`1=1`
        )
      )
      .orderBy(orderClause)

    return rows.map((r) => {
      let movement: number | null = null
      if (r.currentRank !== null && r.previousRank !== null) {
        // rank improvement: previousRank 10 -> currentRank 4 means +6 improvement
        movement = r.previousRank - r.currentRank
      }
      return {
        ...r,
        movement,
      }
    })
  })

export const createKeywordServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      keyword: string
      location?: string
      searchVolume?: number
      estimatedTraffic?: number
      currentRank?: number
      targetUrl?: string
      status?: 'research' | 'targeting_next' | 'in_progress' | 'ranking'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Keyword creation restricted')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    const now = new Date()
    const [created] = await db
      .insert(keywords)
      .values({
        clientId: data.clientId,
        keyword: data.keyword.trim(),
        location: data.location?.trim() || null,
        searchVolume: data.searchVolume ?? null,
        estimatedTraffic: data.estimatedTraffic ?? null,
        currentRank: data.currentRank ?? null,
        previousRank: null,
        targetUrl: data.targetUrl?.trim() || null,
        status: data.status || 'research',
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    // If initial rank provided, record into history
    if (created.currentRank) {
      await db
        .insert(keywordRankHistory)
        .values({
          keywordId: created.id,
          month: now.getUTCMonth() + 1,
          year: now.getUTCFullYear(),
          rank: created.currentRank,
          recordedAt: now,
        })
        .onConflictDoUpdate({
          target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
          set: {
            rank: created.currentRank,
            recordedAt: now,
          },
        })
    }

    return created
  })

export const updateKeywordServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      keyword: string
      location?: string
      searchVolume?: number
      estimatedTraffic?: number
      currentRank?: number
      targetUrl?: string
      status: 'research' | 'targeting_next' | 'in_progress' | 'ranking'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Keyword updates restricted')
    }

    const [existing] = await db
      .select()
      .from(keywords)
      .where(eq(keywords.id, data.id))

    if (!existing) {
      throw new Error('Keyword not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    const now = new Date()
    const rankChanged = data.currentRank !== undefined && data.currentRank !== existing.currentRank
    const newPrevRank = rankChanged ? existing.currentRank : existing.previousRank

    const [updated] = await db
      .update(keywords)
      .set({
        keyword: data.keyword.trim(),
        location: data.location?.trim() || null,
        searchVolume: data.searchVolume ?? null,
        estimatedTraffic: data.estimatedTraffic ?? null,
        currentRank: data.currentRank ?? null,
        previousRank: newPrevRank,
        targetUrl: data.targetUrl?.trim() || null,
        status: data.status,
        updatedAt: now,
      })
      .where(eq(keywords.id, data.id))
      .returning()

    if (rankChanged && data.currentRank) {
      await db
        .insert(keywordRankHistory)
        .values({
          keywordId: updated.id,
          month: now.getUTCMonth() + 1,
          year: now.getUTCFullYear(),
          rank: data.currentRank,
          recordedAt: now,
        })
        .onConflictDoUpdate({
          target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
          set: {
            rank: data.currentRank,
            recordedAt: now,
          },
        })
    }

    return updated
  })

export const deleteKeywordServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deletion restricted')
    }

    const [existing] = await db
      .select({ id: keywords.id, clientId: keywords.clientId })
      .from(keywords)
      .where(eq(keywords.id, data.id))

    if (!existing) {
      throw new Error('Keyword not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(existing.clientId, auth, effectivePartnerId)

    await db.delete(keywords).where(eq(keywords.id, data.id))
    return { success: true }
  })

// =================================================================
// 4. TASKS & DELIVERABLES (Nullable client_id for internal agency work)
// =================================================================

export interface TaskItem extends Task {
  clientName?: string | null
  clientBusinessName?: string | null
  assigneeName?: string | null
  assigneeEmail?: string | null
}

export const getTasksServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      clientId?: string
      partnerId?: string
      category?: string
      status?: 'todo' | 'done'
    }) => data || {}
  )
  .handler(async ({ data }): Promise<TaskItem[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to agencies and administrators')
    }

    const effectivePartnerId = resolveQueryPartnerId(auth, data?.partnerId)

    if (data?.clientId) {
      await assertClientAccess(data.clientId, auth, effectivePartnerId)
    }

    const query = db
      .select({
        id: tasks.id,
        clientId: tasks.clientId,
        partnerId: tasks.partnerId,
        title: tasks.title,
        category: tasks.category,
        status: tasks.status,
        completedAt: tasks.completedAt,
        assignedTo: tasks.assignedTo,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        assigneeName: users.name,
        assigneeEmail: users.email,
      })
      .from(tasks)
      .leftJoin(clients, and(eq(tasks.clientId, clients.id), isNull(clients.deletedAt)))
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(
        and(
          data?.clientId
            ? eq(tasks.clientId, data.clientId)
            : effectivePartnerId
              ? eq(tasks.partnerId, effectivePartnerId)
              : sql`1=1`,
          // If task has a clientId, client must not be soft-deleted
          or(isNull(tasks.clientId), isNotNull(clients.id)),
          data?.category && data.category !== 'all' ? eq(tasks.category, data.category as any) : sql`1=1`,
          data?.status ? eq(tasks.status, data.status) : sql`1=1`
        )
      )
      .orderBy(asc(tasks.status), desc(tasks.createdAt))

    return (await query) as TaskItem[]
  })

export const createTaskServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId?: string | null
      title: string
      category: 'citations' | 'technical_seo' | 'on_page' | 'backlinks' | 'schema' | 'gbp'
      assignedTo?: string | null
      status?: 'todo' | 'done'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Task creation restricted')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    let partnerId = effectivePartnerId

    if (data.clientId) {
      const clientRecord = await assertClientAccess(data.clientId, auth, effectivePartnerId)
      if (!partnerId && clientRecord.partnerId) {
        partnerId = clientRecord.partnerId
      }
    }

    if (!partnerId) {
      // Superadmin internal task default
      partnerId = auth.userId || ''
    }

    if (!partnerId) {
      throw new Error('Partner ID required for task creation')
    }

    const now = new Date()
    const isDone = data.status === 'done'

    const [created] = await db
      .insert(tasks)
      .values({
        clientId: data.clientId || null,
        partnerId,
        title: data.title.trim(),
        category: data.category,
        assignedTo: data.assignedTo || null,
        status: data.status || 'todo',
        completedAt: isDone ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return created
  })

export const updateTaskStatusServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      status: 'todo' | 'done'
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Task updates restricted')
    }

    const [existing] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, data.id))

    if (!existing) {
      throw new Error('Task not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    if (!isSuperadmin && existing.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: Task does not belong to your agency')
    }

    const now = new Date()
    const isNowDone = data.status === 'done' && existing.status !== 'done'

    const [updated] = await db
      .update(tasks)
      .set({
        status: data.status,
        completedAt: isNowDone ? now : data.status === 'todo' ? null : existing.completedAt,
        updatedAt: now,
      })
      .where(eq(tasks.id, data.id))
      .returning()

    return updated
  })

export const updateTaskServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      title: string
      category: 'citations' | 'technical_seo' | 'on_page' | 'backlinks' | 'schema' | 'gbp'
      assignedTo?: string | null
      status: 'todo' | 'done'
      clientId?: string | null
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Task updates restricted')
    }

    const [existing] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, data.id))

    if (!existing) {
      throw new Error('Task not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    if (!isSuperadmin && existing.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: Task does not belong to your agency')
    }

    if (data.clientId) {
      await assertClientAccess(data.clientId, auth, effectivePartnerId)
    }

    const now = new Date()
    const isNowDone = data.status === 'done' && existing.status !== 'done'

    const [updated] = await db
      .update(tasks)
      .set({
        title: data.title.trim(),
        category: data.category,
        clientId: data.clientId === undefined ? existing.clientId : data.clientId || null,
        assignedTo: data.assignedTo || null,
        status: data.status,
        completedAt: isNowDone ? now : data.status === 'todo' ? null : existing.completedAt,
        updatedAt: now,
      })
      .where(eq(tasks.id, data.id))
      .returning()

    return updated
  })

export const deleteTaskServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Deletion restricted')
    }

    const [existing] = await db
      .select({ id: tasks.id, partnerId: tasks.partnerId })
      .from(tasks)
      .where(eq(tasks.id, data.id))

    if (!existing) {
      throw new Error('Task not found')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    if (!isSuperadmin && existing.partnerId !== effectivePartnerId) {
      throw new Error('Unauthorized: Task does not belong to your agency')
    }

    await db.delete(tasks).where(eq(tasks.id, data.id))
    return { success: true }
  })

// =================================================================
// 5. MY WORK (Cross-client user assignments)
// =================================================================

export interface MyWorkData {
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
  landingPages: LandingPageItem[]
  articles: ClientArticleItem[]
  tasks: TaskItem[]
  counts: {
    totalAssigned: number
    pendingTasks: number
    inProgressDeliverables: number
    completedDeliverables: number
  }
}

export const getMyWorkServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<MyWorkData> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to agencies and administrators')
    }

    const userId = auth.userId
    if (!userId) {
      throw new Error('Unauthorized: User ID required')
    }

    // 1. Landing pages assigned to user
    const userLps = await db
      .select({
        id: landingPages.id,
        clientId: landingPages.clientId,
        title: landingPages.title,
        targetUrl: landingPages.targetUrl,
        focusKeyword: landingPages.focusKeyword,
        ctaGoal: landingPages.ctaGoal,
        status: landingPages.status,
        wentLiveAt: landingPages.wentLiveAt,
        assignedTo: landingPages.assignedTo,
        createdAt: landingPages.createdAt,
        updatedAt: landingPages.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        assigneeName: users.name,
        assigneeEmail: users.email,
      })
      .from(landingPages)
      .innerJoin(clients, eq(landingPages.clientId, clients.id))
      .leftJoin(users, eq(landingPages.assignedTo, users.id))
      .where(and(eq(landingPages.assignedTo, userId), isNull(clients.deletedAt)))
      .orderBy(desc(landingPages.updatedAt))

    // 2. Client articles where writer is user
    const userArticles = await db
      .select({
        id: clientArticles.id,
        clientId: clientArticles.clientId,
        title: clientArticles.title,
        draftUrl: clientArticles.draftUrl,
        liveUrl: clientArticles.liveUrl,
        targetKeyword: clientArticles.targetKeyword,
        status: clientArticles.status,
        publishedAt: clientArticles.publishedAt,
        writerId: clientArticles.writerId,
        createdAt: clientArticles.createdAt,
        updatedAt: clientArticles.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        writerName: users.name,
        writerEmail: users.email,
      })
      .from(clientArticles)
      .innerJoin(clients, eq(clientArticles.clientId, clients.id))
      .leftJoin(users, eq(clientArticles.writerId, users.id))
      .where(and(eq(clientArticles.writerId, userId), isNull(clients.deletedAt)))
      .orderBy(desc(clientArticles.updatedAt))

    // 3. Tasks assigned to user
    const userTasks = await db
      .select({
        id: tasks.id,
        clientId: tasks.clientId,
        partnerId: tasks.partnerId,
        title: tasks.title,
        category: tasks.category,
        status: tasks.status,
        completedAt: tasks.completedAt,
        assignedTo: tasks.assignedTo,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        clientName: clients.name,
        clientBusinessName: clients.businessName,
        assigneeName: users.name,
        assigneeEmail: users.email,
      })
      .from(tasks)
      .leftJoin(clients, and(eq(tasks.clientId, clients.id), isNull(clients.deletedAt)))
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(eq(tasks.assignedTo, userId))
      .orderBy(asc(tasks.status), desc(tasks.updatedAt))

    const pendingTasks = userTasks.filter((t) => t.status === 'todo').length
    const liveLps = userLps.filter((lp) => lp.status === 'live').length
    const liveArticles = userArticles.filter((a) => a.status === 'live').length
    const doneTasks = userTasks.filter((t) => t.status === 'done').length

    const inProgressDeliverables =
      userLps.filter((lp) => lp.status !== 'live').length +
      userArticles.filter((a) => a.status !== 'live').length +
      pendingTasks

    return {
      user: {
        id: userId,
        name: auth.email ? auth.email.split('@')[0] : 'User',
        email: auth.email || '',
        role: auth.role || '',
      },
      landingPages: userLps as LandingPageItem[],
      articles: userArticles as ClientArticleItem[],
      tasks: userTasks as TaskItem[],
      counts: {
        totalAssigned: userLps.length + userArticles.length + userTasks.length,
        pendingTasks,
        inProgressDeliverables,
        completedDeliverables: liveLps + liveArticles + doneTasks,
      },
    }
  }
)

// =================================================================
// 6. AGENCY TEAM PICKER (Scoped to caller's partner agency)
// =================================================================

export interface TeamPickerMember {
  id: string
  name: string | null
  email: string
  role: string
}

export const getAgencyTeamPickerServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { partnerId?: string }) => data || {})
  .handler(async ({ data }): Promise<TeamPickerMember[]> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized')
    }

    const effectivePartnerId = resolveQueryPartnerId(auth, data?.partnerId)
    if (!effectivePartnerId) {
      // Superadmin without partnerId: return self
      return [
        {
          id: auth.userId || '',
          name: auth.email ? auth.email.split('@')[0] : 'User',
          email: auth.email || '',
          role: auth.role || '',
        },
      ]
    }

    // Return the agency partner owner plus all active staff members
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          eq(users.isActive, true),
          sql`(${users.id} = ${effectivePartnerId} OR (${users.partnerId} = ${effectivePartnerId} AND ${users.role} = 'partner_employee'))`
        )
      )
      .orderBy(sql`coalesce(lower(${users.name}), lower(${users.email})) asc`)

    return members
  })

import { recordMonthlyMetrics, type MonthlyMetricsInput } from './metrics'
export type { MonthlyMetricsInput }

export const getMonthlyMetricsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { clientId: string; month: number; year: number }) => data)
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot view CRM monthly metrics')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    const clientRecord = await assertClientAccess(data.clientId, auth, effectivePartnerId)

    // Compute previous month
    const prevMonth = data.month === 1 ? 12 : data.month - 1
    const prevYear = data.month === 1 ? data.year - 1 : data.year

    const [currentRecord] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, data.clientId),
          eq(monthlyMetrics.month, data.month),
          eq(monthlyMetrics.year, data.year)
        )
      )

    const [previousRecord] = await db
      .select()
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, data.clientId),
          eq(monthlyMetrics.month, prevMonth),
          eq(monthlyMetrics.year, prevYear)
        )
      )

    return {
      client: {
        id: clientRecord.id,
        name: clientRecord.name,
        businessName: clientRecord.businessName,
      },
      current: currentRecord || null,
      previous: previousRecord || null,
      month: data.month,
      year: data.year,
      prevMonth,
      prevYear,
    }
  })

export const saveMonthlyMetricsServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      month: number
      year: number
      metrics: MonthlyMetricsInput
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot enter monthly metrics')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    return await recordMonthlyMetrics({
      clientId: data.clientId,
      month: data.month,
      year: data.year,
      metrics: data.metrics,
      auth,
      isSystemSync: false,
    })
  })

export interface SemrushCsvRowInput {
  keyword: string
  rank?: number | null
  searchVolume?: number | null
  targetUrl?: string | null
}

export interface SemrushPreviewMatchedItem {
  keywordId: string
  keyword: string
  targetUrl: string | null
  oldCurrentRank: number | null
  newCurrentRank: number | null
  oldPreviousRank: number | null
  newPreviousRank: number | null
  rankDelta: number | null // positive = rank improved (e.g. from 10 to 4 is +6)
  oldVolume: number | null
  newVolume: number | null
  status: string
}

export interface SemrushPreviewUnmatchedItem {
  keyword: string
  rank: number | null
  searchVolume: number | null
  targetUrl: string | null
}

export const previewSemrushCsvServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      month: number
      year: number
      rows: SemrushCsvRowInput[]
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot import keywords')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    const existingKeywords = await db
      .select()
      .from(keywords)
      .where(eq(keywords.clientId, data.clientId))

    const existingMap = new Map<string, Keyword>()
    for (const kw of existingKeywords) {
      existingMap.set(kw.keyword.trim().toLowerCase(), kw)
    }

    const matched: SemrushPreviewMatchedItem[] = []
    const unmatched: SemrushPreviewUnmatchedItem[] = []
    const processedKeys = new Set<string>()

    for (const row of data.rows) {
      if (!row.keyword || !row.keyword.trim()) continue
      const cleanKw = row.keyword.trim()
      const key = cleanKw.toLowerCase()

      if (processedKeys.has(key)) continue
      processedKeys.add(key)

      const newRank =
        row.rank !== undefined && row.rank !== null && !isNaN(Number(row.rank)) && Number(row.rank) > 0
          ? Math.round(Number(row.rank))
          : null
      const newVolume =
        row.searchVolume !== undefined && row.searchVolume !== null && !isNaN(Number(row.searchVolume))
          ? Math.round(Number(row.searchVolume))
          : null

      if (existingMap.has(key)) {
        const existing = existingMap.get(key)!
        const oldCurrentRank = existing.currentRank
        const oldPreviousRank = existing.previousRank
        const newPreviousRank = oldCurrentRank
        const rankDelta =
          oldCurrentRank !== null && newRank !== null ? oldCurrentRank - newRank : null

        matched.push({
          keywordId: existing.id,
          keyword: existing.keyword,
          targetUrl: row.targetUrl?.trim() || existing.targetUrl,
          oldCurrentRank,
          newCurrentRank: newRank,
          oldPreviousRank,
          newPreviousRank,
          rankDelta,
          oldVolume: existing.searchVolume,
          newVolume,
          status: existing.status,
        })
      } else {
        unmatched.push({
          keyword: cleanKw,
          rank: newRank,
          searchVolume: newVolume,
          targetUrl: row.targetUrl?.trim() || null,
        })
      }
    }

    const stats = {
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      improvedCount: matched.filter((m) => m.rankDelta !== null && m.rankDelta > 0).length,
      declinedCount: matched.filter((m) => m.rankDelta !== null && m.rankDelta < 0).length,
      unchangedCount: matched.filter((m) => m.rankDelta !== null && m.rankDelta === 0).length,
    }

    return {
      matched,
      unmatched,
      stats,
      month: data.month,
      year: data.year,
    }
  })

export const commitSemrushCsvImportServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      clientId: string
      month: number
      year: number
      matched: Array<{
        keywordId: string
        newRank: number | null
        newVolume: number | null
        targetUrl?: string | null
      }>
      createUnmatched: boolean
      unmatchedKeywords: Array<{
        keyword: string
        rank?: number | null
        searchVolume?: number | null
        targetUrl?: string | null
      }>
    }) => data
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client role cannot import keywords')
    }

    const effectivePartnerId = getEffectivePartnerId(auth)
    await assertClientAccess(data.clientId, auth, effectivePartnerId)

    const now = new Date()
    let updatedCount = 0

    // 1. Update matched keywords
    for (const item of data.matched) {
      const [existing] = await db
        .select()
        .from(keywords)
        .where(and(eq(keywords.id, item.keywordId), eq(keywords.clientId, data.clientId)))

      if (!existing) continue

      const oldCurrent = existing.currentRank
      const newRank = item.newRank !== undefined ? item.newRank : oldCurrent
      const newPrevRank = oldCurrent !== null ? oldCurrent : existing.previousRank

      const [updated] = await db
        .update(keywords)
        .set({
          previousRank: newPrevRank,
          currentRank: newRank,
          searchVolume: item.newVolume !== undefined ? item.newVolume : existing.searchVolume,
          targetUrl: item.targetUrl?.trim() || existing.targetUrl,
          updatedAt: now,
        })
        .where(eq(keywords.id, item.keywordId))
        .returning()

      // Record in rank history
      if (newRank !== null) {
        await db
          .insert(keywordRankHistory)
          .values({
            keywordId: updated.id,
            month: data.month,
            year: data.year,
            rank: newRank,
            recordedAt: now,
          })
          .onConflictDoUpdate({
            target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
            set: {
              rank: newRank,
              recordedAt: now,
            },
          })
      }
      updatedCount++
    }

    // 2. Create unmatched keywords if explicitly opted-in
    let createdCount = 0
    if (data.createUnmatched && Array.isArray(data.unmatchedKeywords) && data.unmatchedKeywords.length > 0) {
      for (const item of data.unmatchedKeywords) {
        if (!item.keyword || !item.keyword.trim()) continue

        const [created] = await db
          .insert(keywords)
          .values({
            clientId: data.clientId,
            keyword: item.keyword.trim(),
            currentRank: item.rank ?? null,
            previousRank: null,
            searchVolume: item.searchVolume ?? null,
            targetUrl: item.targetUrl?.trim() || null,
            status: 'research',
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        if (created.currentRank !== null) {
          await db
            .insert(keywordRankHistory)
            .values({
              keywordId: created.id,
              month: data.month,
              year: data.year,
              rank: created.currentRank,
              recordedAt: now,
            })
            .onConflictDoUpdate({
              target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
              set: {
                rank: created.currentRank,
                recordedAt: now,
              },
            })
        }
        createdCount++
      }
    }

    return {
      success: true,
      updatedCount,
      createdCount,
    }
  })
