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
  Search,
  Send,
  Table2,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { getClientsServerFn } from '../../server/clients'
import { getPartnersServerFn, type PartnerItem } from '../../server/partners'
import { LandingPagesBoard } from '../../components/crm/LandingPagesBoard'
import { ArticlesBoard } from '../../components/crm/ArticlesBoard'
import { KeywordsBoard } from '../../components/crm/KeywordsBoard'
import { TasksBoard } from '../../components/crm/TasksBoard'
import { CitationsBoard } from '../../components/crm/CitationsBoard'
import { MonthlyKpiGrid } from '../../components/crm/MonthlyKpiGrid'
import { PublishingQueue } from '../../components/crm/PublishingQueue'

interface WorkspaceSearch {
  tab?: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics' | 'queue'
  partnerId?: string
  client?: string
  month?: number
  year?: number
}

export const Route = createFileRoute('/admin/workspace')({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => {
    const tab = search.tab as WorkspaceSearch['tab']
    const month = typeof search.month === 'number' ? search.month : typeof search.month === 'string' ? parseInt(search.month, 10) : undefined
    const year = typeof search.year === 'number' ? search.year : typeof search.year === 'string' ? parseInt(search.year, 10) : undefined
    return {
      tab: ['landing-pages', 'articles', 'keywords', 'deliverables', 'citations', 'metrics', 'queue'].includes(tab || '')
        ? tab
        : undefined,
      partnerId: typeof search.partnerId === 'string' ? search.partnerId : undefined,
      client: typeof search.client === 'string' ? search.client : undefined,
      month: month && month >= 1 && month <= 12 ? month : undefined,
      year: year && year >= 2000 && year <= 2100 ? year : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    const query = location.search as any
    if (query?.client) {
      throw redirect({
        to: '/admin/clients/$clientId',
        params: { clientId: query.client },
        search: { tab: query.tab || 'landing-pages' } as any,
      })
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

  const activeTab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics' | 'queue' =
    search.tab || 'landing-pages'

  const selectedPartnerId = isSuperadmin ? search.partnerId : undefined
  const showAgenciesOverview = isSuperadmin && !selectedPartnerId
  const [agencySearchQuery, setAgencySearchQuery] = useState('')

  const activeAgencyObj = selectedPartnerId
    ? partners.find((p) => p.id === selectedPartnerId)
    : null

  const now = new Date()
  const currentMonth = search.month || (now.getUTCMonth() + 1)
  const currentYear = search.year || now.getUTCFullYear()

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

  const handleTabChange = (tab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'metrics' | 'queue') => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        ...search,
        tab,
        partnerId: selectedPartnerId,
      },
    })
  }

  const handlePartnerChange = (pId: string) => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        ...search,
        tab: activeTab,
        partnerId: pId || undefined,
      },
    })
  }

  const handleMonthChange = (month: number, year: number) => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        ...search,
        month,
        year,
      },
    })
  }

  return (
    <AdminShell
      activeTab="workspace"
      userRole={auth?.role}
      userEmail={auth?.email}
      userName={auth?.name}
      month={currentMonth}
      year={currentYear}
      onMonthChange={handleMonthChange}
      breadcrumb={{
        agency: isSuperadmin ? { id: selectedPartnerId, name: activeAgencyObj?.name } : undefined,
        client: null, // "All clients" roll-up mode
        section: activeTab,
        availableSections: [
          { id: 'landing-pages', label: 'Landing pages' },
          { id: 'articles', label: 'Articles' },
          { id: 'keywords', label: 'Keywords' },
          { id: 'deliverables', label: 'Tasks & Deliverables' },
          { id: 'citations', label: 'Citations' },
          { id: 'metrics', label: 'Monthly KPIs' },
          { id: 'queue', label: 'Publishing Queue' },
        ],
        onSectionChange: (tab) => handleTabChange(tab as any),
      }}
      clients={clients}
      agencies={partners}
      title={
        showAgenciesOverview
          ? 'Agency workspaces'
          : activeAgencyObj
          ? `${activeAgencyObj.name || activeAgencyObj.email} workspace`
          : 'Agency workspace'
      }
      description={
        showAgenciesOverview
          ? 'Select an agency below to access its workspace, deliverable pipelines, citations, and client KPIs.'
          : 'Cross-client deliverable pipeline across all partner accounts. Internal tasks with no assigned client are grouped under Internal.'
      }
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/my-work"
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>My assigned work</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Superadmin Agency-First Overview Mode */}
        {showAgenciesOverview ? (
          <div className="space-y-6">
            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-medium text-[var(--ink)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--muted)]" />
                  <span>Partner agency workspaces ({partners.length})</span>
                </h3>
                <p className="text-[13px] text-[var(--muted)]">
                  Select an agency below to enter its workspace, deliverable pipelines, and client metrics.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={agencySearchQuery}
                  onChange={(e) => setAgencySearchQuery(e.target.value)}
                  placeholder="Search agency workspaces..."
                  className="w-full h-8 pl-9 pr-3 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Agencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-[6px] bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)] flex items-center justify-center font-medium text-sm">
                        {(partner.name || partner.email).substring(0, 2).toUpperCase()}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)] tabular-nums">
                        <Users className="w-3 h-3 text-[var(--muted)]" />
                        <span>{partner.clientCount} clients</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[15px] font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition truncate">
                        {partner.name || 'Unnamed Agency'}
                      </h4>
                      <p className="text-[12px] text-[var(--muted)] font-mono truncate mt-0.5">
                        {partner.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-[12px] text-[var(--muted)] border-t border-[var(--line)]/50">
                      <span>{partner.reportsThisMonthCount} reports (mo)</span>
                      <span>·</span>
                      <span>{partner.staffCount} staff</span>
                    </div>
                  </div>

                  <Link
                    to="/admin/workspace"
                    search={{ partnerId: partner.id, tab: 'landing-pages' }}
                    className="w-full h-8 flex items-center justify-center gap-1.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] hover:border-[var(--line)]/80 hover:bg-[var(--line)]/30 text-[12px] font-medium text-[var(--ink)] transition"
                  >
                    <span>Open workspace</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Superadmin Back Breadcrumb & Agency Switcher */}
            {isSuperadmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
                <div className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
                  <Link
                    to="/admin/workspace"
                    search={{}}
                    className="hover:text-[var(--ink)] transition flex items-center gap-1 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All agencies</span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--line)]" />
                  <span className="font-medium text-[var(--ink)]">
                    {activeAgencyObj ? (activeAgencyObj.name || activeAgencyObj.email) : 'Workspace'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[var(--muted)] hidden sm:inline">Switch agency:</span>
                  <select
                    value={selectedPartnerId || ''}
                    onChange={(e) => handlePartnerChange(e.target.value)}
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

            {/* Inline Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--muted)] px-3.5 py-1.5 rounded-[6px] bg-[var(--panel)] border border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{scopedClients.length}</strong> active clients in roll-up view</span>
              </div>
              <Link
                to="/my-work"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:underline"
              >
                <span>My assigned items</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* 7 Tabs Segmented Switcher */}
            <div className="flex items-center p-0.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabChange('landing-pages')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'landing-pages'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 transition-colors ${activeTab === 'landing-pages' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Landing pages</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('articles')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 transition-colors ${activeTab === 'articles' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Articles</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('keywords')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'keywords'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <SearchIcon className={`w-3.5 h-3.5 transition-colors ${activeTab === 'keywords' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Keywords</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('deliverables')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'deliverables'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <CheckSquare className={`w-3.5 h-3.5 transition-colors ${activeTab === 'deliverables' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Deliverables</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('citations')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'citations'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 transition-colors ${activeTab === 'citations' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Citations</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('metrics')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'metrics'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 transition-colors ${activeTab === 'metrics' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Monthly KPIs</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('queue')}
                className={`flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'queue'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                <Send className={`w-3.5 h-3.5 transition-colors ${activeTab === 'queue' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                <span>Publishing queue</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'landing-pages' && (
                <LandingPagesBoard partnerId={selectedPartnerId} />
              )}

              {activeTab === 'articles' && (
                <ArticlesBoard partnerId={selectedPartnerId} />
              )}

              {activeTab === 'keywords' && (
                <KeywordsBoard partnerId={selectedPartnerId} />
              )}

              {activeTab === 'deliverables' && (
                <TasksBoard partnerId={selectedPartnerId} />
              )}

              {activeTab === 'citations' && (
                <CitationsBoard partnerId={selectedPartnerId} />
              )}

              {activeTab === 'metrics' && (
                <MonthlyKpiGrid
                  partnerId={selectedPartnerId}
                  initialMonth={currentMonth}
                  initialYear={currentYear}
                />
              )}

              {activeTab === 'queue' && (
                <PublishingQueue partnerId={selectedPartnerId} />
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
