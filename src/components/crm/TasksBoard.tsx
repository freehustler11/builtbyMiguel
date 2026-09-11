import React, { useState, useEffect } from 'react'
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Users,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Edit2,
  Briefcase,
  Layers,
  FileText,
  ExternalLink,
} from 'lucide-react'
import {
  getTasksServerFn,
  createTaskServerFn,
  updateTaskStatusServerFn,
  updateTaskServerFn,
  deleteTaskServerFn,
  getAgencyTeamPickerServerFn,
  type TaskItem,
  type TeamPickerMember,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { checkAuthServerFn, type ActiveSessionResult } from '../../lib/auth'
import { ConfirmModal } from '../ConfirmModal'
import { ToastContainer, type ToastMessage } from '../Toast'
import { useBoardKeyboardNav } from './useBoardKeyboardNav'

const TASK_COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
]

const CATEGORIES: Array<{
  id: 'all' | 'citations' | 'technical_seo' | 'on_page' | 'backlinks' | 'schema' | 'gbp'
  label: string
}> = [
  { id: 'all', label: 'All Categories' },
  { id: 'citations', label: 'Citations & Directories' },
  { id: 'technical_seo', label: 'Technical SEO' },
  { id: 'on_page', label: 'On-Page Optimization' },
  { id: 'backlinks', label: 'Backlinks & Outreach' },
  { id: 'schema', label: 'Schema & Structured Data' },
  { id: 'gbp', label: 'Google Business Profile' },
]

export interface TasksBoardProps {
  clientId?: string
  partnerId?: string
}

