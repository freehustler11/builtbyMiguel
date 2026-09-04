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
} from 'lucide-react'
import type { Report, Client } from '../db/schema'
import type { DisplayOptions, QueryItem, PageItem } from '../server/reports'

interface ReportDocumentProps {
  report: Report
  client: Client
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
  const fallback = options?.fallbackLabel || 'N/A'

  // If previous value is null, undefined, or 0 (no prior month data)
  if (prev === null || isNaN(prev) || prev === 0) {
    if (fallback === 'Baseline' || fallback === 'New') {
      return { label: fallback, isPositive: false, isNeutral: true }
    }
    if (curr > 0) {
      return { label: '+100%', isPositive: true, isNeutral: false }
    }
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
  const primaryColor = client.primaryColor || (client as any).primary_color || '#2563eb'
  const secondaryColor = client.secondaryColor || (client as any).secondary_color || '#1e293b'
  const isWhiteLabel = Boolean(client.isWhiteLabel)

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

  // GBP Metrics & Comparisons
  const reviewsCount = report.gbpReviewsCount ?? report.gbpReviewCount ?? 0
  const prevReviewsCount = report.prevGbpReviewsCount ?? 0
  const gbpReviewsMoM = getMoMChange(reviewsCount, prevReviewsCount, { fallbackLabel: 'Baseline' })
  const gbpCallsMoM = getMoMChange(report.gbpCalls, report.prevGbpCalls)
  const gbpDirectionsMoM = getMoMChange(report.gbpDirections, report.prevGbpDirections)
  const gbpViewsMoM = getMoMChange(report.gbpViews, report.prevGbpViews)

  // GSC Metrics & Comparisons
  const gscCtrNum = parseDecimal(report.gscCtr)
  const prevGscCtrNum = parseDecimal(report.prevGscCtr)
  const gscClicksMoM = getMoMChange(report.gscClicks, report.prevGscClicks)
  const gscImpressionsMoM = getMoMChange(report.gscImpressions, report.prevGscImpressions)
  const gscCtrMoM = getMoMChange(gscCtrNum, prevGscCtrNum, { fallbackLabel: 'Baseline' })
  const gscPositionMoM = getMoMPositionChange(report.gscPosition, report.prevGscPosition)

  // GA4 Metrics & Comparisons
  const gaEngagementRateNum = parseDecimal(report.gaEngagementRate)
  const prevGaEngagementRateNum = parseDecimal(report.prevGaEngagementRate)
  const gaUsersMoM = getMoMChange(report.gaUsers, report.prevGaUsers)
  const gaEngagementRateMoM = getMoMChange(gaEngagementRateNum, prevGaEngagementRateNum, { fallbackLabel: 'Baseline' })
  const gaNewUsersMoM = getMoMChange(report.gaNewUsers, report.prevGaNewUsers)
  const gaSessionsMoM = getMoMChange(report.gaSessions, report.prevGaSessions)
  const gaViewsMoM = getMoMChange(report.gaViews, report.prevGaViews)

  return (
    <div
      className="report-root flex flex-col items-center gap-8 print:gap-0 print:block w-full overflow-x-auto print:overflow-visible"
      style={{
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* ========================================================================= */}
      {/* PAGE 1: SLIM EXECUTIVE HEADER, SUMMARY & 4-METRIC BALANCED KPIS           */}
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
        <div className="flex-1 flex flex-col justify-between space-y-4 print:space-y-3">
          {/* Top Slim Executive Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 print:border-slate-300">
            {/* Left: Client Logo & Business Identity */}
            <div className="flex items-center gap-3.5">
              {client.logoUrl ? (
                <div className="h-12 w-auto max-w-[180px] flex items-center justify-start shrink-0">
                  <img
                    src={client.logoUrl}
                    alt={client.businessName}
                    className="h-full w-auto max-w-[180px] object-contain object-left"
                  />
                </div>
              ) : (
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-xs shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {client.businessName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {client.businessName}
                  </h1>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-2xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Performance Audit
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
                  <span className="font-bold text-slate-800">Period: {report.reportMonth}</span>
                  {options.show_contact_person && client.name && (
                    <>
                      <span>•</span>
                      <span>Contact: {client.name}</span>
                    </>
                  )}
                  {client.websiteUrl && (
                    <>
                      <span>•</span>
                      <a
                        href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-slate-600 print:text-black font-medium"
                      >
                        {client.websiteUrl.replace(/^https?:\/\//, '')}
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

            {/* Right: Agency / Partner Badge (Completely hidden if show_agency_info is false) */}
            {options.show_agency_info && (
              isWhiteLabel ? (
                client.partnerLogoUrl ? (
                  <div className="shrink-0 flex items-center sm:justify-end">
                    <img
                      src={client.partnerLogoUrl}
                      alt={client.partnerName || 'Partner'}
                      className="h-6 max-w-[140px] object-contain"
                    />
                  </div>
                ) : client.partnerName ? (
                  <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>{client.partnerName}</span>
                  </div>
                ) : null
              ) : client.partnerName ? (
                <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>{client.partnerName}</span>
                </div>
              ) : null
            )}
          </div>

          {/* Executive Summary */}
          {options.show_summary && report.summary && (
            <div className="p-4 rounded-2xl bg-slate-50 print:bg-slate-50 border border-slate-200 print:border-slate-300 space-y-1.5 print:break-inside-avoid">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {report.summary}
              </p>
            </div>
          )}

          {/* Balanced 4-Metric KPI Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Core Performance Indicators (MoM)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                MoM pills indicate vs. prior month
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              {/* Card 1: Google Business Profile (GBP) - Exactly 4 Metric Rows */}
              <div
                className="rounded-2xl border p-4 space-y-3 bg-slate-50/40 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
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

                <div className="space-y-2 font-mono">
                  {/* Row 1: Total Reviews & Rating */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>Total Reviews</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
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
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Phone Calls</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpCalls || 0}
                      </span>
                      {renderMoMBadge(gbpCallsMoM)}
                    </div>
                  </div>

                  {/* Row 3: Directions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Navigation className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Directions</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gbpDirections || 0}
                      </span>
                      {renderMoMBadge(gbpDirectionsMoM)}
                    </div>
                  </div>

                  {/* Row 4: Profile Views */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3" style={{ color: primaryColor }} />
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

              {/* Card 2: Google Search Console (GSC) - Exactly 4 Metric Rows */}
              <div
                className="rounded-2xl border p-4 space-y-3 bg-slate-50/40 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
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

                <div className="space-y-2 font-mono">
                  {/* Row 1: Clicks */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <MousePointerClick className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Total Clicks</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscClicks || 0}
                      </span>
                      {renderMoMBadge(gscClicksMoM)}
                    </div>
                  </div>

                  {/* Row 2: Impressions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Impressions</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscImpressions?.toLocaleString() || 0}
                      </span>
                      {renderMoMBadge(gscImpressionsMoM)}
                    </div>
                  </div>

                  {/* Row 3: CTR % */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Target className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>CTR Rate</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {gscCtrNum.toFixed(1)}%
                      </span>
                      {renderMoMBadge(gscCtrMoM)}
                    </div>
                  </div>

                  {/* Row 4: Avg Position */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Avg. Position</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gscPosition ? parseDecimal(report.gscPosition).toFixed(1) : '—'}
                      </span>
                      {renderMoMBadge(gscPositionMoM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Google Analytics 4 (GA4) - Exactly 4 Metric Rows */}
              <div
                className="rounded-2xl border p-4 space-y-3 bg-slate-50/40 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-2xs"
                style={{
                  borderTop: `3.5px solid ${primaryColor}`,
                  borderColor: '#e2e8f0',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
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

                <div className="space-y-2 font-mono">
                  {/* Row 1: Users */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Users className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Active Users</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaUsers || 0}
                      </span>
                      {renderMoMBadge(gaUsersMoM)}
                    </div>
                  </div>

                  {/* Row 2: Engagement Rate / New Users */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Activity className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>{report.gaNewUsers ? 'New Users' : 'Engagement'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaNewUsers
                          ? report.gaNewUsers
                          : `${gaEngagementRateNum.toFixed(1)}%`}
                      </span>
                      {renderMoMBadge(report.gaNewUsers ? gaNewUsersMoM : gaEngagementRateMoM)}
                    </div>
                  </div>

                  {/* Row 3: Sessions */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Layers className="w-3 h-3" style={{ color: primaryColor }} />
                      <span>Total Sessions</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {report.gaSessions || 0}
                      </span>
                      {renderMoMBadge(gaSessionsMoM)}
                    </div>
                  </div>

                  {/* Row 4: Pageviews */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Eye className="w-3 h-3" style={{ color: primaryColor }} />
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

        {/* Page 1 Bottom Footer (Pinned to bottom via justify-between) */}
        <div className="pt-3 mt-auto border-t border-slate-200 print:border-slate-300 flex items-center justify-between text-xs font-mono text-slate-400 print:text-[10px] print:break-inside-avoid">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 print:text-black">
              {options.show_agency_info && client.partnerName ? client.partnerName : 'Confidential Performance Audit'}
            </span>
            <span>•</span>
            <span>Prepared exclusively for {client.businessName}</span>
          </div>
          <div className="text-[11px] print:text-[10px] text-slate-400 font-semibold">
            Confidential • Page 1 of 2
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
      {/* PAGE 2: DEEP METRIC TABLES, ROADMAP & FOOTER                              */}
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
        <div className="flex-1 flex flex-col justify-between space-y-4 print:space-y-3">
          <div className="space-y-4 print:space-y-3">
            {/* Section Header for Page 2 */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" style={{ color: primaryColor }} />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                  Detailed Search Visibility & Strategic Deliverables
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {client.businessName} • {report.reportMonth}
              </span>
            </div>

            {/* Row 1: Deep Metric Tables - Side-by-Side 2-Column Grid (Hidden if both empty) */}
            {options.show_tables && (topQueries.length > 0 || topPages.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                {/* Table 1: Top 5 Search Queries */}
                {topQueries.length > 0 && (
                  <div
                    className={`rounded-2xl border p-4 space-y-2.5 print:break-inside-avoid bg-white shadow-2xs ${
                      topPages.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                    }`}
                    style={{
                      borderTop: `3px solid ${primaryColor}`,
                      borderColor: '#e2e8f0',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                        <Search className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        <span>Top Search Queries (GSC)</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Top 5</span>
                    </div>

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
                          {topQueries.slice(0, 5).map((item: QueryItem, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-1.5 pr-2 font-medium text-slate-800 truncate max-w-[150px]">
                                {item.query}
                              </td>
                              <td className="py-1.5 text-right font-bold text-emerald-700">
                                {item.clicks}
                              </td>
                              <td className="py-1.5 text-right text-slate-600">
                                {item.impressions?.toLocaleString()}
                              </td>
                              <td className="py-1.5 text-right text-slate-500">
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
                    className={`rounded-2xl border p-4 space-y-2.5 print:break-inside-avoid bg-white shadow-2xs ${
                      topQueries.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                    }`}
                    style={{
                      borderTop: `3px solid ${primaryColor}`,
                      borderColor: '#e2e8f0',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                        <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        <span>Top Landing Pages</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Top 5</span>
                    </div>

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
                          {topPages.slice(0, 5).map((item: PageItem, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-1.5 pr-2 font-medium text-slate-800 truncate max-w-[170px]">
                                {item.path}
                              </td>
                              <td className="py-1.5 text-right font-bold text-indigo-700">
                                {item.clicks}
                              </td>
                              <td className="py-1.5 text-right text-slate-600 font-semibold">
                                {item.users}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Row 2: Work Completed & Next Steps - Side-by-Side 2-Column Grid (Hidden if both empty) */}
            {options.show_next_steps && (completedBullets.length > 0 || nextStepBullets.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                {/* Work Completed */}
                {completedBullets.length > 0 && (
                  <div
                    className={`p-4 rounded-2xl border space-y-2.5 print:break-inside-avoid bg-white shadow-2xs ${
                      nextStepBullets.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                    }`}
                    style={{
                      borderTop: `3px solid ${primaryColor}`,
                      borderColor: '#e2e8f0',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                      <ListChecks className="w-4 h-4" style={{ color: primaryColor }} />
                      <span>Work Completed This Month</span>
                    </div>

                    <ul className="space-y-2 print:space-y-1.5 text-xs text-slate-700 leading-relaxed">
                      {completedBullets.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 mt-0.5"
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
                    className={`p-4 rounded-2xl border space-y-2.5 print:break-inside-avoid bg-white shadow-2xs ${
                      completedBullets.length === 0 ? 'md:col-span-2 print:col-span-2' : ''
                    }`}
                    style={{
                      borderTop: `3px solid ${secondaryColor}`,
                      borderColor: '#e2e8f0',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                      <ListOrdered className="w-4 h-4" style={{ color: secondaryColor }} />
                      <span>Next Steps & Strategic Priorities</span>
                    </div>

                    <ul className="space-y-2.5 print:space-y-1.5 text-xs text-slate-700 leading-relaxed">
                      {nextStepBullets.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className="w-5 h-5 rounded-full text-[10px] font-mono font-bold text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
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
          </div>

          {/* Page 2 Bottom Footer (Pinned to bottom via justify-between) */}
          <div className="pt-3.5 mt-auto border-t border-slate-200 print:border-slate-300 flex items-center justify-between text-xs font-mono text-slate-400 print:text-[10px] print:break-inside-avoid">
            {options.show_agency_info && (client.partnerName || isWhiteLabel) ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 print:text-black">
                  {client.partnerName || 'Confidential Performance Audit'}
                </span>
                <span>•</span>
                <span>Prepared exclusively for {client.businessName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 print:text-black">
                  Performance Audit
                </span>
                <span>•</span>
                <span>Prepared exclusively for {client.businessName}</span>
              </div>
            )}
            <div className="text-[11px] print:text-[10px] text-slate-400 font-semibold">
              Confidential • Page 2 of 2
            </div>
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
