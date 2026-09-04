import { createFileRoute, redirect, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Printer,
  ArrowLeft,
  Calendar,
  Building2,
  PhoneCall,
  Navigation,
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  Layers,
  CheckCircle2,
  ListChecks,
  ListOrdered,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  FileText,
  Clock,
} from 'lucide-react'
import { checkAuthServerFn } from '../../../lib/auth'
import { getReportByIdServerFn } from '../../../server/reports'

export const Route = createFileRoute('/admin/reports/$id')({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  loader: async ({ params }) => {
    return await getReportByIdServerFn({ data: { id: params.id } })
  },
  head: ({ loaderData }) => {
    const title = loaderData?.report?.title || 'Performance Report'
    const clientName = loaderData?.client?.businessName || 'Client'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${title} | ${clientName} | built by Miguel` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: BrandedReportViewPage,
})

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function parseBulletLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^[•●○▪\-\*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

function BrandedReportViewPage() {
  const { report, client } = Route.useLoaderData()

  const primaryColor = client.primaryColor || '#2563eb'
  const secondaryColor = client.secondaryColor || '#1e293b'

  const completedBullets = parseBulletLines(report.workCompleted)
  const nextStepBullets = parseBulletLines(report.nextSteps)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] print:bg-white text-slate-900 dark:text-white print:text-black">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP ACTION BAR (Hidden in Print)                                */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c111d]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back link */}
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Reports</span>
          </Link>

          {/* Right Action: Print / Save as PDF */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/clients"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{client.businessName}</span>
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT-READY DOCUMENT CONTAINER                                         */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8 print:p-0 my-0 sm:my-6 print:my-0">
        <div className="bg-white print:bg-white text-slate-900 rounded-3xl print:rounded-none shadow-xl print:shadow-none border border-slate-200/80 print:border-none p-6 sm:p-10 lg:p-12 space-y-8 print:space-y-6">
          
          {/* Top Brand Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-100 print:border-slate-300">
            {/* Left: Client Logo & Business Identity */}
            <div className="flex items-center gap-4">
              {client.logoUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-200 bg-white p-2 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={client.logoUrl}
                    alt={client.businessName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {client.businessName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-white shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Client Growth Audit
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {client.businessName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Contact: {client.name}</span>
                  {client.websiteUrl && (
                    <>
                      <span>•</span>
                      <a
                        href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-slate-600 print:text-black font-semibold"
                      >
                        {client.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Agency Co-Branding & Report Period */}
            <div className="sm:text-right space-y-1.5 shrink-0 bg-slate-50 print:bg-slate-100 p-4 rounded-2xl border border-slate-100">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600">
                <ShieldCheck className="w-4 h-4" />
                <span>built by Miguel</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {report.reportMonth}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Generated: {formatDate(report.createdAt)}
              </div>
            </div>
          </div>

          {/* Report Document Title Banner */}
          <div
            className="p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ backgroundColor: secondaryColor }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold block mb-1">
                Monthly Performance & SEO Brief
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {report.title}
              </h2>
            </div>

            <div
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-center shrink-0 border border-white/20"
              style={{ backgroundColor: primaryColor }}
            >
              Reporting Period: {report.reportMonth}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. GROUPED METRICS CARDS (with break-inside: avoid)                   */}
          {/* ===================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span>Key Performance Indicators</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:grid-cols-3">
              {/* Card 1: Google Business Profile (GBP) */}
              <div className="rounded-2xl border-2 border-blue-100 p-5 space-y-4 bg-blue-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-100 print:border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                    <span>Google Business Profile</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Local GBP
                  </span>
                </div>

                <div className="space-y-3 font-mono">
                  {/* Calls */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phone Calls</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gbpCalls || 0}
                    </span>
                  </div>

                  {/* Directions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Direction Requests</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gbpDirections || 0}
                    </span>
                  </div>

                  {/* Profile Views */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Profile Views</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gbpViews || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Google Search Console (GSC) */}
              <div className="rounded-2xl border-2 border-emerald-100 p-5 space-y-4 bg-emerald-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 print:border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <MousePointerClick className="w-4 h-4 text-emerald-600" />
                    <span>Search Console (GSC)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Organic
                  </span>
                </div>

                <div className="space-y-3 font-mono">
                  {/* Clicks */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Total Clicks</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gscClicks || 0}
                    </span>
                  </div>

                  {/* Impressions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Impressions</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gscImpressions?.toLocaleString() || 0}
                    </span>
                  </div>

                  {/* Avg Position */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Avg. Position</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gscPosition ? report.gscPosition.toFixed(1) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Google Analytics 4 (GA4) */}
              <div className="rounded-2xl border-2 border-indigo-100 p-5 space-y-4 bg-indigo-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-indigo-100 print:border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Google Analytics (GA4)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Traffic
                  </span>
                </div>

                <div className="space-y-3 font-mono">
                  {/* Users */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Active Users</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gaUsers || 0}
                    </span>
                  </div>

                  {/* Sessions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Total Sessions</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gaSessions || 0}
                    </span>
                  </div>

                  {/* Pageviews */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Pageviews</span>
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {report.gaViews?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. EXECUTIVE SUMMARY                                                  */}
          {/* ===================================================================== */}
          {report.summary && (
            <div className="p-6 rounded-2xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300 space-y-2 print:break-inside-avoid">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Executive Summary</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {report.summary}
              </p>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 5. WORK COMPLETED & NEXT STEPS (Two Columns)                          */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {/* Work Completed */}
            <div className="p-6 rounded-2xl border border-slate-200 print:border-slate-300 space-y-4 print:break-inside-avoid bg-white">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 pb-2 border-b border-slate-100">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                <span>Work Completed This Month</span>
              </div>

              {completedBullets.length > 0 ? (
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {completedBullets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: primaryColor }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific action items listed.</p>
              )}
            </div>

            {/* Next Steps */}
            <div className="p-6 rounded-2xl border border-slate-200 print:border-slate-300 space-y-4 print:break-inside-avoid bg-white">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 pb-2 border-b border-slate-100">
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                <span>Next Steps & Strategic Priorities</span>
              </div>

              {nextStepBullets.length > 0 ? (
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {nextStepBullets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full text-[10px] font-mono font-bold text-white flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No future strategic targets listed.</p>
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 6. DOCUMENT FOOTER (Clean Agency Signature)                           */}
          {/* ===================================================================== */}
          <div className="pt-6 border-t border-slate-200 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 print:break-inside-avoid">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 print:text-black">built by Miguel</span>
              <span>•</span>
              <span>High-Performance Local SEO & Web Engineering</span>
            </div>
            <div>
              <span>Questions regarding this report? Contact miguel@builtbymiguel.net</span>
            </div>
          </div>

        </div>
      </div>

      {/* Global CSS for Print Size, Margin, and Color Reproduction */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.5in;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  )
}
