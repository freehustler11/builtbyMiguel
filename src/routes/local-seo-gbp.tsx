import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/local-seo-gbp')({
  beforeLoad: () => {
    throw redirect({
      to: '/seo/local',
      statusCode: 301,
    })
  },
})
