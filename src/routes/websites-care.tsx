import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Globe,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Server,
  Layers,
  Activity,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITES_CARE_FAQ = [
  {
    question: 'What is included in your website care plans?',
    answer:
      'My website care plans cover fast global hosting, free SSL security, daily automated backups, 24/7 uptime monitoring, and monthly content edits. Whenever you need to update photos, add a new service area, or change your pricing, you message me directly and I handle it.',
  },
  {
    question: 'Can you take over website maintenance services if you did not build my site?',
    answer:
      'Yes. If your current website is built on a modern, clean codebase, I can migrate your site to my managed hosting infrastructure and oversee monthly maintenance. If your site runs on an old, slow platform with broken plugins, I usually recommend a clean rebuild first.',
  },
  {
    question: 'Why do managed website services matter for trade contractors?',
    answer:
      'Contractors rely on their websites to capture emergency repair calls and service requests. If a plugin breaks or your server goes down on a weekend, you lose thousands of dollars in booked jobs. I keep your site fast, secure, and running without interruption.',
  },
  {
    question: 'Do I have to sign a long term contract for website hosting and maintenance?',
    answer:
      'No. All website maintenance services run on a straightforward month to month basis. You stay because your website runs fast and never gives you headaches, not because you are locked into a restrictive yearly contract.',
  },
  {
    question: 'How quickly do you complete monthly content updates?',
    answer:
      'Most standard content updates, such as adding project photos, updating team bios, or publishing new seasonal service specials, are completed within twenty-four to forty-eight hours of your request.',
  },
]

const WEBSITES_CARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Website Maintenance Services for Contractors',
      serviceType: 'Website Maintenance and Managed Website Services',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Reliable website maintenance services, monthly website care plans, sub-second edge hosting, and security monitoring for trade contractors.',
      areaServed: 'United States',
    },
    {
      '@type': 'FAQPage',
      mainEntity: WEBSITES_CARE_FAQ.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
}

export const Route = createFileRoute('/websites-care')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Website Maintenance Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'We provide reliable website maintenance services and website care plans for contractors and small businesses. Keep your site fast, secure, and always online.',
      },
      {
        property: 'og:title',
        content: 'Website Maintenance Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'We provide reliable website maintenance services and website care plans for contractors and small businesses. Keep your site fast, secure, and always online.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://builtbymiguel.net/websites-care' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Website Maintenance Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'We provide reliable website maintenance services and website care plans for contractors and small businesses. Keep your site fast, secure, and always online.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites-care',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(WEBSITES_CARE_JSON_LD),
      },
    ],
  }),
  component: WebsitesCarePage,
})

function WebsitesCarePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Pillar Breadcrumb Badge */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Link
            to="/websites"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:border-rose-500/50 shadow-sm transition-all"
          >
            <span>← Back to Contractor Websites</span>
          </Link>
        </div>

        {/* Main H1 with Primary Keyword */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Website Maintenance Services That Keep Your{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Phone Ringing.
          </span>
        </h1>

        {/* Intro Lead Paragraph with Primary & Secondary Keywords */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          We provide dedicated website maintenance services and website care plans designed specifically for busy trade contractors and service businesses. High-speed edge hosting and sub-second page performance are built right into every plan, ensuring your site stays fast, secure, and ready for customer calls. Never worry about broken plugins, server crashes, or unapplied security patches again.
        </p>

        {/* Hero CTAs: Free Website Demo Only */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/website-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Request a Free Website Demo</span>
          </Link>

          <a
            href="#deliverables"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
          >
            <span>See What Care Includes</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: DIFFERENCE SECTION (CARE VS BUILD)
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none space-y-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold mb-2">
            Service Scope
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Difference Between Website Care and Website Design
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Understanding whether you need an ongoing maintenance plan or a brand-new website build is simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Active Child: This Page */}
          <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-500/30 dark:border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">THIS PAGE</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">Ongoing Operations</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Website Hosting and Care</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This page covers the ongoing relationship after launch. Fast hosting, continuous security, daily backups, and regular monthly updates. I manage your technical infrastructure so your site never goes offline or slows down.
            </p>
          </div>

          {/* Sibling Child: Design & Development */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">INITIAL PROJECT</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">One-Time Build</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Website Design and Development</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Website Design and Development covers building or redesigning the site first. If you need a brand-new website from scratch or a complete modernization of an old page template, we start here. A client can start with either service or combine both.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/website-design"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <span>Explore Website Design and Development</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 4 DELIVERABLES WHITE CARDS (PRESERVED SECTIONS)
          ========================================================================= */}
      <section id="deliverables" className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Managed Website Services
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Complete Website Hosting and Maintenance
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every technical detail is managed directly by an engineer, giving your business speed, security, and regular updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Speed & Core Web Vitals */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                SPEED & RANKINGS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Sub-Second Mobile Speed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pages load in less than a second on mobile networks so visitors stay on your site and call. High speed is a core feature of my hosting infrastructure.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Top Google PageSpeed scores on mobile phones</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Automatic image compression for instant rendering</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Continuous Core Web Vitals monitoring</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Mobile-First Conversion Architecture */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                CONVERSION RETENTION
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mobile-First Lead Design
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Built for busy homeowners searching on mobile devices. Tap-to-call buttons and quote forms remain functional and easy to tap across all screen sizes.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sticky call button remains fixed at the bottom of mobile screens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Simple quote forms with clean validation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct lead forwarding to your phone and email</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Security & Uptime */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                RELIABLE INFRASTRUCTURE
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                24/7 Security and High Uptime
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No third-party WordPress plugins to patch or worry about. Your site stays protected on global edge networks with guaranteed uptime.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Continuous uptime monitoring and instant alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Automated daily offsite cloud backups</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Automatic SSL renewals and spam protection</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Retainer Deliverables */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                PEACE OF MIND
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Monthly Website Care Retainer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Never worry about your website breaking again. When you need a new photo uploaded, text adjusted, or an emergency banner added, message me directly.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Regular monthly content updates and layout edits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Direct support with quick turnaround times</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Monthly performance audits to keep load times sub-second</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Website Maintenance Services & Care Plans
          </h2>
        </div>

        <div className="space-y-4">
          {WEBSITES_CARE_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-600 dark:text-rose-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <FreeAuditCTA variant="hosting-care" />
    </div>
  )
}
