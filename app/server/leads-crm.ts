import { createServerFn } from '@tanstack/react-start'
import { eq, desc, asc, and, or, sql, isNull, inArray } from 'drizzle-orm'
import { db, leads, leadActivities, users, type Lead, type LeadActivity } from '../db'
import { assertActiveSession } from './auth'
import { logActivity } from './activity-logger'

export type PipelineStage =
  | 'new'
  | 'attempted_contact'
  | 'contacted'
  | 'follow_up_scheduled'
  | 'interested_qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost'
  | 'do_not_contact'

export const PIPELINE_STAGES: Array<{ id: PipelineStage; label: string; order: number }> = [
  { id: 'new', label: 'New', order: 1 },
  { id: 'attempted_contact', label: 'Attempted Contact', order: 2 },
  { id: 'contacted', label: 'Contacted', order: 3 },
  { id: 'follow_up_scheduled', label: 'Follow-Up Scheduled', order: 4 },
  { id: 'interested_qualified', label: 'Interested / Qualified', order: 5 },
  { id: 'proposal_sent', label: 'Proposal Sent', order: 6 },
  { id: 'won', label: 'Won', order: 7 },
  { id: 'lost', label: 'Lost', order: 8 },
  { id: 'do_not_contact', label: 'Do Not Contact', order: 9 },
]

export const INDUSTRIES = [
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'general_contractor', label: 'General Contractor' },
  { id: 'other', label: 'Other' },
] as const

export const GBP_STATUSES = [
  { id: 'not_found', label: 'Not Found' },
  { id: 'unclaimed', label: 'Unclaimed' },
  { id: 'claimed_unoptimized', label: 'Claimed, Unoptimized' },
  { id: 'claimed_well_optimized', label: 'Claimed, Well-Optimized' },
  { id: 'unknown', label: 'Unknown' },
] as const

export const LEAD_SOURCES = [
  { id: 'manual_research', label: 'Manual Research' },
  { id: 'referral', label: 'Referral' },
  { id: 'directory_scrape', label: 'Directory / Scrape' },
  { id: 'inbound_inquiry', label: 'Inbound Inquiry' },
  { id: 'other', label: 'Other' },
] as const

/**
 * Assert session belongs to superadmin or staff (partner, partner_employee)
 */
async function assertStaffOrAdmin() {
  const session = await assertActiveSession()
  const ALLOWED_ROLES = ['superadmin', 'admin', 'partner', 'partner_employee']
  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    throw new Error('Unauthorized: Staff or administrator access required')
  }
  return session
}

export interface LeadWithAssignee extends Lead {
  assignedUserName: string | null
  assignedUserEmail: string | null
  assignedUserAvatar: string | null
  addedByName: string | null
}

export interface StaffUserItem {
  id: string
  name: string | null
  email: string
  role: string
  avatarUrl: string | null
}

/**
 * Server Function: Get all staff users for assignment dropdowns
 */
export const getStaffUsersServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ staff: StaffUserItem[] }> => {
    await assertStaffOrAdmin()
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(
        and(
          inArray(users.role, ['superadmin', 'partner', 'partner_employee']),
          eq(users.isActive, true),
          isNull(users.deletedAt)
        )
      )
      .orderBy(asc(users.name), asc(users.email))

    return { staff: rows }
  }
)

/**
 * Server Function: Get leads with filtering and follow-up metrics
 */
