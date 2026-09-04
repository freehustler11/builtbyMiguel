import { createFileRoute, redirect } from '@tanstack/react-router'
import { requireAdmin } from '../../../lib/auth'
import { getReportByIdServerFn } from '../../../server/reports'

export const Route = createFileRoute('/admin/reports/$id/edit')({
  beforeLoad: async ({ location, params }) => {
    await requireAdmin({ location })
    const reportId = params?.id
    if (!reportId) {
      throw redirect({
        to: '/admin/reports',
        search: {
          error: 'access_denied',
        },
      })
    }

    try {
      const res = await getReportByIdServerFn({ data: { id: reportId } })
      if (!res?.report) {
        throw redirect({
          to: '/admin/reports',
          search: {
            error: 'access_denied',
          },
        })
      }
    } catch (err: any) {
      // If already a redirect, rethrow
      if (err && typeof err === 'object' && ('to' in err || 'statusCode' in err || 'search' in err)) {
        throw err
      }
      throw redirect({
        to: '/admin/reports',
        search: {
          error: 'access_denied',
        },
      })
    }

    throw redirect({
      to: '/admin/reports/new',
      search: {
        editId: reportId,
      },
    })
  },
})
