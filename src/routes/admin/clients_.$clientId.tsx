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
  Edit2,
  X,
  Image as ImageIcon,
  Briefcase,
  User,
  RefreshCw,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { getClientByIdServerFn, updateClientServerFn } from '../../server/clients'
import { getAgencyTeamPickerServerFn, type TeamPickerMember } from '../../server/crm'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { MediaPickerModal } from '../../components/MediaPickerModal'
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
    const [data, teamMembers] = await Promise.all([
      getClientByIdServerFn({ data: { id: params.clientId } }),
      getAgencyTeamPickerServerFn({}).catch(() => []),
    ])
    return {
      client: data.client,
      reports: data.reports,
      dataSources: data.dataSources,
      locations: (data as any).locations || [],
      teamMembers: (teamMembers || []) as TeamPickerMember[],
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
  const { client, reports, dataSources, locations, teamMembers, auth } = Route.useLoaderData()
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
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isPartnerLogoModalOpen, setIsPartnerLogoModalOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBusinessName, setEditBusinessName] = useState('')
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('')
  const [editLogoUrl, setEditLogoUrl] = useState('')
  const [editLogoBgColor, setEditLogoBgColor] = useState('#ffffff')
  const [editPrimaryColor, setEditPrimaryColor] = useState('#2563eb')
  const [editSecondaryColor, setEditSecondaryColor] = useState('#1e293b')
  const [editIsWhiteLabel, setEditIsWhiteLabel] = useState(false)
  const [editPartnerName, setEditPartnerName] = useState('')
  const [editPartnerLogoUrl, setEditPartnerLogoUrl] = useState('')
  const [editPartnerLogoBgColor, setEditPartnerLogoBgColor] = useState('#ffffff')
  const [editAssignedStaffId, setEditAssignedStaffId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const COLOR_PRESETS = [
    '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706',
    '#059669', '#0891b2', '#4f46e5', '#0f172a', '#475569',
  ]

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const openEditModal = () => {
    setEditName(client.name || '')
    setEditBusinessName(client.businessName || '')
    setEditWebsiteUrl(client.websiteUrl || '')
    setEditLogoUrl(client.logoUrl || '')
    setEditLogoBgColor((client as any).logoBgColor || '#ffffff')
    setEditPrimaryColor(client.primaryColor || '#2563eb')
    setEditSecondaryColor(client.secondaryColor || '#1e293b')
    setEditIsWhiteLabel(Boolean(client.isWhiteLabel))
    setEditPartnerName(client.partnerName || '')
    setEditPartnerLogoUrl(client.partnerLogoUrl || '')
    setEditPartnerLogoBgColor((client as any).partnerLogoBgColor || '#ffffff')
    setEditAssignedStaffId((client as any).assignedStaffId || '')
    setFormError(null)
    setIsEditModalOpen(true)
  }

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editBusinessName.trim()) {
      setFormError('Business name is required')
      return
    }
    if (!editName.trim()) {
      setFormError('Contact name is required')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      await updateClientServerFn({
        data: {
          id: client.id,
          name: editName.trim(),
          businessName: editBusinessName.trim(),
          websiteUrl: editWebsiteUrl.trim() || undefined,
          logoUrl: editLogoUrl.trim() || undefined,
          logoBgColor: editLogoBgColor.trim() || '#ffffff',
          primaryColor: editPrimaryColor.trim() || '#2563eb',
          secondaryColor: editSecondaryColor.trim() || '#1e293b',
          isWhiteLabel: editIsWhiteLabel,
          partnerName: editPartnerName.trim() || undefined,
          partnerLogoUrl: editPartnerLogoUrl.trim() || undefined,
          partnerLogoBgColor: editPartnerLogoBgColor.trim() || '#ffffff',
          assignedStaffId: editAssignedStaffId.trim() || null,
        },
      })
      addToast('Client Updated', `${editBusinessName} profile updated successfully.`, 'success')
      setIsEditModalOpen(false)
      await router.invalidate()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update client')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit client</span>
          </button>
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
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="space-y-3.5">

        {/* Client Profile Header Card */}
        <div className="p-3.5 sm:p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {client.logoUrl ? (
                <div
                  className="w-10 h-10 rounded-[6px] border border-[var(--line)] overflow-hidden p-1 flex items-center justify-center shrink-0 bg-white"
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
                  className="w-10 h-10 rounded-[6px] flex items-center justify-center font-bold text-sm text-white shadow-2xs shrink-0"
                  style={{ backgroundColor: primary }}
                >
                  {client.businessName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[15px] font-semibold text-[var(--ink)] truncate">
                    {client.businessName}
                  </h1>
                  {client.isWhiteLabel && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      <Sparkles className="w-3 h-3" />
                      <span>White-Label</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[var(--muted)] flex-wrap">
                  <span>Contact: <strong className="text-[var(--ink)] font-medium">{client.name}</strong></span>
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
                      <span className="text-[var(--muted)]/70 text-[11px]">Sources:</span>
                      {(['gsc', 'ga4', 'gbp'] as const).map((src) => {
                        const status = dataSources?.[src] || 'connected'
                        const label = src.toUpperCase()
                        return (
                          <span
                            key={src}
                            className={`px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium ${
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
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="text-[11px] text-[var(--muted)]">Brand colors:</span>
              <div className="flex items-center gap-1 p-1 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <div
                  className="w-3.5 h-3.5 rounded-[4px] border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: primary }}
                  title={`Primary: ${primary}`}
                />
                <div
                  className="w-3.5 h-3.5 rounded-[4px] border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: secondary }}
                  title={`Secondary: ${secondary}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 9 Tabs Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('landing-pages')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'landing-pages'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Landing pages</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('articles')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Articles</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('keywords')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'keywords'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <SearchIcon className="w-3.5 h-3.5 text-purple-500" />
            <span>Keywords</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('deliverables')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'deliverables'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Deliverables</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('citations')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'citations'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            <span>Citations</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('reports')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-500" />
            <span>Reports</span>
            {reports && reports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {reports.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('metrics')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Monthly KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('locations')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'locations'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Locations</span>
            {locations && locations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {locations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('data-sources')}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'data-sources'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Data sources</span>
          </button>
        </div>

        {/* Tab Content: Single-Component Reuse scoped to clientId */}
        <div className="space-y-4">
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
            <div className="space-y-4">
              {/* Reports Subheader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
                <div>
                  <h3 className="text-[14px] font-semibold text-[var(--ink)] flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                    <span>Client performance reports ({reports?.length || 0})</span>
                  </h3>
                  <p className="text-[12px] text-[var(--muted)] mt-0.5">
                    Monthly SEO summaries, deliverable audits, search visibility metrics, and shareable client links.
                  </p>
                </div>
                <Link
                  to="/admin/reports/new"
                  search={{ clientId: client.id }}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-rose-600 hover:bg-rose-500 shadow-2xs transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate report</span>
                </Link>
              </div>

              {/* Reports Grid */}
              {!reports || reports.length === 0 ? (
                <div className="py-12 text-center text-[12px] text-[var(--muted)] bg-[var(--canvas)] rounded-[8px] border border-dashed border-[var(--line)] space-y-2.5">
                  <FileSpreadsheet className="w-7 h-7 mx-auto text-[var(--muted)] opacity-60" />
                  <p>No performance reports generated yet for {client.businessName}.</p>
                  <Link
                    to="/admin/reports/new"
                    search={{ clientId: client.id }}
                    className="inline-flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[12px] font-medium text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create first report</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {reports.map((rep: any) => {
                    const metrics = rep.metrics || {}
                    const deliverables = rep.deliverablesSnapshot as any
                    const shareUrl = typeof window !== 'undefined'
                      ? `${window.location.origin}/r/${rep.shareToken}`
                      : `/r/${rep.shareToken}`

                    return (
                      <div
                        key={rep.id}
                        className="p-3.5 sm:p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs hover:border-[var(--line)]/80 transition flex flex-col justify-between space-y-3"
                      >
                        {/* Header: Title, Month, Version */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-medium px-2 py-0.5 rounded-[4px] bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)]">
                              {rep.reportMonth}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                v{rep.version || 1}
                              </span>
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {rep.status || 'published'}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-[14px] font-medium text-[var(--ink)] line-clamp-1">
                            {rep.title && !rep.title.includes(client.businessName)
                              ? rep.title
                              : `Monthly Performance Report`}
                          </h4>

                          <p className="text-[11px] text-[var(--muted)]">
                            Created {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(rep.createdAt))}
                          </p>
                        </div>

                        {/* KPI Metrics Preview */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]/60 text-xs">
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Organic Clicks</span>
                            <span className="font-semibold text-[var(--ink)]">
                              {metrics.gscClicks ? Number(metrics.gscClicks).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Sessions</span>
                            <span className="font-semibold text-[var(--ink)]">
                              {metrics.gaSessions ? Number(metrics.gaSessions).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">GBP Actions</span>
                            <span className="font-semibold text-[var(--ink)]">
                              {metrics.gbpCalls || metrics.gbpDirectActions ? (Number(metrics.gbpCalls || 0) + Number(metrics.gbpDirectActions || 0)).toLocaleString() : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Ranked Keywords</span>
                            <span className="font-semibold text-[var(--ink)]">
                              {metrics.topKeywordsCount || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Deliverables Snapshot Pill */}
                        {deliverables && (
                          <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] bg-[var(--canvas)] px-2.5 py-1.5 rounded-[6px] border border-[var(--line)]/60">
                            <span>Snapshot:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{deliverables.landingPages?.length || 0} LPs</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">{deliverables.clientArticles?.length || 0} Articles</span>
                            <span>•</span>
                            <span className="font-medium text-amber-600 dark:text-amber-400">{deliverables.tasks?.length || 0} Tasks</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between gap-2">
                          <Link
                            to="/admin/reports/$id"
                            params={{ id: rep.id }}
                            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] text-[12px] font-medium text-white bg-[var(--ink)] hover:opacity-90 transition shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleCopyShareLink(rep.shareToken, e)}
                              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                              title="Copy Public Share Link"
                            >
                              {copiedShareToken === rep.shareToken ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500 text-[11px]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3 h-3" />
                                  <span className="text-[11px]">Share</span>
                                </>
                              )}
                            </button>

                            <a
                              href={`/r/${rep.shareToken}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/30 transition"
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

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[var(--panel)] rounded-[20px] border border-[var(--line)] p-6 sm:p-7 space-y-5 shadow-2xl text-[var(--ink)] animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[6px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                    Edit Client Profile
                  </h3>
                  <p className="text-[12px] text-[var(--muted)]">
                    Configure branding, contact details, assigned staff, and white-label settings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-[6px] bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[12px] text-[var(--danger)] font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-4">
              {/* Assigned Staff Member */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Assigned Staff Member
                </label>
                <select
                  value={editAssignedStaffId}
                  onChange={(e) => setEditAssignedStaffId(e.target.value)}
                  className="w-full text-[13px] rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                >
                  <option value="">Unassigned (Agency Pool)</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.email} ({member.role === 'partner' ? 'Agency Owner' : 'Staff'})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[var(--muted)]">
                  The assigned staff member will see this client highlighted under their assigned work and filtered views.
                </p>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    placeholder="e.g. Acme Roofing & Solar"
                    className="w-full px-3 py-2 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Website URL
                </label>
                <input
                  type="text"
                  value={editWebsiteUrl}
                  onChange={(e) => setEditWebsiteUrl(e.target.value)}
                  placeholder="https://acmeroofing.com"
                  className="w-full px-3 py-2 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Client Logo Picker */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Client Logo & Background
                </label>
                <div className="flex items-center gap-3">
                  {editLogoUrl ? (
                    <div
                      className="w-11 h-11 rounded-[6px] border border-[var(--line)] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden"
                      style={{ backgroundColor: editLogoBgColor !== 'transparent' ? editLogoBgColor : undefined }}
                    >
                      <img src={editLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-[6px] border border-dashed border-[var(--line)] flex items-center justify-center text-[var(--muted)] shrink-0 bg-[var(--canvas)]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="flex-1 px-3 py-2 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] truncate"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-3 py-2 rounded-[6px] text-[12px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition shrink-0 cursor-pointer"
                    >
                      Media Library
                    </button>
                  </div>
                </div>

                {/* Logo Background Color Customization */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-medium text-[var(--ink)] block">
                      Logo Container Background
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      Set a dark or white backing for transparent client logos.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={editLogoBgColor.startsWith('#') ? editLogoBgColor : '#ffffff'}
                      onChange={(e) => setEditLogoBgColor(e.target.value)}
                      className="w-7 h-7 rounded-[4px] border border-[var(--line)] cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={editLogoBgColor}
                      onChange={(e) => setEditLogoBgColor(e.target.value)}
                      placeholder="#ffffff"
                      className="w-20 px-2 py-1 rounded-[4px] text-[12px] font-mono border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]"
                    />
                    <div className="flex items-center gap-1 pl-1">
                      {['#ffffff', '#0f172a', '#000000', editPrimaryColor].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setEditLogoBgColor(bg)}
                          className={`w-4.5 h-4.5 rounded-full border border-[var(--line)] cursor-pointer transition ${editLogoBgColor === bg ? 'ring-2 ring-[var(--accent)] scale-110' : ''}`}
                          style={{ backgroundColor: bg }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editPrimaryColor}
                      onChange={(e) => setEditPrimaryColor(e.target.value)}
                      className="w-7 h-7 rounded-[4px] border border-[var(--line)] cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={editPrimaryColor}
                      onChange={(e) => setEditPrimaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-[4px] text-[12px] font-mono border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {COLOR_PRESETS.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditPrimaryColor(color)}
                        className="w-4 h-4 rounded-full border border-[var(--line)] cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editSecondaryColor}
                      onChange={(e) => setEditSecondaryColor(e.target.value)}
                      className="w-7 h-7 rounded-[4px] border border-[var(--line)] cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={editSecondaryColor}
                      onChange={(e) => setEditSecondaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-[4px] text-[12px] font-mono border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {COLOR_PRESETS.slice(5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditSecondaryColor(color)}
                        className="w-4 h-4 rounded-full border border-[var(--line)] cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* White-Label Settings */}
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[12px] font-semibold text-[var(--ink)] block">
                      White-Label Report Branding
                    </span>
                    <span className="text-[11px] text-[var(--muted)] block">
                      Replace "built by Miguel" branding on client PDFs with custom partner agency details.
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editIsWhiteLabel}
                    onClick={() => setEditIsWhiteLabel(!editIsWhiteLabel)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      editIsWhiteLabel ? 'bg-[var(--accent)]' : 'bg-[var(--line)]'
                    }`}
                  >
                    <span className="sr-only">Toggle white-label</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        editIsWhiteLabel ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {editIsWhiteLabel && (
                  <div className="space-y-2.5 pt-2 border-t border-[var(--line)] animate-in fade-in">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[var(--muted)]">
                        Partner Agency Name
                      </label>
                      <input
                        type="text"
                        value={editPartnerName}
                        onChange={(e) => setEditPartnerName(e.target.value)}
                        placeholder="e.g. Apex Marketing Co."
                        className="w-full px-3 py-1.5 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[var(--muted)]">
                        Partner Agency Logo
                      </label>
                      <div className="flex items-center gap-2.5">
                        {editPartnerLogoUrl ? (
                          <div
                            className="w-9 h-9 rounded-[4px] border border-[var(--line)] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden"
                            style={{ backgroundColor: editPartnerLogoBgColor !== 'transparent' ? editPartnerLogoBgColor : undefined }}
                          >
                            <img src={editPartnerLogoUrl} alt="Partner Logo" className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-[4px] border border-dashed border-[var(--line)] flex items-center justify-center text-[var(--muted)] shrink-0 bg-[var(--panel)]">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editPartnerLogoUrl}
                            onChange={(e) => setEditPartnerLogoUrl(e.target.value)}
                            placeholder="https://.../partner-logo.png"
                            className="flex-1 px-3 py-1.5 rounded-[6px] text-[13px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] truncate"
                          />
                          <button
                            type="button"
                            onClick={() => setIsPartnerLogoModalOpen(true)}
                            className="px-2.5 py-1.5 rounded-[6px] text-[12px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition shrink-0 cursor-pointer"
                          >
                            Browse
                          </button>
                        </div>
                      </div>

                      {/* Partner Logo Background Selector */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="text-[11px] text-[var(--muted)]">Logo Background:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editPartnerLogoBgColor.startsWith('#') ? editPartnerLogoBgColor : '#ffffff'}
                            onChange={(e) => setEditPartnerLogoBgColor(e.target.value)}
                            className="w-5 h-5 rounded-[4px] border border-[var(--line)] cursor-pointer p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={editPartnerLogoBgColor}
                            onChange={(e) => setEditPartnerLogoBgColor(e.target.value)}
                            placeholder="#ffffff"
                            className="w-20 px-2 py-0.5 rounded-[4px] text-[11px] font-mono border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-8 inline-flex items-center px-3 rounded-[6px] text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 inline-flex items-center gap-1.5 px-4 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Client Logo */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="Select Client Logo from Media Library"
        acceptTypes="images"
        purpose="client"
        clientId={client.id}
        onSelect={(media) => {
          setEditLogoUrl(media.fileUrl)
        }}
      />

      {/* Media Picker Modal for Partner Agency Logo */}
      <MediaPickerModal
        isOpen={isPartnerLogoModalOpen}
        onClose={() => setIsPartnerLogoModalOpen(false)}
        title="Select Partner Agency Logo from Media Library"
        acceptTypes="images"
        purpose="all"
        onSelect={(media) => {
          setEditPartnerLogoUrl(media.fileUrl)
        }}
      />
    </AdminShell>
  )
}
