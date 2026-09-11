import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Plus,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  User,
  Users,
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
import { checkAuthServerFn, type ActiveSessionResult } from '../../lib/auth'
import { ConfirmModal } from '../ConfirmModal'
import { ToastContainer, type ToastMessage } from '../Toast'
import { useBoardKeyboardNav } from './useBoardKeyboardNav'

const STATUS_COLUMNS: Array<{
  id: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  label: string
  cardBorder: string
}> = [
  {
    id: 'idea',
    label: 'Topic idea',
    cardBorder: 'border-l-[var(--muted)]',
  },
  {
    id: 'drafting',
    label: 'In drafting',
    cardBorder: 'border-l-[var(--accent)]',
  },
  {
    id: 'review',
    label: 'Internal review',
    cardBorder: 'border-l-[var(--accent)]',
  },
  {
    id: 'approved',
    label: 'Approved',
    cardBorder: 'border-l-[var(--warning)]',
  },
  {
    id: 'live',
    label: 'Live',
    cardBorder: 'border-l-[var(--success)]',
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
  const [currentUser, setCurrentUser] = useState<ActiveSessionResult | null>(null)
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
    notes: string
    targetKeyword: string
    writerId: string
    dueDate: string
    status: 'idea' | 'drafting' | 'review' | 'approved' | 'live'
  }>({
    clientId: clientId || '',
    title: '',
    draftUrl: '',
    liveUrl: '',
    notes: '',
    targetKeyword: '',
    writerId: '',
    dueDate: '',
    status: 'idea',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ClientArticleItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const isRollup = !clientId
  const isStaff = currentUser?.role === 'partner_employee'

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [articles, teamMembers, session] = await Promise.all([
        getClientArticlesServerFn({ data: { clientId, partnerId } }),
        getAgencyTeamPickerServerFn({ data: { partnerId } }),
        checkAuthServerFn().catch(() => null),
      ])
      setItems(articles)
      setTeam(teamMembers)
      if (session) setCurrentUser(session)

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
      notes: '',
      targetKeyword: '',
      writerId: isStaff ? (currentUser?.userId || '') : (team[0]?.id || ''),
      dueDate: '',
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
      notes: item.notes || '',
      targetKeyword: item.targetKeyword || '',
      writerId: item.writerId || '',
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
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
            notes: formData.notes || undefined,
            targetKeyword: formData.targetKeyword || undefined,
            writerId: isStaff ? editingItem.writerId : formData.writerId || null,
            status: formData.status,
            dueDate: formData.dueDate || null,
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
            notes: formData.notes || undefined,
            targetKeyword: formData.targetKeyword || undefined,
            writerId: isStaff ? (currentUser?.userId || undefined) : formData.writerId || undefined,
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

  const { focusedId, setFocusedId } = useBoardKeyboardNav({
    items: filteredItems,
    columns: STATUS_COLUMNS,
    onStatusChange: (item, newStatus) => handleStatusChange(item, newStatus as any),
    onOpenItem: (item) => handleOpenEdit(item),
  })

  return (
    <div className="space-y-3.5">
      {/* Board Header Actions & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search articles by title, keyword, or writer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 text-[13px] rounded-[6px] bg-[var(--panel)] border border-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] w-72 text-[var(--ink)] placeholder-[var(--muted)]"
            />
          </div>
          <span className="text-[12px] text-[var(--muted)] tabular-nums">
            {filteredItems.length} total {filteredItems.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New client article</span>
          </button>
        )}
      </div>

      {/* Board Content */}
      {items.length === 0 ? (
        <div className="p-4 rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-[var(--ink)]">No client article deliverables yet</p>
            <p className="text-[12px] text-[var(--muted)]">Track article briefs, copywriting, design, and publishing status.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New client article</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-[var(--muted)] bg-[var(--canvas)] rounded-[8px] border border-[var(--line)]">
          No articles match your search.
        </div>
      ) : (
        /* Kanban Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
          {STATUS_COLUMNS.map((col) => {
            const colItems = filteredItems.filter((it) => it.status === col.id)
            const isDragging = draggedItemId !== null
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="rounded-[8px] border border-[var(--line)] bg-[var(--canvas)] p-2.5 flex flex-col transition-colors"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[var(--line)]">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[12px] font-medium text-[var(--ink)]">
                      {col.label}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium tabular-nums bg-[var(--panel)] text-[var(--muted)] border border-[var(--line)]">
                      {colItems.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1">
                  {colItems.length === 0 ? (
                    isDragging ? (
                      <div className="py-3.5 rounded-[6px] border border-dashed border-[var(--accent)]/50 bg-[var(--accent)]/5 flex items-center justify-center text-center">
                        <span className="text-[11px] font-medium text-[var(--accent)]">
                          Drop here
                        </span>
                      </div>
                    ) : (
                      <div className="py-1.5 text-center text-[11px] text-[var(--muted)] italic">
                        Empty
                      </div>
                    )
                  ) : (
                    colItems.map((item) => {
                      const isFocused = focusedId === item.id
                      return (
                        <div
                          key={item.id}
                          draggable
                          tabIndex={0}
                          onClick={() => setFocusedId(item.id)}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          className={`p-2.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] border-l-2 ${col.cardBorder} hover:border-[var(--line)] transition cursor-grab active:cursor-grabbing space-y-2 group ${
                            isFocused ? 'ring-2 ring-[var(--accent)] shadow-md' : ''
                          }`}
                        >
                          {/* Client Badge (in Rollup View) */}
                          {isRollup && (
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--muted)] bg-[var(--canvas)] px-1.5 py-0.5 rounded-[4px] border border-[var(--line)] truncate">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {item.clientBusinessName || item.clientName || 'Client'}
                              </span>
                            </div>
                          )}

                          {/* Card Title & Actions */}
                          <div className="flex items-start justify-between gap-1.5">
                            <h5 className="text-[12px] font-medium text-[var(--ink)] line-clamp-2 leading-snug">
                              {item.title}
                            </h5>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenEdit(item)
                                }}
                                className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteTarget(item)
                                }}
                                className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--canvas)] transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Target Keyword */}
                          {item.targetKeyword && (
                            <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                              <Hash className="w-3 h-3 text-[var(--muted)] shrink-0" />
                              <span className="text-[11px] font-medium text-[var(--ink)] truncate">
                                {item.targetKeyword}
                              </span>
                            </div>
                          )}

                          {/* Links: Draft / Live URLs */}
                          <div className="space-y-0.5">
                            {item.draftUrl && (
                              <a
                                href={item.draftUrl.startsWith('http') ? item.draftUrl : `https://${item.draftUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline truncate max-w-full"
                                title="Open Google Doc / Draft"
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
                                className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline truncate max-w-full"
                              >
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="truncate">{item.liveUrl.replace(/^https?:\/\//, '')}</span>
                              </a>
                            )}
                          </div>

                          {/* Deliverable Notes */}
                          {item.notes && (
                            <p className="text-[11px] text-[var(--muted)] line-clamp-2 bg-[var(--canvas)] p-1.5 rounded-[4px] border border-[var(--line)]">
                              {item.notes}
                            </p>
                          )}

                          {/* Footer: Writer & Published Date */}
                          <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--muted)]">
                            <div className="flex items-center gap-1.5 truncate">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.writerName || 'Unassigned'}</span>
                            </div>
                            {item.publishedAt && (
                              <div className="flex items-center gap-1 shrink-0 text-[var(--success)]">
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
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Keyboard Navigation Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] select-none">
        <div className="flex flex-wrap items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">K</kbd> Navigate cards</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">1-5</kbd> Move column</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Enter</kbd> Edit</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Esc</kbd> Clear focus</span>
        </div>
        {focusedId && (
          <span className="text-[var(--accent)] font-medium">Card focused</span>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {editingItem ? 'Edit client article deliverable' : 'New client article deliverable'}
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

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Article title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 5 Signs You Need Immediate Dental Treatment"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Target Keyword */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Target keyword
                </label>
                <input
                  type="text"
                  value={formData.targetKeyword}
                  onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
                  placeholder="e.g., emergency dentist signs"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Draft Document URL */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Draft URL (Google Doc / Notion)
                  </label>
                  <input
                    type="url"
                    value={formData.draftUrl}
                    onChange={(e) => setFormData({ ...formData, draftUrl: e.target.value })}
                    placeholder="https://docs.google.com/..."
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Published Live URL */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Published live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://clientdomain.com/blog/article"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Deliverable Notes */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Deliverable notes / outline
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Outline notes, brief specifications, revision comments..."
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Workflow status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Writer Picker (Scoped to agency team) */}
                {isStaff ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assigned writer
                    </label>
                    <div className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] font-medium text-[13px] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Assigned to you</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assigned writer
                    </label>
                    <select
                      value={formData.writerId}
                      onChange={(e) => setFormData({ ...formData, writerId: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    >
                      <option value="">Unassigned writer</option>
                      {team.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name || t.email} ({t.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save changes' : 'Create client article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

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
