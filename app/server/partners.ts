import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull, sql, inArray } from 'drizzle-orm'
import { db, users, clients, reports } from '../db'
import { hashPassword } from '../lib/auth'
import { assertSuperadminSession } from './auth'
import type { ClientWithReportCount } from './clients'

export interface PartnerItem {
  id: string
  name: string | null
  email: string
  isActive: boolean
  createdAt: Date | string
  clientCount: number
  staffCount: number
  reportsThisMonthCount: number
}

export interface AgencyDetailData {
  partner: {
    id: string
    name: string | null
    email: string
    isActive: boolean
    createdAt: Date | string
  }
  staff: {
    id: string
    name: string | null
    email: string
    role: string
    isActive: boolean
    createdAt: Date | string
    partnerId: string | null
  }[]
  clients: ClientWithReportCount[]
  counts: {
    staffCount: number
    clientCount: number
    reportsThisMonthCount: number
    totalReportsCount: number
  }
}

function getPartnersOrderBy(
  sort?: string,
  order: 'asc' | 'desc' = 'asc',
  staffCountSql?: ReturnType<typeof sql>,
  clientCountSql?: ReturnType<typeof sql>,
  reportsThisMonthSql?: ReturnType<typeof sql>
) {
  const isDesc = order === 'desc'
  if (sort === 'name') {
    return isDesc
      ? sql`coalesce(lower(${users.name}), lower(${users.email})) desc nulls last`
      : sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'email') {
    return isDesc
      ? sql`lower(${users.email}) desc nulls last`
      : sql`lower(${users.email}) asc nulls last`
  }
  if (sort === 'status') {
    return isDesc
      ? sql`case when ${users.isActive} = true then 1 else 0 end desc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`case when ${users.isActive} = true then 1 else 0 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'staff' && staffCountSql) {
    return isDesc
      ? sql`${staffCountSql} desc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`${staffCountSql} asc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'clients' && clientCountSql) {
    return isDesc
      ? sql`${clientCountSql} desc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`${clientCountSql} asc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'reports' && reportsThisMonthSql) {
    return isDesc
      ? sql`${reportsThisMonthSql} desc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`${reportsThisMonthSql} asc nulls last, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  // Default: coalesce(lower(name), lower(email)) ASC nulls last
  return sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
}

function getAgencyStaffOrderBy(sort?: string, order: 'asc' | 'desc' = 'asc') {
  const isDesc = order === 'desc'
  if (sort === 'name') {
    return isDesc
      ? sql`coalesce(lower(${users.name}), lower(${users.email})) desc nulls last`
      : sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'email') {
    return isDesc
      ? sql`lower(${users.email}) desc nulls last`
      : sql`lower(${users.email}) asc nulls last`
  }
  if (sort === 'status') {
    return isDesc
      ? sql`case when ${users.isActive} = true then 1 else 0 end desc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
      : sql`case when ${users.isActive} = true then 1 else 0 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
  }
  if (sort === 'createdAt' || sort === 'date') {
    return isDesc
      ? sql`${users.createdAt} desc nulls last`
      : sql`${users.createdAt} asc nulls last`
  }
  // Default: active staff first, then case-insensitive name ASC with nulls last
  return sql`case when ${users.isActive} = true then 0 else 1 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`
}

/**
 * Server Function: Get all partner agency accounts with their assigned client counts, staff counts,
 * and reports generated this month (counted from period_start) (Superadmin only)
 */
export const getPartnersServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { sort?: string; order?: 'asc' | 'desc' }) => {
    return data || {}
  })
  .handler(
    async ({ data }): Promise<{
      partners: PartnerItem[]
      unassignedClientCount: number
      unassignedReportsThisMonthCount: number
    }> => {
      await assertSuperadminSession()

      const now = new Date()
      const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
      const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0))

      const clientCountSql = sql<number>`cast((select count(*) from clients where clients.partner_id = "users"."id" and clients.deleted_at is null) as int)`
      const staffCountSql = sql<number>`cast((select count(*) from users staff where staff.partner_id = "users"."id" and staff.role = 'partner_employee' and staff.deleted_at is null) as int)`
      const reportsThisMonthSql = sql<number>`cast((select count(*) from reports inner join clients on reports.client_id = clients.id where clients.partner_id = "users"."id" and clients.deleted_at is null and reports.period_start >= ${startOfMonth.toISOString()}::timestamptz and reports.period_start < ${startOfNextMonth.toISOString()}::timestamptz) as int)`

      const orderByClause = getPartnersOrderBy(data?.sort, data?.order, staffCountSql, clientCountSql, reportsThisMonthSql)

      const partnerUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          isActive: users.isActive,
          createdAt: users.createdAt,
          clientCount: clientCountSql,
          staffCount: staffCountSql,
          reportsThisMonthCount: reportsThisMonthSql,
        })
        .from(users)
        .where(and(eq(users.role, 'partner'), isNull(users.deletedAt)))
        .orderBy(orderByClause)

      const [unassignedClientsRes] = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(clients)
        .where(and(isNull(clients.partnerId), isNull(clients.deletedAt)))

      const [unassignedReportsRes] = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(reports)
        .innerJoin(clients, eq(reports.clientId, clients.id))
        .where(
          and(
            isNull(clients.partnerId),
            isNull(clients.deletedAt),
            sql`${reports.periodStart} >= ${startOfMonth.toISOString()}::timestamptz`,
            sql`${reports.periodStart} < ${startOfNextMonth.toISOString()}::timestamptz`
          )
        )

      const partners: PartnerItem[] = partnerUsers.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        isActive: p.isActive,
        createdAt: p.createdAt,
        clientCount: Number(p.clientCount) || 0,
        staffCount: Number(p.staffCount) || 0,
        reportsThisMonthCount: Number(p.reportsThisMonthCount) || 0,
      }))

      return {
        partners,
        unassignedClientCount: Number(unassignedClientsRes?.count) || 0,
        unassignedReportsThisMonthCount: Number(unassignedReportsRes?.count) || 0,
      }
    }
  )

