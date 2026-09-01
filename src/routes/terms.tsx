import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Terms of Service | Built by Miguel',
      },
      {
        name: 'description',
        content: 'Terms of service, project milestones, retainer cancellation policy, and intellectual property ownership for Built by Miguel.',
      },
    ],
  }),
  component: TermsPage,
})

function TermsPage() {
  const lastUpdated = 'September 1, 2026'

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Scope of Services</h2>
          <p>
            Built by Miguel ("we", "us", "our") delivers digital engineering, search engine optimization, and workflow automation services, including:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Custom website design, React/TypeScript software development, and cloud edge hosting.</li>
            <li>Google Business Profile optimization, local directory citation building, and Map Pack rank tracking.</li>
            <li>Workflow automation, CRM pipelines, webhook integrations, and internal tool dashboards.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Payments & Deposits</h2>
          <p>
            Fixed-scope projects (such as custom website builds) typically require a 50% non-refundable deposit prior to commencing work, with the remaining balance due upon milestone completion and before final domain DNS cutover.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Monthly Growth & Care Retainers</h2>
          <p>
            Monthly Care and Local SEO Retainers are billed automatically every 30 days via Stripe. There are no multi-year lock-in contracts. You may cancel your monthly retainer at any time with a 30-day written notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Intellectual Property & Ownership</h2>
          <p>
            Upon receipt of full payment for custom design and development services, all custom source code, website assets, design mockups, and copy become the sole intellectual property of the Client. We reserve the right to display the completed work in our portfolio and case studies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Local Search & Performance Disclaimer</h2>
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Honest Algorithm Realities
            </div>
            <p>
              While we utilize data-proven, white-hat Local SEO strategies and high-speed web architecture to maximize ranking velocity, Google algorithms and third-party AI models remain proprietary and operate outside direct external control. We do not make fraudulent "guaranteed #1 rank overnight" claims.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Governing Law & Contact</h2>
          <p>
            These terms are governed by the laws of the United States. For questions regarding agreements or contracts, contact:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div>Built by Miguel</div>
            <div>Email: <a href="mailto:hello@builtbymiguel.com" className="text-emerald-400">hello@builtbymiguel.com</a></div>
          </div>
        </section>
      </div>
    </div>
  )
}
