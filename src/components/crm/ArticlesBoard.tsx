import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  User,
  CheckCircle2,
  Building2,
  Search,
  PenTool,
  Hash,
} from 'lucide-react'
import {
  getClientArticlesServerFn,
  createClientArticleServerFn,
  updateClientArticleStatusServerFn,
  updateClientArticleServerFn,
  deleteClientArticleServerFn,
  getAgencyTeamPickerServerFn,
  type ClientArticleItem,
  type TeamPickerMember,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { ConfirmModal } from '../ConfirmModal'

const STATUS_COLUMNS: Array<{
  id: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  label: string
  color: string
  bg: string
  border: string
  badgeBg: string
}> = [
  {
    id: 'idea',
    label: 'Topic Idea',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-200 dark:border-slate-800',
    badgeBg: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  },
  {
    id: 'drafting',
    label: 'In Drafting',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50/40 dark:bg-blue-950/20',
    border: 'border-blue-200/60 dark:border-blue-900/40',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'review',
    label: 'Internal Review',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50/40 dark:bg-amber-950/20',
    border: 'border-amber-200/60 dark:border-amber-900/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'approved',
    label: 'Approved',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50/40 dark:bg-purple-950/20',
    border: 'border-purple-200/60 dark:border-purple-900/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
  },
  {
    id: 'live',
    label: 'Published Live',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    border: 'border-emerald-200/60 dark:border-emerald-900/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  },
]

export interface ArticlesBoardProps {
  clientId?: string
  partnerId?: string
}

export function ArticlesBoard({ clientId, partnerId }: ArticlesBoardProps) {
  const [items, setItems] = useState<ClientArticleItem[]>([])
  const [team, setTeam] = useState<TeamPickerMember[]>([])
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Drag and drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  // Create / Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ClientArticleItem | null>(null)
  const [formData, setFormData] = useState<{
    clientId: string
    title: string
    draftUrl: string
    liveUrl: string
    targetKeyword: string
    writerId: string
    status: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  }>({
    clientId: clientId || '',
    title: '',
    draftUrl: '',
    liveUrl: '',
    targetKeyword: '',
    writerId: '',
    status: 'idea',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ClientArticleItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isRollup = !clientId

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [articles, teamMembers] = await Promise.all([
        getClientArticlesServerFn({ data: { clientId, partnerId } }),
        getAgencyTeamPickerServerFn({ data: { partnerId } }),
      ])
      setItems(articles)
      setTeam(teamMembers)

      if (isRollup) {
        const { clients } = await getClientsServerFn({ data: { partnerId } })
        setClientsList(clients)
      }
    } catch (err) {
      console.error('Failed to load articles board:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId, partnerId])

  const handleStatusChange = async (
    item: ClientArticleItem,
    newStatus: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  ) => {
    if (item.status === newStatus) return

    try {
      const updated = await updateClientArticleStatusServerFn({
        data: { id: item.id, status: newStatus },
      })
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, ...updated } : it)))
    } catch (err) {
      console.error('Failed to update article status:', err)
      loadData()
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    setDraggedItemId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (
    e: React.DragEvent,
    targetStatus: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  ) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedItemId
    setDraggedItemId(null)
    if (!id) return

    const item = items.find((it) => it.id === id)
    if (item && item.status !== targetStatus) {
      handleStatusChange(item, targetStatus)
    }
  }

  // Open creation modal
  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      clientId: clientId || (clientsList[0]?.id || ''),
      title: '',
      draftUrl: '',
      liveUrl: '',
      targetKeyword: '',
      writerId: team[0]?.id || '',
      status: 'idea',
    })
    setIsEditModalOpen(true)
  }

  // Open edit modal
  const handleOpenEdit = (item: ClientArticleItem) => {
    setEditingItem(item)
    setFormData({
      clientId: item.clientId,
      title: item.title,
      draftUrl: item.draftUrl || '',
      liveUrl: item.liveUrl || '',
      targetKeyword: item.targetKeyword || '',
      writerId: item.writerId || '',
      status: item.status,
    })
    setIsEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      setIsSubmitting(true)
      if (editingItem) {
        const updated = await updateClientArticleServerFn({
          data: {
            id: editingItem.id,
            title: formData.title,
            draftUrl: formData.draftUrl || undefined,
            liveUrl: formData.liveUrl || undefined,
            targetKeyword: formData.targetKeyword || undefined,
            writerId: formData.writerId || null,
            status: formData.status,
          },
        })
        const writer = team.find((t) => t.id === updated.writerId)
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...updated,
                  writerName: writer?.name || null,
                  writerEmail: writer?.email || null,
                }
              : it
          )
        )
      } else {
        const created = await createClientArticleServerFn({
          data: {
            clientId: formData.clientId,
            title: formData.title,
            draftUrl: formData.draftUrl || undefined,
            liveUrl: formData.liveUrl || undefined,
            targetKeyword: formData.targetKeyword || undefined,
            writerId: formData.writerId || undefined,
            status: formData.status,
          },
        })
        const clientObj = clientsList.find((c) => c.id === formData.clientId)
        const writer = team.find((t) => t.id === created.writerId)
        const newItem: ClientArticleItem = {
          ...created,
          clientBusinessName: clientObj?.businessName,
          clientName: clientObj?.name,
          writerName: writer?.name || null,
          writerEmail: writer?.email || null,
        }
        setItems((prev) => [newItem, ...prev])
      }
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to save article deliverable:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteClientArticleServerFn({ data: { id: deleteTarget.id } })
      setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete article deliverable:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter((it) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      it.title.toLowerCase().includes(q) ||
      it.targetKeyword?.toLowerCase().includes(q) ||
      it.clientBusinessName?.toLowerCase().includes(q) ||
      it.writerName?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Board Header Actions & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title, keyword, or writer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-72 text-slate-800 dark:text-slate-200"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredItems.length} total {filteredItems.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Article</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start min-h-[500px]">
        {STATUS_COLUMNS.map((col) => {
          const colItems = filteredItems.filter((it) => it.status === col.id)
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border ${col.border} ${col.bg} p-3.5 flex flex-col min-h-[480px] transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold tracking-wide uppercase ${col.color}`}>
                    {col.label}
                  </h4>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${col.badgeBg}`}
                  >
                    {colItems.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {colItems.length === 0 ? (
                  <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 flex items-center justify-center p-4 text-center">
                    <span className="text-[11px] font-mono text-slate-400">
                      Drop articles here
                    </span>
                  </div>
                ) : (
                  colItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition cursor-grab active:cursor-grabbing space-y-2.5 group"
                    >
                      {/* Client Badge (in Rollup View) */}
                      {isRollup && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 px-2 py-0.5 rounded-md border border-rose-200/50 dark:border-rose-900/40 truncate">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {item.clientBusinessName || item.clientName || 'Client'}
                          </span>
                        </div>
                      )}

                      {/* Card Title & Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {item.title}
                        </h5>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Target Keyword */}
                      {item.targetKeyword && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                            {item.targetKeyword}
                          </span>
                        </div>
                      )}

                      {/* Links: Draft / Live URLs */}
                      <div className="space-y-1">
                        {item.draftUrl && (
                          <a
                            href={item.draftUrl.startsWith('http') ? item.draftUrl : `https://${item.draftUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline truncate max-w-full"
                          >
                            <FileText className="w-3 h-3 shrink-0" />
                            <span className="truncate">Draft Doc</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        )}
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl.startsWith('http') ? item.liveUrl : `https://${item.liveUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline truncate max-w-full"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.liveUrl.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>

                      {/* Footer: Writer & Published Date */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <div className="flex items-center gap-1 truncate">
                          <PenTool className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">
                            {item.writerName || item.writerEmail || 'Unassigned Writer'}
                          </span>
                        </div>
                        {item.publishedAt && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>
                              {new Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                              }).format(new Date(item.publishedAt))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
                {editingItem ? 'Edit Client Article Deliverable' : 'New Client Article Deliverable'}
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

              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 5 Signs You Need Immediate Dental Treatment"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Target Keyword */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Target Keyword
                </label>
                <input
                  type="text"
                  value={formData.targetKeyword}
                  onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
                  placeholder="e.g., emergency dentist signs"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Draft Document URL */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Draft URL (Google Doc / Notion)
                  </label>
                  <input
                    type="url"
                    value={formData.draftUrl}
                    onChange={(e) => setFormData({ ...formData, draftUrl: e.target.value })}
                    placeholder="https://docs.google.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                {/* Published Live URL */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Published Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://clientdomain.com/blog/article"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Workflow Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Writer Picker (Scoped to agency team) */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Assigned Writer
                  </label>
                  <select
                    value={formData.writerId}
                    onChange={(e) => setFormData({ ...formData, writerId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="">Unassigned Writer</option>
                    {team.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name || t.email} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Client Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Client Article Deliverable"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
