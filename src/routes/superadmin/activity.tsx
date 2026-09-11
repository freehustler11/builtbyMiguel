import { createFileRoute, redirect } from '@tanstack/react-router'
import { requireSuperadmin } from '../../lib/auth'

export const Route = createFileRoute('/superadmin/activity')({
  beforeLoad: async ({ location }) => {
    await requireSuperadmin({ location })
    throw redirect({
      to: '/admin/activity',
      search: location.search as any,
    })
  },
  component: () => null,
})
