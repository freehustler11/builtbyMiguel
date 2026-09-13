import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

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
        content: 'Privacy Policy and data protection terms for built by Miguel. Simple, transparent privacy practices and zero selling of personal or business data.',
      },
      {
        property: 'og:title',
        content: 'Privacy Policy | built by Miguel',
      },
      {
        property: 'og:description',
        content: 'Privacy Policy and data protection terms for built by Miguel. Simple, transparent privacy practices and zero selling of personal or business data.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/privacy-policy',
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
  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24 text-slate-700 dark:text-slate-300 leading-relaxed text-base">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
            Last Updated: September 13, 2026
          </p>
        </header>

        {/* Plain-Language Privacy Promise */}
        <div className="my-10 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
            <span className="font-semibold">Our Plain-Language Privacy Promise:</span> We never sell, rent, monetize, or share your personal contact information or business data with any third-party advertisers. Ever.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              1. Who We Are
            </h2>
            <p>
              This Privacy Policy applies to builtbymiguel.net, operated by Miguel Umbac (&ldquo;built by Miguel,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a sole proprietorship based in Dumaguete City, Philippines, providing SEO, web design, and automation services to clients worldwide.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              2. Information We Collect
            </h2>
            <p>
              When you interact with our website or submit an audit, demo, or contact form, we may collect the following information:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>
                <strong className="text-slate-900 dark:text-white">Contact Information:</strong> Your name, email address, phone number, and business name.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Business Details:</strong> Your website URL, target service areas, and local market goals.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Diagnostic Analytics:</strong> Technical data such as browser type, device type, referring URL, and approximate geolocation (derived from IP address), used to understand website performance and visitor behavior.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Cookies and Similar Technologies:</strong> See our{' '}
                <Link to="/cookie-policy" className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  Cookie Policy
                </Link>{' '}
                for full details on what&apos;s used and how to control it.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              3. How We Use Your Information
            </h2>
            <p>
              Your information is used solely to provide our core services, including:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>Recording and delivering your requested video visibility audit or website demo.</li>
              <li>Responding directly to project discovery inquiries and scheduling consultations.</li>
              <li>Configuring client portal access and operational automation engines for active clients.</li>
              <li>Sending service notifications, performance reports, and, if you&apos;re an active client, project updates.</li>
              <li>Improving website performance and user experience based on aggregated, non-identifying analytics.</li>
            </ul>
            <p>
              We do not use your information for automated decision-making that produces legal or similarly significant effects, and we do not use your contact or business information for third-party advertising or resell it to data brokers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              4. Legal Basis for Processing (For Visitors in the EU/EEA/UK)
            </h2>
            <p>
              If you&apos;re located in the European Union, European Economic Area, or United Kingdom, our legal basis for processing your personal data depends on the interaction:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>
                <strong className="text-slate-900 dark:text-white">Contract performance:</strong> processing needed to deliver a service you&apos;ve requested or engaged us for.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Consent:</strong> where you&apos;ve voluntarily submitted a form (e.g. the free audit request).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Legitimate interests:</strong> basic website analytics and security monitoring, balanced against your rights.
              </li>
            </ul>
            <p>
              This section is included as a precaution given the &ldquo;worldwide&rdquo; scope of our services; it applies only if you&apos;re actually located in the EU/EEA/UK and has no effect otherwise.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              5. How Long We Keep Your Information
            </h2>
            <p>
              Contact form submissions (audit/demo requests that don&apos;t convert to a client engagement) are retained for 12 months, then deleted.
            </p>
            <p>
              Active client data is retained for the duration of the engagement, and for 3 years afterward, in line with standard accounting and recordkeeping practices. You may request earlier deletion at any time, see Section 9.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              6. Data Security &amp; Storage
            </h2>
            <p>
              We deploy TLS/SSL encryption across all network requests. Form submission data is processed via secure serverless functions and transmitted directly to encrypted client pipelines. We do not maintain unencrypted public database endpoints. No method of transmission or storage is 100% secure, and while we take reasonable technical and organizational measures to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              7. Third-Party Service Providers
            </h2>
            <p>
              We work with trusted infrastructure providers to operate our services, including cloud hosting providers, email delivery services, SMS/communication routing services, and payment processors. These providers only receive the information necessary to perform their specific function, are bound by their own data protection obligations, and are prohibited from using your information for their own independent marketing purposes.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              8. International Data Transfers
            </h2>
            <p>
              We are based in the Philippines and serve clients in the United States, Canada, Australia, and other countries. Your information may be processed and stored on servers located outside your own country, including in the Philippines and in countries where our third-party service providers operate. By using our services, you consent to this transfer.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              9. Your Data Rights
            </h2>
            <p>
              Depending on where you live, you may have some or all of the following rights regarding your personal data. We work with clients worldwide, not just the jurisdictions named below, they&apos;re listed as common examples, not an exhaustive or exclusive list:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>
                <strong className="text-slate-900 dark:text-white">Access:</strong> request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Correction:</strong> request correction of inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Deletion:</strong> request deletion of your personal data, subject to legal or contractual retention requirements.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Objection/Restriction:</strong> object to or request restriction of certain processing (where applicable, e.g. under GDPR).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Portability:</strong> request your data in a portable format (where applicable, e.g. under GDPR).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">California residents (CCPA/CPRA):</strong> the right to know what personal information is collected, request deletion, and opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. We do not sell or share personal information as defined under the CCPA/CPRA.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Canada residents (PIPEDA):</strong> the rights above, plus the right to file a complaint with the Office of the Privacy Commissioner of Canada.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Australia residents (Privacy Act 1988):</strong> the rights above, plus the right to complain to the Office of the Australian Information Commissioner (OAIC).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Philippines residents (Data Privacy Act of 2012):</strong> the rights above, plus the right to be informed and the right to file a complaint with the National Privacy Commission.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Wherever you&apos;re located:</strong> if the law of your country or region grants you data protection rights beyond what&apos;s listed above, we will honor those rights to the extent required by applicable law. Contact us using the details below and we&apos;ll address your request based on where you live, even if your specific country isn&apos;t named above.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:umbacmi@gmail.com"
                className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                umbacmi@gmail.com
              </a>
              . We will respond within a reasonable timeframe and in accordance with applicable law.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              10. Children&apos;s Privacy
            </h2>
            <p>
              Our services are not directed to individuals under 18, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us at{' '}
              <a
                href="mailto:umbacmi@gmail.com"
                className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                umbacmi@gmail.com
              </a>{' '}
              and we will delete it.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              11. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites, including social media profiles, blog references, or resources. This Privacy Policy applies only to our website and services. We are not responsible for the privacy practices or content of any third-party site, and we encourage you to review the privacy policy of any site you visit.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              12. Data Breach Notification
            </h2>
            <p>
              In the event of a data breach affecting your personal information, we will notify affected individuals and relevant authorities as required by applicable law, without undue delay.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              13. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, built by Miguel is not liable for any indirect, incidental, or consequential damages arising from unauthorized access to or use of your personal data resulting from circumstances beyond our reasonable control, including but not limited to third-party service provider failures, security breaches despite reasonable safeguards, or acts of third parties. This Privacy Policy does not create any contractual rights beyond what is expressly stated here.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              14. Severability and No Waiver
            </h2>
            <p>
              If any provision of this Privacy Policy is found unenforceable, the remaining provisions remain in full force and effect. Our failure to enforce any provision of this Policy does not constitute a waiver of that provision.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              15. Governing Law and Dispute Resolution
            </h2>
            <p>
              This Privacy Policy is governed by the laws of the Republic of the Philippines, without regard to conflict of law principles. Any dispute arising from or relating to this Privacy Policy or our data practices will first be addressed through good-faith informal negotiation between the parties. If a dispute cannot be resolved informally within 30 days, it will be subject to the exclusive jurisdiction of the courts of Dumaguete City, Negros Oriental, Philippines. Nothing in this section limits any non-waivable rights you may have under mandatory local consumer protection or data protection law in your own country of residence.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              16. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be reflected by an updated &ldquo;Last Updated&rdquo; date at the top of this page. Continued use of our website or services after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              17. Contact Information
            </h2>
            <p>
              If you have questions regarding this Privacy Policy, contact:
            </p>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-sm space-y-2 shadow-xs">
              <div className="font-bold font-display text-base text-slate-900 dark:text-white">
                built by Miguel
              </div>
              <div>
                Email:{' '}
                <a
                  href="mailto:umbacmi@gmail.com"
                  className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                  umbacmi@gmail.com
                </a>
              </div>
              <div>
                Website:{' '}
                <a
                  href="https://builtbymiguel.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-mono text-xs"
                >
                  https://builtbymiguel.net
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
