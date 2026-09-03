import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from '../lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
