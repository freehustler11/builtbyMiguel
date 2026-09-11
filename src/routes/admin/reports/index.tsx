import { createFileRoute, redirect, useRouter, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  Plus,
  Search,
  ExternalLink,
  Download,
  Trash2,
  Calendar,
  Building2,
  TrendingUp,
  MapPin,
  Eye,
  FileText,
  Filter,
  CheckCircle2,
  PhoneCall,
  Navigation,
  MousePointerClick,
  Users,
  Edit3,
  Award,
  Share2,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Copy,
} from 'lucide-react'
import { AdminShell } from '../../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { ConfirmModal } from '../../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { DataTable, type ColumnDef, type BulkAction } from '../../../components/ui/DataTable'
import { getReportsServerFn, deleteReportServerFn, type ReportWithClient } from '../../../server/reports'
import { getClientsServerFn } from '../../../server/clients'
import { getPartnersServerFn, type PartnerItem } from '../../../server/partners'
import { ReportsDueTable } from '../../../components/crm/ReportsDueTable'

interface ReportsSearch {
  error?: string
  clientId?: string
  partnerId?: string
  sort?: 'client' | 'period' | 'version' | 'clicks' | 'sessions' | 'calls' | 'created' | 'status'
  order?: 'asc' | 'desc'
  view?: 'due' | 'history'
  month?: number
  year?: number
}

