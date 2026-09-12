import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/websites-care')({
  beforeLoad: () => {
    throw redirect({
      to: '/websites/hosting-and-maintenance',
      statusCode: 301,
    })
  },
})
