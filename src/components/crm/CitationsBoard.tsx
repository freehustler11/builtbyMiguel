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

const STATUS_TABS: Array<{
  id: 'all' | 'submitted' | 'live' | 'needs_update'
  label: string
  color: string
}> = [
  { id: 'all', label: 'All Citations', color: 'text-slate-700 dark:text-slate-300' },
  { id: 'live', label: 'Live & Verified', color: 'text-emerald-700 dark:text-emerald-300' },
  { id: 'submitted', label: 'Submitted (Pending)', color: 'text-amber-700 dark:text-amber-300' },
  { id: 'needs_update', label: 'Needs Update', color: 'text-rose-700 dark:text-rose-300' },
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

  const getStatusBadge = (status: 'submitted' | 'pending' | 'live' | 'needs_update') => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Live &amp; Verified</span>
          </span>
        )
      case 'submitted':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            <Clock className="w-3 h-3" />
            <span>Submitted</span>
          </span>
        )
      case 'needs_update':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            <ShieldAlert className="w-3 h-3" />
            <span>Needs Update</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search citations or credentials..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Citation</span>
          </button>
        </div>
      </div>

      {/* Citations Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-400">
          Loading citation records and credentials...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <Globe className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
          <p>No citation records found.</p>
          <p className="text-[11px] text-slate-500">
            Track business directories, listing URLs, and login credentials for NAP consistency.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isRevealed = revealedIds.has(item.id)
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between group space-y-4"
              >
                {/* Header: Directory Name + Status */}
                <div className="space-y-2">
                  {isRollup && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 px-2 py-0.5 rounded-md border border-rose-200/50 dark:border-rose-900/40 truncate">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {item.clientBusinessName || item.clientName || 'Client'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.directory}
                      </h4>
                      {item.listingUrl ? (
                        <a
                          href={item.listingUrl.startsWith('http') ? item.listingUrl : `https://${item.listingUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline truncate max-w-full mt-0.5"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">View Listing</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 italic">
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
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credentials Vault Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  {/* Username */}
                  <div className="flex items-center justify-between gap-2 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0">
                      <User className="w-3 h-3" />
                      <span>User:</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold truncate select-all">
                        {item.username || '—'}
                      </span>
                      {item.username && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.username!, `u-${item.id}`)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
                          title="Copy Username"
                        >
                          {copiedId === `u-${item.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between gap-2 font-mono border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0">
                      <Key className="w-3 h-3" />
                      <span>Pass:</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
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
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
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
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedId === `p-${item.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
                    {item.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Edit Directory Citation' : 'Add Directory Citation'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Client Selector (Roll-up mode only) */}
              {isRollup && (
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                    disabled={Boolean(editingItem)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
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
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Directory / Platform Name *
                </label>
                <input
                  type="text"
                  required
                  list="popular-directories"
                  value={formData.directory}
                  onChange={(e) => setFormData({ ...formData, directory: e.target.value })}
                  placeholder="e.g., Yelp, YellowPages, Google Business Profile"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                />
                <datalist id="popular-directories">
                  {POPULAR_DIRECTORIES.map((dir) => (
                    <option key={dir} value={dir} />
                  ))}
                </datalist>
              </div>

              {/* Listing URL */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Listing Live URL
                </label>
                <input
                  type="url"
                  value={formData.listingUrl}
                  onChange={(e) => setFormData({ ...formData, listingUrl: e.target.value })}
                  placeholder="https://www.yelp.com/biz/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Account Username / Email
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g., admin@business.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Account Password / PIN
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g., Pass123!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Verification Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <option value="submitted">Submitted (Pending Review / Pin Verification)</option>
                  <option value="live">Live & Verified (Active)</option>
                  <option value="needs_update">Needs Update (NAP Discrepancy / Suspended)</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Verification Details
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Postcard pin required, phone verification sent to client..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Citation'}
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
