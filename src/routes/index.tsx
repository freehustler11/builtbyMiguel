import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Plus,
  Minus,
  Check,
  X as XIcon,
  Star,
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
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
      },
      {
        name: 'keywords',
        content:
          'digital marketing agency for small business, local seo services, national seo services, aeo geo optimization, custom web development, small business automation, trade contractor marketing',
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
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
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
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
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
      // Organization Schema
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'built by Miguel',
          url: 'https://builtbymiguel.net',
          logo: 'https://builtbymiguel.net/logo.png',
          founder: {
            '@type': 'Person',
            name: 'Miguel Umbac',
          },
          description:
            'Digital marketing agency for small business and trade contractors. Custom web development, SEO, and business automation run by one founder.',
          sameAs: [
            'https://twitter.com/builtbymiguel',
            'https://linkedin.com/company/builtbymiguel',
          ],
        }),
      },
      // FAQPage Schema
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is built by Miguel actually an agency?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. It is a one-person studio. Founder Miguel Umbac personally handles every client engagement. There is no account manager layer and no outsourcing to subcontractors.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need to hire three different companies for SEO, my website, and automation?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. All three are built as one connected system: SEO (local, national, or AI search depending on your business), a custom website, and automated lead follow-up, so improvements in one area support the others.',
              },
            },
            {
              '@type': 'Question',
              name: "What's included in the free audit?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A personally recorded 5-minute video reviewing your current site, SEO setup, and lead follow-up process, delivered within 24 hours. There is no sales call required to get it.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you work with businesses outside my state?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Service is nationwide and remote across the U.S.',
              },
            },
            {
              '@type': 'Question',
              name: 'How fast will I hear back if I have a question?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Within 24 business hours.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can you fix my existing website instead of building a new one?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'In most cases a full rebuild delivers better speed and reliability than patching an existing site, but every situation is different. The free audit looks at your current site first and tells you honestly whether a rebuild or a fix makes more sense.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer monthly plans or one-time projects?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Both. Websites are typically project-based, and ongoing care, SEO, and automation are handled through a monthly plan starting at $99 per month.',
              },
            },
            {
              '@type': 'Question',
              name: 'What kind of businesses do you typically work with?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Local service businesses and trade contractors, the kind of business where a missed call or a slow-loading site directly costs a job.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is my site secure?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sites are built with SSL and hosted on edge infrastructure, with backups and updates handled as part of ongoing care plans.',
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
    question: 'Is built by Miguel actually an agency?',
    answer:
      'No. It is a one-person studio. Founder Miguel Umbac personally handles every client engagement. There is no account manager layer and no outsourcing to subcontractors.',
  },
  {
    question:
      'Do I need to hire three different companies for SEO, my website, and automation?',
    answer:
      'No. All three are built as one connected system: SEO (local, national, or AI search depending on your business), a custom website, and automated lead follow-up, so improvements in one area support the others.',
  },
  {
    question: "What's included in the free audit?",
    answer:
      'A personally recorded 5-minute video reviewing your current site, SEO setup, and lead follow-up process, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    question: 'Do you work with businesses outside my state?',
    answer: 'Yes. Service is nationwide and remote across the U.S.',
  },
  {
    question: 'How fast will I hear back if I have a question?',
    answer: 'Within 24 business hours.',
  },
  {
    question: 'Can you fix my existing website instead of building a new one?',
    answer:
      'In most cases a full rebuild delivers better speed and reliability than patching an existing site, but every situation is different. The free audit looks at your current site first and tells you honestly whether a rebuild or a fix makes more sense.',
  },
  {
    question: 'Do you offer monthly plans or one-time projects?',
    answer:
      'Both. Websites are typically project-based, and ongoing care, SEO, and automation are handled through a monthly plan starting at $99 per month.',
  },
  {
    question: 'What kind of businesses do you typically work with?',
    answer:
      'Local service businesses and trade contractors, the kind of business where a missed call or a slow-loading site directly costs a job.',
  },
  {
    question: 'Is my site secure?',
    answer:
      'Sites are built with SSL and hosted on edge infrastructure, with backups and updates handled as part of ongoing care plans.',
  },
]

