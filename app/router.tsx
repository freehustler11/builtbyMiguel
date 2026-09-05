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
    defaultPreloadStaleTime: 1000 * 5, // 5 seconds fresh preload window
    defaultStaleTime: 0, // Instant reactivity: always fetch fresh server data on route transition or invalidation
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
