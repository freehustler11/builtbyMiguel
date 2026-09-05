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
  Star,
  Search,
  FileSpreadsheet,
  Globe,
  Award,
  Target,
  Activity,
  Zap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Compass,
  FileText,
  ExternalLink,
  Bookmark,
} from 'lucide-react'
import type { Report, Client, DeliverablesSnapshot } from '../db/schema'
import type { DisplayOptions, QueryItem, PageItem } from '../server/reports'

interface ReportDocumentProps {
  report: Report
  client?: Client | null
  displayOptions?: DisplayOptions
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

function parseDecimal(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  const cleaned = String(val).replace(/[^0-9.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

/**
 * Calculate MoM % difference for volume & rate metrics.
 * If previous month data does not exist (null/undefined/0), returns fallbackLabel ('Baseline' or 'New')
 * rather than raw 'N/A' or '+100%'.
 */
function getMoMChange(
  current: number | string | null | undefined,
  previous: number | string | null | undefined,
  options?: { fallbackLabel?: string }
): { label: string; isPositive: boolean; isNeutral: boolean } {
  const curr = parseDecimal(current)
  const prev = previous !== null && previous !== undefined && previous !== '' ? parseDecimal(previous) : null
  const fallback = options?.fallbackLabel || 'Baseline'

  // If previous value is null, undefined, or 0 (no prior month data)
  if (prev === null || isNaN(prev) || prev === 0) {
    return { label: fallback, isPositive: false, isNeutral: true }
  }

  // Safe division: prev is non-zero
  const diff = ((curr - prev) / prev) * 100
  if (isNaN(diff) || !isFinite(diff)) {
    return { label: fallback, isPositive: false, isNeutral: true }
  }

  const rounded = Math.abs(diff) < 1 ? diff.toFixed(1) : Math.round(diff)

  if (diff > 0) {
    return { label: `+${rounded}%`, isPositive: true, isNeutral: false }
  } else if (diff < 0) {
    return { label: `${rounded}%`, isPositive: false, isNeutral: false }
  } else {
    return { label: '0%', isPositive: false, isNeutral: true }
  }
}

/**
 * Calculate MoM change for SEO position (lower number = better rank)
 */
function getMoMPositionChange(
  current: number | string | null | undefined,
  previous: number | string | null | undefined
): { label: string; isPositive: boolean; isNeutral: boolean } | null {
  const curr = parseDecimal(current)
  const prev = previous !== null && previous !== undefined && previous !== '' ? parseDecimal(previous) : null

  if (prev === null || isNaN(prev) || prev === 0 || curr === 0) {
    if (curr > 0) {
      return { label: 'Baseline', isPositive: false, isNeutral: true }
    }
    return null
  }

  const diff = prev - curr
  if (isNaN(diff) || !isFinite(diff)) {
    return { label: 'Baseline', isPositive: false, isNeutral: true }
  }

  const formatted = Math.abs(diff).toFixed(1)

  if (diff > 0.05) {
    return { label: `+${formatted} pos`, isPositive: true, isNeutral: false }
  } else if (diff < -0.05) {
    return { label: `-${formatted} pos`, isPositive: false, isNeutral: false }
  } else {
    return { label: '0.0', isPositive: false, isNeutral: true }
  }
}

export function ReportDocument({ report, client, displayOptions: customDisplayOptions }: ReportDocumentProps) {
  const snapshot = report.clientSnapshot
  const businessName = snapshot?.businessName ?? client?.businessName ?? ''
  const logoUrl = snapshot?.logoUrl !== undefined ? snapshot.logoUrl : client?.logoUrl
  const primaryColor = snapshot?.primaryColor || client?.primaryColor || (client as any)?.primary_color || '#2563eb'
  const secondaryColor = snapshot?.secondaryColor || client?.secondaryColor || (client as any)?.secondary_color || '#1e293b'
  const isWhiteLabel = snapshot?.isWhiteLabel !== undefined ? Boolean(snapshot.isWhiteLabel) : Boolean(client?.isWhiteLabel)
  const partnerName = (snapshot?.partnerName !== undefined && snapshot?.partnerName !== null) ? snapshot.partnerName : client?.partnerName
  const partnerLogoUrl = (snapshot?.partnerLogoUrl !== undefined && snapshot?.partnerLogoUrl !== null) ? snapshot.partnerLogoUrl : client?.partnerLogoUrl
  const contactName = snapshot?.name ?? client?.name
  const websiteUrl = snapshot?.websiteUrl ?? client?.websiteUrl

  // Merge display options with explicit defaults
  const options: Required<DisplayOptions> = {
    show_agency_info: false,
    show_contact_person: true,
    show_date_generated: false,
    show_summary: true,
    show_tables: true,
    show_next_steps: true,
    ...(report.displayOptions || {}),
    ...(customDisplayOptions || {}),
  }

  const completedBullets = parseBulletLines(report.workCompleted)
  const nextStepBullets = parseBulletLines(report.nextSteps)

  const topQueries = (Array.isArray(report.topQueries) ? report.topQueries : []) as QueryItem[]
  const topPages = (Array.isArray(report.topPages) ? report.topPages : []) as PageItem[]

  // Deliverables Snapshot (from CRM wiring)
  const deliverables = (report.deliverablesSnapshot || null) as DeliverablesSnapshot | null
  const hasDeliverables = Boolean(
    deliverables &&
      ((deliverables.landingPages && deliverables.landingPages.length > 0) ||
        (deliverables.articles && deliverables.articles.length > 0) ||
        (deliverables.tasks && deliverables.tasks.length > 0) ||
        (deliverables.nextKeywords && deliverables.nextKeywords.length > 0))
  )

  // GBP Metrics & Comparisons
  const reviewsCount = report.gbpReviewsCount ?? report.gbpReviewCount ?? 0
  const prevReviewsCount = report.prevGbpReviewsCount ?? 0
  const gbpReviewsMoM = getMoMChange(reviewsCount, prevReviewsCount, { fallbackLabel: 'Baseline' })
  const gbpCallsMoM = getMoMChange(report.gbpCalls, report.prevGbpCalls)
  const gbpDirectionsMoM = getMoMChange(report.gbpDirections, report.prevGbpDirections)
  const websiteClicks = report.gbpWebsiteClicks ?? (report as any).gbpViews ?? 0
  const prevWebsiteClicks = report.prevGbpWebsiteClicks ?? (report as any).prevGbpViews ?? 0
  const gbpWebsiteClicksMoM = getMoMChange(websiteClicks, prevWebsiteClicks)
  const gbpViewsMoM = gbpWebsiteClicksMoM

  // GSC Metrics & Comparisons
  const gscCtrNum = parseDecimal(report.gscCtr)
  const prevGscCtrNum = parseDecimal(report.prevGscCtr)
  const gscClicksMoM = getMoMChange(report.gscClicks, report.prevGscClicks)
  const gscImpressionsMoM = getMoMChange(report.gscImpressions, report.prevGscImpressions)
  const gscCtrMoM = getMoMChange(gscCtrNum, prevGscCtrNum, { fallbackLabel: 'Baseline' })
  const gscPositionMoM = getMoMPositionChange(report.gscPosition, report.prevGscPosition)

  // GA4 Metrics & Comparisons
  const gaUsersMoM = getMoMChange(report.gaUsers, report.prevGaUsers)
  const gaNewUsersMoM = getMoMChange(report.gaNewUsers, report.prevGaNewUsers)
  const gaSessionsMoM = getMoMChange(report.gaSessions, report.prevGaSessions)
  const gaViewsMoM = getMoMChange(report.gaViews, report.prevGaViews)

  // Executive KPI summary calculations
  const customerActions = (report.gbpCalls || 0) + (report.gbpDirections || 0)
  const prevCustomerActions = (report.prevGbpCalls || 0) + (report.prevGbpDirections || 0)
  const customerActionsMoM = getMoMChange(customerActions, prevCustomerActions)

  return (
    <div
      className="report-root flex flex-col items-center gap-8 print:gap-0 print:block w-full overflow-x-auto print:overflow-visible"
      style={{
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* ========================================================================= */}
      {/* PAGE 1: EXECUTIVE DASHBOARD & PLATFORM PERFORMANCE                        */}
      {/* ========================================================================= */}
      <div
        className="report-page report-page-1 bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-shadow rounded-2xl print:rounded-none border border-slate-200/80 print:border-none flex flex-col justify-between"
        style={{
          width: '8.5in',
          height: '11in',
          maxHeight: '11in',
          minHeight: '11in',
          padding: '0.5in',
          boxSizing: 'border-box',
          overflow: 'hidden',
          breakAfter: 'page',
          pageBreakAfter: 'always',
        }}
      >
        <div className="flex-1 flex flex-col justify-start gap-8 sm:gap-9 print:gap-6">
          {/* Top Slim Executive Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-2 border-b border-slate-200/80 print:border-slate-300">
            {/* Left: Client Logo & Business Identity */}
            <div className="flex items-center gap-3.5 min-w-0">
              {logoUrl ? (
                <div className="h-11 w-auto max-w-[170px] flex items-center justify-start shrink-0">
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="h-full w-auto max-w-[170px] object-contain object-left"
                  />
                </div>
              ) : (
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-xs shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {businessName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                    {businessName}
                  </h1>
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-2xs shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {report.title && !report.title.includes(businessName)
                      ? report.title.toUpperCase()
                      : 'MONTHLY PERFORMANCE REPORT'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500 font-mono">
                  <span className="font-bold text-slate-800">Period: {report.reportMonth}</span>
                  {options.show_contact_person && contactName && (
                    <>
                      <span>•</span>
                      <span className="truncate">Contact: {contactName}</span>
                    </>
                  )}
                  {websiteUrl && (
                    <>
                      <span>•</span>
                      <a
                        href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-slate-600 print:text-black font-medium truncate max-w-[200px]"
                      >
                        {websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </>
                  )}
                  {options.show_date_generated && (
                    <>
                      <span>•</span>
                      <span>Reported: {formatDate(report.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Agency / Partner Badge */}
            {options.show_agency_info && (
              isWhiteLabel ? (
                partnerLogoUrl ? (
                  <div className="shrink-0 flex items-center sm:justify-end">
                    <img
                      src={partnerLogoUrl}
                      alt={partnerName || 'Partner'}
                      className="h-6 max-w-[140px] object-contain"
                    />
                  </div>
                ) : partnerName ? (
                  <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>{partnerName}</span>
                  </div>
                ) : null
              ) : partnerName ? (
                <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>{partnerName}</span>
                </div>
              ) : null
            )}
          </div>

          {/* Executive KPI Snapshot Grid (4 Hero Metric Cards) */}
          <div className="grid grid-cols-4 gap-3.5 print:gap-2.5 pt-1">
            {/* KPI 1: Impressions */}
            <div
              className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 print:bg-white border border-slate-200/90 print:border-slate-300 flex flex-col justify-between shadow-2xs"
              style={{
                borderTop: `3px solid ${primaryColor}`,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Impressions</span>
                <Eye className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight my-1">
                {report.gscImpressions?.toLocaleString() || 0}
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-mono text-slate-400">Total Visibility</span>
                {renderMoMBadge(gscImpressionsMoM)}
              </div>
            </div>

            {/* KPI 2: Organic Clicks */}
            <div
              className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 print:bg-white border border-slate-200/90 print:border-slate-300 flex flex-col justify-between shadow-2xs"
              style={{
                borderTop: `3px solid ${primaryColor}`,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Organic Clicks</span>
                <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight my-1">
                {report.gscClicks?.toLocaleString() || 0}
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-mono text-slate-400">Search Traffic</span>
                {renderMoMBadge(gscClicksMoM)}
              </div>
            </div>

            {/* KPI 3: Direct Customer Actions */}
            <div
              className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 print:bg-white border border-slate-200/90 print:border-slate-300 flex flex-col justify-between shadow-2xs"
              style={{
                borderTop: `3px solid ${primaryColor}`,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Direct Actions</span>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight my-1">
                {customerActions.toLocaleString()}
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-mono text-slate-400">Calls & Directions</span>
                {renderMoMBadge(customerActionsMoM)}
              </div>
            </div>

            {/* KPI 4: Average Rank / Position */}
            <div
              className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 print:bg-white border border-slate-200/90 print:border-slate-300 flex flex-col justify-between shadow-2xs"
              style={{
                borderTop: `3px solid ${primaryColor}`,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Avg. Position</span>
                <Target className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight my-1">
                {report.gscPosition ? parseDecimal(report.gscPosition).toFixed(1) : '—'}
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-mono text-slate-400">Search Rank</span>
                {renderMoMBadge(gscPositionMoM)}
              </div>
            </div>
          </div>

          {/* Executive Summary Card with Brand Accent Border */}
          {options.show_summary && report.summary && (
            <div
              className="p-4 sm:p-5 rounded-xl bg-slate-50/70 print:bg-slate-50/50 border border-slate-200/90 print:border-slate-300 space-y-2 print:break-inside-avoid shadow-2xs"
              style={{
                borderLeft: `4px solid ${primaryColor}`,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  <span>{report.summaryTitle || 'Performance Highlights & Strategic Updates'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Monthly Review</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal whitespace-pre-line pt-0.5">
                {report.summary}
              </p>
            </div>
          )}

          {/* Balanced 3-Column Platform KPI Grid */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Core Platform Indicators (Month-over-Month)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                MoM badges indicate performance vs. prior period
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 print:grid-cols-3 print:gap-2.5">
              {/* Card 1: Google Business Profile (GBP) */}
              <div
                className="rounded-xl border p-3 space-y-2.5 bg-slate-50/50 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <PhoneCall className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>Google Business Profile</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-2xs"
                    style={{
                      backgroundColor: primaryColor,
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    Local
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {/* Row 1: Total Reviews & Rating */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>Reviews</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{Number(report.gbpRating || 5.0).toFixed(1)}</span>
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {reviewsCount}
                      </span>
                      {renderMoMBadge(gbpReviewsMoM)}
                    </div>
                  </div>

                  {/* Row 2: Calls */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Phone Calls</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpCalls || 0}
                      </span>
                      {renderMoMBadge(gbpCallsMoM)}
                    </div>
                  </div>

                  {/* Row 3: Directions */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Navigation className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Directions</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpDirections || 0}
                      </span>
                      {renderMoMBadge(gbpDirectionsMoM)}
                    </div>
                  </div>

                  {/* Row 4: Website Clicks */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Website Clicks</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {websiteClicks || 0}
                      </span>
                      {renderMoMBadge(gbpWebsiteClicksMoM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Google Search Console (GSC) */}
              <div
                className="rounded-xl border p-3 space-y-2.5 bg-slate-50/50 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MousePointerClick className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>Search Console (GSC)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-2xs"
                    style={{
                      backgroundColor: primaryColor,
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    Organic
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {/* Row 1: Clicks */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <MousePointerClick className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Clicks</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscClicks || 0}
                      </span>
                      {renderMoMBadge(gscClicksMoM)}
                    </div>
                  </div>

                  {/* Row 2: Impressions (Safe layout without label collision) */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Eye className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Impressions</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscImpressions?.toLocaleString() || 0}
                      </span>
                      {renderMoMBadge(gscImpressionsMoM)}
                    </div>
                  </div>

                  {/* Row 3: CTR % */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Target className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>CTR Rate</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {gscCtrNum.toFixed(1)}%
                      </span>
                      {renderMoMBadge(gscCtrMoM)}
                    </div>
                  </div>

                  {/* Row 4: Avg Position */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Avg. Position</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscPosition ? parseDecimal(report.gscPosition).toFixed(1) : '—'}
                      </span>
                      {renderMoMBadge(gscPositionMoM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Google Analytics 4 (GA4) */}
              <div
                className="rounded-xl border p-3 space-y-2.5 bg-slate-50/50 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Users className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>Analytics (GA4)</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-2xs"
                    style={{
                      backgroundColor: primaryColor,
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    Traffic
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {/* Row 1: Users */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Users className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Total Users</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaUsers || 0}
                      </span>
                      {renderMoMBadge(gaUsersMoM)}
                    </div>
                  </div>

                  {/* Row 2: New Users */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Activity className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>New Users</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaNewUsers || 0}
                      </span>
                      {renderMoMBadge(gaNewUsersMoM)}
                    </div>
                  </div>

                  {/* Row 3: Sessions */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Sessions</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaSessions || 0}
                      </span>
                      {renderMoMBadge(gaSessionsMoM)}
                    </div>
                  </div>

                  {/* Row 4: Pageviews */}
                  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-slate-100 min-w-0">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
                      <Eye className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Pageviews</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
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

        {/* Page 1 Bottom Footer */}
        <div className="pt-2.5 mt-auto border-t border-slate-200 print:border-slate-300 flex items-center justify-between text-xs font-mono text-slate-400 print:text-[10px] print:break-inside-avoid">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-slate-800 print:text-black">
              {options.show_agency_info && partnerName ? partnerName : 'Monthly Performance Report'}
            </span>
            <span>•</span>
            <span className="truncate">Prepared exclusively for {businessName}</span>
          </div>
          <div className="text-[11px] print:text-[10px] text-slate-400 font-semibold shrink-0">
            Page 1 of 2
          </div>
        </div>
      </div>

      {/* Screen-only Paper Break Divider */}
      <div className="print:hidden w-full max-w-[8.5in] flex items-center justify-center gap-3 text-slate-400 font-mono text-xs my-1">
        <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
        <span className="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] shadow-2xs">
          End of Page 1 • Page 2 Below
        </span>
        <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: DEEP METRIC TABLES, ROADMAP & TECHNICAL HEALTH                    */}
      {/* ========================================================================= */}
      <div
        className="report-page report-page-2 bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-shadow rounded-2xl print:rounded-none border border-slate-200/80 print:border-none flex flex-col justify-between"
        style={{
          width: '8.5in',
          height: '11in',
          maxHeight: '11in',
          minHeight: '11in',
          padding: '0.5in',
          boxSizing: 'border-box',
          overflow: 'hidden',
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
        }}
      >
        <div className="flex-1 flex flex-col justify-start gap-8 sm:gap-9 print:gap-6">
          {/* Section Header for Page 2 */}
          <div className="flex items-center justify-between border-b border-slate-200/80 print:border-slate-300 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" style={{ color: primaryColor }} />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Detailed Search Visibility & Strategic Deliverables
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {businessName} • {report.reportMonth}
            </span>
          </div>

          {/* Row 1: Deep Metric Tables - Side-by-Side 2-Column Grid (Hidden if both empty) */}
          {options.show_tables && (topQueries.length > 0 || topPages.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 pt-1">
              {/* Table 1: Top 5 Search Queries */}
              {topQueries.length > 0 && (
                <div
                  className={`rounded-xl border p-3 space-y-2 print:break-inside-avoid bg-white shadow-2xs ${
                    topPages.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                  }`}
                  style={{
                    borderTop: `3px solid ${primaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                      <Search className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Top Search Queries (GSC)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold whitespace-nowrap">Top 5 by Clicks</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] table-fixed">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase">
                          <th className="pb-1 font-bold w-[52%]">Query</th>
                          <th className="pb-1 font-bold text-right w-[16%] whitespace-nowrap">Clicks</th>
                          <th className="pb-1 font-bold text-right w-[16%] whitespace-nowrap">Impr.</th>
                          <th className="pb-1 font-bold text-right w-[16%] whitespace-nowrap">Pos.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topQueries.slice(0, 5).map((item: QueryItem, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/60 even:bg-slate-50/30">
                            <td className="py-1.5 pr-2 font-medium text-slate-800 truncate">
                              {item.query}
                            </td>
                            <td className="py-1.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                              {item.clicks}
                            </td>
                            <td className="py-1.5 text-right text-slate-600 whitespace-nowrap">
                              {item.impressions?.toLocaleString()}
                            </td>
                            <td className="py-1.5 text-right text-slate-500 whitespace-nowrap">
                              {Number(item.position).toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Table 2: Top 5 High-Value Pages */}
              {topPages.length > 0 && (
                <div
                  className={`rounded-xl border p-3 space-y-2 print:break-inside-avoid bg-white shadow-2xs ${
                    topQueries.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                  }`}
                  style={{
                    borderTop: `3px solid ${primaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                      <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                      <span>Top Landing Pages (GSC)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold whitespace-nowrap">Top 5 by Visibility</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] table-fixed">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase">
                          <th className="pb-1 font-bold w-[60%]">Path / Page</th>
                          <th className="pb-1 font-bold text-right w-[20%] whitespace-nowrap">Impr.</th>
                          <th className="pb-1 font-bold text-right w-[20%] whitespace-nowrap">Pos.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topPages.slice(0, 5).map((item: PageItem, idx: number) => {
                          const impressionsVal = item.impressions !== undefined ? item.impressions : (item.clicks || 0)
                          const positionVal = item.position !== undefined ? item.position : 1.0
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 even:bg-slate-50/30">
                              <td className="py-1.5 pr-2 font-medium text-slate-800 truncate">
                                {item.path}
                              </td>
                              <td className="py-1.5 text-right font-bold text-indigo-700 whitespace-nowrap">
                                {impressionsVal?.toLocaleString()}
                              </td>
                              <td className="py-1.5 text-right text-slate-500 font-semibold whitespace-nowrap">
                                {Number(positionVal).toFixed(1)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deliverables Section (From CRM Wiring Snapshot) */}
          {hasDeliverables && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
                {/* Deliverables Column 1: Published Articles & Live Landing Pages */}
                <div
                  className="p-3 rounded-xl border space-y-2.5 print:break-inside-avoid bg-white shadow-2xs"
                  style={{
                    borderTop: `3px solid ${primaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-100">
                    <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Live Deliverables & Content Published</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Landing Pages */}
                    {deliverables?.landingPages && deliverables.landingPages.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                          Landing Pages ({deliverables.landingPages.length})
                        </span>
                        <ul className="space-y-1">
                          {deliverables.landingPages.map((lp) => (
                            <li key={lp.id} className="flex items-center justify-between gap-2 p-1 rounded bg-slate-50 border border-slate-100">
                              <span className="font-medium text-slate-800 truncate">{lp.title}</span>
                              {lp.targetUrl ? (
                                <a
                                  href={lp.targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono text-blue-600 hover:underline inline-flex items-center gap-0.5 shrink-0"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ) : (
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">Live</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Articles */}
                    {deliverables?.articles && deliverables.articles.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                          Articles & Resources ({deliverables.articles.length})
                        </span>
                        <ul className="space-y-1">
                          {deliverables.articles.map((art) => (
                            <li key={art.id} className="flex items-center justify-between gap-2 p-1 rounded bg-slate-50 border border-slate-100">
                              <span className="font-medium text-slate-800 truncate">{art.title}</span>
                              {art.liveUrl ? (
                                <a
                                  href={art.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono text-blue-600 hover:underline inline-flex items-center gap-0.5 shrink-0"
                                >
                                  <span>Read</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ) : (
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">Live</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(!deliverables?.landingPages || deliverables.landingPages.length === 0) &&
                      (!deliverables?.articles || deliverables.articles.length === 0) && (
                        <p className="text-[11px] text-slate-400 italic">No public URLs scheduled for this period.</p>
                      )}
                  </div>
                </div>

                {/* Deliverables Column 2: Completed Campaign Tasks */}
                <div
                  className="p-3 rounded-xl border space-y-2.5 print:break-inside-avoid bg-white shadow-2xs"
                  style={{
                    borderTop: `3px solid ${secondaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-100">
                    <ListChecks className="w-4 h-4" style={{ color: secondaryColor }} />
                    <span>Completed Campaign Tasks</span>
                  </div>

                  {deliverables?.tasks && deliverables.tasks.length > 0 ? (
                    <ul className="space-y-1.5 text-xs">
                      {deliverables.tasks.map((task) => (
                        <li key={task.id} className="flex items-start gap-1.5">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600"
                            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                          />
                          <div className="min-w-0">
                            <span className="text-slate-800 leading-snug">{task.title}</span>
                            <span className="ml-2 text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                              {task.category.replace('_', ' ')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No deliverable tasks closed in this window.</p>
                  )}
                </div>
              </div>

              {/* Next Strategic Targets (Keywords) */}
              {deliverables?.nextKeywords && deliverables.nextKeywords.length > 0 && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 print:bg-white print:break-inside-avoid">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-900">
                      <Target className="w-3.5 h-3.5 text-amber-600" />
                      <span>Next Organic Search Targets</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Targeting Next Phase</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {deliverables.nextKeywords.slice(0, 8).map((kw) => (
                      <div key={kw.id} className="p-1.5 rounded bg-white border border-slate-200 flex flex-col justify-between text-xs">
                        <span className="font-semibold text-slate-900 truncate" title={kw.keyword}>{kw.keyword}</span>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                          <span>Vol: {kw.searchVolume?.toLocaleString() || '–'}</span>
                          <span className="font-bold text-slate-700">Rank: #{kw.currentRank || '–'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Row 2: Work Completed & Next Steps - Side-by-Side 2-Column Grid (Hidden if both empty) */}
          {options.show_next_steps && (completedBullets.length > 0 || nextStepBullets.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 pt-1">
              {/* Work Completed (Manual Narrative Text) */}
              {completedBullets.length > 0 && (
                <div
                  className={`p-3 rounded-xl border space-y-2 print:break-inside-avoid bg-white shadow-2xs ${
                    nextStepBullets.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                  }`}
                  style={{
                    borderTop: `3px solid ${primaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-100">
                    <ListChecks className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Work Completed Highlights</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    {completedBullets.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0 mt-0.5"
                          style={{
                            color: primaryColor,
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact',
                          }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps: Fixed alignment with w-5 h-5 badges */}
              {nextStepBullets.length > 0 && (
                <div
                  className={`p-3 rounded-xl border space-y-2 print:break-inside-avoid bg-white shadow-2xs ${
                    completedBullets.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                  }`}
                  style={{
                    borderTop: `3px solid ${secondaryColor}`,
                    borderColor: '#e2e8f0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-100">
                    <ListOrdered className="w-4 h-4" style={{ color: secondaryColor }} />
                    <span>Next Steps & Strategic Priorities</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    {nextStepBullets.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                          style={{
                            backgroundColor: secondaryColor,
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact',
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Row 3: Campaign Focus Areas */}
          <div
            className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 print:bg-white print:border-slate-300 space-y-3 print:break-inside-avoid shadow-2xs"
            style={{
              borderLeft: `4px solid ${primaryColor}`,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                <Target className="w-4 h-4" style={{ color: primaryColor }} />
                <span>Campaign Focus Areas</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wide">
                Ongoing Initiatives
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 print:grid-cols-4 print:gap-2">
              {/* Card 1: Google Business Profile */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-900 leading-tight">
                    Google Business Profile
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-600 font-medium leading-tight">
                    Optimization & Engagement
                  </span>
                </div>
              </div>

              {/* Card 2: Local Search Visibility */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-900 leading-tight">
                    Local Search Visibility
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-600 font-medium leading-tight">
                    Target Keyword Growth
                  </span>
                </div>
              </div>

              {/* Card 3: Reputation Management */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-900 leading-tight">
                    Reputation Management
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-600 font-medium leading-tight">
                    Review Monitoring & Replies
                  </span>
                </div>
              </div>

              {/* Card 4: Neighborhood Coverage */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-900 leading-tight">
                    Neighborhood Coverage
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-600 font-medium leading-tight">
                    Local Content Expansion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Bottom Footer */}
        <div className="pt-2.5 mt-auto border-t border-slate-200 print:border-slate-300 flex items-center justify-between text-xs font-mono text-slate-400 print:text-[10px] print:break-inside-avoid">
          {options.show_agency_info && (partnerName || isWhiteLabel) ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-800 print:text-black">
                {partnerName || 'Monthly Performance Report'}
              </span>
              <span>•</span>
              <span className="truncate">Prepared exclusively for {businessName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-800 print:text-black">
                Monthly Performance Report
              </span>
              <span>•</span>
              <span className="truncate">Prepared exclusively for {businessName}</span>
            </div>
          )}
          <div className="text-[11px] print:text-[10px] text-slate-400 font-semibold shrink-0">
            Page 2 of 2
          </div>
        </div>
      </div>

      {/* Global Ink-Friendly Print Styling */}
      <style>{`
        @media print {
          @page {
            size: 8.5in 11in;
            margin: 0;
          }
          :root, html, body {
            color-scheme: light !important;
            background-color: white !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 8.5in !important;
            height: auto !important;
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .report-root {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 8.5in !important;
            background-color: white !important;
          }
          .report-page {
            width: 8.5in !important;
            height: 11in !important;
            max-height: 11in !important;
            min-height: 11in !important;
            padding: 0.5in !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background-color: white !important;
            color: #0f172a !important;
          }
          .report-page-1 {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .report-page-2 {
            page-break-before: always !important;
            break-before: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Suppress browser link URL stamping */
          a, a:visited {
            text-decoration: none !important;
            color: inherit !important;
          }
          a[href]:after {
            content: "" !important;
            display: none !important;
          }
          abbr[title]:after {
            content: "" !important;
          }
          /* Suppress heavy black ink blocks */
          .bg-slate-900, .dark\\:bg-\\[\\#070b14\\], .dark\\:bg-\\[\\#0c111d\\] {
            background-color: white !important;
            color: #0f172a !important;
          }
        }
      `}</style>
    </div>
  )
}

function renderMoMBadge(change: { label: string; isPositive: boolean; isNeutral: boolean } | null) {
  if (!change) return null

  // Sanitize any accidental $, spaces, or stray symbols
  const cleanLabel = String(change.label).replace(/^\$+/, '').replace(/\$+$/, '').trim()

  if (
    change.isNeutral ||
    cleanLabel === 'Baseline' ||
    cleanLabel === 'New' ||
    cleanLabel === 'N/A' ||
    cleanLabel === '0%' ||
    cleanLabel === '0.0'
  ) {
    return (
      <span
        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        {cleanLabel}
      </span>
    )
  }

  if (change.isPositive) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <TrendingUp className="w-2.5 h-2.5" />
        <span>{cleanLabel}</span>
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <TrendingDown className="w-2.5 h-2.5" />
      <span>{cleanLabel}</span>
    </span>
  )
}
