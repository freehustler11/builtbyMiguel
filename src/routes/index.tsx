import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Rocket, 
  Database, 
  Route as RouteIcon, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  Palette
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Simulated async fetch function for TanStack Query demo
interface FeatureDemoItem {
  id: number
  title: string
  status: string
  updatedAt: string
}

async function fetchProjectStats(): Promise<{
  timestamp: string
  responseTimeMs: number
  items: FeatureDemoItem[]
}> {
  const start = performance.now()
  // Simulate network latency (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400))
  const end = performance.now()

  return {
    timestamp: new Date().toLocaleTimeString(),
    responseTimeMs: Math.round(end - start),
    items: [
      { id: 1, title: 'Vite 6 + React 19 Scaffolding', status: 'Active', updatedAt: 'Instant HMR' },
      { id: 2, title: 'TanStack Router File-Based Routing', status: 'Synced', updatedAt: 'src/routes' },
      { id: 3, title: 'TanStack Query Server State Cache', status: 'Cached', updatedAt: 'Stale-While-Revalidate' },
      { id: 4, title: 'Tailwind CSS v4 Engine', status: 'Configured', updatedAt: '@tailwindcss/vite' },
      { id: 5, title: 'TypeScript Strict Type Safety', status: 'Enforced', updatedAt: 'Full Autocomplete' },
    ],
  }
}

function HomePage() {
  const queryClient = useQueryClient()
  const [fetchCount, setFetchCount] = useState(0)

  // TanStack Query hook
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['projectStats', fetchCount],
    queryFn: fetchProjectStats,
    staleTime: 1000 * 30, // 30 seconds fresh cache
  })

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Rocket className="w-3.5 h-3.5" /> Full-Stack Architecture Ready
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen React App with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              TanStack Router & Query
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Your project is fully configured with modern file-based routing, instant code-splitting, 
            declarative data management, and utility-first Tailwind CSS.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setFetchCount((c) => c + 1)
                refetch()
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Test TanStack Query Refetch
            </button>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200"
            >
              Explore Tech Stack
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* TanStack Query Live Demo Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">TanStack Query Cache Live Status</h2>
            </div>
            <p className="text-sm text-slate-400">
              Live cached data query demonstrating state lifecycle, latency tracking, and automatic background revalidation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Key: ['projectStats', {fetchCount}]
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                isFetching
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isFetching ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              {isFetching ? 'Fetching...' : 'Cached & Fresh'}
            </span>
          </div>
        </div>

        {/* Query Result View */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-400">Fetching query data...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              Error fetching data: {(error as Error).message}
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500">Last Synced:</span>{' '}
                  <span className="text-cyan-300 font-semibold">{data.timestamp}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500">Query Response Time:</span>{' '}
                  <span className="text-emerald-400 font-semibold">~{data.responseTimeMs} ms</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500">Cache Invalidation:</span>{' '}
                  <span className="text-indigo-300 font-semibold">30s Stale Time</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Feature Component</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Location / Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          {item.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {item.updatedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Core Stack Breakdown</h2>
          <p className="text-sm text-slate-400">
            Enterprise-grade tooling pre-configured for speed, maintainability, and developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* TanStack Router */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RouteIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">TanStack Router</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              File-based type-safe routing under <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-indigo-300">src/routes</code> with automated route tree generation and search param validation.
            </p>
          </div>

          {/* TanStack Query */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">TanStack Query</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Powerful asynchronous state management providing declarative caching, deduplication, and background updates.
            </p>
          </div>

          {/* Vite 6 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Vite Bundler</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Blazing fast Hot Module Replacement (HMR) and optimized Rollup production builds with zero latency.
            </p>
          </div>

          {/* Tailwind CSS v4 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Tailwind CSS v4</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modern utility-first CSS styling powered directly by the official Vite integration without heavy config files.
            </p>
          </div>

          {/* TypeScript */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Strict TypeScript</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              End-to-end type safety across route params, query keys, data models, and component props.
            </p>
          </div>

          {/* Easy Extension */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Extensible Routing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create a file like <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-fuchsia-300">src/routes/posts/$id.tsx</code> to add dynamic routes with auto-generated types immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
