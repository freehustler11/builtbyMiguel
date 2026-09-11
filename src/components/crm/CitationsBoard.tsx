import React, { useState, useEffect } from 'react'
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Building2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Globe,
  Key,
  User,
  ShieldAlert,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react'
import {
  getCitationsServerFn,
  createCitationServerFn,
  updateCitationServerFn,
  deleteCitationServerFn,
  type CitationItem,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { ConfirmModal } from '../ConfirmModal'
import { useBoardKeyboardNav } from './useBoardKeyboardNav'

const CITATION_COLUMNS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'live', label: 'Live & Verified' },
  { id: 'needs_update', label: 'Needs Update' },
]

const STATUS_TABS: Array<{
  id: 'all' | 'submitted' | 'live' | 'needs_update'
  label: string
}> = [
  { id: 'all', label: 'All citations' },
  { id: 'live', label: 'Live & verified' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'needs_update', label: 'Needs update' },
]

const POPULAR_DIRECTORIES = [
  'Google Business Profile',
  'Yelp',
  'Apple Maps',
  'Bing Places',
  'YellowPages',
  'Better Business Bureau (BBB)',
  'Facebook Local',
  'MapQuest',
  'TripAdvisor',
  'Angi (Angie\'s List)',
  'Thumbtack',
  'Nextdoor',
  'Foursquare',
  'Chamber of Commerce',
  'Manta',
]

export interface CitationsBoardProps {
  clientId?: string
  partnerId?: string
}

