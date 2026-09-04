import React from 'react'
import {
  PhoneCall,
  Navigation,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Users,
  Layers,
  CheckCircle2,
  ListChecks,
  ListOrdered,
  ShieldCheck,
  Building2,
  Star,
  Search,
  FileSpreadsheet,
  Globe,
  Award,
} from 'lucide-react'
import type { Report, Client } from '../db/schema'

interface ReportDocumentProps {
  report: Report
  client: Client
}

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

/**
 * Calculate MoM % difference for volume metrics
 */
function getMoMVolumeChange(current: number | null | undefined, previous: number | null | undefined) {
  const curr = Number(current) || 0
  const prev = Number(previous) || 0

  if (!prev) {
    if (curr > 0) return { label: 'New', isPositive: true, isNeutral: false }
    return null
  }

  const diff = ((curr - prev) / prev) * 100
  const rounded = Math.abs(diff) < 1 ? diff.toFixed(1) : Math.round(diff)

  if (diff > 0) {
    return { label: `+${rounded}%`, isPositive: true, isNeutral: false }
  } else if (diff < 0) {
    return { label: `${rounded}%`, isPositive: false, isNeutral: false }
  } else {
    return { label: `0%`, isPositive: false, isNeutral: true }
  }
}

/**
 * Calculate MoM change for SEO position (lower number = better rank)
 */
function getMoMPositionChange(current: number | null | undefined, previous: number | null | undefined) {
  const curr = Number(current) || 0
  const prev = Number(previous) || 0

  if (!prev || !curr) return null

  // In SEO rankings: if prev was 14.2 and curr is 11.5, difference is +2.7 positions gained (improved)
  const diff = prev - curr
  const formatted = Math.abs(diff).toFixed(1)

  if (diff > 0.05) {
    return { label: `+${formatted} pos`, isPositive: true, isNeutral: false }
  } else if (diff < -0.05) {
    return { label: `-${formatted} pos`, isPositive: false, isNeutral: false }
  } else {
    return { label: `0.0`, isPositive: false, isNeutral: true }
  }
}

