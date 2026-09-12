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
              name: 'Do you work with a small business?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. I work directly with small trade businesses, contractors, and local service companies across the United States. You work with me directly, never an account manager.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer ongoing support?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Not only do I offer the expected maintenance and security, but I also provide continuous search optimization and monthly site updates. I handle everything after launch.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long does the project take on average?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most custom website builds and initial SEO optimizations take two to three weeks from kickoff to launch.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is there a possibility of offline meetings?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'I meet in person with clients in the local Austin area. For national clients, we collaborate smoothly via fast video reviews and direct phone calls.',
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
    question: 'Do you work with a small business?',
    answer:
      'Yes. I work directly with small trade businesses, contractors, and local service companies across the United States. You work with me directly, never an account manager.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      'Not only do I offer the expected maintenance and security, but I also provide continuous search optimization and monthly site updates. Your site stays fast, secure, and fresh without taking your time.',
  },
  {
    question: 'How long does the project take on average?',
    answer:
      'Most custom website builds and initial SEO optimizations take two to three weeks from kickoff to launch. I write the code directly so there is no agency bureaucracy.',
  },
  {
    question: 'Is there a possibility of offline meetings?',
    answer:
      'I meet in person with clients in the local Austin area. For national clients, we collaborate smoothly via fast personal video audits and direct phone calls.',
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
              The loud voice <br className="hidden sm:block" />
              of your brand
            </h1>
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
            <div className="max-w-sm">
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                I build fast custom websites, rank trade businesses in the top 3 on Google Maps, and automate lead dispatch.
              </p>
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold tracking-wider text-[#141522] hover:text-rose-600 transition-colors uppercase"
            >
              <span>Explore</span>
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
                Our services
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                We focus on the data that is really important for making each of our decisions, constantly testing, configuring and optimizing processes.
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
                    Local SEO & GBP
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    We create authentic local visibility that delivers true call value to your business.
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
                    Custom Websites
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    Experts work with your trade to find potential customers and load under a second.
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
                    Business Automation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Our lead dispatch experts will create an instant SMS pipeline.
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
                    National & AEO
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    Our SEO works - we know how to drive qualified search and AI traffic.
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
                  Their experience helped us to develop the business as a whole
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  The team has played an important role in providing us with forward-thinking marketing support that influences growth. When I turned to Miguel, I had 10 employees and few leads. Now I have 26 employees in my team and the number of sales has increased 3 times.
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
                  The Miguel team is fast, savvy, and truly ahead of the curve
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  The growth squad model helped us stay agile yet laser-focused on achieving key metrics and growth objectives. Miguel is quick and consistent in delivering top and bottom-funnel growth.
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
      {/* 5. BLOG SECTION (2 Large Feature Cards with Pastel Vector Banners)        */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 lg:py-28 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold font-display text-[#141522] tracking-tight">
                Blog
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-sm text-left sm:text-right">
              In our blog you can read articles written by experts in the field of marketing and business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Blog Card 1: Clean Up Email Strategy */}
            <Link
              to="/blog/$slug"
              params={{ slug: 'what-local-seo-actually-means-for-a-home-service-business-2026' }}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div>
                {/* Pastel Peach/Pink Illustration Header */}
                <div className="h-48 sm:h-56 bg-[#FEE4D2] p-6 relative overflow-hidden flex items-center justify-center border-b border-[#FDCBB0]/50">
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#141522] text-white">
                      Local SEO
                    </span>
                  </div>

                  {/* Vector Art: Envelope / geometric lines */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#FF80BF] opacity-80" />
                    <div className="absolute w-20 h-14 rounded-xl bg-white border-2 border-[#141522] shadow-sm flex items-center justify-center rotate-3">
                      <Send className="w-6 h-6 text-[#141522]" />
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-2.5">
                  <h3 className="font-bold font-display text-lg sm:text-xl text-[#141522] group-hover:text-rose-600 transition-colors leading-snug">
                    Clean up your Local SEO strategy for better customer calls
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">
                    Local search remains one of the most powerful tools for businesses to connect with their audience and drive conversions.
                  </p>
                </div>
              </div>
            </Link>

            {/* Blog Card 2: Search Engine Site Promotion */}
            <Link
              to="/blog/$slug"
              params={{ slug: 'core-web-vitals-explained-for-business-owners-no-jargon' }}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div>
                {/* Pastel Pink Illustration Header */}
                <div className="h-48 sm:h-56 bg-[#FFCCE5] p-6 relative overflow-hidden flex items-center justify-center border-b border-pink-200">
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#141522] text-white">
                      Speed & Web
                    </span>
                  </div>

                  {/* Vector Art: Browser Window with www. */}
                  <div className="relative w-44 h-28 rounded-xl bg-white border-2 border-[#141522] shadow-sm p-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex items-center justify-center py-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 font-mono text-[11px] font-bold text-[#141522]">
                        www.
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-slate-100" />
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-2.5">
                  <h3 className="font-bold font-display text-lg sm:text-xl text-[#141522] group-hover:text-rose-600 transition-colors leading-snug">
                    Search engine site promotion or contextual advertising. What to choose?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">
                    SEO and contextual advertising are two internet marketing tools that are used to attract visitors to the site. But which one is better?
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Centered Button: More Articles */}
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#141522] hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <span>More articles</span>
            </Link>
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
