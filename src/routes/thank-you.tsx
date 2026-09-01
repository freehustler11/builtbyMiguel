import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, ArrowRight, Sparkles, Clock, Mail } from 'lucide-react'

export const Route = createFileRoute('/thank-you')({
  component: ThankYouPage,
})

function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 sm:py-20 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-2xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> Request Confirmed
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Audit Request Received!
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          I’m currently reviewing your local market, search presence, and website performance. Your personalized 5-minute video breakdown will be delivered to your inbox within <span className="text-emerald-400 font-semibold">24 hours</span>.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-left space-y-4">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          What Happens Next?
        </div>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
          <li className="flex items-start gap-2.5">
            <span className="font-mono text-emerald-400 font-bold">01.</span>
            <span>I inspect your Google Map Pack ranking across your primary service cities.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-mono text-emerald-400 font-bold">02.</span>
            <span>I test your mobile site speed, Core Web Vitals, and competitor conversion gaps.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-mono text-emerald-400 font-bold">03.</span>
            <span>You receive a recorded walkthrough with actionable steps to dominate your local market.</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-all"
        >
          <span>View Case Studies</span>
        </Link>
      </div>
    </div>
  )
}
