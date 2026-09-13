import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useTransition, useEffect, useMemo } from 'react'
import {
  Users,
  Target,
  Clock,
  Calendar,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowRight,
  UserCheck,
  User,
  ShieldAlert,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import { requireAdmin, checkAuthServerFn } from '../../lib/auth'
import {
  getLeadsServerFn,
  getLeadByIdServerFn,
  checkLeadDuplicatesServerFn,
  createLeadServerFn,
  updateLeadServerFn,
  updateLeadStageServerFn,
  addLeadActivityServerFn,
  deleteLeadServerFn,
  getStaffUsersServerFn,
  PIPELINE_STAGES,
  INDUSTRIES,
  GBP_STATUSES,
  LEAD_SOURCES,
  type PipelineStage,
  type LeadWithAssignee,
  type StaffUserItem,
} from '../../server/leads-crm'
import type { LeadActivity } from '../../db/schema'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/leads')({
  beforeLoad: async ({ location }) => {
    // Requires staff or admin role (superadmin, partner, partner_employee) - blocks clients
    await requireAdmin({ location })
  },
  loader: async ({ location }) => {
    const auth = await checkAuthServerFn()
    const searchParams = new URLSearchParams(location.search)
    const viewParam = (searchParams.get('view') || 'due') as 'due' | 'pipeline' | 'table'
    const stageParam = searchParams.get('stage') || 'all'
    const assignedParam = searchParams.get('assigned') || 'all'
    const industryParam = searchParams.get('industry') || 'all'
    const qParam = searchParams.get('q') || ''
    const overdueOnly = searchParams.get('overdue') === 'true'

    const [leadsData, staffData] = await Promise.all([
      getLeadsServerFn({
        data: {
          stage: stageParam,
          assignedTo: assignedParam,
          industry: industryParam,
          overdueOnly,
          search: qParam,
        },
      }),
      getStaffUsersServerFn(),
    ])

    return {
      auth,
      leads: leadsData.leads,
      counts: leadsData.counts,
      staff: staffData.staff,
      currentView: viewParam,
      currentStage: stageParam,
      currentAssigned: assignedParam,
      currentIndustry: industryParam,
      currentSearch: qParam,
      overdueOnly,
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Leads & Prospect Nurturing | Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLeadsPage,
})

function formatDate(dateInput: Date | string | null): string {
  if (!dateInput) return 'None'
  try {
    const d = new Date(dateInput)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return 'Invalid Date'
  }
}

function formatRelativeFollowUp(dateInput: Date | string | null): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dateInput) return { text: 'Not scheduled', isOverdue: false, isToday: false }
  try {
    const now = new Date()
    const target = new Date(dateInput)
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
    const startOfTarget = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate(), 0, 0, 0))

    const diffDays = Math.round((startOfTarget.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000))

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays)
      return { text: `${absDays}d overdue`, isOverdue: true, isToday: false }
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isToday: true }
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', isOverdue: false, isToday: false }
    } else {
      return { text: `In ${diffDays} days`, isOverdue: false, isToday: false }
    }
  } catch {
    return { text: 'Invalid Date', isOverdue: false, isToday: false }
  }
}

