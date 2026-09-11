import React, { useState, useEffect, useMemo } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Clock,
} from 'lucide-react'
import {
  getReportsDueServerFn,
  type ReportsDueRow,
} from '../../server/workflow'
import { createReportServerFn } from '../../server/reports'
import { ToastContainer, type ToastMessage } from '../Toast'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export interface ReportsDueTableProps {
  initialMonth?: number
  initialYear?: number
  month?: number
  year?: number
  partnerId?: string
  onMonthChange?: (month: number, year: number) => void
}

export function ReportsDueTable({
  initialMonth,
  initialYear,
  month: propMonth,
  year: propYear,
  partnerId,
  onMonthChange,
}: ReportsDueTableProps) {
  const router = useRouter()
  const now = new Date()
  const month = propMonth ?? initialMonth ?? (now.getUTCMonth() + 1)
  const year = propYear ?? initialYear ?? now.getUTCFullYear()

  const [data, setData] = useState<ReportsDueRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [generatingClientId, setGeneratingClientId] = useState<string | null>(null)
  const [isBulkGenerating, setIsBulkGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'due' | 'generated'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const res = await getReportsDueServerFn({
        data: { month, year, partnerId },
      })
      setData(res.rows)
    } catch (err: unknown) {
      addToast('error', 'Error', 'Failed to load reports due list')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [month, year, partnerId])

  // Filtered rows
  const filteredRows = useMemo(() => {
    return data.filter((r) => {
      if (filter === 'due' && r.reportGenerated) return false
      if (filter === 'generated' && !r.reportGenerated) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          r.businessName.toLowerCase().includes(q) ||
          (r.websiteUrl && r.websiteUrl.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [data, filter, searchQuery])

  // 1-Click Generate Report
  const handleGenerateReport = async (row: ReportsDueRow) => {
    setGeneratingClientId(row.clientId)
    try {
      const reportMonth = `${MONTH_NAMES[month - 1]} ${year}`

      const res = await createReportServerFn({
        data: {
          clientId: row.clientId,
          title: `Monthly SEO Report - ${reportMonth}`,
          reportMonth,
        },
      })

      if (res && res.report) {
        addToast('success', 'Report Created', `Report generated for ${row.businessName}.`)
        await loadData()
        await router.invalidate()
      }
    } catch (err: unknown) {
      addToast('error', 'Error', err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setGeneratingClientId(null)
    }
  }

  // Bulk Generate all ready reports (metrics complete & not yet generated)
  const handleBulkGenerate = async () => {
    const readyClients = data.filter((r) => !r.reportGenerated && r.metricsComplete)
    if (readyClients.length === 0) return

    setIsBulkGenerating(true)
    let generatedCount = 0
    try {
      for (const row of readyClients) {
        const reportMonth = `${MONTH_NAMES[month - 1]} ${year}`

        await createReportServerFn({
          data: {
            clientId: row.clientId,
            title: `Monthly SEO Report - ${reportMonth}`,
            reportMonth,
          },
        })
        generatedCount++
      }

      addToast('success', 'Bulk Generation Complete', `Generated ${generatedCount} reports.`)
      await loadData()
      await router.invalidate()
    } catch (err: unknown) {
      addToast('error', 'Bulk Generation Stopped', err instanceof Error ? err.message : 'Some reports failed to generate')
    } finally {
      setIsBulkGenerating(false)
    }
  }

  const handleCopyLink = (shareToken: string, id: string) => {
    const url = `${window.location.origin}/r/${shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    addToast('info', 'Link Copied', 'Public client report link copied to clipboard.')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const dueCount = data.filter((r) => !r.reportGenerated).length
  const readyCount = data.filter((r) => !r.reportGenerated && r.metricsComplete).length

  return (
    <div className="space-y-4">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="h-8 pl-8 pr-3 text-[13px] rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center rounded-[6px] border border-[var(--line)] p-0.5 bg-[var(--canvas)]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`h-7 px-2.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer ${
                filter === 'all' ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              All ({data.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('due')}
              className={`h-7 px-2.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer ${
                filter === 'due' ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Due ({dueCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('generated')}
              className={`h-7 px-2.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer ${
                filter === 'generated' ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Generated ({data.length - dueCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {readyCount > 0 && (
            <button
              type="button"
              disabled={isBulkGenerating}
              onClick={handleBulkGenerate}
              className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--accent)] text-white hover:opacity-90 shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Ready Reports ({readyCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer disabled:opacity-50"
            title="Refresh reports due"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--muted)] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Reports Due Table */}
      <div className="w-full overflow-x-auto rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[900px]">
          {/* Header */}
          <thead className="bg-[var(--canvas)]/90 sticky top-0 z-10 border-b border-[var(--line)] backdrop-blur-xs select-none">
            <tr className="text-[12px] font-medium text-[var(--muted)]">
              <th className="px-4 py-2.5">Client</th>
              <th className="px-4 py-2.5">Monthly KPIs Status</th>
              <th className="px-4 py-2.5">Report Status</th>
              <th className="px-4 py-2.5">Public Share Link</th>
              <th className="px-4 py-2.5 text-right w-36">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--line)]/50 text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-[var(--muted)]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    <span>Checking reports due for {MONTH_NAMES[month - 1]} {year}...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-[var(--muted)]">
                  No clients match this filter.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isGenerating = generatingClientId === row.clientId

                return (
                  <tr
                    key={row.clientId}
                    className={`group transition-colors ${
                      !row.reportGenerated ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-[var(--line)]/10'
                    }`}
                  >
                    {/* Client Name */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--ink)]">{row.businessName}</div>
                      {row.websiteUrl && (
                        <div className="text-[11px] font-mono text-[var(--muted)] truncate max-w-[220px]">
                          {row.websiteUrl}
                        </div>
                      )}
                    </td>

                    {/* Metrics Status */}
                    <td className="px-4 py-3">
                      {row.metricsComplete ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Metrics Complete</span>
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Metrics Incomplete</span>
                          </span>
                          {row.metricsSummary.missingSources.length > 0 && (
                            <div className="text-[10px] text-[var(--muted)]">
                              Missing: {row.metricsSummary.missingSources.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Report Status */}
                    <td className="px-4 py-3">
                      {row.reportGenerated ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--accent)]/10 text-[var(--accent)]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Generated (v{row.version || 1})</span>
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Not Generated</span>
                        </span>
                      )}
                    </td>

                    {/* Share Status */}
                    <td className="px-4 py-3">
                      {row.shareToken ? (
                        <button
                          type="button"
                          onClick={() => handleCopyLink(row.shareToken!, row.clientId)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-[12px] font-mono text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                          title="Copy public share link"
                        >
                          <span>/r/{row.shareToken.slice(0, 8)}...</span>
                          {copiedId === row.clientId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--muted)]/50">Internal only</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      {row.reportGenerated ? (
                        <Link
                          to="/admin/reports/$id"
                          params={{ id: row.reportId! }}
                          className="h-7 inline-flex items-center gap-1 px-2.5 rounded-[4px] text-[12px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                        >
                          <span>View Report</span>
                          <ArrowUpRight className="w-3 h-3 text-[var(--muted)]" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={() => handleGenerateReport(row)}
                          className="h-7 inline-flex items-center gap-1 px-2.5 rounded-[4px] text-[12px] font-medium bg-[var(--accent)] text-white hover:opacity-90 shadow-2xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          <span>Generate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
