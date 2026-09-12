import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Users,
  Activity,
  ArrowRight,
  ExternalLink,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminShell } from '../../components/AdminShell'
import { getAdminDashboardDataServerFn, type AdminDashboardData } from '../../server/dashboard'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    if (auth.role === 'partner_employee') {
      throw redirect({ to: '/my-work' })
    }
    return { auth }
  },
  loader: async () => {
    const dashboardData = await getAdminDashboardDataServerFn()
    const auth = await checkAuthServerFn()
    return { dashboardData, auth }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Dashboard | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminDashboardPage,
})

function formatTimeAgo(dateInput: Date | string) {
  const d = new Date(dateInput)
  const diffMs = Date.now() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function AdminDashboardPage() {
  const { dashboardData, auth } = Route.useLoaderData()
  const [data] = useState<AdminDashboardData>(dashboardData)

  const viewerName = auth.name || (auth.email ? auth.email.split('@')[0] : 'Admin')
  const isSuperadmin = auth.role === 'superadmin'

  return (
    <AdminShell
      activeTab="dashboard"
      title={`Dashboard — ${data.period.monthName}`}
      description={
        isSuperadmin
          ? 'Network overview across all agency partners, deliverables, and client KPIs.'
          : `Agency overview for ${viewerName} — deliverables, monthly KPIs, reports due, and activity.`
      }
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/clients"
            className="btn btn-secondary rounded-full h-8 px-3.5 text-[13px]"
          >
            <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Manage clients</span>
          </Link>
          <Link
            to="/admin/reports/new"
            className="btn btn-primary rounded-full h-8 px-4 text-[13px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New report</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-3.5">
        {/* ------------------------------------------------------------- */}
        {/* KPI & SUMMARY METRICS INLINE STRIP                            */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[var(--muted)] px-3.5 py-2 rounded-[6px] bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-2">
            <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{data.stats.totalClients}</strong> active clients</span>
            <span className="opacity-40">·</span>
            <span><strong className="text-[var(--accent)] font-semibold tabular-nums">{data.stats.assignedWorkCount}</strong> assigned items</span>
            <span className="opacity-40">·</span>
            <span>
              <strong className={`font-semibold tabular-nums ${data.stats.missingKpisCount > 0 ? 'text-[var(--danger)]' : 'text-[var(--ink)]'}`}>
                {data.stats.missingKpisCount}
              </strong>{' '}
              missing KPIs
            </span>
            <span className="opacity-40">·</span>
            <span><strong className="text-[var(--warning)] font-semibold tabular-nums">{data.stats.reportsDueCount}</strong> reports due</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {data.stats.missingKpisCount > 0 && (
              <Link
                to="/admin/workspace"
                search={{ tab: 'metrics' }}
                className="inline-flex items-center gap-1 text-[var(--danger)] hover:underline font-medium"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Enter KPIs</span>
              </Link>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2-COLUMN MAIN DASHBOARD GRID                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* =========================================================== */}
          {/* LEFT: WORK ASSIGNED TO VIEWER                               */}
          {/* =========================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--ink)] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[var(--accent)]" />
                  <span>Work Assigned to You</span>
                </h2>
                <p className="text-[12px] text-[var(--muted)] mt-0.5">
                  Tasks, landing pages, and deliverables assigned to your user account
                </p>
              </div>
              <Link
                to="/my-work"
                className="text-[12px] font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {data.assignedWork.items.length === 0 ? (
              <div className="p-6 card-modern text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto opacity-80" />
                <p className="text-[13px] font-medium text-[var(--ink)]">All clear!</p>
                <p className="text-[12px] text-[var(--muted)]">
                  You have no pending tasks or deliverables assigned at this time.
                </p>
              </div>
            ) : (
              <div className="card-modern divide-y divide-[var(--line)] overflow-hidden">
                {data.assignedWork.items.slice(0, 5).map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[var(--line)]/20 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium tracking-tight uppercase ${
                            item.type === 'landing_page'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : item.type === 'article'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-[var(--muted)] font-medium truncate">
                          {item.clientBusinessName}
                        </span>
                      </div>
                      <div className="text-[13px] font-medium text-[var(--ink)] truncate mt-1">
                        {item.title}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)]">
                        {item.status}
                      </span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
                          title="Open deliverable link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================== */}
          {/* RIGHT: CLIENTS MISSING KPIS (BLOCKER WARNING)               */}
          {/* =========================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--ink)] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
                  <span>Clients Missing KPIs</span>
                  {data.missingKpis.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--danger-subtle)] text-[var(--danger)] border border-[var(--danger)]/30">
                      {data.missingKpis.count} Blockers
                    </span>
                  )}
                </h2>
                <p className="text-[12px] text-[var(--muted)] mt-0.5">
                  Monthly KPI metrics must be recorded before generating client reports
                </p>
              </div>
            </div>

            {data.missingKpis.clients.length === 0 ? (
              <div className="p-6 card-modern text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto opacity-80" />
                <p className="text-[13px] font-medium text-[var(--ink)]">
                  All KPIs up to date for {data.period.monthName}
                </p>
                <p className="text-[12px] text-[var(--muted)]">
                  Every active client has metrics recorded. Reports can be generated immediately.
                </p>
              </div>
            ) : (
              <div className="card-modern divide-y divide-[var(--line)] overflow-hidden">
                {data.missingKpis.clients.slice(0, 5).map((client) => (
                  <div
                    key={client.clientId}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[var(--line)]/20 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[var(--ink)] truncate">
                          {client.businessName}
                        </span>
                        {client.partnerName && isSuperadmin && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                            {client.partnerName}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--danger)] font-medium mt-0.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Missing {data.period.monthName} KPIs — Report blocked</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to="/admin/clients"
                        className="h-7 inline-flex items-center gap-1 px-2.5 rounded-[6px] text-[12px] font-medium bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                      >
                        <span>Enter KPIs</span>
                        <ArrowRight className="w-3 h-3 text-[var(--muted)]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* LOWER ROW: REPORTS DUE FOR ACTIVE MONTH                       */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2">
          {/* =========================================================== */}
          {/* REPORTS DUE                                                 */}
          {/* =========================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--ink)] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--warning)]" />
                  <span>Reports Due for {data.period.monthName}</span>
                </h2>
                <p className="text-[12px] text-[var(--muted)] mt-0.5">
                  Clients without a published or generated performance report for this month
                </p>
              </div>
              <Link
                to="/admin/reports"
                className="btn btn-ghost rounded-full h-8 px-3 text-[12px] text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>Reports manager</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {data.reportsDue.clients.length === 0 ? (
              <div className="p-8 card-modern text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto opacity-80" />
                <p className="text-[14px] font-semibold text-[var(--ink)]">
                  All reports generated for {data.period.monthName}
                </p>
                <p className="text-[12px] text-[var(--muted)]">
                  No pending reports due for this reporting period.
                </p>
              </div>
            ) : (
              <div className="card-modern divide-y divide-[var(--line)] overflow-hidden">
                {data.reportsDue.clients.map((client) => (
                  <div
                    key={client.clientId}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--line)]/20 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-[var(--ink)] truncate">
                        {client.businessName}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">
                        {client.isKpiEntered ? (
                          <span className="badge-pill badge-pill-success">✓ KPIs ready</span>
                        ) : (
                          <span className="badge-pill badge-pill-danger">⚠ Awaiting KPI data</span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/admin/reports/new"
                      className="btn btn-primary rounded-full h-8 px-4 text-[12px] shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Report</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
