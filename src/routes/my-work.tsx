import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CheckSquare,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../lib/auth'
import { AdminShell } from '../components/AdminShell'
import {
  getMyWorkServerFn,
  updateTaskStatusServerFn,
  updateLandingPageStatusServerFn,
  updateClientArticleStatusServerFn,
  type LandingPageItem,
  type ClientArticleItem,
  type TaskItem,
} from '../server/crm'
import { ToastContainer, type ToastMessage } from '../components/Toast'

export const Route = createFileRoute('/my-work')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    return { auth }
  },
  loader: async ({ context }) => {
    const workData = await getMyWorkServerFn()
    return {
      workData,
      auth: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'My Assigned Work | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: MyWorkPage,
})

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function MyWorkPage() {
  const { workData, auth } = Route.useLoaderData()
  const [data, setData] = useState(workData)
  const [activeFilter, setActiveFilter] = useState<'all' | 'tasks' | 'pages' | 'articles'>('all')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  const handleToggleTask = async (task: TaskItem) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done'
    setUpdatingTaskId(task.id)
    try {
      await updateTaskStatusServerFn({
        data: { id: task.id, status: nextStatus },
      })
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: nextStatus,
                completedAt: nextStatus === 'done' ? new Date() : null,
              }
            : t
        ),
        counts: {
          ...prev.counts,
          pendingTasks:
            nextStatus === 'done' ? prev.counts.pendingTasks - 1 : prev.counts.pendingTasks + 1,
          completedDeliverables:
            nextStatus === 'done'
              ? prev.counts.completedDeliverables + 1
              : prev.counts.completedDeliverables - 1,
        },
      }))
      addToast(
        'success',
        nextStatus === 'done' ? 'Task Completed' : 'Task Reopened',
        `"${task.title}" updated.`
      )
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message || 'Could not update task status.')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const userDisplayName = auth.email ? auth.email.split('@')[0] : 'Team Member'

  return (
    <AdminShell
      activeTab="my-work"
      title={`My work — ${userDisplayName}`}
      description="Everything assigned to your account across all clients: tasks, landing page deliverables, and articles."
      userRole={auth?.role}
      userEmail={auth?.email}
      userName={auth?.name}
      actions={
        <div className="flex items-center gap-3">
          <Link
            to="/admin/workspace"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition"
          >
            <span>Agency workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      }
    >
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <div className="space-y-3.5">
        {/* Metric Inline Strip */}
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--muted)] px-3.5 py-2 rounded-[6px] bg-[var(--panel)] border border-[var(--line)]">
          <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{data.counts.totalAssigned}</strong> assigned deliverables</span>
          <span className="opacity-40">·</span>
          <span><strong className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">{data.counts.pendingTasks}</strong> pending tasks</span>
          <span className="opacity-40">·</span>
          <span><strong className="text-blue-600 dark:text-blue-400 font-semibold tabular-nums">{data.counts.inProgressDeliverables}</strong> in progress</span>
          <span className="opacity-40">·</span>
          <span><strong className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">{data.counts.completedDeliverables}</strong> completed</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            All items ({data.counts.totalAssigned})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('tasks')}
            className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'tasks'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Tasks ({data.tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pages')}
            className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'pages'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Landing pages ({data.landingPages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('articles')}
            className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'articles'
                ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs border border-[var(--line)]/60'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Articles ({data.articles.length})
          </button>
        </div>

        {/* Section 1: Assigned Deliverable Tasks */}
        {(activeFilter === 'all' || activeFilter === 'tasks') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <h2 className="text-[14px] font-semibold text-[var(--ink)]">
                  Assigned tasks ({data.tasks.length})
                </h2>
              </div>
            </div>

            {data.tasks.length === 0 ? (
              <div className="p-8 text-center rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-[13px] font-medium text-[var(--ink)]">
                  No tasks assigned to you right now
                </p>
                <p className="text-[12px] text-[var(--muted)]">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-3 rounded-[6px] border transition-colors ${
                      t.status === 'done'
                        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                        : 'bg-[var(--panel)] border-[var(--line)] hover:border-[var(--line)]/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        disabled={updatingTaskId === t.id}
                        onClick={() => handleToggleTask(t)}
                        className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition cursor-pointer shrink-0 ${
                          t.status === 'done'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-[var(--line)] hover:border-[var(--accent)] bg-[var(--canvas)]'
                        }`}
                      >
                        {t.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[13px] font-medium truncate ${
                              t.status === 'done'
                                ? 'line-through text-[var(--muted)]'
                                : 'text-[var(--ink)]'
                            }`}
                          >
                            {t.title}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                            {t.category.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] mt-0.5">
                          {t.clientId ? (
                            <Link
                              to="/admin/clients/$clientId"
                              params={{ clientId: t.clientId }}
                              search={{ tab: 'deliverables' }}
                              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                            >
                              <Building2 className="w-3 h-3" />
                              <span>{t.clientBusinessName || t.clientName || 'Client'}</span>
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <span>Internal Agency</span>
                            </span>
                          )}

                          {t.completedAt && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Completed {formatDate(t.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Assigned Landing Pages */}
        {(activeFilter === 'all' || activeFilter === 'pages') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <h2 className="text-[14px] font-semibold text-[var(--ink)]">
                  Assigned landing pages ({data.landingPages.length})
                </h2>
              </div>
            </div>

            {data.landingPages.length === 0 ? (
              <div className="p-8 text-center rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] space-y-1.5">
                <Layers className="w-6 h-6 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-[13px] font-medium text-[var(--ink)]">
                  No landing pages assigned to you
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.landingPages.map((lp) => (
                  <div
                    key={lp.id}
                    className="p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs space-y-2.5 hover:border-[var(--line)]/80 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {lp.status.replace('_', ' ')}
                      </span>
                      {lp.targetUrl && (
                        <a
                          href={lp.targetUrl.startsWith('http') ? lp.targetUrl : `https://${lp.targetUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[var(--muted)] hover:text-[var(--accent)] transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[13px] font-medium text-[var(--ink)] truncate">
                        {lp.title}
                      </h3>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {lp.clientBusinessName || 'Client'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[var(--muted)]">
                        Target: {lp.focusKeyword || 'General'}
                      </span>
                      {lp.clientId && (
                        <Link
                          to="/admin/clients/$clientId"
                          params={{ clientId: lp.clientId }}
                          search={{ tab: 'landing-pages' }}
                          className="text-[12px] font-medium text-[var(--accent)] hover:underline"
                        >
                          View board
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 3: Assigned Articles (Writer) */}
        {(activeFilter === 'all' || activeFilter === 'articles') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h2 className="text-[14px] font-semibold text-[var(--ink)]">
                  Assigned articles ({data.articles.length})
                </h2>
              </div>
            </div>

            {data.articles.length === 0 ? (
              <div className="p-8 text-center rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--canvas)] space-y-1.5">
                <FileText className="w-6 h-6 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-[13px] font-medium text-[var(--ink)]">
                  No articles currently assigned for you to write
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs space-y-2.5 hover:border-[var(--line)]/80 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {art.status}
                      </span>
                      {art.liveUrl && (
                        <a
                          href={art.liveUrl.startsWith('http') ? art.liveUrl : `https://${art.liveUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[var(--muted)] hover:text-[var(--accent)] transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[13px] font-medium text-[var(--ink)] truncate">
                        {art.title}
                      </h3>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {art.clientBusinessName || 'Client'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[var(--muted)]">
                        Keyword: {art.targetKeyword || 'Unset'}
                      </span>
                      {art.clientId && (
                        <Link
                          to="/admin/clients/$clientId"
                          params={{ clientId: art.clientId }}
                          search={{ tab: 'articles' }}
                          className="text-[12px] font-medium text-[var(--accent)] hover:underline"
                        >
                          View board
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