/**
 * Server Function: Get complete agency detail including partner profile, staff, clients,
 * and aggregate counts in ONE round trip (Superadmin only).
 */
export const getAgencyDetailServerFn = createServerFn({ method: 'GET' })
  .validator((data: { partnerId: string; sort?: string; order?: 'asc' | 'desc' }) => {
    if (!data?.partnerId?.trim()) {
      throw new Error('Partner ID is required')
    }
    return {
      partnerId: data.partnerId.trim(),
      sort: data.sort,
      order: data.order,
    }
  })
  .handler(async ({ data }): Promise<AgencyDetailData> => {
    await assertSuperadminSession()

    // 1. Fetch partner user
    const [partner] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, data.partnerId), eq(users.role, 'partner'), isNull(users.deletedAt)))

    if (!partner) {
      throw new Error('Agency partner not found')
    }

    // 2. Fetch staff members (partner_employee)
    const staff = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        partnerId: users.partnerId,
      })
      .from(users)
      .where(and(eq(users.partnerId, data.partnerId), eq(users.role, 'partner_employee'), isNull(users.deletedAt)))
      .orderBy(getAgencyStaffOrderBy(data.sort, data.order))

    // 3. Fetch clients for this partner
    const agencyClients = await db
      .select()
      .from(clients)
      .where(and(eq(clients.partnerId, data.partnerId), isNull(clients.deletedAt)))
      .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

    const clientIds = agencyClients.map((c) => c.id)

    // 4. Fetch report stats for these clients
    let reportsThisMonthCount = 0
    let totalReportsCount = 0
    const countMap: Record<string, number> = {}

    if (clientIds.length > 0) {
      const now = new Date()
      const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
      const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0))

      const clientReports = await db
        .select({
          id: reports.id,
          clientId: reports.clientId,
          periodStart: reports.periodStart,
        })
        .from(reports)
        .where(inArray(reports.clientId, clientIds))

      totalReportsCount = clientReports.length

      for (const r of clientReports) {
        if (r.clientId) {
          countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
        }
        if (r.periodStart && r.periodStart >= startOfMonth && r.periodStart < startOfNextMonth) {
          reportsThisMonthCount++
        }
      }
    }

    const clientList: ClientWithReportCount[] = agencyClients.map((c) => ({
      ...c,
      reportCount: countMap[c.id] || 0,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
      },
    }))

    return {
      partner,
      staff,
      clients: clientList,
      counts: {
        staffCount: staff.length,
        clientCount: agencyClients.length,
        reportsThisMonthCount,
        totalReportsCount,
      },
    }
  })

