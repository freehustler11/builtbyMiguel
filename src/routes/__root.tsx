import { createRootRouteWithContext, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Navbar } from '@/components/Navbar'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/50 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Powered by <span className="text-cyan-400 font-medium">Vite</span>,{' '}
            <span className="text-indigo-400 font-medium">TanStack Router</span>,{' '}
            <span className="text-amber-400 font-medium">TanStack Query</span> &{' '}
            <span className="text-teal-400 font-medium">Tailwind CSS</span>
          </p>
          <p className="font-mono text-slate-600">Built by Miguel</p>
        </div>
      </footer>

      {/* Devtools in development */}
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </>
      )}

      {/* Scroll restoration */}
      <ScrollRestoration />
    </div>
  )
}
