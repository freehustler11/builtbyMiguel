import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  Zap,
  Search,
  Cpu,
  ArrowRight,
  Code2,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'About Miguel | Full-Stack Local SEO & Systems Engineer',
      },
      {
        name: 'description',
        content:
          'Learn about Miguel, the developer and growth strategist behind built by Miguel. Discover the engineering philosophy combining sub-second websites, local SEO, and custom business automation.',
      },
      {
        name: 'keywords',
        content:
          'about miguel, local seo engineer, custom web developer, business systems consultant, small business technology partner',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'About Miguel | Full-Stack Local SEO & Systems Engineer',
      },
      {
        property: 'og:description',
        content:
          'Why combining local SEO with custom software engineering beats bloated agency retainers every time.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/about' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/about',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Code2 className="w-3.5 h-3.5" /> Founder & Lead Engineer
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Engineering Local Dominance Through{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Speed & Automation.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I bridge the gap between technical software engineering and real local business revenue. No outsourced junior account managers. You work directly with me.
        </p>
      </section>

      {/* 2. FOUNDER PROFILE & PHILOSOPHY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Portrait & Quick Stats */}
        <div className="lg:col-span-5 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-5 shadow-xl dark:shadow-none relative">
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden h-60 sm:h-68 bg-slate-100 dark:bg-slate-800 shadow-inner border border-slate-100 dark:border-slate-800">
              <img
                src="/miguel-umbac.png"
                alt="Miguel Umbac — Founder & Lead Engineer"
                className="w-full h-full object-cover object-[center_20%] transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="font-bold text-base leading-tight">Miguel Umbac</div>
                <div className="text-[11px] font-mono text-rose-300">Founder & Systems Engineer</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Direct Promise</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "I personally architect and review every client system. No sales intermediaries or junior staff hand-offs."
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Status: Taking New Clients</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </span>
          </div>
        </div>

        {/* Right Column: Founder Bio & Philosophy */}
        <div className="lg:col-span-7 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 lg:p-10 space-y-6 shadow-xl dark:shadow-none">
          <div className="space-y-4">
            <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-rose-600 dark:text-rose-400">
                <Sparkles className="w-3.5 h-3.5" /> Direct Founder Collaboration
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white pt-2 tracking-tight">Miguel Umbac</h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Full-Stack Systems Engineer & Local Search Specialist
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <p>
                Most traditional marketing agencies sell cookie-cutter WordPress themes, charge $3,000/month for junior account managers, and send PDF reports packed with vanity metrics that don’t ring your phone.
              </p>
              <p>
                I take a software engineer’s approach to local growth: treat your search rankings, website code, and lead capture workflows as high-performance distributed systems that must operate with sub-second speed and zero downtime.
              </p>
              <p>
                By combining Google Business Profile entity optimization, sub-second React web architecture, and automated lead dispatch pipelines, we create an unfair competitive advantage for local service contractors.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Core Engineering Stack
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                ⚡ TypeScript & React
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                📍 Google Maps API & GBP
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                🤖 AI Entity Graphing
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                🔄 Webhooks & CRM Auto
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-PILLAR PHILOSOPHY */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            The 3 Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Engineering Solves Local Growth
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No hacks or short-term tricks. Just clean code, high authority, and automated operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Sub-Second Speed</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every delay in page load hurts Google Core Web Vitals rankings and causes mobile visitors to bounce. We engineer zero-bloat web applications that load instantly.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Local Map Visibility</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              High-intent customers search on Google Maps daily. We execute rigorous citation cleaning and schema entity injection to ensure your business builds durable local search authority.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Operational Automation</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generating calls is only half the battle. We automate SMS dispatch, client intake, and payment reconciliations so you can scale revenue without hiring extra admin staff.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-16 text-center shadow-xl dark:shadow-none relative overflow-hidden transition-colors duration-200">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Direct Partnership
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 sm:mb-6">
          Let's Discuss Your Local Search Authority & Systems
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit or send a note. I will personally review your business opportunities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Claim Your Free 5-Min Video Audit</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Direct Contact & Inquiry</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>
      </section>
    </div>
  )
}
