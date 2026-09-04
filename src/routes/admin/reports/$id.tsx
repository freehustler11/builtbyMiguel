import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect, useState, useTransition } from 'react'
import {
  Printer,
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
  Table,
  Target,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import {
  getReportByIdServerFn,
  updateReportDisplayOptionsServerFn,
  type DisplayOptions,
} from '../../../server/reports'
import { ReportDocument } from '../../../components/ReportDocument'

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
    const clientName = loaderData?.client?.businessName || 'Client'
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

  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

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

  const handlePrint = () => {
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

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
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
              title="Toggle Executive Summary Block"
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
