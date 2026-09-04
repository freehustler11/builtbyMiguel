import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, Mail } from 'lucide-react'
import { loginServerFn, checkAuthServerFn } from '../lib/auth'
import { ThemeToggle } from '../components/ThemeToggle'

interface LoginSearch {
  redirect?: string
  error?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
      error: typeof search.error === 'string' ? search.error : undefined,
    }
  },
  beforeLoad: async ({ search }) => {
    // If account was disabled, don't redirect away
    if (search.error === 'account_disabled') {
      return
    }

    const auth = await checkAuthServerFn()
    if (auth.isAuthenticated) {
      if (auth.role === 'client') {
        throw redirect({
          to: search.redirect && search.redirect.startsWith('/portal') ? search.redirect : '/portal',
        })
      }
      if (auth.role === 'partner' || auth.role === 'partner_employee') {
        throw redirect({
          to: search.redirect && (search.redirect.startsWith('/admin/clients') || search.redirect.startsWith('/admin/reports') || search.redirect.startsWith('/admin/media'))
            ? search.redirect
            : '/admin/clients',
        })
      }
      // superadmin
      throw redirect({
        to: search.redirect && !search.redirect.startsWith('/portal') ? search.redirect : '/admin',
      })
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Sign In | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  const { redirect: redirectTo, error: searchError } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await loginServerFn({
        data: {
          email: email.trim(),
          password: password.trim(),
        },
      })

      if (res.success) {
        await router.invalidate()
        const userRole = res.role as string
        if (userRole === 'client') {
          navigate({
            to: redirectTo && redirectTo.startsWith('/portal') ? redirectTo : '/portal',
          })
        } else if (userRole === 'partner' || userRole === 'partner_employee') {
          navigate({
            to: redirectTo && (redirectTo.startsWith('/admin/clients') || redirectTo.startsWith('/admin/reports') || redirectTo.startsWith('/admin/media'))
              ? redirectTo
              : '/admin/clients',
          })
        } else {
          // superadmin
          navigate({
            to: redirectTo && !redirectTo.startsWith('/portal') ? redirectTo : '/admin',
          })
        }
      } else {
        setError(res.error || 'Invalid email or password.')
        setIsSubmitting(false)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.'
      setError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative bg-slate-50 dark:bg-[#0c111d] transition-colors">
      {/* Top-Right Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <ThemeToggle variant="pill" />
      </div>

      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-rose-500/10 via-blue-500/5 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex justify-center">
          <a
            href="https://builtbymiguel.net"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to built by Miguel</span>
          </a>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#111827]/95 p-8 shadow-2xl backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign In
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your email and password to access your dashboard
              </p>
            </div>
          </div>

          {/* Disabled Account Alert Callout */}
          {searchError === 'account_disabled' && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <strong className="block font-bold">Access Suspended</strong>
                <span>Your account has been deactivated. Please contact your account administrator.</span>
              </div>
            </div>
          )}

          {/* Form Error Callout */}
          {error && (
            <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Universal Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="user-email"
                className="block text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoFocus
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="user-password"
                className="block text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>

                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
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
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Micro Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400">
              🔒 Encrypted session · Protected with Web Crypto PBKDF2 & HMAC-SHA256
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
