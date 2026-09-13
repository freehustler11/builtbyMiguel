import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/cookie-policy')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Cookie Policy | built by Miguel',
      },
      {
        name: 'description',
        content: 'Cookie Policy for built by Miguel. Transparent cookie usage, zero third-party advertising cookies, and visitor privacy controls.',
      },
      {
        property: 'og:title',
        content: 'Cookie Policy | built by Miguel',
      },
      {
        property: 'og:description',
        content: 'Cookie Policy for built by Miguel. Transparent cookie usage, zero third-party advertising cookies, and visitor privacy controls.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/cookie-policy',
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
            Cookie Policy
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
              1. What Are Cookies
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the site function properly, remember your preferences, and, where you&apos;ve consented, help us understand how visitors use the site. This policy also covers similar technologies (such as local storage) that may be used by a custom-built analytics system in the future, wherever they serve the same purpose as a cookie.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              2. Types of Cookies We Use
            </h2>
            <ul className="list-disc list-outside pl-6 space-y-2.5">
              <li>
                <strong className="text-slate-900 dark:text-white">Strictly Necessary Cookies:</strong> required for the website to function (e.g. security, load balancing, remembering your cookie consent choice). These cannot be disabled and don&apos;t require consent.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Analytics Cookies:</strong> help us understand how visitors use the site (e.g. which pages are viewed, how long visitors stay) so we can improve performance and content. These are only set with your consent.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Functional Cookies:</strong> remember choices you make (e.g. display preferences, or remembering your name and email for the blog comment form) to improve your experience. These are only set with your consent.
              </li>
            </ul>
            <p>
              We do not use advertising or marketing cookies. Consistent with our Privacy Policy, we don&apos;t run third-party ad tracking, retargeting pixels, or sell your data to advertisers, so there&apos;s no advertising cookie category on this site.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              3. Third-Party and Custom Analytics
            </h2>
            <p>
              We do not currently run any analytics tracking on this site. This section will be updated, with a new &ldquo;Last Updated&rdquo; date, before any analytics tool goes live, whether that&apos;s Google Analytics, a custom-built analytics system, or both. Once active, this section will name the specific tool(s) in use and link to their privacy documentation where applicable. Analytics cookies (or similar tracking technologies, such as local storage, if a self-hosted system is used) will only be set with your consent through the banner described below.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              4. How to Control Cookies
            </h2>
            <p>
              You can manage your cookie preferences at any time using the &ldquo;Cookie Preferences&rdquo; link in the site footer, which reopens the consent banner described below. You can also block or delete cookies through your browser settings, though disabling strictly necessary cookies may affect site functionality.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              5. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Material changes will be reflected by an updated &ldquo;Last Updated&rdquo; date at the top of this page.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              6. Contact Information
            </h2>
            <p>
              If you have questions about this Cookie Policy, contact:
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
