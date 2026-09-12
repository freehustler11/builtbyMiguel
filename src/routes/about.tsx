import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Zap,
  MapPin,
  Bot,
  RefreshCw,
  Clock,
  ExternalLink,
  X,
  Star,
  Quote,
  ArrowRight,
  Calendar,
  Building2,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'About Miguel Umbac, Founder of built by Miguel',
      },
      {
        name: 'description',
        content:
          'Meet the founder and full-stack developer behind built by Miguel. Direct collaboration on every project, no account managers, no templates.',
      },
      {
        name: 'keywords',
        content:
          'about built by miguel, miguel umbac, founder built by miguel, local seo developer',
      },
      // OpenGraph
      { property: 'og:type', content: 'profile' },
      {
        property: 'og:title',
        content: 'About Miguel Umbac, Founder of built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Meet the founder and full-stack developer behind built by Miguel. Direct collaboration on every project, no account managers, no templates.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/about' },
      { property: 'og:image', content: 'https://builtbymiguel.net/miguel-umbac.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'About Miguel Umbac, Founder of built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Meet the founder and full-stack developer behind built by Miguel. Direct collaboration on every project, no account managers, no templates.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/miguel-umbac.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/about',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Miguel Umbac',
          jobTitle: 'Founder & Systems Specialist',
          worksFor: {
            '@type': 'Organization',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          url: 'https://builtbymiguel.net/about',
          image: 'https://builtbymiguel.net/miguel-umbac.png',
          description:
            'Meet the founder and full-stack developer behind built by Miguel. Direct collaboration on every project, no account managers, no templates.',
          hasCredential: [
            {
              '@type': 'EducationalOccupationalCredential',
              name: 'Local SEO Masterclass',
              credentialCategory: 'Certificate',
              recognizedBy: {
                '@type': 'Organization',
                name: 'SEOTalks',
                url: 'https://seotalksph.com/',
              },
              validFrom: '2026-01-31',
              description:
                'A one-day intensive covering local SEO and Google Business Profile optimization strategies.',
            },
            {
              '@type': 'EducationalOccupationalCredential',
              name: 'Go High-Level (GHL) Training',
              credentialCategory: 'Certificate',
              recognizedBy: {
                '@type': 'Organization',
                name: 'Home-Based (HBC)',
              },
              validFrom: '2026-01-16',
              description:
                'Demonstrated proficiency building landing pages, websites, automation sequences, booking systems, email marketing, and pipeline management inside GoHighLevel.',
            },
            {
              '@type': 'EducationalOccupationalCredential',
              name: 'Premium Local SEO + AI Tools Masterclass',
              credentialCategory: 'Certificate',
              validFrom: '2026-01-10',
              description:
                'A 58-lesson, 24-hour advanced program covering local SEO combined with AI-powered SEO tools.',
            },
            {
              '@type': 'EducationalOccupationalCredential',
              name: 'Advanced SEO Course',
              credentialCategory: 'Certificate',
              recognizedBy: {
                '@type': 'Organization',
                name: 'All White Hat SEO',
              },
              validFrom: '2026-01-07',
              description:
                'Advanced training in white-hat SEO strategy and technique.',
            },
            {
              '@type': 'EducationalOccupationalCredential',
              name: '4-Week Online SEO Bootcamp (Batch 1)',
              credentialCategory: 'Certificate',
              recognizedBy: {
                '@type': 'Organization',
                name: 'PinoySEO.ph',
                url: 'https://www.pinoyseo.ph',
              },
              validFrom: '2022-12-01',
              description:
                'A foundational bootcamp covering core search engine optimization principles.',
            },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'built by Miguel',
          url: 'https://builtbymiguel.net',
          logo: 'https://builtbymiguel.net/logo-black.png',
          founder: {
            '@type': 'Person',
            name: 'Miguel Umbac',
          },
          description:
            'Digital marketing services for small business. Custom web development, Google Maps SEO, and automated lead dispatch.',
        }),
      },
    ],
  }),
  component: AboutPage,
})

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  imageSrc: string
}