export function CitationsBoard({ clientId, partnerId }: CitationsBoardProps) {
  const [items, setItems] = useState<CitationItem[]>([])
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'live' | 'needs_update'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Show/hide passwords
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Create / Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CitationItem | null>(null)
  const [formData, setFormData] = useState<{
    clientId: string
    directory: string
    listingUrl: string
    username: string
    password: string
    status: 'submitted' | 'pending' | 'live' | 'needs_update'
    notes: string
  }>({
    clientId: clientId || '',
    directory: '',
    listingUrl: '',
    username: '',
    password: '',
    status: 'submitted',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<CitationItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isRollup = !clientId

  const loadData = async () => {
    try {
      setIsLoading(true)
      const citations = await getCitationsServerFn({
        data: {
          clientId,
          partnerId,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      })
      setItems(citations)

      if (isRollup) {
        const { clients } = await getClientsServerFn({ data: { partnerId } })
        setClientsList(clients)
      }
    } catch (err) {
      console.error('Failed to load citations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId, partnerId, statusFilter])

  const togglePasswordReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      clientId: clientId || (clientsList[0]?.id || ''),
      directory: '',
      listingUrl: '',
      username: '',
      password: '',
      status: 'submitted',
      notes: '',
    })
    setIsEditModalOpen(true)
  }

  const handleOpenEdit = (item: CitationItem) => {
    setEditingItem(item)
    setFormData({
      clientId: item.clientId,
      directory: item.directory,
      listingUrl: item.listingUrl || '',
      username: item.username || '',
      password: item.password || '',
      status: item.status,
      notes: item.notes || '',
    })
    setIsEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.directory.trim()) return

    try {
      setIsSubmitting(true)
      if (editingItem) {
        const updated = await updateCitationServerFn({
          data: {
            id: editingItem.id,
            directory: formData.directory,
            listingUrl: formData.listingUrl || undefined,
            username: formData.username || undefined,
            password: formData.password || undefined,
            status: formData.status,
            notes: formData.notes || undefined,
          },
        })
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...updated,
                }
              : it
          )
        )
      } else {
        const created = await createCitationServerFn({
          data: {
            clientId: formData.clientId,
            directory: formData.directory,
            listingUrl: formData.listingUrl || undefined,
            username: formData.username || undefined,
            password: formData.password || undefined,
            status: formData.status,
            notes: formData.notes || undefined,
          },
        })
        const clientObj = clientsList.find((c) => c.id === formData.clientId)
        const newItem: CitationItem = {
          ...created,
          clientBusinessName: clientObj?.businessName,
          clientName: clientObj?.name,
        }
        setItems((prev) => [newItem, ...prev])
      }
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to save citation:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteCitationServerFn({ data: { id: deleteTarget.id } })
      setItems((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete citation:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter((it) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      it.directory.toLowerCase().includes(q) ||
      it.listingUrl?.toLowerCase().includes(q) ||
      it.username?.toLowerCase().includes(q) ||
      it.notes?.toLowerCase().includes(q) ||
      it.clientBusinessName?.toLowerCase().includes(q) ||
      it.clientName?.toLowerCase().includes(q)
    )
  })

  const { focusedId, setFocusedId } = useBoardKeyboardNav({
    items: filteredItems,
    columns: CITATION_COLUMNS,
    onStatusChange: async (item, newStatus) => {
      try {
        const updated = await updateCitationServerFn({
          data: {
            id: item.id,
            directory: item.directory,
            status: newStatus as any,
          },
        })
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, ...updated } : it))
        )
      } catch (err) {
        console.error('Failed to update citation status:', err)
      }
    },
    onOpenItem: (item) => handleOpenEdit(item),
  })

  const getStatusBadge = (status: 'submitted' | 'pending' | 'live' | 'needs_update') => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--success)] border border-[var(--line)]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Live &amp; verified</span>
          </span>
        )
      case 'submitted':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--warning)] border border-[var(--line)]">
            <Clock className="w-3 h-3" />
            <span>Submitted</span>
          </span>
        )
      case 'needs_update':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--danger)] border border-[var(--line)]">
            <ShieldAlert className="w-3 h-3" />
            <span>Needs update</span>
          </span>
        )
    }
  }

  const getCardStatusBorder = (status: 'submitted' | 'pending' | 'live' | 'needs_update') => {
    switch (status) {
      case 'live':
        return 'border-l-[var(--success)]'
      case 'submitted':
      case 'pending':
        return 'border-l-[var(--warning)]'
      case 'needs_update':
        return 'border-l-[var(--danger)]'
    }
  }

  return (
    <div className="space-y-3.5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-[var(--canvas)] rounded-[6px] border border-[var(--line)] overflow-x-auto max-w-full">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search & Add Citation */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search citations..."
              className="w-full pl-9 pr-3.5 h-8 text-[13px] rounded-[6px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add citation</span>
          </button>
        </div>
      </div>

      {/* Citations Grid */}
      {isLoading ? (
        <div className="py-8 text-center text-[13px] text-[var(--muted)]">
          Loading citation records...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-4 text-center sm:text-left text-[13px] text-[var(--muted)] bg-[var(--canvas)] rounded-[8px] border border-dashed border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-[var(--ink)]">No citation records found</p>
            <p className="text-[12px] text-[var(--muted)]">
              Track business directories, listing URLs, and login credentials for NAP consistency.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add citation</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isRevealed = revealedIds.has(item.id)
            const isFocused = focusedId === item.id
            return (
              <div
                key={item.id}
                tabIndex={0}
                onClick={() => setFocusedId(item.id)}
                className={`p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] border-l-2 ${getCardStatusBorder(item.status)} transition flex flex-col justify-between group space-y-3 cursor-pointer ${isFocused ? 'ring-2 ring-[var(--accent)] shadow-md' : ''}`}
              >
                {/* Header: Directory Name + Status */}
                <div className="space-y-2">
                  {isRollup && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)] bg-[var(--canvas)] px-2 py-0.5 rounded-[6px] border border-[var(--line)] truncate">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {item.clientBusinessName || item.clientName || 'Client'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-medium text-[var(--ink)] truncate">
                        {item.directory}
                      </h4>
                      {item.listingUrl ? (
                        <a
                          href={item.listingUrl.startsWith('http') ? item.listingUrl : `https://${item.listingUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline truncate max-w-full mt-0.5"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">View listing</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-[var(--muted)] italic">
                          No URL recorded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {getStatusBadge(item.status)}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--canvas)] transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credentials Vault Box */}
                <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-2 text-[13px]">
                  {/* Username */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[var(--muted)] text-[11px] shrink-0">
                      <User className="w-3 h-3" />
                      <span>User:</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[var(--ink)] font-medium truncate select-all">
                        {item.username || '—'}
                      </span>
                      {item.username && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.username!, `u-${item.id}`)}
                          className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] transition cursor-pointer"
                          title="Copy Username"
                        >
                          {copiedId === `u-${item.id}` ? (
                            <Check className="w-3 h-3 text-[var(--success)]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2">
                    <div className="flex items-center gap-1.5 text-[var(--muted)] text-[11px] shrink-0">
                      <Key className="w-3 h-3" />
                      <span>Pass:</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[var(--ink)] font-medium truncate">
                        {!item.password
                          ? '—'
                          : isRevealed
                          ? item.password
                          : '••••••••••••'}
                      </span>
                      {item.password && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => togglePasswordReveal(item.id)}
                            className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] transition cursor-pointer"
                            title={isRevealed ? 'Hide Password' : 'Show Password'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.password!, `p-${item.id}`)}
                            className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] transition cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedId === `p-${item.id}` ? (
                              <Check className="w-3 h-3 text-[var(--success)]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {item.notes && (
                  <p className="text-[11px] text-[var(--muted)] line-clamp-2 bg-[var(--canvas)] p-2 rounded-[6px] border border-[var(--line)]">
                    {item.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Keyboard Navigation Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] select-none">
        <div className="flex flex-wrap items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">K</kbd> Navigate citations</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">1-3</kbd> Set status (1: Submitted, 2: Live, 3: Needs Update)</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Enter</kbd> Edit</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Esc</kbd> Clear focus</span>
        </div>
        {focusedId && (
          <span className="text-[var(--accent)] font-medium">Citation focused</span>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {editingItem ? 'Edit directory citation' : 'Add directory citation'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
              {/* Client Selector (Roll-up mode only) */}
              {isRollup && (
                <div className="space-y-1.5">
                  <label className="font-medium text-[var(--ink)]">
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                    disabled={Boolean(editingItem)}
                    className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] font-normal cursor-pointer"
                  >
                    <option value="" disabled>Select client...</option>
                    {clientsList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Directory Name with Quick Select */}
              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Directory / platform name *
                </label>
                <input
                  type="text"
                  required
                  list="popular-directories"
                  value={formData.directory}
                  onChange={(e) => setFormData({ ...formData, directory: e.target.value })}
                  placeholder="e.g., Yelp, YellowPages, Google Business Profile"
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] font-normal"
                />
                <datalist id="popular-directories">
                  {POPULAR_DIRECTORIES.map((dir) => (
                    <option key={dir} value={dir} />
                  ))}
                </datalist>
              </div>

              {/* Listing URL */}
              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Listing live URL
                </label>
                <input
                  type="url"
                  value={formData.listingUrl}
                  onChange={(e) => setFormData({ ...formData, listingUrl: e.target.value })}
                  placeholder="https://www.yelp.com/biz/..."
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <div className="space-y-1.5">
                  <label className="font-medium text-[var(--ink)]">
                    Account username / email
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g., admin@business.com"
                    className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[var(--ink)]">
                    Account password / PIN
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g., Pass123!"
                    className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Verification status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] font-normal cursor-pointer"
                >
                  <option value="submitted">Submitted (Pending Review / Pin Verification)</option>
                  <option value="live">Live &amp; Verified (Active)</option>
                  <option value="needs_update">Needs Update (NAP Discrepancy / Suspended)</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Notes / verification details
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Postcard pin required, phone verification sent to client..."
                  className="w-full p-2.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--canvas)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save changes' : 'Add citation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Citation Record"
        description={`Are you sure you want to delete citation for "${deleteTarget?.directory}"? This will permanently remove its credentials and tracking.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}

