import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BarChart3,
  Calendar,
  Eye,
  Download,
  PhoneCall,
  MousePointerClick,
  Users,
  Globe,
  TrendingUp,
  FileText,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { getPortalReportsServerFn } from '../../server/reports'

export const Route = createFileRoute('/portal/')({
  loader: async () => {
    return await getPortalReportsServerFn()
  },
  head: ({ loaderData }) => {
    const businessName = loaderData?.client?.businessName || 'Client'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${businessName} | Performance Reports Portal` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: PortalDashboardPage,
})

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function PortalDashboardPage() {
  const { client, reports } = Route.useLoaderData()

  if (!client) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Not Assigned</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your portal login is currently not linked to an active client profile. Please contact your account administrator for assistance.
        </p>
      </div>
    )
  }

  const primaryColor = client.primaryColor || '#2563eb'
  const latestReport = reports[0]

  return (
    <div className="space-y-8">
      {/* Client Welcome & Brand Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {client.logoUrl ? (
            <div className="w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white p-2 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={client.logoUrl}
                alt={client.businessName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {client.businessName.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Client Growth Portal
              </span>
              {client.isWhiteLabel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  <Award className="w-2.5 h-2.5" />
                  <span>Private Portal</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {client.businessName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Welcome back, {client.name}
              {client.websiteUrl && (
                <>
                  {' '}•{' '}
                  <a
                    href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {client.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick summary badge */}
        <div className="sm:text-right space-y-1 shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Published Reports
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {reports.length}
          </span>
          {latestReport && (
            <span className="text-[11px] font-mono text-slate-500 block">
              Latest: {latestReport.reportMonth}
            </span>
          )}
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Monthly Performance Reports</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {reports.length} {reports.length === 1 ? 'Report' : 'Reports'} Available
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 inline-block">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Reports Published Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your monthly performance and SEO reports will appear here once finalized by your account manager.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Month badge & title */}
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-mono">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span>{report.reportMonth}</span>
                    </span>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {report.title}
                    </h3>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-0.5">
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase truncate flex items-center justify-center gap-1">
                        <PhoneCall className="w-2.5 h-2.5" />
                        <span>Calls</span>
                      </div>
                      <div className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                        {report.gbpCalls || 0}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase truncate flex items-center justify-center gap-1">
                        <MousePointerClick className="w-2.5 h-2.5" />
                        <span>Clicks</span>
                      </div>
                      <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                        {report.gscClicks || 0}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-0.5">
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase truncate flex items-center justify-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        <span>Total Users</span>
                      </div>
                      <div className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200">
                        {report.gaUsers || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(report.createdAt)}
                  </span>

                  <Link
                    to="/portal/reports/$id"
                    params={{ id: report.id }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 shadow-xs transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Download</span>
                    <Download className="w-3.5 h-3.5 text-white/80 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
