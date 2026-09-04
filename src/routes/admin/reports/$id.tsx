import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import {
  Printer,
  ArrowLeft,
  Building2,
  Edit3,
} from 'lucide-react'
import { checkAuthServerFn } from '../../../lib/auth'
import { getReportByIdServerFn } from '../../../server/reports'
import { ReportDocument } from '../../../components/ReportDocument'

export const Route = createFileRoute('/admin/reports/$id')({
  beforeLoad: async () => {
    const { isAuthenticated, role } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
    if (role !== 'admin') {
      throw redirect({
        to: '/portal',
      })
    }
  },
  loader: async ({ params }) => {
    return await getReportByIdServerFn({ data: { id: params.id } })
  },
  head: ({ loaderData }) => {
    const title = loaderData?.report?.title || 'Performance Report'
    const clientName = loaderData?.client?.businessName || 'Client'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${title} | ${clientName} | built by Miguel` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: BrandedReportViewPage,
})

function BrandedReportViewPage() {
  const { report, client } = Route.useLoaderData()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] print:bg-white text-slate-900 dark:text-white print:text-black">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP ACTION BAR (Hidden in Print)                                */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c111d]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back link */}
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Reports</span>
          </Link>

          {/* Right Actions: Edit & Print */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/clients"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{client.businessName}</span>
            </Link>

            <Link
              to="/admin/reports/new"
              search={{ editId: report.id, clientId: client.id }}
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
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT-READY DOCUMENT CONTAINER                                         */}
      {/* ========================================================================= */}
      <div className="my-0 sm:my-6 print:my-0 p-4 sm:p-6 print:p-0">
        <ReportDocument report={report} client={client} />
      </div>
    </div>
  )
}
