import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireSuperadmin, checkAuthServerFn } from '../lib/auth'

export const Route = createFileRoute('/superadmin')({
  beforeLoad: async ({ location }) => {
    await requireSuperadmin({ location })
  },
  loader: async () => {
    const auth = await checkAuthServerFn()
    return { auth }
  },
  component: SuperadminLayout,
})

function SuperadminLayout() {
  return <Outlet />
}
