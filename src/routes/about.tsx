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
          'Learn about Miguel, founder of built by Miguel. See how fast websites, Google Maps rankings, and automated lead systems help local businesses grow.',
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
          'Why fast websites and top Google Maps rankings beat expensive agency retainers every time.',
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
          Software Engineering for{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Local Business Growth.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I help service companies win more customers through high search rankings and clean automation. You work directly with me from day one.
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
                alt="Miguel Umbac, Founder and Systems Engineer"
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
                "I personally design and build every client system. You never get handed off to a junior account manager."
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Available for new clients</span>
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
                Most marketing agencies sell generic templates, charge high monthly fees, and send confusing reports packed with vanity numbers that do not ring your phone.
              </p>
              <p>
                I take an engineering approach to local growth. I build websites and local search systems that load in under a second and never go down.
              </p>
              <p>
                By pairing top Google Map Pack rankings with instant text message alerts, we help local trade contractors win more booked jobs every week.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Core Engineering Stack
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                ⚡ Fast React Websites
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                📍 Google Maps & Local SEO
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                🤖 AI Search Visibility
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                🔄 Instant Lead Alerts
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
            Clean code, top search rankings, and simple systems that bring you customers.
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
              Slow load times make mobile visitors leave before they ever call. We build lightweight websites that load right away on every phone.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Local Map Visibility</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Homeowners search Google Maps when they need service right away. We clean up your listings and build authority so you show up in the top three.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Operational Automation</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Getting calls is only half the battle. We automate text message alerts and customer follow-ups so you close more deals without extra office work.
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
          Let's Review Your Local Rankings and Systems
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit or send a message. I will personally review your local market and show you where to grow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Get Your Free 5-Minute Video Audit</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Send a Direct Message</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>
      </section>
    </div>
  )
}
