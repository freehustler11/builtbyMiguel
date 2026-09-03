import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck,
  Video,
  Send,
} from 'lucide-react'

export const Route = createFileRoute('/thank-you')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Thank You | Audit Request Received | Built by Miguel',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Audit Request Confirmed | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Your local search and speed audit has been queued for review by Miguel.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/thank-you' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/thank-you',
      },
    ],
  }),
  component: ThankYouPage,
})

function ThankYouPage() {
  return (
    <div className="py-12 sm:py-20 max-w-3xl mx-auto space-y-10 text-center">
      {/* Confirmation Capsule */}
      <div className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-14 space-y-8 shadow-xl dark:shadow-none relative overflow-hidden">
        {/* Animated Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-16 w-80 h-80 rounded-full bg-rose-100/50 dark:bg-rose-900/20 blur-3xl pointer-events-none" />

        {/* Big Success Icon */}
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-3.5 h-3.5" /> Request Confirmed & Queued
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            I’m On It.{' '}
            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Audit in Progress.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Thank you for reaching out. I personally record every audit video and will send your private link within 24 business hours.
          </p>
        </div>

        {/* 3-Step Timeline Box */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            What Happens Next:
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 mt-0.5 shadow-sm">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">1. Data Extraction & Benchmarking</strong>
                I pull live Google Map Pack geo-grid heatmaps and run mobile Core Web Vitals speed tests.
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 mt-0.5 shadow-sm">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">2. 5-Minute Video Recording</strong>
                I record a personalized Loom video walking through your ranking leaks and competitor gaps.
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 mt-0.5 shadow-sm">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">3. Private Delivery to Your Inbox</strong>
                You'll receive an email with the video link and actionable next steps in &lt; 24 hours.
              </div>
            </div>
          </div>
        </div>

        {/* Turnaround Badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>Expected Delivery: Within 24 Business Hours</span>
        </div>

        {/* CTA Back to Work */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <span>Explore In-House Systems</span>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white" />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
