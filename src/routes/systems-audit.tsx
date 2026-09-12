import { createFileRoute } from '@tanstack/react-router'
import { FreeSystemsAuditCTA } from '../components/FreeSystemsAuditCTA'

export const Route = createFileRoute('/systems-audit')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Free Systems & Workflow Automation Audit | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Get a free video review of your business systems, tools, and lead workflows. See what is costing you hours and learn what can run on autopilot.',
      },
      {
        name: 'keywords',
        content:
          'systems audit, workflow automation audit, contractor systems review, business automation video',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Free Systems & Workflow Automation Audit | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Free personal video review of your tools, intake workflows, and dispatch automations.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/systems-audit' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/systems-audit',
      },
    ],
  }),
  component: SystemsAuditPage,
})

function SystemsAuditPage() {
  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <FreeSystemsAuditCTA />
    </div>
  )
}
