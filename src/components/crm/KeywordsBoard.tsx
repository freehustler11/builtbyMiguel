import React, { useState, useEffect } from 'react'
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  Building2,
  Target,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Upload,
} from 'lucide-react'
import {
  getKeywordsServerFn,
  createKeywordServerFn,
  updateKeywordServerFn,
  deleteKeywordServerFn,
  type KeywordItem,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { ConfirmModal } from '../ConfirmModal'
import { SemrushImporterModal } from './SemrushImporterModal'

const STATUS_GROUPS: Array<{
  id: 'targeting_next' | 'ranking' | 'in_progress' | 'research'
  label: string
  subtitle: string
  isProminent?: boolean
}> = [
  {
    id: 'targeting_next',
    label: 'Targeting next',
    subtitle: 'Primary growth targets — directly feeds the Monthly Performance Report Future Focus section',
    isProminent: true,
  },
  {
    id: 'ranking',
    label: 'Currently ranking',
    subtitle: 'Keywords currently holding Google Search top positions',
  },
  {
    id: 'in_progress',
    label: 'Optimization in progress',
    subtitle: 'Active content and on-page optimization campaigns',
  },
  {
    id: 'research',
    label: 'Keyword research',
    subtitle: 'Opportunity backlog under discovery and evaluation',
  },
]

export interface KeywordsBoardProps {
  clientId?: string
  partnerId?: string
}

export function KeywordsBoard({ clientId, partnerId }: KeywordsBoardProps) {
  const [items, setItems] = useState<KeywordItem[]>([])
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortCol, setSortCol] = useState<'keyword' | 'volume' | 'rank' | 'location'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Create / Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KeywordItem | null>(null)
  const [formData, setFormData] = useState<{
    clientId: string
    keyword: string
    location: string
    searchVolume: string
    estimatedTraffic: string
    currentRank: string
    targetUrl: string
    status: 'research' | 'targeting_next' | 'in_progress' | 'ranking'
  }>({
    clientId: clientId || '',
    keyword: '',
    location: '',
    searchVolume: '',
    estimatedTraffic: '',
    currentRank: '',
    targetUrl: '',
    status: 'research',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<KeywordItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isRollup = !clientId

  const loadData = async () => {
    try {
      setIsLoading(true)
      const keywords = await getKeywordsServerFn({
        data: {
          clientId,
          partnerId,
          sort: sortCol,
          order: sortOrder,
        },
      })
      setItems(keywords)

      if (isRollup) {
        const { clients } = await getClientsServerFn({ data: { partnerId } })
        setClientsList(clients)
      }
    } catch (err) {
      console.error('Failed to load keywords:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId, partnerId, sortCol, sortOrder])

  const handleSort = (col: 'keyword' | 'volume' | 'rank' | 'location') => {
    if (sortCol === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortOrder('asc')
    }
  }

  const handleStatusChange = async (
    item: KeywordItem,
    newStatus: 'research' | 'targeting_next' | 'in_progress' | 'ranking'
  ) => {
    if (item.status === newStatus) return
    try {
      const updated = await updateKeywordServerFn({
        data: {
          id: item.id,
          keyword: item.keyword,
          location: item.location || undefined,
          searchVolume: item.searchVolume || undefined,
          estimatedTraffic: item.estimatedTraffic || undefined,
          currentRank: item.currentRank || undefined,
          targetUrl: item.targetUrl || undefined,
          status: newStatus,
        },
      })
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, ...updated } : it)))
    } catch (err) {
      console.error('Failed to update keyword status:', err)
      loadData()
    }
  }

  const handleOpenCreate = (initialStatus?: 'research' | 'targeting_next' | 'in_progress' | 'ranking') => {
    setEditingItem(null)
    setFormData({
      clientId: clientId || (clientsList[0]?.id || ''),
      keyword: '',
      location: '',
      searchVolume: '',
      estimatedTraffic: '',
      currentRank: '',
      targetUrl: '',
      status: initialStatus || 'research',
    })
    setIsEditModalOpen(true)
  }

  const handleOpenEdit = (item: KeywordItem) => {
    setEditingItem(item)
    setFormData({
      clientId: item.clientId,
      keyword: item.keyword,
      location: item.location || '',
      searchVolume: item.searchVolume ? String(item.searchVolume) : '',
      estimatedTraffic: item.estimatedTraffic ? String(item.estimatedTraffic) : '',
      currentRank: item.currentRank ? String(item.currentRank) : '',
      targetUrl: item.targetUrl || '',
      status: item.status,
    })
    setIsEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.keyword.trim()) return

    try {
      setIsSubmitting(true)
      const parsedVol = formData.searchVolume ? parseInt(formData.searchVolume, 10) : undefined
      const parsedTraffic = formData.estimatedTraffic ? parseInt(formData.estimatedTraffic, 10) : undefined
      const parsedRank = formData.currentRank ? parseInt(formData.currentRank, 10) : undefined

      if (editingItem) {
        const updated = await updateKeywordServerFn({
          data: {
            id: editingItem.id,
            keyword: formData.keyword,
            location: formData.location || undefined,
            searchVolume: parsedVol,
            estimatedTraffic: parsedTraffic,
            currentRank: parsedRank,
            targetUrl: formData.targetUrl || undefined,
            status: formData.status,
          },
        })
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...updated } : it)))
      } else {
        const created = await createKeywordServerFn({
          data: {
            clientId: formData.clientId,
            keyword: formData.keyword,
            location: formData.location || undefined,
            searchVolume: parsedVol,
            estimatedTraffic: parsedTraffic,
            currentRank: parsedRank,
            targetUrl: formData.targetUrl || undefined,
            status: formData.status,
          },
        })
        const clientObj = clientsList.find((c) => c.id === formData.clientId)
        const newItem: KeywordItem = {
          ...created,
          clientBusinessName: clientObj?.businessName,
          clientName: clientObj?.name,
          movement: null,
        }
        setItems((prev) => [newItem, ...prev])
      }
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to save keyword:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteKeywordServerFn({ data: { id: deleteTarget.id } })
      setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete keyword:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter((it) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      it.keyword.toLowerCase().includes(q) ||
      it.location?.toLowerCase().includes(q) ||
      it.clientBusinessName?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-3.5">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Filter keywords by term or city/location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 text-[13px] rounded-[6px] bg-[var(--panel)] border border-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] w-72 text-[var(--ink)] placeholder-[var(--muted)]"
            />
          </div>
          <span className="text-[12px] text-[var(--muted)] tabular-nums">
            {filteredItems.length} total keywords tracked
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImporterOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--canvas)] transition cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import SEMrush CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreate('targeting_next')}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Track new keyword</span>
          </button>
        </div>
      </div>

      {/* Board Content */}
      {items.length === 0 ? (
        <div className="p-4 rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-[var(--ink)]">No keywords tracked yet</p>
            <p className="text-[12px] text-[var(--muted)]">Track high-intent search terms, target landing pages, and search volume rankings.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsImporterOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--canvas)] transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreate('targeting_next')}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track keyword</span>
            </button>
          </div>
        </div>
      ) : (
        /* Grouped Status Tables */
        <div className="space-y-3.5">
          {STATUS_GROUPS.map((group) => {
            const groupItems = filteredItems.filter((it) => it.status === group.id)

            return (
              <div
                key={group.id}
                className="rounded-[8px] border border-[var(--line)] bg-[var(--panel)] p-3 space-y-2.5"
              >
                {/* Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium text-[var(--ink)] flex items-center gap-1.5">
                        {group.isProminent && (
                          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                        )}
                        <span>{group.label}</span>
                      </h3>
                      <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium tabular-nums border border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)]">
                        {groupItems.length}
                      </span>
                      {group.isProminent && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium bg-[var(--canvas)] text-[var(--accent)] border border-[var(--line)]">
                          Report target focus
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[var(--muted)]">
                      {group.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCreate(group.id)}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded-[4px] text-[11px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--panel)] transition cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to {group.label}</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--muted)] text-[12px] font-medium">
                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-[var(--ink)] transition"
                        onClick={() => handleSort('keyword')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Keyword</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      {isRollup && <th className="py-2.5 px-3">Client</th>}

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-[var(--ink)] transition"
                        onClick={() => handleSort('location')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Market location</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-[var(--ink)] transition text-right"
                        onClick={() => handleSort('volume')}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>Search volume</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-[var(--ink)] transition text-right"
                        onClick={() => handleSort('rank')}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>Rank (current / prev)</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th className="py-2.5 px-3 text-center">Movement</th>
                      <th className="py-2.5 px-3">Target landing URL</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {groupItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isRollup ? 8 : 7}
                          className="py-8 text-center text-[13px] text-[var(--muted)]"
                        >
                          No keywords in {group.label.toLowerCase()} yet. Click "Add to {group.label}" above.
                        </td>
                      </tr>
                    ) : (
                      groupItems.map((item) => {
                        const movement = item.movement
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[var(--canvas)] transition group"
                          >
                            {/* Keyword */}
                            <td className="py-3 px-3">
                              <span className="font-medium text-[var(--ink)] text-[13px]">
                                {item.keyword}
                              </span>
                            </td>

                            {/* Client (in Roll-up View) */}
                            {isRollup && (
                              <td className="py-3 px-3">
                                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--muted)]">
                                  <Building2 className="w-3 h-3 text-[var(--muted)]" />
                                  <span>{item.clientBusinessName || item.clientName}</span>
                                </div>
                              </td>
                            )}

                            {/* Market Location */}
                            <td className="py-3 px-3">
                              {item.location ? (
                                <div className="inline-flex items-center gap-1 text-[var(--muted)] text-[12px]">
                                  <MapPin className="w-3 h-3 text-[var(--muted)] shrink-0" />
                                  <span>{item.location}</span>
                                </div>
                              ) : (
                                <span className="text-[var(--muted)] text-[12px]">—</span>
                              )}
                            </td>

                            {/* Search Volume */}
                            <td className="py-3 px-3 text-right tabular-nums font-medium text-[var(--ink)]">
                              {item.searchVolume ? item.searchVolume.toLocaleString() : '—'}
                            </td>

                            {/* Rank: Current vs Previous */}
                            <td className="py-3 px-3 text-right tabular-nums">
                              {item.currentRank !== null ? (
                                <span className="font-medium text-[var(--ink)]">
                                  #{item.currentRank}
                                </span>
                              ) : (
                                <span className="text-[var(--muted)]">Not ranked</span>
                              )}
                              {item.previousRank !== null && (
                                <span className="text-[11px] text-[var(--muted)] ml-1.5">
                                  (prev #{item.previousRank})
                                </span>
                              )}
                            </td>

                            {/* Movement Indicator */}
                            <td className="py-3 px-3 text-center">
                              {movement !== null && movement !== undefined ? (
                                movement > 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium tabular-nums bg-[var(--canvas)] text-[var(--success)] border border-[var(--line)]">
                                    <ArrowUp className="w-2.5 h-2.5" />
                                    <span>+{movement}</span>
                                  </span>
                                ) : movement < 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium tabular-nums bg-[var(--canvas)] text-[var(--danger)] border border-[var(--line)]">
                                    <ArrowDown className="w-2.5 h-2.5" />
                                    <span>{movement}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] text-[11px] tabular-nums text-[var(--muted)] bg-[var(--canvas)] border border-[var(--line)]">
                                    — 0
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium text-[var(--accent)] bg-[var(--canvas)] border border-[var(--line)]">
                                  New
                                </span>
                              )}
                            </td>

                            {/* Target URL */}
                            <td className="py-3 px-3 max-w-[180px] truncate">
                              {item.targetUrl ? (
                                <a
                                  href={item.targetUrl.startsWith('http') ? item.targetUrl : `https://${item.targetUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] hover:underline truncate"
                                >
                                  <Globe className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{item.targetUrl.replace(/^https?:\/\//, '')}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              ) : (
                                <span className="text-[var(--muted)] text-[12px]">—</span>
                              )}
                            </td>

                            {/* Actions & Status Quick Switcher */}
                            <td className="py-3 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(item, e.target.value as any)}
                                  className="text-[11px] font-medium py-1 px-2 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                >
                                  {STATUS_GROUPS.map((g) => (
                                    <option key={g.id} value={g.id}>
                                      {g.label}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(item)}
                                  className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--canvas)] transition cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {editingItem ? 'Edit keyword' : 'Track new target keyword'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
              {/* Client Selector (Roll-up mode only) */}
              {isRollup && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                    disabled={Boolean(editingItem)}
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
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

              {/* Keyword & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Keyword term *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.keyword}
                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                    placeholder="e.g., best emergency dentist"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Market location (city, metro)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Miami, FL"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Metrics: Search Volume, Estimated Traffic, Current Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Search volume
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.searchVolume}
                    onChange={(e) => setFormData({ ...formData, searchVolume: e.target.value })}
                    placeholder="1200"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Est. traffic
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedTraffic}
                    onChange={(e) => setFormData({ ...formData, estimatedTraffic: e.target.value })}
                    placeholder="350"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Current rank
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.currentRank}
                    onChange={(e) => setFormData({ ...formData, currentRank: e.target.value })}
                    placeholder="4"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Target Landing URL */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Target landing page URL
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://clientdomain.com/landing-page"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Keyword status group
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                  {STATUS_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save changes' : 'Track keyword'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Tracked Keyword"
        description={`Are you sure you want to delete keyword "${deleteTarget?.keyword}"? All historical rank progression for this keyword will also be removed.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      {/* SEMrush CSV Importer Modal */}
      <SemrushImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onSuccess={() => {
          setIsImporterOpen(false)
          loadData()
        }}
        clientId={clientId}
        clientName={items[0]?.clientBusinessName}
        clientsList={clientsList}
      />
    </div>
  )
}
