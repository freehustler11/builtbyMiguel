import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory } from '@tanstack/history'
import { routeTree } from './routeTree.gen'

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  })

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  })

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: {
      queryClient,
    },
  })

  await router.load()

  const appHtml = ReactDOMServer.renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(RouterProvider, { router })
    )
  )

  return { appHtml, router }
}
