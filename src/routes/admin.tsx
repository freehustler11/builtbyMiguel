import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAdmin } from '../lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    await requireAdmin({ location })
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}

