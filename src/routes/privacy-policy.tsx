import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, Lock, Eye, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Privacy Policy | Built by Miguel',
      },
      {
        name: 'description',
        content: 'Privacy Policy and data protection terms for Built by Miguel. Zero data selling, strict form confidentiality, and minimal analytics.',
      },
    ],
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Core Statement Banner */}
      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
        <div>
          <strong className="text-white block font-semibold mb-1">Our Plain-Language Privacy Promise:</strong>
          We never sell, rent, monetize, or share your personal contact information or business data with any third-party advertisers. Ever.
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            When you interact with our website or submit an audit/contact form, we may collect the following information:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong className="text-slate-200">Contact Information:</strong> Your name, email address, phone number, and company name.</li>
            <li><strong className="text-slate-200">Business Details:</strong> Your website URL, target service areas, and local market goals.</li>
            <li><strong className="text-slate-200">Diagnostic Analytics:</strong> Technical data such as anonymized browser type, referring URL, and approximate geolocation to optimize website performance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. How We Use Your Data</h2>
          <p>We use the data collected strictly for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Generating and delivering your personalized 5-minute video local visibility audit.</li>
            <li>Directly communicating with you regarding your service inquiries and projects.</li>
            <li>Provisioning secure client portal access on <code className="text-emerald-400 font-mono text-xs">app.builtbymiguel.com</code>.</li>
            <li>Processing authorized billing transactions and invoices via Stripe.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Third-Party Service Providers</h2>
          <p>
            We only share necessary transactional data with trusted third-party infrastructure providers that enable our website and systems to function securely:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong className="text-slate-200">Stripe:</strong> Encrypted payment processing and recurring subscription management.</li>
            <li><strong className="text-slate-200">Cloudflare:</strong> Secure global CDN edge caching, SSL encryption, and DDoS mitigation.</li>
            <li><strong className="text-slate-200">Transactional Email (Resend):</strong> Reliable delivery of welcome kits and audit notifications.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Data Retention & Your Rights</h2>
          <p>
            We retain your inquiry data only as long as necessary to fulfill project requirements. You have the right at any time to request a complete export or permanent deletion of your contact records by emailing <a href="mailto:hello@builtbymiguel.com" className="text-emerald-400 underline">hello@builtbymiguel.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, reach out directly at:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div>Built by Miguel</div>
            <div>Email: <a href="mailto:hello@builtbymiguel.com" className="text-emerald-400">hello@builtbymiguel.com</a></div>
            <div>Website: https://builtbymiguel.com</div>
          </div>
        </section>
      </div>
    </div>
  )
}