/**
 * Server Function: Create a new Partner Agency account (Superadmin only)
 */
export const createPartnerServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      name: string
      email: string
      password: string
      isActive?: boolean
    }) => {
      if (!data.name?.trim()) throw new Error('Partner agency name is required')
      if (!data.email?.trim() || !data.email.includes('@')) throw new Error('Valid email is required')
      if (!data.password || data.password.length < 6) throw new Error('Password must be at least 6 characters')
      return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      }
    }
  )
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    // Check if email already taken
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))

    if (existing) {
      throw new Error('An account with this email address already exists.')
    }

    const passwordHash = await hashPassword(data.password)

    const [created] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'partner',
        isActive: data.isActive,
      })
      .returning()

    return {
      success: true,
      partner: {
        id: created.id,
        name: created.name,
        email: created.email,
        isActive: created.isActive,
        createdAt: created.createdAt,
        clientCount: 0,
      },
    }
  })

/**
 * Server Function: Update a Partner Agency account (Superadmin only)
 */
export const updatePartnerServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      name: string
      email: string
      password?: string
      isActive?: boolean
    }) => {
      if (!data.id) throw new Error('Partner ID is required')
      if (!data.name?.trim()) throw new Error('Partner name is required')
      if (!data.email?.trim() || !data.email.includes('@')) throw new Error('Valid email is required')
      if (data.password && data.password.length < 6) throw new Error('Password must be at least 6 characters')
      return {
        id: data.id,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password?.trim(),
        isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
      }
    }
  )
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const [partner] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))
    if (!partner || partner.role !== 'partner') {
      throw new Error('Partner account not found')
    }

    // Check email clash if email changed
    if (data.email !== partner.email) {
      const [clash] = await db.select().from(users).where(and(eq(users.email, data.email), isNull(users.deletedAt)))
      if (clash) {
        throw new Error('An account with this email address already exists.')
      }
    }

    const updateFields: {
      name: string
      email: string
      updatedAt: Date
      isActive?: boolean
      passwordHash?: string
    } = {
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    }

    if (typeof data.isActive === 'boolean') {
      updateFields.isActive = data.isActive
    }

    if (data.password) {
      updateFields.passwordHash = await hashPassword(data.password)
    }

    const [updated] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, data.id))
      .returning()

    return {
      success: true,
      partner: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        isActive: updated.isActive,
      },
    }
  })

/**
 * Server Function: Toggle active status for a Partner Agency account (Superadmin only)
 */
export const togglePartnerActiveServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; isActive: boolean }) => {
    if (!data.id) throw new Error('Partner ID is required')
    return {
      id: data.id,
      isActive: Boolean(data.isActive),
    }
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const [partner] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))
    if (!partner || partner.role !== 'partner') {
      throw new Error('Partner account not found')
    }

    const [updated] = await db
      .update(users)
      .set({
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id))
      .returning()

    return {
      success: true,
      partner: {
        id: updated.id,
        isActive: updated.isActive,
      },
    }
  })

/**
 * Server Function: Assign a client to a partner or reset to direct Superadmin client (Superadmin only)
 */
export const assignClientPartnerServerFn = createServerFn({ method: 'POST' })
  .validator((data: { clientId: string; partnerId: string | null }) => {
    if (!data.clientId) throw new Error('Client ID is required')
    return {
      clientId: data.clientId,
      partnerId: data.partnerId && data.partnerId.trim() ? data.partnerId.trim() : null,
    }
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    if (data.partnerId) {
      const [partner] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, data.partnerId), eq(users.role, 'partner'), isNull(users.deletedAt)))

      if (!partner) {
        throw new Error('Partner account not found')
      }
    }

    const [updated] = await db
      .update(clients)
      .set({
        partnerId: data.partnerId,
      })
      .where(and(eq(clients.id, data.clientId), isNull(clients.deletedAt)))
      .returning()

    return {
      success: true,
      client: updated,
    }
  })
