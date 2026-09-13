import { createServerFn } from '@tanstack/react-start'
import { eq, desc, asc, and, or, sql, isNull, inArray, lte } from 'drizzle-orm'
import {
  db,
  leads,
  leadActivities,
  campaigns,
  campaignSteps,
  leadCampaignEnrollments,
  leadCampaignStepLogs,
  users,
  type Lead,
  type LeadActivity,
  type Campaign,
  type CampaignStep,
  type LeadCampaignEnrollment,
  type LeadCampaignStepLog,
} from '../db'
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

export const COUNTRIES = [
  { id: 'US', label: 'United States' },
  { id: 'Canada', label: 'Canada' },
  { id: 'Australia', label: 'Australia' },
  { id: 'Other', label: 'Other' },
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

export const CHANNELS = [
  { id: 'email', label: 'Email' },
  { id: 'contact_form', label: 'Contact Form' },
  { id: 'phone', label: 'Phone Call' },
] as const

export const CALL_OUTCOMES = [
  { id: 'answered', label: 'Answered' },
  { id: 'no_answer', label: 'No Answer' },
  { id: 'voicemail_left', label: 'Voicemail Left' },
  { id: 'callback_scheduled', label: 'Callback Scheduled' },
  { id: 'wrong_number', label: 'Wrong Number' },
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
  activeCampaignId?: string | null
  activeCampaignName?: string | null
  campaignStatus?: string | null
  currentStepOrder?: number | null
}

export interface StaffUserItem {
  id: string
  name: string | null
  email: string
  role: string
  avatarUrl: string | null
}

export interface DueWorklistItem {
  stepLogId: string
  enrollmentId: string
  leadId: string
  companyName: string
  websiteUrl: string | null
  hasWebsite: string
  hasContactForm: string
  email: string | null
  phone: string | null
  country: string
  industry: string
  cityArea: string | null
  assignedToName: string | null
  assignedToId: string | null
  stepId: string
  stepOrder: number
  stepLabel: string
  channel: 'email' | 'contact_form' | 'phone'
  dueDate: string
  isOverdue: boolean
  campaignName: string
  renderedSubject: string | null
  renderedBody: string | null
  renderedScript: string | null
  complianceNotice: string | null
  complianceWarning: string | null
}

/**
 * Helper to substitute merge fields
 */
function substituteMergeFields(
  template: string | null,
  lead: { companyName: string; industry: string; cityArea: string | null }
): string {
  if (!template) return ''
  return template
    .replace(/\{\{company_name\}\}/gi, lead.companyName)
    .replace(/\{\{contact_name\}\}/gi, lead.companyName)
    .replace(/\{\{industry\}\}/gi, lead.industry || 'local service')
    .replace(/\{\{city\}\}/gi, lead.cityArea || 'your service area')
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
      country?: string
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

    const now = new Date()
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

    const rawLeads = await db
      .select({
        lead: leads,
        assignedUserName: users.name,
        assignedUserEmail: users.email,
        assignedUserAvatar: users.avatarUrl,
      })
      .from(leads)
      .leftJoin(users, eq(leads.assignedTo, users.id))
      .orderBy(asc(leads.nextFollowUpDate), desc(leads.createdAt))

    // Fetch active enrollments with campaign names
    const activeEnrollments = await db
      .select({
        enrollment: leadCampaignEnrollments,
        campaignName: campaigns.name,
      })
      .from(leadCampaignEnrollments)
      .innerJoin(campaigns, eq(leadCampaignEnrollments.campaignId, campaigns.id))
      .where(inArray(leadCampaignEnrollments.status, ['active', 'paused']))

    const enrollmentMap = new Map<string, { campaignId: string; campaignName: string; status: string; stepOrder: number }>()
    for (const e of activeEnrollments) {
      enrollmentMap.set(e.enrollment.leadId, {
        campaignId: e.enrollment.campaignId,
        campaignName: e.campaignName,
        status: e.enrollment.status,
        stepOrder: e.enrollment.currentStepOrder,
      })
    }

    const formatted: LeadWithAssignee[] = rawLeads.map((r) => {
      const enr = enrollmentMap.get(r.lead.id)
      return {
        ...r.lead,
        assignedUserName: r.assignedUserName,
        assignedUserEmail: r.assignedUserEmail,
        assignedUserAvatar: r.assignedUserAvatar,
        addedByName: null,
        activeCampaignId: enr?.campaignId || null,
        activeCampaignName: enr?.campaignName || null,
        campaignStatus: enr?.status || null,
        currentStepOrder: enr?.stepOrder || null,
      }
    })

    const initialStageCounts: Record<PipelineStage, number> = {
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

    let overdueCount = 0
    let dueTodayCount = 0

    for (const item of formatted) {
      if (item.pipelineStage in initialStageCounts) {
        initialStageCounts[item.pipelineStage as PipelineStage]++
      }
      if (item.nextFollowUpDate && item.pipelineStage !== 'do_not_contact' && item.pipelineStage !== 'won' && item.pipelineStage !== 'lost') {
        const d = new Date(item.nextFollowUpDate)
        if (d < startOfToday) {
          overdueCount++
        } else if (d >= startOfToday && d < endOfToday) {
          dueTodayCount++
        }
      }
    }

    let filtered = formatted
    if (data.stage) {
      filtered = filtered.filter((l) => l.pipelineStage === data.stage)
    }
    if (data.assignedTo) {
      filtered = filtered.filter((l) => l.assignedTo === data.assignedTo)
    }
    if (data.industry) {
      filtered = filtered.filter((l) => l.industry === data.industry)
    }
    if (data.country) {
      filtered = filtered.filter((l) => l.country === data.country)
    }
    if (data.overdueOnly) {
      filtered = filtered.filter(
        (l) =>
          l.nextFollowUpDate &&
          new Date(l.nextFollowUpDate) < startOfToday &&
          l.pipelineStage !== 'do_not_contact' &&
          l.pipelineStage !== 'won' &&
          l.pipelineStage !== 'lost'
      )
    }
    if (data.dueTodayOnly) {
      filtered = filtered.filter(
        (l) =>
          l.nextFollowUpDate &&
          new Date(l.nextFollowUpDate) >= startOfToday &&
          new Date(l.nextFollowUpDate) < endOfToday &&
          l.pipelineStage !== 'do_not_contact' &&
          l.pipelineStage !== 'won' &&
          l.pipelineStage !== 'lost'
      )
    }
    if (data.search && data.search.trim()) {
      const q = data.search.toLowerCase().trim()
      filtered = filtered.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.phone && l.phone.toLowerCase().includes(q)) ||
          (l.cityArea && l.cityArea.toLowerCase().includes(q))
      )
    }

    return {
      leads: filtered,
      counts: {
        total: formatted.length,
        overdue: overdueCount,
        dueToday: dueTodayCount,
        byStage: initialStageCounts,
      },
    }
  })

