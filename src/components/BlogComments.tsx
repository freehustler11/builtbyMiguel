import { useState, useEffect } from 'react'
import { MessageSquare, Send, CheckCircle2, User, AlertCircle, Clock } from 'lucide-react'
import { submitCommentServerFn, getPublicPostCommentsServerFn } from '../server/comments'
import { hasConsent } from './CookieConsentBanner'

interface CommentItem {
  id: string
  name: string
  content: string
  createdAt: Date | string
}

interface BlogCommentsProps {
  postId: string
  postTitle?: string
}

const STORAGE_KEY = 'bbm_commenter_info'

function formatDate(dateInput: Date | string): string {
  try {
    const d = new Date(dateInput)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

export function BlogComments({ postId, postTitle }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  // 1. Load approved comments & check for remembered user
  useEffect(() => {
    let isMounted = true

    async function loadComments() {
      try {
        const res = await getPublicPostCommentsServerFn({ data: { postId } })
        if (isMounted) {
          setComments(res.comments || [])
        }
      } catch (err) {
        console.error('Failed to load blog comments', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadComments()

    // Check remember me auto-fill if functional cookies are consented
    if (typeof window !== 'undefined' && hasConsent('functional')) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.name) setName(parsed.name)
          if (parsed.email) setEmail(parsed.email)
          setRememberMe(true)
        }
      } catch (e) {
        // Ignore local storage error
      }
    }

    return () => {
      isMounted = false
    }
  }, [postId])

  // 2. Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSubmitSuccess(null)

    if (!name.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!content.trim() || content.trim().length < 3) {
      setErrorMessage('Please enter a comment (at least 3 characters).')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitCommentServerFn({
        data: {
          postId,
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
          honeypot: honeypot.trim(),
        },
      })

      // Remember me handling (only if Functional Cookies consented)
      if (typeof window !== 'undefined' && hasConsent('functional')) {
        if (rememberMe) {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ name: name.trim(), email: email.trim() })
            )
          } catch {
            // Ignore storage quota
          }
        } else {
          try {
            localStorage.removeItem(STORAGE_KEY)
          } catch {
            // Ignore
          }
        }
      }

      setSubmitSuccess(
        res.message || 'Thanks! Your comment is awaiting approval and will appear once reviewed.'
      )
      setContent('') // Reset comment body
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit your comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-8"
      aria-label="Discussion and Comments"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Comments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join the conversation. All comments are moderated prior to publication.
            </p>
          </div>
        </div>
        {comments.length > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {/* Approved Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading discussion...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white/50 dark:bg-slate-900/30 space-y-2">
            <p className="text-sm font-display font-medium text-slate-700 dark:text-slate-300">
              Be the first to comment
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Share your thoughts, ask questions about this playbook, or share your own local search results.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <article
                key={c.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs uppercase font-mono">
                      {c.name.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
                        {c.name}
                      </h4>
                      <time
                        dateTime={new Date(c.createdAt).toISOString()}
                        className="text-[11px] font-mono text-slate-400 block"
                      >
                        {formatDate(c.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-11">
                  {c.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Submission Form Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Leave a Reply
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your email address will not be published. Required fields are marked *
          </p>
        </div>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Comment Submitted
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                {submitSuccess}
              </p>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot anti-spam field (hidden from real users) */}
          <div className="opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="company_website">Website (Leave blank)</label>
            <input
              type="text"
              id="company_website"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="comment_name"
                className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300"
              >
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="comment_name"
                type="text"
                required
                maxLength={100}
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="comment_email"
                className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300"
              >
                Email <span className="text-rose-500">*</span>{' '}
                <span className="text-[10px] font-normal text-slate-400">(Never published)</span>
              </label>
              <input
                id="comment_email"
                type="email"
                required
                maxLength={150}
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors"
              />
            </div>
          </div>

          {/* Comment Textarea Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="comment_content"
              className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300"
            >
              Comment <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="comment_content"
              required
              rows={4}
              maxLength={3000}
              placeholder="What are your thoughts or questions on this playbook?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors resize-y min-h-[100px]"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="comment_remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <label
              htmlFor="comment_remember"
              className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none"
            >
              Save my name and email in this browser for the next time I comment.
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] font-mono text-slate-400">
              Moderated by built by Miguel
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Comment</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
