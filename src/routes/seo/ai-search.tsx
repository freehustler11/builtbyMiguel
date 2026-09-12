import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/seo/ai-search')({
  beforeLoad: () => {
    throw redirect({
      to: '/seo/aeo-geo',
      statusCode: 301,
    })
  },
})