/**
 * Server Function: Get single lead with activity logs and campaign info
 */
export const getLeadByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{
    lead: LeadWithAssignee | null
    activities: LeadActivity[]
    enrollment: (LeadCampaignEnrollment & { campaignName: string; steps: LeadCampaignStepLog[] }) | null
  }> => {
    await assertStaffOrAdmin()

    const [leadRow] = await db
      .select({
        lead: leads,
        assignedUserName: users.name,
        assignedUserEmail: users.email,
        assignedUserAvatar: users.avatarUrl,
      })
      .from(leads)
      .leftJoin(users, eq(leads.assignedTo, users.id))
      .where(eq(leads.id, data.id))

    if (!leadRow) return { lead: null, activities: [], enrollment: null }

    const logs = await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, data.id))
      .orderBy(desc(leadActivities.createdAt))

    // Active or paused enrollment
    const [enr] = await db
      .select({
        enrollment: leadCampaignEnrollments,
        campaignName: campaigns.name,
      })
      .from(leadCampaignEnrollments)
      .innerJoin(campaigns, eq(leadCampaignEnrollments.campaignId, campaigns.id))
      .where(
        and(
          eq(leadCampaignEnrollments.leadId, data.id),
          inArray(leadCampaignEnrollments.status, ['active', 'paused'])
        )
      )
      .limit(1)

    let enrollmentData: (LeadCampaignEnrollment & { campaignName: string; steps: LeadCampaignStepLog[] }) | null = null
    if (enr) {
      const steps = await db
        .select()
        .from(leadCampaignStepLogs)
        .where(eq(leadCampaignStepLogs.enrollmentId, enr.enrollment.id))
        .orderBy(asc(leadCampaignStepLogs.stepOrder))

      enrollmentData = {
        ...enr.enrollment,
        campaignName: enr.campaignName,
        steps,
      }
    }

    return {
      lead: {
        ...leadRow.lead,
        assignedUserName: leadRow.assignedUserName,
        assignedUserEmail: leadRow.assignedUserEmail,
        assignedUserAvatar: leadRow.assignedUserAvatar,
        addedByName: null,
        activeCampaignId: enr?.enrollment.campaignId || null,
        activeCampaignName: enr?.campaignName || null,
        campaignStatus: enr?.enrollment.status || null,
        currentStepOrder: enr?.enrollment.currentStepOrder || null,
      },
      activities: logs,
      enrollment: enrollmentData,
    }
  })

/**
 * Server Function: Check duplicates on add
 */
