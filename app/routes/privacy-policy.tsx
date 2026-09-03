import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Privacy Policy | built by Miguel',
      },
      {
        name: 'description',
        content: 'Privacy Policy and data protection terms for built by Miguel. Zero data selling, strict form confidentiality, and minimal analytics.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/privacy-policy',
      },
    ],
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Core Statement Banner */}
      <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3 shadow-sm dark:shadow-none">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <div>
          <strong className="text-slate-900 dark:text-white block font-semibold mb-1">Our Plain-Language Privacy Promise:</strong>
          We never sell, rent, monetize, or share your personal contact information or business data with any third-party advertisers. Ever.
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When you interact with our website or submit an audit/contact form, we may collect the following information:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 pl-2">
            <li><strong className="text-slate-800 dark:text-slate-100">Contact Information:</strong> Your name, email address, phone number, and company name.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Business Details:</strong> Your website URL, target service areas, and local market goals.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Diagnostic Analytics:</strong> Technical data such as anonymized browser type, referring URL, and approximate geolocation to optimize website performance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            Your information is used solely to provide our core services, including:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 pl-2">
            <li>Recording and delivering your requested 5-minute video visibility audit.</li>
            <li>Responding directly to project discovery inquiries and scheduling consultations.</li>
            <li>Configuring client portal access and operational automation engines.</li>
            <li>Sending critical service notifications and monthly performance reports.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Data Security & Storage</h2>
          <p>
            We deploy modern TLS/SSL encryption across all network requests. Form submission payloads are processed via secure serverless functions and transmitted directly to encrypted client pipelines. We do not maintain unencrypted public database endpoints.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Third-Party Service Providers</h2>
          <p>
            We work with trusted infrastructure providers (e.g., cloud hosting, email delivery APIs, Twilio SMS routing, and Stripe payment processing) solely to operate our software. These parties adhere to strict data security standards and are prohibited from using your information for independent marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Your Data Rights</h2>
          <p>
            You have the right to request access to, correction of, or complete deletion of your personal data from our systems at any time. Simply contact us at <a href="mailto:privacy@builtbymiguel.net" className="text-rose-600 dark:text-rose-400 hover:underline font-mono">privacy@builtbymiguel.net</a>.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy, contact:
          </p>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1 shadow-sm dark:shadow-none">
            <div className="font-bold text-slate-900 dark:text-white">built by Miguel</div>
            <div>Attn: Privacy & Data Protection</div>
            <div>Email: <a href="mailto:privacy@builtbymiguel.net" className="text-rose-600 dark:text-rose-400">privacy@builtbymiguel.net</a></div>
            <div>Website: https://builtbymiguel.net</div>
          </div>
        </section>
      </div>
    </div>
  )
}
