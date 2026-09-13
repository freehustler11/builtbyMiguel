import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Clock,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { requireSuperadmin, checkAuthServerFn } from '../../lib/auth'
import {
  getAdminCommentsServerFn,
  moderateCommentServerFn,
  type AdminCommentRow,
} from '../../server/comments'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/comments')({
  beforeLoad: async ({ location }) => {
    // Strict superadmin allowlist guard - redirects partners, partner employees, clients, and unauthenticated
    await requireSuperadmin({ location })
  },
  loader: async ({ location }) => {
    const auth = await checkAuthServerFn()
    const searchParams = new URLSearchParams(location.search)
    const statusParam = (searchParams.get('status') || 'pending') as
      | 'pending'
      | 'published'
      | 'rejected'
      | 'spam'
      | 'all'
    const qParam = searchParams.get('q') || ''

    const data = await getAdminCommentsServerFn({
      data: {
        status: statusParam,
        search: qParam,
      },
    })

    return {
      auth,
      comments: data.comments,
      counts: data.counts,
      currentStatus: statusParam,
      currentSearch: qParam,
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Comment Moderation | Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminCommentsPage,
})

function formatDate(dateInput: Date | string): string {
  try {
    const d = new Date(dateInput)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

function AdminCommentsPage() {
  const { auth, comments, counts, currentStatus } = Route.useLoaderData()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [localSearch, setLocalSearch] = useState('')

  const handleModerate = async (
    commentId: string,
    action: 'approve' | 'reject' | 'spam' | 'delete'
  ) => {
    if (action === 'delete') {
      if (!window.confirm('Permanently delete this comment?')) return
    }

    setActionInProgress(commentId)
    setFeedbackMessage(null)

    try {
      await moderateCommentServerFn({
        data: {
          commentId,
          action,
        },
      })

      const actionLabels = {
        approve: 'Comment approved and published to live post.',
        reject: 'Comment rejected.',
        spam: 'Comment marked as spam.',
        delete: 'Comment deleted.',
      }
      setFeedbackMessage(actionLabels[action])

      startTransition(() => {
        router.invalidate()
      })
    } catch (err: any) {
      alert(err?.message || 'Moderation action failed')
    } finally {
      setActionInProgress(null)
    }
  }

  const tabs: Array<{ id: 'pending' | 'published' | 'rejected' | 'spam' | 'all'; label: string; count: number }> = [
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'published', label: 'Approved', count: counts.published },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
    { id: 'spam', label: 'Spam', count: counts.spam },
    { id: 'all', label: 'All', count: counts.all },
  ]

  return (
    <AdminShell
      title="Comment Moderation"
      description="Review, approve, or decline comments submitted on blog articles. Only approved comments appear live."
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header with Title & Pending Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Comment Moderation
              </h1>
              {counts.pending > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-950 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  {counts.pending} pending
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review, approve, or decline comments submitted on blog articles. Only approved comments appear live.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.invalidate()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Status Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {tabs.map((tab) => {
              const isActive = currentStatus === tab.id
              return (
                <Link
                  key={tab.id}
                  to="/admin/comments"
                  search={{ status: tab.id }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                        : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, post, text..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.navigate({
                    to: '/admin/comments',
                    search: { status: currentStatus, q: localSearch.trim() },
                  })
                }
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Table / List View */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
          {comments.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="font-display font-bold text-base text-slate-900 dark:text-white">
                {currentStatus === 'pending'
                  ? 'No comments waiting for review.'
                  : `No ${currentStatus} comments found.`}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {currentStatus === 'pending'
                  ? 'When readers submit comments on your blog playbooks, they will appear here for your approval before going live.'
                  : 'Check other tabs or search terms to inspect comments.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Name & Email
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Comment
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Post
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Submitted
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {comments.map((comment) => {
                    const isBusy = actionInProgress === comment.id

                    const statusBadgeColors = {
                      pending: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300',
                      published: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300',
                      rejected: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300',
                      spam: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300',
                    }

                    return (
                      <tr
                        key={comment.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        {/* Name & Email Column */}
                        <td className="px-5 py-4 align-top w-56">
                          <div className="space-y-1">
                            <div className="font-display font-bold text-sm text-slate-900 dark:text-white">
                              {comment.name}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 select-all">
                              {comment.email}
                            </div>
                            <div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                                  statusBadgeColors[comment.status]
                                }`}
                              >
                                {comment.status === 'published' ? 'Approved' : comment.status}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Comment Content Column */}
                        <td className="px-5 py-4 align-top max-w-md">
                          <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                            {comment.content}
                          </p>
                        </td>

                        {/* Post Column with link */}
                        <td className="px-5 py-4 align-top w-64">
                          {comment.postSlug ? (
                            <a
                              href={`/blog/${comment.postSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="group inline-flex items-start gap-1 font-display font-medium text-xs text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                            >
                              <span className="line-clamp-2">{comment.postTitle || comment.postSlug}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 transition mt-0.5" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Unknown article</span>
                          )}
                        </td>

                        {/* Submitted Timestamp Column */}
                        <td className="px-5 py-4 align-top whitespace-nowrap text-xs font-mono text-slate-500 dark:text-slate-400">
                          {formatDate(comment.createdAt)}
                        </td>

                        {/* Action Buttons Column */}
                        <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* Approve Action */}
                            {comment.status !== 'published' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleModerate(comment.id, 'approve')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
                                title="Approve and publish to live post"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Reject Action */}
                            {comment.status !== 'rejected' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleModerate(comment.id, 'reject')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                                title="Reject this comment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}

                            {/* Mark as Spam Action */}
                            {comment.status !== 'spam' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleModerate(comment.id, 'spam')}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                                title="Mark as spam"
                              >
                                <AlertOctagon className="w-3.5 h-3.5" />
                                <span className="sr-only sm:not-sr-only">Spam</span>
                              </button>
                            )}

                            {/* Permanent Delete Action */}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleModerate(comment.id, 'delete')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
