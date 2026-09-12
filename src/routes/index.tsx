import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Search,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Code2,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        name: 'google-site-verification',
        content: 'tSjijzpdCvum7gpDKpknIY2FN0jLAGuRNfOiAf0Kg3o',
      },
      {
        title: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        name: 'description',
        content:
          'I run a digital marketing agency for small business owners who need custom web development, search rankings, and lead automation. Request your free audit.',
      },
      {
        name: 'keywords',
        content:
          'digital marketing agency for small business, small business automation, custom web development, built by miguel, contractor marketing',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Custom web development, top search rankings, and small business automation that turn local searches into booked jobs.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Custom web development, top search rankings, and small business automation that turn local searches into booked jobs.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Do you work with small businesses and solo contractors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. I work directly with trade contractors and local service business owners across the United States. You communicate with me directly rather than dealing with junior account managers.',
              },
            },
            {
              '@type': 'Question',
              name: 'How quickly can I expect to see ranking improvements on Google Maps?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most clients see noticeable ranking improvements within 60 to 90 days. Local listings cleanup and map optimizations take effect first, followed by steady gains in customer phone calls.',
              },
            },
            {
              '@type': 'Question',
              name: 'Why do you build custom websites instead of using WordPress or Squarespace?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Template platforms load bloated code that slows down mobile phones. My custom sites load in under one second. That speed passes Google Core Web Vitals and keeps customers on your page.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you require long term monthly contracts?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. I work on simple month to month agreements. You stay because the work produces qualified customer calls, not because you signed an inflexible contract.',
              },
            },
            {
              '@type': 'Question',
              name: 'What happens during the free video audit?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'I record a five minute personal video reviewing your Google Maps position, website speed, and local competitors. You receive the video link to keep with no obligation to buy.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
})

const FAQ_ITEMS = [
  {
    question: 'Do you work with small businesses and solo contractors?',
    answer:
      'Yes. I work directly with trade contractors and local service business owners across the United States. You communicate with me directly rather than dealing with junior account managers.',
  },
  {
    question: 'How quickly can I expect to see ranking improvements on Google Maps?',
    answer:
      'Most clients see noticeable ranking improvements within 60 to 90 days. Local listings cleanup and map optimizations take effect first, followed by steady gains in customer phone calls.',
  },
  {
    question: 'Why do you build custom websites instead of using WordPress or Squarespace?',
    answer:
      'Template platforms load bloated code that slows down mobile phones. My custom sites load in under one second. That speed passes Google Core Web Vitals and keeps customers on your page.',
  },
  {
    question: 'Do you require long term monthly contracts?',
    answer:
      'No. I work on simple month to month agreements. You stay because the work produces qualified customer calls, not because you signed an inflexible contract.',
  },
  {
    question: 'What happens during the free video audit?',
    answer:
      'I record a five minute personal video reviewing your Google Maps position, website speed, and local competitors. You receive the video link to keep with no obligation to buy.',
  },
]

