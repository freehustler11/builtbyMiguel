import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from '../src/routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: 'intent',
    defaultPreloadDelay: 150, // Preload on deliberate cursor intent (150ms)
    defaultPreloadStaleTime: 1000 * 60 * 2, // 2 minutes
    defaultStaleTime: 1000 * 30, // 30 seconds fresh cache for instant navigation without re-fetching
    scrollRestoration: true,
  })

  return router
}

export function getRouter() {
  return createRouter()
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
