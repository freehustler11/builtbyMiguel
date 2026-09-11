import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, or, inArray, sql } from 'drizzle-orm'
import {
  db,
  clients,
  reports,
  users,
  landingPages,
  clientArticles,
  tasks,
  monthlyMetrics,
  clientDataSources,
  activityLogs,
} from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export interface AssignedWorkItem {
  id: string
  clientId: string | null
  clientBusinessName: string
  title: string
  type: 'landing_page' | 'article' | 'task'
  status: string
  url?: string | null
  updatedAt: Date
}

export interface MissingKpiClient {
  clientId: string
  clientName: string
  businessName: string
  partnerName: string | null
  partnerId: string | null
  connectedSources: Array<'gsc' | 'ga4' | 'gbp'>
  hasMetricsRecord: boolean
}

export interface ReportDueItem {
  clientId: string
  clientName: string
  businessName: string
  partnerName: string | null
  partnerId: string | null
  isKpiEntered: boolean
}

export interface RecentActivityItem {
  id: string
  action: string
  userName: string | null
  userEmail: string | null
  role: string | null
  createdAt: Date
}

export interface AdminDashboardData {
  viewer: {
    userId: string
    role: string
    name: string | null
    email: string
  }
  period: {
    month: number
    year: number
    monthName: string
  }
  assignedWork: {
    items: AssignedWorkItem[]
    totalPending: number
    counts: {
      landingPages: number
      articles: number
      tasks: number
    }
  }
  missingKpis: {
    clients: MissingKpiClient[]
    count: number
  }
  reportsDue: {
    clients: ReportDueItem[]
    count: number
  }
  recentActivity: RecentActivityItem[]
  stats: {
    totalClients: number
    missingKpisCount: number
    reportsDueCount: number
    assignedWorkCount: number
  }
}