const CERTIFICATES: Certificate[] = [
  {
    id: 'seotalks',
    title: 'Local SEO Masterclass',
    issuer: 'SEOTalks',
    date: 'January 31, 2026',
    description:
      'A one-day intensive covering local SEO and Google Business Profile optimization strategies.',
    imageSrc: '/images/certificates/seotalks-local-seo-masterclass.webp',
  },
  {
    id: 'ghl',
    title: 'Go High-Level (GHL) Training',
    issuer: 'Home-Based (HBC)',
    date: 'January 16, 2026',
    description:
      'Demonstrated proficiency building landing pages, websites, automation sequences, booking systems, email marketing, and pipeline management inside GoHighLevel.',
    imageSrc: '/images/certificates/ghl-training-hbc.webp',
  },
  {
    id: 'premium-ai',
    title: 'Premium Local SEO + AI Tools Masterclass',
    issuer: '(course platform, name not shown on certificate)',
    date: 'January 10, 2026',
    description:
      'A 58-lesson, 24-hour advanced program covering local SEO combined with AI-powered SEO tools.',
    imageSrc: '/images/certificates/premium-local-seo-ai-tools.webp',
  },
  {
    id: 'advanced-seo',
    title: 'Advanced SEO Course',
    issuer: 'All White Hat SEO',
    date: 'January 7, 2026',
    description:
      'Advanced training in white-hat SEO strategy and technique.',
    imageSrc: '/images/certificates/all-white-hat-advanced-seo.webp',
  },
  {
    id: 'pinoyseo',
    title: '4-Week Online SEO Bootcamp (Batch 1)',
    issuer: 'PinoySEO.ph',
    date: 'December 2022 – January 2023',
    description:
      'A foundational bootcamp covering core search engine optimization principles.',
    imageSrc: '/images/certificates/pinoyseo-bootcamp.webp',
  },
]

function AboutPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedCert(null)
    }
  }, [])

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCert, handleKeyDown])

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 space-y-20 sm:space-y-28">
        
        {/* SECTION 1: Hero */}
        <section className="relative text-center max-w-4xl mx-auto pt-4 sm:pt-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Eyebrow (not a heading) */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Founder & Systems Specialist
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Local Business Growth, Built Like Real Software
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            I help service companies win more customers through high search rankings and clean automation. You work directly with me from day one.
          </p>
        </section>

        {/* SECTION 2: Profile Card */}
        <section className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 md:p-10 shadow-sm dark:shadow-none relative">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              
              {/* Real Headshot Photo */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner border border-slate-200/80 dark:border-slate-700">
                <img
                  src="/miguel-umbac.png"
                  alt="Miguel Umbac"
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>

              {/* Profile Details & Pull-Quote */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                    Miguel Umbac
                  </div>
                  <div className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-400 font-medium">
                    Founder & Systems Specialist
                  </div>
                </div>

                {/* Clean Availability Badge */}
                <div className="flex justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available for New Clients
                  </span>
                </div>

                {/* Pull-quote / Highlighted Callout */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 relative">
                  <Quote className="w-6 h-6 text-amber-400/50 absolute top-3 right-3" />
                  <p className="text-sm sm:text-base italic text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    &ldquo;I personally design and build every client system. You never get handed off to a junior account manager.&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: Direct Founder Collaboration (Extended Bio) */}
        <section className="max-w-3xl mx-auto space-y-6 text-slate-700 dark:text-slate-300">
          <div className="space-y-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Direct Founder Collaboration
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Miguel Umbac
            </h2>
            <p className="text-sm sm:text-base font-mono text-slate-500 dark:text-slate-400 font-medium">
              Full-Stack Developer & Local Search Specialist
            </p>
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
            <p>
              Most marketing agencies sell generic templates, charge high monthly fees, and send confusing reports packed with vanity numbers that don't ring your phone.
            </p>
            <p>
              I take a hands-on, technical approach to local growth. Websites and local search systems get built to load in under a second and stay online, paired with Map Pack rankings and instant text alerts that help local trade contractors book more jobs every week.
            </p>
          </div>
        </section>

        {/* SECTION 4: Certifications & Training */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Certifications & Training
            </h2>
          </div>

          {/* Grid layout: 3 columns on desktop, 1 on mobile (5 cards total, last row 2 cards on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs dark:shadow-none hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all duration-200 flex flex-col"
              >
                {/* Real Scan Thumbnail - click to open lightbox */}
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="relative w-full h-52 sm:h-56 bg-slate-100 dark:bg-slate-800/80 overflow-hidden cursor-pointer group/thumb border-b border-slate-100 dark:border-slate-800 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`View full certificate: ${cert.title}`}
                >
                  <img
                    src={cert.imageSrc}
                    alt={cert.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover/thumb:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-white bg-black/70 backdrop-blur-xs shadow-md">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Click to view scan
                    </span>
                  </div>
                </button>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-snug">
                      {cert.title}
                    </h3>
                    <div className="space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Issuer: {cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Date: {cert.date}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Certificate Scan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Core Build Stack */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Core Build Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                ⚡ Fast React Websites
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                📍 Google Maps & Local SEO
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                🤖 AI Search Visibility
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                🔄 Instant Lead Alerts
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 6: The 3 Pillars */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              The 3 Pillars
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              How These Three Pillars Drive Local Growth
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Clean code, top search rankings, and simple systems that bring you customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-xs dark:shadow-none hover:border-amber-400/60 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center font-display font-bold text-lg text-amber-800 dark:text-amber-300">
                  1
                </span>
                <Clock className="w-5 h-5 text-amber-500/70" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Sub-Second Speed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Slow load times make mobile visitors leave before they ever call. Lightweight websites get built to load right away on every phone.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-xs dark:shadow-none hover:border-amber-400/60 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center font-display font-bold text-lg text-amber-800 dark:text-amber-300">
                  2
                </span>
                <MapPin className="w-5 h-5 text-amber-500/70" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Local Map Visibility
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Homeowners search Google Maps when they need service right away. Listings get cleaned up and authority built so you show up in the top three.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-xs dark:shadow-none hover:border-amber-400/60 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center font-display font-bold text-lg text-amber-800 dark:text-amber-300">
                  3
                </span>
                <RefreshCw className="w-5 h-5 text-amber-500/70" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Operational Automation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Getting calls is only half the battle. Text message alerts and customer follow-ups get automated so you close more deals without extra office work.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: What Clients Say (Testimonials) */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-6 shadow-xs dark:shadow-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-400/40" />
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;I've worked with agencies before where I never knew who was actually touching my account. With Miguel, I know exactly who built my site and who to call if something needs to change.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                Anthony, Plumbing Company Owner
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-6 shadow-xs dark:shadow-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-400/40" />
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;He explains things in plain English instead of throwing jargon at me and hoping I don't ask questions. That alone made the whole process easier.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                Denise, HVAC Business Owner
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-6 shadow-xs dark:shadow-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-400/40" />
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;What sold me wasn't a pitch, it was watching my new site load next to my old one. The difference was obvious immediately.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
                Ray, Electrical Contractor
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* SECTION 8: Closing CTA */}
      <section className="w-full bg-[#0B0F17] dark:bg-[#070A0F] text-white py-16 sm:py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
          {/* Eyebrow (not a heading) */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-amber-950/50 border border-amber-700/50 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Partnership
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.15]">
            Let's Review Your Local Rankings and Systems
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Request a free 5-minute video audit or send a message. I will personally review your local market and show you where to grow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Get Your Free 5-Minute Video Audit</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-sm transition-all duration-200"
            >
              <span>Send a Direct Message</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="space-y-0.5 pr-4">
                <h3 id="modal-title" className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {selectedCert.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {selectedCert.issuer} &bull; {selectedCert.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close certificate scan modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Scan */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50">
              <img
                src={selectedCert.imageSrc}
                alt={selectedCert.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-md border border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>{selectedCert.description}</span>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
