import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '../../lib/auth'
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
  getCampaignsServerFn,
  saveCampaignServerFn,
  enrollLeadInCampaignServerFn,
  getDueTodayWorklistServerFn,
  completeCampaignStepServerFn,
  markLeadResponseReceivedServerFn,
  terminateLeadCampaignServerFn,
  PIPELINE_STAGES,
  INDUSTRIES,
  COUNTRIES,
  GBP_STATUSES,
  LEAD_SOURCES,
  CHANNELS,
  CALL_OUTCOMES,
  type PipelineStage,
  type LeadWithAssignee,
  type StaffUserItem,
  type DueWorklistItem,
  type CampaignWithSteps,
} from '../../server/leads-crm'
import {
  Target,
  Mail,
  Globe,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Play,
  Pause,
  Plus,
  Search,
  SlidersHorizontal,
  Layers,
  Table2,
  ExternalLink,
  Copy,
  X,
  ChevronRight,
  ShieldAlert,
  FileText,
  Send,
  User,
  Trash2,
  Check,
  Building2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'

export const Route = createFileRoute('/admin/leads')({
  beforeLoad: async ({ location }) => {
    return requireAdmin({ location })
  },
  component: LeadsAdminPage,
})

function LeadsAdminPage() {
  const session = Route.useRouteContext()
  const isSuperadmin = session?.role === 'superadmin' || session?.role === 'admin'

  // View tabs
  const [activeTab, setActiveTab] = useState<'worklist' | 'pipeline' | 'table' | 'campaigns'>('worklist')

  // Data states
  const [leadsList, setLeadsList] = useState<LeadWithAssignee[]>([])
  const [worklist, setWorklist] = useState<DueWorklistItem[]>([])
  const [campaignsList, setCampaignsList] = useState<CampaignWithSteps[]>([])
  const [staffUsers, setStaffUsers] = useState<StaffUserItem[]>([])
  const [counts, setCounts] = useState({
    total: 0,
    overdue: 0,
    dueToday: 0,
    byStage: {} as Record<PipelineStage, number>,
  })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [staffFilter, setStaffFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [dueTodayOnly, setDueTodayOnly] = useState(false)

  // Modals & Panels
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [selectedLeadData, setSelectedLeadData] = useState<any>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)

  // Worklist Action Modals
  const [phoneCallTarget, setPhoneCallTarget] = useState<DueWorklistItem | null>(null)
  const [callOutcomeVal, setCallOutcomeVal] = useState<string>('answered')
  const [callNotesVal, setCallNotesVal] = useState('')

  const [responseModalTarget, setResponseModalTarget] = useState<{ leadId: string; companyName: string; channel?: string } | null>(null)
  const [responseStageVal, setResponseStageVal] = useState<PipelineStage>('contacted')
  const [responseNotesVal, setResponseNotesVal] = useState('')

  const [enrollModalLead, setEnrollModalLead] = useState<LeadWithAssignee | null>(null)
  const [selectedCampaignIdToEnroll, setSelectedCampaignIdToEnroll] = useState<string>('')

  // Campaign edit state
  const [editingCampaign, setEditingCampaign] = useState<{
    id?: string
    name: string
    description: string
    isActive: boolean
    steps: Array<{
      stepOrder: number
      label: string
      channel: 'email' | 'contact_form' | 'phone'
      delayDays: number
      subjectTemplate?: string
      bodyTemplate?: string
      callScript?: string
    }>
  } | null>(null)

  // Copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Load staff
  useEffect(() => {
    getStaffUsersServerFn().then((res) => {
      if (res?.staff) setStaffUsers(res.staff)
    }).catch(console.error)
  }, [])

  // Refresh all core data
  const refreshData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const [leadsRes, worklistRes, campaignsRes] = await Promise.all([
        getLeadsServerFn({
          data: {
            stage: undefined,
            assignedTo: staffFilter || undefined,
            industry: industryFilter || undefined,
            country: countryFilter || undefined,
            overdueOnly,
            dueTodayOnly,
            search: searchQuery || undefined,
          },
        }),
        getDueTodayWorklistServerFn({
          data: {
            assignedTo: staffFilter || undefined,
          },
        }),
        getCampaignsServerFn(),
      ])

      if (leadsRes) {
        setLeadsList(leadsRes.leads)
        setCounts(leadsRes.counts)
      }
      if (worklistRes) {
        setWorklist(worklistRes.worklist)
      }
      if (campaignsRes) {
        setCampaignsList(campaignsRes.campaigns)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load lead tracking data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [staffFilter, industryFilter, countryFilter, overdueOnly, dueTodayOnly, searchQuery])

  // Load Lead Detail Drawer
  const openLeadDrawer = async (leadId: string) => {
    setSelectedLeadId(leadId)
    setDrawerLoading(true)
    try {
      const res = await getLeadByIdServerFn({ data: { id: leadId } })
      if (res) {
        setSelectedLeadData(res)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load lead details')
    } finally {
      setDrawerLoading(false)
    }
  }

  const closeLeadDrawer = () => {
    setSelectedLeadId(null)
    setSelectedLeadData(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Header & Metrics */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <Target className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                  Lead Tracking & Multi-Channel Nurture
                </h1>
                <p className="text-sm text-slate-400">
                  Track prospective trades across Email, Contact Forms, and Phone Calls without dropped follow-ups.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingCampaign({
                  name: '',
                  description: '',
                  isActive: true,
                  steps: [
                    { stepOrder: 1, label: 'Initial Outreach Email', channel: 'email', delayDays: 0, subjectTemplate: 'Quick question for {{company_name}}', bodyTemplate: 'Hi {{contact_name}},\n\nI noticed {{company_name}} in {{city}}...' },
                    { stepOrder: 2, label: 'Contact Form Touch', channel: 'contact_form', delayDays: 3, bodyTemplate: 'Hi team, following up on our email regarding local search visibility for {{company_name}}.' },
                    { stepOrder: 3, label: 'Follow-Up Call', channel: 'phone', delayDays: 5, callScript: 'Hi, may I speak with the owner of {{company_name}} regarding your local Google rankings?' },
                  ],
                })
                setShowCampaignModal(true)
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>New Campaign</span>
            </button>

            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-950 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prospective Lead</span>
            </button>
          </div>
        </div>

        {/* Alerts Banner */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('worklist')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === 'worklist'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Due Today Worklist</span>
              {worklist.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  {worklist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === 'pipeline'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Pipeline Kanban</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>All Leads ({counts.total})</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === 'campaigns'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Campaign Sequences ({campaignsList.length})</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
              Overdue: {counts.overdue}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              Due Today: {counts.dueToday}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              Total Active: {counts.total}
            </span>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search company, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Assigned Staff</option>
              {staffUsers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOverdueOnly(!overdueOnly)
                if (!overdueOnly) setDueTodayOnly(false)
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                overdueOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => {
                setDueTodayOnly(!dueTodayOnly)
                if (!dueTodayOnly) setOverdueOnly(false)
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                dueTodayOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Due Today
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DUE TODAY & OVERDUE WORKLIST                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'worklist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>Multi-Channel Outreach Queue</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Review Before Acting
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tasks scheduled across Email, Website Contact Forms, and Phone Calls. No automated bot sending — review template and execute manually.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Email
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Contact Form
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Phone Call
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading worklist queue...</div>
            ) : worklist.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-medium text-slate-200">You're all caught up!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  There are no outreach steps due today or overdue. Check the Pipeline or enroll new leads into campaigns.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {worklist.map((item) => {
                  const isEmail = item.channel === 'email'
                  const isContactForm = item.channel === 'contact_form'
                  const isPhone = item.channel === 'phone'

                  return (
                    <div
                      key={item.stepLogId}
                      className={`p-5 rounded-2xl border transition bg-slate-950/70 ${
                        item.isOverdue
                          ? 'border-rose-500/30 hover:border-rose-500/50'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top row: Badges & metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                              isEmail
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : isContactForm
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {isEmail && <Mail className="w-3.5 h-3.5" />}
                            {isContactForm && <Globe className="w-3.5 h-3.5" />}
                            {isPhone && <PhoneCall className="w-3.5 h-3.5" />}
                            <span>{item.channel.replace('_', ' ')}</span>
                          </span>

                          <button
                            onClick={() => openLeadDrawer(item.leadId)}
                            className="font-bold text-white hover:text-emerald-400 transition text-base"
                          >
                            {item.companyName}
                          </button>

                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {item.industry}
                          </span>

                          {item.cityArea && (
                            <span className="text-xs text-slate-500">
                              {item.cityArea}
                            </span>
                          )}

                          <span className="text-xs font-mono text-slate-500">
                            [{item.country}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            Campaign: <strong className="text-slate-300">{item.campaignName}</strong> (Step {item.stepOrder}: {item.stepLabel})
                          </span>

                          {item.isOverdue ? (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due Today
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Compliance Warning */}
                      {item.complianceWarning && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                          <span>{item.complianceWarning}</span>
                        </div>
                      )}

                      {/* Content Preview based on Channel */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-3">
                          {isEmail && (
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between text-slate-400">
                                <span>Subject:</span>
                                <button
                                  onClick={() => triggerCopy(`sub-${item.stepLogId}`, item.renderedSubject || '')}
                                  className="hover:text-slate-200 text-[11px] flex items-center gap-1"
                                >
                                  {copiedId === `sub-${item.stepLogId}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>Copy Subject</span>
                                </button>
                              </div>
                              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 font-mono text-xs select-all">
                                {item.renderedSubject}
                              </div>

                              <div className="flex items-center justify-between text-slate-400 pt-1">
                                <span>Email Body Template (Merged):</span>
                                <button
                                  onClick={() => triggerCopy(`body-${item.stepLogId}`, item.renderedBody || '')}
                                  className="hover:text-slate-200 text-[11px] flex items-center gap-1"
                                >
                                  {copiedId === `body-${item.stepLogId}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>Copy Body</span>
                                </button>
                              </div>
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-sans whitespace-pre-wrap max-h-48 overflow-y-auto select-all text-xs leading-relaxed">
                                {item.renderedBody}
                              </div>
                            </div>
                          )}

                          {isContactForm && (
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between text-slate-400">
                                <span className="flex items-center gap-2">
                                  <span>Contact Form Message:</span>
                                  {item.hasContactForm === 'no' && (
                                    <span className="text-rose-400 text-[11px]">(Marked as no contact form on website)</span>
                                  )}
                                </span>
                                <button
                                  onClick={() => triggerCopy(`cf-${item.stepLogId}`, item.renderedBody || '')}
                                  className="hover:text-slate-200 text-[11px] flex items-center gap-1"
                                >
                                  {copiedId === `cf-${item.stepLogId}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>Copy Message</span>
                                </button>
                              </div>
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-sans whitespace-pre-wrap max-h-44 overflow-y-auto select-all text-xs leading-relaxed">
                                {item.renderedBody}
                              </div>
                            </div>
                          )}

                          {isPhone && (
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between text-slate-400">
                                <span>Call Script / Talking Points:</span>
                                <span className="text-emerald-400 font-mono text-sm">{item.phone || 'No phone recorded'}</span>
                              </div>
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-sans whitespace-pre-wrap max-h-44 overflow-y-auto text-xs leading-relaxed">
                                {item.renderedScript || 'Introduce built by Miguel, mention trade SEO presence, ask for decision maker.'}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions Panel */}
                        <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4 space-y-3">
                          <div className="space-y-2 text-xs">
                            <div className="text-slate-400">Recipient Contact:</div>
                            {item.email && (
                              <div className="text-slate-200 font-mono truncate">{item.email}</div>
                            )}
                            {item.phone && (
                              <a
                                href={`tel:${item.phone}`}
                                className="text-emerald-400 hover:underline block font-mono"
                              >
                                {item.phone}
                              </a>
                            )}
                            {item.websiteUrl && (
                              <a
                                href={item.websiteUrl.startsWith('http') ? item.websiteUrl : `https://${item.websiteUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline flex items-center gap-1 truncate text-xs pt-1"
                              >
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span>{item.websiteUrl.replace(/^https?:\/\//, '')}</span>
                              </a>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-2">
                            {isEmail && (
                              <>
                                <a
                                  href={`mailto:${item.email || ''}?subject=${encodeURIComponent(item.renderedSubject || '')}&body=${encodeURIComponent(item.renderedBody || '')}`}
                                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Open In Email Client</span>
                                </a>

                                <button
                                  onClick={async () => {
                                    try {
                                      await completeCampaignStepServerFn({ data: { stepLogId: item.stepLogId } })
                                      setSuccessMsg(`Marked Email step complete for ${item.companyName}`)
                                      refreshData()
                                    } catch (e: any) {
                                      setErrorMsg(e.message)
                                    }
                                  }}
                                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
                                >
                                  Mark as Sent
                                </button>
                              </>
                            )}

                            {isContactForm && (
                              <>
                                {item.websiteUrl && (
                                  <a
                                    href={item.websiteUrl.startsWith('http') ? item.websiteUrl : `https://${item.websiteUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                                  >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Open Website Contact Page</span>
                                  </a>
                                )}

                                <button
                                  onClick={async () => {
                                    try {
                                      await completeCampaignStepServerFn({ data: { stepLogId: item.stepLogId } })
                                      setSuccessMsg(`Marked Contact Form step complete for ${item.companyName}`)
                                      refreshData()
                                    } catch (e: any) {
                                      setErrorMsg(e.message)
                                    }
                                  }}
                                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
                                >
                                  Mark as Submitted
                                </button>
                              </>
                            )}

                            {isPhone && (
                              <button
                                onClick={() => {
                                  setPhoneCallTarget(item)
                                  setCallOutcomeVal('answered')
                                  setCallNotesVal('')
                                }}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Log Call Outcome</span>
                              </button>
                            )}

                            {/* Response Received Trigger */}
                            <button
                              onClick={() => {
                                setResponseModalTarget({
                                  leadId: item.leadId,
                                  companyName: item.companyName,
                                  channel: item.channel,
                                })
                                setResponseStageVal('contacted')
                                setResponseNotesVal('')
                              }}
                              className="w-full py-1.5 bg-slate-900 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Got a Response? Pause Sequence</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PIPELINE KANBAN BOARD                                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <p>Drag or use the stage selector dropdown on each card to transition prospective leads.</p>
              <span>Showing {leadsList.length} leads</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3 overflow-x-auto pb-6">
              {PIPELINE_STAGES.map((stage) => {
                const stageLeads = leadsList.filter((l) => l.pipelineStage === stage.id)

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col min-w-[260px] md:min-w-[220px] bg-slate-950/70 border border-slate-800 rounded-xl p-3 max-h-[calc(100vh-280px)]"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-200 truncate">{stage.label}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {stageLeads.map((lead) => {
                        const isDnc = lead.pipelineStage === 'do_not_contact'

                        return (
                          <div
                            key={lead.id}
                            className={`p-3 rounded-lg border transition text-xs space-y-2 ${
                              isDnc
                                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <button
                                onClick={() => openLeadDrawer(lead.id)}
                                className="font-bold text-white hover:text-emerald-400 text-left transition truncate block max-w-[150px]"
                              >
                                {lead.companyName}
                              </button>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/80">
                                {lead.country}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="capitalize">{lead.industry}</span>
                              {lead.cityArea && <span>• {lead.cityArea}</span>}
                            </div>

                            {/* Active campaign indicator */}
                            {lead.activeCampaignName && !isDnc && (
                              <div className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 truncate">
                                ⚡ {lead.activeCampaignName} (Step {lead.currentStepOrder || 1})
                              </div>
                            )}

                            {isDnc && (
                              <div className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                                ⛔ DO NOT CONTACT
                              </div>
                            )}

                            {/* Follow up date */}
                            {lead.nextFollowUpDate && !isDnc && (
                              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80 text-slate-400">
                                <span>Next touch:</span>
                                <span className="font-mono text-emerald-400">
                                  {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            {/* Stage Selector Dropdown */}
                            <div className="pt-1">
                              <select
                                value={lead.pipelineStage}
                                onChange={async (e) => {
                                  try {
                                    await updateLeadStageServerFn({
                                      data: { id: lead.id, stage: e.target.value as PipelineStage },
                                    })
                                    refreshData()
                                  } catch (err: any) {
                                    setErrorMsg(err.message)
                                  }
                                }}
                                className="w-full py-1 px-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
                              >
                                {PIPELINE_STAGES.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    Move to: {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: TABLE / LIST VIEW                                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'table' && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-3">Industry</th>
                    <th className="py-3.5 px-3">City</th>
                    <th className="py-3.5 px-3">Country</th>
                    <th className="py-3.5 px-3">Contact Form?</th>
                    <th className="py-3.5 px-3">Stage</th>
                    <th className="py-3.5 px-3">Assigned To</th>
                    <th className="py-3.5 px-3">Campaign</th>
                    <th className="py-3.5 px-3">Next Touch</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leadsList.map((lead) => {
                    const isDnc = lead.pipelineStage === 'do_not_contact'

                    return (
                      <tr key={lead.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openLeadDrawer(lead.id)}
                            className="font-bold text-white hover:text-emerald-400 text-left transition"
                          >
                            {lead.companyName}
                          </button>
                          {lead.email && <div className="text-[11px] text-slate-500 font-mono">{lead.email}</div>}
                        </td>

                        <td className="py-3 px-3 capitalize">{lead.industry}</td>
                        <td className="py-3 px-3 text-slate-400">{lead.cityArea || '—'}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{lead.country}</td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              lead.hasContactForm === 'yes'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : lead.hasContactForm === 'no'
                                ? 'bg-slate-800 text-slate-500'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {lead.hasContactForm}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              isDnc
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {PIPELINE_STAGES.find((s) => s.id === lead.pipelineStage)?.label || lead.pipelineStage}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          {lead.assignedUserName || 'Unassigned'}
                        </td>

                        <td className="py-3 px-3">
                          {lead.activeCampaignName ? (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 truncate max-w-[140px] block">
                              {lead.activeCampaignName} (Step {lead.currentStepOrder || 1})
                            </span>
                          ) : isDnc ? (
                            <span className="text-[11px] text-rose-400 font-medium">Blocked (DNC)</span>
                          ) : (
                            <button
                              onClick={() => {
                                setEnrollModalLead(lead)
                                setSelectedCampaignIdToEnroll(campaignsList[0]?.id || '')
                              }}
                              className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              + Enroll
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px]">
                          {lead.nextFollowUpDate && !isDnc ? (
                            <span className="text-emerald-400">
                              {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => openLeadDrawer(lead.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: CAMPAIGN SEQUENCES BUILDER                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Reusable Outreach Sequences</h2>
                <p className="text-xs text-slate-400">
                  Combine Email, Website Contact Form touches, and Phone Calls into structured sequences.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCampaign({
                    name: '',
                    description: '',
                    isActive: true,
                    steps: [
                      { stepOrder: 1, label: 'Initial Outreach Email', channel: 'email', delayDays: 0, subjectTemplate: 'Quick question for {{company_name}}', bodyTemplate: 'Hi {{contact_name}},\n\nI noticed {{company_name}} in {{city}}...' },
                      { stepOrder: 2, label: 'Contact Form Message', channel: 'contact_form', delayDays: 3, bodyTemplate: 'Hi {{company_name}} team, following up on our email regarding trade SEO in {{city}}.' },
                      { stepOrder: 3, label: 'Follow-Up Call', channel: 'phone', delayDays: 5, callScript: 'Hi, may I speak with the owner of {{company_name}} regarding your local Google rankings?' },
                    ],
                  })
                  setShowCampaignModal(true)
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaignsList.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{camp.name}</h3>
                        {camp.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{camp.description}</p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        {camp.activeLeadsCount} Active Leads
                      </span>
                    </div>

                    {/* Step pills */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Sequence Steps ({camp.steps.length})
                      </div>

                      <div className="space-y-2">
                        {camp.steps.map((step, idx) => (
                          <div
                            key={step.id || idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-400">
                                {step.stepOrder}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  step.channel === 'email'
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : step.channel === 'contact_form'
                                    ? 'bg-purple-500/10 text-purple-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                                }`}
                              >
                                {step.channel.replace('_', ' ')}
                              </span>
                              <span className="font-medium text-slate-200">{step.label}</span>
                            </div>

                            <span className="text-slate-500 text-[11px]">
                              {step.delayDays === 0 ? 'Immediately' : `+${step.delayDays}d delay`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setEditingCampaign({
                          id: camp.id,
                          name: camp.name,
                          description: camp.description || '',
                          isActive: camp.isActive,
                          steps: camp.steps.map((s) => ({
                            stepOrder: s.stepOrder,
                            label: s.label,
                            channel: s.channel as any,
                            delayDays: s.delayDays,
                            subjectTemplate: s.subjectTemplate || '',
                            bodyTemplate: s.bodyTemplate || '',
                            callScript: s.callScript || '',
                          })),
                        })
                        setShowCampaignModal(true)
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                    >
                      Edit Sequence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: LOG CALL OUTCOME                                       */}
      {/* ------------------------------------------------------------- */}
      {phoneCallTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span>Log Phone Call Outcome</span>
              </h3>
              <button onClick={() => setPhoneCallTarget(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Company: <strong className="text-white">{phoneCallTarget.companyName}</strong> ({phoneCallTarget.phone})
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Call Outcome *</label>
                <select
                  value={callOutcomeVal}
                  onChange={(e) => setCallOutcomeVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {CALL_OUTCOMES.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes / Summary</label>
                <textarea
                  rows={3}
                  value={callNotesVal}
                  onChange={(e) => setCallNotesVal(e.target.value)}
                  placeholder="e.g. Spoke with receptionist, owner called back, left voicemail..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setPhoneCallTarget(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await completeCampaignStepServerFn({
                      data: {
                        stepLogId: phoneCallTarget.stepLogId,
                        callOutcome: callOutcomeVal as any,
                        notes: callNotesVal,
                      },
                    })
                    setSuccessMsg(`Logged phone call outcome for ${phoneCallTarget.companyName}`)
                    setPhoneCallTarget(null)
                    refreshData()
                  } catch (err: any) {
                    setErrorMsg(err.message)
                  }
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                Save & Complete Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GOT A RESPONSE? PAUSE SEQUENCE                         */}
      {/* ------------------------------------------------------------- */}
      {responseModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                <span>Mark Response & Pause Sequence</span>
              </h3>
              <button onClick={() => setResponseModalTarget(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Marking a response halts all further automated sequence steps so you do not push outreach at a lead who already replied.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Update Pipeline Stage to:</label>
                <select
                  value={responseStageVal}
                  onChange={(e) => setResponseStageVal(e.target.value as PipelineStage)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="contacted">Contacted (Real conversation happened)</option>
                  <option value="follow_up_scheduled">Follow-Up Scheduled</option>
                  <option value="interested_qualified">Interested / Qualified</option>
                  <option value="lost">Lost / Not Interested</option>
                  <option value="do_not_contact">Do Not Contact (Explicit opt-out)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes on Response</label>
                <textarea
                  rows={3}
                  value={responseNotesVal}
                  onChange={(e) => setResponseNotesVal(e.target.value)}
                  placeholder="What did they say? What are the next steps?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setResponseModalTarget(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await markLeadResponseReceivedServerFn({
                      data: {
                        leadId: responseModalTarget.leadId,
                        channel: responseModalTarget.channel,
                        notes: responseNotesVal,
                        newStage: responseStageVal,
                      },
                    })
                    setSuccessMsg(`Sequence paused and lead updated for ${responseModalTarget.companyName}`)
                    setResponseModalTarget(null)
                    refreshData()
                  } catch (err: any) {
                    setErrorMsg(err.message)
                  }
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ENROLL LEAD IN CAMPAIGN                                */}
      {/* ------------------------------------------------------------- */}
      {enrollModalLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                <span>Enroll in Campaign Sequence</span>
              </h3>
              <button onClick={() => setEnrollModalLead(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Enrolling <strong className="text-white">{enrollModalLead.companyName}</strong> ({enrollModalLead.country})
            </div>

            {/* Country compliance warning if Canada / Australia */}
            {(enrollModalLead.country === 'Canada' || enrollModalLead.country === 'Australia') && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Consent Required ({enrollModalLead.country}):</strong> CASL / Spam Act requires documented prior consent before sending commercial emails.
                </span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Select Campaign *</label>
              <select
                value={selectedCampaignIdToEnroll}
                onChange={(e) => setSelectedCampaignIdToEnroll(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {campaignsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.steps.length} steps)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEnrollModalLead(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await enrollLeadInCampaignServerFn({
                      data: {
                        leadId: enrollModalLead.id,
                        campaignId: selectedCampaignIdToEnroll,
                      },
                    })
                    setSuccessMsg(`Enrolled ${enrollModalLead.companyName} in sequence!`)
                    setEnrollModalLead(null)
                    refreshData()
                  } catch (err: any) {
                    setErrorMsg(err.message)
                  }
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                Confirm & Start Step 1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD PROSPECTIVE LEAD                                   */}
      {/* ------------------------------------------------------------- */}
      {showAddLeadModal && (
        <AddLeadModal
          staffUsers={staffUsers}
          onClose={() => setShowAddLeadModal(false)}
          onCreated={() => {
            setShowAddLeadModal(false)
            setSuccessMsg('Prospective lead added to pipeline')
            refreshData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CAMPAIGN SEQUENCE EDITOR                               */}
      {/* ------------------------------------------------------------- */}
      {showCampaignModal && editingCampaign && (
        <CampaignEditorModal
          campaign={editingCampaign}
          onClose={() => {
            setShowCampaignModal(false)
            setEditingCampaign(null)
          }}
          onSaved={() => {
            setShowCampaignModal(false)
            setEditingCampaign(null)
            setSuccessMsg('Campaign sequence saved successfully')
            refreshData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* DRAWER: LEAD DETAILS & ACTIVITY LOG                           */}
      {/* ------------------------------------------------------------- */}
      {selectedLeadId && (
        <LeadDetailDrawer
          leadId={selectedLeadId}
          data={selectedLeadData}
          loading={drawerLoading}
          staffUsers={staffUsers}
          campaignsList={campaignsList}
          isSuperadmin={isSuperadmin}
          onClose={closeLeadDrawer}
          onUpdated={() => {
            openLeadDrawer(selectedLeadId)
            refreshData()
          }}
          onDeleted={() => {
            closeLeadDrawer()
            setSuccessMsg('Lead deleted')
            refreshData()
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// MODAL: ADD LEAD (WITH DUPLICATE WARNINGS & COUNTRY COMPLIANCE)
// ============================================================================

function AddLeadModal({
  staffUsers,
  onClose,
  onCreated,
}: {
  staffUsers: StaffUserItem[]
  onClose: () => void
  onCreated: () => void
}) {
  const [companyName, setCompanyName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [hasWebsite, setHasWebsite] = useState<'yes' | 'no' | 'unknown'>('unknown')
  const [hasContactForm, setHasContactForm] = useState<'yes' | 'no' | 'unknown'>('unknown')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState<'US' | 'Canada' | 'Australia' | 'Other'>('US')
  const [industry, setIndustry] = useState<any>('plumbing')
  const [gbpStatus, setGbpStatus] = useState<any>('unknown')
  const [cityArea, setCityArea] = useState('')
  const [leadSource, setLeadSource] = useState<any>('manual_research')
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('new')
  const [assignedTo, setAssignedTo] = useState('')
  const [nextFollowUpDate, setNextFollowUpDate] = useState('')
  const [initialNote, setInitialNote] = useState('')

  const [duplicates, setDuplicates] = useState<Array<{ companyName: string; matchReason: string }>>([])
  const [isCheckingDups, setIsCheckingDups] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Auto suggest hasWebsite and hasContactForm
  useEffect(() => {
    if (websiteUrl.trim()) {
      if (hasWebsite === 'unknown') setHasWebsite('yes')
    } else {
      if (hasWebsite === 'yes') setHasContactForm('unknown')
    }
  }, [websiteUrl])

  useEffect(() => {
    if (hasWebsite === 'no') {
      setHasContactForm('no')
    }
  }, [hasWebsite])

  // Real-time duplicate check with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (companyName.trim().length >= 3 || email.trim().length >= 5 || phone.trim().length >= 6) {
        setIsCheckingDups(true)
        try {
          const res = await checkLeadDuplicatesServerFn({
            data: { companyName, email, phone },
          })
          if (res?.duplicates) {
            setDuplicates(res.duplicates)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsCheckingDups(false)
        }
      } else {
        setDuplicates([])
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [companyName, email, phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setErr('Company name is required')
      return
    }

    setIsSubmitting(true)
    setErr(null)
    try {
      await createLeadServerFn({
        data: {
          companyName,
          websiteUrl: websiteUrl.trim() || null,
          hasWebsite,
          hasContactForm,
          email: email.trim() || null,
          phone: phone.trim() || null,
          country,
          industry,
          gbpStatus,
          cityArea: cityArea.trim() || null,
          leadSource,
          pipelineStage,
          assignedTo: assignedTo || null,
          nextFollowUpDate: nextFollowUpDate || null,
          initialNote,
        },
      })
      onCreated()
    } catch (e: any) {
      setErr(e.message || 'Failed to create lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <span>Add Prospective Trade Lead</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {err && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
            {err}
          </div>
        )}

        {/* Duplicate Warning Banner */}
        {duplicates.length > 0 && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Possible Duplicate Detected!</span>
            </div>
            <p className="text-[11px] text-amber-300">
              Existing records match what you entered:
            </p>
            <ul className="text-xs text-amber-200 list-disc list-inside space-y-0.5 font-mono">
              {duplicates.map((d, i) => (
                <li key={i}>
                  <strong>{d.companyName}</strong> (Matched on: {d.matchReason})
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Apex Plumbing & Drains"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Website URL</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://apexplumbing.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Has Website?</label>
              <select
                value={hasWebsite}
                onChange={(e) => setHasWebsite(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Has Contact Form on Website?
              </label>
              <select
                value={hasContactForm}
                disabled={hasWebsite === 'no'}
                onChange={(e) => setHasContactForm(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                <option value="yes">Yes (Contact form available)</option>
                <option value="no">No (No form on site)</option>
                <option value="unknown">Unknown / Not checked yet</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@apexplumbing.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 234-5678"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Country (Drives Compliance) *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {(country === 'Canada' || country === 'Australia') && (
                <p className="text-[11px] text-amber-400 mt-1">
                  Note: CASL / Spam Act requires consent prior to sending cold email.
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Industry / Trade</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">City / Service Area</label>
              <input
                type="text"
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                placeholder="Dallas, TX"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">GBP Status</label>
              <select
                value={gbpStatus}
                onChange={(e) => setGbpStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {GBP_STATUSES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Pipeline Stage</label>
              <select
                value={pipelineStage}
                onChange={(e) => setPipelineStage(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Assigned Staff</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Default (Me)</option>
                {staffUsers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Next Follow-Up Date</label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Initial Note</label>
            <textarea
              rows={2}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="Where did you find this business? What caught your eye?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Lead to Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================================
// MODAL: CAMPAIGN SEQUENCE EDITOR
// ============================================================================

function CampaignEditorModal({
  campaign,
  onClose,
  onSaved,
}: {
  campaign: {
    id?: string
    name: string
    description: string
    isActive: boolean
    steps: Array<{
      stepOrder: number
      label: string
      channel: 'email' | 'contact_form' | 'phone'
      delayDays: number
      subjectTemplate?: string
      bodyTemplate?: string
      callScript?: string
    }>
  }
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(campaign.name)
  const [description, setDescription] = useState(campaign.description)
  const [steps, setSteps] = useState(campaign.steps)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const addStep = () => {
    setSteps([
      ...steps,
      {
        stepOrder: steps.length + 1,
        label: `Follow-Up Step ${steps.length + 1}`,
        channel: 'email',
        delayDays: 3,
        subjectTemplate: 'Following up regarding {{company_name}}',
        bodyTemplate: 'Hi {{contact_name}},\n\nWanted to quickly follow up...',
        callScript: '',
      },
    ])
  }

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return
    const next = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepOrder: i + 1 }))
    setSteps(next)
  }

  const updateStep = (idx: number, patch: Partial<(typeof steps)[0]>) => {
    const next = [...steps]
    next[idx] = { ...next[idx], ...patch }
    setSteps(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErr('Campaign name is required')
      return
    }

    setIsSubmitting(true)
    setErr(null)
    try {
      await saveCampaignServerFn({
        data: {
          id: campaign.id,
          name: name.trim(),
          description: description.trim() || undefined,
          isActive: true,
          steps,
        },
      })
      onSaved()
    } catch (e: any) {
      setErr(e.message || 'Failed to save campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>{campaign.id ? 'Edit Sequence Campaign' : 'Create Multi-Channel Campaign'}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {err && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
            {err}
          </div>
        )}

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Supported Template Merge Fields:</div>
          <p className="font-mono text-[11px] text-emerald-400">
            {'{{company_name}}'} &nbsp; {'{{contact_name}}'} &nbsp; {'{{industry}}'} &nbsp; {'{{city}}'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Campaign Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cold Outreach - Local Trades (3-Step)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Multi-channel sequence combining email, contact form, and call."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Sequence Steps</h3>
              <button
                type="button"
                onClick={addStep}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                        {step.stepOrder}
                      </span>
                      <span>Step {step.stepOrder}</span>
                    </div>

                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Step Label</label>
                      <input
                        type="text"
                        value={step.label}
                        onChange={(e) => updateStep(idx, { label: e.target.value })}
                        placeholder="e.g. Initial Outreach"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Channel</label>
                      <select
                        value={step.channel}
                        onChange={(e) => updateStep(idx, { channel: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                      >
                        <option value="email">Email</option>
                        <option value="contact_form">Website Contact Form</option>
                        <option value="phone">Phone Call</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Delay Before Due (Days)</label>
                      <input
                        type="number"
                        min="0"
                        value={step.delayDays}
                        onChange={(e) => updateStep(idx, { delayDays: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Channel Specific Template Inputs */}
                  {step.channel === 'email' && (
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      <div>
                        <label className="block text-slate-400 mb-1">Email Subject Template</label>
                        <input
                          type="text"
                          value={step.subjectTemplate || ''}
                          onChange={(e) => updateStep(idx, { subjectTemplate: e.target.value })}
                          placeholder="Quick question regarding {{company_name}}"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Email Body Template</label>
                        <textarea
                          rows={3}
                          value={step.bodyTemplate || ''}
                          onChange={(e) => updateStep(idx, { bodyTemplate: e.target.value })}
                          placeholder="Hi {{contact_name}}, I noticed {{company_name}} in {{city}}..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {step.channel === 'contact_form' && (
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      <div>
                        <label className="block text-slate-400 mb-1">Contact Form Message Template</label>
                        <textarea
                          rows={3}
                          value={step.bodyTemplate || ''}
                          onChange={(e) => updateStep(idx, { bodyTemplate: e.target.value })}
                          placeholder="Hi {{company_name}} team, following up on our note..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {step.channel === 'phone' && (
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      <div>
                        <label className="block text-slate-400 mb-1">Phone Call Script / Talking Points</label>
                        <textarea
                          rows={2}
                          value={step.callScript || ''}
                          onChange={(e) => updateStep(idx, { callScript: e.target.value })}
                          placeholder="Ask for business owner, mention local search review..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-sans text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Sequence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================================
// DRAWER: LEAD DETAILS, MULTI-CHANNEL PROGRESS, & ACTIVITY TIMELINE
// ============================================================================

function LeadDetailDrawer({
  leadId,
  data,
  loading,
  staffUsers,
  campaignsList,
  isSuperadmin,
  onClose,
  onUpdated,
  onDeleted,
}: {
  leadId: string
  data: any
  loading: boolean
  staffUsers: StaffUserItem[]
  campaignsList: CampaignWithSteps[]
  isSuperadmin: boolean
  onClose: () => void
  onUpdated: () => void
  onDeleted: () => void
}) {
  const lead: LeadWithAssignee | null = data?.lead || null
  const activities = data?.activities || []
  const enrollment = data?.enrollment || null

  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState<'note' | 'call' | 'email' | 'meeting'>('note')
  const [targetStage, setTargetStage] = useState<PipelineStage | ''>('')
  const [nextFollowUpDate, setNextFollowUpDate] = useState('')
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Edit fields
  const [isEditing, setIsEditing] = useState(false)
  const [editCompany, setEditCompany] = useState('')
  const [editWebsite, setEditWebsite] = useState('')
  const [editHasWebsite, setEditHasWebsite] = useState<'yes' | 'no' | 'unknown'>('unknown')
  const [editHasContactForm, setEditHasContactForm] = useState<'yes' | 'no' | 'unknown'>('unknown')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editCountry, setEditCountry] = useState<'US' | 'Canada' | 'Australia' | 'Other'>('US')
  const [editIndustry, setEditIndustry] = useState<any>('other')
  const [editCity, setEditCity] = useState('')
  const [editAssignedTo, setEditAssignedTo] = useState('')

  useEffect(() => {
    if (lead) {
      setEditCompany(lead.companyName)
      setEditWebsite(lead.websiteUrl || '')
      setEditHasWebsite(lead.hasWebsite as any)
      setEditHasContactForm((lead.hasContactForm as any) || 'unknown')
      setEditEmail(lead.email || '')
      setEditPhone(lead.phone || '')
      setEditCountry((lead.country as any) || 'US')
      setEditIndustry(lead.industry)
      setEditCity(lead.cityArea || '')
      setEditAssignedTo(lead.assignedTo || '')
      setTargetStage(lead.pipelineStage)
      setNextFollowUpDate(
        lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toISOString().split('T')[0] : ''
      )
    }
  }, [lead])

  const handleSaveProfile = async () => {
    try {
      await updateLeadServerFn({
        data: {
          id: leadId,
          companyName: editCompany,
          websiteUrl: editWebsite,
          hasWebsite: editHasWebsite,
          hasContactForm: editHasContactForm,
          email: editEmail,
          phone: editPhone,
          country: editCountry,
          industry: editIndustry,
          cityArea: editCity,
          assignedTo: editAssignedTo,
        },
      })
      setIsEditing(false)
      onUpdated()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setIsSubmittingNote(true)
    setErr(null)
    try {
      await addLeadActivityServerFn({
        data: {
          leadId,
          note: newNote.trim(),
          type: noteType,
          newStage: targetStage ? (targetStage as PipelineStage) : undefined,
          nextFollowUpDate: nextFollowUpDate || undefined,
        },
      })
      setNewNote('')
      onUpdated()
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this lead? This cannot be undone.')) return
    try {
      await deleteLeadServerFn({ data: { id: leadId } })
      onDeleted()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  const isDnc = lead?.pipelineStage === 'do_not_contact'

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white truncate max-w-md">
            {lead?.companyName || 'Lead Details'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isSuperadmin && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-500 hover:text-rose-400 transition rounded"
              title="Delete Lead (Superadmin only)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        {loading || !lead ? (
          <div className="p-12 text-center text-slate-500">Loading lead history...</div>
        ) : (
          <>
            {err && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300">
                {err}
              </div>
            )}

            {/* DO NOT CONTACT ALERT BANNER */}
            {isDnc && (
              <div className="p-4 bg-rose-500/15 border-2 border-rose-500/50 rounded-xl text-rose-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>DO NOT CONTACT SAFETY LOCK ACTIVATED</span>
                </div>
                <p className="text-xs text-rose-300">
                  This business explicitly asked not to be contacted again. All sequences have been terminated, follow-up dates cleared, and outreach buttons locked across Email, Contact Forms, and Phone.
                </p>
              </div>
            )}

            {/* Profile Overview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Contact Information</span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Company</label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Website</label>
                    <input
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Has Contact Form?</label>
                    <select
                      value={editHasContactForm}
                      onChange={(e) => setEditHasContactForm(e.target.value as any)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Country</label>
                    <select
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value as any)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div className="col-span-2 pt-2 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Website:</span>
                    {lead.websiteUrl ? (
                      <a
                        href={lead.websiteUrl.startsWith('http') ? lead.websiteUrl : `https://${lead.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {lead.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block">Contact Form:</span>
                    <span className="capitalize text-slate-300 font-medium">{lead.hasContactForm || 'unknown'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Country:</span>
                    <span className="font-mono text-slate-300">{lead.country}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <span className="font-mono text-slate-300">{lead.email || '—'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <span className="font-mono text-emerald-400">{lead.phone || '—'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">City:</span>
                    <span className="text-slate-300">{lead.cityArea || '—'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Stage:</span>
                    <span className="capitalize font-semibold text-slate-200">
                      {PIPELINE_STAGES.find((s) => s.id === lead.pipelineStage)?.label || lead.pipelineStage}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Last Contact:</span>
                    <span className="text-slate-400">
                      {lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleString() : 'Never'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Assigned Staff:</span>
                    <span className="text-slate-300">{lead.assignedUserName || 'Unassigned'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Sequence Enrollment Status */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Campaign Sequence</span>
                </span>

                {enrollment?.status === 'active' && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Active Sequence
                  </span>
                )}
                {enrollment?.status === 'paused' && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    Paused ({enrollment.pausedReason || 'manual'})
                  </span>
                )}
              </div>

              {enrollment ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    Enrolled in: <strong className="text-white">{enrollment.campaignName}</strong>
                  </div>

                  {/* Steps Progress */}
                  <div className="space-y-1.5">
                    {enrollment.steps.map((st: any) => (
                      <div
                        key={st.id}
                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${
                          st.status === 'completed'
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                            : st.status === 'due'
                            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 font-medium'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">Step {st.stepOrder}</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-800">
                            {st.channel}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span>
                            {st.status === 'completed'
                              ? `Completed (${new Date(st.completedAt).toLocaleDateString()})`
                              : `Due: ${new Date(st.dueDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pause / Terminate Action */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await terminateLeadCampaignServerFn({
                            data: { enrollmentId: enrollment.id, reason: 'manual_stopped' },
                          })
                          onUpdated()
                        } catch (e: any) {
                          setErr(e.message)
                        }
                      }}
                      className="px-2.5 py-1 text-rose-400 hover:bg-rose-500/10 rounded text-xs transition"
                    >
                      Stop Sequence
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-slate-500 space-y-2">
                  <p>Lead is not currently enrolled in an outreach sequence.</p>
                </div>
              )}
            </div>

            {/* Add Outreach Note / Touch */}
            {!isDnc && (
              <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-white text-sm block">Add Activity Note & Update Follow-Up</span>

                <div className="flex items-center gap-2">
                  {(['note', 'call', 'email', 'meeting'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNoteType(t)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider transition ${
                        noteType === t
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Called owner, asked for callback on Thursday..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1 text-[11px]">Update Stage Together:</label>
                    <select
                      value={targetStage}
                      onChange={(e) => setTargetStage(e.target.value as PipelineStage)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                    >
                      <option value="">Keep current stage</option>
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 text-[11px]">Next Follow-Up Date:</label>
                    <input
                      type="date"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingNote}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow text-xs disabled:opacity-50"
                  >
                    {isSubmittingNote ? 'Saving...' : 'Save Activity Note'}
                  </button>
                </div>
              </form>
            )}

            {/* Append-Only Activity Log Timeline */}
            <div className="space-y-3">
              <span className="font-bold text-white text-sm block">Activity Log History (Append-Only)</span>

              {activities.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No activity recorded yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((act: any) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-400 capitalize">
                          {act.userName} • {act.type.replace('_', ' ')}
                        </span>
                        <span>{new Date(act.createdAt).toLocaleString()}</span>
                      </div>

                      <p className="text-slate-200 whitespace-pre-wrap">{act.note}</p>

                      {act.stageFrom && act.stageTo && (
                        <div className="text-[10px] text-emerald-400 pt-1">
                          Stage moved from <strong>{act.stageFrom}</strong> → <strong>{act.stageTo}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
