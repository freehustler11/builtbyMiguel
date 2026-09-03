import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react'
import { loginServerFn, checkAuthServerFn } from '../lib/auth'

interface LoginSearch {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    }
  },
  beforeLoad: async ({ search }) => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (isAuthenticated) {
      throw redirect({
        to: search.redirect || '/messages',
      })
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Admin Login | Built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter the admin password.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await loginServerFn({ data: { password } })

      if (res.success) {
        await router.invalidate()
        navigate({ to: redirectTo && redirectTo !== '/login' ? redirectTo : '/messages' })
      } else {
        setError(res.error || 'Authentication failed. Please verify your password.')
        setIsSubmitting(false)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.'
      setError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-rose-500/10 via-amber-500/5 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-8">
        {/* Back Link */}
        <div className="flex justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Built by Miguel</span>
          </a>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#111827]/95 p-8 shadow-2xl backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Admin Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your administrative key to manage systems & content
              </p>
            </div>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase"
              >
                Admin Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400 dark:text-white" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-rose-400 dark:text-rose-200" />
                  <span>Unlock Admin Session</span>
                </>
              )}
            </button>
          </form>

          {/* Micro Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400">
              🔒 Encrypted session · Protected with HMAC-SHA256
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
