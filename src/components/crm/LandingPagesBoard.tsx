import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Plus,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  User,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Building2,
  MoveRight,
  Search,
  Filter,
  FileText,
} from 'lucide-react'
import {
  getLandingPagesServerFn,
  createLandingPageServerFn,
  updateLandingPageStatusServerFn,
  updateLandingPageServerFn,
  deleteLandingPageServerFn,
  getAgencyTeamPickerServerFn,
  type LandingPageItem,
  type TeamPickerMember,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { checkAuthServerFn, type ActiveSessionResult } from '../../lib/auth'
import { ConfirmModal } from '../ConfirmModal'
import { ToastContainer, type ToastMessage } from '../Toast'
import { useBoardKeyboardNav } from './useBoardKeyboardNav'

const STATUS_COLUMNS: Array<{
  id: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
  label: string
  cardBorder: string
}> = [
  {
    id: 'planning',
    label: 'Planning',
    cardBorder: 'border-l-[var(--muted)]',
  },
  {
    id: 'copywriting',
    label: 'Copywriting',
    cardBorder: 'border-l-[var(--accent)]',
  },
  {
    id: 'design',
    label: 'Design',
    cardBorder: 'border-l-[var(--accent)]',
  },
  {
    id: 'client_review',
    label: 'Client review',
    cardBorder: 'border-l-[var(--warning)]',
  },
  {
    id: 'live',
    label: 'Live',
    cardBorder: 'border-l-[var(--success)]',
  },
]

export interface LandingPagesBoardProps {
  clientId?: string
  partnerId?: string
}

export function LandingPagesBoard({ clientId, partnerId }: LandingPagesBoardProps) {
  const [items, setItems] = useState<LandingPageItem[]>([])
  const [team, setTeam] = useState<TeamPickerMember[]>([])
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [currentUser, setCurrentUser] = useState<ActiveSessionResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Drag-and-drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)
  const [livePromptItem, setLivePromptItem] = useState<LandingPageItem | null>(null)
  const [liveUrlInput, setLiveUrlInput] = useState('')

  // Create / Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LandingPageItem | null>(null)
  const [formData, setFormData] = useState<{
    clientId: string
    title: string
    targetUrl: string
    draftUrl: string
    notes: string
    focusKeyword: string
    ctaGoal: string
    assignedTo: string
    dueDate: string
    status: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
  }>({
    clientId: clientId || '',
    title: '',
    targetUrl: '',
    draftUrl: '',
    notes: '',
    focusKeyword: '',
    ctaGoal: '',
    assignedTo: '',
    dueDate: '',
    status: 'planning',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<LandingPageItem | null>(null)
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
      const [lps, teamMembers, session] = await Promise.all([
        getLandingPagesServerFn({ data: { clientId, partnerId } }),
        getAgencyTeamPickerServerFn({ data: { partnerId } }),
        checkAuthServerFn().catch(() => null),
      ])
      setItems(lps)
      setTeam(teamMembers)
      if (session) setCurrentUser(session)

      if (isRollup) {
        const { clients } = await getClientsServerFn({ data: { partnerId } })
        setClientsList(clients)
      }
    } catch (err) {
      console.error('Failed to load landing pages board:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId, partnerId])

  // Status progression
  const handleStatusChange = async (
    item: LandingPageItem,
    newStatus: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
  ) => {
    if (newStatus === 'live' && !item.targetUrl) {
      setLivePromptItem(item)
      setLiveUrlInput('')
      setIsLiveModalOpen(true)
      return
    }

    try {
      const updated = await updateLandingPageStatusServerFn({
        data: {
          id: item.id,
          status: newStatus,
        },
      })
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, ...updated } : it))
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleLivePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!livePromptItem) return

    try {
      const updated = await updateLandingPageStatusServerFn({
        data: {
          id: livePromptItem.id,
          status: 'live',
          liveUrl: liveUrlInput.trim() || undefined,
        },
      })
      setItems((prev) =>
        prev.map((it) => (it.id === livePromptItem.id ? { ...it, ...updated } : it))
      )
      setIsLiveModalOpen(false)
      setLivePromptItem(null)
    } catch (err) {
      console.error('Failed to mark landing page live:', err)
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
    targetStatus: 'planning' | 'copywriting' | 'design' | 'client_review' | 'live'
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

  // Open create modal
  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      clientId: clientId || (clientsList[0]?.id || ''),
      title: '',
      targetUrl: '',
      draftUrl: '',
      notes: '',
      focusKeyword: '',
      ctaGoal: '',
      assignedTo: isStaff ? (currentUser?.userId || '') : (team[0]?.id || ''),
      dueDate: '',
      status: 'planning',
    })
    setIsEditModalOpen(true)
  }

  // Open edit modal
  const handleOpenEdit = (item: LandingPageItem) => {
    setEditingItem(item)
    setFormData({
      clientId: item.clientId,
      title: item.title,
      targetUrl: item.targetUrl || '',
      draftUrl: item.draftUrl || '',
      notes: item.notes || '',
      focusKeyword: item.focusKeyword || '',
      ctaGoal: item.ctaGoal || '',
      assignedTo: item.assignedTo || '',
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
        const updated = await updateLandingPageServerFn({
          data: {
            id: editingItem.id,
            title: formData.title,
            targetUrl: formData.targetUrl || undefined,
            draftUrl: formData.draftUrl || undefined,
            notes: formData.notes || undefined,
            focusKeyword: formData.focusKeyword || undefined,
            ctaGoal: formData.ctaGoal || undefined,
            assignedTo: isStaff ? editingItem.assignedTo : formData.assignedTo || null,
            status: formData.status,
            dueDate: formData.dueDate || null,
          },
        })
        const assignee = team.find((t) => t.id === updated.assignedTo)
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...updated,
                  assigneeName: assignee?.name || null,
                  assigneeEmail: assignee?.email || null,
                }
              : it
          )
        )
      } else {
        const created = await createLandingPageServerFn({
          data: {
            clientId: formData.clientId,
            title: formData.title,
            targetUrl: formData.targetUrl || undefined,
            draftUrl: formData.draftUrl || undefined,
            notes: formData.notes || undefined,
            focusKeyword: formData.focusKeyword || undefined,
            ctaGoal: formData.ctaGoal || undefined,
            assignedTo: isStaff ? (currentUser?.userId || undefined) : formData.assignedTo || undefined,
            status: formData.status,
          },
        })
        const clientObj = clientsList.find((c) => c.id === formData.clientId)
        const assignee = team.find((t) => t.id === created.assignedTo)
        const newItem: LandingPageItem = {
          ...created,
          clientBusinessName: clientObj?.businessName,
          clientName: clientObj?.name,
          assigneeName: assignee?.name || null,
          assigneeEmail: assignee?.email || null,
        }
        setItems((prev) => [newItem, ...prev])
      }
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to save landing page:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteLandingPageServerFn({ data: { id: deleteTarget.id } })
      setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete landing page:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter((it) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      it.title.toLowerCase().includes(q) ||
      it.focusKeyword?.toLowerCase().includes(q) ||
      it.ctaGoal?.toLowerCase().includes(q) ||
      it.clientBusinessName?.toLowerCase().includes(q) ||
      it.assigneeName?.toLowerCase().includes(q)
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
              placeholder="Search landing pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 text-[13px] rounded-[6px] bg-[var(--panel)] border border-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] w-full sm:w-80 md:w-96 text-[var(--ink)] placeholder-[var(--muted)]"
            />
          </div>
          <span className="text-[12px] text-[var(--muted)] tabular-nums">
            {filteredItems.length} total {filteredItems.length === 1 ? 'page' : 'pages'}
          </span>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New landing page</span>
          </button>
        )}
      </div>

      {/* Board Content */}
      {items.length === 0 ? (
        <div className="p-4 rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-[var(--ink)]">No landing page deliverables yet</p>
            <p className="text-[12px] text-[var(--muted)]">Track copywriting, design, and launch milestones for client landing pages.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New landing page</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-[var(--muted)] bg-[var(--canvas)] rounded-[8px] border border-[var(--line)]">
          No landing pages match your search.
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

                          {/* Focus Keyword & CTA Goal */}
                          {(item.focusKeyword || item.ctaGoal) && (
                            <div className="space-y-0.5 text-[10px] text-[var(--muted)]">
                              {item.focusKeyword && (
                                <div className="flex items-center gap-1 truncate">
                                  <span className="text-[10px] text-[var(--muted)]">
                                    Keyword:
                                  </span>
                                  <span className="text-[11px] font-medium text-[var(--ink)] truncate">
                                    {item.focusKeyword}
                                  </span>
                                </div>
                              )}
                              {item.ctaGoal && (
                                <div className="flex items-center gap-1 truncate">
                                  <span className="text-[10px] text-[var(--muted)]">
                                    CTA:
                                  </span>
                                  <span className="text-[11px] text-[var(--ink)] truncate">
                                    {item.ctaGoal}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Draft URL & Target / Live URL */}
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
                            {item.targetUrl && (
                              <a
                                href={item.targetUrl.startsWith('http') ? item.targetUrl : `https://${item.targetUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline truncate max-w-full"
                              >
                                <Globe className="w-3 h-3 shrink-0" />
                                <span className="truncate">{item.targetUrl.replace(/^https?:\/\//, '')}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            )}
                          </div>

                          {/* Deliverable Notes */}
                          {item.notes && (
                            <p className="text-[11px] text-[var(--muted)] line-clamp-2 bg-[var(--canvas)] p-1.5 rounded-[4px] border border-[var(--line)]">
                              {item.notes}
                            </p>
                          )}

                          {/* Footer: Assignee & Live Timestamp */}
                          <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--muted)]">
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {item.assigneeName || item.assigneeEmail || 'Unassigned'}
                              </span>
                            </div>
                            {item.wentLiveAt && (
                              <div className="flex items-center gap-1 text-[var(--success)] tabular-nums">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>
                                  {new Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  }).format(new Date(item.wentLiveAt))}
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

      {/* Live Transition Modal: Prompts for live URL */}
      {isLiveModalOpen && livePromptItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--success)] text-[11px] font-medium border border-[var(--line)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marking landing page live</span>
              </div>
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                Set published live URL
              </h3>
              <p className="text-[13px] text-[var(--muted)]">
                Moving <strong>{livePromptItem.title}</strong> to live will automatically record the launch timestamp. Enter the live destination URL:
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--muted)]">
                Live URL
              </label>
              <input
                type="url"
                value={liveUrlInput}
                onChange={(e) => setLiveUrlInput(e.target.value)}
                placeholder="https://clientdomain.com/landing-page"
                className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => {
                  setIsLiveModalOpen(false)
                  setLivePromptItem(null)
                }}
                disabled={isSubmitting}
                className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--canvas)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLivePromptSubmit}
                disabled={isSubmitting}
                className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Confirm & mark live'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {editingItem ? 'Edit landing page' : 'New landing page deliverable'}
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
                  Landing page title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Emergency Dental Care Landing Page"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Draft / Google Docs URL */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)] flex items-center justify-between">
                  <span>Google Docs / Draft link</span>
                  <span className="text-[11px] text-[var(--muted)] font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  value={formData.draftUrl}
                  onChange={(e) => setFormData({ ...formData, draftUrl: e.target.value })}
                  placeholder="https://docs.google.com/document/d/..."
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Target / Destination URL */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Live / target URL
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://example.com/emergency"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Deliverable Notes */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)] flex items-center justify-between">
                  <span>Notes / draft outline</span>
                  <span className="text-[11px] text-[var(--muted)] font-normal">Internal context & instructions</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes, outline, target audience, or specific requirements..."
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] resize-y focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Focus Keyword */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Focus keyword
                  </label>
                  <input
                    type="text"
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                    placeholder="e.g., emergency dentist"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                {/* CTA Goal */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    CTA goal
                  </label>
                  <input
                    type="text"
                    value={formData.ctaGoal}
                    onChange={(e) => setFormData({ ...formData, ctaGoal: e.target.value })}
                    placeholder="e.g., Phone Call / Booking"
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
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

                {/* Assignee */}
                {isStaff ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assigned team member
                    </label>
                    <div className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] font-medium text-[13px] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Assigned to you</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assigned team member
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    >
                      <option value="">Unassigned</option>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save changes' : 'Create landing page'}
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
        title="Delete Landing Page Deliverable"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
