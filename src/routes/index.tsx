import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Search,
  Globe,
  Cpu,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  ArrowDownRight,
  Send,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'
import { FreeAuditCTA } from '../components/FreeAuditCTA'

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
          'built by Miguel is a digital marketing agency for small business and trade contractors. We deliver custom web development, Google Maps rankings, and small business automation.',
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
          'built by Miguel is a digital marketing agency for small business and trade contractors. We deliver custom web development, Google Maps rankings, and small business automation.',
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
          'built by Miguel is a digital marketing agency for small business and trade contractors. We deliver custom web development, Google Maps rankings, and small business automation.',
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
        children: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do you work with small businesses and contractors?","acceptedAnswer":{"@type":"Answer","text":"Yes. We partner directly with trade contractors, home service companies, and local businesses across the United States. You work directly with senior engineers and search strategists, never an outsourced account rep."}},{"@type":"Question","name":"What does ongoing support and site care include?","acceptedAnswer":{"@type":"Answer","text":"Every partner receives continuous Core Web Vitals monitoring, automated security scanning, monthly search optimization, and dedicated site updates. Your site stays fast, secure, and fresh without taking your time."}},{"@type":"Question","name":"How long does a custom website build and SEO sprint take?","acceptedAnswer":{"@type":"Answer","text":"Most custom web development projects and initial technical SEO optimizations launch within two to three weeks. Because code is written cleanly without template bloat, delivery is fast and reliable."}},{"@type":"Question","name":"How does collaboration and reporting work?","acceptedAnswer":{"@type":"Answer","text":"Partners receive clear video updates, direct phone access, and live metric tracking. We also offer in-person strategy sessions for clients in the Austin area."}}]}),
      },
    ],
  }),
  component: HomePage,
})

const FAQ_ITEMS = [
  {
    question: 'Do you work with small businesses and contractors?',
    answer:
      'Yes. We partner directly with trade contractors, home service companies, and local businesses across the United States. You work directly with senior engineers and search strategists, never an outsourced account rep.',
  },
  {
    question: 'What does ongoing support and site care include?',
    answer:
      'Every partner receives continuous Core Web Vitals monitoring, automated security scanning, monthly search optimization, and dedicated site updates. Your site stays fast, secure, and fresh without taking your time.',
  },
  {
    question: 'How long does a custom website build and SEO sprint take?',
    answer:
      'Most custom web development projects and initial technical SEO optimizations launch within two to three weeks. Because code is written cleanly without template bloat, delivery is fast and reliable.',
  },
  {
    question: 'How does collaboration and reporting work?',
    answer:
      'Partners receive clear video updates, direct phone access, and live metric tracking. We also offer in-person strategy sessions for clients in the Austin area.',
  },
]

