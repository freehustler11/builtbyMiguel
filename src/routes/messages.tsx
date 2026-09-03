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
} from 'lucide-react'
import { requireAuth } from '../lib/auth'
import {
  getMessagesServerFn,
  updateMessageStatusServerFn,
  deleteMessageServerFn,
} from '../server/messages'
import { AdminNav } from '../components/AdminNav'
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
  }

  const handleStatusChange = async (
    id: string,
    newStatus: 'new' | 'contacted' | 'archived',
  ) => {
    try {
      setMutatingId(id)
      await updateMessageStatusServerFn({ data: { id, status: newStatus } })
      if (activeLeadModal && activeLeadModal.id === id) {
        setActiveLeadModal({ ...activeLeadModal, status: newStatus })
      }
      await router.invalidate()
    } catch (err) {
      console.error('Failed to update message status:', err)
    } finally {
      setMutatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) {
      return
    }
    try {
      setMutatingId(id)
      if (activeLeadModal && activeLeadModal.id === id) {
        setActiveLeadModal(null)
      }
      await deleteMessageServerFn({ data: { id } })
      await router.invalidate()
    } catch (err) {
      console.error('Failed to delete message:', err)
    } finally {
      setMutatingId(null)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
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

      {/* Top Bento Insights & KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Total Inbound
            </span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalLeads}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>All recorded submissions</span>
          </div>
        </div>

        {/* New Unread Inquiries */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              New Inquiries
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {newLeads}
          </div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
            Requires initial review
          </div>
        </div>

        {/* Contacted / Actioned */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-cyan-500/30 dark:border-cyan-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Contacted
            </span>
            <UserCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
            {contactedLeads}
          </div>
          <div className="text-[11px] text-cyan-700/80 dark:text-cyan-400/80 font-medium">
            Responses dispatched
          </div>
        </div>

        {/* Action Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Action Rate
            </span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Leads moved to contacted
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Source Selector & Search */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Left: Status Filter Tabs & Type Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner overflow-x-auto">
            <button
              type="button"
              onClick={() => handleStatusTab('all')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                status === 'new'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>New</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                {counts.new}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusTab('contacted')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                status === 'contacted'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Contacted</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-bold">
                {counts.contacted}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusTab('archived')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                status === 'archived'
                  ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archived</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {counts.archived}
              </span>
            </button>
          </div>

          {/* Lead Source Filter */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                type === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => handleTypeFilter('audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                type === 'audit'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              Audit Requests
            </button>
            <button
              type="button"
              onClick={() => handleTypeFilter('contact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                type === 'contact'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              Contact Form
            </button>
          </div>
        </div>

        {/* Right: Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md flex items-center"
        >
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search leads by name, email, company, city..."
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

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching leads found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {q
                ? `No submissions matched your query "${q}". Try clearing the search filter.`
                : `There are currently no leads under the selected status/type.`}
            </p>
          </div>
          {(q || type !== 'all' || status !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                navigate({
                  to: '.',
                  search: { status: 'all', type: 'all', q: undefined },
                })
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
            >
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((item) => {
            const isMutating = mutatingId === item.id
            const isAudit = item.type === 'audit'

            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md ${
                  item.status === 'new'
                    ? 'border-emerald-500/50 dark:border-emerald-500/40 ring-1 ring-emerald-500/10'
                    : 'border-slate-200/80 dark:border-slate-800'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Top Row: Badges, Name, Time, and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isAudit
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50'
                          : 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-900/50'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isAudit ? '5-Min Audit Request' : 'Direct Contact Form'}</span>
                    </span>

                    {/* Status Indicator Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold ${
                        item.status === 'new'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : item.status === 'contacted'
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'new'
                            ? 'bg-emerald-500'
                            : item.status === 'contacted'
                              ? 'bg-cyan-500'
                              : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize">{item.status}</span>
                    </span>

                    {/* Timestamp */}
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Quick Inspect Modal Button */}
                    <button
                      type="button"
                      onClick={() => setActiveLeadModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    {item.status !== 'new' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'new')}
                        title="Mark as New"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      >
                        Mark New
                      </button>
                    )}

                    {item.status !== 'contacted' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'contacted')}
                        title="Mark as Contacted"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {item.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'archived')}
                        title="Archive message"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                        aria-label="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Delete permanently"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Lead Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Name & Contact */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Contact Name
                    </span>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-rose-600 dark:hover:text-rose-400 underline decoration-slate-300 dark:decoration-slate-700 truncate"
                      >
                        {item.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.email, `email-${item.id}`)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedId === `email-${item.id}` ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Business Entity
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <Building className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{item.businessName || '—'}</span>
                    </div>
                  </div>

                  {/* Location / Area */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Target City / Market
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.location || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Website URL
                    </span>
                    {item.websiteUrl ? (
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <a
                          href={
                            item.websiteUrl.startsWith('http')
                              ? item.websiteUrl
                              : `https://${item.websiteUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline truncate max-w-[180px] flex items-center gap-1 font-mono font-medium"
                        >
                          <span>{item.websiteUrl.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-mono">No website provided</div>
                    )}
                  </div>
                </div>

                {/* Message Body Box */}
                {item.message && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Inquiry Details & Scope</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                )}

                {/* Bottom Quick Reply & Action Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {item.id.substring(0, 8)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveLeadModal(item)}
                      className="text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Full Details & Timeline
                    </button>
                  </div>

                  <a
                    href={`mailto:${item.email}?subject=Regarding your ${item.type === 'audit' ? 'audit request' : 'inquiry'} with Built by Miguel&body=Hi ${item.name},%0D%0A%0D%0AThank you for getting in touch regarding ${item.businessName || 'your business'}.%0D%0A%0D%0ABest regards,%0D%0AMiguel`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email Reply</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Interactive Lead Inspection Modal */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                      activeLeadModal.type === 'audit'
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                        : 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{activeLeadModal.type}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(activeLeadModal.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeLeadModal.name}
                </h2>
                {activeLeadModal.businessName && (
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {activeLeadModal.businessName}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveLeadModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Email Address
                </span>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${activeLeadModal.email}`}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 underline truncate"
                  >
                    {activeLeadModal.email}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(activeLeadModal.email, `modal-email-${activeLeadModal.id}`)
                    }
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {copiedId === `modal-email-${activeLeadModal.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Target Location
                </span>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeLeadModal.location || 'Not specified'}
                </div>
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Target Website URL
                </span>
                {activeLeadModal.websiteUrl ? (
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={
                        activeLeadModal.websiteUrl.startsWith('http')
                          ? activeLeadModal.websiteUrl
                          : `https://${activeLeadModal.websiteUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 underline flex items-center gap-1.5"
                    >
                      <span>{activeLeadModal.websiteUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-mono">No website provided</div>
                )}
              </div>
            </div>

            {/* Modal Message Content */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                Full Message & Discovery Notes
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {activeLeadModal.message || 'No additional message was provided.'}
              </div>
            </div>

            {/* Status Management inside Modal */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Status:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeLeadModal.id, 'new')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition ${
                      activeLeadModal.status === 'new'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeLeadModal.id, 'contacted')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition ${
                      activeLeadModal.status === 'contacted'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Contacted
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeLeadModal.id, 'archived')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition ${
                      activeLeadModal.status === 'archived'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(activeLeadModal.id)}
                  className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 cursor-pointer"
                >
                  Delete Lead
                </button>
                <a
                  href={`mailto:${activeLeadModal.email}?subject=Regarding your ${activeLeadModal.type === 'audit' ? 'audit request' : 'inquiry'} with Built by Miguel&body=Hi ${activeLeadModal.name},%0D%0A%0D%0AThank you for getting in touch.`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