export const Route = createFileRoute('/admin/reports/')({
  validateSearch: (search: Record<string, unknown>): ReportsSearch => {
    const sort = search.sort as ReportsSearch['sort']
    const order = search.order as ReportsSearch['order']
    const view = search.view as ReportsSearch['view']
    const month = typeof search.month === 'number' ? search.month : typeof search.month === 'string' ? parseInt(search.month, 10) : undefined
    const year = typeof search.year === 'number' ? search.year : typeof search.year === 'string' ? parseInt(search.year, 10) : undefined
    return {
      error: typeof search.error === 'string' ? search.error : undefined,
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
      partnerId: typeof search.partnerId === 'string' ? search.partnerId : undefined,
      sort: ['client', 'period', 'version', 'clicks', 'sessions', 'calls', 'created', 'status'].includes(sort || '') ? sort : undefined,
      order: order === 'desc' ? 'desc' : order === 'asc' ? 'asc' : undefined,
      view: view === 'history' || view === 'due' ? view : undefined,
      month: month && month >= 1 && month <= 12 ? month : undefined,
      year: year && year >= 2000 && year <= 2100 ? year : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    return { auth }
  },
  loaderDeps: ({ search }) => ({
    sort: search.sort,
    order: search.order,
    clientId: search.clientId,
    partnerId: search.partnerId,
  }),
  loader: async ({ deps, context }) => {
    const [{ reports }, { clients }, partnersRes] = await Promise.all([
      getReportsServerFn({
        data: {
          clientId: deps.clientId,
          partnerId: deps.partnerId,
          sort: deps.sort,
          order: deps.order,
        },
      }),
      getClientsServerFn(),
      getPartnersServerFn().catch(() => ({ partners: [] })),
    ])
    return {
      reports,
      clients,
      partners: (partnersRes?.partners || []) as PartnerItem[],
      auth: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Performance Reports | Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminReportsListPage,
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

function AdminReportsListPage() {
  const router = useRouter()
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const { reports, clients, partners, auth } = Route.useLoaderData()

  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
  const selectedPartnerId = isSuperadmin ? search.partnerId : undefined
  const showAgenciesOverview = isSuperadmin && !selectedPartnerId

  const activeAgency = selectedPartnerId
    ? partners.find((p) => p.id === selectedPartnerId)
    : null

  const now = new Date()
  const currentMonth = search.month || (now.getUTCMonth() + 1)
  const currentYear = search.year || now.getUTCFullYear()
  const activeView: 'due' | 'history' = search.view || 'due'

  const [agencySearchQuery, setAgencySearchQuery] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string>(search.clientId || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [reportToDelete, setReportToDelete] = useState<ReportWithClient | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleViewChange = (view: 'due' | 'history') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        view,
      }),
    })
  }

  const handleMonthChange = (month: number, year: number) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        month,
        year,
      }),
    })
  }

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  useEffect(() => {
    if (search.error === 'access_denied') {
      addToast('error', 'Access Denied', 'You do not have permission to edit or view that report.')
    }
  }, [search.error])

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSortChange = (sortKey: string, order: 'asc' | 'desc') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        sort: sortKey,
        order,
      }),
    })
  }

  // Scoped clients for the active partner
  const scopedClients = useMemo(() => {
    if (!isSuperadmin || !selectedPartnerId) return clients
    if (selectedPartnerId === 'unassigned') return clients.filter((c) => !c.partnerId)
    return clients.filter((c) => c.partnerId === selectedPartnerId)
  }, [clients, isSuperadmin, selectedPartnerId])

  // Scoped reports for the active partner
  const scopedReports = useMemo(() => {
    if (!isSuperadmin || !selectedPartnerId) return reports
    const clientIds = new Set(scopedClients.map((c) => c.id))
    return reports.filter((r) => r.clientId ? clientIds.has(r.clientId) : false)
  }, [reports, scopedClients, isSuperadmin, selectedPartnerId])

  const filteredReports = useMemo(() => {
    return scopedReports.filter((r) => {
      const matchesClient = selectedClientId === 'all' || r.clientId === selectedClientId
      const matchesSearch =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.clientBusinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reportMonth.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesClient && matchesSearch
    })
  }, [scopedReports, selectedClientId, searchQuery])

  // Filter agencies for agency overview
  const filteredPartners = useMemo(() => {
    if (!agencySearchQuery.trim()) return partners
    const q = agencySearchQuery.toLowerCase()
    return partners.filter((p) => (p.name || '').toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
  }, [partners, agencySearchQuery])

  // Compute reports count per partner
  const partnerReportCounts = useMemo(() => {
    const map: Record<string, number> = {}
    const clientPartnerMap: Record<string, string> = {}
    for (const c of clients) {
      if (c.partnerId) clientPartnerMap[c.id] = c.partnerId
    }
    for (const r of reports) {
      if (r.clientId) {
        const pId = clientPartnerMap[r.clientId]
        if (pId) {
          map[pId] = (map[pId] || 0) + 1
        }
      }
    }
    return map
  }, [clients, reports])

  const handleDeleteReport = async () => {
    if (!reportToDelete) return
    try {
      setIsDeleting(true)
      await deleteReportServerFn({ data: { id: reportToDelete.id } })
      addToast('success', 'Report Deleted', `Report "${reportToDelete.title}" removed.`)
      setReportToDelete(null)
      await router.invalidate()
    } catch (err: any) {
      addToast('error', 'Error Deleting', err?.message || 'Failed to delete report')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyShareLink = (report: ReportWithClient) => {
    if (!report.shareToken) return
    const url = `${window.location.origin}/reports/share/${report.shareToken}`
    navigator.clipboard.writeText(url)
    addToast('success', 'Link Copied', 'Public share link copied to clipboard.')
  }

  // Column definitions for reports table
  const reportColumns: ColumnDef<ReportWithClient>[] = [
    {
      id: 'client',
      header: 'Client / Report',
      sortKey: 'client',
      accessor: (report) => (
        <div className="flex items-center gap-2.5">
          {report.clientLogoUrl ? (
            <img
              src={report.clientLogoUrl}
              alt={report.clientBusinessName}
              className="w-5 h-5 rounded-[4px] object-contain shrink-0 border border-[var(--line)]"
            />
          ) : (
            <div
              className="w-5 h-5 rounded-[4px] text-white flex items-center justify-center font-bold text-[10px] shrink-0"
              style={{ backgroundColor: report.clientPrimaryColor || '#2563eb' }}
            >
              {(report.clientBusinessName || report.title || 'RP').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <Link
              to="/admin/reports/$id"
              params={{ id: report.id }}
              className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] transition truncate"
            >
              {report.clientBusinessName || 'Archived client'}
            </Link>
            <span className="text-[11px] text-[var(--muted)] truncate">
              {report.title}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'period',
      header: 'Period',
      sortKey: 'period',
      accessor: (report) => (
        <span className="font-mono text-[12px] text-[var(--ink)]">
          {report.reportMonth}
        </span>
      ),
    },
    {
      id: 'version',
      header: 'Version',
      sortKey: 'version',
      accessor: (report) => (
        <span className="font-mono text-[12px] text-[var(--muted)] tabular-nums">
          v{report.version || 1}
        </span>
      ),
    },
    {
      id: 'clicks',
      header: 'Clicks',
      sortKey: 'clicks',
      align: 'right',
      accessor: (report) => (
        <span className="font-mono tabular-nums text-[13px]">
          {(report.gscClicks || 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: 'sessions',
      header: 'Users',
      sortKey: 'sessions',
      align: 'right',
      accessor: (report) => (
        <span className="font-mono tabular-nums text-[13px]">
          {(report.gaUsers || 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: 'calls',
      header: 'Calls',
      sortKey: 'calls',
      align: 'right',
      accessor: (report) => (
        <span className="font-mono tabular-nums text-[13px]">
          {(report.gbpCalls || 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Share',
      sortKey: 'status',
      accessor: (report) => {
        if (report.shareRevokedAt) {
          return (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
              Revoked
            </span>
          )
        }
        if (report.shareToken) {
          return (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Public
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-[var(--line)]/50 text-[var(--muted)]">
            Private
          </span>
        )
      },
    },
    {
      id: 'created',
      header: 'Created',
      sortKey: 'created',
      accessor: (report) => (
        <span className="text-[12px] font-mono tabular-nums text-[var(--muted)]">
          {formatDate(report.createdAt)}
        </span>
      ),
    },
  ]

  // Column definitions for agency overview table
  const agencyColumns: ColumnDef<PartnerItem>[] = [
    {
      id: 'agency',
      header: 'Partner agency',
      sortKey: 'name',
      accessor: (partner) => (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
            {(partner.name || partner.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              to="/admin/reports"
              search={{ partnerId: partner.id }}
              className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] transition truncate"
            >
              {partner.name || partner.email}
            </Link>
            <span className="text-[11px] text-[var(--muted)] font-mono truncate">
              {partner.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'clients',
      header: 'Clients',
      sortKey: 'clients',
      align: 'right',
      accessor: (partner) => (
        <span className="font-mono tabular-nums text-[13px]">{partner.clientCount}</span>
      ),
    },
    {
      id: 'reports',
      header: 'Total reports',
      align: 'right',
      accessor: (partner) => (
        <span className="font-mono tabular-nums text-[13px]">{partnerReportCounts[partner.id] || 0}</span>
      ),
    },
  ]

  return (
    <AdminShell
      activeTab="reports"
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
      month={currentMonth}
      year={currentYear}
      onMonthChange={handleMonthChange}
      title={
        activeAgency
          ? `${activeAgency.name || activeAgency.email} reports`
          : 'Client performance reports'
      }
      description={
        showAgenciesOverview
          ? 'Select an agency below to view its client reports, or generate reports for any client.'
          : 'Create and generate professional monthly reports covering Google Business Profile, Search Console, and GA4 with client branding.'
      }
      actions={
        <Link
          to="/admin/reports/new"
          className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create new report</span>
        </Link>
      }
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-4">
        {/* Superadmin Agency-First Overview Mode */}
        {showAgenciesOverview ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
              <div className="relative flex-1 min-w-[240px] max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={agencySearchQuery}
                  onChange={(e) => setAgencySearchQuery(e.target.value)}
                  placeholder="Search partner agencies..."
                  className="w-full h-8 pl-9 pr-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <span className="text-[12px] text-[var(--muted)]">
                Showing <strong className="text-[var(--ink)] font-medium tabular-nums">{filteredPartners.length}</strong> of <strong className="text-[var(--ink)] font-medium tabular-nums">{partners.length}</strong> agencies
              </span>
            </div>

            {/* Agencies Table */}
            <DataTable<PartnerItem>
              data={filteredPartners}
              columns={agencyColumns}
              keyExtractor={(p) => p.id}
              rowActions={(partner) => (
                <div className="flex items-center justify-end">
                  <Link
                    to="/admin/reports"
                    search={{ partnerId: partner.id }}
                    className="h-7 inline-flex items-center gap-1 px-2.5 rounded-[4px] text-[12px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  >
                    <span>View reports</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </Link>
                </div>
              )}
            />
          </div>
        ) : (
          <>
            {/* Superadmin Back Breadcrumb & Agency Switcher */}
            {isSuperadmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
                <div className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
                  <Link
                    to="/admin/reports"
                    search={{}}
                    className="hover:text-[var(--ink)] transition flex items-center gap-1 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All agencies</span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--line)]" />
                  <span className="font-medium text-[var(--ink)]">
                    {activeAgency ? (activeAgency.name || activeAgency.email) : 'Reports'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[var(--muted)] hidden sm:inline">Switch agency:</span>
                  <select
                    value={selectedPartnerId || ''}
                    onChange={(e) => {
                      router.navigate({
                        to: '/admin/reports',
                        search: { partnerId: e.target.value || undefined },
                      })
                    }}
                    aria-label="Switch partner agency"
                    className="h-8 px-2.5 rounded-[6px] text-[13px] font-medium bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="">All agencies overview</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.email} ({p.clientCount} clients)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* View Switcher: Reports Due vs Generated Reports */}
            <div className="flex items-center p-0.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] w-fit">
              <button
                type="button"
                onClick={() => handleViewChange('due')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  activeView === 'due'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 ${activeView === 'due' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Reports due</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('history')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  activeView === 'history'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${activeView === 'history' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Generated reports ({scopedReports.length})</span>
              </button>
            </div>

            {activeView === 'due' ? (
              <ReportsDueTable
                partnerId={selectedPartnerId}
                initialMonth={currentMonth}
                initialYear={currentYear}
              />
            ) : (
              <div className="space-y-4">
                {/* Filters & Search Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px] max-w-sm">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search reports or clients..."
                        className="w-full h-8 pl-9 pr-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    </div>

                    {/* Client Filter Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                      <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        aria-label="Filter by client"
                        className="h-8 px-2.5 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      >
                        <option value="all">All clients ({scopedClients.length})</option>
                        {scopedClients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.businessName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[12px] text-[var(--muted)] shrink-0">
                    <span>
                      Showing <strong className="text-[var(--ink)] font-medium tabular-nums">{filteredReports.length}</strong> of <strong className="text-[var(--ink)] font-medium tabular-nums">{scopedReports.length}</strong> reports
                    </span>
                  </div>
                </div>

                {/* Reports DataTable */}
                {filteredReports.length === 0 ? (
                  <div className="p-12 text-center rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--panel)] space-y-4">
                    <div className="p-3 rounded-[6px] bg-[var(--canvas)] text-[var(--muted)] inline-block">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[15px] font-medium text-[var(--ink)]">
                        {searchQuery || selectedClientId !== 'all' ? 'No reports matched your filters' : 'No reports generated yet'}
                      </h3>
                      <p className="text-[13px] text-[var(--muted)] max-w-md mx-auto">
                        {searchQuery || selectedClientId !== 'all'
                          ? 'Try clearing your search query or client filter.'
                          : 'Start by creating your first branded performance report for an existing client.'}
                      </p>
                    </div>
                    {reports.length === 0 && (
                      <Link
                        to="/admin/reports/new"
                        className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create new report</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <DataTable<ReportWithClient>
                    data={filteredReports}
                    columns={reportColumns}
                    keyExtractor={(r) => r.id}
                    sortKey={search.sort}
                    sortOrder={search.order}
                    onSort={handleSortChange}
                    rowActions={(report) => (
                      <div className="flex items-center justify-end gap-1">
                        {report.shareToken && !report.shareRevokedAt && (
                          <button
                            type="button"
                            onClick={() => handleCopyShareLink(report)}
                            title="Copy public share link"
                            className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Link
                          to="/admin/reports/new"
                          search={{ editId: report.id, clientId: report.clientId || undefined }}
                          title="Edit report"
                          className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--line)]/50 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to="/admin/reports/$id"
                          params={{ id: report.id }}
                          title="View & download report"
                          className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setReportToDelete(report)}
                          title="Delete report"
                          className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reportToDelete)}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDeleteReport}
        title="Delete Monthly Report?"
        description={
          reportToDelete ? (
            <span>
              Are you sure you want to delete report <strong>"{reportToDelete.title}"</strong> for{' '}
              <strong>{reportToDelete.clientBusinessName}</strong>?
            </span>
          ) : null
        }
        confirmText="Delete Report"
        variant="danger"
        isLoading={isDeleting}
      />
    </AdminShell>
  )
}