export const getAdminDashboardDataServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { month?: number; year?: number }) => {
    const now = new Date()
    const targetMonth = data?.month && data.month >= 1 && data.month <= 12
      ? Number(data.month)
      : now.getUTCMonth() + 1
    const targetYear = data?.year && data.year >= 2000
      ? Number(data.year)
      : now.getUTCFullYear()

    return {
      month: targetMonth,
      year: targetYear,
    }
  })
  .handler(async ({ data }): Promise<AdminDashboardData> => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Client accounts cannot access the admin dashboard')
    }

    const { month, year } = data
    const monthName = `${MONTH_NAMES[month - 1]} ${year}`
    const userId = auth.userId
    const effectivePartnerId = getEffectivePartnerId(auth)
    const isSuperadmin = auth.role === 'superadmin'

    // 1. WORK ASSIGNED TO VIEWER
    const userLps = userId
      ? await db
          .select({
            id: landingPages.id,
            clientId: landingPages.clientId,
            title: landingPages.title,
            status: landingPages.status,
            targetUrl: landingPages.targetUrl,
            draftUrl: landingPages.draftUrl,
            updatedAt: landingPages.updatedAt,
            clientBusinessName: clients.businessName,
          })
          .from(landingPages)
          .innerJoin(clients, eq(landingPages.clientId, clients.id))
          .where(
            and(
              eq(landingPages.assignedTo, userId),
              isNull(clients.deletedAt)
            )
          )
          .orderBy(desc(landingPages.updatedAt))
      : []

    const userArticles = userId
      ? await db
          .select({
            id: clientArticles.id,
            clientId: clientArticles.clientId,
            title: clientArticles.title,
            status: clientArticles.status,
            draftUrl: clientArticles.draftUrl,
            liveUrl: clientArticles.liveUrl,
            updatedAt: clientArticles.updatedAt,
            clientBusinessName: clients.businessName,
          })
          .from(clientArticles)
          .innerJoin(clients, eq(clientArticles.clientId, clients.id))
          .where(
            and(
              eq(clientArticles.writerId, userId),
              isNull(clients.deletedAt)
            )
          )
          .orderBy(desc(clientArticles.updatedAt))
      : []

    const userTasks = userId
      ? await db
          .select({
            id: tasks.id,
            clientId: tasks.clientId,
            title: tasks.title,
            status: tasks.status,
            category: tasks.category,
            updatedAt: tasks.updatedAt,
            clientBusinessName: clients.businessName,
          })
          .from(tasks)
          .innerJoin(clients, eq(tasks.clientId, clients.id))
          .where(
            and(
              eq(tasks.assignedTo, userId),
              isNull(clients.deletedAt)
            )
          )
          .orderBy(desc(tasks.updatedAt))
      : []

    // Compile assigned work items (pending items first)
    const assignedItems: AssignedWorkItem[] = [
      ...userLps
        .filter((lp) => lp.status !== 'live')
        .map((lp) => ({
          id: lp.id,
          clientId: lp.clientId,
          clientBusinessName: lp.clientBusinessName,
          title: lp.title,
          type: 'landing_page' as const,
          status: lp.status,
          url: lp.draftUrl || lp.targetUrl,
          updatedAt: lp.updatedAt,
        })),
      ...userArticles
        .filter((a) => a.status !== 'live')
        .map((a) => ({
          id: a.id,
          clientId: a.clientId,
          clientBusinessName: a.clientBusinessName,
          title: a.title,
          type: 'article' as const,
          status: a.status,
          url: a.draftUrl || a.liveUrl,
          updatedAt: a.updatedAt,
        })),
      ...userTasks
        .filter((t) => t.status !== 'done')
        .map((t) => ({
          id: t.id,
          clientId: t.clientId,
          clientBusinessName: t.clientBusinessName,
          title: t.title,
          type: 'task' as const,
          status: t.status,
          url: null,
          updatedAt: t.updatedAt,
        })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    // 2. ACTIVE CLIENTS SCOPING (Tenancy)
    const clientConditions = [isNull(clients.deletedAt)]
    if (!isSuperadmin) {
      clientConditions.push(eq(clients.partnerId, effectivePartnerId || '__NO_PARTNER__'))
    }

    const activeClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        businessName: clients.businessName,
        partnerId: clients.partnerId,
        partnerName: users.name,
        partnerEmail: users.email,
      })
      .from(clients)
      .leftJoin(users, eq(clients.partnerId, users.id))
      .where(and(...clientConditions))
      .orderBy(sql`lower(${clients.businessName}) asc`)

    const clientIds = activeClients.map((c) => c.id)

    // 3. MONTHLY METRICS FOR SELECTED PERIOD
    let metricsMap = new Map<string, typeof monthlyMetrics.$inferSelect>()
    if (clientIds.length > 0) {
      const metricsRows = await db
        .select()
        .from(monthlyMetrics)
        .where(
          and(
            inArray(monthlyMetrics.clientId, clientIds),
            eq(monthlyMetrics.month, month),
            eq(monthlyMetrics.year, year)
          )
        )
      for (const m of metricsRows) {
        metricsMap.set(m.clientId, m)
      }
    }

    // 4. DATA SOURCES STATUS FOR CLIENTS
    let sourcesMap = new Map<string, Array<'gsc' | 'ga4' | 'gbp'>>()
    if (clientIds.length > 0) {
      const sourceRows = await db
        .select()
        .from(clientDataSources)
        .where(inArray(clientDataSources.clientId, clientIds))

      for (const row of sourceRows) {
        if (row.status === 'connected') {
          const list = sourcesMap.get(row.clientId) || []
          list.push(row.source as 'gsc' | 'ga4' | 'gbp')
          sourcesMap.set(row.clientId, list)
        }
      }
    }

    // 5. EVALUATE CLIENTS MISSING KPIS
    const missingKpisList: MissingKpiClient[] = []
    for (const client of activeClients) {
      const record = metricsMap.get(client.id)
      // Check if metrics record is missing or completely empty of KPI numbers
      const isMissingOrEmpty =
        !record ||
        (record.gscClicks == null &&
          record.gaSessions == null &&
          record.gbpCalls == null &&
          record.gbpViews == null &&
          record.semrushAuthorityScore == null)

      if (isMissingOrEmpty) {
        missingKpisList.push({
          clientId: client.id,
          clientName: client.name,
          businessName: client.businessName,
          partnerName: client.partnerName || client.partnerEmail || null,
          partnerId: client.partnerId,
          connectedSources: sourcesMap.get(client.id) || ['gsc', 'ga4', 'gbp'],
          hasMetricsRecord: Boolean(record),
        })
      }
    }

    // 6. REPORTS DUE FOR SELECTED PERIOD
    let existingReportsSet = new Set<string>()
    if (clientIds.length > 0) {
      // Look for reports matching client and month name or start of period
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
      const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))

      const reportRows = await db
        .select({ clientId: reports.clientId, reportMonth: reports.reportMonth })
        .from(reports)
        .where(
          and(
            inArray(reports.clientId, clientIds),
            or(
              sql`lower(${reports.reportMonth}) = lower(${monthName})`,
              and(
                sql`${reports.periodStart} >= ${startOfMonth.toISOString()}::timestamptz`,
                sql`${reports.periodStart} < ${endOfMonth.toISOString()}::timestamptz`
              )
            )
          )
        )

      for (const r of reportRows) {
        if (r.clientId) {
          existingReportsSet.add(r.clientId)
        }
      }
    }

    const reportsDueList: ReportDueItem[] = []
    for (const client of activeClients) {
      if (!existingReportsSet.has(client.id)) {
        const hasKpi = metricsMap.has(client.id)
        reportsDueList.push({
          clientId: client.id,
          clientName: client.name,
          businessName: client.businessName,
          partnerName: client.partnerName || client.partnerEmail || null,
          partnerId: client.partnerId,
          isKpiEntered: hasKpi,
        })
      }
    }

    // 7. RECENT ACTIVITY (Superadmin only)
    let recentActivity: RecentActivityItem[] = []
    if (isSuperadmin) {
      const recentLogs = await db
        .select({
          id: activityLogs.id,
          action: activityLogs.action,
          userEmail: activityLogs.userEmail,
          createdAt: activityLogs.createdAt,
          userName: users.name,
          role: activityLogs.role,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(8)

      recentActivity = recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        userName: log.userName || null,
        userEmail: log.userEmail,
        role: log.role,
        createdAt: log.createdAt,
      }))
    }

    return {
      viewer: {
        userId: auth.userId || '',
        role: auth.role,
        name: auth.name || null,
        email: auth.email || '',
      },
      period: {
        month,
        year,
        monthName,
      },
      assignedWork: {
        items: assignedItems,
        totalPending: assignedItems.length,
        counts: {
          landingPages: userLps.filter((lp) => lp.status !== 'live').length,
          articles: userArticles.filter((a) => a.status !== 'live').length,
          tasks: userTasks.filter((t) => t.status !== 'done').length,
        },
      },
      missingKpis: {
        clients: missingKpisList,
        count: missingKpisList.length,
      },
      reportsDue: {
        clients: reportsDueList,
        count: reportsDueList.length,
      },
      recentActivity,
      stats: {
        totalClients: activeClients.length,
        missingKpisCount: missingKpisList.length,
        reportsDueCount: reportsDueList.length,
        assignedWorkCount: assignedItems.length,
      },
    }
  })
