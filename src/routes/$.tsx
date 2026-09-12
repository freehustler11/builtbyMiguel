import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { AlertCircle, ArrowRight, Home, Sparkles, Search, Globe, Cpu } from 'lucide-react'
import { resolveRedirect } from '../lib/redirects'

export const Route = createFileRoute('/$')({
  beforeLoad: ({ location }) => {
    const fullPath = location.pathname + (location.searchStr ? location.searchStr : '')
    const target = resolveRedirect(fullPath)
    if (target) {
      throw redirect({
        to: target,
        statusCode: 301,
      })
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: '404 - Page Not Found | built by Miguel',
      },
      {
        name: 'description',
        content: 'The page you are looking for does not exist on built by Miguel.',
      },
    ],
  }),
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-2xl mx-auto py-16 sm:py-24 px-6 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 shadow-xl shadow-amber-500/10">
          <AlertCircle className="w-7 h-7 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 shadow-xs">
            ERROR 404
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            The link you followed may be broken or the page may have been moved. Let's get you back on track.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] text-left space-y-4 shadow-sm dark:shadow-none">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
            Popular Destinations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
            <Link
              to="/seo"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition-all"
            >
              <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span>SEO Services</span>
            </Link>
            <Link
              to="/websites"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
              <span>Websites</span>
            </Link>
            <Link
              to="/systems-auto"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition-all"
            >
              <Cpu className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>Systems</span>
            </Link>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Get Free Audit</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
