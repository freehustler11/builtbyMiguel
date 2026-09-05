import { createFileRoute } from '@tanstack/react-router'
import { Download, LinkIcon } from 'lucide-react'
import { getPublicReportByShareTokenServerFn } from '../../server/reports'
import { ReportDocument } from '../../components/ReportDocument'
import { ThemeToggle } from '../../components/ThemeToggle'

export const Route = createFileRoute('/r/$shareToken')({
  loader: async ({ params }) => {
    try {
      const result = await getPublicReportByShareTokenServerFn({
        data: { shareToken: params.shareToken },
      })
      return result
    } catch {
      return { found: false, report: null }
    }
  },
  head: ({ loaderData }) => {
    const clientName =
      (loaderData?.report as any)?.clientSnapshot?.businessName || 'Performance Report'
    const reportMonth = (loaderData?.report as any)?.reportMonth || ''
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          title: reportMonth
            ? `${clientName} – ${reportMonth} Performance Report`
            : `${clientName} – Performance Report`,
        },
        // Public share routes must NOT be indexed by search engines
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: PublicShareReportPage,
})

function PublicShareReportPage() {
  const loaderData = Route.useLoaderData()

  // -----------------------------------------------------------------------
  // 404: Revoked, invalid, or missing token
  // -----------------------------------------------------------------------
  if (!loaderData?.found || !loaderData?.report) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <LinkIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Not Available
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This shared link is invalid or has been revoked by the account administrator.
              <br />
              Please contact the team who shared this link for an updated one.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const report = loaderData.report
  const clientName = (report as any)?.clientSnapshot?.businessName || 'Performance Report'
  const reportMonth = (report as any)?.reportMonth || ''

  const handleDownloadPdf = () => {
    if (clientName && reportMonth) {
      document.title = `${clientName} – ${reportMonth} Performance Report`
    }
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] print:bg-white text-slate-900 dark:text-white print:text-black">
      {/* ===================================================================
          FLOATING HEADER — Hidden on print
          =================================================================== */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c111d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Client + Month */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {clientName}
            </span>
            {reportMonth && (
              <>
                <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {reportMonth} Report
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle variant="pill" />
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
              title="Download clean PDF report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          REPORT DOCUMENT — Snapshot-only rendering, no client/user joins
          =================================================================== */}
      <div className="my-0 sm:my-6 print:my-0 p-4 sm:p-6 print:p-0">
        <ReportDocument report={report} />
      </div>
    </div>
  )
}
