import { createFileRoute, Link } from '@tanstack/react-router'
import { Cookie, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/cookie-policy')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Cookie Policy | Built by Miguel',
      },
      {
        name: 'description',
        content: 'Cookie Policy for Built by Miguel. Minimal cookies, zero tracking ad pixels, and strict performance metrics.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/cookie-policy',
      },
    ],
  }),
  component: CookiePolicyPage,
})

function CookiePolicyPage() {
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
          Cookie Policy
        </h1>
        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 text-sm flex items-start gap-3 shadow-sm dark:shadow-none">
        <Cookie className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
        <div>
          <strong className="text-slate-900 dark:text-white block font-semibold mb-1">Zero Invasive Ad Tracking:</strong>
          We do not deploy invasive third-party ad retargeting pixels or cross-site tracking cookies. We strictly utilize essential functional cookies for form delivery and performance monitoring.
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. They are used to ensure proper technical function, session authentication, and to collect anonymized website diagnostic metrics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Cookies We Use</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 pl-2">
            <li><strong className="text-slate-800 dark:text-slate-100">Essential Technical Cookies:</strong> Necessary to enable security, form submission validation, and portal session authentication.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Diagnostic Performance Metrics:</strong> Privacy-friendly, aggregate analytics to measure page load speeds, Core Web Vitals, and server response times.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Managing Cookie Preferences</h2>
          <p>
            Most modern web browsers allow you to manage or block cookies through their privacy settings. Please note that disabling essential cookies may impact certain interactive form features or client portal access.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Contact Us</h2>
          <p>
            If you have questions regarding our cookie practices, email <a href="mailto:privacy@builtbymiguel.net" className="text-rose-600 dark:text-rose-400 font-mono">privacy@builtbymiguel.net</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
