import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  MapPin,
  CheckCircle2,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'About Miguel | Founder & Systems Developer',
      },
      {
        name: 'description',
        content:
          'Learn about Miguel, founder of Built by Miguel. The engineering philosophy behind combining surgical local SEO with automated business systems.',
      },
      {
        name: 'keywords',
        content:
          'about miguel, full stack engineer, local seo consultant, custom business systems builder',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'About Miguel | Full-Stack Engineer & Local Growth Strategist',
      },
      {
        property: 'og:description',
        content:
          'Engineering high-speed web apps and automated growth engines for local businesses.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/about' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Terminal className="w-3.5 h-3.5" /> Founder & Principal Engineer
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Engineering Growth With{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Code and Data.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          I combine surgical local search optimization with full-stack TypeScript engineering to build businesses that rank #1, load in milliseconds, and run on autopilot.
        </p>
      </section>

      {/* STORY & PHILOSOPHY */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Profile */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center space-y-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

            <div className="relative mx-auto flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
              <span className="font-mono font-black text-3xl text-emerald-400">M</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-4 ring-slate-950" />
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Miguel</h3>
              <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Full-Stack Engineer & SEO Strategist
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-left font-mono text-xs">
              <div>
                <div className="text-slate-500 text-[10px]">FOCUS</div>
                <div className="text-slate-200 font-semibold mt-0.5">Local SEO & Systems</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">STACK</div>
                <div className="text-slate-200 font-semibold mt-0.5">React · TypeScript</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why combine Local SEO with Custom Systems?
          </h2>

          <p>
            Most local businesses suffer from two major bottlenecks: <strong className="text-white">traffic acquisition</strong> (nobody finds them on Google Maps) and <strong className="text-white">operational friction</strong> (lost leads, slow response times, and manual busywork).
          </p>

          <p>
            Traditional agencies sell bloated WordPress sites that take 6 seconds to load and hand off complex retainers with zero automated follow-up. I take an engineering-first approach.
          </p>

          <p>
            By building lightweight, sub-second web applications, establishing surgical entity schema for Google and AI engines, and connecting automated CRM pipelines, my clients receive qualified calls and close deals without getting buried in administrative chaos.
          </p>

          <div className="pt-2">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Explore My Internal Architecture & Proof</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3-PILLAR PHILOSOPHY */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            The 3-Pillar Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How I Build & Partner
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">1. Fast Load Speeds (&lt;800ms)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Speed is a conversion multiplier. Every page is hand-crafted with clean TypeScript and modern edge caching for sub-second load times that keep mobile visitors engaged.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">2. Verified Local Search Signals</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dominate the Google Map Pack top 3 and get cited by AI search models (ChatGPT, Perplexity) through clean citations and structured entity schema.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">3. Automated Back-Office Tools</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect webhooks, automated CRM notifications, zero-touch onboarding, and client portals so your business scales without hiring administrative staff.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> Start a Conversation
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          Let’s build something high-performing together
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Whether you need to dominate your local Google Map Pack or automate your daily client workflows, I’d love to connect.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Get Free 5-Min Audit</span>
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-all"
          >
            <span>Direct Inquiries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