export const getLeadsServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      stage?: string
      assignedTo?: string
      industry?: string
      overdueOnly?: boolean
      dueTodayOnly?: boolean
      search?: string
    }) => data || {}
  )
  .handler(async ({ data }): Promise<{
    leads: LeadWithAssignee[]
    counts: {
      total: number
      overdue: number
      dueToday: number
      byStage: Record<PipelineStage, number>
    }
  }> => {
    await assertStaffOrAdmin()

    // 1. Fetch all leads joined with staff assignee
    const assignee = db.$with('assignee').as(
      db
        .select({
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userAvatar: users.avatarUrl,
        })
        .from(users)
    )

    const creator = db.$with('creator').as(
      db
        .select({
          creatorId: users.id,
          creatorName: users.name,
        })
        .from(users)
    )

    const now = new Date()
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

    const rawLeads = await db
      .select({
        lead: leads,
        assignedUserName: assignee.userName,
        assignedUserEmail: assignee.userEmail,
        assignedUserAvatar: assignee.userAvatar,
        addedByName: creator.creatorName,
      })
      .from(leads)
      .leftJoin(assignee, eq(leads.assignedTo, assignee.userId))
      .leftJoin(creator, eq(leads.addedBy, creator.creatorId))
      .orderBy(asc(leads.nextFollowUpDate), desc(leads.createdAt))

    const formatted: LeadWithAssignee[] = rawLeads.map((r) => ({
      ...r.lead,
      assignedUserName: r.assignedUserName,
      assignedUserEmail: r.assignedUserEmail,
      assignedUserAvatar: r.assignedUserAvatar,
      addedByName: r.addedByName,
    }))

    // Calculate metrics across ALL leads
    const byStage: Record<PipelineStage, number> = {
      new: 0,
      attempted_contact: 0,
      contacted: 0,
      follow_up_scheduled: 0,
      interested_qualified: 0,
      proposal_sent: 0,
      won: 0,
      lost: 0,
      do_not_contact: 0,
    }

    let overdue = 0
    let dueToday = 0

    const terminalStages = ['won', 'lost', 'do_not_contact']

    formatted.forEach((l) => {
      const st = l.pipelineStage as PipelineStage
      if (byStage[st] !== undefined) {
        byStage[st]++
      }

      if (l.nextFollowUpDate && !terminalStages.includes(l.pipelineStage)) {
        const fDate = new Date(l.nextFollowUpDate)
        if (fDate < startOfToday) {
          overdue++
        } else if (fDate >= startOfToday && fDate < endOfToday) {
          dueToday++
        }
      }
    })

    // Filter results according to query params
    let filtered = formatted

    if (data?.stage && data.stage !== 'all') {
      filtered = filtered.filter((l) => l.pipelineStage === data.stage)
    }

    if (data?.assignedTo && data.assignedTo !== 'all') {
      if (data.assignedTo === 'unassigned') {
        filtered = filtered.filter((l) => !l.assignedTo)
      } else {
        filtered = filtered.filter((l) => l.assignedTo === data.assignedTo)
      }
    }

    if (data?.industry && data.industry !== 'all') {
      filtered = filtered.filter((l) => l.industry === data.industry)
    }

    if (data?.overdueOnly) {
      filtered = filtered.filter((l) => {
        if (!l.nextFollowUpDate || terminalStages.includes(l.pipelineStage)) return false
        return new Date(l.nextFollowUpDate) < startOfToday
      })
    }

    if (data?.dueTodayOnly) {
      filtered = filtered.filter((l) => {
        if (!l.nextFollowUpDate || terminalStages.includes(l.pipelineStage)) return false
        const fDate = new Date(l.nextFollowUpDate)
        return fDate >= startOfToday && fDate < endOfToday
      })
    }

    if (data?.search && data.search.trim()) {
      const q = data.search.toLowerCase().trim()
      filtered = filtered.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.phone && l.phone.includes(q)) ||
          (l.cityArea && l.cityArea.toLowerCase().includes(q)) ||
          (l.assignedUserName && l.assignedUserName.toLowerCase().includes(q))
      )
    }

    return {
      leads: filtered,
      counts: {
        total: formatted.length,
        overdue,
        dueToday,
        byStage,
      },
    }
  })

/**
 * Server Function: Get single lead details with complete activity log
 */
