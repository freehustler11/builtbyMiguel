import { createFileRoute, redirect, useRouter, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  BarChart3,
  ArrowLeft,
  Building2,
  Calendar,
  PhoneCall,
  Navigation,
  Eye,
  MousePointerClick,
  Globe,
  Users,
  Layers,
  FileText,
  ListOrdered,
  ListChecks,
  Check,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { checkAuthServerFn } from '../../../lib/auth'
import { AdminNav } from '../../../components/AdminNav'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { getClientsServerFn } from '../../../server/clients'
import { createReportServerFn } from '../../../server/reports'

interface NewReportSearch {
  clientId?: string
}

export const Route = createFileRoute('/admin/reports/new')({
  validateSearch: (search: Record<string, unknown>): NewReportSearch => {
    return {
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
    }
  },
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/admin/reports/new',
        },
      })
    }
  },
  loader: async () => {
    return await getClientsServerFn()
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Create Performance Report | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminNewReportPage,
})

function getDefaultMonthString(): string {
  const now = new Date()
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)
}

function AdminNewReportPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const { clientId: queryClientId } = Route.useSearch()
  const { clients } = Route.useLoaderData()

  // Form State
  const [selectedClientId, setSelectedClientId] = useState(queryClientId || (clients[0]?.id ?? ''))
  const [reportMonth, setReportMonth] = useState(getDefaultMonthString())
  const [title, setTitle] = useState('')
  const [hasManuallyEditedTitle, setHasManuallyEditedTitle] = useState(false)

  // GBP Metrics
  const [gbpCalls, setGbpCalls] = useState<number | string>(0)
  const [gbpDirections, setGbpDirections] = useState<number | string>(0)
  const [gbpViews, setGbpViews] = useState<number | string>(0)

  // GSC Metrics
  const [gscClicks, setGscClicks] = useState<number | string>(0)
  const [gscImpressions, setGscImpressions] = useState<number | string>(0)
  const [gscPosition, setGscPosition] = useState<number | string>(0)

  // GA4 Metrics
  const [gaUsers, setGaUsers] = useState<number | string>(0)
  const [gaSessions, setGaSessions] = useState<number | string>(0)
  const [gaViews, setGaViews] = useState<number | string>(0)

  // Narrative Text
  const [summary, setSummary] = useState('')
  const [workCompleted, setWorkCompleted] = useState('')
  const [nextSteps, setNextSteps] = useState('')

  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Selected client object
  const selectedClient = clients.find((c) => c.id === selectedClientId)

  // Auto-generate title if not manually customized
  useEffect(() => {
    if (!hasManuallyEditedTitle && selectedClient) {
      setTitle(`${selectedClient.businessName} - Monthly Performance Report (${reportMonth})`)
    }
  }, [selectedClient, reportMonth, hasManuallyEditedTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!selectedClientId) {
      setFormError('Please select a client')
      return
    }
    if (!reportMonth.trim()) {
      setFormError('Report month is required')
      return
    }
    if (!title.trim()) {
      setFormError('Report title is required')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await createReportServerFn({
        data: {
          clientId: selectedClientId,
          title: title.trim(),
          reportMonth: reportMonth.trim(),
          gbpCalls: Number(gbpCalls) || 0,
          gbpDirections: Number(gbpDirections) || 0,
          gbpViews: Number(gbpViews) || 0,
          gscClicks: Number(gscClicks) || 0,
          gscImpressions: Number(gscImpressions) || 0,
          gscPosition: Number(gscPosition) || 0,
          gaUsers: Number(gaUsers) || 0,
          gaSessions: Number(gaSessions) || 0,
          gaViews: Number(gaViews) || 0,
          summary: summary.trim() || undefined,
          workCompleted: workCompleted.trim() || undefined,
          nextSteps: nextSteps.trim() || undefined,
        },
      })

      addToast('Report Created', 'Redirecting to your branded report...')
      navigate({
        to: '/admin/reports/$id',
        params: { id: res.report.id },
      })
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save report')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Reports</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Monthly Performance Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Input Google Business Profile, Search Console, and GA4 metrics to generate a print-ready client report.
            </p>
          </div>
        </div>

        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {formError}
          </div>
        )}

        {clients.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Clients Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must create at least one client before generating a branded performance report.
            </p>
            <Link
              to="/admin/clients"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
            >
              <span>Add Client First</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Client & Period Metadata */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Building2 className="w-4 h-4 text-rose-500" />
                <span>Client & Reporting Period</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Select Client *
                  </label>
                  <select
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName} ({c.name})
                      </option>
                    ))}
                  </select>

                  {/* Client Info Pill */}
                  {selectedClient && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedClient.primaryColor || '#2563eb' }}
                      />
                      <span>Primary Brand: {selectedClient.primaryColor || '#2563eb'}</span>
                      {selectedClient.websiteUrl && (
                        <>
                          <span>•</span>
                          <span className="truncate">{selectedClient.websiteUrl}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reporting Period / Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Report Period / Month *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    placeholder="e.g. September 2026 or Q3 2026"
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setHasManuallyEditedTitle(true)
                  }}
                  placeholder="e.g. Apex Plumbing - Monthly Growth & SEO Report"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>
            </div>

            {/* Section 2: Grouped Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Google Business Profile (GBP) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Google Business Profile</span>
                </div>

                {/* Phone Calls */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Phone Calls</span>
                    <PhoneCall className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gbpCalls}
                    onChange={(e) => setGbpCalls(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Direction Requests */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Direction Requests</span>
                    <Navigation className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gbpDirections}
                    onChange={(e) => setGbpDirections(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Profile Views */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Profile Views</span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gbpViews}
                    onChange={(e) => setGbpViews(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Card 2: Google Search Console (GSC) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>Google Search Console</span>
                </div>

                {/* Clicks */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Total Clicks</span>
                    <MousePointerClick className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gscClicks}
                    onChange={(e) => setGscClicks(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Impressions */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Impressions</span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gscImpressions}
                    onChange={(e) => setGscImpressions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Average Position */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Avg. Position</span>
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={gscPosition}
                    onChange={(e) => setGscPosition(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Card 3: Google Analytics 4 (GA4) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>Google Analytics 4</span>
                </div>

                {/* Users */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Active Users</span>
                    <Users className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gaUsers}
                    onChange={(e) => setGaUsers(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Sessions */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Sessions</span>
                    <Layers className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gaSessions}
                    onChange={(e) => setGaSessions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Pageviews */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                    <span>Total Pageviews</span>
                    <Eye className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gaViews}
                    onChange={(e) => setGaViews(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-sm font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Narrative Text Fields */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <FileText className="w-4 h-4 text-rose-500" />
                <span>Executive Summary & Strategic Updates</span>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Executive Summary
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide a concise 1-2 paragraph overview of performance, milestones achieved, and key growth drivers during this reporting period..."
                  className="w-full p-4 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Work Completed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Work Completed This Month (One item per line)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Renders as styled checklist</span>
                </div>
                <textarea
                  rows={5}
                  value={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.value)}
                  placeholder="• Optimized Google Business Profile primary category and weekly posts&#10;• Fixed meta title and description lengths across top 10 landing pages&#10;• Built 15 high-authority local citations and directory links&#10;• Reduced mobile Cumulative Layout Shift (CLS) on the service quote page"
                  className="w-full p-4 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Next Steps */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Next Steps & Priorities (One item per line)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Renders as roadmap targets</span>
                </div>
                <textarea
                  rows={4}
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="• Launch review generation SMS campaign targeting past 60-day customers&#10;• Implement structured schema markup for LocalBusiness and FAQ items&#10;• Publish 2 localized case study articles targeting high-intent suburbs"
                  className="w-full p-4 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/admin/reports"
                className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & View Branded Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
