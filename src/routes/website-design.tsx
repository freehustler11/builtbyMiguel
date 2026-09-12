import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/website-design')({
  beforeLoad: () => {
    throw redirect({
      to: '/websites/design-and-development',
      statusCode: 301,
    })
  },
})