export const checkLeadDuplicatesServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      companyName?: string
      email?: string
      phone?: string
      excludeId?: string
    }) => data
  )
  .handler(async ({ data }): Promise<{
    duplicates: Array<{ id: string; companyName: string; email: string | null; phone: string | null; matchReason: string }>
  }> => {
    await assertStaffOrAdmin()

    const conditions = []
    if (data.companyName && data.companyName.trim()) {
      conditions.push(sql`lower(${leads.companyName}) = lower(${data.companyName.trim()})`)
    }
    if (data.email && data.email.trim()) {
      conditions.push(sql`lower(${leads.email}) = lower(${data.email.trim()})`)
    }
    if (data.phone && data.phone.trim()) {
      const cleanPhone = data.phone.replace(/[^0-9+]/g, '')
      if (cleanPhone.length >= 6) {
        conditions.push(sql`replace(replace(replace(${leads.phone}, ' ', ''), '-', ''), '(', '') LIKE ${'%' + cleanPhone + '%'}`)
      }
    }

    if (conditions.length === 0) {
      return { duplicates: [] }
    }

    let query = db
      .select({
        id: leads.id,
        companyName: leads.companyName,
        email: leads.email,
        phone: leads.phone,
      })
      .from(leads)
      .where(or(...conditions))

    const rows = await query
    const results = rows
      .filter((r) => !data.excludeId || r.id !== data.excludeId)
      .map((r) => {
        const reasons: string[] = []
        if (data.companyName && r.companyName.toLowerCase() === data.companyName.trim().toLowerCase()) {
          reasons.push('Company Name')
        }
        if (data.email && r.email && r.email.toLowerCase() === data.email.trim().toLowerCase()) {
          reasons.push('Email')
        }
        if (data.phone && r.phone) {
          reasons.push('Phone')
        }
        return {
          ...r,
          matchReason: reasons.join(', ') || 'Partial Match',
        }
      })

    return { duplicates: results }
  })

/**
 * Server Function: Create a new prospective lead
 */
export const createLeadServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      companyName: string
      websiteUrl?: string | null
      hasWebsite?: 'yes' | 'no' | 'unknown'
      hasContactForm?: 'yes' | 'no' | 'unknown'
      email?: string | null
      phone?: string | null
      country?: 'US' | 'Canada' | 'Australia' | 'Other'
      gbpStatus?: 'not_found' | 'unclaimed' | 'claimed_unoptimized' | 'claimed_well_optimized' | 'unknown'
      industry?: 'plumbing' | 'hvac' | 'electrical' | 'roofing' | 'landscaping' | 'general_contractor' | 'other'
      cityArea?: string | null
      leadSource?: 'manual_research' | 'referral' | 'directory_scrape' | 'inbound_inquiry' | 'other'
      pipelineStage?: PipelineStage
      assignedTo?: string | null
      nextFollowUpDate?: string | null
      initialNote?: string | null
    }) => data
  )
  .handler(async ({ data }): Promise<{ lead: Lead }> => {
    const session = await assertStaffOrAdmin()

    if (!data.companyName || !data.companyName.trim()) {
      throw new Error('Company name is required')
    }

    let hasWebsiteVal = data.hasWebsite || 'unknown'
    if (data.websiteUrl && data.websiteUrl.trim() && hasWebsiteVal === 'unknown') {
      hasWebsiteVal = 'yes'
    }

    let hasContactFormVal = data.hasContactForm || 'unknown'
    if (hasWebsiteVal === 'no') {
      hasContactFormVal = 'no'
    }

    const followUp = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null

    const [created] = await db
      .insert(leads)
      .values({
        companyName: data.companyName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        hasWebsite: hasWebsiteVal,
        hasContactForm: hasContactFormVal,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        country: data.country || 'US',
        gbpStatus: data.gbpStatus || 'unknown',
        industry: data.industry || 'other',
        cityArea: data.cityArea?.trim() || null,
        leadSource: data.leadSource || 'manual_research',
        pipelineStage: data.pipelineStage || 'new',
        assignedTo: data.assignedTo || session.userId,
        nextFollowUpDate: followUp,
        addedBy: session.userId,
      })
      .returning()

    await db.insert(leadActivities).values({
      leadId: created.id,
      userId: session.userId,
      userName: (session.email ?? '').split('@')[0],
      note: data.initialNote?.trim() || 'Lead created in pipeline.',
      type: 'note',
      stageTo: created.pipelineStage,
      nextFollowUpDate: followUp,
    })

    await logActivity({
      userId: session.userId,
      action: 'create_lead',
    })

    return { lead: created }
  })

/**
 * Server Function: Update lead details
 */
