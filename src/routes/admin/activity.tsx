import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { DataTable, type ColumnDef } from '../../components/ui/DataTable'
import {
  getActivityLogsServerFn,
  type ActivityLogItem,
  type ActivityLogsResponse,
  type ActivityAction,
} from '../../server/activity'

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
  sort?: 'user' | 'role' | 'event' | 'ip' | 'device' | 'createdAt'
  order?: 'asc' | 'desc'
}

export const Route = createFileRoute('/admin/activity')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role !== 'superadmin' && auth.role !== 'admin') {
      throw redirect({ to: auth.role === 'partner' ? '/admin' : auth.role === 'partner_employee' ? '/my-work' : '/portal' })
    }
    return { auth }
  },
  validateSearch: (search: Record<string, unknown>): ActivitySearch => {
    const sort = search.sort as ActivitySearch['sort']
    const order = search.order as ActivitySearch['order']
    return {
      filter: typeof search.filter === 'string' ? (search.filter as ActivitySearch['filter']) : undefined,
      page: search.page ? Math.max(1, Number(search.page)) : undefined,
      pageSize: search.pageSize ? Math.min(100, Math.max(10, Number(search.pageSize))) : undefined,
      sort: ['user', 'role', 'event', 'ip', 'device', 'createdAt'].includes(sort || '') ? sort : undefined,
      order: order === 'asc' ? 'asc' : order === 'desc' ? 'desc' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({
    filter: search.filter || 'all',
    page: search.page || 1,
    pageSize: search.pageSize || 25,
    sort: search.sort,
    order: search.order,
  }),
  loader: async ({ deps, context }) => {
    const activityData = await getActivityLogsServerFn({ data: deps })
    const auth = (context as any)?.auth || (await checkAuthServerFn())
    return {
      activityData,
      auth,
    }
  },
  head: () => ({
    meta: [
      { title: 'Activity Logs | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminActivityPage,
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
  return `${diffDays}d ago`
}

function getActionBadge(action: ActivityAction | string) {
  switch (action) {
    case 'login':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <LogIn className="w-3 h-3" />
          <span>User Login</span>
        </span>
      )
    case 'logout':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <LogOut className="w-3 h-3" />
          <span>User Logout</span>
        </span>
      )
    case 'failed_login':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-3 h-3" />
          <span>Failed Login</span>
        </span>
      )
    case 'create_client':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Building2 className="w-3 h-3" />
          <span>Create Client</span>
        </span>
      )
    case 'create_report':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <FilePlus className="w-3 h-3" />
          <span>Create Report</span>
        </span>
      )
    case 'delete_report':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Trash2 className="w-3 h-3" />
          <span>Delete Report</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <Activity className="w-3 h-3" />
          <span className="capitalize">{action.replace('_', ' ')}</span>
        </span>
      )
  }
}

function getRoleBadge(role: string | null) {
  switch (role) {
    case 'superadmin':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
          <ShieldAlert className="w-3 h-3" />
          <span>Superadmin</span>
        </span>
      )
    case 'partner':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
          <Building2 className="w-3 h-3" />
          <span>Partner</span>
        </span>
      )
    case 'partner_employee':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
          <UserIcon className="w-3 h-3" />
          <span>Staff</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-mono">
          <span>{role || 'Unknown'}</span>
        </span>
      )
  }
}

