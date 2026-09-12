import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute(
  '/websites_/hosting-and-maintenance',
)({
  head: () => ({
    meta: [
      {
        title:
          'Website Maintenance & Hosting Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Managed hosting, backups, security, and monthly updates for contractor websites. Direct support, no ticket queue. Care plans starting at $99/month.',
      },
      {
        name: 'keywords',
        content:
          'website maintenance services, website care plans, website hosting and maintenance, managed website services, website support for contractors',
      },
      {
        property: 'og:title',
        content:
          'Website Maintenance & Hosting Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Managed hosting, backups, security, and monthly updates for contractor websites. Direct support, no ticket queue. Care plans starting at $99/month.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content:
          'https://builtbymiguel.net/websites/hosting-and-maintenance',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content:
          'Website Maintenance & Hosting Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Managed hosting, backups, security, and monthly updates for contractor websites. Direct support, no ticket queue. Care plans starting at $99/month.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites/hosting-and-maintenance',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Website Maintenance & Hosting Services for Contractors',
          serviceType: 'Website Hosting and Maintenance',
          provider: {
            '@type': 'ProfessionalService',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          description:
            'Managed hosting, backups, security, and monthly updates for contractor websites. Direct support, no ticket queue. Care plans starting at $99/month.',
          url: 'https://builtbymiguel.net/websites/hosting-and-maintenance',
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
              name: 'Website Hosting & Care',
              item: 'https://builtbymiguel.net/websites/hosting-and-maintenance',
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
              name: 'What is included in your website care plans?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Website care plans cover fast global hosting, free SSL security, daily automated backups, 24/7 uptime monitoring, and monthly content edits. Whenever you need to update photos, add a new service area, or change your pricing, you message me directly and it gets handled.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can you take over website maintenance services if you did not build my site?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Care and hosting can be added to an existing site after a quick technical review to make sure it\'s stable enough to maintain long-term. If it needs significant rework first, that gets covered during your free demo.',
              },
            },
            {
              '@type': 'Question',
              name: 'Why do managed website services matter for trade contractors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Because a contractor\'s website is often the first and only impression a homeowner gets before calling. A slow, broken, or outdated site loses jobs the same way a missed phone call does, so keeping it fast and functional is directly tied to how many calls come in.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I have to sign a long term contract for website hosting and maintenance?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Care plans run month to month with no long-term lock-in required.',
              },
            },
            {
              '@type': 'Question',
              name: 'How quickly do you complete monthly content updates?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most simple content updates, like photo swaps or text changes, are completed within one to two business days of your request.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much does website hosting and maintenance cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Care plans start at $99 per month, covering hosting, backups, SSL renewals, uptime monitoring, and monthly content updates.',
              },
            },
            {
              '@type': 'Question',
              name: 'What happens if my site goes down?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Uptime monitoring sends an instant alert the moment a problem is detected, so issues typically get addressed before most visitors ever notice a disruption.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I cancel my care plan at any time?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Plans run month to month, and you own your domain, code, and content outright, so canceling doesn\'t mean losing access to your own site.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: WebsiteHostingAndMaintenancePage,
})

const FAQS = [
  {
    q: 'What is included in your website care plans?',
    a: 'Website care plans cover fast global hosting, free SSL security, daily automated backups, 24/7 uptime monitoring, and monthly content edits. Whenever you need to update photos, add a new service area, or change your pricing, you message me directly and it gets handled.',
  },
  {
    q: 'Can you take over website maintenance services if you did not build my site?',
    a: "Yes. Care and hosting can be added to an existing site after a quick technical review to make sure it's stable enough to maintain long-term. If it needs significant rework first, that gets covered during your free demo.",
  },
  {
    q: 'Why do managed website services matter for trade contractors?',
    a: "Because a contractor's website is often the first and only impression a homeowner gets before calling. A slow, broken, or outdated site loses jobs the same way a missed phone call does, so keeping it fast and functional is directly tied to how many calls come in.",
  },
  {
    q: 'Do I have to sign a long term contract for website hosting and maintenance?',
    a: 'No. Care plans run month to month with no long-term lock-in required.',
  },
  {
    q: 'How quickly do you complete monthly content updates?',
    a: 'Most simple content updates, like photo swaps or text changes, are completed within one to two business days of your request.',
  },
  {
    q: 'How much does website hosting and maintenance cost?',
    a: 'Care plans start at $99 per month, covering hosting, backups, SSL renewals, uptime monitoring, and monthly content updates.',
  },
  {
    q: 'What happens if my site goes down?',
    a: 'Uptime monitoring sends an instant alert the moment a problem is detected, so issues typically get addressed before most visitors ever notice a disruption.',
  },
  {
    q: 'Can I cancel my care plan at any time?',
    a: "Yes. Plans run month to month, and you own your domain, code, and content outright, so canceling doesn't mean losing access to your own site.",
  },
]

function WebsiteHostingAndMaintenancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8">
      {/* SECTION 0: Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <Link
          to="/websites"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <span>← Back to Contractor Websites</span>
        </Link>
      </div>

      {/* SECTION 1: Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Website Maintenance Services That Keep Your Phone Ringing
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get dedicated website maintenance and care plans built for busy trade contractors and service businesses. High-speed edge hosting and sub-second performance come standard, so you never have to worry about broken plugins, server crashes, or unapplied security patches again.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/website-demo"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98 text-center"
                >
                  Request a Free Website Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="#what-care-includes"
                  onClick={(e) => scrollToSection(e, 'what-care-includes')}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center"
                >
                  See What Care Includes
                </a>
              </div>
            </div>

            {/* Right Column: Flat Vector Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <svg
                  viewBox="0 0 400 320"
                  className="w-full h-auto drop-shadow-sm select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Illustration of a website interface with a shield icon, a backup/cloud icon, and an uptime checkmark surrounding it"
                >
                  {/* Browser Window Mockup */}
                  <rect
                    x="40"
                    y="40"
                    width="320"
                    height="240"
                    rx="12"
                    className="fill-white dark:fill-[#111827] stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="2"
                  />
                  {/* Browser Header Bar */}
                  <rect
                    x="40"
                    y="40"
                    width="320"
                    height="32"
                    rx="12"
                    className="fill-slate-100 dark:fill-[#1a2333]"
                  />
                  <line
                    x1="40"
                    y1="72"
                    x2="360"
                    y2="72"
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="1"
                  />
                  <circle cx="56" cy="56" r="4" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="68" cy="56" r="4" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="80" cy="56" r="4" className="fill-slate-300 dark:fill-slate-600" />

                  {/* Browser URL pill */}
                  <rect
                    x="100"
                    y="48"
                    width="200"
                    height="16"
                    rx="8"
                    className="fill-white dark:fill-[#111827] stroke-slate-200/80 dark:stroke-slate-700/80"
                    strokeWidth="1"
                  />

                  {/* Website internal skeleton */}
                  <rect x="65" y="95" width="130" height="18" rx="4" className="fill-amber-500/20" />
                  <rect x="65" y="125" width="220" height="8" rx="4" className="fill-slate-200 dark:fill-slate-800" />
                  <rect x="65" y="140" width="180" height="8" rx="4" className="fill-slate-200 dark:fill-slate-800" />
                  <rect x="65" y="165" width="80" height="24" rx="6" className="fill-amber-500" />

                  {/* 3 Floating Badges: Shield, Cloud/Backup, Uptime Checkmark */}

                  {/* 1. Shield Badge (Top Right) */}
                  <g transform="translate(290, 80)">
                    <circle cx="30" cy="30" r="32" className="fill-white dark:fill-[#1e293b] stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
                    <path
                      d="M30 16L18 21V31C18 38.5 23.1 45.4 30 47C36.9 45.4 42 38.5 42 31V21L30 16Z"
                      className="fill-amber-500/20 stroke-amber-500"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26 31L29 34L35 28"
                      className="stroke-amber-600 dark:stroke-amber-400"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* 2. Backup / Cloud Icon Badge (Bottom Left) */}
                  <g transform="translate(30, 190)">
                    <circle cx="30" cy="30" r="32" className="fill-white dark:fill-[#1e293b] stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
                    {/* Cloud shape */}
                    <path
                      d="M36 34H21C18.2 34 16 31.8 16 29C16 26.4 18 24.2 20.6 24C21.3 20 24.8 17 29 17C33.7 17 37.5 20.5 37.9 25.1C40.2 25.6 42 27.6 42 30C42 32.2 40.2 34 38 34"
                      className="stroke-blue-500"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Sync / arrow */}
                    <path
                      d="M30 26V36M26 32L30 36L34 32"
                      className="stroke-blue-600 dark:stroke-blue-400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* 3. Uptime Checkmark Badge (Bottom Right) */}
                  <g transform="translate(260, 190)">
                    <rect x="0" y="8" width="100" height="44" rx="22" className="fill-white dark:fill-[#1e293b] stroke-emerald-500/50" strokeWidth="2" />
                    <circle cx="24" cy="30" r="14" className="fill-emerald-500/20" />
                    <path
                      d="M18 30L22 34L30 26"
                      className="stroke-emerald-600 dark:stroke-emerald-400"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Uptime tick dots / bar */}
                    <circle cx="50" cy="30" r="3" className="fill-emerald-500" />
                    <circle cx="62" cy="30" r="3" className="fill-emerald-500" />
                    <circle cx="74" cy="30" r="3" className="fill-emerald-500" />
                    <circle cx="86" cy="30" r="3" className="fill-emerald-500" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Care vs. Design (Sibling Comparison) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Service Scope
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The Difference Between Website Care and Website Design
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Understanding whether you need an ongoing maintenance plan or a brand-new website build is simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Active / This Page */}
            <div className="p-8 sm:p-10 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border-2 border-amber-500 shadow-xl shadow-amber-500/5 relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                  This Page · Ongoing Operations
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Hosting and Care
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  This page covers the ongoing relationship after launch. Fast hosting, continuous security, daily backups, and regular monthly updates. Your technical infrastructure gets managed so your site never goes offline or slows down.
                </p>
              </div>
            </div>

            {/* Card 2: Website Design and Development */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Initial Project · One-Time Build
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Design and Development
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Website Design and Development covers building or redesigning the site first. If you need a brand-new website from scratch or a complete modernization of an old page template, that's the starting point. You can start with either service or combine both.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/websites/design-and-development"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                >
                  Explore Website Design and Development →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: What Care Includes (Feature Grid) */}
      <section id="what-care-includes" className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Managed Website Services
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Complete Website Hosting and Maintenance
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Every technical detail is handled directly, with no support-ticket layers between you and the person keeping your site online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Speed & Rankings */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Speed &amp; Rankings
                  </span>
                  {/* Icon: speed gauge over mobile screen */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <path d="M12 18h.01" />
                      <path d="M9 10a3 3 0 0 1 5.2 0" />
                      <line x1="12" y1="11" x2="14" y2="9" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Sub-Second Mobile Speed
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Pages load in less than a second on mobile networks so visitors stay on your site and call. High speed is a core feature of the hosting infrastructure behind every plan.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Top Google PageSpeed scores on mobile phones</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Automatic image compression for instant rendering</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Continuous Core Web Vitals monitoring</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Conversion Retention */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Conversion Retention
                  </span>
                  {/* Icon: phone with sticky call button */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="2" width="12" height="20" rx="2" />
                      <line x1="9" y1="18" x2="15" y2="18" strokeWidth="2.5" />
                      <path d="M10 8h4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Mobile-First Lead Design
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Built for busy homeowners searching on mobile devices. Tap-to-call buttons and quote forms remain functional and easy to tap across all screen sizes.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Sticky call button remains fixed at the bottom of mobile screens</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Simple quote forms with clean validation</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Direct lead forwarding to your phone and email</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Reliable Infrastructure */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Reliable Infrastructure
                  </span>
                  {/* Icon: shield with lock */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <rect x="9" y="10" width="6" height="5" rx="1" />
                      <path d="M10 10V8a2 2 0 0 1 4 0v2" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  24/7 Security and High Uptime
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  No third-party WordPress plugins to patch or worry about. Your site stays protected on global edge networks with continuous uptime monitoring.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Continuous uptime monitoring and instant alerts</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Automated daily offsite cloud backups</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Automatic SSL renewals and spam protection</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Peace of Mind */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Peace of Mind
                  </span>
                  {/* Icon: chat bubble with wrench */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M14.7 9.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 1.4 1.4l4-4a1 1 0 0 0 0-1.4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Monthly Website Care Retainer
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Never worry about your website breaking again. When you need a new photo uploaded, text adjusted, or an emergency banner added, message me directly.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Regular monthly content updates and layout edits</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Direct support with quick turnaround times</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Monthly performance audits to keep load times sub-second</span>
                </li>
              </ul>
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

      {/* SECTION 4: What Clients Say (Testimonials) */}
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
                  "Our old host went down twice in one year, both times during business hours. Since switching to the care plan, we haven't had a single outage, and I don't have to think about it."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Wendy, HVAC Business Owner
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
                  "I text a photo and a quick note when I want something updated, and it's usually done the next day. No logging into a dashboard, no figuring out a page builder."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Greg, Roofing Contractor
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
                  "We didn't build our site with Miguel originally, but he was able to take over hosting and care after a quick check. One less thing to manage myself."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Alicia, Landscaping Business Owner
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

      {/* SECTION 5: FAQ */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              {'Website Maintenance Services & Care Plans'}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {'Frequently Asked Questions About Website Care'}
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
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: Closing CTA */}
      <section className="relative py-16 sm:py-20 bg-amber-500 dark:bg-amber-500 text-slate-950 rounded-3xl mx-4 sm:mx-8 md:mx-auto max-w-6xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 opacity-95" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-950/80 font-mono">
            Stop Managing It Yourself
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Get a Website That Stays Fast, Secure, and Online Without You Thinking About It
          </h2>
          <p className="text-base sm:text-lg text-slate-900 max-w-2xl mx-auto leading-relaxed">
            Stop worrying about broken plugins, server crashes, and missed security patches. Start with a free demo and see what a fully managed website actually looks like.
          </p>
          <div className="pt-2">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-base shadow-xl transition-all transform active:scale-98"
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
