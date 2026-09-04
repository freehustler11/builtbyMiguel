import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAdmin, checkAuthServerFn } from '../lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    await requireAdmin({ location })
  },
  loader: async () => {
    const auth = await checkAuthServerFn()
    return { auth }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}

