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
import { AdminNav } from '../components/AdminNav'
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Navigation Bar */}
        <AdminNav
          activeTab="my-work"
          title={`My Work · ${userDisplayName}`}
          description="Everything assigned to your account across all clients: tasks, landing page deliverables, and articles."
          userRole={auth?.role}
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/admin/workspace"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
              >
                <span>Agency Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          }
        />

        {/* Metric Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-xs font-mono text-slate-400 block">Total Assigned</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {data.counts.totalAssigned}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">deliverables across CRM</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-xs font-mono text-amber-500 block">Pending Tasks</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {data.counts.pendingTasks}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">action items to do</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-xs font-mono text-blue-500 block">In-Progress Work</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {data.counts.inProgressDeliverables}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">pages, drafts & tasks</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-xs font-mono text-emerald-500 block">Live / Completed</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {data.counts.completedDeliverables}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">delivered & signed off</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Items ({data.counts.totalAssigned})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'tasks'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tasks ({data.tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'pages'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Landing Pages ({data.landingPages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'articles'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Articles ({data.articles.length})
          </button>
        </div>

        {/* Section 1: Assigned Deliverable Tasks */}
        {(activeFilter === 'all' || activeFilter === 'tasks') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Assigned Deliverables ({data.tasks.length})
                </h2>
              </div>
            </div>

            {data.tasks.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No tasks assigned to you right now
                </p>
                <p className="text-xs text-slate-400 font-mono">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      t.status === 'done'
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/40 opacity-75'
                        : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        disabled={updatingTaskId === t.id}
                        onClick={() => handleToggleTask(t)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                          t.status === 'done'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {t.status === 'done' && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-semibold truncate ${
                              t.status === 'done'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {t.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                            {t.category.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                          {t.clientId ? (
                            <Link
                              to="/admin/clients/$clientId"
                              params={{ clientId: t.clientId }}
                              search={{ tab: 'deliverables' }}
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Assigned Landing Pages ({data.landingPages.length})
                </h2>
              </div>
            </div>

            {data.landingPages.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
                <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No landing pages assigned to you
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.landingPages.map((lp) => (
                  <div
                    key={lp.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                        {lp.status.replace('_', ' ')}
                      </span>
                      {lp.targetUrl && (
                        <a
                          href={lp.targetUrl.startsWith('http') ? lp.targetUrl : `https://${lp.targetUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-blue-500 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {lp.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        {lp.clientBusinessName || 'Client'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {lp.focusKeyword || 'General'}
                      </span>
                      {lp.clientId && (
                        <Link
                          to="/admin/clients/$clientId"
                          params={{ clientId: lp.clientId }}
                          search={{ tab: 'landing-pages' }}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Board
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Assigned Articles ({data.articles.length})
                </h2>
              </div>
            </div>

            {data.articles.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No articles currently assigned for you to write
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        {art.status}
                      </span>
                      {art.liveUrl && (
                        <a
                          href={art.liveUrl.startsWith('http') ? art.liveUrl : `https://${art.liveUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-emerald-500 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        {art.clientBusinessName || 'Client'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Keyword: {art.targetKeyword || 'Unset'}
                      </span>
                      {art.clientId && (
                        <Link
                          to="/admin/clients/$clientId"
                          params={{ clientId: art.clientId }}
                          search={{ tab: 'articles' }}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          View Board
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
    </div>
  )
}
