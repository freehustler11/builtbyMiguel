import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Terms of Service | built by Miguel',
      },
      {
        name: 'description',
        content: 'Terms of Service for software development, SEO, website design, and care plans provided by built by Miguel.',
      },
      {
        property: 'og:title',
        content: 'Terms of Service | built by Miguel',
      },
      {
        property: 'og:description',
        content: 'Terms of Service for software development, SEO, website design, and care plans provided by built by Miguel.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/terms',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/terms',
      },
    ],
  }),
  component: TermsPage,
})

function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
            Last Updated: September 13, 2026
          </p>
        </header>

        {/* Policy Sections */}
        <div className="space-y-12 mt-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing https://builtbymiguel.net or engaging built by Miguel for software development, SEO, website design, or care plans, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              2. Scope of Services
            </h2>
            <p>
              built by Miguel provides software development, website design and development, local, national, and AI search optimization, Google Business Profile management, citation optimization, and custom workflow automations, as outlined in individual client proposals and service agreements. Services are provided to clients worldwide; nothing in these Terms limits or is limited to any single country.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              3. Payment Terms
            </h2>
            <p>
              Invoices are due within 15 days of receipt unless otherwise stated in your project proposal. Payment is accepted via a secure third-party payment processor. Work may be paused on any project or retainer with an invoice more than 15 days past due. A late fee of 1.5% per month may apply to overdue balances, to the extent permitted by applicable law. Fees do not include any applicable taxes, duties, or similar charges, which are the client&apos;s responsibility unless otherwise stated in writing.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              4. Intellectual Property &amp; Code Ownership
            </h2>
            <p>
              Upon receipt of full payment for design sprints and custom development milestones, full intellectual property rights, source code, design assets, and database configurations transfer entirely to the client. built by Miguel retains no proprietary lock-in on custom code created for your business. Until full payment is received, all work product remains the property of built by Miguel.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              5. Client Responsibilities
            </h2>
            <p>
              To deliver services on schedule, we rely on you to provide timely access, content, feedback, and approvals when requested. Delays caused by late client responses, missing content, or delayed access to accounts (e.g. domain, hosting, Google Business Profile) may extend project timelines accordingly and are not the responsibility of built by Miguel.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              6. Monthly Retainers &amp; Cancellation
            </h2>
            <p>
              Ongoing retainers (SEO management, website care plans, and automation plans) operate on a month-to-month basis unless a fixed-term agreement is explicitly signed. You may pause or cancel monthly retainer services at any time with 30 days&apos; written notice before the next billing cycle. Work completed up to the cancellation date remains billable.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              7. Refund Policy
            </h2>
            <p>
              Deposits and milestone payments for one-time project work are non-refundable once work has begun on that milestone, since time and resources are allocated immediately upon starting. A milestone is considered started once built by Miguel has provided written confirmation (e.g. email) that work has commenced, or once any deliverable, draft, or setup step for that milestone has been shared with the client, whichever happens first. If a project is cancelled before work begins on a paid milestone, that milestone&apos;s payment will be refunded in full. Monthly retainer payments are not refunded for partial months, per Section 6.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              8. Confidentiality
            </h2>
            <p>
              Both parties agree to keep confidential any non-public business, technical, or financial information shared during the engagement, including account credentials, business strategy, and unreleased work product. This obligation survives the termination of services.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              9. Independent Contractor Relationship
            </h2>
            <p>
              built by Miguel is an independent contractor, not an employee, partner, or joint venturer of the client. Nothing in these Terms creates an employment, agency, or partnership relationship between the parties.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              10. No Guarantee of Results
            </h2>
            <p>
              While we apply industry-standard development and search optimization practices, search engine rankings, traffic, AI search visibility, and lead volume are influenced by factors outside our control, including algorithm changes by Google and other search engines, market competition, and third-party platform changes. built by Miguel does not guarantee specific rankings, traffic levels, lead volume, or revenue outcomes. Services are provided on an &ldquo;as-is&rdquo; basis with respect to third-party platform performance.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              11. Disclaimer of Warranties
            </h2>
            <p>
              Except as expressly stated in these Terms or in an individual client proposal, built by Miguel makes no warranties, express or implied, including any implied warranties of merchantability, fitness for a particular purpose, or non-infringement. Deliverables are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              12. Limitation of Liability
            </h2>
            <p>
              Google algorithm adjustments and local search dynamics are controlled by third-party search engines. built by Miguel is not liable for indirect, incidental, or consequential damages resulting from platform updates or third-party service outages. To the maximum extent permitted by applicable law, built by Miguel&apos;s total liability for any claim arising from these Terms or our services will not exceed the total amount paid by the client in the three (3) months preceding the claim. This limitation does not apply to damages caused by gross negligence, willful misconduct, or fraud, or in any case where such a limitation is not permitted by applicable law.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              13. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold built by Miguel harmless from any claims, damages, or expenses arising from your misuse of deliverables, violation of these Terms, or content you provide that infringes on a third party&apos;s rights.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              14. Termination
            </h2>
            <p>
              Either party may terminate a project engagement or retainer for material breach of these Terms, provided the breaching party is given 15 days&apos; written notice and an opportunity to cure. built by Miguel reserves the right to terminate services immediately for non-payment or abusive conduct. Either party may also terminate a one-time project engagement for convenience with written notice; refunds for work already completed or started follow Section 7. Monthly retainers may be terminated for convenience per Section 6.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              15. Force Majeure
            </h2>
            <p>
              built by Miguel is not liable for delays or failures in performance resulting from circumstances beyond reasonable control, including but not limited to natural disasters, internet or power outages, or third-party service provider failures.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              16. Severability and No Waiver
            </h2>
            <p>
              If any provision of these Terms is found unenforceable, the remaining provisions remain in full force and effect. Our failure to enforce any provision of these Terms does not constitute a waiver of that provision.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              17. Governing Law and Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of the Republic of the Philippines, without regard to conflict of law principles. Any dispute arising from or relating to these Terms or our services will first be addressed through good-faith informal negotiation between the parties. If a dispute cannot be resolved informally within 30 days, it will be subject to the exclusive jurisdiction of the courts of Dumaguete City, Negros Oriental, Philippines.
            </p>
            <p>
              This governing-law choice does not limit our services to clients in the Philippines, we work with clients worldwide, and this clause exists solely to establish a single, consistent jurisdiction for resolving disputes. It does not override any mandatory consumer protection, data protection, or other non-waivable rights you may be entitled to under the law of your own country of residence, to the extent such rights cannot be validly waived by agreement.
            </p>
          </section>

          {/* Section 18 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              18. Notices
            </h2>
            <p>
              Any written notice required under these Terms is valid if sent by email to{' '}
              <a
                href="mailto:umbacmi@gmail.com"
                className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                umbacmi@gmail.com
              </a>{' '}
              (from you) or to the email address you&apos;ve provided for your engagement (from us). Notices are considered received the next business day after sending.
            </p>
          </section>

          {/* Section 19 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              19. Assignment
            </h2>
            <p>
              You may not assign or transfer these Terms without our prior written consent. built by Miguel may assign these Terms in connection with a sale, merger, or transfer of the business, with notice to active clients.
            </p>
          </section>

          {/* Section 20 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              20. No Third-Party Beneficiaries
            </h2>
            <p>
              These Terms are for the benefit of the parties only and do not create any rights for any third party.
            </p>
          </section>

          {/* Section 21 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              21. Entire Agreement
            </h2>
            <p>
              These Terms, together with any individual client proposal or service agreement, constitute the entire agreement between the parties regarding the services described, and supersede any prior agreements or understandings, written or oral.
            </p>
          </section>

          {/* Section 22 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              22. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will be reflected by an updated &ldquo;Last Updated&rdquo; date at the top of this page. Continued use of our website or services after changes are posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Section 23 */}
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              23. Contact Information
            </h2>
            <p>
              For any inquiries regarding these Terms, contact:
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

