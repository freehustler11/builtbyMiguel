import { FreeWebsiteDemoCTA } from '../components/FreeWebsiteDemoCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Globe,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Smartphone,
  Layers,
  Server,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITES_PILLAR_FAQ = [
  {
    question: 'How long does it take to design and launch a new contractor website?',
    answer:
      'Most custom contractor websites launch within two to three weeks. Because you work directly with me rather than an agency with layers of account managers, I write the code and design the mobile layout quickly.',
  },
  {
    question: 'Can I hire you for website care if you did not build my original site?',
    answer:
      'Yes. If your current website is built on a clean modern stack, I can take over monthly hosting, security updates, and regular content edits. If your site runs on an outdated, slow platform, I usually recommend a clean rebuild first.',
  },
  {
    question: 'Do I own my website code and design assets after the build?',
    answer:
      'Yes. You own one hundred percent of your website files, design assets, and domain registrations. I never lock clients into proprietary software or hold their code hostage.',
  },
  {
    question: 'Can you connect my website directly to my CRM or field service software?',
    answer:
      'Yes. I integrate your quote forms and call buttons directly with Jobber, Housecall Pro, ServiceTitan, or your preferred scheduling tool so leads drop into your dispatch board immediately.',
  },
]

const WEBSITES_PILLAR_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Web Design for Contractors',
      serviceType: 'Web Design and Development',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Custom web design for contractors and trade businesses. High-speed React builds, mobile call funnels, and ongoing website care.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Contractor Website Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Design & Development',
              url: 'https://builtbymiguel.net/website-design',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Hosting & Monthly Care',
              url: 'https://builtbymiguel.net/websites-care',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: WEBSITES_PILLAR_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/websites')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Web Design for Contractors: Built to Call | built by Miguel',
      },
      {
        name: 'description',
        content:
          'I provide custom web design for contractors who need fast mobile sites that turn visitors into calls. Claim your free interactive website demo today.',
      },
      {
        name: 'keywords',
        content:
          'web design for contractors, contractor website design, trade contractor websites, fast mobile websites, custom react websites',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Web Design for Contractors: Built to Call | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Fast custom websites built specifically for contractors and local service businesses. Sub-second speed and mobile call funnels built by Miguel.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/websites' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(WEBSITES_PILLAR_JSON_LD),
      },
    ],
  }),
  component: WebsitesPillarPage,
})

function WebsitesPillarPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Globe className="w-3.5 h-3.5" /> High-Speed Web Architecture
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Direct{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Web Design for Contractors
          </span>{' '}
          Built to Ring Your Phone.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I provide custom web design for contractors who want high-speed websites that turn local visitors into booked service calls. Most trade websites are built on bloated WordPress templates that load slowly and lose customers before the page even opens. As an independent engineer delivering specialized website design services, I write clean React code that opens instantly on every smartphone. Whether you need complete web design services or monthly care for your existing setup, you work directly with me without agency layers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/website-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Claim Your Free Website Demo</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>View Client Case Studies</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>

        <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Free · Custom mobile preview · No high-pressure sales calls</span>
        </div>
      </section>

      {/* TWO CHILD PATHS GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Service Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Two Clear Paths: The Build and What Happens After
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            I separate web projects into two distinct services. You can hire me for the initial build, choose ongoing monthly care, or bundle both together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Website Design & Development */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                  THE INITIAL BUILD
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Design & Development
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A complete custom website built from scratch using modern React. Designed specifically to load under a second on mobile phones and convert visitors into calls.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">What it covers:</p>
                <p>
                  Custom UI design, persuasive copywriting, mobile call funnels, dispatch form integrations, and core web vitals speed optimization.
                </p>
              </div>
            </div>

            <Link
              to="/website-design"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 pt-4"
            >
              <span>Explore Website Design & Development</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Website Hosting & Care */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-rose-500/40 dark:hover:border-rose-500/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Server className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-rose-600 dark:text-rose-400 uppercase">
                  WHAT HAPPENS AFTER LAUNCH
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Website Hosting & Care
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Reliable edge CDN hosting, automated daily backups, uptime alerts, and ongoing monthly updates so your website remains fast, secure, and fresh.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">What it covers:</p>
                <p>
                  Global edge server hosting, SSL renewals, monthly text and photo updates, security patch management, and round-the-clock uptime monitoring.
                </p>
              </div>
            </div>

            <Link
              to="/websites-care"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 pt-4"
            >
              <span>Explore Website Hosting & Care</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* THE BUILD VS AFTER LAUNCH COMPARISON BLOCK */}
      <section className="rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Project Scoping
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Build vs. What Happens After Launch
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Understanding the distinction helps you choose the right level of support for your company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Build Phase</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This is a one-time project where I create your custom digital storefront from the ground up. I write the sales copy, design the mobile interface, and code the website without page builder bloat.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Custom design tailored to your specific trade services</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Direct phone call tracking and instant form routing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>One-time investment with zero vendor lock-in</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">After Launch: Care & Defense</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Once your site is live, it requires dependable server infrastructure and regular maintenance. My monthly care plan ensures your site stays fast, updated, and completely defended against downtime.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Ultra-fast edge hosting with automatic SSL renewals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Monthly content updates so you never touch code</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Peace of mind knowing an engineer is watching your site</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY SPEED MATTERS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Engineering Superiority
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Web Design for Contractors Must Prioritize Mobile Speed
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Over eighty percent of contractor searches happen on mobile phones. When homeowners have an emergency, speed determines who gets the job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Sub-Second Load Times
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If a website takes longer than three seconds to load, more than half of mobile visitors leave immediately and call your competitor. My pages open in under one second on standard mobile networks, keeping buyers on your page.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Zero Plugin Vulnerabilities
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              WordPress sites rely on dozens of third-party plugins that regularly break, slow down databases, and invite security hacks. Custom React code is lean, secure, and requires zero plugin updates.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Common Inquiries
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions About Contractor Websites
          </h2>
        </div>

        <div className="space-y-4">
          {WEBSITES_PILLAR_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
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

      {/* BOTTOM CTA: FREE WEBSITE DEMO ONLY */}
      <FreeWebsiteDemoCTA />
    </div>
  )
}
