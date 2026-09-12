import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute(
  '/websites_/design-and-development',
)({
  head: () => ({
    meta: [
      {
        title:
          'Website Design & Redesign Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Custom website builds and redesigns for trade contractors, sub-second load times, tap-to-call design, and Google ranking protection. Free personalized demo.',
      },
      {
        name: 'keywords',
        content:
          'website redesign services, custom website design services, contractor website builds, website design and development',
      },
      {
        property: 'og:title',
        content:
          'Website Design & Redesign Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Custom website builds and redesigns for trade contractors, sub-second load times, tap-to-call design, and Google ranking protection. Free personalized demo.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content:
          'https://builtbymiguel.net/websites/design-and-development',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content:
          'Website Design & Redesign Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Custom website builds and redesigns for trade contractors, sub-second load times, tap-to-call design, and Google ranking protection. Free personalized demo.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites/design-and-development',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Website Design and Redesign Services for Contractors',
          serviceType: 'Website Design and Development',
          provider: {
            '@type': 'ProfessionalService',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          description:
            'Custom website builds and redesigns for trade contractors, sub-second load times, tap-to-call design, and Google ranking protection.',
          url: 'https://builtbymiguel.net/websites/design-and-development',
          areaServed: 'US',
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://builtbymiguel.net',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Contractor Websites',
              item: 'https://builtbymiguel.net/websites',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Website Design & Development',
              item: 'https://builtbymiguel.net/websites/design-and-development',
            },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How long does a custom website build or redesign take?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most custom website builds and redesigns take two to three weeks from start to launch. Because you work directly with me, without account managers or junior designers in between, things move fast and revision cycles don\'t drag on.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need a brand new website or just a redesign of my existing site?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'If your current site is more than a few years old, built on a heavy platform, or hard to update, a redesign usually makes more sense than starting from nothing. If you don\'t have a site yet, or your current one isn\'t worth saving, a brand-new build is the better path. This gets sorted out during your free demo.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you use WordPress, Wix, or page builders like Elementor?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Sites are built with custom React code instead of a page-builder platform, which avoids the plugin bloat, slow load times, and update headaches that come with WordPress, Wix, and similar tools.',
              },
            },
            {
              '@type': 'Question',
              name: 'What happens after my new website is launched?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ongoing hosting, backups, security updates, and monthly content edits are handled through the Website Hosting and Care plan, so the site stays fast and current after it goes live.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do customers contact me through the website?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Through sticky tap-to-call buttons, high-contrast quote forms, and, if you use one, a direct connection to your CRM or field service software, so requests reach you the moment they\'re submitted.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much does a website build or redesign cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pricing depends on the size and complexity of the build, and gets quoted individually after your free demo. Ongoing care plans start at $99 per month.',
              },
            },
            {
              '@type': 'Question',
              name: 'Will my new website hurt my current Google rankings?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, when it\'s done correctly. Every redesign includes 301 redirect mapping to preserve your existing Google rankings, so pages that already rank keep their SEO value on the new site.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I see examples of past website builds?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Real project examples are available on the client work page.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: WebsiteDesignDevPage,
})

const FAQS = [
  {
    q: 'How long does a custom website build or redesign take?',
    a: "Most custom website builds and redesigns take two to three weeks from start to launch. Because you work directly with me, without account managers or junior designers in between, things move fast and revision cycles don't drag on.",
  },
  {
    q: 'Do I need a brand new website or just a redesign of my existing site?',
    a: "If your current site is more than a few years old, built on a heavy platform, or hard to update, a redesign usually makes more sense than starting from nothing. If you don't have a site yet, or your current one isn't worth saving, a brand-new build is the better path. This gets sorted out during your free demo.",
  },
  {
    q: 'Do you use WordPress, Wix, or page builders like Elementor?',
    a: 'No. Sites are built with custom React code instead of a page-builder platform, which avoids the plugin bloat, slow load times, and update headaches that come with WordPress, Wix, and similar tools.',
  },
  {
    q: 'What happens after my new website is launched?',
    a: (
      <span>
        Ongoing hosting, backups, security updates, and monthly content edits are handled through the{' '}
        <Link
          to="/websites-care"
          className="text-amber-600 dark:text-amber-400 underline font-semibold hover:text-amber-700 dark:hover:text-amber-300"
        >
          Website Hosting and Care
        </Link>{' '}
        plan, so the site stays fast and current after it goes live.
      </span>
    ),
  },
  {
    q: 'How do customers contact me through the website?',
    a: "Through sticky tap-to-call buttons, high-contrast quote forms, and, if you use one, a direct connection to your CRM or field service software, so requests reach you the moment they're submitted.",
  },
  {
    q: 'How much does a website build or redesign cost?',
    a: 'Pricing depends on the size and complexity of the build, and gets quoted individually after your free demo. Ongoing care plans start at $99 per month.',
  },
  {
    q: 'Will my new website hurt my current Google rankings?',
    a: "No, when it's done correctly. Every redesign includes 301 redirect mapping to preserve your existing Google rankings, so pages that already rank keep their SEO value on the new site.",
  },
  {
    q: 'Can I see examples of past website builds?',
    a: (
      <span>
        Yes. Real project examples are available on the{' '}
        <Link
          to="/work"
          className="text-amber-600 dark:text-amber-400 underline font-semibold hover:text-amber-700 dark:hover:text-amber-300"
        >
          client work page
        </Link>
        .
      </span>
    ),
  },
]

function WebsiteDesignDevPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const scrollToComparison = () => {
    const el = document.getElementById('custom-vs-templates')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* SECTION 0 & 1: Breadcrumb + Hero */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-12 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/50 via-white to-white dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#0B1120]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10">
          {/* SECTION 0: Breadcrumb */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/websites"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              ← Back to Contractor Websites
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Copy Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-slate-900 dark:text-white">
                Website Design and Redesign Services That Turn Mobile Visitors Into Calls
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get a custom website build or redesign for trade contractors tired of losing jobs to slow pages. Whether you need a brand-new site or a full rebuild of an outdated one, clean code gets built to load in under one second, so slow pages stop costing you calls.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/website-demo"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98"
                >
                  Request a Free Website Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button
                  type="button"
                  onClick={scrollToComparison}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  See Custom vs. Templates
                </button>
              </div>
            </div>

            {/* Illustration Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md lg:max-w-none p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
                {/* Flat vector illustration: smartphone with instant load next to sub-1s stopwatch */}
                <svg
                  viewBox="0 0 400 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="20"
                    y="15"
                    width="190"
                    height="290"
                    rx="28"
                    className="fill-slate-900 dark:fill-[#0d1526] stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth="3"
                  />
                  {/* Phone screen */}
                  <rect
                    x="30"
                    y="30"
                    width="170"
                    height="260"
                    rx="20"
                    className="fill-white dark:fill-[#152033]"
                  />
                  {/* Speaker */}
                  <rect
                    x="85"
                    y="22"
                    width="60"
                    height="4"
                    rx="2"
                    className="fill-slate-600 dark:fill-slate-500"
                  />
                  {/* Screen Header */}
                  <rect
                    x="42"
                    y="45"
                    width="70"
                    height="8"
                    rx="4"
                    className="fill-slate-800 dark:fill-slate-200"
                  />
                  <rect
                    x="150"
                    y="43"
                    width="38"
                    height="14"
                    rx="7"
                    className="fill-amber-500"
                  />
                  {/* Screen Hero Banner */}
                  <rect
                    x="42"
                    y="68"
                    width="146"
                    height="64"
                    rx="10"
                    className="fill-amber-50 dark:fill-amber-950/40"
                  />
                  <rect
                    x="52"
                    y="80"
                    width="100"
                    height="7"
                    rx="3.5"
                    className="fill-slate-900 dark:fill-white"
                  />
                  <rect
                    x="52"
                    y="93"
                    width="75"
                    height="5"
                    rx="2.5"
                    className="fill-slate-500 dark:fill-slate-400"
                  />
                  {/* Sticky Call Button */}
                  <rect
                    x="52"
                    y="108"
                    width="126"
                    height="16"
                    rx="8"
                    className="fill-emerald-500"
                  />
                  <circle cx="64" cy="116" r="3" className="fill-white" />
                  <rect
                    x="74"
                    y="114"
                    width="60"
                    height="4"
                    rx="2"
                    className="fill-white"
                  />
                  {/* Screen Content Cards */}
                  <rect
                    x="42"
                    y="142"
                    width="68"
                    height="60"
                    rx="8"
                    className="fill-slate-100 dark:fill-[#1b273d]"
                  />
                  <rect
                    x="120"
                    y="142"
                    width="68"
                    height="60"
                    rx="8"
                    className="fill-slate-100 dark:fill-[#1b273d]"
                  />
                  <rect
                    x="42"
                    y="212"
                    width="146"
                    height="45"
                    rx="8"
                    className="fill-slate-100 dark:fill-[#1b273d]"
                  />

                  {/* Stopwatch Graphic on Right */}
                  <circle
                    cx="300"
                    cy="165"
                    r="68"
                    className="fill-amber-50 dark:fill-[#1a2333] stroke-amber-500"
                    strokeWidth="4"
                  />
                  {/* Stopwatch Top button */}
                  <rect
                    x="294"
                    y="82"
                    width="12"
                    height="15"
                    rx="3"
                    className="fill-amber-500"
                  />
                  <rect
                    x="288"
                    y="76"
                    width="24"
                    height="6"
                    rx="3"
                    className="fill-amber-600"
                  />
                  {/* Stopwatch ticks */}
                  <circle cx="300" cy="108" r="2.5" className="fill-slate-400" />
                  <circle cx="357" cy="165" r="2.5" className="fill-slate-400" />
                  <circle cx="300" cy="222" r="2.5" className="fill-slate-400" />
                  <circle cx="243" cy="165" r="2.5" className="fill-slate-400" />

                  {/* Stopwatch hand showing under 1 second (pointing fast) */}
                  <line
                    x1="300"
                    y1="165"
                    x2="328"
                    y2="128"
                    className="stroke-amber-600 dark:stroke-amber-400"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="300"
                    cy="165"
                    r="5"
                    className="fill-slate-900 dark:fill-white"
                  />

                  {/* Sub-second Badge under stopwatch */}
                  <rect
                    x="248"
                    y="252"
                    width="104"
                    height="26"
                    rx="13"
                    className="fill-emerald-500/20 stroke-emerald-500"
                    strokeWidth="1.5"
                  />
                  <circle cx="265" cy="265" r="4" className="fill-emerald-500" />
                  <rect
                    x="276"
                    y="262"
                    width="55"
                    height="6"
                    rx="3"
                    className="fill-emerald-600 dark:fill-emerald-400"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Design vs. Care (Sibling Comparison) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Service Scope
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The Difference Between Website Design and Website Care
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Website creation and monthly site management stay clearly separated, so you only pay for what your company needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Active / This Page */}
            <div className="p-8 sm:p-10 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border-2 border-amber-500 shadow-xl shadow-amber-500/5 relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                  This Page · One-Time Project
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Design and Development
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  This page covers the one-time build: a brand-new website or a full website redesign, including your mobile layout, custom code, Core Web Vitals optimization, and CRM form connections from scratch until launch day.
                </p>
              </div>
            </div>

            {/* Card 2: Website Hosting and Care */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Post-Launch Operations · Monthly Plan
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Hosting and Care
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Website Hosting and Care covers what happens after launch: high-speed edge hosting, 24/7 uptime monitoring, daily automated backups, security certificates, and regular monthly content edits. You can start with either service or combine both.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/websites-care"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                >
                  Explore Website Hosting and Care →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Built for New and Established Businesses */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Project Scope
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for New Businesses and Established Companies
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Website design and development covers everything from a very first domain to a complete modernization of a ten-year-old site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Brand-New Website Builds */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Brand-New Website Builds
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you're launching a new trade business or adding an independent location, you need a site that builds trust immediately. Custom website development code sets you apart from competitors using cheap drag-and-drop templates.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Clean domain setup and SSL encryption</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Modern contractor layout focused on service calls</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Structured service area pages for local search discovery</span>
                </li>
              </ul>
            </div>

            {/* Complete Website Redesigns */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Complete Website Redesigns
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  If your current website was built years ago on WordPress, Wix, or Squarespace, it's probably slow on mobile and difficult to update. Website redesign services replace heavy templates with fast code while protecting all existing Google rankings.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>301 redirect mapping to preserve existing Google rankings</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Complete removal of slow plugins and database bloat</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Updated mobile navigation and click-to-call buttons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Custom Code vs. Templates (Technical Comparison) */}
      <section id="custom-vs-templates" className="relative scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              The Custom-Code Advantage
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Custom Code vs. Clunky Page Templates
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Most agencies sell small business website design built on heavy WordPress themes. Here's how custom code compares to standard agency templates.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              How Your Website Operates Under the Hood
            </h3>
            <p className="mt-1 text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
              ⚡ Custom Built Site vs. 🐢 Agency Template Site
            </p>
          </div>

          {/* 2-Column Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Custom Built Site */}
            <div className="p-8 sm:p-10 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border-2 border-amber-500 shadow-md space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>⚡ Custom Built Site</span>
              </h3>

              <div className="space-y-6 divide-y divide-amber-200/60 dark:divide-amber-800/60">
                <div className="pt-4 first:pt-0 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Load Time
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    Custom: Under 1 second. Engineered with modern React and clean styling. Loads immediately even on weak cellular networks in the field.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Security &amp; Bloat
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    Custom: Zero plugins. No third-party plugins to update or break. Static edge hosting stops database injection and hacking attempts.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Mobile Conversion
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    Custom: Tap-to-call first. Sticky call buttons and high-contrast quote forms connect homeowners to your phone in two quick taps.
                  </p>
                </div>
              </div>
            </div>

            {/* Agency Template Site */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🐢 Agency Template Site</span>
              </h3>

              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="pt-4 first:pt-0 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Load Time
                  </span>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Templates: 4 to 8+ seconds. Heavy theme scripts, unoptimized fonts, and render-blocking plugins cause mobile visitors to bounce.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Security &amp; Bloat
                  </span>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Templates: 30+ plugins. Constant update requirements, database vulnerabilities, and theme breaking changes during core updates.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Mobile Conversion
                  </span>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Templates: Cluttered popups. Desktop-first layouts shrink poorly on mobile, hiding phone numbers behind clunky hamburger menus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inline CTA Box */}
          <div className="mt-12 p-8 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-300 dark:border-amber-800/80 text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Want to see how fast your company website runs when built with custom code?
            </p>
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all transform active:scale-98"
            >
              Get My Free Speed Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: What Every Build Delivers (Feature List) */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              The Build Standard
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What Every Build and Redesign Delivers
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Every build produces custom digital assets designed to help your phone ring for years to come.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Mobile-First Call Funnels */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: phone with tap gesture */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <circle cx="12" cy="18" r="1" />
                  <path d="M12 7v4" />
                  <circle cx="12" cy="9" r="3" className="stroke-amber-500/60" strokeDasharray="2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Mobile-First Call Funnels
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                More than seven in ten homeowners search for contractors on their phones. Sticky header call buttons and clean touch targets get built so calling your team is effortless.
              </p>
            </div>

            {/* Feature 2: Sub-Second Core Web Vitals */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: speed gauge */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="m14 13 3-3" />
                  <path d="M19.4 15a8 8 0 1 0-14.8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Sub-Second Core Web Vitals
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Google rewards websites that load instantly. Media gets compressed, web fonts optimized, and render-blocking code eliminated, so your site scores green across Google's performance benchmarks.
              </p>
            </div>

            {/* Feature 3: Instant CRM Lead Routing */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: CRM sync arrow */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Instant CRM Lead Routing
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Forms connect to Jobber, Housecall Pro, ServiceTitan, or your phone via text message. You receive customer requests the second they submit without relying on clunky plugins.
              </p>
            </div>

            {/* Feature 4: Local SEO Schema Markup */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: schema/code bracket icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="14" y1="4" x2="10" y2="20" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Local SEO Schema Markup
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Structured data gets embedded directly into the code, telling search engines your exact service areas, business hours, license credentials, and primary trade categories.
              </p>
            </div>

            {/* Feature 5: Targeted City Pages */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: city skyline with a pin */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <path d="M3 21h18" />
                  <path d="M5 21V9l4-2v14" />
                  <path d="M9 11l4-2v12" />
                  <circle cx="18" cy="8" r="3" />
                  <path d="M18 11v10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Targeted City Pages
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Dedicated landing pages get built for each surrounding city you service, capturing homeowners searching for trade work outside your main shop address.
              </p>
            </div>

            {/* Feature 6: Full Asset Ownership */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                {/* Flat vector icon: key/ownership icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2">
                  <path d="m21 2-2 2m-1.5 1.5L14 9a5 5 0 1 0 3 3l3.5-3.5" />
                  <path d="m15.5 7.5 3 3" />
                  <circle cx="7.5" cy="16.5" r="2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Full Asset Ownership
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                You own your domain, code repository, content, and branding outright. I never charge cancellation exit fees or hold your digital presence hostage.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98"
            >
              Claim Your Free Website Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: What Clients Say (Testimonials) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "We were opening a second location and needed a real site fast, not another template. It looked professional from day one and started generating calls within the first week."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Marco, Roofing Company Owner
              </h3>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "Our old Wix site was embarrassing on a phone. I was nervous about losing our rankings during the switch, but the redirects were handled and we didn't lose a single position."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Sandra, Landscaping Business Owner
              </h3>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "I didn't know a website could actually load that fast until I saw ours next to our old one side by side. It's not even close."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Pete, Electrical Contractor
              </h3>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98"
            >
              Get My Free Website Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              {'Questions & Answers'}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {'Frequently Asked Questions About Website Builds & Redesigns'}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {typeof faq.a === 'string' ? <p>{faq.a}</p> : faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: Closing CTA */}
      <section className="relative py-16 sm:py-20 bg-amber-500 dark:bg-amber-500 text-slate-950 rounded-3xl mx-4 sm:mx-8 md:mx-auto max-w-6xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 opacity-95" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-950/80 font-mono">
            See It Before You Buy It
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Get a Website Built to Load Fast and Convert
          </h2>
          <p className="text-base sm:text-lg text-slate-900 max-w-2xl mx-auto leading-relaxed">
            Stop losing mobile visitors to a slow, templated site. Start with a free personalized demo and see exactly what your new site could look like.
          </p>
          <div className="pt-2">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-950 text-white hover:bg-slate-900 font-bold text-base shadow-xl transition-all transform active:scale-98"
            >
              Request My Free Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