export const updateLeadServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      companyName?: string
      websiteUrl?: string | null
      hasWebsite?: 'yes' | 'no' | 'unknown'
      hasContactForm?: 'yes' | 'no' | 'unknown'
      email?: string | null
      phone?: string | null
      country?: 'US' | 'Canada' | 'Australia' | 'Other'
      gbpStatus?: 'not_found' | 'unclaimed' | 'claimed_unoptimized' | 'claimed_well_optimized' | 'unknown'
      industry?: 'plumbing' | 'hvac' | 'electrical' | 'roofing' | 'landscaping' | 'general_contractor' | 'other'
      cityArea?: string | null
      leadSource?: 'manual_research' | 'referral' | 'directory_scrape' | 'inbound_inquiry' | 'other'
      assignedTo?: string | null
      nextFollowUpDate?: string | null
      pipelineStage?: PipelineStage
    }) => data
  )
  .handler(async ({ data }): Promise<{ lead: Lead }> => {
    const session = await assertStaffOrAdmin()

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.companyName !== undefined) updatePayload.companyName = data.companyName.trim()
    if (data.websiteUrl !== undefined) updatePayload.websiteUrl = data.websiteUrl?.trim() || null
    if (data.hasWebsite !== undefined) updatePayload.hasWebsite = data.hasWebsite
    if (data.hasContactForm !== undefined) updatePayload.hasContactForm = data.hasContactForm
    if (data.email !== undefined) updatePayload.email = data.email?.trim() || null
    if (data.phone !== undefined) updatePayload.phone = data.phone?.trim() || null
    if (data.country !== undefined) updatePayload.country = data.country
    if (data.gbpStatus !== undefined) updatePayload.gbpStatus = data.gbpStatus
    if (data.industry !== undefined) updatePayload.industry = data.industry
    if (data.cityArea !== undefined) updatePayload.cityArea = data.cityArea?.trim() || null
    if (data.leadSource !== undefined) updatePayload.leadSource = data.leadSource
    if (data.assignedTo !== undefined) {
      if (session.role !== 'superadmin' && session.role !== 'admin') {
        // Staff cannot reassign
      } else {
        updatePayload.assignedTo = data.assignedTo || null
      }
    }
    if (data.nextFollowUpDate !== undefined) {
      updatePayload.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null
    }

    if (data.pipelineStage !== undefined) {
      updatePayload.pipelineStage = data.pipelineStage
      if (data.pipelineStage === 'do_not_contact') {
        updatePayload.nextFollowUpDate = null
        // Terminate any active sequence
        await db
          .update(leadCampaignEnrollments)
          .set({ status: 'terminated', pausedReason: 'do_not_contact', updatedAt: new Date() })
          .where(and(eq(leadCampaignEnrollments.leadId, data.id), eq(leadCampaignEnrollments.status, 'active')))
      }
    }

    const [updated] = await db
      .update(leads)
      .set(updatePayload)
      .where(eq(leads.id, data.id))
      .returning()

    return { lead: updated }
  })

/**
 * Server Function: Update lead stage
 */
export const updateLeadStageServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; stage: PipelineStage; note?: string }) => data)
  .handler(async ({ data }): Promise<{ lead: Lead }> => {
    const session = await assertStaffOrAdmin()

    const [current] = await db.select().from(leads).where(eq(leads.id, data.id))
    if (!current) throw new Error('Lead not found')

    const previousStage = current.pipelineStage
    const isDnc = data.stage === 'do_not_contact'

    const [updated] = await db
      .update(leads)
      .set({
        pipelineStage: data.stage,
        nextFollowUpDate: isDnc ? null : current.nextFollowUpDate,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, data.id))
      .returning()

    if (isDnc) {
      await db
        .update(leadCampaignEnrollments)
        .set({ status: 'terminated', pausedReason: 'do_not_contact', updatedAt: new Date() })
        .where(and(eq(leadCampaignEnrollments.leadId, data.id), eq(leadCampaignEnrollments.status, 'active')))
    }

    await db.insert(leadActivities).values({
      leadId: data.id,
      userId: session.userId,
      userName: (session.email ?? '').split('@')[0],
      note: data.note?.trim() || `Stage changed from ${previousStage} to ${data.stage}`,
      type: 'stage_change',
      stageFrom: previousStage,
      stageTo: data.stage,
    })

    return { lead: updated }
  })

/**
 * Server Function: Add an activity note to a lead
 */