function AdminLeadsPage() {
  const {
    auth,
    leads: allLeads,
    counts,
    staff,
    currentView,
    currentStage,
    currentAssigned,
    currentIndustry,
    currentSearch,
    overdueOnly,
  } = Route.useLoaderData()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Selected Lead Modal / Slide-over State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<LeadWithAssignee | null>(null)
  const [leadActivitiesList, setLeadActivitiesList] = useState<LeadActivity[]>([])
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  // Add Note Form State inside Detail Modal
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteType, setNewNoteType] = useState<'note' | 'call' | 'email' | 'meeting'>('note')
  const [newNoteNextFollowUp, setNewNoteNextFollowUp] = useState('')
  const [newNoteStage, setNewNoteStage] = useState<PipelineStage | ''>('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Add Lead Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addCompanyName, setAddCompanyName] = useState('')
  const [addWebsiteUrl, setAddWebsiteUrl] = useState('')
  const [addHasWebsite, setAddHasWebsite] = useState<'yes' | 'no' | 'unknown'>('unknown')
  const [addEmail, setAddEmail] = useState('')
  const [addPhone, setAddPhone] = useState('')
  const [addGbpStatus, setAddGbpStatus] = useState<any>('unknown')
  const [addIndustry, setAddIndustry] = useState<any>('other')
  const [addCityArea, setAddCityArea] = useState('')
  const [addLeadSource, setAddLeadSource] = useState<any>('manual_research')
  const [addPipelineStage, setAddPipelineStage] = useState<PipelineStage>('new')
  const [addAssignedTo, setAddAssignedTo] = useState<string>(auth.userId || '')
  const [addNextFollowUpDate, setAddNextFollowUpDate] = useState('')
  const [addInitialNote, setAddInitialNote] = useState('')
  const [duplicatesWarning, setDuplicatesWarning] = useState<Array<{ id: string; companyName: string; email: string | null; phone: string | null; pipelineStage: string; assignedToName: string | null }>>([])
  const [isCreatingLead, setIsCreatingLead] = useState(false)

  // Inline Detail Edit States
  const [editingField, setEditingField] = useState<string | null>(null)

  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

  // Load Lead Detail when selectedLeadId changes
  useEffect(() => {
    if (!selectedLeadId) {
      setSelectedLead(null)
      setLeadActivitiesList([])
      return
    }

    let isMounted = true
    setIsLoadingDetail(true)

    getLeadByIdServerFn({ data: { leadId: selectedLeadId } })
      .then((res) => {
        if (isMounted) {
          setSelectedLead(res.lead)
          setLeadActivitiesList(res.activities)
          setNewNoteStage(res.lead.pipelineStage as PipelineStage)
          if (res.lead.nextFollowUpDate) {
            setNewNoteNextFollowUp(new Date(res.lead.nextFollowUpDate).toISOString().split('T')[0])
          } else {
            setNewNoteNextFollowUp('')
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load lead details', err)
      })
      .finally(() => {
        if (isMounted) setIsLoadingDetail(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedLeadId])

  // Check duplicates on Add Form input
  useEffect(() => {
    if (!isAddModalOpen) return
    const timeout = setTimeout(async () => {
      if (addCompanyName.trim().length >= 3 || addEmail.trim() || addPhone.trim()) {
        try {
          const res = await checkLeadDuplicatesServerFn({
            data: {
              companyName: addCompanyName.trim(),
              email: addEmail.trim() || undefined,
              phone: addPhone.trim() || undefined,
            },
          })
          setDuplicatesWarning(res.duplicates)
        } catch {
          // Ignore
        }
      } else {
        setDuplicatesWarning([])
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [addCompanyName, addEmail, addPhone, isAddModalOpen])

  // Auto-suggest HasWebsite = 'yes' when URL typed
  useEffect(() => {
    if (addWebsiteUrl.trim() && addHasWebsite === 'unknown') {
      setAddHasWebsite('yes')
    }
  }, [addWebsiteUrl, addHasWebsite])

  const handleViewChange = (view: 'due' | 'pipeline' | 'table') => {
    router.navigate({
      to: '/admin/leads',
      search: {
        view,
        stage: currentStage,
        assigned: currentAssigned,
        industry: currentIndustry,
        overdue: overdueOnly ? 'true' : undefined,
        q: currentSearch || undefined,
      },
    })
  }

  const handleStageDrop = async (leadId: string, newStage: PipelineStage) => {
    try {
      await updateLeadStageServerFn({
        data: { leadId, newStage },
      })
      startTransition(() => {
        router.invalidate()
      })
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, pipelineStage: newStage } : null))
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update stage')
    }
  }

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !newNoteText.trim()) return

    setIsAddingNote(true)
    try {
      await addLeadActivityServerFn({
        data: {
          leadId: selectedLead.id,
          note: newNoteText.trim(),
          type: newNoteType,
          newStage: newNoteStage || undefined,
          nextFollowUpDate: newNoteNextFollowUp ? new Date(newNoteNextFollowUp).toISOString() : null,
        },
      })

      setNewNoteText('')
      // Refresh lead details & activities
      const updated = await getLeadByIdServerFn({ data: { leadId: selectedLead.id } })
      setSelectedLead(updated.lead)
      setLeadActivitiesList(updated.activities)
      startTransition(() => {
        router.invalidate()
      })
    } catch (err: any) {
      alert(err?.message || 'Failed to add activity note')
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addCompanyName.trim()) return

    setIsCreatingLead(true)
    try {
      const res = await createLeadServerFn({
        data: {
          companyName: addCompanyName.trim(),
          websiteUrl: addWebsiteUrl.trim() || undefined,
          hasWebsite: addHasWebsite,
          email: addEmail.trim() || undefined,
          phone: addPhone.trim() || undefined,
          gbpStatus: addGbpStatus,
          industry: addIndustry,
          cityArea: addCityArea.trim() || undefined,
          leadSource: addLeadSource,
          pipelineStage: addPipelineStage,
          assignedTo: addAssignedTo || undefined,
          nextFollowUpDate: addNextFollowUpDate ? new Date(addNextFollowUpDate).toISOString() : null,
          initialNote: addInitialNote.trim() || undefined,
        },
      })

      setIsAddModalOpen(false)
      // Reset form
      setAddCompanyName('')
      setAddWebsiteUrl('')
      setAddHasWebsite('unknown')
      setAddEmail('')
      setAddPhone('')
      setAddGbpStatus('unknown')
      setAddIndustry('other')
      setAddCityArea('')
      setAddInitialNote('')
      setDuplicatesWarning([])

      startTransition(() => {
        router.invalidate()
      })

      // Open new lead details
      if (res.leadId) {
        setSelectedLeadId(res.leadId)
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create lead')
    } finally {
      setIsCreatingLead(false)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Permanently delete this lead and its entire activity history?')) return
    try {
      await deleteLeadServerFn({ data: { leadId } })
      setSelectedLeadId(null)
      startTransition(() => {
        router.invalidate()
      })
    } catch (err: any) {
      alert(err?.message || 'Failed to delete lead')
    }
  }

  // Group leads by stage for Kanban view
  const leadsByStage = useMemo(() => {
    const map: Record<PipelineStage, LeadWithAssignee[]> = {
      new: [],
      attempted_contact: [],
      contacted: [],
      follow_up_scheduled: [],
      interested_qualified: [],
      proposal_sent: [],
      won: [],
      lost: [],
      do_not_contact: [],
    }
    allLeads.forEach((l) => {
      const st = l.pipelineStage as PipelineStage
      if (map[st]) {
        map[st].push(l)
      }
    })
    return map
  }, [allLeads])

  // Due Today & Overdue leads for Dashboard view
  const dueLeads = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
    const terminal = ['won', 'lost', 'do_not_contact']

    return allLeads
      .filter((l) => {
        if (!l.nextFollowUpDate || terminal.includes(l.pipelineStage)) return false
        return new Date(l.nextFollowUpDate) < endOfToday
      })
      .sort((a, b) => {
        const dateA = new Date(a.nextFollowUpDate!).getTime()
        const dateB = new Date(b.nextFollowUpDate!).getTime()
        return dateA - dateB // oldest overdue first
      })
  }, [allLeads])

  return (
    <AdminShell
      title="Leads & Pipeline"
      description="Track, assign, and nurture prospective business clients through active outreach."
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Top Header Row with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Prospect Outreach & Pipeline
              </h1>
              {counts.overdue > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500 text-white animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {counts.overdue} overdue
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Shared team CRM: prevent leads from going cold and coordinate outreach without duplicated calls.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.invalidate()}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* View Tabs & Quick Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Views Selector */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-start">
            <button
              type="button"
              onClick={() => handleViewChange('due')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                currentView === 'due'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Follow-Ups</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                {counts.overdue + counts.dueToday}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('pipeline')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                currentView === 'pipeline'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pipeline Board</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {counts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('table')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                currentView === 'table'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>All Leads</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Staff */}
            <select
              value={currentAssigned}
              onChange={(e) => {
                router.navigate({
                  to: '/admin/leads',
                  search: {
                    view: currentView,
                    assigned: e.target.value,
                    stage: currentStage,
                    industry: currentIndustry,
                    overdue: overdueOnly ? 'true' : undefined,
                    q: currentSearch || undefined,
                  },
                })
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono"
            >
              <option value="all">All Owners</option>
              <option value="unassigned">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.email}
                </option>
              ))}
            </select>

            {/* Filter by Industry */}
            <select
              value={currentIndustry}
              onChange={(e) => {
                router.navigate({
                  to: '/admin/leads',
                  search: {
                    view: currentView,
                    industry: e.target.value,
                    assigned: currentAssigned,
                    stage: currentStage,
                    overdue: overdueOnly ? 'true' : undefined,
                    q: currentSearch || undefined,
                  },
                })
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono"
            >
              <option value="all">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.label}
                </option>
              ))}
            </select>

            {/* Overdue Only toggle */}
            <button
              type="button"
              onClick={() => {
                router.navigate({
                  to: '/admin/leads',
                  search: {
                    view: currentView,
                    overdue: !overdueOnly ? 'true' : undefined,
                    assigned: currentAssigned,
                    stage: currentStage,
                    industry: currentIndustry,
                    q: currentSearch || undefined,
                  },
                })
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border ${
                overdueOnly
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue Only</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: Follow-Up Dashboard (Home View) */}
        {currentView === 'due' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 space-y-1">
                <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
                  Overdue Follow-Ups
                </span>
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {counts.overdue}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Leads past their scheduled contact date.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  Due Today
                </span>
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {counts.dueToday}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scheduled for outreach today.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Active Prospects
                </span>
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {counts.total - (counts.byStage.won + counts.byStage.lost + counts.byStage.do_not_contact)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total prospects in active nurturing.
                </p>
              </div>
            </div>

            {/* List of Due Leads */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Priority Follow-Up Queue
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ordered by longest overdue first to ensure no prospect goes cold.
                  </p>
                </div>
              </div>

              {dueLeads.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    You're completely caught up!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No leads are overdue or scheduled for today. Check the Pipeline Board to find new prospects to reach out to.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dueLeads.map((lead) => {
                    const followUpInfo = formatRelativeFollowUp(lead.nextFollowUpDate)
                    const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.pipelineStage)

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-bold text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition">
                              {lead.companyName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {lead.industry}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                              {stageObj?.label || lead.pipelineStage}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {lead.phone}
                              </span>
                            )}
                            {lead.cityArea && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {lead.cityArea}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                              {lead.assignedUserName || 'Unassigned'}
                            </span>
                            <span>Last contact: {formatDate(lead.lastContactDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                              followUpInfo.isOverdue
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {followUpInfo.text}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLeadId(lead.id)
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer shadow-xs"
                          >
                            <span>Log Contact</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Pipeline (Kanban Board) */}
        {currentView === 'pipeline' && (
          <div className="overflow-x-auto pb-6">
            <div className="inline-flex gap-4 min-w-full items-start">
              {PIPELINE_STAGES.map((stage) => {
                const stageCards = leadsByStage[stage.id] || []
                const isDnc = stage.id === 'do_not_contact'

                return (
                  <div
                    key={stage.id}
                    className={`w-76 shrink-0 rounded-3xl border flex flex-col max-h-[calc(100vh-14rem)] ${
                      isDnc
                        ? 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/40'
                        : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDnc
                              ? 'bg-rose-500'
                              : stage.id === 'won'
                              ? 'bg-emerald-500'
                              : stage.id === 'lost'
                              ? 'bg-slate-400'
                              : 'bg-amber-500'
                          }`}
                        />
                        <h3 className="font-display font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                          {stage.label}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {stageCards.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[160px]">
                      {stageCards.length === 0 ? (
                        <div className="p-6 text-center text-[11px] font-mono text-slate-400 italic">
                          No leads in stage
                        </div>
                      ) : (
                        stageCards.map((lead) => {
                          const followUpInfo = formatRelativeFollowUp(lead.nextFollowUpDate)

                          return (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLeadId(lead.id)}
                              className={`p-4 rounded-2xl border shadow-xs transition hover:shadow-md cursor-pointer space-y-3 ${
                                isDnc
                                  ? 'bg-white/80 dark:bg-[#111827] border-rose-200 dark:border-rose-900/50'
                                  : 'bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800 hover:border-amber-400/60'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug">
                                    {lead.companyName}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                    {lead.industry}
                                  </span>
                                </div>
                                {lead.cityArea && (
                                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{lead.cityArea}</span>
                                  </p>
                                )}
                              </div>

                              {/* Card Footer: Assignee & Next Follow-Up */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[9px] uppercase">
                                    {lead.assignedUserName ? lead.assignedUserName.charAt(0) : '?'}
                                  </div>
                                  <span className="truncate max-w-[90px]">
                                    {lead.assignedUserName || 'Unassigned'}
                                  </span>
                                </div>

                                {!isDnc && lead.nextFollowUpDate && (
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                      followUpInfo.isOverdue
                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold'
                                        : followUpInfo.isToday
                                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {followUpInfo.text}
                                  </span>
                                )}
                              </div>

                              {/* Accessible Stage Move Selector */}
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="pt-1 flex items-center justify-between text-[11px] text-slate-400"
                              >
                                <span>Move to:</span>
                                <select
                                  value={lead.pipelineStage}
                                  onChange={(e) => handleStageDrop(lead.id, e.target.value as PipelineStage)}
                                  className="text-[10px] font-mono py-0.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                                >
                                  {PIPELINE_STAGES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: Table / List View */}
        {currentView === 'table' && (
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  defaultValue={currentSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.navigate({
                        to: '/admin/leads',
                        search: {
                          view: 'table',
                          q: (e.target as HTMLInputElement).value.trim(),
                          stage: currentStage,
                          assigned: currentAssigned,
                          industry: currentIndustry,
                        },
                      })
                    }
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {allLeads.length} total lead(s)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Company</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Industry</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">City / Area</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Stage</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Assigned To</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Next Follow-Up</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Last Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {allLeads.map((lead) => {
                    const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.pipelineStage)
                    const followUpInfo = formatRelativeFollowUp(lead.nextFollowUpDate)

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition cursor-pointer"
                      >
                        <td className="px-5 py-4 font-display font-bold text-slate-900 dark:text-white">
                          {lead.companyName}
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] uppercase text-slate-600 dark:text-slate-300">
                          {lead.industry}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                          {lead.cityArea || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {stageObj?.label || lead.pipelineStage}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-400">
                          {lead.assignedUserName || 'Unassigned'}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">
                          {lead.nextFollowUpDate ? (
                            <span
                              className={`font-bold ${
                                followUpInfo.isOverdue
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : followUpInfo.isToday
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {followUpInfo.text} ({formatDate(lead.nextFollowUpDate)})
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                          {formatDate(lead.lastContactDate)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEAD DETAIL SLIDE-OVER / MODAL */}
        {selectedLeadId && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedLeadId(null)}
          >
            <div
              className="w-full max-w-2xl bg-white dark:bg-[#111827] h-full shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 space-y-6 animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoadingDetail || !selectedLead ? (
                <div className="flex-1 flex items-center justify-center font-mono text-xs text-slate-400">
                  <Clock className="w-5 h-5 animate-spin mr-2" />
                  Loading prospect details...
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                          {selectedLead.companyName}
                        </h2>
                        {selectedLead.websiteUrl && (
                          <a
                            href={selectedLead.websiteUrl.startsWith('http') ? selectedLead.websiteUrl : `https://${selectedLead.websiteUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                        <span>Added: {formatDate(selectedLead.dateAdded)} by {selectedLead.addedByName || 'Staff'}</span>
                        <span>·</span>
                        <span>Last Contact: {formatDate(selectedLead.lastContactDate)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedLeadId(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* DO NOT CONTACT Safeguard Warning Banner */}
                  {selectedLead.pipelineStage === 'do_not_contact' && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <p className="font-bold">DO NOT CONTACT</p>
                        <p className="leading-relaxed">
                          This business has explicitly requested not to be contacted. Do not perform email or phone outreach. Scheduled follow-ups have been disabled.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Field Highlights & Quick Updates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-slate-400">Current Stage:</span>
                      <select
                        value={selectedLead.pipelineStage}
                        onChange={(e) => handleStageDrop(selectedLead.id, e.target.value as PipelineStage)}
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">Assigned To:</span>
                      <select
                        value={selectedLead.assignedTo || ''}
                        disabled={!isSuperadmin && selectedLead.assignedTo !== auth.userId}
                        onChange={async (e) => {
                          const val = e.target.value || null
                          await updateLeadServerFn({
                            data: { leadId: selectedLead.id, assignedTo: val },
                          })
                          setSelectedLead((prev) => (prev ? { ...prev, assignedTo: val } : null))
                          router.invalidate()
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold disabled:opacity-60"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name || s.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">Industry:</span>
                      <p className="font-semibold text-slate-900 dark:text-white capitalize">
                        {selectedLead.industry}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">Phone:</span>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedLead.phone || 'None entered'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">Email:</span>
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {selectedLead.email || 'None entered'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">GBP Status:</span>
                      <p className="font-semibold text-slate-900 dark:text-white capitalize">
                        {selectedLead.gbpStatus.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Add Activity Note Form */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>Log Outreach Note & Next Action</span>
                    </h3>

                    <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                      <textarea
                        required
                        rows={3}
                        placeholder="e.g. Spoke with owner Anthony. Interested in local map pack audit, requested follow-up next Tuesday..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Interaction Type</label>
                          <select
                            value={newNoteType}
                            onChange={(e) => setNewNoteType(e.target.value as any)}
                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                          >
                            <option value="note">General Note</option>
                            <option value="call">Phone Call</option>
                            <option value="email">Email Outreach</option>
                            <option value="meeting">Meeting / Demo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Advance Stage</label>
                          <select
                            value={newNoteStage}
                            onChange={(e) => setNewNoteStage(e.target.value as PipelineStage)}
                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Next Follow-Up</label>
                          <input
                            type="date"
                            disabled={newNoteStage === 'do_not_contact'}
                            value={newNoteNextFollowUp}
                            onChange={(e) => setNewNoteNextFollowUp(e.target.value)}
                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isAddingNote || !newNoteText.trim()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isAddingNote ? 'Saving...' : 'Add Activity Note'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Activity History Log (Append-only) */}
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Activity Log ({leadActivitiesList.length})
                    </h3>

                    <div className="space-y-3">
                      {leadActivitiesList.map((act) => (
                        <div
                          key={act.id}
                          className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {act.userName}
                            </span>
                            <span>{formatDate(act.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                            {act.note}
                          </p>
                          {act.stageTo && (
                            <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              Stage: {act.stageTo}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delete Lead Button (Superadmin Only) */}
                  {isSuperadmin && (
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Lead Permanently</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ADD LEAD MODAL (With Live Duplicate Checking) */}
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Add Prospective Lead
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Duplicate Warning Banner */}
              {duplicatesWarning.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Possible Duplicate Lead Detected</span>
                  </div>
                  <p className="leading-relaxed">
                    A matching lead already exists in your pipeline:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pt-1 font-mono text-[11px]">
                    {duplicatesWarning.map((d) => (
                      <li key={d.id}>
                        <strong>{d.companyName}</strong> (Stage: {d.pipelineStage}, Owner: {d.assignedToName || 'Unassigned'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Plumbing & Drain Co."
                    value={addCompanyName}
                    onChange={(e) => setAddCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://acmeplumbing.test"
                      value={addWebsiteUrl}
                      onChange={(e) => setAddWebsiteUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Has a Website?
                    </label>
                    <select
                      value={addHasWebsite}
                      onChange={(e) => setAddHasWebsite(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="unknown">Unknown</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="(555) 234-5678"
                      value={addPhone}
                      onChange={(e) => setAddPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="owner@acmeplumbing.test"
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Industry / Trade
                    </label>
                    <select
                      value={addIndustry}
                      onChange={(e) => setAddIndustry(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {INDUSTRIES.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      GBP Status
                    </label>
                    <select
                      value={addGbpStatus}
                      onChange={(e) => setAddGbpStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {GBP_STATUSES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      City / Service Area
                    </label>
                    <input
                      type="text"
                      placeholder="Dallas, TX"
                      value={addCityArea}
                      onChange={(e) => setAddCityArea(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Lead Source
                    </label>
                    <select
                      value={addLeadSource}
                      onChange={(e) => setAddLeadSource(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {LEAD_SOURCES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Assigned Staff Member
                    </label>
                    <select
                      value={addAssignedTo}
                      onChange={(e) => setAddAssignedTo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="">Unassigned</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name || s.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Next Follow-Up Date
                    </label>
                    <input
                      type="date"
                      value={addNextFollowUpDate}
                      onChange={(e) => setAddNextFollowUpDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Initial Outreach Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Found on Google Maps page 2. Unclaimed GBP listing, no active website..."
                    value={addInitialNote}
                    onChange={(e) => setAddInitialNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 font-display">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingLead || !addCompanyName.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 disabled:opacity-50 transition"
                  >
                    {isCreatingLead ? 'Adding...' : 'Create Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