export function ReportDocument({ report, client }: ReportDocumentProps) {
  const primaryColor = client.primaryColor || '#2563eb'
  const secondaryColor = client.secondaryColor || '#1e293b'
  const isWhiteLabel = Boolean(client.isWhiteLabel)

  const completedBullets = parseBulletLines(report.workCompleted)
  const nextStepBullets = parseBulletLines(report.nextSteps)

  const topQueries = Array.isArray(report.topQueries) ? report.topQueries : []
  const topPages = Array.isArray(report.topPages) ? report.topPages : []

  // Metric changes
  const gbpCallsMoM = getMoMVolumeChange(report.gbpCalls, report.prevGbpCalls)
  const gbpDirectionsMoM = getMoMVolumeChange(report.gbpDirections, report.prevGbpDirections)
  const gbpViewsMoM = getMoMVolumeChange(report.gbpViews, report.prevGbpViews)

  const gscClicksMoM = getMoMVolumeChange(report.gscClicks, report.prevGscClicks)
  const gscImpressionsMoM = getMoMVolumeChange(report.gscImpressions, report.prevGscImpressions)
  const gscPositionMoM = getMoMPositionChange(report.gscPosition, report.prevGscPosition)

  const gaUsersMoM = getMoMVolumeChange(report.gaUsers, report.prevGaUsers)
  const gaSessionsMoM = getMoMVolumeChange(report.gaSessions, report.prevGaSessions)
  const gaViewsMoM = getMoMVolumeChange(report.gaViews, report.prevGaViews)

  return (
    <div className="report-root max-w-5xl mx-auto text-slate-900 bg-white shadow-xl print:shadow-none rounded-3xl print:rounded-none border border-slate-200/80 print:border-none p-6 sm:p-10 lg:p-12 print:p-0">
      {/* ========================================================================= */}
      {/* PAGE 1: HEADER, EXECUTIVE SUMMARY, AND CORE GROUPED KPIS                   */}
      {/* ========================================================================= */}
      <section className="print-page-1 flex flex-col justify-between min-h-[960px] print:min-h-0 space-y-6 print:space-y-5">
        <div className="space-y-6 print:space-y-5">
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
                  Performance Audit
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

            {/* Right: Co-Branding / White-Label Partner & Period */}
            <div className="sm:text-right space-y-1.5 shrink-0 bg-slate-50 print:bg-slate-100 p-4 rounded-2xl border border-slate-100">
              {isWhiteLabel ? (
                client.partnerLogoUrl ? (
                  <div className="flex items-center sm:justify-end gap-2">
                    <img
                      src={client.partnerLogoUrl}
                      alt={client.partnerName || 'Partner'}
                      className="h-5 max-w-[140px] object-contain"
                    />
                  </div>
                ) : client.partnerName ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{client.partnerName}</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Growth Analytics
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>built by Miguel</span>
                </div>
              )}

              <div className="text-sm font-extrabold text-slate-900">
                {report.reportMonth}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Reported: {formatDate(report.createdAt)}
              </div>
            </div>
          </div>

          {/* Report Document Title Banner */}
          <div
            className="p-5 sm:p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
              Period: {report.reportMonth}
            </div>
          </div>

          {/* Executive Summary */}
          {report.summary && (
            <div className="p-5 rounded-2xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300 space-y-2 print:break-inside-avoid">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {report.summary}
              </p>
            </div>
          )}

          {/* Grouped Metrics KPIs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Key Performance Indicators (Month-Over-Month)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Pills indicate vs. prior month
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              {/* Card 1: Google Business Profile (GBP) */}
              <div className="rounded-2xl border-2 border-blue-100 p-4 space-y-3.5 bg-blue-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-100 print:border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Business Profile</span>
                  </div>
                  {report.gbpRating && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>{Number(report.gbpRating).toFixed(1)}</span>
                      {Boolean(report.gbpReviewCount) && (
                        <span className="text-amber-700">({report.gbpReviewCount})</span>
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 font-mono">
                  {/* Calls */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-blue-600" />
                      <span>Phone Calls</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpCalls || 0}
                      </span>
                      {renderMoMBadge(gbpCallsMoM)}
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <span>Direction Requests</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpDirections || 0}
                      </span>
                      {renderMoMBadge(gbpDirectionsMoM)}
                    </div>
                  </div>

                  {/* Profile Views */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span>Profile Views</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpViews || 0}
                      </span>
                      {renderMoMBadge(gbpViewsMoM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Google Search Console (GSC) */}
              <div className="rounded-2xl border-2 border-emerald-100 p-4 space-y-3.5 bg-emerald-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 print:border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Search Console (GSC)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Organic
                  </span>
                </div>

                <div className="space-y-2.5 font-mono">
                  {/* Clicks */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <MousePointerClick className="w-3 h-3 text-emerald-600" />
                      <span>Total Clicks</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscClicks || 0}
                      </span>
                      {renderMoMBadge(gscClicksMoM)}
                    </div>
                  </div>

                  {/* Impressions */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span>Impressions</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscImpressions?.toLocaleString() || 0}
                      </span>
                      {renderMoMBadge(gscImpressionsMoM)}
                    </div>
                  </div>

                  {/* Avg Position */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>Avg. Position</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscPosition ? Number(report.gscPosition).toFixed(1) : '—'}
                      </span>
                      {renderMoMBadge(gscPositionMoM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Google Analytics 4 (GA4) */}
              <div className="rounded-2xl border-2 border-indigo-100 p-4 space-y-3.5 bg-indigo-50/20 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-xs">
                <div className="flex items-center justify-between border-b border-indigo-100 print:border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Analytics (GA4)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Traffic
                  </span>
                </div>

                <div className="space-y-2.5 font-mono">
                  {/* Users */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Active Users</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaUsers || 0}
                      </span>
                      {renderMoMBadge(gaUsersMoM)}
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-indigo-600" />
                      <span>Total Sessions</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaSessions || 0}
                      </span>
                      {renderMoMBadge(gaSessionsMoM)}
                    </div>
                  </div>

                  {/* Pageviews */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-indigo-100 print:border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-indigo-600" />
                      <span>Pageviews</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaViews?.toLocaleString() || 0}
                      </span>
                      {renderMoMBadge(gaViewsMoM)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 1 Footer indicator for screen */}
        <div className="text-[10px] font-mono text-slate-400 text-right print:hidden pt-4">
          Page 1 of 2 • Core Performance Indicators
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE BREAK (Enforces clean 2-page print split)                            */}
      {/* ========================================================================= */}
      <div className="print-page-break my-8 print:my-0 border-t-2 border-dashed border-slate-200 print:border-none relative flex items-center justify-center">
        <span className="bg-white px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 print:hidden">
          Page Break (2-Page Print Layout)
        </span>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: DEEP METRIC TABLES, WORK COMPLETED, NEXT STEPS, AND FOOTER        */}
      {/* ========================================================================= */}
      <section className="print-page-2 flex flex-col justify-between min-h-[960px] print:min-h-0 space-y-6 print:space-y-5 print:pt-4">
        <div className="space-y-6 print:space-y-5">
          {/* Section Header for Page 2 */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Detailed Search Visibility & Strategic Roadmap
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {client.businessName} • {report.reportMonth}
            </span>
          </div>

          {/* Deep Metric Tables: 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2">
            {/* Table 1: Top 5 Search Queries */}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3 print:break-inside-avoid bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Top Search Queries (GSC)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Top 5</span>
              </div>

              {topQueries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase">
                        <th className="pb-1.5 font-bold">Query</th>
                        <th className="pb-1.5 font-bold text-right">Clicks</th>
                        <th className="pb-1.5 font-bold text-right">Impr.</th>
                        <th className="pb-1.5 font-bold text-right">Pos.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topQueries.slice(0, 5).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 pr-2 font-medium text-slate-800 truncate max-w-[150px]">
                            {item.query}
                          </td>
                          <td className="py-2 text-right font-bold text-emerald-700">
                            {item.clicks}
                          </td>
                          <td className="py-2 text-right text-slate-600">
                            {item.impressions?.toLocaleString()}
                          </td>
                          <td className="py-2 text-right text-slate-500">
                            {Number(item.position).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
                  No top query metrics recorded for this period.
                </div>
              )}
            </div>

            {/* Table 2: Top 5 High-Value Pages */}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3 print:break-inside-avoid bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-800">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Top Landing Pages</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Top 5</span>
              </div>

              {topPages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase">
                        <th className="pb-1.5 font-bold">Path / Page</th>
                        <th className="pb-1.5 font-bold text-right">Clicks</th>
                        <th className="pb-1.5 font-bold text-right">Users</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topPages.slice(0, 5).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 pr-2 font-medium text-slate-800 truncate max-w-[170px]">
                            {item.path}
                          </td>
                          <td className="py-2 text-right font-bold text-indigo-700">
                            {item.clicks}
                          </td>
                          <td className="py-2 text-right text-slate-600 font-semibold">
                            {item.users}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
                  No top page metrics recorded for this period.
                </div>
              )}
            </div>
          </div>

          {/* Work Completed & Next Steps: 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2">
            {/* Work Completed */}
            <div className="p-5 rounded-2xl border border-slate-200 print:border-slate-300 space-y-3.5 print:break-inside-avoid bg-white">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 pb-2 border-b border-slate-100">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                <span>Work Completed This Month</span>
              </div>

              {completedBullets.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {completedBullets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: primaryColor }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific deliverables logged.</p>
              )}
            </div>

            {/* Next Steps */}
            <div className="p-5 rounded-2xl border border-slate-200 print:border-slate-300 space-y-3.5 print:break-inside-avoid bg-white">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 pb-2 border-b border-slate-100">
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                <span>Next Steps & Strategic Priorities</span>
              </div>

              {nextStepBullets.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {nextStepBullets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
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
                <p className="text-xs text-slate-400 italic">No strategic targets logged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Document Footer (White-Label Conscious) */}
        <div className="pt-5 border-t border-slate-200 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 print:break-inside-avoid">
          {isWhiteLabel ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 print:text-black">
                  {client.partnerName || 'Confidential Performance Audit'}
                </span>
                <span>•</span>
                <span>Prepared exclusively for {client.businessName}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Confidential • Page 2 of 2
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 print:text-black">built by Miguel</span>
                <span>•</span>
                <span>High-Performance Local SEO & Web Systems</span>
              </div>
              <div>
                <span>Questions? Contact miguel@builtbymiguel.net</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Global Print Styling */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.4in;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
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

function renderMoMBadge(change: { label: string; isPositive: boolean; isNeutral: boolean } | null) {
  if (!change) return null

  if (change.isNeutral) {
    return (
      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
        {change.label}
      </span>
    )
  }

  if (change.isPositive) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <TrendingUp className="w-2.5 h-2.5" />
        <span>{change.label}</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80">
      <TrendingDown className="w-2.5 h-2.5" />
      <span>{change.label}</span>
    </span>
  )
}