function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(1) // Default 2nd item open matching reference

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF8F5] text-[#141522] selection:bg-[#141522] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        {/* Soft atmospheric gradient wash in upper corners */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-rose-100/50 via-pink-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-amber-100/40 via-orange-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Large Headline */}
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#141522] font-display leading-[1.08]">
              Digital Marketing Agency <br className="hidden sm:block" />
              for Small Business
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
              built by Miguel is a full-stack digital marketing agency for small business and trade contractors. We engineer custom web development, top 3 Google Maps rankings, and small business automation to drive exclusive booked jobs.
            </p>
          </div>

          {/* Central Hero Illustration: Megaphone Graphic with Orbiting Accents */}
          <div className="relative flex items-center justify-center my-8 sm:my-12 py-4">
            {/* Main Central Circle */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[#FF80BF]/20 flex items-center justify-center">
              {/* Outer circular gradient glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#FF94C8] to-[#FF6BAE] opacity-90 shadow-2xl shadow-pink-300/40" />

              {/* Megaphone SVG Illustration */}
              <svg
                className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 -rotate-12 drop-shadow-xl"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Megaphone Body */}
                <path
                  d="M70 120L135 155C140 157.5 146 153.5 146 148V52C146 46.5 140 42.5 135 45L70 80H40C34.5 80 30 84.5 30 90V110C30 115.5 34.5 120 40 120H70Z"
                  fill="#FFFFFF"
                  stroke="#141522"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                {/* Megaphone Accent Ring */}
                <ellipse
                  cx="146"
                  cy="100"
                  rx="10"
                  ry="48"
                  fill="#141522"
                />
                {/* Speaker Center Cone */}
                <ellipse
                  cx="146"
                  cy="100"
                  rx="4"
                  ry="24"
                  fill="#FFFFFF"
                />
                {/* Megaphone Base / Handle */}
                <path
                  d="M55 120V150C55 153.5 58 156 61.5 155L75 148V120"
                  fill="#141522"
                  stroke="#141522"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Sound Line */}
                <path
                  d="M48 80V120"
                  stroke="#FF80BF"
                  strokeWidth="5"
                />
              </svg>

              {/* Orbiting Icon 1: Top Left Starburst */}
              <div className="absolute -top-4 -left-4 sm:top-2 sm:left-4 z-20">
                <svg className="w-12 h-12 text-[#141522]" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 0L24 14L38 10L28 22L40 30L26 30L20 40L14 30L0 30L12 22L2 10L16 14L20 0Z"
                    stroke="#141522"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Orbiting Icon 2: Orbit dot */}
              <div className="absolute top-6 right-16 w-3 h-3 rounded-full border-2 border-[#141522]" />

              {/* Orbiting Icon 3: LinkedIn badge */}
              <div className="absolute top-4 -right-4 sm:top-12 sm:-right-6 z-20 flex items-center justify-center font-bold text-sm sm:text-base text-[#141522]">
                <span className="font-sans font-extrabold text-xl sm:text-2xl tracking-tighter">in</span>
              </div>

              {/* Orbiting Icon 4: Dribbble/Globe pink circle */}
              <div className="absolute top-24 -right-8 sm:top-28 sm:-right-12 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FF80BF] border-2 border-[#141522] flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-[#141522]" />
              </div>

              {/* Orbiting Icon 5: Facebook badge */}
              <div className="absolute bottom-12 -right-4 sm:bottom-16 sm:-right-6 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#141522] text-white flex items-center justify-center font-serif font-bold text-base shadow-md">
                f
              </div>

              {/* Orbiting Icon 6: Small black circle bottom left */}
              <div className="absolute bottom-6 -left-4 sm:bottom-10 sm:-left-6 w-5 h-5 rounded-full bg-[#141522]" />
              <div className="absolute bottom-16 -left-8 sm:bottom-20 sm:-left-12 w-3 h-3 rounded-full border border-[#141522]" />
            </div>
          </div>

          {/* Bottom Row: Subtext on Left, EXPLORE ↘ on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-slate-200/60 mt-8">
            <div className="max-w-md">
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                As a premier digital marketing agency for small business and trade contractors, built by Miguel delivers high-performance custom web development, top 3 Google Maps rankings, and small business automation to turn local searches into exclusive booked jobs.
              </p>
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold tracking-wider text-[#141522] hover:text-rose-600 transition-colors uppercase cursor-pointer"
            >
              <span>Explore services</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR SERVICES (2-Column Split: Text on Left, 2x2 Bento on Right)        */}
      {/* ========================================================================= */}
      <section id="services" className="w-full py-16 sm:py-24 lg:py-28 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Heading, Paragraph, Learn More Button */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold font-display text-[#141522] tracking-tight">
                Engineered for small business growth
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                We replace fragmented marketing with an integrated growth engine. Fast custom web development, proven search rankings, and small business automation that converts clicks into revenue.
              </p>
              <div className="pt-2">
                <Link
                  to="/seo"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all active:scale-95 shadow-sm"
                >
                  <span>Learn more</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 2x2 Bento Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Top Left (Social Ads / SEO Services) */}
              <Link
                to="/seo"
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-[#141522] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522] group-hover:text-rose-600 transition-colors">
                    Local SEO & Google Maps
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    Dominate the local 3-Pack where high-intent customers search. We optimize your Google Business Profile to generate exclusive incoming calls.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1 text-xs font-mono font-bold text-[#141522]">
                  <span>Explore rankings</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 2: Top Right (SaaS Marketing / Custom Websites) */}
              <Link
                to="/websites"
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-[#141522] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522] group-hover:text-rose-600 transition-colors">
                    Custom Web Development
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    Sub-second load speeds built on clean modern code. Zero WordPress bloat, instant mobile tap-to-call, and designs engineered to convert visitors.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1 text-xs font-mono font-bold text-[#141522]">
                  <span>Explore sites</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 3: Bottom Left - DISTINCTIVE INVERTED DARK CARD */}
              <Link
                to="/systems-auto"
                className="p-6 sm:p-7 rounded-3xl bg-[#141522] text-white border border-[#141522] shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group min-h-[220px]"
              >
                {/* Vector Graphic in Top Right of Dark Card */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                    {/* Stylized pencil / automation icon */}
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19l7-7 3 3-7 7-3-3z" />
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    </svg>
                  </div>

                  {/* Soft Pink Graphic Lines */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="w-10 h-3.5 rounded-full bg-[#FF80BF]" />
                    <div className="w-14 h-3.5 rounded-full bg-[#FF80BF]" />
                  </div>
                </div>

                <div className="space-y-2 relative z-10 pt-6">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Small Business Automation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Never lose a lead to slow response times. Automated SMS alerts route website inquiries straight to technician phones in under 30 seconds.
                  </p>
                </div>

                {/* Cursor arrow accent */}
                <div className="absolute bottom-4 right-4 text-white/70 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </div>
              </Link>

              {/* Card 4: Bottom Right (SEO Works) */}
              <Link
                to="/seo"
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-[#141522] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522] group-hover:text-rose-600 transition-colors">
                    National SEO & AI Search
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    Position your brand as the verified authority across Google, ChatGPT, and AI Overviews with structured schema and technical content.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1 text-xs font-mono font-bold text-[#141522]">
                  <span>Explore national</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TESTIMONIALS SECTION (Two Side-by-Side Clean Quotes)                   */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 lg:py-24 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Testimonial 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-3xl font-serif font-bold text-[#FF80BF] select-none block">
                  ““
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522] leading-snug">
                  Tripled our inbound call volume and scaled from 10 to 26 technicians.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  Built by Miguel completely transformed our search presence and website speed. Within 90 days, our business was locked in the top 3 Google Maps spots across our service area. Inbound calls tripled without paying for shared leads.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                  PL
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#141522] font-display">
                    Philip Lane
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-sans">
                    Business owner
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-3xl font-serif font-bold text-amber-400 select-none block">
                  ““
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#141522] leading-snug">
                  Sub-second site speed and instant lead dispatch changed our business.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  Our previous agency site took five seconds to load on phones. The custom web development and automated text dispatch delivered a 40% conversion lift in month one. The team operates with real engineering discipline.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                  KW
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#141522] font-display">
                    Kristin Watson
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-sans">
                    General Manager
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FAQ SECTION (Split Layout with Peach Accordion Highlight)               */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 lg:py-28 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Heading, Subtext, Ask button */}
            <div className="lg:col-span-4 space-y-5">
              <h2 className="text-4xl sm:text-5xl font-bold font-display text-[#141522] tracking-tight">
                FAQ
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                Can't find the answer you're looking for? Ask your question and get an answer within 24 hours.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all active:scale-95 shadow-sm"
                >
                  <span>Ask a question</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Pill Accordion Rows with Warm Peach Active Container */}
            <div className="lg:col-span-8 space-y-3.5">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div
                    key={faq.question}
                    className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-[#FEE4D2] border border-[#FDCBB0] p-6 shadow-sm'
                        : 'bg-white border border-slate-300 hover:border-slate-400 p-5 shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold font-display text-sm sm:text-base text-[#141522]">
                        {faq.question}
                      </span>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/70 border border-slate-300 shrink-0 text-[#141522]">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-[#141522]/85 font-sans leading-relaxed pt-2 border-t border-[#FDCBB0]/60">
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
      {/* 6. DESIGNATED FREE AUDIT CTA SECTION                                      */}
      {/* ========================================================================= */}
      <FreeAuditCTA variant="default" />
    </div>
  )
}
