import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, Home, Sparkles, Search, Globe, Cpu } from 'lucide-react'

export const Route = createFileRoute('/$')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: '404 - Page Not Found | Built by Miguel',
      },
      {
        name: 'description',
        content: 'The page you are looking for does not exist on Built by Miguel.',
      },
    ],
  }),
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 sm:py-24 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-2xl shadow-amber-500/10">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-slate-400">
          ERROR 404
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
          The link you followed may be broken or the page may have been moved. Let's get you back on track.
        </p>
      </div>

      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 text-left space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
          Popular Destinations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
          <Link
            to="/local-seo-gbp"
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white flex items-center gap-2.5 transition-all"
          >
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Local SEO</span>
          </Link>
          <Link
            to="/websites-care"
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center gap-2.5 transition-all"
          >
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Websites</span>
          </Link>
          <Link
            to="/systems-auto"
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white flex items-center gap-2.5 transition-all"
          >
            <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Systems</span>
          </Link>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/audit"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Get Free Audit</span>
        </Link>
      </div>
    </div>
  )
}
