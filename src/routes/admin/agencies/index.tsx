import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
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
  Lock,
  Mail,
  User,
  Briefcase,
  ExternalLink,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { AdminNav } from '../../../components/AdminNav'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { ClientCard } from '../../../components/ClientCard'
import {
  getPartnersServerFn,
  createPartnerServerFn,
  togglePartnerActiveServerFn,
  type PartnerItem,
} from '../../../server/partners'
import {
  getClientsServerFn,
  type ClientWithReportCount,
} from '../../../server/clients'

export const Route = createFileRoute('/admin/agencies/')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role !== 'superadmin' && auth.role !== 'admin') {
      throw redirect({ to: '/admin' })
    }
    return { auth }
  },
  loader: async ({ context }) => {
    const [partnersRes, clientsRes] = await Promise.all([
      getPartnersServerFn(),
      getClientsServerFn(),
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

  // Filter all clients (for 1-click reachable client search)
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return allClients
    const q = searchQuery.toLowerCase()
    return allClients.filter((c) => {
      const bName = c.businessName.toLowerCase()
      const cName = c.name.toLowerCase()
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminNav
          activeTab="agencies"
          title="Partner Agencies"
          description="Manage tenant partner agencies, client distributions, staff accounts, and monthly reporting velocity."
          userRole={currentAdmin?.role}
          actions={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Partner Agency</span>
              </button>
            </div>
          }
        />

        {/* Top Aggregate Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Total Agencies</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{partners.length}</span>
              <span className="text-xs text-slate-400 font-mono">registered</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Total Agency Clients</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalAssignedClients}</span>
              <span className="text-xs text-slate-400 font-mono">assigned</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Unassigned Clients</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{unassignedClientCount}</span>
              <Link
                to="/admin/agencies/unassigned"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Reports This Month</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalReportsThisMonth}</span>
              <span className="text-xs text-slate-400 font-mono">UTC period</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('agencies')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'agencies'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Partner Agencies ({partners.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all_clients')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'all_clients'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Clients ({allClients.length})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={viewMode === 'agencies' ? 'Search agencies or emails...' : 'Search clients or agencies...'}
              className="w-full text-xs font-mono pl-9.5 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Agencies Table */}
        {viewMode === 'agencies' ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-6 font-semibold">Agency Name</th>
                    <th className="py-3.5 px-6 font-semibold">Owner Email</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold text-center">Staff</th>
                    <th className="py-3.5 px-6 font-semibold text-center">Clients</th>
                    <th className="py-3.5 px-6 font-semibold text-center">Reports This Month</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {/* Highlighted Unassigned Clients Row */}
                  <tr className="bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/80 dark:hover:bg-amber-950/30 transition group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Unassigned Clients</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                              Direct Superadmin
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            Direct clients not assigned to any partner
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">
                      builtbymiguel.net
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-slate-400 font-mono">
                      —
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                        {unassignedClientCount} clients
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                        {unassignedReportsThisMonthCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/agencies/unassigned"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition"
                      >
                        <span>Manage Unassigned</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>

                  {/* Partner Agencies List */}
                  {filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                        No partner agencies found matching &quot;{searchQuery}&quot;
                      </td>
                    </tr>
                  ) : (
                    filteredPartners.map((partner) => {
                      const agencyDisplayName = partner.name || partner.email
                      const isSuspended = !partner.isActive

                      return (
                        <tr
                          key={partner.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center font-bold text-xs shrink-0">
                                {agencyDisplayName.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to="/admin/agencies/$partnerId"
                                  params={{ partnerId: partner.id }}
                                  className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate block"
                                >
                                  {agencyDisplayName}
                                </Link>
                                {!partner.name && (
                                  <span className="text-[10px] text-slate-400 font-mono italic">
                                    (Name unset · using email)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">
                            {partner.email}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              type="button"
                              disabled={togglingId === partner.id}
                              onClick={() => handleToggleActive(partner.id, partner.isActive)}
                              className="cursor-pointer group/status"
                              title="Click to toggle status"
                            >
                              {partner.isActive ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 group-hover/status:border-emerald-400 transition">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 group-hover/status:border-rose-400 transition">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Suspended</span>
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                                partner.staffCount > 0
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {partner.staffCount}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                                partner.clientCount > 0
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {partner.clientCount} clients
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                                partner.reportsThisMonthCount > 0
                                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/50'
                                  : 'text-slate-400'
                              }`}
                            >
                              {partner.reportsThisMonthCount}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Link
                              to="/admin/agencies/$partnerId"
                              params={{ partnerId: partner.id }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                              <span>View Agency</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode: All Clients (1-step Reachability) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Showing {filteredClients.length} clients across all partner agencies and direct accounts.
              </p>
            </div>
            {filteredClients.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">No clients found</p>
                <p className="text-xs text-slate-500 font-mono">No client matches your search &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    isSuperadmin={true}
                    partnersList={partners}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Create Partner Agency */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Partner Agency</h3>
                    <p className="text-xs text-slate-500 font-mono">Create tenant partner login</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePartner} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Agency Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      placeholder="e.g. Acme Marketing Group"
                      className="w-full text-xs font-mono pl-9.5 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Agency Owner Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={newPartnerEmail}
                      onChange={(e) => setNewPartnerEmail(e.target.value)}
                      placeholder="owner@agency.com"
                      className="w-full text-xs font-mono pl-9.5 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPartnerPassword}
                      onChange={(e) => setNewPartnerPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full text-xs font-mono pl-9.5 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Create Agency</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
