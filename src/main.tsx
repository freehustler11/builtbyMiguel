import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './index.css'

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Create TanStack Router instance with context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register router for type safety autocomplete
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render or hydrate root application
const rootElement = document.getElementById('root')!
if (rootElement.innerHTML.trim().length > 0) {
  ReactDOM.hydrateRoot(
    rootElement,
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
} else {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
