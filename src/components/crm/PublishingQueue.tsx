import React, { useState, useEffect, useMemo } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  Layers,
  FileText,
  Globe,
  CheckSquare,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  Building2,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react'
import {
  getPublishingQueueServerFn,
  advancePublishingQueueItemServerFn,
  type PublishingQueueItem,
  type QueueItemType,
} from '../../server/workflow'
import { ToastContainer, type ToastMessage } from '../Toast'
import { checkAuthServerFn, type ActiveSessionResult } from '../../lib/auth'

export interface PublishingQueueProps {
  partnerId?: string
}

export function PublishingQueue({ partnerId }: PublishingQueueProps) {
  const router = useRouter()
  const [items, setItems] = useState<PublishingQueueItem[]>([])
  const [currentUser, setCurrentUser] = useState<ActiveSessionResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeType, setActiveType] = useState<'all' | 'landing_pages' | 'articles' | 'tasks' | 'citations'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const session = await checkAuthServerFn().catch(() => null)
      if (session) setCurrentUser(session)
      const res = await getPublishingQueueServerFn({
        data: {
          partnerId,
          type: activeType === 'all' ? undefined : activeType,
        },
      })
      setItems(res)
    } catch (err: unknown) {
      addToast('error', 'Error', 'Failed to load publishing queue')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [partnerId, activeType])

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.businessName.toLowerCase().includes(q) ||
        (item.assigneeName && item.assigneeName.toLowerCase().includes(q))
    )
  }, [items, searchQuery])

  // Advance status directly
  const handleAdvanceStatus = async (item: PublishingQueueItem, nextStatus: string) => {
    setUpdatingId(item.id)
    try {
      await advancePublishingQueueItemServerFn({
        data: {
          id: item.id,
          type: item.type,
          targetStatus: nextStatus,
        },
      })

      addToast('success', 'Status Updated', `Advanced "${item.title}" to ${nextStatus}.`)
      await loadData()
      await router.invalidate()
    } catch (err: unknown) {
      addToast('error', 'Error', err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const getTypeIcon = (type: QueueItemType) => {
    switch (type) {
      case 'landing_page':
        return <Globe className="w-4 h-4 text-blue-500" />
      case 'client_article':
        return <FileText className="w-4 h-4 text-emerald-500" />
      case 'task':
        return <CheckSquare className="w-4 h-4 text-purple-500" />
      case 'citation':
        return <Layers className="w-4 h-4 text-amber-500" />
    }
  }

  const getTypeBadge = (type: QueueItemType) => {
    switch (type) {
      case 'landing_page':
        return 'Landing Page'
      case 'client_article':
        return 'Article'
      case 'task':
        return 'Task'
      case 'citation':
        return 'Citation'
    }
  }

  const formatRelative = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / (1000 * 60))
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-4">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Toolbar & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables in review..."
              className="h-8 pl-8 pr-3 text-[13px] rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] w-56 sm:w-72"
            />
          </div>

          <div className="flex items-center rounded-[6px] border border-[var(--line)] p-0.5 bg-[var(--canvas)] overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Review' },
              { id: 'landing_pages', label: 'Landing Pages' },
              { id: 'articles', label: 'Articles' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'citations', label: 'Citations' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveType(f.id as any)}
                className={`h-7 px-2.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer whitespace-nowrap ${
                  activeType === f.id
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'partner_employee' && (
            <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              Showing your assigned deliverables & clients
            </span>
          )}
          <span className="text-[12px] text-[var(--muted)]">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in queue
          </span>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer disabled:opacity-50"
            title="Refresh queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--muted)] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="w-full overflow-x-auto rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[900px]">
          {/* Header */}
          <thead className="bg-[var(--canvas)]/90 sticky top-0 z-10 border-b border-[var(--line)] backdrop-blur-xs select-none">
            <tr className="text-[12px] font-medium text-[var(--muted)]">
              <th className="px-4 py-2.5 w-32">Type</th>
              <th className="px-4 py-2.5">Deliverable Title</th>
              <th className="px-4 py-2.5">Client</th>
              <th className="px-4 py-2.5">Stage / Status</th>
              <th className="px-4 py-2.5">Assignee & Updated</th>
              <th className="px-4 py-2.5 text-right w-48">Publish Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--line)]/50 text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-[var(--muted)]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    <span>Loading publishing queue...</span>
                  </div>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-[var(--muted)]">
                  No deliverables currently waiting for review or approval.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isUpdating = updatingId === item.id

                return (
                  <tr key={`${item.type}-${item.id}`} className="group hover:bg-[var(--line)]/10 transition-colors">
                    {/* Deliverable Type */}
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[var(--line)]/20 text-[11px] font-medium text-[var(--ink)]">
                        {getTypeIcon(item.type)}
                        <span>{getTypeBadge(item.type)}</span>
                      </div>
                    </td>

                    {/* Title & Preview Links */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--ink)] max-w-sm truncate">{item.title}</div>
                      <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                        {item.draftUrl && (
                          <a
                            href={item.draftUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                          >
                            <span>Draft URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {item.targetUrl && (
                          <a
                            href={item.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--ink)]"
                          >
                            <span>Target URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Client Name */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--ink)]">{item.businessName}</div>
                    </td>

                    {/* Stage Badge */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Clock className="w-3 h-3" />
                        <span>{item.stageLabel}</span>
                      </span>
                    </td>

                    {/* Assignee & Updated */}
                    <td className="px-4 py-3 text-[12px] text-[var(--muted)]">
                      <div>{item.assigneeName || 'Unassigned'}</div>
                      <div className="text-[10px] text-[var(--muted)]/70">{formatRelative(item.updatedAt)}</div>
                    </td>

                    {/* 1-Click Action */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.type === 'client_article' && item.status === 'review' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(item, 'approved')}
                            className="h-7 px-2.5 rounded-[4px] text-[12px] font-medium bg-[var(--accent)] text-white hover:opacity-90 shadow-2xs transition cursor-pointer disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}

                        {item.type === 'client_article' && item.status === 'approved' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(item, 'published')}
                            className="h-7 px-2.5 rounded-[4px] text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
                          >
                            Publish Live
                          </button>
                        )}

                        {item.type === 'landing_page' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(item, 'live')}
                            className="h-7 px-2.5 rounded-[4px] text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
                          >
                            Mark Live
                          </button>
                        )}

                        {item.type === 'task' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(item, 'done')}
                            className="h-7 px-2.5 rounded-[4px] text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}

                        {item.type === 'citation' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(item, 'live')}
                            className="h-7 px-2.5 rounded-[4px] text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
                          >
                            Verify Live
                          </button>
                        )}
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
}
