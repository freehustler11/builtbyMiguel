import { createFileRoute, redirect } from '@tanstack/react-router'
import { requireAuth } from '../../lib/auth'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
    throw redirect({
      to: '/messages',
    })
  },
})
