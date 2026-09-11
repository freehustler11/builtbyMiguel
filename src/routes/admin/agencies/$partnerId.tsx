import { createFileRoute, redirect, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Building2,
  Users,
  BarChart3,
  Calendar,
  Mail,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Plus,
  ArrowLeft,
  FileSpreadsheet,
  Layers,
  Trash2,
  RefreshCw,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { DataTable, type ColumnDef, type BulkAction } from '../../../components/ui/DataTable'
import {
  getAgencyDetailServerFn,
  deletePartnerServerFn,
  type AgencyDetailData,
} from '../../../server/partners'
import type { ClientWithReportCount } from '../../../server/clients'

export interface AgencyDetailSearch {
  sort?: 'name' | 'email' | 'status' | 'createdAt'
  order?: 'asc' | 'desc'
}

export const Route = createFileRoute('/admin/agencies/$partnerId')({
  validateSearch: (search: Record<string, unknown>): AgencyDetailSearch => {
    const sort = search.sort as AgencyDetailSearch['sort']
    const order = search.order as AgencyDetailSearch['order']
    return {
      sort: ['name', 'email', 'status', 'createdAt'].includes(sort || '') ? sort : undefined,
      order: order === 'desc' ? 'desc' : order === 'asc' ? 'asc' : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role !== 'superadmin' && auth.role !== 'admin') {
      throw redirect({ to: '/admin' })
    }
    return { auth }
  },
  loaderDeps: ({ search }) => ({
    sort: search.sort,
    order: search.order,
  }),
  loader: async ({ params, deps, context }) => {
    const detail = await getAgencyDetailServerFn({
      data: {
        partnerId: params.partnerId,
        sort: deps.sort,
        order: deps.order,
      },
    })
    return {
      detail,
      currentAdmin: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: ({ loaderData }) => {
    const name = loaderData?.detail?.partner?.name || loaderData?.detail?.partner?.email || 'Agency Detail'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${name} | Agencies | Admin | built by Miguel` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: AdminAgencyDetailPage,
})

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return '—'
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function AdminAgencyDetailPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { detail, currentAdmin } = Route.useLoaderData()
  const { partner, staff, clients, counts } = detail

  const agencyDisplayName = partner.name || partner.email
  const isSuspended = !partner.isActive

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteAgency = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const res = await deletePartnerServerFn({
        data: { partnerId: partner.id },
      })
      if (res.success) {
        navigate({ to: '/admin/agencies' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete agency'
      setDeleteError(msg)
      setIsDeleting(false)
    }
  }

  const handleStaffSort = (sortKey: string, order: 'asc' | 'desc') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        sort: sortKey,
        order,
      }),
    })
  }

  // Staff Columns Definition
  const staffColumns: ColumnDef<(typeof staff)[number]>[] = [
    {
      id: 'name',
      header: 'Staff member',
      sortKey: 'name',
      accessor: (member) => (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
            {(member.name || member.email).slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-[13px] text-[var(--ink)]">
            {member.name || member.email}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      sortKey: 'email',
      accessor: (member) => (
        <span className="font-mono text-[12px] text-[var(--muted)]">
          {member.email}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortKey: 'status',
      accessor: (member) =>
        member.isActive ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--line)]/50 text-[var(--muted)] border border-[var(--line)]">
            Inactive
          </span>
        ),
    },
    {
      id: 'createdAt',
      header: 'Date added',
      sortKey: 'createdAt',
      accessor: (member) => (
        <span className="font-mono text-[12px] text-[var(--muted)]">
          {formatDate(member.createdAt)}
        </span>
      ),
    },
  ]

  // Client Columns Definition (Redundancy stripped: no repeating partner name/badge/white-label)
  const clientColumns: ColumnDef<ClientWithReportCount>[] = [
    {
      id: 'client',
      header: 'Client',
      sortKey: 'name',
      accessor: (c) => (
        <div className="flex items-center gap-2.5">
          {c.logoUrl ? (
            <div
              className="w-5 h-5 rounded-[4px] border border-[var(--line)] overflow-hidden p-0.5 flex items-center justify-center shrink-0"
              style={{ backgroundColor: (c as any).logoBgColor || '#ffffff' }}
            >
              <img
                src={c.logoUrl}
                alt={c.businessName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-[4px] text-white flex items-center justify-center font-bold text-[10px] shrink-0"
              style={{ backgroundColor: c.primaryColor || '#2563eb' }}
            >
              {c.businessName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <Link
              to="/admin/clients/$clientId"
              params={{ clientId: c.id }}
              className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] transition truncate"
            >
              {c.businessName}
            </Link>
            <span className="text-[11px] text-[var(--muted)] truncate">
              {c.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'website',
      header: 'Website',
      sortKey: 'website',
      accessor: (c) =>
        c.websiteUrl ? (
          <a
            href={c.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)] hover:underline inline-flex items-center gap-1 font-mono truncate max-w-[200px]"
          >
            <span>{c.websiteUrl.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
          </a>
        ) : (
          <span className="text-[12px] text-[var(--muted)]">—</span>
        ),
    },
    {
      id: 'reports',
      header: 'Reports',
      sortKey: 'reports',
      align: 'right',
      accessor: (c) => <span className="font-mono tabular-nums">{c.reportCount}</span>,
    },
    {
      id: 'last_report',
      header: 'Last report',
      sortKey: 'last_report',
      accessor: (c) => (
        <span className="text-[12px] font-mono text-[var(--muted)]">
          {c.latestReport ? c.latestReport.reportMonth : 'None'}
        </span>
      ),
    },
  ]

  // Bulk Actions
  const bulkActions: BulkAction<ClientWithReportCount>[] = [
    {
      label: 'Generate Reports for Selected',
      icon: FileSpreadsheet,
      variant: 'accent',
      onClick: (selectedItems, clearSelection) => {
        if (selectedItems.length === 1) {
          navigate({
            to: '/admin/reports/new',
            search: { clientId: selectedItems[0].id },
          })
        } else {
          // Batch generate redirect / modal
          navigate({
            to: '/admin/reports/new',
            search: { clientId: selectedItems[0].id },
          })
        }
        clearSelection()
      },
    },
  ]

  return (
    <AdminShell
      activeTab="agencies"
      title={agencyDisplayName}
      description="Agency portfolio, assigned staff accounts, and client report history."
      userRole={currentAdmin?.role}
      userEmail={currentAdmin?.email}
      userName={currentAdmin?.name}
      breadcrumb={{
        agency: { id: partner.id, name: agencyDisplayName },
        client: null,
      }}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/workspace"
            search={{ partnerId: partner.id, tab: 'landing-pages' }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Agency Workspace</span>
          </Link>
          <Link
            to="/admin/agencies"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Agencies</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Suspended Agency Alert Banner */}
        {isSuspended && (
          <div className="p-3.5 rounded-[8px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-800 dark:text-rose-200 text-[12px]">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">This agency account is currently suspended / inactive</p>
              <p className="text-rose-600 dark:text-rose-300">
                Agency login and staff member access are disabled until reactivated.
              </p>
            </div>
          </div>
        )}

        {/* Agency Profile Header Card */}
        <div className="p-4 sm:p-5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center font-bold text-sm shrink-0">
                {agencyDisplayName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[16px] font-semibold text-[var(--ink)]">
                    {agencyDisplayName}
                  </h2>
                  {partner.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Suspended</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] font-mono">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{partner.email}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {formatDate(partner.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Inline Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[var(--line)] text-[12px] text-[var(--muted)]">
            <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{counts.clientCount}</strong> clients</span>
            <span className="opacity-40">·</span>
            <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{counts.staffCount}</strong> team staff</span>
            <span className="opacity-40">·</span>
            <span><strong className="text-[var(--accent)] font-semibold tabular-nums">{counts.reportsThisMonthCount}</strong> reports this month</span>
            <span className="opacity-40">·</span>
            <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{counts.totalReportsCount}</strong> total reports</span>
          </div>
        </div>

        {/* SECTION 1: AGENCY CLIENTS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--muted)]" />
              <h3 className="text-[14px] font-semibold text-[var(--ink)]">Agency Clients</h3>
              <span className="px-1.5 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                {clients.length}
              </span>
            </div>
          </div>

          <DataTable
            data={clients}
            columns={clientColumns}
            keyExtractor={(c) => c.id}
            bulkActions={bulkActions}
            emptyMessage="This agency does not manage any clients currently."
            rowActions={(client) => (
              <div className="flex items-center gap-1">
                <Link
                  to="/admin/reports/new"
                  search={{ clientId: client.id }}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Generate Report"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/admin/clients/$clientId"
                  params={{ clientId: client.id }}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Open Client Workspace"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          />
        </div>

        {/* SECTION 2: AGENCY STAFF TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[var(--muted)]" />
              <h3 className="text-[14px] font-semibold text-[var(--ink)]">Agency Staff</h3>
              <span className="px-1.5 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                {staff.length}
              </span>
            </div>
          </div>

          <DataTable
            data={staff}
            columns={staffColumns}
            keyExtractor={(member) => member.id}
            sort={search.sort}
            order={search.order || 'asc'}
            onSortChange={handleStaffSort}
            emptyMessage="This agency owner has not created any staff accounts yet."
          />
        </div>

        {/* Delete Agency Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[12px] bg-[var(--panel)] border border-[var(--line)] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[6px] bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                    Remove Agency Account?
                  </h3>
                  <p className="text-[12px] text-[var(--muted)]">
                    Are you sure you want to remove this partner agency?
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="p-3 rounded-[6px] bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-[12px] text-rose-700 dark:text-rose-300">
                  {deleteError}
                </div>
              )}

              <div className="p-3.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1.5 text-[12px]">
                <div className="flex justify-between py-0.5 border-b border-[var(--line)]">
                  <span className="text-[var(--muted)]">Agency Name:</span>
                  <span className="font-semibold text-[var(--ink)] font-mono">
                    {agencyDisplayName}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[var(--line)]">
                  <span className="text-[var(--muted)]">Managed Clients:</span>
                  <span className="font-semibold text-[var(--ink)] font-mono">
                    {counts.clientCount} clients
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[var(--muted)]">Staff Accounts:</span>
                  <span className="font-semibold text-[var(--ink)] font-mono">
                    {counts.staffCount} staff
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAgency}
                  disabled={isDeleting}
                  className="h-8 px-3.5 rounded-[6px] bg-[var(--danger)] hover:opacity-90 text-white text-[12px] font-medium transition cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Removing...' : 'Remove Agency'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
