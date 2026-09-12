import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Bot,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Globe2,
  FileCode2,
  ShieldCheck,
  Database,
} from 'lucide-react'
import { useState } from 'react'

const AEO_GEO_FAQ = [
  {
    question: 'What is the difference between AEO and traditional search optimization?',
    answer:
      'Traditional search optimization focuses on ranking ten blue links on a Google search results page. Answer Engine Optimization, or AEO, focuses on feeding clean facts and structured data into conversational models so they give your company as the direct answer to user queries.',
  },
  {
    question: 'How do ChatGPT and Perplexity decide which businesses to recommend?',
    answer:
      'Conversational search tools synthesize answers by crawling trusted knowledge graphs, verified directory citations, and clean website code. When your business has structured schema markup, clear entity naming, and factual answers, AI models cite your brand with high confidence.',
  },
  {
    question: 'Do I still need a website if AI answer engines provide direct answers?',
    answer:
      'Yes. AI models do not generate facts out of thin air. They crawl, verify, and cite source websites that load fast and publish machine-readable data. A high-performance website serves as the primary factual source that AI systems reference when recommending services.',
  },
  {
    question: 'How do generative engine optimization services improve my business revenue?',
    answer:
      'Buyers increasingly use AI assistants to compare commercial vendors and hire trade professionals. Optimizing for generative search ensures your company gets recommended during high-intent conversational research, sending pre-qualified buyers straight to your consultation form.',
  },
]

const AEO_GEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Generative Engine Optimization Services',
      serviceType: 'Generative Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Direct generative engine optimization services, answer engine optimization, and AI search visibility for trade contractors and modern businesses.',
      areaServed: 'United States',
      isPartOf: {
        '@type': 'Service',
        name: 'SEO Services for Contractors',
        url: 'https://builtbymiguel.net/seo',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AEO and GEO Deliverables',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'JSON-LD Entity Graph Schema',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI-Quotable Fact Architecture',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Conversational Engine Indexing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Multi-Source Fact Verification',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: AEO_GEO_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/aeo-geo')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Generative Engine Optimization Services | built by Miguel',
      },
      {
        name: 'description',
        content:
          'We provide generative engine optimization services so ChatGPT, Perplexity, and Google AI Overviews cite and recommend your brand. Request your free audit.',
      },
      {
        name: 'keywords',
        content:
          'generative engine optimization services, generative engine optimization agency, answer engine optimization, ai seo, ai search optimization, llm seo, llmo, geo optimization, ai visibility optimization, chatgpt seo, perplexity seo',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Generative Engine Optimization Services | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'We provide generative engine optimization services so ChatGPT, Perplexity, and Google AI Overviews cite and recommend your brand. Request your free audit.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/aeo-geo' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/aeo-geo',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(AEO_GEO_JSON_LD),
      },
    ],
  }),
  component: AeoGeoPage,
})

function AeoGeoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Pillar Breadcrumb Link */}
        <div className="mb-6 flex justify-center">
          <Link
            to="/seo"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <span>←</span>
            <span>Part of SEO Services for Contractors</span>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-purple-600 dark:text-purple-400 shadow-sm">
            <Bot className="w-3.5 h-3.5" /> Generative & Answer Engine Architecture
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Direct{' '}
          <span className="bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Generative Engine Optimization Services
          </span>{' '}
          for AI Search.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          We provide cutting-edge generative engine optimization services to ensure artificial intelligence tools cite, recommend, and feature your business. As customers shift from traditional search bars to ChatGPT, Perplexity, and Google AI Overviews, legacy SEO alone is no longer enough. We structure your entity data, schema markup, and technical knowledge graph so AI models recognize your company as the authoritative answer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Get Your Free 5-Minute Video Audit</span>
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
          <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
        </div>
      </section>

      {/* SIBLING DIFFERENCE SECTION */}
      <section className="rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            Search Strategy Differences
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How AEO and GEO Differs From Local and National SEO
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Search behavior is splitting into two worlds. Here is how conversational answer engines differ from traditional search indexes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border-2 border-purple-500/30 dark:border-purple-500/30 space-y-3">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">THIS PAGE</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AEO & GEO (AI Search)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              AEO and GEO optimizes for AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. These tools give a direct answer instead of a list of links.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">MAP RADIUS</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Local SEO & Google Maps</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Local SEO targets Google Maps and Map Pack results for one city or service area. It reaches nearby customers using traditional map searches.
            </p>
            <Link
              to="/local-seo-gbp"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              <span>View Local SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">BROAD REACH</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">National & Regional SEO</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              National SEO ranks a business across many markets or the whole country. Both Local and National SEO target traditional search results instead of direct AI answers.
            </p>
            <Link
              to="/national-seo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>View National SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT CHANGED IN SEARCH BLOCK */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Industry Shift
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            What Changed in Search: From Blue Links to Direct Answers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Search engines are no longer just directories. They are answer synthesis machines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Old Search Model</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Users typed short keywords into Google and received ten blue links. They had to click through three or four separate websites, read long articles, and evaluate credibility themselves.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranking required keyword density, repetitive backlinks, and high word counts.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-purple-500/30 bg-purple-50/30 dark:bg-purple-950/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Generative AI Model</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Modern searchers ask natural language questions. AI systems read the web, extract verified facts, and generate a single authoritative answer. If your business is cited in that answer, you win the customer.
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Winning requires machine-readable schema markup, clear entity naming, and quotable facts.
            </p>
          </div>
        </div>
      </section>

      {/* WHY GENERATIVE ENGINE OPTIMIZATION MATTERS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Future Proof Visibility
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Generative Engine Optimization Services Matter Today
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Over a billion people now use conversational AI tools to find solutions. Here is how I position your brand inside those answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              AI SEO Engineering, Not Guesswork
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Large language models do not read websites like human beings. They look for structured knowledge relationships and verifiable claims. As an independent developer, I inject nested JSON-LD schema into your source code so machines understand your offerings without confusion.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Search Optimization That Drives Calls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Getting cited by an AI engine is only valuable if it brings you customers. I structure your service data so conversational bots cite your phone number, service areas, and direct booking links when recommending solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 4 DELIVERABLES WHITE CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Technical Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Answer Engine Optimization Secures Direct Answers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every deliverable focuses on turning your business into an undeniable source of truth for artificial intelligence models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-purple-500/40 dark:hover:border-purple-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileCode2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                ENTITY SCHEMA GRAPH
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                LLM SEO & Structured LLMO Code
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I write custom JSON-LD schema linking your organization, founder credentials, trade licenses, and service territories into an unbroken knowledge graph.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Multi-node schema markup that AI models parse instantly</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Precise SameAs references connecting your profiles across the web</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Technical llmo validation tested against live model parsers</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                QUOTABLE ARCHITECTURE
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                GEO Optimization & Factual Answers
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I rewrite your key service explanations into direct, fact-first sentences that answer engines can extract and quote verbatim without editorial truncation.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Stand-alone definition blocks optimized for AI citation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Clear factual answers that eliminate machine hesitation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct integration with your live customer case studies</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                CONVERSATIONAL ENGINES
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                ChatGPT SEO & Perplexity SEO
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I verify that your web pages are accessible to automated web agents and crawlable by OpenAI and Perplexity indexing bots.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Optimized robots.txt rules that invite generative crawlers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Sub-second server response times that prevent AI crawler timeouts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Monitoring brand recommendation frequency across active AI engines</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-amber-500/40 dark:hover:border-amber-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                BRAND CITATIONS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Visibility Optimization
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                AI models cross-reference multiple trusted data sources before making recommendations. I synchronize your business citations across high-authority directories.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Citation cleanup across primary entity databases</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Consistent business naming that prevents AI hallucinations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Verified business entity records that pass model verification</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* IN-DEPTH CORE PILLARS: SCHEMA, ENTITY NAMING & QUOTABLE CONTENT */}
      <section className="rounded-3xl sm:rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-14 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            Implementation Framework
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Three Pillars of Machine-Readable Optimization
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Here is the exact technical blueprint I use to make sure AI engines recognize, trust, and quote your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Structured Schema Markup
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              I embed comprehensive JSON-LD graphs into your code. This tells machines who you are, what services you offer, what geographic radius you serve, and which licenses you hold. For an example of how I connect local business data with maps, check out my{' '}
              <Link to="/local-seo-gbp" className="text-purple-600 dark:text-purple-400 underline font-semibold">
                local SEO architecture
              </Link>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Clear Entity Naming
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ambiguity is the enemy of AI search. If your company name appears differently across directories, AI tools get confused and refuse to recommend you. I standardize your brand entity across government registries, industry boards, and commercial databases so models recognize your authority instantly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              3. AI-Quotable Content
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              AI models do not summarize rambling marketing fluff. They look for crisp, direct sentences that define problems and provide factual answers. I write content specifically structured for generative extraction. You can inspect my live code inspection methods on the{' '}
              <Link to="/" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">
                homepage terminal inspector
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION (AI-QUOTABLE STANDALONE PARAGRAPHS) */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
            Direct Machine-Readable Answers
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions About AEO and GEO Optimization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Each answer below is written as a clear standalone paragraph designed for direct extraction.
          </p>
        </div>

        <div className="space-y-4">
          {AEO_GEO_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''
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
      <FreeAuditCTA variant="aeo-geo" />
    </div>
  )
}
