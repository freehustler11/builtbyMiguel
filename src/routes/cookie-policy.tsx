import { createFileRoute, Link } from '@tanstack/react-router'
import { Cookie, ArrowLeft, CheckCircle2 } from 'lucide-react'

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
        content: 'Cookie Policy for Built by Miguel. Minimal, strictly functional cookies with zero third-party cross-site tracking pixels.',
      },
    ],
  }),
  component: CookiePolicyPage,
})

function CookiePolicyPage() {
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
          Cookie Policy
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your computer or mobile device by websites you visit. They are used to make websites work efficiently, remember user preferences, and provide diagnostic performance insights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Cookies We Use</h2>
          <p>
            We adhere to a minimalist data approach. We only use strictly necessary and performance-oriented cookies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">Essential / Functional Cookies:</strong> Required for the core technical operation of our application, including client authentication session tokens on <code className="text-emerald-400 font-mono text-xs">app.builtbymiguel.com</code>, CSRF security tokens, and routing navigation state.
            </li>
            <li>
              <strong className="text-slate-200">Performance & Speed Diagnostics:</strong> Anonymized metrics utilized via Cloudflare edge caching to measure page load latency and ensure 95+ Core Web Vitals scores.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. What We Do NOT Use</h2>
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs sm:text-sm text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>
              We do <strong>not</strong> install invasive third-party cross-site behavioral tracking cookies, data-broker tracking beacons, or cross-domain ad retargeting pixels on this site.
            </span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Managing & Disabling Cookies</h2>
          <p>
            You can control, block, or delete cookies at any time through your web browser settings (Chrome, Safari, Firefox, Edge). Please note that disabling essential cookies may impact authentication on the client portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
          <p>
            For questions regarding our cookie practices:
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
