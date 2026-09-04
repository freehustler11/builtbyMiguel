import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Printer, ArrowLeft } from 'lucide-react'
import { checkAuthServerFn } from '../../../lib/auth'
import { getReportByIdServerFn } from '../../../server/reports'
import { ReportDocument } from '../../../components/ReportDocument'

export const Route = createFileRoute('/portal/reports/$id')({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  loader: async ({ params }) => {
    try {
      await checkAuthServerFn()
      return await getReportByIdServerFn({ data: { id: params.id } })
    } catch {
      throw redirect({
        to: '/portal',
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
  component: ClientPortalReportPage,
})

function ClientPortalReportPage() {
  const { report, client } = Route.useLoaderData()

  useEffect(() => {
    if (client?.businessName && report?.reportMonth) {
      document.title = `${client.businessName} - ${report.reportMonth} Performance Report`
    }
  }, [client?.businessName, report?.reportMonth])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="print:hidden flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Link
          to="/portal"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Reports</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Render Document */}
      <div className="print:m-0 print:p-0">
        <ReportDocument report={report} client={client} />
      </div>
    </div>
  )
}
