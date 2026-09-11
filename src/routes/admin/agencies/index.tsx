import { createFileRoute, redirect, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import {
  Building2,
  Users,
  BarChart3,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Mail,
  Briefcase,
  ExternalLink,
  Trash2,
  Layers,
} from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { ConfirmModal } from '../../../components/ConfirmModal'
import { DataTable, type ColumnDef, type BulkAction } from '../../../components/ui/DataTable'
import {
  getPartnersServerFn,
  createPartnerServerFn,
  togglePartnerActiveServerFn,
  deletePartnerServerFn,
  type PartnerItem,
} from '../../../server/partners'
import {
  getClientsServerFn,
  type ClientWithReportCount,
} from '../../../server/clients'

export interface AgenciesSearch {
  sort?: 'name' | 'email' | 'status' | 'staff' | 'clients' | 'reports'
  order?: 'asc' | 'desc'
}

export const Route = createFileRoute('/admin/agencies/')({
  validateSearch: (search: Record<string, unknown>): AgenciesSearch => {
    const sort = search.sort as AgenciesSearch['sort']
    const order = search.order as AgenciesSearch['order']
    return {
      sort: ['name', 'email', 'status', 'staff', 'clients', 'reports'].includes(sort || '') ? sort : undefined,
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
  loader: async ({ deps, context }) => {
    const [partnersRes, clientsRes] = await Promise.all([
      getPartnersServerFn({ data: { sort: deps.sort, order: deps.order } }),
      getClientsServerFn({ data: { sort: deps.sort, order: deps.order } }),
    ])
    return {
      partners: partnersRes.partners || [],
      unassignedClientCount: partnersRes.unassignedClientCount || 0,
      unassignedReportsThisMonthCount: partnersRes.unassignedReportsThisMonthCount || 0,
      allClients: clientsRes.clients || [],
      currentAdmin: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Agency Partners | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminAgenciesPage,
})

function AdminAgenciesPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    partners: initialPartners,
    unassignedClientCount,
    unassignedReportsThisMonthCount,
    allClients,
    currentAdmin,
  } = Route.useLoaderData()

  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'agencies' | 'all_clients'>('agencies')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [partnerToDelete, setPartnerToDelete] = useState<PartnerItem | null>(null)

  useEffect(() => {
    setPartners(initialPartners)
  }, [initialPartners])

  const handleHeaderSort = (sortKey: string, order: 'asc' | 'desc') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        sort: sortKey,
        order,
      }),
    })
  }

  // Create Partner Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newPartnerName, setNewPartnerName] = useState('')
  const [newPartnerEmail, setNewPartnerEmail] = useState('')
  const [newPartnerPassword, setNewPartnerPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  // Filter partners
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners
    const q = searchQuery.toLowerCase()
    return partners.filter((p) => {
      const displayName = (p.name || p.email).toLowerCase()
      const email = p.email.toLowerCase()
      return displayName.includes(q) || email.includes(q)
    })
  }, [partners, searchQuery])

  // Filter all clients
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return allClients
    const q = searchQuery.toLowerCase()
    return allClients.filter((c) => {
      const bName = (c.businessName || '').toLowerCase()
      const cName = (c.name || '').toLowerCase()
      const pName = (c.partner?.name || c.partner?.email || '').toLowerCase()
      return bName.includes(q) || cName.includes(q) || pName.includes(q)
    })
  }, [allClients, searchQuery])

  const totalAssignedClients = useMemo(() => {
    return partners.reduce((sum, p) => sum + p.clientCount, 0)
  }, [partners])

  const totalReportsThisMonth = useMemo(() => {
    return partners.reduce((sum, p) => sum + p.reportsThisMonthCount, 0) + unassignedReportsThisMonthCount
  }, [partners, unassignedReportsThisMonthCount])

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPartnerName.trim() || !newPartnerEmail.trim() || !newPartnerPassword.trim()) {
      addToast('error', 'Validation Error', 'All fields are required.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createPartnerServerFn({
        data: {
          name: newPartnerName,
          email: newPartnerEmail,
          password: newPartnerPassword,
          isActive: true,
        },
      })
      if (res?.partner) {
        setPartners((prev) => [
          ...prev,
          {
            id: res.partner.id,
            name: res.partner.name,
            email: res.partner.email,
            isActive: res.partner.isActive,
            createdAt: res.partner.createdAt,
            clientCount: 0,
            staffCount: 0,
            reportsThisMonthCount: 0,
          },
        ])
        addToast('success', 'Agency Created', `Partner agency "${newPartnerName}" created successfully.`)
        setIsCreateModalOpen(false)
        setNewPartnerName('')
        setNewPartnerEmail('')
        setNewPartnerPassword('')
      }
    } catch (err: any) {
      addToast('error', 'Creation Failed', err.message || 'Failed to create partner agency.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (partnerId: string, currentActive: boolean) => {
    setTogglingId(partnerId)
    try {
      const res = await togglePartnerActiveServerFn({
        data: { id: partnerId, isActive: !currentActive },
      })
      setPartners((prev) =>
        prev.map((p) => (p.id === partnerId ? { ...p, isActive: res.partner.isActive } : p))
      )
      addToast(
        'info',
        res.partner.isActive ? 'Agency Activated' : 'Agency Suspended',
        `Agency status updated.`
      )
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message || 'Failed to toggle agency status.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeletePartner = async () => {
    if (!partnerToDelete) return
    setIsSubmitting(true)
    try {
      const res = await deletePartnerServerFn({
        data: { partnerId: partnerToDelete.id },
      })
      if (res.success) {
        addToast(
          'success',
          'Agency Removed',
          `Successfully removed ${partnerToDelete.name || partnerToDelete.email}. ${res.unassignedClientsCount} clients moved to Unassigned.`
        )
        setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id))
        setPartnerToDelete(null)
        await router.invalidate()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove agency.'
      addToast('error', 'Removal Failed', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Agency Columns Definition
  const agencyColumns: ColumnDef<PartnerItem>[] = [
    {
      id: 'name',
      header: 'Agency name',
      sortKey: 'name',
      accessor: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
            {(p.name || p.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              to="/admin/agencies/$partnerId"
              params={{ partnerId: p.id }}
              className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] transition truncate"
            >
              {p.name || p.email}
            </Link>
            {p.name && (
              <span className="text-[11px] text-[var(--muted)] truncate font-mono">
                {p.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'staff',
      header: 'Staff',
      sortKey: 'staff',
      align: 'right',
      accessor: (p) => <span className="font-mono tabular-nums">{p.staffCount}</span>,
    },
    {
      id: 'clients',
      header: 'Clients',
      sortKey: 'clients',
      align: 'right',
      accessor: (p) => <span className="font-mono tabular-nums">{p.clientCount}</span>,
    },
    {
      id: 'reports',
      header: 'Reports this month',
      sortKey: 'reports',
      align: 'right',
      accessor: (p) => <span className="font-mono tabular-nums">{p.reportsThisMonthCount}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortKey: 'status',
      accessor: (p) => (
        <button
          type="button"
          disabled={togglingId === p.id}
          onClick={() => handleToggleActive(p.id, p.isActive)}
          className="cursor-pointer group/status"
          title="Click to toggle status"
        >
          {p.isActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Suspended</span>
            </span>
          )}
        </button>
      ),
    },
  ]

  // All Clients Columns Definition
  const clientColumns: ColumnDef<ClientWithReportCount>[] = [
    {
      id: 'client',
      header: 'Client',
      sortKey: 'name',
      accessor: (c) => (
        <div className="flex items-center gap-2.5">
          {c.logoUrl ? (
            <img
              src={c.logoUrl}
              alt={c.businessName}
              className="w-5 h-5 rounded-[4px] object-contain shrink-0 border border-[var(--line)]"
            />
          ) : (
            <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
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
      id: 'agency',
      header: 'Assigned agency',
      sortKey: 'agency',
      accessor: (c) => (
        <span className="text-[12px] text-[var(--muted)]">
          {c.partner ? c.partner.name || c.partner.email : 'Unassigned'}
        </span>
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

  return (
    <AdminShell
      activeTab="agencies"
      title="Partner agencies"
      description="Manage tenant partner agencies, client distributions, staff accounts, and monthly reporting velocity."
      userRole={currentAdmin?.role}
      userEmail={currentAdmin?.email}
      userName={currentAdmin?.name}
      breadcrumb={{
        agency: { id: null, name: 'All Agencies' },
        client: null,
      }}
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add partner agency</span>
          </button>
        </div>
      }
    >
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="space-y-6">
        {/* Top Aggregate Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-1">
            <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
              <span>Total agencies</span>
              <Building2 className="w-4 h-4 text-[var(--muted)]" />
            </div>
            <div className="text-[28px] font-semibold text-[var(--ink)] tabular-nums">
              {partners.length}
            </div>
            <span className="text-[11px] text-[var(--muted)]">registered partners</span>
          </div>

          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-1">
            <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
              <span>Total agency clients</span>
              <Users className="w-4 h-4 text-[var(--muted)]" />
            </div>
            <div className="text-[28px] font-semibold text-[var(--ink)] tabular-nums">
              {totalAssignedClients}
            </div>
            <span className="text-[11px] text-[var(--muted)]">assigned client portfolios</span>
          </div>

          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-1">
            <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
              <span>Unassigned clients</span>
              <Briefcase className="w-4 h-4 text-[var(--muted)]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[28px] font-semibold text-[var(--ink)] tabular-nums">
                {unassignedClientCount}
              </span>
              <Link
                to="/admin/agencies/unassigned"
                className="text-[12px] font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <span className="text-[11px] text-[var(--muted)]">not allocated to an agency</span>
          </div>

          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-1">
            <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
              <span>Reports this month</span>
              <BarChart3 className="w-4 h-4 text-[var(--muted)]" />
            </div>
            <div className="text-[28px] font-semibold text-[var(--ink)] tabular-nums">
              {totalReportsThisMonth}
            </div>
            <span className="text-[11px] text-[var(--muted)]">UTC reporting period</span>
          </div>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex p-0.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('agencies')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-[6px] text-[12px] font-medium transition cursor-pointer ${
                viewMode === 'agencies'
                  ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Partner Agencies ({partners.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all_clients')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-[6px] text-[12px] font-medium transition cursor-pointer ${
                viewMode === 'all_clients'
                  ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              All Clients ({allClients.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={viewMode === 'agencies' ? 'Search agencies or emails...' : 'Search clients or agencies...'}
              className="w-full h-8 pl-9 pr-8 rounded-[6px] text-[12px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Agencies Table */}
        {viewMode === 'agencies' ? (
          <DataTable
            data={filteredPartners}
            columns={agencyColumns}
            keyExtractor={(p) => p.id}
            sort={search.sort}
            order={search.order || 'asc'}
            onSortChange={handleHeaderSort}
            emptyMessage={searchQuery ? `No partner agencies found matching "${searchQuery}"` : 'No partner agencies registered yet.'}
            rowActions={(partner) => (
              <div className="flex items-center gap-1">
                <Link
                  to="/admin/workspace"
                  search={{ partnerId: partner.id, tab: 'landing-pages' }}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Open Agency Workspace"
                >
                  <Layers className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/admin/agencies/$partnerId"
                  params={{ partnerId: partner.id }}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="View Agency Details"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setPartnerToDelete(partner)}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Delete Agency"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          />
        ) : (
          /* View Mode: All Clients Table */
          <DataTable
            data={filteredClients}
            columns={clientColumns}
            keyExtractor={(c) => c.id}
            sort={search.sort}
            order={search.order || 'asc'}
            onSortChange={handleHeaderSort}
            emptyMessage={searchQuery ? `No clients found matching "${searchQuery}"` : 'No clients found.'}
            rowActions={(client) => (
              <div className="flex items-center gap-1">
                <Link
                  to="/admin/clients/$clientId"
                  params={{ clientId: client.id }}
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Open Client Workspace"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          />
        )}
      </div>

      {/* Delete Partner Modal */}
      <ConfirmModal
        isOpen={Boolean(partnerToDelete)}
        title="Remove Partner Agency"
        message={`Are you sure you want to remove "${partnerToDelete?.name || partnerToDelete?.email}"? All ${partnerToDelete?.clientCount || 0} assigned clients will be moved to the Unassigned clients pool and can be reassigned to another partner agency.`}
        confirmText="Remove Partner Agency"
        variant="danger"
        isLoading={isSubmitting}
        onConfirm={handleDeletePartner}
        onCancel={() => setPartnerToDelete(null)}
      />

      {/* Create Partner Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[12px] bg-[var(--panel)] border border-[var(--line)] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[16px] font-semibold text-[var(--ink)]">Add Partner Agency</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  placeholder="e.g. Apex Growth Agency"
                  className="w-full h-8 px-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                  Owner Email
                </label>
                <input
                  type="email"
                  required
                  value={newPartnerEmail}
                  onChange={(e) => setNewPartnerEmail(e.target.value)}
                  placeholder="e.g. partner@agency.com"
                  className="w-full h-8 px-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  value={newPartnerPassword}
                  onChange={(e) => setNewPartnerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-8 px-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 px-3.5 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Agency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
