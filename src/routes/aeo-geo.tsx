import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/aeo-geo')({
  beforeLoad: () => {
    throw redirect({
      to: '/seo/aeo-geo',
      statusCode: 301,
    })
  },
})
