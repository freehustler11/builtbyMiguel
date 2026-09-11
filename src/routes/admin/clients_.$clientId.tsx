import { createFileRoute, redirect, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Building2,
  ArrowLeft,
  Globe,
  FileSpreadsheet,
  Layers,
  FileText,
  Search as SearchIcon,
  CheckSquare,
  ShieldCheck,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Eye,
  Share2,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  Award,
  Download,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { getClientByIdServerFn } from '../../server/clients'
import { recordRecentClient } from '../../components/ClientPickerModal'
import { LandingPagesBoard } from '../../components/crm/LandingPagesBoard'
import { ArticlesBoard } from '../../components/crm/ArticlesBoard'
import { KeywordsBoard } from '../../components/crm/KeywordsBoard'
import { TasksBoard } from '../../components/crm/TasksBoard'
import { MonthlyMetricsForm } from '../../components/crm/MonthlyMetricsForm'
import { CitationsBoard } from '../../components/crm/CitationsBoard'
import { DataSourcesBoard } from '../../components/crm/DataSourcesBoard'
import { LocationsBoard } from '../../components/crm/LocationsBoard'

interface ClientWorkspaceSearch {
  tab?:
    | 'landing-pages'
    | 'articles'
    | 'keywords'
    | 'deliverables'
    | 'citations'
    | 'reports'
    | 'metrics'
    | 'data-sources'
    | 'locations'
}

export const Route = createFileRoute('/admin/clients_/$clientId')({
  validateSearch: (search: Record<string, unknown>): ClientWorkspaceSearch => {
    const tab = search.tab as ClientWorkspaceSearch['tab']
    return {
      tab: [
        'landing-pages',
        'articles',
        'keywords',
        'deliverables',
        'citations',
        'reports',
        'metrics',
        'data-sources',
        'locations',
      ].includes(tab || '')
        ? tab
        : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    return { auth }
  },
  loader: async ({ params, context }) => {
    const data = await getClientByIdServerFn({ data: { id: params.clientId } })
    return {
      client: data.client,
      reports: data.reports,
      dataSources: data.dataSources,
      locations: (data as any).locations || [],
      auth: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: ({ loaderData }) => {
    const name = loaderData?.client?.businessName || loaderData?.client?.name || 'Client Workspace'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${name} | Client CRM Workspace | built by Miguel` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: ClientWorkspacePage,
})

function ClientWorkspacePage() {
  const { client, reports, dataSources, locations, auth } = Route.useLoaderData()
  const search = Route.useSearch()
  const router = useRouter()
  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

  const activeTab:
    | 'landing-pages'
    | 'articles'
    | 'keywords'
    | 'deliverables'
    | 'citations'
    | 'reports'
    | 'metrics'
    | 'data-sources'
    | 'locations' = search.tab || 'landing-pages'

  const [copiedShareToken, setCopiedShareToken] = useState<string | null>(null)

  useEffect(() => {
    if (client?.id) {
      recordRecentClient({
        id: client.id,
        name: client.name,
        businessName: client.businessName,
      })
      try {
        localStorage.setItem(`client_last_section_${client.id}`, activeTab)
      } catch {
        // ignore
      }
    }
  }, [client, activeTab])

  const handleCopyShareLink = async (token: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/r/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedShareToken(token)
      setTimeout(() => setCopiedShareToken(null), 2000)
    } catch (err) {
      console.error('Failed to copy share link:', err)
    }
  }

  const handleTabChange = (
    tab:
      | 'landing-pages'
      | 'articles'
      | 'keywords'
      | 'deliverables'
      | 'citations'
      | 'reports'
      | 'metrics'
      | 'data-sources'
      | 'locations'
  ) => {
    try {
      localStorage.setItem(`client_last_section_${client.id}`, tab)
    } catch {
      // ignore
    }
    router.navigate({
      to: '/admin/clients/$clientId',
      params: { clientId: client.id },
      search: { tab },
    })
  }

  const primary = client.primaryColor || '#2563eb'
  const secondary = client.secondaryColor || '#1e293b'

  return (
    <AdminShell
      activeTab="clients"
      title={`${client.businessName} · Workspace`}
      description="Client deliverable boards, search tracking, landing pages, articles, and task execution."
      userRole={auth?.role}
      userEmail={auth?.email}
      userName={auth?.name}
      breadcrumb={{
        agency: isSuperadmin ? { id: client.partnerId, name: (client as any).partner?.name } : undefined,
        client: { id: client.id, name: client.name, businessName: client.businessName },
        section: activeTab,
        availableSections: [
          { id: 'landing-pages', label: 'Landing pages' },
          { id: 'articles', label: 'Articles' },
          { id: 'keywords', label: 'Keywords' },
          { id: 'deliverables', label: 'Tasks & Deliverables' },
          { id: 'citations', label: 'Citations' },
          { id: 'reports', label: 'Reports' },
          { id: 'metrics', label: 'Monthly Metrics' },
          { id: 'data-sources', label: 'Data Sources' },
          { id: 'locations', label: 'Locations' },
        ],
        onSectionChange: (tab) => handleTabChange(tab as any),
      }}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports/new"
            search={{ clientId: client.id }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New report</span>
          </Link>
          <Link
            to={isSuperadmin ? '/admin/agencies' : '/admin/clients'}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isSuperadmin ? 'Agencies' : 'All Clients'}</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-3.5">

        {/* Client Profile Header Card */}
        <div className="p-4 sm:p-5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {client.logoUrl ? (
                <div
                  className="w-12 h-12 rounded-[6px] border border-[var(--line)] overflow-hidden p-1 flex items-center justify-center shrink-0 bg-white"
                  style={{ backgroundColor: (client as any).logoBgColor || '#ffffff' }}
                >
                  <img
                    src={client.logoUrl}
                    alt={client.businessName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-[6px] flex items-center justify-center font-bold text-base text-white shadow-2xs shrink-0"
                  style={{ backgroundColor: primary }}
                >
                  {client.businessName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[17px] font-semibold text-[var(--ink)] truncate">
                    {client.businessName}
                  </h1>
                  {client.isWhiteLabel && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      <Sparkles className="w-3 h-3" />
                      <span>White-Label</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[var(--muted)] font-mono flex-wrap">
                  <span>Contact: <strong className="text-[var(--ink)]">{client.name}</strong></span>
                  {client.websiteUrl && (
                    <a
                      href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{client.websiteUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {dataSources && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[var(--muted)]/70">Sources:</span>
                      {(['gsc', 'ga4', 'gbp'] as const).map((src) => {
                        const status = dataSources?.[src] || 'connected'
                        const label = src.toUpperCase()
                        return (
                          <span
                            key={src}
                            className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium ${
                              status === 'connected'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : status === 'no_access'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
                            }`}
                          >
                            {status === 'connected' ? label : `${label}: ${status === 'no_access' ? 'No Access' : 'N/A'}`}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Theme Colors */}
            <div className="flex items-center gap-2 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] font-mono">Brand colors:</span>
              <div className="flex items-center gap-1 p-1 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <div
                  className="w-4 h-4 rounded-[4px] border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: primary }}
                  title={`Primary: ${primary}`}
                />
                <div
                  className="w-4 h-4 rounded-[4px] border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: secondary }}
                  title={`Secondary: ${secondary}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 7 Tabs Segmented Switcher */}
        <div className="flex items-center p-0.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('landing-pages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
            onClick={() => handleTabChange('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-rose-500" />
            <span>Reports</span>
            {reports && reports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {reports.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('metrics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span>Monthly KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('locations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'locations'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>Locations</span>
            {locations && locations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {locations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('data-sources')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'data-sources'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Data Sources</span>
          </button>
        </div>

        {/* Tab Content: Single-Component Reuse scoped to clientId */}
        <div className="space-y-6">
          {activeTab === 'landing-pages' && (
            <LandingPagesBoard clientId={client.id} />
          )}

          {activeTab === 'articles' && (
            <ArticlesBoard clientId={client.id} />
          )}

          {activeTab === 'keywords' && (
            <KeywordsBoard clientId={client.id} />
          )}

          {activeTab === 'deliverables' && (
            <TasksBoard clientId={client.id} />
          )}

          {activeTab === 'citations' && (
            <CitationsBoard clientId={client.id} partnerId={client.partnerId || undefined} />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Reports Subheader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                    <span>Client Performance Reports ({reports?.length || 0})</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Monthly SEO summaries, deliverable audits, search visibility metrics, and shareable client links.
                  </p>
                </div>
                <Link
                  to="/admin/reports/new"
                  search={{ clientId: client.id }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Report</span>
                </Link>
              </div>

              {/* Reports Grid */}
              {!reports || reports.length === 0 ? (
                <div className="py-16 text-center text-xs font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                  <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                  <p>No performance reports generated yet for {client.businessName}.</p>
                  <Link
                    to="/admin/reports/new"
                    search={{ clientId: client.id }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Report</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {reports.map((rep: any) => {
                    const metrics = rep.metrics || {}
                    const deliverables = rep.deliverablesSnapshot as any
                    const shareUrl = typeof window !== 'undefined'
                      ? `${window.location.origin}/r/${rep.shareToken}`
                      : `/r/${rep.shareToken}`

                    return (
                      <div
                        key={rep.id}
                        className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs hover:border-[var(--line)]/80 transition flex flex-col justify-between space-y-3"
                      >
                        {/* Header: Title, Month, Version */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)]">
                              {rep.reportMonth}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[4px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                v{rep.version || 1}
                              </span>
                              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {rep.status || 'published'}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-[14px] font-medium text-[var(--ink)] line-clamp-1">
                            {rep.title && !rep.title.includes(client.businessName)
                              ? rep.title
                              : `Monthly Performance Report`}
                          </h4>

                          <p className="text-[11px] font-mono text-[var(--muted)]">
                            Created {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(rep.createdAt))}
                          </p>
                        </div>

                        {/* KPI Metrics Preview */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">Organic Clicks</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              {metrics.gscClicks ? Number(metrics.gscClicks).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">Sessions</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              {metrics.gaSessions ? Number(metrics.gaSessions).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">GBP Actions</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              {metrics.gbpCalls || metrics.gbpDirectActions ? (Number(metrics.gbpCalls || 0) + Number(metrics.gbpDirectActions || 0)).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">Ranked Keywords</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              {metrics.topKeywordsCount || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Deliverables Snapshot Pill */}
                        {deliverables && (
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl">
                            <span>Snapshot:</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{deliverables.landingPages?.length || 0} LPs</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{deliverables.clientArticles?.length || 0} Articles</span>
                            <span>•</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">{deliverables.tasks?.length || 0} Tasks</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <Link
                            to="/admin/reports/$id"
                            params={{ id: rep.id }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleCopyShareLink(rep.shareToken, e)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
                              title="Copy Public Share Link"
                            >
                              {copiedShareToken === rep.shareToken ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 text-[10px]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Share</span>
                                </>
                              )}
                            </button>

                            <a
                              href={`/r/${rep.shareToken}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Open Share Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'metrics' && (
            <MonthlyMetricsForm clientId={client.id} />
          )}

          {activeTab === 'locations' && (
            <LocationsBoard clientId={client.id} />
          )}

          {activeTab === 'data-sources' && (
            <DataSourcesBoard clientId={client.id} />
          )}
        </div>
      </div>
    </AdminShell>
  )
}
