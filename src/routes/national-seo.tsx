import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/national-seo')({
  beforeLoad: () => {
    throw redirect({
      to: '/seo/national',
      statusCode: 301,
    })
  },
})
