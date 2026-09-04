import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkAuthServerFn } from '../../lib/auth'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const auth = await checkAuthServerFn()
    if (auth.role === 'client') {
      throw redirect({
        to: '/portal',
      })
    }
    if (auth.role === 'partner') {
      throw redirect({
        to: '/admin/clients',
      })
    }
    throw redirect({
      to: '/messages',
    })
  },
})