export function AdminActivityPage() {
  const { activityData, auth } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const activeFilter = search.filter || 'all'
  const currentPage = activityData.page
  const totalPages = activityData.totalPages
  const totalCount = activityData.totalCount
  const sort = search.sort || 'createdAt'
  const order = search.order || 'desc'

  const handleFilterChange = (newFilter: ActivitySearch['filter']) => {
    startTransition(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          filter: newFilter === 'all' ? undefined : newFilter,
          page: undefined,
        }),
      })
    })
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPage <= 1 ? undefined : newPage,
        }),
      })
    })
  }

  const handleSortChange = (column: 'user' | 'role' | 'event' | 'ip' | 'device' | 'createdAt') => {
    startTransition(() => {
      let nextOrder: 'asc' | 'desc' = 'asc'
      if (sort === column) {
        nextOrder = order === 'asc' ? 'desc' : 'asc'
      } else {
        nextOrder = column === 'createdAt' ? 'desc' : 'asc'
      }

      navigate({
        search: (prev) => ({
          ...prev,
          sort: column,
          order: nextOrder,
          page: undefined,
        }),
      })
    })
  }

  const renderSortIcon = (column: string) => {
    if (sort !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 ml-1 inline" />
    }
    return order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-500 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-500 ml-1 inline" />
    )
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <AdminShell
      activeTab="activity"
      title="Activity Logs"
      description={
        auth.role === 'superadmin'
          ? 'Immutable audit trail of security events, administrative changes, and user operations across the platform.'
          : 'Audit trail of administrative changes, client reports, and logins for your agency.'
      }
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ search: (prev) => ({ ...prev }) })}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Refresh</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Navigation Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'login', label: 'Logins' },
            { id: 'logout', label: 'Logouts' },
            { id: 'failed_login', label: 'Failed Logins' },
            { id: 'create_client', label: 'Client Creations' },
            { id: 'create_report', label: 'Reports Created' },
            { id: 'delete_report', label: 'Reports Deleted' },
          ].map((f) => {
            const isActive = activeFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterChange(f.id as any)}
                className={`h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)] shadow-2xs font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Activity Logs Table */}
        <DataTable<ActivityLogItem>
          data={activityData.logs}
          columns={[
            {
              id: 'createdAt',
              header: 'Timestamp',
              sortKey: 'createdAt',
              accessor: (log) => (
                <div className="font-mono text-[12px] text-[var(--muted)]">
                  <div>{formatDateTime(log.createdAt)}</div>
                  <div className="text-[10px] text-[var(--muted)]/80">
                    {formatRelativeTime(log.createdAt)}
                  </div>
                </div>
              ),
            },
            {
              id: 'event',
              header: 'Action / Event',
              sortKey: 'event',
              accessor: (log) => getActionBadge(log.action),
            },
            {
              id: 'user',
              header: 'User / Email',
              sortKey: 'user',
              accessor: (log) => (
                <div className="min-w-0">
                  <div className="font-medium text-[var(--ink)] truncate max-w-[200px]">
                    {log.userName || log.userEmail?.split('@')[0] || 'Anonymous'}
                  </div>
                  {log.userEmail && (
                    <div className="text-[11px] text-[var(--muted)] font-mono truncate max-w-[200px]">
                      {log.userEmail}
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: 'role',
              header: 'Role',
              sortKey: 'role',
              accessor: (log) => getRoleBadge(log.role),
            },
            {
              id: 'ip',
              header: 'IP Address',
              sortKey: 'ip',
              accessor: (log) =>
                log.ipAddress ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(log.ipAddress!, `ip-${log.id}`)}
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                    title="Click to copy IP"
                  >
                    <span>{log.ipAddress}</span>
                    {copiedId === `ip-${log.id}` ? (
                      <Check className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                ) : (
                  <span className="text-[12px] text-[var(--muted)]">—</span>
                ),
            },
            {
              id: 'device',
              header: 'Device',
              sortKey: 'device',
              accessor: (log) => (
                <div className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                  {log.device.includes('Mobile') ? (
                    <Smartphone className="w-3.5 h-3.5 text-[var(--muted)]" />
                  ) : (
                    <Laptop className="w-3.5 h-3.5 text-[var(--muted)]" />
                  )}
                  <span>{log.device}</span>
                </div>
              ),
            },
          ]}
          keyExtractor={(log) => log.id}
          sortKey={sort}
          sortOrder={order}
          onSort={(k: string) => handleSortChange(k as any)}
        />

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--line)] bg-[var(--canvas)]">
              <span className="text-[12px] text-[var(--muted)]">
                Showing page <span className="font-semibold text-[var(--ink)]">{currentPage}</span> of{' '}
                <span className="font-semibold text-[var(--ink)]">{totalPages}</span> ({totalCount}{' '}
                total events)
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--line)]/40 transition cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--line)]/40 transition cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminShell>
    )
  }
