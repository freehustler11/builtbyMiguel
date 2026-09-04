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
  Star,
  Zap,
  Search,
  FileSpreadsheet,
} from 'lucide-react'
import { checkAuthServerFn } from '../../../lib/auth'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { getClientsServerFn } from '../../../server/clients'
import {
  createReportServerFn,
  updateReportServerFn,
  getReportByIdServerFn,
  getLatestReportForClientServerFn,
  type QueryItem,
  type PageItem,
} from '../../../server/reports'

interface NewReportSearch {
  clientId?: string
  editId?: string
}

export const Route = createFileRoute('/admin/reports/new')({
  validateSearch: (search: Record<string, unknown>): NewReportSearch => {
    return {
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
      editId: typeof search.editId === 'string' ? search.editId : undefined,
    }
  },
  beforeLoad: async () => {
    const { isAuthenticated, role } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/admin/reports/new',
        },
      })
    }
    if (role !== 'admin') {
      throw redirect({
        to: '/portal',
      })
    }
  },
  loader: async ({ search }) => {
    const [{ clients }, existingReportData] = await Promise.all([
      getClientsServerFn(),
      search.editId
        ? getReportByIdServerFn({ data: { id: search.editId } }).catch(() => null)
        : Promise.resolve(null),
    ])
    return {
      clients,
      existingReport: existingReportData?.report || null,
      editClient: existingReportData?.client || null,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: loaderData?.existingReport
          ? 'Edit Performance Report | Admin | built by Miguel'
          : 'Create Performance Report | Admin | built by Miguel',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminReportFormPage,
})

function getDefaultMonthString(): string {
  const now = new Date()
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)
}

const DEFAULT_QUERY_ITEMS: QueryItem[] = [
  { query: '', clicks: 0, impressions: 0, position: 1.0 },
  { query: '', clicks: 0, impressions: 0, position: 1.0 },
  { query: '', clicks: 0, impressions: 0, position: 1.0 },
  { query: '', clicks: 0, impressions: 0, position: 1.0 },
  { query: '', clicks: 0, impressions: 0, position: 1.0 },
]

const DEFAULT_PAGE_ITEMS: PageItem[] = [
  { path: '/', clicks: 0, users: 0 },
  { path: '', clicks: 0, users: 0 },
  { path: '', clicks: 0, users: 0 },
  { path: '', clicks: 0, users: 0 },
  { path: '', clicks: 0, users: 0 },
]

