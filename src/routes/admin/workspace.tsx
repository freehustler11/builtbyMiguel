import { createFileRoute, redirect, Link, useRouter } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  Layers,
  FileText,
  Search as SearchIcon,
  CheckSquare,
  Building2,
  Users,
  BarChart3,
  ExternalLink,
  Sparkles,
  Globe,
  ArrowLeft,
  ChevronRight,
  Filter,
  X,
  Search,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { getClientsServerFn } from '../../server/clients'
import { getPartnersServerFn, type PartnerItem } from '../../server/partners'
import { LandingPagesBoard } from '../../components/crm/LandingPagesBoard'
import { ArticlesBoard } from '../../components/crm/ArticlesBoard'
import { KeywordsBoard } from '../../components/crm/KeywordsBoard'
import { TasksBoard } from '../../components/crm/TasksBoard'
import { CitationsBoard } from '../../components/crm/CitationsBoard'
import { MonthlyMetricsForm } from '../../components/crm/MonthlyMetricsForm'

interface WorkspaceSearch {
  tab?: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics'
  partnerId?: string
  client?: string
}

export const Route = createFileRoute('/admin/workspace')({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => {
    const tab = search.tab as WorkspaceSearch['tab']
    return {
      tab: ['landing-pages', 'articles', 'keywords', 'deliverables', 'citations', 'metrics'].includes(tab || '')
        ? tab
        : undefined,
      partnerId: typeof search.partnerId === 'string' ? search.partnerId : undefined,
      client: typeof search.client === 'string' ? search.client : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    return { auth }
  },
  loader: async ({ context }) => {
    const [clientsRes, partnersRes] = await Promise.all([
      getClientsServerFn(),
      getPartnersServerFn().catch(() => ({ partners: [] })),
    ])
    return {
      clients: clientsRes.clients || [],
      partners: partnersRes.partners || [],
      auth: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Agency Workspace | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AgencyWorkspacePage,
})

function AgencyWorkspacePage() {
  const { clients, partners, auth } = Route.useLoaderData()
  const search = Route.useSearch()
  const router = useRouter()
  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

  const activeTab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics' =
    search.tab || 'landing-pages'

  const selectedPartnerId = isSuperadmin ? search.partnerId : undefined
  const showAgenciesOverview = isSuperadmin && !selectedPartnerId
  const selectedClientId = search.client || ''
  const [agencySearchQuery, setAgencySearchQuery] = useState('')

  const activeAgencyObj = selectedPartnerId
    ? partners.find((p) => p.id === selectedPartnerId)
    : null

  // Scoped clients for the selected partner
  const scopedClients = useMemo(() => {
    if (!isSuperadmin || !selectedPartnerId) return clients
    if (selectedPartnerId === 'unassigned') return clients.filter((c) => !c.partnerId)
    return clients.filter((c) => c.partnerId === selectedPartnerId)
  }, [clients, isSuperadmin, selectedPartnerId])

  // Filter partners for directory view
  const filteredPartners = useMemo(() => {
    if (!agencySearchQuery.trim()) return partners
    const q = agencySearchQuery.toLowerCase()
    return partners.filter(
      (p) => (p.name || '').toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    )
  }, [partners, agencySearchQuery])

  const handleTabChange = (tab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics') => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        tab,
        partnerId: selectedPartnerId,
        client: selectedClientId || undefined,
      },
    })
  }

  const handlePartnerChange = (pId: string) => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        tab: activeTab,
        partnerId: pId || undefined,
        client: undefined,
      },
    })
  }

  const handleClientChange = (cId: string) => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        tab: activeTab,
        partnerId: selectedPartnerId,
        client: cId || undefined,
      },
    })
  }

  const activeClientObj = selectedClientId
    ? scopedClients.find((c) => c.id === selectedClientId)
    : null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AdminNav Bar */}
        <AdminNav
          activeTab="workspace"
          title={
            showAgenciesOverview
              ? 'Agency Workspaces'
              : activeAgencyObj
              ? `${activeAgencyObj.name || activeAgencyObj.email} · Workspace`
              : 'Agency Workspace'
          }
          description={
            showAgenciesOverview
              ? 'Select an agency below to access its workspace, deliverable pipelines, citations, and client KPIs.'
              : 'Cross-client deliverable pipeline across all partner accounts. Internal tasks with no assigned client are grouped under Internal.'
          }
          userRole={auth?.role}
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/my-work"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>My Assigned Work</span>
              </Link>
            </div>
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
                  Select an agency below to view its deliverable pipeline, citations, and clients.
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
              {filteredPartners.map((partner) => (
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
                      <span>Managed Clients: </span>
                      <strong className="text-slate-900 dark:text-white">{partner.clientCount}</strong>
                    </div>

                    <Link
                      to="/admin/workspace"
                      search={{ partnerId: partner.id }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60 transition cursor-pointer"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Superadmin Back Breadcrumb & Agency Switcher */}
            {isSuperadmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <Link
                    to="/admin/workspace"
                    search={{}}
                    className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Agencies</span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeAgencyObj ? (activeAgencyObj.name || activeAgencyObj.email) : 'Workspace'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">Switch Agency:</span>
                  <select
                    value={selectedPartnerId || ''}
                    onChange={(e) => handlePartnerChange(e.target.value)}
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

            {/* Aggregate Stats Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Managed Clients</span>
                  <Building2 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {scopedClients.length}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">active client accounts</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Scope Mode</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {activeClientObj
                    ? activeClientObj.businessName || activeClientObj.name
                    : activeAgencyObj
                    ? activeAgencyObj.name || activeAgencyObj.email
                    : 'Agency-Wide Roll-Up'}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeClientObj ? 'scoped to single client' : 'across all client portfolios'}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Quick Jump</span>
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                </div>
                <Link
                  to="/my-work"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>View your personally assigned items</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Client Filter Dropdown */}
            {scopedClients.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter Client:</span>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Agency Clients ({scopedClients.length})</option>
                    {scopedClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName || c.name}
                      </option>
                    ))}
                  </select>
                  {selectedClientId && (
                    <button
                      type="button"
                      onClick={() => handleClientChange('')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Clear filter</span>
                    </button>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {selectedClientId ? (
                    <span>Scoped view for {activeClientObj?.businessName || activeClientObj?.name}</span>
                  ) : (
                    <span>Displaying all {scopedClients.length} clients</span>
                  )}
                </div>
              </div>
            )}

            {/* 6 Tabs Segmented Switcher */}
            <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabChange('landing-pages')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'landing-pages'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Landing Pages</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('articles')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Articles</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('keywords')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'keywords'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SearchIcon className="w-4 h-4 text-purple-500" />
                <span>Keywords</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('deliverables')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'deliverables'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>Deliverables</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('citations')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'citations'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-500" />
                <span>Citations</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('metrics')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'metrics'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-rose-500" />
                <span>Monthly KPIs</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'landing-pages' && (
                <LandingPagesBoard partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}

              {activeTab === 'articles' && (
                <ArticlesBoard partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}

              {activeTab === 'keywords' && (
                <KeywordsBoard partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}

              {activeTab === 'deliverables' && (
                <TasksBoard partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}

              {activeTab === 'citations' && (
                <CitationsBoard partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}

              {activeTab === 'metrics' && (
                <MonthlyMetricsForm partnerId={selectedPartnerId} clientId={selectedClientId || undefined} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

