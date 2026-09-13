import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/accessibility')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Accessibility Statement | built by Miguel',
      },
      {
        name: 'description',
        content: 'Accessibility Statement for built by Miguel. Our commitment to digital inclusion, WCAG 2.1 AA targets, built-in features, and visitor feedback.',
      },
      {
        property: 'og:title',
        content: 'Accessibility Statement | built by Miguel',
      },
      {
        property: 'og:description',
        content: 'Accessibility Statement for built by Miguel. Our commitment to digital inclusion, WCAG 2.1 AA targets, built-in features, and visitor feedback.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/accessibility',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/accessibility',
      },
    ],
  }),
  component: AccessibilityPage,
})

function AccessibilityPage() {
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
            Accessibility Statement
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
              1. Our Commitment
            </h2>
            <p>
              built by Miguel is committed to making this website usable by as many people as possible, including people with disabilities. We continually work to improve the accessibility and usability of this site for everyone.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              2. Conformance Target
            </h2>
            <p>
              We aim to align this website with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. This is an ongoing effort rather than a certified or audited claim of full conformance.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              3. Accessibility Features Built Into This Site
            </h2>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>
                Semantic heading structure (H1, H2, H3) on every page, so screen readers and assistive technology can navigate content logically.
              </li>
              <li>
                Descriptive alt text on images, so visual content is understandable when read aloud or when images fail to load.
              </li>
              <li>
                Keyboard-navigable menus and forms, so the site can be used without a mouse.
              </li>
              <li>
                Labeled form fields, including the contact form, so assistive technology can correctly identify what each field is for.
              </li>
              <li>
                Responsive design that adapts to different screen sizes, zoom levels, and devices.
              </li>
              <li>
                Sufficient color contrast between text and background, designed to meet WCAG AA contrast ratios.
              </li>
              <li>
                An on-site accessibility toolbar (available from the button in the bottom corner of every page) that lets you adjust text size, switch to a high-contrast display mode, reduce motion and animation, and force underlines on all links, your preferences are saved and applied automatically on your next visit.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              4. Known Limitations
            </h2>
            <p>
              No website can guarantee full accessibility for every assistive technology and every use case. We&apos;re not aware of specific barriers on this site at this time, but if you encounter one, please let us know using the contact information below, we&apos;ll investigate and address it.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              5. Feedback
            </h2>
            <p>
              If you experience any difficulty accessing content or functionality on this website, contact us at{' '}
              <a
                href="mailto:umbacmi@gmail.com"
                className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                umbacmi@gmail.com
              </a>
              . Please describe the issue and the page where you encountered it, and we&apos;ll respond within 5 business days.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              6. Compatibility
            </h2>
            <p>
              This site is designed to work with current versions of major browsers (Chrome, Firefox, Safari, Edge) and common screen readers (e.g. NVDA, JAWS, VoiceOver).
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              7. Changes to This Statement
            </h2>
            <p>
              We may update this Accessibility Statement as the site evolves. Material changes will be reflected by an updated &ldquo;Last Updated&rdquo; date at the top of this page.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              8. Contact Information
            </h2>
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