export const addLeadActivityServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      leadId: string
      note: string
      type?: 'note' | 'call' | 'email' | 'meeting'
      newStage?: PipelineStage
      nextFollowUpDate?: string | null
    }) => data
  )
  .handler(async ({ data }): Promise<{ activity: LeadActivity; lead: Lead }> => {
    const session = await assertStaffOrAdmin()

    if (!data.note || !data.note.trim()) {
      throw new Error('Activity note cannot be empty')
    }

    const [leadRow] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!leadRow) throw new Error('Lead not found')

    const now = new Date()
    const updateLeadPayload: Record<string, any> = {
      lastContactDate: now,
      updatedAt: now,
    }

    let stageFrom: string | null = null
    let stageTo: string | null = null

    if (data.newStage && data.newStage !== leadRow.pipelineStage) {
      updateLeadPayload.pipelineStage = data.newStage
      stageFrom = leadRow.pipelineStage
      stageTo = data.newStage
      if (data.newStage === 'do_not_contact') {
        updateLeadPayload.nextFollowUpDate = null
        await db
          .update(leadCampaignEnrollments)
          .set({ status: 'terminated', pausedReason: 'do_not_contact', updatedAt: now })
          .where(and(eq(leadCampaignEnrollments.leadId, data.leadId), eq(leadCampaignEnrollments.status, 'active')))
      }
    }

    if (data.nextFollowUpDate !== undefined && data.newStage !== 'do_not_contact') {
      updateLeadPayload.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null
    }

    const [updatedLead] = await db
      .update(leads)
      .set(updateLeadPayload)
      .where(eq(leads.id, data.leadId))
      .returning()

    const [newActivity] = await db
      .insert(leadActivities)
      .values({
        leadId: data.leadId,
        userId: session.userId,
        userName: (session.email ?? '').split('@')[0],
        note: data.note.trim(),
        type: data.type || 'note',
        stageFrom,
        stageTo,
        nextFollowUpDate: updatedLead.nextFollowUpDate,
      })
      .returning()

    return { activity: newActivity, lead: updatedLead }
  })

/**
 * Server Function: Delete lead (Superadmin only)
 */
export const deleteLeadServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const session = await assertStaffOrAdmin()
    if (session.role !== 'superadmin' && session.role !== 'admin') {
      throw new Error('Forbidden: Only superadmin can delete leads')
    }

    await db.delete(leads).where(eq(leads.id, data.id))

    await logActivity({
      userId: session.userId,
      action: 'delete_lead',
    })

    return { success: true }
  })

// ============================================================================
// CAMPAIGNS & MULTI-CHANNEL SEQUENCE ENGINE
// ============================================================================

export interface CampaignWithSteps extends Campaign {
  steps: CampaignStep[]
  activeLeadsCount: number
}

/**
 * Server Function: Get all campaigns
 */
export const getCampaignsServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ campaigns: CampaignWithSteps[] }> => {
    await assertStaffOrAdmin()

    const allCampaigns = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt))
    const allSteps = await db.select().from(campaignSteps).orderBy(asc(campaignSteps.stepOrder))
    const enrollments = await db
      .select({
        campaignId: leadCampaignEnrollments.campaignId,
        count: sql<number>`count(*)::int`,
      })
      .from(leadCampaignEnrollments)
      .where(eq(leadCampaignEnrollments.status, 'active'))
      .groupBy(leadCampaignEnrollments.campaignId)

    const enrollmentCountMap = new Map<string, number>()
    for (const e of enrollments) {
      enrollmentCountMap.set(e.campaignId, e.count)
    }

    const stepsMap = new Map<string, CampaignStep[]>()
    for (const s of allSteps) {
      if (!stepsMap.has(s.campaignId)) stepsMap.set(s.campaignId, [])
      stepsMap.get(s.campaignId)!.push(s)
    }

    const result: CampaignWithSteps[] = allCampaigns.map((c) => ({
      ...c,
      steps: stepsMap.get(c.id) || [],
      activeLeadsCount: enrollmentCountMap.get(c.id) || 0,
    }))

    return { campaigns: result }
  }
)

/**
 * Server Function: Save campaign (create or update with full steps)
 */
export const saveCampaignServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id?: string
      name: string
      description?: string
      isActive?: boolean
      steps: Array<{
        stepOrder: number
        label: string
        channel: 'email' | 'contact_form' | 'phone'
        delayDays: number
        subjectTemplate?: string | null
        bodyTemplate?: string | null
        callScript?: string | null
      }>
    }) => data
  )
  .handler(async ({ data }): Promise<{ campaign: Campaign }> => {
    const session = await assertStaffOrAdmin()

    if (!data.name || !data.name.trim()) {
      throw new Error('Campaign name is required')
    }
    if (!data.steps || data.steps.length === 0) {
      throw new Error('Campaign must have at least one step')
    }

    let campaignId = data.id

    if (campaignId) {
      const [updated] = await db
        .update(campaigns)
        .set({
          name: data.name.trim(),
          description: data.description?.trim() || null,
          isActive: data.isActive ?? true,
          updatedAt: new Date(),
        })
        .where(eq(campaigns.id, campaignId))
        .returning()

      // Delete existing steps and re-insert
      await db.delete(campaignSteps).where(eq(campaignSteps.campaignId, campaignId))
    } else {
      const [created] = await db
        .insert(campaigns)
        .values({
          name: data.name.trim(),
          description: data.description?.trim() || null,
          isActive: data.isActive ?? true,
          createdById: session.userId,
        })
        .returning()
      campaignId = created.id
    }

    // Insert steps
    for (let i = 0; i < data.steps.length; i++) {
      const s = data.steps[i]
      await db.insert(campaignSteps).values({
        campaignId: campaignId!,
        stepOrder: i + 1,
        label: s.label.trim() || `Step ${i + 1}`,
        channel: s.channel,
        delayDays: Math.max(0, s.delayDays || 0),
        subjectTemplate: s.channel === 'email' ? s.subjectTemplate?.trim() || null : null,
        bodyTemplate: s.channel !== 'phone' ? s.bodyTemplate?.trim() || null : null,
        callScript: s.channel === 'phone' ? s.callScript?.trim() || null : null,
      })
    }

    const [finalCampaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId!))
    return { campaign: finalCampaign }
  })