function AdminReportFormPage() {
  const navigate = useNavigate()
  const { clientId: queryClientId, editId } = Route.useSearch()
  const { clients, existingReport } = Route.useLoaderData()

  const isEditing = Boolean(editId && existingReport)

  // Form State
  const [selectedClientId, setSelectedClientId] = useState(
    existingReport?.clientId || queryClientId || clients[0]?.id || ''
  )
  const [reportMonth, setReportMonth] = useState(
    existingReport?.reportMonth || getDefaultMonthString()
  )
  const [title, setTitle] = useState(existingReport?.title || '')
  const [hasManuallyEditedTitle, setHasManuallyEditedTitle] = useState(isEditing)
  const [previousReportId, setPreviousReportId] = useState<string>(
    existingReport?.previousReportId || ''
  )

  // GBP Metrics - Current
  const [gbpCalls, setGbpCalls] = useState<number | string>(existingReport?.gbpCalls ?? 0)
  const [gbpDirections, setGbpDirections] = useState<number | string>(existingReport?.gbpDirections ?? 0)
  const [gbpViews, setGbpViews] = useState<number | string>(existingReport?.gbpViews ?? 0)

  // GBP Metrics - Previous Month
  const [prevGbpCalls, setPrevGbpCalls] = useState<number | string>(existingReport?.prevGbpCalls ?? 0)
  const [prevGbpDirections, setPrevGbpDirections] = useState<number | string>(existingReport?.prevGbpDirections ?? 0)
  const [prevGbpViews, setPrevGbpViews] = useState<number | string>(existingReport?.prevGbpViews ?? 0)

  // GBP Reputation
  const [gbpRating, setGbpRating] = useState<number | string>(existingReport?.gbpRating ?? 5.0)
  const [gbpReviewCount, setGbpReviewCount] = useState<number | string>(existingReport?.gbpReviewCount ?? 0)

  // GSC Metrics - Current
  const [gscClicks, setGscClicks] = useState<number | string>(existingReport?.gscClicks ?? 0)
  const [gscImpressions, setGscImpressions] = useState<number | string>(existingReport?.gscImpressions ?? 0)
  const [gscPosition, setGscPosition] = useState<number | string>(existingReport?.gscPosition ?? 0)

  // GSC Metrics - Previous Month
  const [prevGscClicks, setPrevGscClicks] = useState<number | string>(existingReport?.prevGscClicks ?? 0)
  const [prevGscImpressions, setPrevGscImpressions] = useState<number | string>(existingReport?.prevGscImpressions ?? 0)
  const [prevGscPosition, setPrevGscPosition] = useState<number | string>(existingReport?.prevGscPosition ?? 0)

  // GA4 Metrics - Current
  const [gaUsers, setGaUsers] = useState<number | string>(existingReport?.gaUsers ?? 0)
  const [gaSessions, setGaSessions] = useState<number | string>(existingReport?.gaSessions ?? 0)
  const [gaViews, setGaViews] = useState<number | string>(existingReport?.gaViews ?? 0)

  // GA4 Metrics - Previous Month
  const [prevGaUsers, setPrevGaUsers] = useState<number | string>(existingReport?.prevGaUsers ?? 0)
  const [prevGaSessions, setPrevGaSessions] = useState<number | string>(existingReport?.prevGaSessions ?? 0)
  const [prevGaViews, setPrevGaViews] = useState<number | string>(existingReport?.prevGaViews ?? 0)

  // Deep Metric Tables
  const [topQueries, setTopQueries] = useState<QueryItem[]>(() => {
    if (existingReport && Array.isArray(existingReport.topQueries) && existingReport.topQueries.length > 0) {
      const items = [...existingReport.topQueries]
      while (items.length < 5) {
        items.push({ query: '', clicks: 0, impressions: 0, position: 1.0 })
      }
      return items.slice(0, 5)
    }
    return DEFAULT_QUERY_ITEMS
  })

  const [topPages, setTopPages] = useState<PageItem[]>(() => {
    if (existingReport && Array.isArray(existingReport.topPages) && existingReport.topPages.length > 0) {
      const items = [...existingReport.topPages]
      while (items.length < 5) {
        items.push({ path: '', clicks: 0, users: 0 })
      }
      return items.slice(0, 5)
    }
    return DEFAULT_PAGE_ITEMS
  })

  // Narrative Text
  const [summary, setSummary] = useState(existingReport?.summary || '')
  const [workCompleted, setWorkCompleted] = useState(existingReport?.workCompleted || '')
  const [nextSteps, setNextSteps] = useState(existingReport?.nextSteps || '')

  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPullingPrior, setIsPullingPrior] = useState(false)
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

  // Auto-generate title if creating new and not manually customized
  useEffect(() => {
    if (!isEditing && !hasManuallyEditedTitle && selectedClient) {
      setTitle(`${selectedClient.businessName} - Monthly Performance Report (${reportMonth})`)
    }
  }, [selectedClient, reportMonth, hasManuallyEditedTitle, isEditing])

  // Handler: Auto-pull prior month metrics from latest client report
  const handleAutoPullPriorMonth = async () => {
    if (!selectedClientId) {
      addToast('Select Client', 'Please select a client first.', 'error')
      return
    }

    try {
      setIsPullingPrior(true)
      const res = await getLatestReportForClientServerFn({ data: { clientId: selectedClientId } })

      if (!res.report) {
        addToast('No Prior Report', 'No previous report was found for this client.', 'info')
        return
      }

      // If currently editing and latest is this same report, notify user
      if (editId && res.report.id === editId) {
        addToast('Notice', 'The most recent report on record is this report currently being edited.', 'info')
        return
      }

      const p = res.report
      setPreviousReportId(p.id)
      setPrevGbpCalls(p.gbpCalls ?? 0)
      setPrevGbpDirections(p.gbpDirections ?? 0)
      setPrevGbpViews(p.gbpViews ?? 0)
      setPrevGscClicks(p.gscClicks ?? 0)
      setPrevGscImpressions(p.gscImpressions ?? 0)
      setPrevGscPosition(p.gscPosition ?? 0)
      setPrevGaUsers(p.gaUsers ?? 0)
      setPrevGaSessions(p.gaSessions ?? 0)
      setPrevGaViews(p.gaViews ?? 0)

      addToast(
        'Prior Metrics Loaded',
        `Successfully auto-filled comparison figures from the ${p.reportMonth} report!`,
        'success'
      )
    } catch (err: any) {
      addToast('Auto-Pull Failed', err?.message || 'Could not retrieve previous report', 'error')
    } finally {
      setIsPullingPrior(false)
    }
  }

  const handleQueryChange = (idx: number, field: keyof QueryItem, value: any) => {
    setTopQueries((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const handlePageChange = (idx: number, field: keyof PageItem, value: any) => {
    setTopPages((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

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

    // Filter out empty rows
    const cleanedQueries = topQueries
      .filter((q) => q.query.trim().length > 0)
      .map((q) => ({
        query: q.query.trim(),
        clicks: Number(q.clicks) || 0,
        impressions: Number(q.impressions) || 0,
        position: Number(q.position) || 1.0,
      }))

    const cleanedPages = topPages
      .filter((p) => p.path.trim().length > 0)
      .map((p) => ({
        path: p.path.trim(),
        clicks: Number(p.clicks) || 0,
        users: Number(p.users) || 0,
      }))

    try {
      setIsSubmitting(true)

      const payload = {
        clientId: selectedClientId,
        title: title.trim(),
        reportMonth: reportMonth.trim(),
        previousReportId: previousReportId || undefined,
        // GBP Current
        gbpCalls: Number(gbpCalls) || 0,
        gbpDirections: Number(gbpDirections) || 0,
        gbpViews: Number(gbpViews) || 0,
        // GBP Previous
        prevGbpCalls: Number(prevGbpCalls) || 0,
        prevGbpDirections: Number(prevGbpDirections) || 0,
        prevGbpViews: Number(prevGbpViews) || 0,
        // GBP Reputation
        gbpRating: Number(gbpRating) || 5.0,
        gbpReviewCount: Number(gbpReviewCount) || 0,
        // GSC Current
        gscClicks: Number(gscClicks) || 0,
        gscImpressions: Number(gscImpressions) || 0,
        gscPosition: Number(gscPosition) || 0,
        // GSC Previous
        prevGscClicks: Number(prevGscClicks) || 0,
        prevGscImpressions: Number(prevGscImpressions) || 0,
        prevGscPosition: Number(prevGscPosition) || 0,
        // GA4 Current
        gaUsers: Number(gaUsers) || 0,
        gaSessions: Number(gaSessions) || 0,
        gaViews: Number(gaViews) || 0,
        // GA4 Previous
        prevGaUsers: Number(prevGaUsers) || 0,
        prevGaSessions: Number(prevGaSessions) || 0,
        prevGaViews: Number(prevGaViews) || 0,
        // Deep Metric Tables
        topQueries: cleanedQueries,
        topPages: cleanedPages,
        // Narrative
        summary: summary.trim() || undefined,
        workCompleted: workCompleted.trim() || undefined,
        nextSteps: nextSteps.trim() || undefined,
      }

      if (isEditing && editId) {
        await updateReportServerFn({
          data: {
            id: editId,
            ...payload,
          },
        })
        addToast('Report Updated', 'Saved changes successfully!')
        navigate({
          to: '/admin/reports/$id',
          params: { id: editId },
        })
      } else {
        const res = await createReportServerFn({
          data: payload,
        })
        addToast('Report Created', 'Redirecting to your branded report...')
        navigate({
          to: '/admin/reports/$id',
          params: { id: res.report.id },
        })
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save report')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-5xl mx-auto space-y-6">
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
              {isEditing ? 'Edit Performance Report' : 'Create Monthly Performance Report'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure metrics, month-over-month comparisons, search keywords, and strategic deliverables.
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
                        {c.businessName} ({c.name}) {c.isWhiteLabel ? '• [White-Label]' : ''}
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
                      <span>Brand Color: {selectedClient.primaryColor || '#2563eb'}</span>
                      {selectedClient.isWhiteLabel && (
                        <span className="text-purple-600 font-bold">• White-Label Partner</span>
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

              {/* Google Business Profile Reputation (Rating + Review Count) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>GBP Star Rating (e.g. 4.9 or 5.0)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={gbpRating}
                    onChange={(e) => setGbpRating(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>Total Review Count</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gbpReviewCount}
                    onChange={(e) => setGbpReviewCount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Grouped Metrics with MoM Comparison */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <BarChart3 className="w-4 h-4 text-rose-500" />
                  <span>Key Performance Indicators (Current vs. Prior Month)</span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoPullPriorMonth}
                  disabled={isPullingPrior || !selectedClientId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
                  title="Auto-fill previous month columns from client's latest existing report"
                >
                  <Zap className={`w-3.5 h-3.5 text-amber-500 ${isPullingPrior ? 'animate-spin' : ''}`} />
                  <span>{isPullingPrior ? 'Pulling Data...' : '⚡ Auto-pull Prior Month'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Google Business Profile (GBP) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Google Business Profile</span>
                  </div>

                  {/* Calls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Calls (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gbpCalls}
                        onChange={(e) => setGbpCalls(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGbpCalls}
                        onChange={(e) => setPrevGbpCalls(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Directions (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gbpDirections}
                        onChange={(e) => setGbpDirections(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGbpDirections}
                        onChange={(e) => setPrevGbpDirections(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Views */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Views (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gbpViews}
                        onChange={(e) => setGbpViews(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGbpViews}
                        onChange={(e) => setPrevGbpViews(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Google Search Console (GSC) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Search Console (GSC)</span>
                  </div>

                  {/* Clicks */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Clicks (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gscClicks}
                        onChange={(e) => setGscClicks(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGscClicks}
                        onChange={(e) => setPrevGscClicks(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Impressions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Impr. (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gscImpressions}
                        onChange={(e) => setGscImpressions(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGscImpressions}
                        onChange={(e) => setPrevGscImpressions(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Avg Pos (Current)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={gscPosition}
                        onChange={(e) => setGscPosition(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={prevGscPosition}
                        onChange={(e) => setPrevGscPosition(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 3: Google Analytics 4 (GA4) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>Analytics (GA4)</span>
                  </div>

                  {/* Users */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Users (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gaUsers}
                        onChange={(e) => setGaUsers(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGaUsers}
                        onChange={(e) => setPrevGaUsers(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Sessions (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gaSessions}
                        onChange={(e) => setGaSessions(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGaSessions}
                        onChange={(e) => setPrevGaSessions(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Pageviews */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Views (Current)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gaViews}
                        onChange={(e) => setGaViews(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prevGaViews}
                        onChange={(e) => setPrevGaViews(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Deep Metric Tables */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Deep Metric Tables (Top 5 Queries & Top 5 Pages)</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Table 1: Top 5 Search Queries */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600">
                      <Search className="w-3.5 h-3.5" />
                      <span>Top 5 Search Keywords (GSC)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Query, Clicks, Impr, Pos</span>
                  </div>

                  <div className="space-y-2">
                    {topQueries.map((q, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder={`Keyword #${idx + 1}`}
                            value={q.query}
                            onChange={(e) => handleQueryChange(idx, 'query', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Clicks"
                            value={q.clicks}
                            onChange={(e) => handleQueryChange(idx, 'clicks', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl text-xs font-mono text-right border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Impr"
                            value={q.impressions}
                            onChange={(e) => handleQueryChange(idx, 'impressions', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl text-xs font-mono text-right border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.1"
                            min="1.0"
                            placeholder="Pos"
                            value={q.position}
                            onChange={(e) => handleQueryChange(idx, 'position', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl text-xs font-mono text-right border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table 2: Top 5 High-Value Pages */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Top 5 Landing Pages (GA4/GSC)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Path, Clicks, Users</span>
                  </div>

                  <div className="space-y-2">
                    {topPages.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                        <div className="col-span-7">
                          <input
                            type="text"
                            placeholder={idx === 0 ? '/' : `/service-${idx}`}
                            value={p.path}
                            onChange={(e) => handlePageChange(idx, 'path', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Clicks"
                            value={p.clicks}
                            onChange={(e) => handlePageChange(idx, 'clicks', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl text-xs font-mono text-right border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Users"
                            value={p.users}
                            onChange={(e) => handlePageChange(idx, 'users', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl text-xs font-mono text-right border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Narrative Text Fields */}
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
                    <span>{isEditing ? 'Updating Report...' : 'Generating Report...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Update Performance Report' : 'Save & View Branded Report'}</span>
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
