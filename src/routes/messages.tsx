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
import { requireAuth } from '../lib/auth'
import {
  getMessagesServerFn,
  updateMessageStatusServerFn,
  deleteMessageServerFn,
} from '../server/messages'
import { AdminNav } from '../components/AdminNav'
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
    await requireAuth({ location })
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
      { title: 'Inbound Leads & Messages | Built by Miguel Admin' },
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
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(true)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

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
    totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0

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
    addToast('Pipeline Refreshed', 'Loaded the latest lead submissions.', 'info')
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header Navigation Banner */}
      <AdminNav
        activeTab="messages"
        title="Inbound Leads & Inquiries"
        description="Review, inspect, and respond to qualified business leads captured across the website."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
            />
            <span>Refresh Pipeline</span>
          </button>
        }
      />

      {/* Beginner Friendly Quick Workflow Guide Banner (Dismissible / Collapsible) */}
      <div className="rounded-3xl border border-rose-200/80 dark:border-rose-950/60 bg-gradient-to-br from-rose-50/60 via-white to-slate-50 dark:from-rose-950/20 dark:via-[#111827] dark:to-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Beginner's Quick Guide to Managing Leads
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowBeginnerGuide(!showBeginnerGuide)}
            className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <span>{showBeginnerGuide ? 'Hide Guide' : 'Show Guide'}</span>
            {showBeginnerGuide ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showBeginnerGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-rose-100 dark:border-rose-900/30 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono text-[10px]">
                  1
                </span>
                <span>Inspect New Leads</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Click <strong>"Inspect"</strong> on any lead to see their audit URL, location, and full message.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono text-[10px]">
                  2
                </span>
                <span>1-Click Email Outreach</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Click <strong>"Email Client"</strong> to immediately draft a personalized response in your email client.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                  3
                </span>
                <span>Update Status</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Switch from <strong>New</strong> → <strong>Contacted</strong> once replied, or <strong>Archive</strong> when closed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Total Inquiries
            </span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalLeads}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            All captured inquiries
          </div>
        </div>

        {/* Actionable New Leads */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-rose-500/30 dark:border-rose-500/20 shadow-xs space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              New Leads
            </span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {newLeads}
          </div>
          <div className="text-[11px] text-rose-700/80 dark:text-rose-400/80 font-medium">
            Requires initial review
          </div>
        </div>

        {/* Contacted Leads */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              In Contact
            </span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {contactedLeads}
          </div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
            Active conversations
          </div>
        </div>

        {/* Conversion Velocity */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Contact Rate
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Leads moved to contacted
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'new'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>New</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold">
              {counts.new}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('contacted')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'contacted'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Contacted</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              {counts.contacted}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('archived')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'archived'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archived</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
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

      {/* Leads Pipeline Cards List */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No leads match your filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((item) => {
            const isMutating = mutatingId === item.id
            const isAudit = item.type === 'audit'
            const isNew = item.status === 'new'
            const isContacted = item.status === 'contacted'

            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md ${
                  isNew
                    ? 'border-rose-500/40 dark:border-rose-500/30'
                    : isContacted
                      ? 'border-emerald-500/40 dark:border-emerald-500/30'
                      : 'border-slate-200/80 dark:border-slate-800'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Header Row: Badges, Date, and Top Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Form Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                        isAudit
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isAudit ? '5-Min Video Audit' : 'Direct Inquiry'}</span>
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                        isNew
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : isContacted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isNew
                            ? 'bg-rose-500'
                            : isContacted
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize">{item.status}</span>
                    </span>

                    {/* Submission Date */}
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </span>
                  </div>

                  {/* Top Status Switcher & Inspect Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Status Toggle Buttons */}
                    {item.status !== 'contacted' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'contacted', item.businessName)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 transition cursor-pointer"
                        title="Mark as Contacted"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {item.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'archived', item.businessName)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                        title="Move to Archived"
                      >
                        Archive
                      </button>
                    )}

                    {item.status === 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'new', item.businessName)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
                        title="Restore to New"
                      >
                        Restore
                      </button>
                    )}

                    {/* Full Inspection Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveLeadModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    {/* Delete Trigger using Custom ConfirmModal */}
                    <button
                      type="button"
                      onClick={() => setLeadToDelete(item)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                      title="Delete lead permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary Prospect Profile Bento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Business & Contact Name */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Business & Contact
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{item.businessName}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Attn: {item.name}
                    </div>
                  </div>

                  {/* Email & Copy Action */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${item.email}?subject=Your%20Website%20Growth%20Audit%20-%20Built%20by%20Miguel`}
                        className="text-xs sm:text-sm font-mono font-medium text-rose-600 dark:text-rose-400 hover:underline truncate"
                      >
                        {item.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.email, `email-${item.id}`, 'Email')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                        title="Copy email"
                      >
                        {copiedId === `email-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {item.location && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Website & Direct Link */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Website URL
                    </div>
                    {item.websiteUrl ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={
                            item.websiteUrl.startsWith('http')
                              ? item.websiteUrl
                              : `https://${item.websiteUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1 truncate"
                        >
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.websiteUrl}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Not provided
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Excerpt / Scope */}
                {item.message && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-rose-500" />
                      <span>Goals & Message</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                )}

                {/* Bottom Direct Email Button */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <a
                    href={`mailto:${item.email}?subject=Your%20Website%20Growth%20Audit%20-%20Built%20by%20Miguel&body=Hi%20${encodeURIComponent(
                      item.name
                    )},%0D%0A%0D%0AThank%20you%20for%20reaching%20out%20regarding%20${encodeURIComponent(
                      item.businessName
                    )}.`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Email Client Now</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
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
  )
}