/**
 * Server Function: Enroll a lead in a campaign sequence
 */
export const enrollLeadInCampaignServerFn = createServerFn({ method: 'POST' })
  .validator((data: { leadId: string; campaignId: string }) => data)
  .handler(async ({ data }): Promise<{ enrollment: LeadCampaignEnrollment }> => {
    const session = await assertStaffOrAdmin()

    const [lead] = await db.select().from(leads).where(eq(leads.id, data.leadId))
    if (!lead) throw new Error('Lead not found')
    if (lead.pipelineStage === 'do_not_contact') {
      throw new Error('Cannot enroll lead: marked as Do Not Contact')
    }

    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, data.campaignId))
    if (!campaign || !campaign.isActive) {
      throw new Error('Selected campaign is invalid or inactive')
    }

    const steps = await db
      .select()
      .from(campaignSteps)
      .where(eq(campaignSteps.campaignId, data.campaignId))
      .orderBy(asc(campaignSteps.stepOrder))

    if (steps.length === 0) {
      throw new Error('Campaign has no defined steps')
    }

    // Terminate any previous active or paused enrollments
    await db
      .update(leadCampaignEnrollments)
      .set({ status: 'terminated', pausedReason: 'enrolled_new_campaign', updatedAt: new Date() })
      .where(and(eq(leadCampaignEnrollments.leadId, data.leadId), inArray(leadCampaignEnrollments.status, ['active', 'paused'])))

    const now = new Date()
    const [enrollment] = await db
      .insert(leadCampaignEnrollments)
      .values({
        leadId: data.leadId,
        campaignId: data.campaignId,
        status: 'active',
        currentStepOrder: 1,
        enrolledById: session.userId,
      })
      .returning()

    // Create step logs for all steps
    const step1DelayMs = steps[0].delayDays * 24 * 60 * 60 * 1000
    const step1DueDate = new Date(now.getTime() + step1DelayMs)

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const isFirst = i === 0
      const dueDate = isFirst ? step1DueDate : new Date(step1DueDate.getTime() + 999 * 24 * 60 * 60 * 1000) // placeholder for future steps
      const status = isFirst ? (step1DueDate <= now ? 'due' : 'not_due') : 'not_due'

      await db.insert(leadCampaignStepLogs).values({
        enrollmentId: enrollment.id,
        leadId: data.leadId,
        stepId: step.id,
        stepOrder: step.stepOrder,
        channel: step.channel,
        status,
        dueDate,
      })
    }

    // Update lead's next follow up date to step 1 due date
    await db
      .update(leads)
      .set({
        nextFollowUpDate: step1DueDate,
        updatedAt: now,
      })
      .where(eq(leads.id, data.leadId))

    await db.insert(leadActivities).values({
      leadId: data.leadId,
      userId: session.userId,
      userName: (session.email ?? '').split('@')[0],
      note: `Enrolled in campaign sequence: "${campaign.name}". Step 1 due: ${step1DueDate.toLocaleDateString()}.`,
      type: 'note',
      nextFollowUpDate: step1DueDate,
    })

    return { enrollment }
  })

/**
 * Server Function: Get Due Today and Overdue Multi-Channel Worklist
 */
