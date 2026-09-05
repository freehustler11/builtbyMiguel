import { createServerFn } from '@tanstack/react-start'
import { desc, eq, sql } from 'drizzle-orm'
import { db, activityLogs, users } from '../db'
import { assertActiveSession } from './auth'
import { parseDevice } from './activity-logger'

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'failed_login'
  | 'create_client'
  | 'delete_report'
  | 'create_report'

export interface ActivityLogItem {
  id: string
  userId: string | null
  userEmail: string | null
  userName?: string | null
  role: string | null
  action: ActivityAction | string
  ipAddress: string | null
  userAgent: string | null
  device: string
  createdAt: Date
}

export interface ActivityLogsResponse {
  logs: ActivityLogItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

function getActivityOrderBy(sort?: string, order: 'asc' | 'desc' = 'desc') {
  const isDesc = order === 'desc'
  if (sort === 'user') {
    return isDesc
      ? sql`coalesce(lower(${users.name}), lower(${activityLogs.userEmail})) desc nulls last`
      : sql`coalesce(lower(${users.name}), lower(${activityLogs.userEmail})) asc nulls last`
  }
  if (sort === 'role') {
    return isDesc
      ? sql`coalesce(lower(${activityLogs.role}), lower(${users.role})) desc nulls last`
      : sql`coalesce(lower(${activityLogs.role}), lower(${users.role})) asc nulls last`
  }
  if (sort === 'event' || sort === 'action') {
    return isDesc
      ? sql`lower(${activityLogs.action}) desc nulls last`
      : sql`lower(${activityLogs.action}) asc nulls last`
  }
  if (sort === 'ip' || sort === 'ipAddress') {
    return isDesc
      ? sql`${activityLogs.ipAddress} desc nulls last`
      : sql`${activityLogs.ipAddress} asc nulls last`
  }
  if (sort === 'device') {
    return isDesc
      ? sql`${activityLogs.userAgent} desc nulls last`
      : sql`${activityLogs.userAgent} asc nulls last`
  }
  if (sort === 'createdAt' || sort === 'date') {
    return isDesc
      ? sql`${activityLogs.createdAt} desc nulls last`
      : sql`${activityLogs.createdAt} asc nulls last`
  }
  // Default: created_at DESC
  return sql`${activityLogs.createdAt} desc nulls last`
}

/**
 * Server Function: Query activity logs with filtering and pagination (Superadmin only)
 */
export const getActivityLogsServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      filter?: 'all' | 'login' | 'logout' | 'failed_login' | 'create_client' | 'create_report' | 'delete_report'
      page?: number
      pageSize?: number
      sort?: string
      order?: 'asc' | 'desc'
    }) => {
      return {
        filter: data?.filter || 'all',
        page: Math.max(1, Number(data?.page) || 1),
        pageSize: Math.min(100, Math.max(10, Number(data?.pageSize) || 25)),
        sort: data?.sort,
        order: data?.order || 'desc',
      }
    }
  )
  .handler(async ({ data }): Promise<ActivityLogsResponse> => {
    const auth = await assertActiveSession()
    if (auth.role !== 'superadmin') {
      throw new Error('Unauthorized: Superadmin privileges required to view activity logs')
    }

    const { filter, page, pageSize, sort, order } = data
    const offset = (page - 1) * pageSize

    let whereClause = undefined
    if (filter === 'login') {
      whereClause = eq(activityLogs.action, 'login')
    } else if (filter === 'logout') {
      whereClause = eq(activityLogs.action, 'logout')
    } else if (filter === 'failed_login') {
      whereClause = eq(activityLogs.action, 'failed_login')
    } else if (filter === 'create_client') {
      whereClause = eq(activityLogs.action, 'create_client')
    } else if (filter === 'create_report') {
      whereClause = eq(activityLogs.action, 'create_report')
    } else if (filter === 'delete_report') {
      whereClause = eq(activityLogs.action, 'delete_report')
    }

    // Total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(activityLogs)
      .where(whereClause)

    const totalCount = countResult?.count || 0
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    // Query logs with joined user details
    const rawLogs = await db
      .select({
        id: activityLogs.id,
        userId: activityLogs.userId,
        userEmail: activityLogs.userEmail,
        userName: users.name,
        userRole: users.role,
        role: activityLogs.role,
        action: activityLogs.action,
        ipAddress: activityLogs.ipAddress,
        userAgent: activityLogs.userAgent,
        createdAt: activityLogs.createdAt,
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(whereClause)
      .orderBy(getActivityOrderBy(sort, order))
      .limit(pageSize)
      .offset(offset)

    const logs: ActivityLogItem[] = rawLogs.map((log) => ({
      id: log.id,
      userId: log.userId,
      userEmail: log.userEmail,
      userName: log.userName || null,
      role: log.role || log.userRole || 'guest',
      action: log.action as ActivityAction,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      device: parseDevice(log.userAgent),
      createdAt: log.createdAt,
    }))

    return {
      logs,
      totalCount,
      page,
      pageSize,
      totalPages,
    }
  })
