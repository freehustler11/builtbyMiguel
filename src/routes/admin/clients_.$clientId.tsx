import { createFileRoute, redirect, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
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
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { getClientByIdServerFn } from '../../server/clients'
import { LandingPagesBoard } from '../../components/crm/LandingPagesBoard'
import { ArticlesBoard } from '../../components/crm/ArticlesBoard'
import { KeywordsBoard } from '../../components/crm/KeywordsBoard'
import { TasksBoard } from '../../components/crm/TasksBoard'
import { MonthlyMetricsForm } from '../../components/crm/MonthlyMetricsForm'
import { CitationsBoard } from '../../components/crm/CitationsBoard'

interface ClientWorkspaceSearch {
  tab?: 'landing-pages' | 'articles' | 'keywords' | 'deliverables' | 'citations' | 'reports' | 'metrics'
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
  const { client, reports, auth } = Route.useLoaderData()
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
    | 'metrics' = search.tab || 'landing-pages'

  const [copiedShareToken, setCopiedShareToken] = useState<string | null>(null)

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
  ) => {
    router.navigate({
      to: '/admin/clients/$clientId',
      params: { clientId: client.id },
      search: { tab },
    })
  }

  const primary = client.primaryColor || '#2563eb'
  const secondary = client.secondaryColor || '#1e293b'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AdminNav bar */}
        <AdminNav
          activeTab="clients"
          title={`${client.businessName} · Workspace`}
          description="Client deliverable boards, search tracking, landing pages, articles, and task execution."
          userRole={auth?.role}
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/admin/reports/new"
                search={{ clientId: client.id }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Report</span>
              </Link>
              <Link
                to="/admin/reports"
                search={{ clientId: client.id }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Reports ({reports?.length || 0})</span>
              </Link>
              <Link
                to={isSuperadmin ? '/admin/agencies' : '/admin/clients'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isSuperadmin ? 'Agencies' : 'All Clients'}</span>
              </Link>
            </div>
          }
        />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link
            to={isSuperadmin ? '/admin/agencies' : '/admin/clients'}
            className="hover:text-slate-900 dark:hover:text-white transition underline-offset-4 hover:underline"
          >
            {isSuperadmin ? 'Agencies' : 'Clients'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {client.businessName}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">CRM Workspace</span>
        </nav>

        {/* Client Profile Header Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {client.logoUrl ? (
                <div
                  className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden p-1.5 flex items-center justify-center shrink-0 shadow-xs"
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
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xs shrink-0"
                  style={{ backgroundColor: primary }}
                >
                  {client.businessName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                    {client.businessName}
                  </h1>
                  {client.isWhiteLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <Sparkles className="w-3 h-3" />
                      <span>White-Label</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono flex-wrap">
                  <span>Contact: <strong className="text-slate-700 dark:text-slate-300">{client.name}</strong></span>
                  {client.websiteUrl && (
                    <a
                      href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{client.websiteUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Theme Colors & Reports Count */}
            <div className="flex items-center gap-4 self-start md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-mono text-slate-400 block">Performance Reports</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {reports?.length || 0} filed
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div
                  className="w-5 h-5 rounded-xl border border-white dark:border-slate-800 shadow-xs"
                  style={{ backgroundColor: primary }}
                  title={`Primary Color: ${primary}`}
                />
                <div
                  className="w-5 h-5 rounded-xl border border-white dark:border-slate-800 shadow-xs"
                  style={{ backgroundColor: secondary }}
                  title={`Secondary Color: ${secondary}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 7 Tabs Segmented Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner overflow-x-auto">
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
                        className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                      >
                        {/* Header: Title, Month, Version */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {rep.reportMonth}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                                v{rep.version || 1}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40">
                                {rep.status || 'published'}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {rep.title || `${client.businessName} - ${rep.reportMonth}`}
                          </h4>

                          <p className="text-[11px] font-mono text-slate-400">
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
        </div>
      </div>
    </div>
  )
}