export const getDueTodayWorklistServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { assignedTo?: string; channel?: string }) => data || {})
  .handler(async ({ data }): Promise<{ worklist: DueWorklistItem[] }> => {
    await assertStaffOrAdmin()

    const now = new Date()
    const endOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))

    // Query step logs that are due or overdue under active enrollments
    const rawItems = await db
      .select({
        stepLog: leadCampaignStepLogs,
        lead: leads,
        step: campaignSteps,
        campaign: campaigns,
        assignedUserName: users.name,
      })
      .from(leadCampaignStepLogs)
      .innerJoin(leadCampaignEnrollments, eq(leadCampaignStepLogs.enrollmentId, leadCampaignEnrollments.id))
      .innerJoin(leads, eq(leadCampaignStepLogs.leadId, leads.id))
      .innerJoin(campaignSteps, eq(leadCampaignStepLogs.stepId, campaignSteps.id))
      .innerJoin(campaigns, eq(campaignSteps.campaignId, campaigns.id))
      .leftJoin(users, eq(leads.assignedTo, users.id))
      .where(
        and(
          eq(leadCampaignEnrollments.status, 'active'),
          inArray(leadCampaignStepLogs.status, ['due', 'not_due']),
          lte(leadCampaignStepLogs.dueDate, endOfToday),
          sql`${leads.pipelineStage} != 'do_not_contact'`
        )
      )
      .orderBy(asc(leadCampaignStepLogs.dueDate), asc(leads.companyName))

    const worklist: DueWorklistItem[] = []

    for (const item of rawItems) {
      if (data.assignedTo && item.lead.assignedTo !== data.assignedTo) continue
      if (data.channel && item.step.channel !== data.channel) continue

      const dueDate = new Date(item.stepLog.dueDate)
      const isOverdue = dueDate < new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))

      // Merge tags substitution
      const renderedSubject = substituteMergeFields(item.step.subjectTemplate, item.lead)
      let renderedBody = substituteMergeFields(item.step.bodyTemplate, item.lead)
      const renderedScript = substituteMergeFields(item.step.callScript, item.lead)

      let complianceNotice: string | null = null
      let complianceWarning: string | null = null

      if (item.step.channel === 'email') {
        if (item.lead.country === 'Canada' || item.lead.country === 'Australia') {
          complianceWarning = `Consent Required: Recipient is in ${item.lead.country}. CASL / Spam Act requires prior consent before commercial electronic messages.`
        }
        // US CAN-SPAM mandatory elements
        complianceNotice = 'Opt-out notice and business postal address included in template footer.'
        renderedBody += `\n\n---\nIf you prefer not to receive future emails regarding local search visibility, simply reply with "STOP" or "UNSUBSCRIBE" and you will be immediately removed.\nBuilt by Miguel | [Your Business Address or PO Box]`
      }

      worklist.push({
        stepLogId: item.stepLog.id,
        enrollmentId: item.stepLog.enrollmentId,
        leadId: item.lead.id,
        companyName: item.lead.companyName,
        websiteUrl: item.lead.websiteUrl,
        hasWebsite: item.lead.hasWebsite,
        hasContactForm: item.lead.hasContactForm,
        email: item.lead.email,
        phone: item.lead.phone,
        country: item.lead.country,
        industry: item.lead.industry,
        cityArea: item.lead.cityArea,
        assignedToName: item.assignedUserName,
        assignedToId: item.lead.assignedTo,
        stepId: item.step.id,
        stepOrder: item.step.stepOrder,
        stepLabel: item.step.label,
        channel: item.step.channel as any,
        dueDate: dueDate.toISOString(),
        isOverdue,
        campaignName: item.campaign.name,
        renderedSubject: renderedSubject || null,
        renderedBody: renderedBody || null,
        renderedScript: renderedScript || null,
        complianceNotice,
        complianceWarning,
      })
    }

    return { worklist }
  })

/**
 * Server Function: Mark campaign step as completed (Email sent, form submitted, or call logged)
 */