export const getLeadByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { leadId: string }) => {
    if (!data.leadId) throw new Error('Lead ID is required')
    return data
  })
  .handler(async ({ data }): Promise<{ lead: LeadWithAssignee; activities: LeadActivity[] }> => {
    await assertStaffOrAdmin()

    const [leadRow] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, data.leadId))

    if (!leadRow) {
      throw new Error('Lead not found')
    }

    let assignedUserName = null
    let assignedUserEmail = null
    let assignedUserAvatar = null
    if (leadRow.assignedTo) {
      const [u] = await db
        .select({ name: users.name, email: users.email, avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, leadRow.assignedTo))
      if (u) {
        assignedUserName = u.name
        assignedUserEmail = u.email
        assignedUserAvatar = u.avatarUrl
      }
    }

    let addedByName = null
    if (leadRow.addedBy) {
      const [creator] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, leadRow.addedBy))
      if (creator) addedByName = creator.name
    }

    const activities = await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, data.leadId))
      .orderBy(desc(leadActivities.createdAt))

    return {
      lead: {
        ...leadRow,
        assignedUserName,
        assignedUserEmail,
        assignedUserAvatar,
        addedByName,
      },
      activities,
    }
  })

/**
 * Server Function: Check for duplicate leads before creation
 */
export const checkLeadDuplicatesServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      companyName: string
      email?: string
      phone?: string
      excludeLeadId?: string
    }) => data
  )
  .handler(async ({ data }): Promise<{ duplicates: Array<{ id: string; companyName: string; email: string | null; phone: string | null; pipelineStage: string; assignedToName: string | null }> }> => {
    await assertStaffOrAdmin()

    const conditions = []

    if (data.companyName && data.companyName.trim()) {
      conditions.push(sql`lower(${leads.companyName}) = lower(${data.companyName.trim()})`)
    }

    if (data.email && data.email.trim()) {
      conditions.push(sql`lower(${leads.email}) = lower(${data.email.trim()})`)
    }

    if (data.phone && data.phone.trim()) {
      // Normalize phone: strip non-digits
      const digits = data.phone.replace(/\D/g, '')
      if (digits.length >= 7) {
        conditions.push(sql`regexp_replace(${leads.phone}, '\\D', '', 'g') = ${digits}`)
      }
    }

    if (conditions.length === 0) {
      return { duplicates: [] }
    }

    let baseQuery = db
      .select({
        id: leads.id,
        companyName: leads.companyName,
        email: leads.email,
        phone: leads.phone,
        pipelineStage: leads.pipelineStage,
        assignedTo: leads.assignedTo,
      })
      .from(leads)
      .where(or(...conditions))

    const matches = await baseQuery

    const filtered = data.excludeLeadId
      ? matches.filter((m) => m.id !== data.excludeLeadId)
      : matches

    if (filtered.length === 0) {
      return { duplicates: [] }
    }

    // Resolve assigned staff names
    const staffIds = filtered.map((m) => m.assignedTo).filter(Boolean) as string[]
    const staffMap = new Map<string, string>()
    if (staffIds.length > 0) {
      const staffRows = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(inArray(users.id, staffIds))
      staffRows.forEach((s) => staffMap.set(s.id, s.name || s.email))
    }

    return {
      duplicates: filtered.map((m) => ({
        id: m.id,
        companyName: m.companyName,
        email: m.email,
        phone: m.phone,
        pipelineStage: m.pipelineStage,
        assignedToName: m.assignedTo ? staffMap.get(m.assignedTo) || null : null,
      })),
    }
  })

/**
 * Server Function: Create a new lead record
 */
