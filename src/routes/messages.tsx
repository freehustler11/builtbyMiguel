import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Inbox,
  Search,
  Mail,
  Building,
  MapPin,
  Globe,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  Filter,
  Eye,
  X,
  TrendingUp,
  UserCheck,
  Send,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowUpRight,
} from 'lucide-react'
import { requireSuperadmin } from '../lib/auth'
import { DataTable, type ColumnDef, type BulkAction } from '../components/ui/DataTable'
import {
  getMessagesServerFn,
  updateMessageStatusServerFn,
  deleteMessageServerFn,
} from '../server/messages'
import { AdminShell } from '../components/AdminShell'
import { ConfirmModal } from '../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../components/Toast'
import type { Message } from '../db/schema'

interface MessagesSearch {
  status?: 'all' | 'new' | 'contacted' | 'archived'
  type?: 'all' | 'audit' | 'contact'
  q?: string
}

export const Route = createFileRoute('/messages')({
  validateSearch: (search: Record<string, unknown>): MessagesSearch => {
    const status = search.status as MessagesSearch['status']
    const type = search.type as MessagesSearch['type']
    return {
      status: ['all', 'new', 'contacted', 'archived'].includes(status || '')
        ? status
        : 'all',
      type: ['all', 'audit', 'contact'].includes(type || '') ? type : 'all',
      q: typeof search.q === 'string' ? search.q : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    await requireSuperadmin({ location })
  },

  loaderDeps: ({ search }) => ({
    status: search.status || 'all',
    type: search.type || 'all',
    q: search.q || '',
  }),
  loader: async ({ deps }) => {
    return await getMessagesServerFn({
      data: {
        status: deps.status,
        search: deps.q,
      },
    })
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Inbound Leads & Messages | built by Miguel Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: MessagesPage,
})

function MessagesPage() {
  const { messages, counts } = Route.useLoaderData()
  const { status = 'all', type = 'all', q = '' } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(q)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mutatingId, setMutatingId] = useState<string | null>(null)
  const [activeLeadModal, setActiveLeadModal] = useState<Message | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<Message | null>(null)
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(() => {
    try {
      return localStorage.getItem('ui_guide_messages') === 'true'
    } catch {
      return false
    }
  })
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const handleToggleGuide = () => {
    const next = !showBeginnerGuide
    setShowBeginnerGuide(next)
    try {
      localStorage.setItem('ui_guide_messages', String(next))
    } catch {
      // ignore
    }
  }

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

  // Filter messages by type if requested
  const filteredMessages = messages.filter((item) => {
    if (type !== 'all' && item.type !== type) return false
    return true
  })

  // Calculate high-level KPIs
  const totalLeads = counts.all
  const newLeads = counts.new
  const contactedLeads = counts.contacted
  const conversionRate =
    totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : null

  const handleStatusTab = (newStatus: 'all' | 'new' | 'contacted' | 'archived') => {
    navigate({
      to: '.',
      search: {
        status: newStatus,
        type,
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleTypeFilter = (newType: 'all' | 'audit' | 'contact') => {
    navigate({
      to: '.',
      search: {
        status,
        type: newType,
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '.',
      search: {
        status,
        type,
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await router.invalidate()
    setIsRefreshing(false)
    addToast('Refreshed', 'Loaded the latest lead submissions.', 'info')
  }

  const handleStatusChange = async (
    id: string,
    newStatus: 'new' | 'contacted' | 'archived',
    businessName?: string
  ) => {
    try {
      setMutatingId(id)
      await updateMessageStatusServerFn({ data: { id, status: newStatus } })
      if (activeLeadModal && activeLeadModal.id === id) {
        setActiveLeadModal({ ...activeLeadModal, status: newStatus })
      }
      await router.invalidate()
      addToast(
        `Lead marked as ${newStatus}`,
        businessName ? `${businessName} status updated` : undefined
      )
    } catch (err) {
      console.error('Failed to update message status:', err)
      addToast('Update Failed', 'Could not change status. Please try again.', 'error')
    } finally {
      setMutatingId(null)
    }
  }

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return
    try {
      setMutatingId(leadToDelete.id)
      if (activeLeadModal && activeLeadModal.id === leadToDelete.id) {
        setActiveLeadModal(null)
      }
      await deleteMessageServerFn({ data: { id: leadToDelete.id } })
      setLeadToDelete(null)
      await router.invalidate()
      addToast('Lead Deleted', 'The lead was permanently removed from your pipeline.')
    } catch (err) {
      console.error('Failed to delete message:', err)
      addToast('Delete Failed', 'Could not delete lead. Please try again.', 'error')
    } finally {
      setMutatingId(null)
    }
  }

  const copyToClipboard = (text: string, id: string, label: string = 'Item') => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    addToast('Copied to Clipboard', `${label}: ${text}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d)
  }

  return (
    <AdminShell
      activeTab="messages"
      title="Inbound leads & inquiries"
      description="Review, inspect, and respond to qualified business leads captured across the website."
      userRole="superadmin"
      actions={
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] hover:bg-[var(--canvas)] border border-[var(--line)] transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent)]' : ''}`}
          />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="space-y-3.5">
        {/* Soft Ambient Light Glow Matching Homepage */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Toast Notification Container */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Beginner Friendly Quick Workflow Guide Banner (Dismissible / Collapsible, Collapsed by Default) */}
      <div className="rounded-[8px] border border-[var(--line)] bg-[var(--panel)] p-3 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-[13px] font-medium text-[var(--ink)]">
              Beginner's Quick Guide to Managing Leads
            </h2>
          </div>
          <button
            type="button"
            onClick={handleToggleGuide}
            className="flex items-center gap-1 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            <span>{showBeginnerGuide ? 'Hide Guide' : 'Show Guide'}</span>
            {showBeginnerGuide ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {showBeginnerGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[var(--line)] text-[12px] text-[var(--muted)]">
            <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                <span className="w-4 h-4 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-mono text-[10px]">
                  1
                </span>
                <span>Inspect New Leads</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                Click <strong>"Inspect"</strong> on any lead to see their audit URL, location, and full message.
              </p>
            </div>

            <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono text-[10px]">
                  2
                </span>
                <span>1-Click Email Outreach</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                Click <strong>"Email Client"</strong> to immediately draft a personalized response in your email client.
              </p>
            </div>

            <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                  3
                </span>
                <span>Update Status</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                Switch from <strong>New</strong> → <strong>Contacted</strong> once replied, or <strong>Archive</strong> when closed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Inline Strip Metrics Row */}
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--muted)] px-3.5 py-2 rounded-[6px] bg-[var(--panel)] border border-[var(--line)]">
        <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{totalLeads}</strong> total inquiries</span>
        <span className="opacity-40">·</span>
        <span><strong className="text-[var(--accent)] font-semibold tabular-nums">{newLeads}</strong> new</span>
        <span className="opacity-40">·</span>
        <span><strong className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">{contactedLeads}</strong> in contact</span>
        <span className="opacity-40">·</span>
        <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{conversionRate !== null ? `${conversionRate}%` : '—'}</strong> contact rate</span>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusTab('all')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              status === 'all'
                ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.5 rounded-[6px] text-[11px] tabular-nums bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('new')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              status === 'new'
                ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <span>New</span>
            <span className="px-1.5 py-0.5 rounded-[6px] text-[11px] tabular-nums bg-[var(--canvas)] text-[var(--accent)] border border-[var(--line)] font-medium">
              {counts.new}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('contacted')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              status === 'contacted'
                ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
            <span>Contacted</span>
            <span className="px-1.5 py-0.5 rounded-[6px] text-[11px] tabular-nums bg-[var(--canvas)] text-[var(--success)] border border-[var(--line)]">
              {counts.contacted}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('archived')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              status === 'archived'
                ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Archived</span>
            <span className="px-1.5 py-0.5 rounded-[6px] text-[11px] tabular-nums bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
              {counts.archived}
            </span>
          </button>
        </div>

        {/* Search & Type Filter Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          {/* Type Filter Select */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => handleTypeFilter(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer shadow-2xs"
            >
              <option value="all">All Form Types</option>
              <option value="audit">🎯 5-Min Audit Forms</option>
              <option value="contact">✉️ Contact Inquiries</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Search Input Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 flex items-center"
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, business, email, location..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  navigate({
                    to: '.',
                    search: { status, type, q: undefined },
                  })
                }}
                className="absolute right-16 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Leads Pipeline DataTable */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--panel)] p-12 text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)]">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-[var(--ink)]">
              No leads match your filter
            </h3>
            <p className="text-[13px] text-[var(--muted)] mt-1 max-w-sm mx-auto">
              {q
                ? `No submissions found matching "${q}". Try clearing your search term.`
                : `There are currently no submissions with status "${status}".`}
            </p>
          </div>
          {(status !== 'all' || type !== 'all' || q) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                navigate({ to: '.', search: { status: 'all', type: 'all' } })
              }}
              className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <DataTable<Message>
          data={filteredMessages}
          columns={[
            {
              id: 'lead',
              header: 'Lead / Business',
              accessor: (item) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
                    {(item.name || item.businessName || 'IN').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <button
                      type="button"
                      onClick={() => setActiveLeadModal(item)}
                      className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] text-left transition truncate cursor-pointer"
                    >
                      {item.businessName || item.name}
                    </button>
                    <span className="text-[11px] text-[var(--muted)] truncate">
                      {item.name} {item.location ? `· ${item.location}` : ''}
                    </span>
                  </div>
                </div>
              ),
            },
            {
              id: 'type',
              header: 'Form type',
              accessor: (item) => (
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium border ${
                    item.type === 'audit'
                      ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40'
                  }`}
                >
                  {item.type === 'audit' ? '5-Min Audit' : 'Contact'}
                </span>
              ),
            },
            {
              id: 'contact',
              header: 'Contact',
              accessor: (item) => (
                <div className="flex flex-col min-w-0">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-[12px] font-mono text-[var(--ink)] hover:text-[var(--accent)] hover:underline truncate"
                  >
                    {item.email}
                  </a>
                  {item.location && (
                    <span className="text-[11px] font-mono text-[var(--muted)] truncate">
                      {item.location}
                    </span>
                  )}
                </div>
              ),
            },
            {
              id: 'website',
              header: 'Website',
              accessor: (item) =>
                item.websiteUrl ? (
                  <a
                    href={
                      item.websiteUrl.startsWith('http')
                        ? item.websiteUrl
                        : `https://${item.websiteUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)] hover:underline inline-flex items-center gap-1 font-mono truncate max-w-[160px]"
                  >
                    <span>{item.websiteUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
                  </a>
                ) : (
                  <span className="text-[12px] text-[var(--muted)]">—</span>
                ),
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (item) => (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${
                    item.status === 'new'
                      ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
                      : item.status === 'contacted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                      : 'bg-[var(--line)]/50 text-[var(--muted)] border-[var(--line)]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'new'
                        ? 'bg-rose-500'
                        : item.status === 'contacted'
                        ? 'bg-emerald-500'
                        : 'bg-[var(--muted)]'
                    }`}
                  />
                  <span className="capitalize">{item.status}</span>
                </span>
              ),
            },
            {
              id: 'createdAt',
              header: 'Received',
              accessor: (item) => (
                <span className="text-[12px] font-mono tabular-nums text-[var(--muted)]">
                  {formatDate(item.createdAt)}
                </span>
              ),
            },
          ]}
          keyExtractor={(item) => item.id}
          selectable
          bulkActions={[
            {
              label: 'Mark as Contacted',
              icon: CheckCircle2,
              variant: 'accent',
              onClick: async (selectedItems, clearSelection) => {
                for (const item of selectedItems) {
                  await updateMessageStatusServerFn({ data: { id: item.id, status: 'contacted' } })
                }
                addToast('Status Updated', `Marked ${selectedItems.length} leads as Contacted.`)
                clearSelection()
                await router.invalidate()
              },
            },
            {
              label: 'Archive Selected',
              icon: Archive,
              variant: 'secondary',
              onClick: async (selectedItems, clearSelection) => {
                for (const item of selectedItems) {
                  await updateMessageStatusServerFn({ data: { id: item.id, status: 'archived' } })
                }
                addToast('Leads Archived', `Moved ${selectedItems.length} leads to Archive.`)
                clearSelection()
                await router.invalidate()
              },
            },
          ]}
          rowActions={(item) => (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setActiveLeadModal(item)}
                title="Inspect lead details"
                className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              {item.status !== 'contacted' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'contacted', item.businessName)}
                  title="Mark contacted"
                  className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--success)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
              {item.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'archived', item.businessName)}
                  title="Archive lead"
                  className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setLeadToDelete(item)}
                title="Delete lead"
                className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* Custom Themed Lead Inspection Modal */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeLeadModal.type === 'audit'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    {activeLeadModal.type === 'audit' ? '5-Min Video Audit' : 'Direct Inquiry'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {formatDate(activeLeadModal.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeLeadModal.businessName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lead ID: <span className="font-mono">{activeLeadModal.id}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveLeadModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Contact Person
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeLeadModal.name}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Email
                </div>
                <div className="text-sm font-mono font-medium text-rose-600 dark:text-rose-400 truncate">
                  {activeLeadModal.email}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Location / Market
                </div>
                <div className="text-sm text-slate-900 dark:text-white">
                  {activeLeadModal.location || 'Not specified'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Current Website
                </div>
                <div className="text-sm font-mono text-slate-900 dark:text-white truncate">
                  {activeLeadModal.websiteUrl ? (
                    <a
                      href={
                        activeLeadModal.websiteUrl.startsWith('http')
                          ? activeLeadModal.websiteUrl
                          : `https://${activeLeadModal.websiteUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{activeLeadModal.websiteUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Full Inquiry Message
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {activeLeadModal.message || 'No additional details provided.'}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      activeLeadModal.id,
                      activeLeadModal.status === 'contacted' ? 'new' : 'contacted',
                      activeLeadModal.businessName
                    )
                  }
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {activeLeadModal.status === 'contacted'
                    ? 'Mark as New'
                    : 'Mark as Contacted'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLeadToDelete(activeLeadModal)
                    setActiveLeadModal(null)
                  }}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveLeadModal(null)}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={`mailto:${activeLeadModal.email}?subject=Your%20Website%20Growth%20Audit%20-%20Built%20by%20Miguel&body=Hi%20${encodeURIComponent(
                    activeLeadModal.name
                  )},%0D%0A%0D%0AThank%20you%20for%20reaching%20out%20regarding%20${encodeURIComponent(
                    activeLeadModal.businessName
                  )}.`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Replaces browser window.confirm) */}
      <ConfirmModal
        isOpen={Boolean(leadToDelete)}
        onClose={() => setLeadToDelete(null)}
        onConfirm={confirmDeleteLead}
        title="Delete Lead Inbound"
        description={
          leadToDelete ? (
            <span>
              Are you sure you want to permanently delete the lead for{' '}
              <strong className="text-slate-900 dark:text-white">
                "{leadToDelete.businessName}"
              </strong>{' '}
              ({leadToDelete.email})? This action cannot be undone.
            </span>
          ) : null
        }
        confirmText="Delete Permanently"
        variant="danger"
        isLoading={Boolean(mutatingId)}
      />
      </div>
    </AdminShell>
  )
}