export const completeCampaignStepServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      stepLogId: string
      callOutcome?: 'answered' | 'no_answer' | 'voicemail_left' | 'callback_scheduled' | 'wrong_number'
      notes?: string
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; nextStepDue?: string | null }> => {
    const session = await assertStaffOrAdmin()

    const [stepLog] = await db
      .select()
      .from(leadCampaignStepLogs)
      .where(eq(leadCampaignStepLogs.id, data.stepLogId))

    if (!stepLog) throw new Error('Step log record not found')

    const now = new Date()

    // 1. Mark this step log as completed
    await db
      .update(leadCampaignStepLogs)
      .set({
        status: 'completed',
        completedAt: now,
        completedById: session.userId,
        callOutcome: data.callOutcome || null,
        notes: data.notes?.trim() || null,
        updatedAt: now,
      })
      .where(eq(leadCampaignStepLogs.id, data.stepLogId))

    // 2. Log activity in leadActivities
    let activityNote = ''
    if (stepLog.channel === 'email') {
      activityNote = `Completed Email touch (Step ${stepLog.stepOrder}).`
    } else if (stepLog.channel === 'contact_form') {
      activityNote = `Submitted website Contact Form touch (Step ${stepLog.stepOrder}).`
    } else if (stepLog.channel === 'phone') {
      activityNote = `Completed Phone Call touch (Step ${stepLog.stepOrder}). Outcome: ${data.callOutcome || 'Completed'}. ${data.notes ? 'Notes: ' + data.notes.trim() : ''}`
    }

    await db.insert(leadActivities).values({
      leadId: stepLog.leadId,
      userId: session.userId,
      userName: (session.email ?? '').split('@')[0],
      note: activityNote,
      type: stepLog.channel === 'phone' ? 'call' : stepLog.channel === 'email' ? 'email' : 'note',
    })

    // Update lastContactDate
    await db
      .update(leads)
      .set({ lastContactDate: now, updatedAt: now })
      .where(eq(leads.id, stepLog.leadId))

    // 3. Find next step in enrollment
    const nextStepOrder = stepLog.stepOrder + 1
    const [nextStepLog] = await db
      .select({
        log: leadCampaignStepLogs,
        step: campaignSteps,
      })
      .from(leadCampaignStepLogs)
      .innerJoin(campaignSteps, eq(leadCampaignStepLogs.stepId, campaignSteps.id))
      .where(
        and(
          eq(leadCampaignStepLogs.enrollmentId, stepLog.enrollmentId),
          eq(leadCampaignStepLogs.stepOrder, nextStepOrder)
        )
      )

    let nextStepDueStr: string | null = null

    if (nextStepLog) {
      // Calculate next step dueDate = now + delayDays
      const delayMs = nextStepLog.step.delayDays * 24 * 60 * 60 * 1000
      const nextDueDate = new Date(now.getTime() + delayMs)
      nextStepDueStr = nextDueDate.toISOString()

      await db
        .update(leadCampaignStepLogs)
        .set({
          dueDate: nextDueDate,
          status: nextDueDate <= now ? 'due' : 'not_due',
          updatedAt: now,
        })
        .where(eq(leadCampaignStepLogs.id, nextStepLog.log.id))

      await db
        .update(leadCampaignEnrollments)
        .set({
          currentStepOrder: nextStepOrder,
          updatedAt: now,
        })
        .where(eq(leadCampaignEnrollments.id, stepLog.enrollmentId))

      // Update lead next follow up date
      await db
        .update(leads)
        .set({
          nextFollowUpDate: nextDueDate,
          pipelineStage: 'attempted_contact',
          updatedAt: now,
        })
        .where(eq(leads.id, stepLog.leadId))
    } else {
      // Sequence completed!
      await db
        .update(leadCampaignEnrollments)
        .set({
          status: 'completed',
          completedAt: now,
          updatedAt: now,
        })
        .where(eq(leadCampaignEnrollments.id, stepLog.enrollmentId))

      await db.insert(leadActivities).values({
        leadId: stepLog.leadId,
        userId: session.userId,
        userName: (session.email ?? '').split('@')[0],
        note: 'Completed all steps in sequence.',
        type: 'note',
      })
    }

    return { success: true, nextStepDue: nextStepDueStr }
  })

/**
 * Server Function: Mark response received (Pauses sequence and prompts stage change)
 */
export const markLeadResponseReceivedServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      leadId: string
      enrollmentId?: string
      channel?: string
      notes?: string
      newStage?: PipelineStage
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; suggestedStage: PipelineStage }> => {
    const session = await assertStaffOrAdmin()

    const now = new Date()

    // 1. Pause active campaign enrollments
    await db
      .update(leadCampaignEnrollments)
      .set({
        status: 'paused',
        pausedReason: 'response_received',
        updatedAt: now,
      })
      .where(
        and(
          eq(leadCampaignEnrollments.leadId, data.leadId),
          eq(leadCampaignEnrollments.status, 'active')
        )
      )

    // 2. Mark step logs responseReceived
    await db
      .update(leadCampaignStepLogs)
      .set({
        responseReceived: true,
        updatedAt: now,
      })
      .where(
        and(
          eq(leadCampaignStepLogs.leadId, data.leadId),
          inArray(leadCampaignStepLogs.status, ['due', 'not_due'])
        )
      )

    const stageToSet = data.newStage || 'contacted'

    // 3. Update lead stage & lastContactDate
    await db
      .update(leads)
      .set({
        pipelineStage: stageToSet,
        lastContactDate: now,
        updatedAt: now,
      })
      .where(eq(leads.id, data.leadId))

    // 4. Log activity
    await db.insert(leadActivities).values({
      leadId: data.leadId,
      userId: session.userId,
      userName: (session.email ?? '').split('@')[0],
      note: `Response received on ${data.channel || 'outreach channel'}! Sequence paused. ${data.notes ? 'Notes: ' + data.notes.trim() : ''}`,
      type: 'note',
      stageFrom: 'attempted_contact',
      stageTo: stageToSet,
    })

    return { success: true, suggestedStage: stageToSet }
  })

/**
 * Server Function: Terminate or pause lead campaign
 */
export const terminateLeadCampaignServerFn = createServerFn({ method: 'POST' })
  .validator((data: { enrollmentId: string; reason?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    await assertStaffOrAdmin()

    await db
      .update(leadCampaignEnrollments)
      .set({
        status: 'terminated',
        pausedReason: data.reason || 'manual_termination',
        updatedAt: new Date(),
      })
      .where(eq(leadCampaignEnrollments.id, data.enrollmentId))

    return { success: true }
  })
