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
} from 'lucide-react'
import { requireAuth } from '../lib/auth'
import {
  getMessagesServerFn,
  updateMessageStatusServerFn,
  deleteMessageServerFn,
} from '../server/messages'
import { LogoutButton } from '../components/LogoutButton'
import { AdminNav } from '../components/AdminNav'
import type { Message } from '../db/schema'

interface MessagesSearch {
  status?: 'all' | 'new' | 'contacted' | 'archived'
  q?: string
}

export const Route = createFileRoute('/messages')({
  validateSearch: (search: Record<string, unknown>): MessagesSearch => {
    const status = search.status as MessagesSearch['status']
    return {
      status: ['all', 'new', 'contacted', 'archived'].includes(status || '')
        ? status
        : 'all',
      q: typeof search.q === 'string' ? search.q : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
  },
  loaderDeps: ({ search }) => ({
    status: search.status || 'all',
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
      { title: 'Messages & Inbound Leads | Built by Miguel Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: MessagesPage,
})

function MessagesPage() {
  const { messages, counts } = Route.useLoaderData()
  const { status = 'all', q = '' } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(q)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  const handleStatusTab = (newStatus: 'all' | 'new' | 'contacted' | 'archived') => {
    navigate({
      search: (prev) => ({ ...prev, status: newStatus }),
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      search: (prev) => ({ ...prev, q: searchInput.trim() || undefined }),
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
      await router.invalidate()
    } catch (err) {
      console.error('Failed to update message status:', err)
    } finally {
      setMutatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) {
      return
    }
    try {
      setMutatingId(id)
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
        title="Inbound Messages & Leads"
        description="Real-time inquiries captured from the website audit and contact forms."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
            />
            <span>Refresh Leads</span>
          </button>
        }
      />

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
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
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'contacted'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'archived'
                ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm'
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

        {/* Search Bar */}
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
            className="w-full pl-10 pr-20 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No messages found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {q
                ? `No messages matched your query "${q}". Try clearing the search.`
                : `There are currently no messages under the "${status}" status.`}
            </p>
          </div>
          {q && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                navigate({ search: (prev) => ({ ...prev, q: undefined }) })
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => {
            const isMutating = mutatingId === item.id
            const isAudit = item.type === 'audit'

            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-md ${
                  item.status === 'new'
                    ? 'border-emerald-500/40 dark:border-emerald-500/30'
                    : 'border-slate-200/80 dark:border-slate-800'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Top Row: Badges, Name, Time, and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isAudit
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50'
                          : 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-900/50'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{item.type}</span>
                    </span>

                    {/* Status Indicator */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
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
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {item.status !== 'new' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'new')}
                        title="Mark as New"
                        className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      >
                        Mark New
                      </button>
                    )}

                    {item.status !== 'contacted' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'contacted')}
                        title="Mark as Contacted"
                        className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {item.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'archived')}
                        title="Archive message"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                        aria-label="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Delete permanently"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
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
                      Lead Name
                    </span>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-rose-600 dark:hover:text-rose-400 underline decoration-slate-300 dark:decoration-slate-700"
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
                      Business Name
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <Building className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{item.businessName || '—'}</span>
                    </div>
                  </div>

                  {/* Location / Area */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Target City / Area
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
                          className="hover:underline truncate max-w-[180px] flex items-center gap-1 font-mono"
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
                      <span>Project Details & Requirements</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                )}

                {/* Bottom Quick Reply Bar */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {item.id.substring(0, 8)}...
                  </span>

                  <a
                    href={`mailto:${item.email}?subject=Regarding your ${item.type} request with Built by Miguel&body=Hi ${item.name},%0D%0A%0D%0AThank you for reaching out regarding ${item.businessName || 'your business'}.`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