function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Blueprint Navy)                                          */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0B132B] text-white overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Subtle Blueprint Ambient Radial Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#38BDF8]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>Custom Engineering · Direct Partnership</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] text-white tracking-tight leading-[1.12]">
                Digital marketing agency for small business that actually drives customer calls.
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] font-['IBM_Plex_Sans'] leading-relaxed max-w-2xl">
                I build fast custom websites, rank local trade contractors in the top 3 on Google Maps, and set up small business automation for instant lead alerts. You work directly with me. No account managers, no retainers, and no cookie cutter templates.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm sm:text-base text-[#0B132B] bg-[#F59E0B] hover:bg-[#D97706] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer text-center font-['IBM_Plex_Sans']"
                >
                  <Sparkles className="w-4 h-4 text-[#0B132B] fill-[#0B132B]" />
                  <span>Get My Free Audit</span>
                </Link>

                <Link
                  to="/website-demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-sm sm:text-base text-white border border-white/80 hover:bg-white/10 transition-all duration-200 active:scale-95 cursor-pointer text-center font-['IBM_Plex_Sans']"
                >
                  <span>See a Free Demo</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-[#94A3B8] font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
                  <span>5-min video breakdown</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
                  <span>No obligation to buy</span>
                </div>
              </div>
            </div>

            {/* Right Blueprint Grid & Glowing Pin Graphic Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-[#0F1B3E]/60 border border-[#06B6D4]/30 p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* SVG Blueprint Grid Background */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <pattern id="blueprint-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#06B6D4" strokeWidth="0.75" strokeOpacity="0.2" />
                    </pattern>
                    <pattern id="blueprint-dots" width="96" height="96" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="#38BDF8" fillOpacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
                  <rect width="100%" height="100%" fill="url(#blueprint-dots)" />

                  {/* Concentric Technical Target Rings */}
                  <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
                  <circle cx="50%" cy="50%" r="26%" fill="none" stroke="#06B6D4" strokeWidth="1.2" strokeOpacity="0.4" />
                  <circle cx="50%" cy="50%" r="12%" fill="#06B6D4" fillOpacity="0.08" />

                  {/* Crosshair Lines */}
                  <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#06B6D4" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#06B6D4" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.3" />
                </svg>

                {/* Technical Coordinate Corner Badges */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-[#06B6D4]/80 tracking-widest">
                  SYS: GEO_MAP_PACK
                </div>
                <div className="absolute top-4 right-4 font-mono text-[10px] text-[#38BDF8] tracking-widest bg-[#06B6D4]/20 px-2 py-0.5 rounded-full border border-[#06B6D4]/40">
                  TOP 3 VERIFIED
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#94A3B8]/70">
                  LAT: 30.2672° N · LNG: 97.7431° W
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#94A3B8]/70">
                  SPEED: 0.42s
                </div>

                {/* Center Glowing Pin Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Pulsing Outer Glow */}
                  <div className="absolute -inset-6 rounded-full bg-[#06B6D4]/25 blur-xl animate-pulse" />
                  
                  {/* Pin Node */}
                  <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F1B3E] to-[#1E293B] border-2 border-[#38BDF8] shadow-[0_0_35px_rgba(6,182,212,0.6)]">
                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-[#F59E0B] fill-[#F59E0B]/20" />
                  </div>

                  {/* Active Indicator Pill */}
                  <div className="mt-4 px-3 py-1 rounded-full bg-[#0B132B]/90 border border-[#06B6D4]/50 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                      <span className="font-mono text-xs font-semibold text-white tracking-wide">
                        Google Maps #1 Ranked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PILLAR SECTION ("How I Help" - Paper Blue White)                       */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#F0F4F8] text-[#1E293B] py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-[#1E293B] tracking-tight">
              How I Help
            </h2>
            <p className="mt-3 text-base text-slate-600 font-['IBM_Plex_Sans']">
              Three technical pillars designed to rank your business, convert visitors, and automate follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: SEO */}
            <Link
              to="/seo"
              className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors">
                  Search Engine Optimization
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-['IBM_Plex_Sans'] leading-relaxed">
                  Rank on Google Maps and search results so local clients call you first.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold font-mono text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Explore SEO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Websites */}
            <Link
              to="/websites"
              className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors">
                  Websites & Care
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-['IBM_Plex_Sans'] leading-relaxed">
                  Fast custom sites that open instantly on mobile and convert visitors into booked jobs.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold font-mono text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Explore Websites</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Automation */}
            <Link
              to="/systems-auto"
              className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors">
                  Systems & Automation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-['IBM_Plex_Sans'] leading-relaxed">
                  Automate lead alerts to your phone in under 30 seconds and connect your CRM.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold font-mono text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Explore Systems</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TESTIMONIALS SECTION (Blueprint Navy)                                  */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#0B132B] text-white py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Quote Block 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0F1B3E]/80 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-5xl font-serif font-bold text-[#F59E0B] leading-none block select-none">
                  ““
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white leading-snug">
                  Calls doubled in 90 days.
                </h3>
                <p className="text-sm sm:text-base text-[#94A3B8] font-['IBM_Plex_Sans'] leading-relaxed">
                  Miguel rebuilt our site and took us from nowhere to the top 3 on Google Maps in Austin. We stopped paying for shared leads entirely.
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-800 border border-slate-700 text-[#F59E0B] font-mono font-bold text-sm shrink-0">
                  DM
                </div>
                <div>
                  <div className="font-bold text-sm text-white font-['Space_Grotesk']">
                    Dave Miller
                  </div>
                  <div className="text-xs text-[#94A3B8] font-['IBM_Plex_Sans']">
                    Owner, Miller Roofing & Exteriors
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Block 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0F1B3E]/80 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-5xl font-serif font-bold text-[#F59E0B] leading-none block select-none">
                  ““
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white leading-snug">
                  Our leads hit our phone in 15 seconds.
                </h3>
                <p className="text-sm sm:text-base text-[#94A3B8] font-['IBM_Plex_Sans'] leading-relaxed">
                  The automated dispatch system texts our technicians immediately when a form is submitted. We close twice as many quotes before competitors even wake up.
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-800 border border-slate-700 text-[#F59E0B] font-mono font-bold text-sm shrink-0">
                  SJ
                </div>
                <div>
                  <div className="font-bold text-sm text-white font-['Space_Grotesk']">
                    Sarah Jenkins
                  </div>
                  <div className="text-xs text-[#94A3B8] font-['IBM_Plex_Sans']">
                    Operations Director, Apex Electrical Services
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FAQ SECTION ("Common Questions" - Paper Blue White)                    */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#F0F4F8] text-[#1E293B] py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Heading, Subtext, Ask button */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-[#1E293B] tracking-tight">
                Common Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-['IBM_Plex_Sans'] leading-relaxed">
                Can't find the answer you need? Reach out directly and get an answer within 24 hours.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-black transition-colors"
                >
                  <span>Ask a Question</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Accordion */}
            <div className="lg:col-span-8 space-y-3.5">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div
                    key={faq.question}
                    className={`rounded-2xl transition-all duration-200 bg-white ${
                      isOpen
                        ? 'border-l-4 border-l-[#94A3B8] border-t border-r border-b border-[#CBD5E1]/80 p-6 shadow-sm'
                        : 'border border-[#CBD5E1]/80 p-5 hover:border-[#94A3B8]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 text-left focus:outline-none"
                    >
                      <span className="font-bold font-['Space_Grotesk'] text-base sm:text-lg text-[#1E293B]">
                        {faq.question}
                      </span>
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F0F4F8] border border-[#CBD5E1]/60 shrink-0 text-[#1E293B]">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 font-['IBM_Plex_Sans'] text-sm sm:text-base text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BLOG SECTION ("From the Blog" - Paper Blue White)                      */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#F0F4F8] text-[#1E293B] py-20 sm:py-24 lg:py-28 border-t border-[#CBD5E1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-[#1E293B] tracking-tight">
                From the Blog
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 font-['IBM_Plex_Sans']">
                Practical guides on search rankings, web speed, and lead workflows.
              </p>
            </div>

            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] hover:text-[#0EA5E9]"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Post Card 1 */}
            <Link
              to="/blog/$slug"
              params={{ slug: 'what-local-seo-actually-means-for-a-home-service-business-2026' }}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div>
                {/* Flat Vector Illustration Header */}
                <div className="h-44 bg-gradient-to-br from-[#0B132B] to-[#1E293B] p-6 flex flex-col justify-between relative overflow-hidden border-b border-slate-700/40">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#38BDF8]">
                      Local SEO
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">2026 Guide</span>
                  </div>

                  {/* Blueprint Graphic Elements */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-[#38BDF8]" />
                    </div>
                  </div>

                  <div className="relative z-10 font-mono text-[10px] text-slate-400 text-center">
                    MAP PACK · CITATIONS · GEO
                  </div>

                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="font-bold font-['Space_Grotesk'] text-lg text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors leading-snug">
                    What Local SEO Actually Means for a Home Service Business
                  </h3>
                  <p className="text-sm text-slate-600 font-['IBM_Plex_Sans'] line-clamp-2 leading-relaxed">
                    A straightforward guide to map packs, citations, and local search visibility.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Post Card 2 */}
            <Link
              to="/blog/$slug"
              params={{ slug: 'core-web-vitals-explained-for-business-owners-no-jargon' }}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div>
                {/* Flat Vector Illustration Header */}
                <div className="h-44 bg-gradient-to-br from-[#0B132B] to-[#1E293B] p-6 flex flex-col justify-between relative overflow-hidden border-b border-slate-700/40">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FBBF24]">
                      Speed & Care
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Performance</span>
                  </div>

                  {/* Blueprint Graphic Elements */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24] group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-[#FBBF24]" />
                    </div>
                  </div>

                  <div className="relative z-10 font-mono text-[10px] text-slate-400 text-center">
                    CORE WEB VITALS · 0.4s LOAD
                  </div>

                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b15_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="font-bold font-['Space_Grotesk'] text-lg text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors leading-snug">
                    Core Web Vitals Explained for Business Owners
                  </h3>
                  <p className="text-sm text-slate-600 font-['IBM_Plex_Sans'] line-clamp-2 leading-relaxed">
                    Why site speed matters to Google and how sub-second loads win customers.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Post Card 3 */}
            <Link
              to="/blog/$slug"
              params={{ slug: 'lead-automation-workflow-form-to-text' }}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-[#CBD5E1]/80 hover:border-[#0EA5E9] overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              <div>
                {/* Flat Vector Illustration Header */}
                <div className="h-44 bg-gradient-to-br from-[#0B132B] to-[#1E293B] p-6 flex flex-col justify-between relative overflow-hidden border-b border-slate-700/40">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#38BDF8]">
                      Automation
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Workflows</span>
                  </div>

                  {/* Blueprint Graphic Elements */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6 text-[#38BDF8]" />
                    </div>
                  </div>

                  <div className="relative z-10 font-mono text-[10px] text-slate-400 text-center">
                    SMS DISPATCH · CRM SYNC
                  </div>

                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="font-bold font-['Space_Grotesk'] text-lg text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors leading-snug">
                    How Lead Automation Turns Forms Into Phone Calls
                  </h3>
                  <p className="text-sm text-slate-600 font-['IBM_Plex_Sans'] line-clamp-2 leading-relaxed">
                    Alert your team within 30 seconds and close quotes before competitors respond.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] group-hover:text-[#0EA5E9]">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Centered Button: More Articles */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-slate-900 hover:bg-black shadow-md transition-all active:scale-95"
            >
              <span>More Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FREE AUDIT CTA SECTION                                                */}
      {/* ========================================================================= */}
      <FreeAuditCTA variant="default" />
    </div>
  )
}