export const createLeadServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      companyName: string
      websiteUrl?: string
      hasWebsite?: 'yes' | 'no' | 'unknown'
      email?: string
      phone?: string
      gbpStatus?: 'not_found' | 'unclaimed' | 'claimed_unoptimized' | 'claimed_well_optimized' | 'unknown'
      industry?: 'plumbing' | 'hvac' | 'electrical' | 'roofing' | 'landscaping' | 'general_contractor' | 'other'
      cityArea?: string
      leadSource?: 'manual_research' | 'referral' | 'directory_scrape' | 'inbound_inquiry' | 'other'
      pipelineStage?: PipelineStage
      assignedTo?: string
      nextFollowUpDate?: string | null
      initialNote?: string
    }) => {
      if (!data.companyName || !data.companyName.trim()) {
        throw new Error('Company Name is required')
      }
      return data
    }
  )
  .handler(async ({ data }) => {
    const session = await assertStaffOrAdmin()

    // Auto-suggest hasWebsite = 'yes' if URL provided and not specified
    let hasWebsite = data.hasWebsite || 'unknown'
    if (data.websiteUrl && data.websiteUrl.trim() && hasWebsite === 'unknown') {
      hasWebsite = 'yes'
    }

    const nextFollowUp = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null

    const [newLead] = await db
      .insert(leads)
      .values({
        companyName: data.companyName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        hasWebsite,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        gbpStatus: data.gbpStatus || 'unknown',
        industry: data.industry || 'other',
        cityArea: data.cityArea?.trim() || null,
        leadSource: data.leadSource || 'manual_research',
        pipelineStage: data.pipelineStage || 'new',
        assignedTo: data.assignedTo || session.userId || null,
        nextFollowUpDate: nextFollowUp,
        addedBy: session.userId || null,
        lastContactDate: new Date(),
      })
      .returning()

    // Create initial activity log entry
    const noteText = data.initialNote?.trim() || 'Lead created and added to pipeline.'
    await db.insert(leadActivities).values({
      leadId: newLead.id,
      userId: session.userId || null,
      userName: session.name || session.email || 'Staff',
      note: noteText,
      type: 'note',
      stageTo: newLead.pipelineStage,
      nextFollowUpDate: nextFollowUp,
    })

    await logActivity({
      userId: session.userId || null,
      userEmail: session.email || null,
      role: session.role,
      action: `lead_created_${newLead.id}`,
    })

    return { success: true, leadId: newLead.id }
  })

/**
 * Server Function: Update lead details
 */
export const updateLeadServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      leadId: string
      companyName?: string
      websiteUrl?: string
      hasWebsite?: 'yes' | 'no' | 'unknown'
      email?: string
      phone?: string
      gbpStatus?: 'not_found' | 'unclaimed' | 'claimed_unoptimized' | 'claimed_well_optimized' | 'unknown'
      industry?: 'plumbing' | 'hvac' | 'electrical' | 'roofing' | 'landscaping' | 'general_contractor' | 'other'
      cityArea?: string
      leadSource?: 'manual_research' | 'referral' | 'directory_scrape' | 'inbound_inquiry' | 'other'
      assignedTo?: string | null
      nextFollowUpDate?: string | null
    }) => {
      if (!data.leadId) throw new Error('Lead ID is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const session = await assertStaffOrAdmin()

    const [existing] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!existing) throw new Error('Lead not found')

    const updatePayload: Partial<Lead> = {
      updatedAt: new Date(),
    }

    if (data.companyName !== undefined) updatePayload.companyName = data.companyName.trim()
    if (data.websiteUrl !== undefined) updatePayload.websiteUrl = data.websiteUrl?.trim() || null
    if (data.hasWebsite !== undefined) updatePayload.hasWebsite = data.hasWebsite
    if (data.email !== undefined) updatePayload.email = data.email?.trim() || null
    if (data.phone !== undefined) updatePayload.phone = data.phone?.trim() || null
    if (data.gbpStatus !== undefined) updatePayload.gbpStatus = data.gbpStatus
    if (data.industry !== undefined) updatePayload.industry = data.industry
    if (data.cityArea !== undefined) updatePayload.cityArea = data.cityArea?.trim() || null
    if (data.leadSource !== undefined) updatePayload.leadSource = data.leadSource
    if (data.nextFollowUpDate !== undefined) {
      updatePayload.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null
    }

    // Reassignment check: Staff can assign to self; Superadmin can reassign to anyone
    if (data.assignedTo !== undefined) {
      const isSuperadmin = session.role === 'superadmin' || session.role === 'admin'
      if (!isSuperadmin && data.assignedTo !== session.userId && existing.assignedTo && existing.assignedTo !== session.userId) {
        throw new Error('Only administrators can reassign leads between other staff members')
      }
      updatePayload.assignedTo = data.assignedTo
    }

    await db.update(leads).set(updatePayload).where(eq(leads.id, data.leadId))

    return { success: true }
  })

/**
 * Server Function: Update lead stage with automatic activity log
 */
