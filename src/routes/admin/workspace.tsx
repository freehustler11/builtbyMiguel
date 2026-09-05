import { createFileRoute, redirect, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Briefcase,
  Layers,
  FileText,
  Search as SearchIcon,
  CheckSquare,
  Building2,
  Users,
  BarChart3,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { getClientsServerFn } from '../../server/clients'
import { getPartnersServerFn, type PartnerItem } from '../../server/partners'
import { LandingPagesBoard } from '../../components/crm/LandingPagesBoard'
import { ArticlesBoard } from '../../components/crm/ArticlesBoard'
import { KeywordsBoard } from '../../components/crm/KeywordsBoard'
import { TasksBoard } from '../../components/crm/TasksBoard'
import { MonthlyMetricsForm } from '../../components/crm/MonthlyMetricsForm'

interface WorkspaceSearch {
  tab?: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'metrics'
  partnerId?: string
  client?: string
}

export const Route = createFileRoute('/admin/workspace')({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => {
    const tab = search.tab as WorkspaceSearch['tab']
    return {
      tab: ['landing-pages', 'articles', 'keywords', 'deliverables', 'metrics'].includes(tab || '')
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

  const activeTab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'metrics' =
    search.tab || 'landing-pages'

  const selectedPartnerId = isSuperadmin ? search.partnerId : undefined

  const handleTabChange = (tab: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'metrics') => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        tab,
        partnerId: selectedPartnerId,
      },
    })
  }

  const handlePartnerChange = (pId: string) => {
    router.navigate({
      to: '/admin/workspace',
      search: {
        tab: activeTab,
        partnerId: pId || undefined,
      },
    })
  }

  const activeAgencyObj = selectedPartnerId
    ? partners.find((p) => p.id === selectedPartnerId)
    : null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AdminNav Bar */}
        <AdminNav
          activeTab="workspace"
          title={
            activeAgencyObj
              ? `${activeAgencyObj.name || activeAgencyObj.email} · Workspace`
              : 'Agency Workspace'
          }
          description="Cross-client deliverable pipeline across all partner accounts. Internal tasks with no assigned client are grouped under Internal."
          userRole={auth?.role}
          actions={
            <div className="flex items-center gap-3">
              {isSuperadmin && partners.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">Agency:</span>
                  <select
                    value={selectedPartnerId || ''}
                    onChange={(e) => handlePartnerChange(e.target.value)}
                    className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Agency Clients</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.email} ({p.clientCount} clients)
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

        {/* Aggregate Stats Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Managed Clients</span>
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {clients.length}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">active client accounts</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Scope Mode</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {activeAgencyObj ? activeAgencyObj.name || activeAgencyObj.email : 'Agency-Wide Roll-Up'}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">across all client portfolios</span>
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

        {/* 4 Tabs Segmented Switcher */}
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

        {/* Tab Content: Single-Component Reuse without clientId (Agency-Wide Scope) */}
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

          {activeTab === 'metrics' && (
            <MonthlyMetricsForm partnerId={selectedPartnerId} clientId={search.client} />
          )}
        </div>
      </div>
    </div>
  )
}
