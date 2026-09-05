import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useTransition } from 'react'
import {
  Download,
  ArrowLeft,
  Building2,
  Edit3,
  Sliders,
  Check,
  Loader2,
  Shield,
  User,
  Calendar,
  FileText,
  Target,
  Share2,
  Copy,
  CheckCircle,
  XCircle,
  Table,
  RefreshCw,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import {
  getReportByIdServerFn,
  updateReportDisplayOptionsServerFn,
  generateReportShareLinkServerFn,
  revokeReportShareLinkServerFn,
  regenerateReportServerFn,
  type DisplayOptions,
} from '../../../server/reports'
import { ReportDocument } from '../../../components/ReportDocument'
import { ThemeToggle } from '../../../components/ThemeToggle'

export const Route = createFileRoute('/admin/reports/$id')({
  beforeLoad: async ({ location }) => {
    await requireAdmin({ location })
  },

  loader: async ({ params }) => {
    try {
      await checkAuthServerFn()
      return await getReportByIdServerFn({ data: { id: params.id } })
    } catch {
      throw redirect({
        to: '/admin/reports',
        search: {
          error: 'access_denied',
        },
      })
    }
  },
  head: ({ loaderData }) => {
    const clientName = (loaderData?.report as any)?.clientSnapshot?.businessName || loaderData?.client?.businessName || 'Client'
    const reportMonth = loaderData?.report?.reportMonth || 'Monthly'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${clientName} - ${reportMonth} Performance Report` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: BrandedReportViewPage,
})

function BrandedReportViewPage() {
  const loaderData = Route.useLoaderData()
  const report = loaderData?.report
  const client = loaderData?.client
  const params = Route.useParams()
  const reportId = report?.id || params?.id || ''
  const navigate = useNavigate()

  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    if (!reportId) return
    const currentVer = report?.version || 1
    const confirmed = window.confirm(
      `Regenerate this report? This will create version ${currentVer + 1} with the latest CRM deliverables and metrics without deleting prior versions.`
    )
    if (!confirmed) return
    try {
      setIsRegenerating(true)
      const res = await regenerateReportServerFn({ data: { reportId } })
      if (res?.report?.id) {
        navigate({
          to: '/admin/reports/$id',
          params: { id: res.report.id },
        })
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to regenerate report')
    } finally {
      setIsRegenerating(false)
    }
  }

  // Section Display Options state
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>(() => ({
    show_agency_info: false,
    show_contact_person: true,
    show_date_generated: false,
    show_summary: true,
    show_tables: true,
    show_next_steps: true,
    ...(report?.displayOptions || {}),
  }))

  // Public Share Link State
  const [shareToken, setShareToken] = useState<string | null>(report?.shareToken || null)
  const [shareRevokedAt, setShareRevokedAt] = useState<string | Date | null>(report?.shareRevokedAt || null)
  const [isShareLoading, setIsShareLoading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const isShareActive = Boolean(shareToken && !shareRevokedAt)

  const handleGenerateShareLink = async () => {
    if (!reportId) return
    try {
      setIsShareLoading(true)
      const res = await generateReportShareLinkServerFn({ data: { reportId } })
      if (res.shareToken) {
        setShareToken(res.shareToken)
        setShareRevokedAt(null)
      }
    } catch (err) {
      console.error('Failed to generate share link:', err)
    } finally {
      setIsShareLoading(false)
    }
  }

  const handleRevokeShareLink = async () => {
    if (!reportId) return
    const confirmed = window.confirm('Are you sure you want to revoke this public share link? Anyone with the link will immediately lose access.')
    if (!confirmed) return
    try {
      setIsShareLoading(true)
      await revokeReportShareLinkServerFn({ data: { reportId } })
      setShareRevokedAt(new Date())
    } catch (err) {
      console.error('Failed to revoke share link:', err)
    } finally {
      setIsShareLoading(false)
    }
  }

  const handleCopyShareLink = () => {
    if (!shareToken) return
    const url = `${window.location.origin}/r/${shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  useEffect(() => {
    if (client?.businessName && report?.reportMonth) {
      document.title = `${client.businessName} - ${report.reportMonth} Performance Report`
    }
  }, [client?.businessName, report?.reportMonth])

  const handleToggle = (key: keyof DisplayOptions) => {
    if (!reportId) return
    const updated = {
      ...displayOptions,
      [key]: !displayOptions[key],
    }
    setDisplayOptions(updated)
    setSaveStatus('saving')

    startTransition(async () => {
      try {
        await updateReportDisplayOptionsServerFn({
          data: {
            id: reportId,
            displayOptions: updated,
          },
        })
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (err) {
        console.error('Failed to save display options:', err)
        setSaveStatus('idle')
      }
    })
  }

  const handleDownloadPdf = () => {
    if (client?.businessName && report?.reportMonth) {
      document.title = `${client.businessName} - ${report.reportMonth} Performance Report`
    }
    window.print()
  }

  if (!report || !client) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Report data could not be loaded.</p>
          <Link
            to="/admin/reports"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Reports</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] print:bg-white text-slate-900 dark:text-white print:text-black">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP ACTION & CUSTOMIZER BAR (Hidden in Print)                   */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c111d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden px-4 sm:px-6 py-2.5 shadow-xs space-y-2">
        {/* Top Row: Navigation & Actions */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back link & Client badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Reports</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <Link
              to="/admin/clients"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{client?.businessName || 'Client'}</span>
            </Link>

            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              v{report?.version || 1}
            </span>
          </div>

          {/* Right Actions: Edit Data & Print */}
          <div className="flex items-center gap-2">
            {/* Auto-Save Indicator */}
            {saveStatus === 'saving' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Saved</span>
              </span>
            )}

            {/* Direct Edit Route (Fixes editId crash) */}
            <Link
              to="/admin/reports/$id/edit"
              params={{ id: reportId }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit Data</span>
            </Link>

            {/* Regenerate Report (v+1) */}
            <button
              type="button"
              disabled={isRegenerating}
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
              title={`Regenerate report (v${(report?.version || 1) + 1}) pulling latest CRM deliverables`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : `Regenerate (v${(report?.version || 1) + 1})`}</span>
            </button>

            {/* Public Share Link Management */}
            {isShareActive ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Public Link Active</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-200 transition cursor-pointer"
                  title="Copy public read-only link"
                >
                  {copiedLink ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-emerald-600" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  disabled={isShareLoading}
                  onClick={handleRevokeShareLink}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[11px] font-mono font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition cursor-pointer disabled:opacity-50"
                  title="Revoke public link immediately"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Revoke</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isShareLoading}
                onClick={handleGenerateShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
                title="Create a secure public read-only link for clients or stakeholders"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{isShareLoading ? 'Generating...' : 'Create Share Link'}</span>
              </button>
            )}

            <ThemeToggle variant="pill" />

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
              title="Download clean 2-page PDF report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Live Section Display Toggles */}
        <div className="max-w-5xl mx-auto pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Customize Sections:</span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            {/* Toggle 1: Agency Info */}
            <button
              type="button"
              onClick={() => handleToggle('show_agency_info')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_agency_info
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Agency & Partner Branding"
            >
              <Shield className="w-3 h-3" />
              <span>Agency Info</span>
            </button>

            {/* Toggle 2: Contact Person */}
            <button
              type="button"
              onClick={() => handleToggle('show_contact_person')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_contact_person
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Client Contact Person"
            >
              <User className="w-3 h-3" />
              <span>Contact Person</span>
            </button>

            {/* Toggle 3: Date Generated */}
            <button
              type="button"
              onClick={() => handleToggle('show_date_generated')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_date_generated
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Generation Date Timestamp"
            >
              <Calendar className="w-3 h-3" />
              <span>Date Generated</span>
            </button>

            {/* Toggle 4: Summary */}
            <button
              type="button"
              onClick={() => handleToggle('show_summary')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_summary
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Summary / Highlights Block"
            >
              <FileText className="w-3 h-3" />
              <span>Summary</span>
            </button>

            {/* Toggle 5: Data Tables */}
            <button
              type="button"
              onClick={() => handleToggle('show_tables')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_tables
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Page 2 Search Queries & Landing Pages Tables"
            >
              <Table className="w-3 h-3" />
              <span>Data Tables</span>
            </button>

            {/* Toggle 6: Strategic Priorities */}
            <button
              type="button"
              onClick={() => handleToggle('show_next_steps')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                displayOptions.show_next_steps
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
              title="Toggle Work Completed and Strategic Priorities"
            >
              <Target className="w-3 h-3" />
              <span>Strategic Priorities</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT-READY DOCUMENT CONTAINER                                         */}
      {/* ========================================================================= */}
      <div className="my-0 sm:my-6 print:my-0 p-4 sm:p-6 print:p-0">
        <ReportDocument report={report} client={client} displayOptions={displayOptions} />
      </div>
    </div>
  )
}