export const updateLeadStageServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      leadId: string
      newStage: PipelineStage
      note?: string
    }) => {
      if (!data.leadId) throw new Error('Lead ID is required')
      if (!data.newStage) throw new Error('Target stage is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const session = await assertStaffOrAdmin()

    const [lead] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!lead) throw new Error('Lead not found')

    const oldStage = lead.pipelineStage as PipelineStage
    if (oldStage === data.newStage) {
      return { success: true }
    }

    // If marked Do Not Contact, clear next follow-up date
    const isDnc = data.newStage === 'do_not_contact'

    await db
      .update(leads)
      .set({
        pipelineStage: data.newStage,
        nextFollowUpDate: isDnc ? null : lead.nextFollowUpDate,
        lastContactDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, data.leadId))

    const stageLabelFrom = PIPELINE_STAGES.find((s) => s.id === oldStage)?.label || oldStage
    const stageLabelTo = PIPELINE_STAGES.find((s) => s.id === data.newStage)?.label || data.newStage

    const noteText = data.note?.trim()
      ? `Stage changed to ${stageLabelTo}. Note: ${data.note.trim()}`
      : `Pipeline stage moved from ${stageLabelFrom} to ${stageLabelTo}.`

    await db.insert(leadActivities).values({
      leadId: data.leadId,
      userId: session.userId || null,
      userName: session.name || session.email || 'Staff',
      note: noteText,
      type: 'stage_change',
      stageFrom: oldStage,
      stageTo: data.newStage,
    })

    return { success: true }
  })

/**
 * Server Function: Add an outreach note to the activity log
 * Optionally updates nextFollowUpDate and/or pipelineStage atomically
 */
export const addLeadActivityServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      leadId: string
      note: string
      type?: 'note' | 'call' | 'email' | 'meeting'
      newStage?: PipelineStage
      nextFollowUpDate?: string | null
    }) => {
      if (!data.leadId) throw new Error('Lead ID is required')
      if (!data.note || !data.note.trim()) throw new Error('Note text is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const session = await assertStaffOrAdmin()

    const [lead] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!lead) throw new Error('Lead not found')

    const now = new Date()
    const leadUpdates: Partial<Lead> = {
      lastContactDate: now,
      updatedAt: now,
    }

    let stageFrom = lead.pipelineStage
    let stageTo = lead.pipelineStage

    if (data.newStage && data.newStage !== lead.pipelineStage) {
      leadUpdates.pipelineStage = data.newStage
      stageTo = data.newStage
      if (data.newStage === 'do_not_contact') {
        leadUpdates.nextFollowUpDate = null
      }
    }

    if (data.nextFollowUpDate !== undefined && data.newStage !== 'do_not_contact') {
      leadUpdates.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null
    }

    // 1. Update lead record
    await db.update(leads).set(leadUpdates).where(eq(leads.id, data.leadId))

    // 2. Insert activity log
    await db.insert(leadActivities).values({
      leadId: data.leadId,
      userId: session.userId || null,
      userName: session.name || session.email || 'Staff',
      note: data.note.trim(),
      type: data.type || 'note',
      stageFrom: stageFrom !== stageTo ? stageFrom : undefined,
      stageTo: stageFrom !== stageTo ? stageTo : undefined,
      nextFollowUpDate: leadUpdates.nextFollowUpDate || undefined,
    })

    return { success: true }
  })

/**
 * Server Function: Delete a lead (Superadmin only)
 */
export const deleteLeadServerFn = createServerFn({ method: 'POST' })
  .validator((data: { leadId: string }) => {
    if (!data.leadId) throw new Error('Lead ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const session = await assertStaffOrAdmin()

    if (session.role !== 'superadmin' && session.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can delete lead records')
    }

    const [lead] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!lead) throw new Error('Lead not found')

    await db.delete(leads).where(eq(leads.id, data.leadId))

    await logActivity({
      userId: session.userId || null,
      userEmail: session.email || null,
      role: 'superadmin',
      action: `lead_deleted_${data.leadId}`,
    })

    return { success: true }
  })
