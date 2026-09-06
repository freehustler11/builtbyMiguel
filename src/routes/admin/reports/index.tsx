import { createFileRoute, redirect, useRouter, Link } from '@tanstack/react-router'
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
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { AdminNav } from '../../../components/AdminNav'
import { ConfirmModal } from '../../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { getReportsServerFn, deleteReportServerFn, type ReportWithClient } from '../../../server/reports'
import { getClientsServerFn } from '../../../server/clients'
import { getPartnersServerFn, type PartnerItem } from '../../../server/partners'

interface ReportsSearch {
  error?: string
  clientId?: string
  partnerId?: string
}

export const Route = createFileRoute('/admin/reports/')({
  validateSearch: (search: Record<string, unknown>): ReportsSearch => {
    return {
      error: typeof search.error === 'string' ? search.error : undefined,
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
      partnerId: typeof search.partnerId === 'string' ? search.partnerId : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    return { auth }
  },
  loader: async ({ context }) => {
    const [{ reports }, { clients }, partnersRes] = await Promise.all([
      getReportsServerFn(),
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
  const search = Route.useSearch()
  const { reports, clients, partners, auth } = Route.useLoaderData()

  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
  const selectedPartnerId = isSuperadmin ? search.partnerId : undefined
  const showAgenciesOverview = isSuperadmin && !selectedPartnerId

  const activeAgency = selectedPartnerId
    ? partners.find((p) => p.id === selectedPartnerId)
    : null

  const [agencySearchQuery, setAgencySearchQuery] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [reportToDelete, setReportToDelete] = useState<ReportWithClient | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <ConfirmModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDeleteReport}
        title="Delete Report"
        description={`Are you sure you want to delete the report "${reportToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Navigation */}
        <AdminNav
          activeTab="reports"
          userRole={auth?.role}
          title={
            showAgenciesOverview
              ? 'Agency Performance Reports'
              : activeAgency
              ? `${activeAgency.name || activeAgency.email} · Reports`
              : 'Client Performance Reports'
          }
          description={
            showAgenciesOverview
              ? 'Select an agency below to view its client reports, or generate reports for any client.'
              : 'Create and generate professional monthly reports covering Google Business Profile, Search Console, and GA4 with client branding.'
          }
          actions={
            <Link
              to="/admin/reports/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Report</span>
            </Link>
          }
        />

        {/* Superadmin Agency-First Overview Mode */}
        {showAgenciesOverview ? (
          <div className="space-y-6">
            {/* Search & Agency Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-500" />
                  <span>Partner Agencies ({partners.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select an agency below to access its individual client performance reports.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={agencySearchQuery}
                  onChange={(e) => setAgencySearchQuery(e.target.value)}
                  placeholder="Search partner agencies..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Agencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPartners.map((partner) => {
                const reportCount = partnerReportCounts[partner.id] || 0
                return (
                  <div
                    key={partner.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center font-bold text-base shadow-xs">
                          {(partner.name || partner.email).substring(0, 2).toUpperCase()}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <Users className="w-3 h-3" />
                          <span>{partner.clientCount} clients</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition truncate">
                          {partner.name || partner.email}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                          {partner.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="text-xs font-mono text-slate-400">
                        <span>Total Reports: </span>
                        <strong className="text-slate-900 dark:text-white">{reportCount}</strong>
                      </div>

                      <Link
                        to="/admin/reports"
                        search={{ partnerId: partner.id }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60 transition cursor-pointer"
                      >
                        <span>View Reports</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Superadmin Back Breadcrumb & Agency Switcher */}
            {isSuperadmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <Link
                    to="/admin/reports"
                    search={{}}
                    className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Agencies</span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeAgency ? (activeAgency.name || activeAgency.email) : 'Reports'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">Switch Agency:</span>
                  <select
                    value={selectedPartnerId || ''}
                    onChange={(e) => {
                      router.navigate({
                        to: '/admin/reports',
                        search: { partnerId: e.target.value || undefined },
                      })
                    }}
                    className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Agencies Overview</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.email} ({p.clientCount} clients)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Filters & Search Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px] max-w-sm">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reports or clients..."
                    className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Client Filter Dropdown */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="px-3 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">All Clients ({scopedClients.length})</option>
                    {scopedClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                <span>
                  Total Reports: <strong className="text-slate-900 dark:text-white">{scopedReports.length}</strong>
                </span>
                <span>•</span>
                <span>
                  Showing: <strong className="text-rose-600 dark:text-rose-400">{filteredReports.length}</strong>
                </span>
              </div>
            </div>
          </>
        )}

        {/* Reports Listing (Only when not showing agency overview) */}
        {!showAgenciesOverview && (filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 inline-block">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {searchQuery || selectedClientId !== 'all' ? 'No reports matched your filters' : 'No reports generated yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {searchQuery || selectedClientId !== 'all'
                  ? 'Try clearing your search query or client filter.'
                  : 'Start by creating your first branded performance report for an existing client.'}
              </p>
            </div>
            {reports.length === 0 && (
              <Link
                to="/admin/reports/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Report</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => {
              const primary = report.clientPrimaryColor || '#2563eb'

              return (
                <div
                  key={report.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Client Header & Report Month */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {report.clientLogoUrl ? (
                          <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white p-1 flex items-center justify-center shrink-0">
                            <img
                              src={report.clientLogoUrl}
                              alt={report.clientBusinessName}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-2xs shrink-0"
                            style={{ backgroundColor: primary }}
                          >
                            {(report.clientBusinessName || report.title || 'RP').substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block truncate">
                            {report.clientBusinessName || 'Archived / Unassigned Client'}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {report.title}
                          </h3>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => setReportToDelete(report)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0"
                        title="Delete Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Report Month Badge & Created Date & White-label indicator */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                        <Calendar className="w-3 h-3 text-rose-500" />
                        <span>{report.reportMonth}</span>
                      </span>

                      {/* Version badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                        <span>v{report.version || 1}</span>
                        {(report as any).versionCount > 1 && (
                          <span className="text-slate-400">• {(report as any).versionCount} versions</span>
                        )}
                      </span>

                      {report.clientIsWhiteLabel && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Award className="w-2.5 h-2.5" />
                          <span>White-Label</span>
                        </span>
                      )}

                      {/* Public share link active indicator */}
                      {report.shareToken && !report.shareRevokedAt && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Share2 className="w-2.5 h-2.5" />
                          <span>Public Link Active</span>
                        </span>
                      )}

                      {/* Revoked link indicator */}
                      {report.shareRevokedAt && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <Share2 className="w-2.5 h-2.5" />
                          <span>Link Revoked</span>
                        </span>
                      )}

                      <span className="text-slate-400 text-[11px]">
                        Created {formatDate(report.createdAt)}
                      </span>

                      {report.creatorNameOrEmail && (
                        <span
                          className="text-slate-400 text-[11px] truncate max-w-[220px]"
                          title={`Created by ${report.creatorNameOrEmail}`}
                        >
                          • Created by: {report.creatorNameOrEmail}
                        </span>
                      )}
                    </div>

                    {/* Metric Highlights Pill Cards */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                      {/* GBP Calls */}
                      <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-0.5">
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase truncate flex items-center justify-center gap-1">
                          <PhoneCall className="w-2.5 h-2.5" />
                          <span>Calls</span>
                        </div>
                        <div className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                          {report.gbpCalls || 0}
                        </div>
                      </div>

                      {/* GSC Clicks */}
                      <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase truncate flex items-center justify-center gap-1">
                          <MousePointerClick className="w-2.5 h-2.5" />
                          <span>Clicks</span>
                        </div>
                        <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                          {report.gscClicks || 0}
                        </div>
                      </div>

                      {/* GA4 Users */}
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

                  {/* Bottom Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to="/admin/reports/new"
                      search={{ editId: report.id, clientId: report.clientId || undefined }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      to="/admin/reports/$id"
                      params={{ id: report.id }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-xs transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Download</span>
                      <Download className="w-3.5 h-3.5 text-white/80 ml-0.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
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
    </div>
  )
}