function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF8F5] text-[#141522] selection:bg-[#141522] selection:text-white font-sans antialiased">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        {/* Soft background ambient gradient shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-100/40 via-rose-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/30 via-slate-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow kicker (Styled span, NOT a heading) */}
              <div className="inline-flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-700 bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-200/60">
                  SEO, Speed, and Automation
                </span>
              </div>

              {/* Single H1 on page */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141522] font-display leading-[1.12]">
                Digital Marketing Agency for Small Business, Run by One Founder
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl font-normal">
                Most digital marketing agencies for small business hand you off to a junior account manager and a templated WordPress site. I build your SEO, your website, and your lead system myself, and you talk to me directly, not a support queue.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                >
                  <span>Get Your Free Audit</span>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold text-[#141522] bg-white border border-slate-300 hover:border-[#141522] hover:bg-slate-50 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Contact Me</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Flat Vector Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
                {/* Flat vector illustration: Laptop with connected website, map pin, and CRM dashboard */}
                <svg
                  viewBox="0 0 400 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-sm"
                  aria-label="Connected website, map pin, and CRM dashboard illustration"
                  role="img"
                >
                  {/* Outer glow background circle */}
                  <circle cx="200" cy="150" r="130" fill="#FEF3C7" opacity="0.45" />

                  {/* Connecting Network Pipelines */}
                  <path
                    d="M140 120 C 140 70, 200 65, 260 90"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                  />
                  <path
                    d="M260 170 C 260 215, 180 220, 130 190"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                  />

                  {/* Laptop Base Stand */}
                  <path
                    d="M60 245 L340 245 C 348 245, 350 252, 342 254 L58 254 C 50 252, 52 245, 60 245 Z"
                    fill="#334155"
                  />
                  <path
                    d="M170 246 L230 246 C 228 250, 172 250, 170 246 Z"
                    fill="#64748B"
                  />

                  {/* Laptop Display Outer Frame */}
                  <rect
                    x="90"
                    y="75"
                    width="220"
                    height="170"
                    rx="14"
                    fill="#0F172A"
                  />
                  {/* Laptop Inner Screen */}
                  <rect
                    x="98"
                    y="83"
                    width="204"
                    height="150"
                    rx="8"
                    fill="#F8FAFC"
                  />

                  {/* Screen Header Bar */}
                  <rect x="98" y="83" width="204" height="20" fill="#E2E8F0" />
                  <circle cx="109" cy="93" r="3" fill="#EF4444" />
                  <circle cx="118" cy="93" r="3" fill="#F59E0B" />
                  <circle cx="127" cy="93" r="3" fill="#10B981" />

                  {/* Website Layout Left Pane */}
                  <rect x="108" y="112" width="85" height="10" rx="3" fill="#0F172A" />
                  <rect x="108" y="128" width="55" height="6" rx="2" fill="#94A3B8" />
                  <rect x="108" y="140" width="88" height="42" rx="4" fill="#E2E8F0" />
                  <rect x="114" y="148" width="30" height="5" rx="2" fill="#F59E0B" />
                  <rect x="114" y="158" width="76" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="114" y="166" width="60" height="4" rx="2" fill="#CBD5E1" />

                  {/* Connected Map Pin Node (Floating Top-Right) */}
                  <g transform="translate(230, 45)">
                    <circle cx="28" cy="28" r="26" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                    <circle cx="28" cy="28" r="22" fill="#FEF3C7" />
                    {/* Flat Map Pin */}
                    <path
                      d="M28 14 C 21 14, 16 19, 16 26 C 16 34, 28 44, 28 44 C 28 44, 40 34, 40 26 C 40 19, 35 14, 28 14 Z"
                      fill="#D97706"
                    />
                    <circle cx="28" cy="25" r="4.5" fill="#FFFFFF" />
                  </g>

                  {/* Connected CRM Dashboard Node (Floating Bottom-Right) */}
                  <g transform="translate(205, 125)">
                    <rect
                      x="0"
                      y="0"
                      width="92"
                      height="68"
                      rx="8"
                      fill="#FFFFFF"
                      stroke="#E2E8F0"
                      strokeWidth="2"
                    />
                    <rect x="10" y="10" width="40" height="6" rx="2" fill="#0F172A" />
                    <rect x="10" y="22" width="72" height="14" rx="3" fill="#EEF2F6" />
                    {/* Mini CRM Trend Line */}
                    <path
                      d="M14 31 L26 27 L38 29 L54 24 L72 26"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Live Lead Pill */}
                    <rect x="10" y="44" width="72" height="14" rx="4" fill="#FEF3C7" />
                    <circle cx="18" cy="51" r="3" fill="#D97706" />
                    <rect x="26" y="49" width="48" height="4" rx="1.5" fill="#78350F" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: VALUE STRIP                                                    */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-200/80 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#141522] tracking-tight mb-4">
              One Founder, Three Systems That Actually Talk to Each Other
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Most agencies split your SEO, your website, and your lead follow-up across three different vendors who never compare notes. I build all three as one connected system, so a ranking improvement, a faster page, and a follow-up text all work toward the same goal: more jobs booked.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Direct Founder Access */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                {/* Flat Vector Icon: Handshake / Direct Access */}
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mb-4 text-amber-700">
                  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                    <path
                      d="M6 18L12 12L16 16L12 20L6 18Z"
                      fill="#D97706"
                      opacity="0.8"
                    />
                    <path
                      d="M26 14L20 20L16 16L20 12L26 14Z"
                      fill="#B45309"
                    />
                    <path
                      d="M10 14L16 20L22 14"
                      stroke="#78350F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-display text-[#141522] mb-2">
                  Direct Founder Access
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No account manager relays your questions to someone else. You talk to the person actually building your site.
                </p>
              </div>
            </div>

            {/* Card 2: Professional-Grade Rigor */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                {/* Flat Vector Icon: Code / Quality Checkmark */}
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center mb-4 text-sky-700">
                  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                    <path
                      d="M8 12L4 16L8 20"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 12L28 16L24 20"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16L15 19L20 13"
                      stroke="#0369A1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-display text-[#141522] mb-2">
                  Professional-Grade Rigor
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every project is built to the same code-quality standard as production software, not assembled from a drag-and-drop template.
                </p>
              </div>
            </div>

            {/* Card 3: Sub-Second Site Speed */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                {/* Flat Vector Icon: Speed / Lightning */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-4 text-emerald-700">
                  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                    <path
                      d="M18 4L8 18H16L14 28L24 14H16L18 4Z"
                      fill="#059669"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-display text-[#141522] mb-2">
                  Sub-Second Site Speed
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sites are built on React and edge hosting, tuned to load fast on the mobile connections your customers actually use.
                </p>
              </div>
            </div>

            {/* Card 4: Automation-First Operations */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                {/* Flat Vector Icon: Automation / Gears */}
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center mb-4 text-purple-700">
                  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                    <circle cx="16" cy="16" r="5" stroke="#7C3AED" strokeWidth="2.5" />
                    <path
                      d="M16 6V8M16 24V26M6 16H8M24 16H26M8.9 8.9L10.3 10.3M21.7 21.7L23.1 23.1M8.9 23.1L10.3 21.7M21.7 10.3L23.1 8.9"
                      stroke="#7C3AED"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-display text-[#141522] mb-2">
                  Automation-First Operations
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lead capture, CRM sync, and follow-up run automatically in the background, so nothing depends on someone checking an inbox.
                </p>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Get Your Free Audit</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-[#141522] bg-white border border-slate-300 hover:border-[#141522] hover:bg-slate-50 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Contact Me</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHAT YOU GET (FEATURE GRID)                                    */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#141522] tracking-tight">
              What You Get
            </h2>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pillar 1: SEO That Actually Ranks */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-6">
                {/* Flat Vector Illustration 1: Map pin, wider regional outline, and chat-bubble AI icon */}
                <div className="w-full h-44 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-center p-4">
                  <svg viewBox="0 0 200 120" fill="none" className="w-48 h-auto" aria-label="SEO Illustration">
                    {/* Regional Outline */}
                    <path
                      d="M30 60 C 40 30, 90 20, 130 35 C 165 48, 175 80, 150 100 C 120 115, 60 110, 40 95 Z"
                      fill="#FEF3C7"
                      stroke="#FCD34D"
                      strokeWidth="2"
                    />
                    {/* Map Pin */}
                    <g transform="translate(60, 35)">
                      <path
                        d="M20 5 C 13 5, 8 10, 8 17 C 8 25, 20 37, 20 37 C 20 37, 32 25, 32 17 C 32 10, 27 5, 20 5 Z"
                        fill="#D97706"
                      />
                      <circle cx="20" cy="15" r="4" fill="#FFFFFF" />
                    </g>
                    {/* Chat-Bubble AI Icon */}
                    <g transform="translate(125, 45)">
                      <rect x="0" y="0" width="44" height="32" rx="8" fill="#1E293B" />
                      <path d="M12 32 L16 38 L22 32 Z" fill="#1E293B" />
                      <circle cx="14" cy="16" r="2.5" fill="#38BDF8" />
                      <circle cx="22" cy="16" r="2.5" fill="#38BDF8" />
                      <circle cx="30" cy="16" r="2.5" fill="#38BDF8" />
                    </g>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold font-display text-[#141522]">
                  SEO That Actually Ranks
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Whether you need to dominate the Map Pack in a twenty-mile radius, rank across an entire state for commercial contracts, or get cited by AI tools like ChatGPT and Perplexity, I build the SEO strategy around where your customers are actually searching.
                </p>

                <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>Local SEO and Map Pack optimization for businesses serving a specific town or metro area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>National and regional SEO for commercial and industrial contractors, plus AEO/GEO work so AI search engines cite your business directly</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  to="/seo"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141522] hover:text-amber-700 transition-colors group cursor-pointer"
                >
                  <span>See all SEO services</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Pillar 2: High-Speed Websites & Care */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-6">
                {/* Flat Vector Illustration 2: Browser window with speed gauge */}
                <div className="w-full h-44 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-center p-4">
                  <svg viewBox="0 0 200 120" fill="none" className="w-48 h-auto" aria-label="Speed Illustration">
                    {/* Browser Window */}
                    <rect x="25" y="15" width="150" height="90" rx="8" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
                    <rect x="25" y="15" width="150" height="20" rx="8" fill="#E0F2FE" />
                    <circle cx="36" cy="25" r="2.5" fill="#EF4444" />
                    <circle cx="44" cy="25" r="2.5" fill="#F59E0B" />
                    <circle cx="52" cy="25" r="2.5" fill="#10B981" />

                    {/* Speed Gauge */}
                    <circle cx="100" cy="70" r="30" stroke="#E2E8F0" strokeWidth="6" strokeDasharray="94" strokeDashoffset="30" />
                    <circle cx="100" cy="70" r="30" stroke="#0284C7" strokeWidth="6" strokeDasharray="94" strokeDashoffset="60" strokeLinecap="round" />
                    <circle cx="100" cy="70" r="4" fill="#0284C7" />
                    <path d="M100 70 L115 58" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold font-display text-[#141522]">
                  High-Speed Websites & Care
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your site is built as a custom React application, not assembled from a page-builder theme. That means faster load times, a tap-to-call setup that actually works on mobile, and no plugin conflicts to manage. Once it launches, ongoing hosting and care keep it that way.
                </p>

                <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <span>Custom design and development, built to load under a second on mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <span>Edge hosting, SSL, backups, and monthly updates after launch</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  to="/websites"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141522] hover:text-sky-700 transition-colors group cursor-pointer"
                >
                  <span>See website design and hosting and care plans</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Pillar 3: Custom Systems & Automation */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-6">
                {/* Flat Vector Illustration 3: Phone receiving an automated text alert */}
                <div className="w-full h-44 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-center p-4">
                  <svg viewBox="0 0 200 120" fill="none" className="w-48 h-auto" aria-label="Automation Illustration">
                    {/* Smartphone */}
                    <rect x="75" y="15" width="50" height="90" rx="8" fill="#1E293B" />
                    <rect x="78" y="22" width="44" height="76" rx="4" fill="#F8FAFC" />
                    <rect x="94" y="18" width="12" height="2" rx="1" fill="#64748B" />

                    {/* Incoming SMS Notification Card */}
                    <rect x="40" y="42" width="120" height="38" rx="8" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                    <circle cx="54" cy="61" r="5" fill="#7C3AED" />
                    <path d="M52 61 L54 63 L57 59" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="65" y="52" width="50" height="5" rx="2" fill="#0F172A" />
                    <rect x="65" y="62" width="78" height="4" rx="1.5" fill="#94A3B8" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold font-display text-[#141522]">
                  Custom Systems & Automation
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  When a lead comes in, it is routed to a CRM, texted to your phone, and logged in a client portal automatically. No lead sits in an inbox waiting for someone to notice it.
                </p>

                <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>Lead CRM pipelines with instant SMS alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>Client intake automation and internal dashboards</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  to="/systems-auto"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141522] hover:text-purple-700 transition-colors group cursor-pointer"
                >
                  <span>Learn more about automated lead systems and CRM pipelines</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Get Your Free Audit</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-[#141522] bg-white border border-slate-300 hover:border-[#141522] hover:bg-slate-50 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Contact Me</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHY WORK DIRECTLY WITH THE PERSON WHO BUILDS IT                */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-200/80 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Left Column (roughly 40% width): Text block & link */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#141522] tracking-tight leading-tight">
                Why Work Directly With the Person Who Builds It
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                A traditional digital marketing agency for small business sells you a retainer, then routes your account through layers of staff you will never talk to. I skip that structure entirely. Every site, every automation, and every SEO fix is something I build and test myself, so there is no gap between the person making promises and the person doing the work.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                That also means faster turnaround on changes. When something needs fixing, you are not waiting for a ticket to move through a queue. You are telling the person who can fix it directly.
              </p>

              <div className="pt-2">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141522] hover:text-amber-700 transition-colors group cursor-pointer"
                >
                  <span>See real project examples on the client work page</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Right Column (roughly 60% width): Testimonials Set */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-2xl font-bold font-display text-[#141522]">
                  What Clients Say
                </h3>

                {/* Decorative 5-star / Quote motif flat vector */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Testimonial Card 1 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Before this, our leads went into a shared inbox and half of them got a callback the next day, if we remembered. Now a missed call gets a text back automatically, and it is probably why we stopped losing jobs to the first contractor who calls back."
                </p>
                <div className="text-xs font-bold text-[#141522] font-display pt-1">
                  James, HVAC Company Owner
                </div>
              </div>

              {/* Testimonial Card 2 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Our old site took almost 6 seconds to load on a phone. The new one is instant, and calls from the site actually started showing up the same week it went live."
                </p>
                <div className="text-xs font-bold text-[#141522] font-display pt-1">
                  Maria, Landscaping Business Owner
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "I liked that I was talking to the person actually building the site instead of an account manager. Changes happened in a day instead of a week."
                </p>
                <div className="text-xs font-bold text-[#141522] font-display pt-1">
                  David, Plumbing Contractor
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPARISON TABLE                                               */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#141522] tracking-tight">
              Traditional Agency vs. built by Miguel
            </h2>
          </div>

          {/* Modern Comparison Layout (2-Column Side-by-Side Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Column 1: Traditional Agency (Muted tone with X marks) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/70 border border-slate-200 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 block mb-1">
                  Other Options
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-700">
                  Traditional Agency
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Cookie-cutter WordPress theme</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Care and support plans starting around $300+ per month</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Junior account manager relays your requests</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Vanity-metric PDF reports once a month</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>SEO, website, and automation handled by separate vendors</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Slow turnaround through a support queue</span>
                </div>
              </div>
            </div>

            {/* Column 2: built by Miguel (Accent tone with Checkmarks) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#141522] shadow-xl space-y-6 relative overflow-hidden">
              <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 block mb-1">
                    The Modern Standard
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522]">
                    built by Miguel
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#141522] text-white">
                  Direct Founder
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Custom-built React website</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Care plans starting at $99 per month</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Direct access to the person building your site</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Real work you can see and ask about directly</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>One connected system, built by one person</span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#141522] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Response within 24 business hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FAQ                                                            */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-200/80 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#141522] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Component (Centered, Max Width ~750px) */}
          <div className="max-w-[760px] mx-auto space-y-3.5">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-amber-50/80 border border-amber-200/90 p-5 sm:p-6 shadow-sm'
                      : 'bg-white border border-slate-200 hover:border-slate-300 p-5 shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                  >
                    <h3 className="font-bold font-display text-sm sm:text-base text-[#141522] pr-2">
                      {faq.question}
                    </h3>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-300 shrink-0 text-[#141522]">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed pt-3 border-t border-amber-200/60 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: CLOSING CTA                                                    */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 border-t border-slate-200 bg-[#141522] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow kicker (not a heading) */}
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full inline-block">
              Ready When You Are
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Get a Digital Marketing System Built by One Founder, Not an Agency
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stop splitting your SEO, website, and lead follow-up across three vendors who don't talk to each other. Start with a free 5-minute audit and see exactly what's costing you leads right now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold text-[#141522] bg-[#F59E0B] hover:bg-[#D97706] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Get Your Free Audit</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold text-white bg-transparent border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Contact Me</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
