import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

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
        content: 'Terms of Service for software development, Local SEO retainers, and care plan services provided by Built by Miguel.',
      },
    ],
  }),
  component: TermsPage,
})

function TermsPage() {
  const lastUpdated = 'September 1, 2026'

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing https://builtbymiguel.com or engaging Built by Miguel for software development, Local SEO, or care plans, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Scope of Services</h2>
          <p>
            Built by Miguel provides technical software engineering, website development, Google Business Profile management, local citation optimization, and custom workflow automations as outlined in individual client proposals and service level agreements (SLAs).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Intellectual Property & Code Ownership</h2>
          <p>
            Upon receipt of full payment for design sprints and custom development milestones, full intellectual property rights, source code, design assets, and database configurations transfer entirely to the client. Built by Miguel retains no proprietary lock-in on custom code created for your business.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Monthly Retainers & Cancellation</h2>
          <p>
            Ongoing retainers (Local SEO Management and Website Care Plans) operate on a month-to-month basis unless a fixed-term agreement is explicitly signed. You may pause or cancel monthly retainer services at any time with a 30-day written notice before the next billing cycle.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
          <p>
            While we apply industry-best engineering and search optimization practices, Google algorithm adjustments and local search dynamics are controlled by third-party search engines. Built by Miguel is not liable for indirect, incidental, or consequential damages resulting from platform updates or third-party service outages.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the United States. For any inquiries regarding legal agreements, contact <a href="mailto:legal@builtbymiguel.com" className="text-rose-600 dark:text-rose-400 font-mono">legal@builtbymiguel.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