export function TasksBoard({ clientId, partnerId }: TasksBoardProps) {
  const [items, setItems] = useState<TaskItem[]>([])
  const [team, setTeam] = useState<TeamPickerMember[]>([])
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [currentUser, setCurrentUser] = useState<ActiveSessionResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Create / Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TaskItem | null>(null)
  const [formData, setFormData] = useState<{
    clientId: string
    title: string
    category: 'citations' | 'technical_seo' | 'on_page' | 'backlinks' | 'schema' | 'gbp'
    draftUrl: string
    notes: string
    assignedTo: string
    dueDate: string
    status: 'todo' | 'done'
  }>({
    clientId: clientId || '',
    title: '',
    category: 'technical_seo',
    draftUrl: '',
    notes: '',
    assignedTo: '',
    dueDate: '',
    status: 'todo',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)
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
      const [tasksData, teamMembers, session] = await Promise.all([
        getTasksServerFn({
          data: {
            clientId,
            partnerId,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
          },
        }),
        getAgencyTeamPickerServerFn({ data: { partnerId } }),
        checkAuthServerFn().catch(() => null),
      ])
      setItems(tasksData)
      setTeam(teamMembers)
      if (session) setCurrentUser(session)

      if (isRollup) {
        const { clients } = await getClientsServerFn({ data: { partnerId } })
        setClientsList(clients)
      }
    } catch (err) {
      console.error('Failed to load tasks board:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId, partnerId, selectedCategory])

  const handleToggleStatus = async (item: TaskItem) => {
    const nextStatus = item.status === 'done' ? 'todo' : 'done'
    try {
      const updated = await updateTaskStatusServerFn({
        data: { id: item.id, status: nextStatus },
      })
      setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, ...updated } : t)))
    } catch (err) {
      console.error('Failed to update task status:', err)
      loadData()
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      clientId: clientId || '',
      title: '',
      category: 'technical_seo',
      draftUrl: '',
      notes: '',
      assignedTo: isStaff ? (currentUser?.userId || '') : (team[0]?.id || ''),
      dueDate: '',
      status: 'todo',
    })
    setIsEditModalOpen(true)
  }

  const handleOpenEdit = (item: TaskItem) => {
    setEditingItem(item)
    setFormData({
      clientId: item.clientId || '',
      title: item.title,
      category: item.category,
      draftUrl: item.draftUrl || '',
      notes: item.notes || '',
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
        const updated = await updateTaskServerFn({
          data: {
            id: editingItem.id,
            title: formData.title,
            category: formData.category,
            draftUrl: formData.draftUrl || undefined,
            notes: formData.notes || undefined,
            assignedTo: isStaff ? editingItem.assignedTo : formData.assignedTo || null,
            status: formData.status,
            dueDate: formData.dueDate || null,
            clientId: formData.clientId ? formData.clientId : null,
          },
        })
        const assignee = team.find((t) => t.id === updated.assignedTo)
        const clientObj = clientsList.find((c) => c.id === updated.clientId)
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...updated,
                  assigneeName: assignee?.name || null,
                  assigneeEmail: assignee?.email || null,
                  clientBusinessName: clientObj?.businessName || null,
                  clientName: clientObj?.name || null,
                }
              : it
          )
        )
      } else {
        const created = await createTaskServerFn({
          data: {
            clientId: formData.clientId ? formData.clientId : null,
            title: formData.title,
            category: formData.category,
            draftUrl: formData.draftUrl || undefined,
            notes: formData.notes || undefined,
            assignedTo: isStaff ? (currentUser?.userId || undefined) : formData.assignedTo || null,
            status: formData.status,
            dueDate: formData.dueDate || null,
          },
        })
        const assignee = team.find((t) => t.id === created.assignedTo)
        const clientObj = clientsList.find((c) => c.id === created.clientId)
        const newItem: TaskItem = {
          ...created,
          assigneeName: assignee?.name || null,
          assigneeEmail: assignee?.email || null,
          clientBusinessName: clientObj?.businessName || null,
          clientName: clientObj?.name || null,
        }
        setItems((prev) => [newItem, ...prev])
      }
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to save task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteTaskServerFn({ data: { id: deleteTarget.id } })
      setItems((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete task:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter((it) => {
    if (statusFilter !== 'all' && it.status !== statusFilter) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      it.title.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      it.clientBusinessName?.toLowerCase().includes(q) ||
      it.assigneeName?.toLowerCase().includes(q)
    )
  })

  // Separate client tasks vs internal tasks in rollup view
  const clientTasks = filteredItems.filter((t) => t.clientId !== null)
  const internalTasks = filteredItems.filter((t) => t.clientId === null)

  const { focusedId, setFocusedId } = useBoardKeyboardNav({
    items: filteredItems,
    columns: TASK_COLUMNS,
    onStatusChange: async (item, newStatus) => {
      try {
        const updated = await updateTaskStatusServerFn({
          data: {
            id: item.id,
            status: newStatus as any,
          },
        })
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, ...updated } : it))
        )
      } catch (err) {
        console.error('Failed to update task status:', err)
      }
    },
    onOpenItem: (item) => handleOpenEdit(item),
  })

  const renderTaskList = (tasksList: TaskItem[], emptyText: string) => {
    if (tasksList.length === 0) {
      return (
        <div className="py-8 text-center text-[13px] text-[var(--muted)] bg-[var(--canvas)] rounded-[8px] border border-dashed border-[var(--line)]">
          {emptyText}
        </div>
      )
    }

    return (
      <div className="space-y-2.5">
        {tasksList.map((item) => {
          const isDone = item.status === 'done'
          const isFocused = focusedId === item.id
          return (
            <div
              key={item.id}
              tabIndex={0}
              onClick={() => setFocusedId(item.id)}
              className={`p-3 rounded-[8px] border border-[var(--line)] transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                isDone
                  ? 'bg-[var(--canvas)] border-l-2 border-l-[var(--success)] opacity-75'
                  : 'bg-[var(--panel)] border-l-2 border-l-[var(--accent)]'
              } ${isFocused ? 'ring-2 ring-[var(--accent)] shadow-md' : ''}`}
            >
              {/* Left: Checkbox & Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className="cursor-pointer text-[var(--muted)] hover:text-[var(--accent)] transition shrink-0"
                  title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[var(--muted)] hover:border-[var(--ink)]" />
                  )}
                </button>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[13px] font-medium ${
                        isDone
                          ? 'line-through text-[var(--muted)]'
                          : 'text-[var(--ink)]'
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Client badge in roll-up view */}
                    {isRollup && item.clientId && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                        <Building2 className="w-3 h-3" />
                        <span>{item.clientBusinessName || item.clientName}</span>
                      </span>
                    )}

                    {/* Category pill */}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Draft URL */}
                  {item.draftUrl && (
                    <div>
                      <a
                        href={item.draftUrl.startsWith('http') ? item.draftUrl : `https://${item.draftUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] hover:underline truncate max-w-full"
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">Draft Doc</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>
                  )}

                  {/* Task Notes */}
                  {item.notes && (
                    <p className="text-[12px] text-[var(--muted)] line-clamp-2 bg-[var(--canvas)] p-2 rounded-[6px] border border-[var(--line)]">
                      {item.notes}
                    </p>
                  )}

                  {/* Assignee & completed date */}
                  <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] tabular-nums">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.assigneeName || item.assigneeEmail || 'Unassigned'}</span>
                    </div>

                    {item.dueDate && (
                      (() => {
                        const isOverdue = new Date(item.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && item.status !== 'done'
                        return (
                          <div className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-[var(--danger)]' : 'text-[var(--muted)]'}`}>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {isOverdue ? 'Overdue · ' : 'Due '}
                              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(item.dueDate))}
                            </span>
                          </div>
                        )
                      })()
                    )}

                    {item.completedAt && (
                      <div className="flex items-center gap-1 text-[var(--success)]">
                        <Clock className="w-3 h-3" />
                        <span>
                          Done on{' '}
                          {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                          }).format(new Date(item.completedAt))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition cursor-pointer"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--canvas)] transition cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--panel)] text-[var(--muted)] border border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 text-[13px] rounded-[6px] bg-[var(--panel)] border border-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] w-64 text-[var(--ink)] placeholder-[var(--muted)]"
            />
          </div>

          <div className="flex items-center p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px]">
            {(['all', 'todo', 'done'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-[4px] capitalize transition cursor-pointer ${
                  statusFilter === s
                    ? 'bg-[var(--panel)] text-[var(--ink)] font-medium shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New deliverable task</span>
        </button>
      </div>

      {/* Main Task View */}
      {isRollup ? (
        <div className="space-y-4">
          {/* Section 1: Client Deliverables */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-medium text-[var(--ink)] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--accent)]" />
                <span>Client deliverables</span>
                <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium tabular-nums bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                  {clientTasks.length}
                </span>
              </h3>
            </div>
            {renderTaskList(clientTasks, 'No client deliverable tasks matching filter.')}
          </div>

          {/* Section 2: Internal Agency Tasks (Nullable client_id) */}
          <div className="space-y-2.5 pt-3 border-t border-[var(--line)]">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-medium text-[var(--ink)] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                  <span>Internal agency work</span>
                  <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium tabular-nums bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                    {internalTasks.length}
                  </span>
                </h3>
                <p className="text-[12px] text-[var(--muted)]">
                  Tasks not assigned to any specific client (internal agency operations).
                </p>
              </div>
            </div>
            {renderTaskList(internalTasks, 'No internal agency tasks matching filter.')}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {renderTaskList(filteredItems, 'No deliverable tasks found for this client.')}
        </div>
      )}

      {/* Keyboard Navigation Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] select-none">
        <div className="flex flex-wrap items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">K</kbd> Navigate tasks</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">1-4</kbd> Set status (1: Todo, 4: Done)</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Enter</kbd> Edit</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px] font-semibold text-[var(--ink)]">Esc</kbd> Clear focus</span>
        </div>
        {focusedId && (
          <span className="text-[var(--accent)] font-medium">Task focused</span>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--panel)] rounded-[8px] border border-[var(--line)] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {editingItem ? 'Edit task deliverable' : 'New task deliverable'}
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
              {/* Client Assignment (Roll-up mode only) */}
              {isRollup && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Task scope / client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    <option value="">Internal agency work (no client)</option>
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
                  Task title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Audit citation NAP consistency across top 50 directories"
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Draft Document URL */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Draft URL (Google Doc / spec link)
                </label>
                <input
                  type="url"
                  value={formData.draftUrl}
                  onChange={(e) => setFormData({ ...formData, draftUrl: e.target.value })}
                  placeholder="https://docs.google.com/..."
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Task Notes */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Task notes / instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional context, action steps, guidelines..."
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)]">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                {isStaff ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assignee
                    </label>
                    <div className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] font-medium text-[13px] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Assigned to you</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)]">
                      Assignee
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

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--muted)]">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[13px] text-[var(--ink)] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                  <option value="todo">To Do (Pending)</option>
                  <option value="done">Done (Completed)</option>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save changes' : 'Create task'}
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
        title="Delete Deliverable Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
