import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Filter,
  RefreshCw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  AlertTriangle,
  Building2,
  FilePlus,
  Trash2,
  Laptop,
  Smartphone,
  Globe,
  Clock,
  User as UserIcon,
} from 'lucide-react'
import { AdminNav } from '../../components/AdminNav'
import { getActivityLogsServerFn, type ActivityLogItem, type ActivityLogsResponse, type ActivityAction } from '../../server/activity'

export interface ActivitySearch {
  filter?:
    | 'all'
    | 'login'
    | 'logout'
    | 'failed_login'
    | 'create_client'
    | 'create_report'
    | 'delete_report'
  page?: number
  pageSize?: number
}

export const Route = createFileRoute('/superadmin/activity')({
  validateSearch: (search: Record<string, unknown>): ActivitySearch => ({
    filter: typeof search.filter === 'string' ? (search.filter as ActivitySearch['filter']) : undefined,
    page: search.page ? Math.max(1, Number(search.page)) : undefined,
    pageSize: search.pageSize ? Math.min(100, Math.max(10, Number(search.pageSize))) : undefined,
  }),
  loaderDeps: ({ search }) => ({
    filter: search.filter || 'all',
    page: search.page || 1,
    pageSize: search.pageSize || 25,
  }),
  loader: async ({ deps }) => {
    return await getActivityLogsServerFn({ data: deps })
  },
  head: () => ({
    meta: [
      { title: 'Superadmin Activity Logs | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: SuperadminActivityPage,
})

function formatDateTime(dateInput: string | Date | null): string {
  if (!dateInput) return '—'
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(d)
}

function formatRelativeTime(dateInput: string | Date | null): string {
  if (!dateInput) return ''
  const diffSec = Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return ''
}

function SuperadminActivityPage() {
  const data = (Route.useLoaderData() || {}) as Partial<ActivityLogsResponse>
  const logs: ActivityLogItem[] = data.logs || []
  const totalCount: number = data.totalCount || 0
  const page: number = data.page || 1
  const pageSize: number = data.pageSize || 25
  const totalPages: number = data.totalPages || 1

  const search = Route.useSearch() as { filter?: string; page?: number; pageSize?: number }
  const currentFilter = search.filter || 'all'
  const navigate = useNavigate({ from: Route.fullPath })
  const [isPending, startTransition] = useTransition()
  const [copiedIp, setCopiedIp] = useState<string | null>(null)

  const handleFilterChange = (newFilter: string) => {
    startTransition(() => {
      navigate({
        search: (prev: any) => ({
          ...prev,
          filter: newFilter,
          page: 1,
        }),
      })
    })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    startTransition(() => {
      navigate({
        search: (prev: any) => ({
          ...prev,
          page: newPage,
        }),
      })
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    startTransition(() => {
      navigate({
        search: (prev: any) => ({
          ...prev,
          pageSize: newPageSize,
          page: 1,
        }),
      })
    })
  }

  const copyIp = (ip: string) => {
    navigator.clipboard.writeText(ip)
    setCopiedIp(ip)
    setTimeout(() => setCopiedIp(null), 2000)
  }

  // Quick stats computed from current view
  const failedCount = logs.filter((l: ActivityLogItem) => l.action === 'failed_login').length
  const loginCount = logs.filter((l: ActivityLogItem) => l.action === 'login').length

  const renderEventBadge = (action: string) => {
    switch (action) {
      case 'login':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>Login Success</span>
          </span>
        )
      case 'logout':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Logout</span>
          </span>
        )
      case 'failed_login':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/70 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span>Failed Attempt</span>
          </span>
        )
      case 'create_client':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Client Created</span>
          </span>
        )
      case 'create_report':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
            <FilePlus className="w-3.5 h-3.5 shrink-0" />
            <span>Report Created</span>
          </span>
        )
      case 'delete_report':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
            <Trash2 className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Report Deleted</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>{action}</span>
          </span>
        )
    }
  }

  const renderRoleBadge = (role: string | null) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Superadmin
          </span>
        )
      case 'partner':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            Agency Owner
          </span>
        )
      case 'partner_employee':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900">
            Agency Staff
          </span>
        )
      case 'client':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
            Client
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Unauthenticated
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Top Bar */}
        <AdminNav
          activeTab="activity"
          userRole="superadmin"
          title="Superadmin Activity Logs"
          description="Security audit log and chronological activity trail across all logins, administrative actions, and report lifecycle events."
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    navigate({
                      search: (prev) => ({ ...prev }),
                    })
                  })
                }}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>
            </div>
          }
        />

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono font-bold uppercase">
              <span>Total Recorded Events</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400">Chronological history stored in PostgreSQL</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase">
              <span>Successful Logins (Page)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {loginCount}
            </div>
            <p className="text-[11px] text-slate-400">Authorized sessions initiated</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase">
              <span>Failed Attempts (Page)</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {failedCount}
            </div>
            <p className="text-[11px] text-slate-400">Rejected attempts or disabled credentials</p>
          </div>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Event Type Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <label htmlFor="event-filter" className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Filter Event:
              </label>
              <select
                id="event-filter"
                value={currentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3.5 py-2 rounded-2xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-2xs"
              >
                <option value="all">All Event Types</option>
                <option value="login">Logins (Success)</option>
                <option value="logout">Logouts</option>
                <option value="failed_login">Failed Attempts</option>
                <option value="create_client">Client Creations</option>
                <option value="create_report">Report Creations</option>
                <option value="delete_report">Report Deletions</option>
              </select>
            </div>

            {/* Page Size Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2.5 py-2 rounded-2xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value={20}>20 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </div>

          {/* Quick Pagination Counter */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
            </span>
            <span>•</span>
            <span>
              Total: <strong className="text-rose-600 dark:text-rose-400">{totalCount}</strong>
            </span>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No activity logs found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No log entries matched your selected filter. New logins and operations will be recorded here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 font-bold">
                      User
                    </th>
                    <th scope="col" className="py-3.5 px-4 font-bold">
                      Role
                    </th>
                    <th scope="col" className="py-3.5 px-4 font-bold">
                      Event
                    </th>
                    <th scope="col" className="py-3.5 px-4 font-bold">
                      IP Address
                    </th>
                    <th scope="col" className="py-3.5 px-4 font-bold">
                      Device
                    </th>
                    <th scope="col" className="py-3.5 px-4 font-bold text-right">
                      Date / Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
                  {logs.map((log: ActivityLogItem) => {
                    const displayName = log.userName || log.userEmail || 'Guest / Unknown'
                    const initials = displayName
                      .replace(/[^a-zA-Z0-9 ]/g, '')
                      .split(' ')
                      .map((p: string) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'U'

                    const isMobile = /iphone|ipad|android|mobile/i.test(log.userAgent || '')

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        {/* 1. User Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white truncate block">
                                {log.userName || (log.userEmail ? log.userEmail.split('@')[0] : 'Unknown')}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                                {log.userEmail || 'No email provided'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Role Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderRoleBadge(log.role)}
                        </td>

                        {/* 3. Event Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderEventBadge(log.action)}
                        </td>

                        {/* 4. IP Address Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                            <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{log.ipAddress || '127.0.0.1'}</span>
                            {log.ipAddress && (
                              <button
                                type="button"
                                onClick={() => copyIp(log.ipAddress!)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                                title="Copy IP Address"
                              >
                                {copiedIp === log.ipAddress ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 5. Device Column */}
                        <td className="py-3.5 px-4">
                          <div
                            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 max-w-[220px] truncate"
                            title={log.userAgent || 'Unknown'}
                          >
                            {isMobile ? (
                              <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{log.device}</span>
                          </div>
                        </td>

                        {/* 6. Date / Time Column */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-mono text-xs text-slate-800 dark:text-slate-200">
                              {formatDateTime(log.createdAt)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {formatRelativeTime(log.createdAt)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Showing{' '}
                <strong className="text-slate-900 dark:text-white">
                  {(page - 1) * pageSize + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(page * pageSize, totalCount)}
                </strong>{' '}
                of <strong className="text-slate-900 dark:text-white">{totalCount}</strong> logs
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (totalPages > 5 && page > 3) {
                      pageNum = page - 2 + i
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                    }
                    if (pageNum < 1 || pageNum > totalPages) return null

                    const isActive = pageNum === page
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isPending}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
