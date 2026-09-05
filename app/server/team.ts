import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, isNull } from 'drizzle-orm'
import { db, users } from '../db'
import { hashPassword } from '../lib/auth'
import { assertActiveSession } from './auth'

export interface EmployeeItem {
  id: string
  name: string | null
  email: string
  role: 'partner_employee'
  isActive: boolean
  createdAt: Date | string
  partnerId: string | null
  partnerName?: string | null
}

export interface AgencyOwnerInfo {
  id: string
  name: string | null
  email: string
  role: 'partner' | 'superadmin'
}

/**
 * Server Function: Get team members (employees) for the active partner agency or superadmin.
 * Strictly blocked for partner_employee accounts.
 */
export const getTeamMembersServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { partnerId?: string }) => {
    return data || {}
  })
  .handler(async ({ data }): Promise<{
    employees: EmployeeItem[]
    agencyOwner: AgencyOwnerInfo | null
    isSuperadmin: boolean
  }> => {
    const auth = await assertActiveSession()

    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted to partners and administrators')
    }

    if (auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Team management requires agency owner privileges')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

    if (!isSuperadmin) {
      // Partner agency owner: fetch agency owner info and their own employees
      const [owner] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(and(eq(users.id, auth.userId!), isNull(users.deletedAt)))

      const employees = await db
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
        .where(
          and(
            eq(users.partnerId, auth.userId!),
            eq(users.role, 'partner_employee'),
            isNull(users.deletedAt)
          )
        )
        .orderBy(desc(users.createdAt))

      return {
        employees: employees as EmployeeItem[],
        agencyOwner: owner ? (owner as AgencyOwnerInfo) : null,
        isSuperadmin: false,
      }
    }

    // Superadmin: can view employees across all agencies or filter by specific partner
    const conditions = [
      eq(users.role, 'partner_employee'),
      isNull(users.deletedAt),
    ]

    if (data?.partnerId && data.partnerId !== 'all') {
      conditions.push(eq(users.partnerId, data.partnerId))
    }

    const allEmployees = await db
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
      .where(and(...conditions))
      .orderBy(desc(users.createdAt))

    // Attach partner agency names
    const partnerOwners = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(and(eq(users.role, 'partner'), isNull(users.deletedAt)))

    const partnerMap = new Map(partnerOwners.map((p) => [p.id, p.name || p.email]))

    const employeesWithPartner: EmployeeItem[] = allEmployees.map((e) => ({
      ...e,
      role: 'partner_employee',
      partnerName: e.partnerId ? partnerMap.get(e.partnerId) || null : null,
    }))

    return {
      employees: employeesWithPartner,
      agencyOwner: {
        id: auth.userId || 'superadmin',
        name: 'Superadmin Workspace',
        email: auth.email || 'admin@builtbymiguel.net',
        role: 'superadmin',
      },
      isSuperadmin: true,
    }
  })

/**
 * Server Function: Create a new employee / sub-account for the agency.
 */
export const createTeamMemberServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      name: string
      email: string
      password?: string
      partnerId?: string
    }) => {
      if (!data.name?.trim()) throw new Error('Employee name is required')
      if (!data.email?.trim() || !data.email.includes('@')) {
        throw new Error('Valid email address is required')
      }
      return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password?.trim(),
        partnerId: data.partnerId?.trim(),
      }
    }
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted')
    }

    if (auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Only agency owners can add team members')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    let targetPartnerId: string

    if (!isSuperadmin) {
      targetPartnerId = auth.userId!
    } else {
      if (!data.partnerId) {
        throw new Error('Superadmin must specify which partner agency this employee belongs to')
      }
      targetPartnerId = data.partnerId
    }

    // Check if email is already taken
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))

    if (existing) {
      throw new Error('An account with this email address already exists.')
    }

    // Validate or generate password
    let rawPassword = data.password
    if (!rawPassword) {
      // Auto-generate a secure random 12-char password
      const randBytes = new Uint8Array(6)
      crypto.getRandomValues(randBytes)
      const randHex = Array.from(randBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      rawPassword = `Agency@${randHex}!`
    } else if (rawPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    const passwordHash = await hashPassword(rawPassword)

    const [created] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'partner_employee',
        partnerId: targetPartnerId,
        isActive: true,
      })
      .returning()

    return {
      success: true,
      employee: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        isActive: created.isActive,
        createdAt: created.createdAt,
        partnerId: created.partnerId,
      },
      temporaryPassword: data.password ? undefined : rawPassword,
    }
  })

/**
 * Server Function: Remove / revoke access for an employee sub-account.
 * Safeguards:
 * - Blocked for partner_employee accounts.
 * - Agency owner account cannot be deleted.
 * - Partners can only remove their own agency's employees.
 */
export const deleteTeamMemberServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id?.trim()) throw new Error('Employee ID is required')
    return { id: data.id.trim() }
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    if (auth.role === 'client') {
      throw new Error('Unauthorized: Access restricted')
    }

    if (auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Only agency owners can remove team members')
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))

    if (!targetUser) {
      throw new Error('User not found')
    }

    // Safeguard: Never allow deleting an agency owner or superadmin through employee endpoints
    if (targetUser.role !== 'partner_employee' || targetUser.id === auth.userId) {
      throw new Error('Cannot delete agency owner or primary account.')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    if (!isSuperadmin && targetUser.partnerId !== auth.userId) {
      throw new Error('Unauthorized: You can only remove employees from your own agency.')
    }

    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id))

    return { success: true }
  })

/**
 * Server Function: Toggle active status for an employee without full deletion.
 */
export const toggleTeamMemberActiveServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; isActive: boolean }) => {
    if (!data.id?.trim()) throw new Error('Employee ID is required')
    return { id: data.id.trim(), isActive: Boolean(data.isActive) }
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()

    if (auth.role === 'client' || auth.role === 'partner_employee') {
      throw new Error('Unauthorized: Only agency owners can modify team member status')
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, data.id), isNull(users.deletedAt)))

    if (!targetUser) {
      throw new Error('User not found')
    }

    if (targetUser.role !== 'partner_employee' || targetUser.id === auth.userId) {
      throw new Error('Cannot toggle status of agency owner.')
    }

    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    if (!isSuperadmin && targetUser.partnerId !== auth.userId) {
      throw new Error('Unauthorized: You can only modify employees from your own agency.')
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
      employee: {
        id: updated.id,
        isActive: updated.isActive,
      },
    }
  })
