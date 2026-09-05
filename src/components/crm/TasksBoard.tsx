import React, { useState, useEffect } from 'react'
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Edit2,
  Briefcase,
  Layers,
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
import { ConfirmModal } from '../ConfirmModal'

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
    assignedTo: string
    status: 'todo' | 'done'
  }>({
    clientId: clientId || '',
    title: '',
    category: 'technical_seo',
    assignedTo: '',
    status: 'todo',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isRollup = !clientId

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [tasksData, teamMembers] = await Promise.all([
        getTasksServerFn({
          data: {
            clientId,
            partnerId,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
          },
        }),
        getAgencyTeamPickerServerFn({ data: { partnerId } }),
      ])
      setItems(tasksData)
      setTeam(teamMembers)

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
      assignedTo: team[0]?.id || '',
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
      assignedTo: item.assignedTo || '',
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
            assignedTo: formData.assignedTo || null,
            status: formData.status,
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
            assignedTo: formData.assignedTo || null,
            status: formData.status,
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

  const renderTaskList = (tasksList: TaskItem[], emptyText: string) => {
    if (tasksList.length === 0) {
      return (
        <div className="py-8 text-center text-xs font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          {emptyText}
        </div>
      )
    }

    return (
      <div className="space-y-2.5">
        {tasksList.map((item) => {
          const isDone = item.status === 'done'
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                isDone
                  ? 'bg-slate-50/60 dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-sm'
              }`}
            >
              {/* Left: Checkbox & Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className="cursor-pointer text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition shrink-0"
                  title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 hover:border-slate-400" />
                  )}
                </button>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        isDone
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Client badge in roll-up view */}
                    {isRollup && item.clientId && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                        <Building2 className="w-2.5 h-2.5" />
                        <span>{item.clientBusinessName || item.clientName}</span>
                      </span>
                    )}

                    {/* Category pill */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Assignee & completed date */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.assigneeName || item.assigneeEmail || 'Unassigned'}</span>
                    </div>

                    {item.completedAt && (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
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
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Delete Task"
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
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-64 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
            {(['all', 'todo', 'done'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Deliverable Task</span>
        </button>
      </div>

      {/* Main Task View */}
      {isRollup ? (
        <div className="space-y-8">
          {/* Section 1: Client Deliverables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Client Deliverables</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                  {clientTasks.length}
                </span>
              </h3>
            </div>
            {renderTaskList(clientTasks, 'No client deliverable tasks matching filter.')}
          </div>

          {/* Section 2: Internal Agency Tasks (Nullable client_id) */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span>Internal Agency Work</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40">
                    {internalTasks.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tasks not assigned to any specific client (internal agency operations).
                </p>
              </div>
            </div>
            {renderTaskList(internalTasks, 'No internal agency tasks matching filter.')}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {renderTaskList(filteredItems, 'No deliverable tasks found for this client.')}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Edit Task Deliverable' : 'New Task Deliverable'}
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
              {/* Client Assignment (Roll-up mode only) */}
              {isRollup && (
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Task Scope / Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="">Internal Agency Work (No Client)</option>
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
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Audit citation NAP consistency across Top 50 directories"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Assignee
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {team.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name || t.email} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <option value="todo">To Do (Pending)</option>
                  <option value="done">Done (Completed)</option>
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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
