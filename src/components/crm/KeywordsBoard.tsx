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
  badgeColor: string
}> = [
  {
    id: 'targeting_next',
    label: 'Targeting Next',
    subtitle: 'Primary growth targets — directly feeds the Monthly Performance Report Future Focus section',
    isProminent: true,
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  },
  {
    id: 'ranking',
    label: 'Currently Ranking',
    subtitle: 'Keywords currently holding Google Search top positions',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'in_progress',
    label: 'Optimization In Progress',
    subtitle: 'Active content and on-page optimization campaigns',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
  },
  {
    id: 'research',
    label: 'Keyword Research',
    subtitle: 'Opportunity backlog under discovery and evaluation',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
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
    <div className="space-y-8">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter keywords by term or city/location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-72 text-slate-800 dark:text-slate-200"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredItems.length} total keywords tracked
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsImporterOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 shadow-xs transition cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Import SEMrush CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreate('targeting_next')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Keyword</span>
          </button>
        </div>
      </div>

      {/* Grouped Status Tables */}
      <div className="space-y-8">
        {STATUS_GROUPS.map((group) => {
          const groupItems = filteredItems.filter((it) => it.status === group.id)

          return (
            <div
              key={group.id}
              className={`rounded-3xl border transition-all ${
                group.isProminent
                  ? 'bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-purple-950/20 dark:via-[#111827] dark:to-[#111827] border-purple-300/80 dark:border-purple-800/80 shadow-md ring-1 ring-purple-500/10'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-2xs'
              } p-6 space-y-4`}
            >
              {/* Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {group.isProminent && (
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                      )}
                      <span>{group.label}</span>
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${group.badgeColor}`}
                    >
                      {groupItems.length}
                    </span>
                    {group.isProminent && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-600 text-white uppercase tracking-wider">
                        Report Target Focus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {group.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCreate(group.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to {group.label}</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                        onClick={() => handleSort('keyword')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Keyword</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      {isRollup && <th className="py-2.5 px-3">Client</th>}

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                        onClick={() => handleSort('location')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Market Location</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition text-right"
                        onClick={() => handleSort('volume')}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>Search Volume</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th
                        className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition text-right"
                        onClick={() => handleSort('rank')}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>Rank (Current / Prev)</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>

                      <th className="py-2.5 px-3 text-center">Movement</th>
                      <th className="py-2.5 px-3">Target Landing URL</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {groupItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isRollup ? 8 : 7}
                          className="py-8 text-center text-xs font-mono text-slate-400"
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
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition group"
                          >
                            {/* Keyword */}
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {item.keyword}
                              </span>
                            </td>

                            {/* Client (in Roll-up View) */}
                            {isRollup && (
                              <td className="py-3 px-3">
                                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300">
                                  <Building2 className="w-3 h-3 text-slate-400" />
                                  <span>{item.clientBusinessName || item.clientName}</span>
                                </div>
                              </td>
                            )}

                            {/* Market Location */}
                            <td className="py-3 px-3">
                              {item.location ? (
                                <div className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{item.location}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-mono text-[11px]">—</span>
                              )}
                            </td>

                            {/* Search Volume */}
                            <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                              {item.searchVolume ? item.searchVolume.toLocaleString() : '—'}
                            </td>

                            {/* Rank: Current vs Previous */}
                            <td className="py-3 px-3 text-right font-mono">
                              {item.currentRank !== null ? (
                                <span className="font-bold text-slate-900 dark:text-white">
                                  #{item.currentRank}
                                </span>
                              ) : (
                                <span className="text-slate-400">Not Ranked</span>
                              )}
                              {item.previousRank !== null && (
                                <span className="text-[10px] text-slate-400 ml-1.5">
                                  (prev #{item.previousRank})
                                </span>
                              )}
                            </td>

                            {/* Movement Indicator */}
                            <td className="py-3 px-3 text-center">
                              {movement !== null && movement !== undefined ? (
                                movement > 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <ArrowUp className="w-2.5 h-2.5" />
                                    <span>+{movement}</span>
                                  </span>
                                ) : movement < 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                    <ArrowDown className="w-2.5 h-2.5" />
                                    <span>{movement}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800">
                                    — 0
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
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
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline truncate"
                                >
                                  <Globe className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{item.targetUrl.replace(/^https?:\/\//, '')}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              ) : (
                                <span className="text-slate-400 font-mono text-[11px]">—</span>
                              )}
                            </td>

                            {/* Actions & Status Quick Switcher */}
                            <td className="py-3 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(item, e.target.value as any)}
                                  className="text-[10px] font-mono font-semibold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
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
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(item)}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
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

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Edit Keyword' : 'Track New Target Keyword'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
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

              {/* Keyword & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Keyword Term *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.keyword}
                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                    placeholder="e.g., best emergency dentist"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Market Location (City, Metro)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Miami, FL"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Metrics: Search Volume, Estimated Traffic, Current Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Search Volume
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.searchVolume}
                    onChange={(e) => setFormData({ ...formData, searchVolume: e.target.value })}
                    placeholder="1200"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Est. Traffic
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedTraffic}
                    onChange={(e) => setFormData({ ...formData, estimatedTraffic: e.target.value })}
                    placeholder="350"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Current Rank
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.currentRank}
                    onChange={(e) => setFormData({ ...formData, currentRank: e.target.value })}
                    placeholder="4"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Target Landing URL */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Target Landing Page URL
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://clientdomain.com/landing-page"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Keyword Status Group
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                >
                  {STATUS_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Track Keyword'}
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
