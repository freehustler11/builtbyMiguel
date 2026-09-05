import React, { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Save,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  getMonthlyMetricsServerFn,
  saveMonthlyMetricsServerFn,
  type MonthlyMetricsInput,
  type MonthlyMetric,
} from '../../server/crm'
import { getClientsServerFn, type ClientWithReportCount } from '../../server/clients'
import { ToastContainer, type ToastMessage } from '../Toast'
import { ConfirmModal } from '../ConfirmModal'

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

interface MetricFieldConfig {
  key: keyof MonthlyMetricsInput
  label: string
  category: 'gsc' | 'ga4' | 'gbp' | 'semrush'
  type: 'integer' | 'decimal' | 'percentage'
  step?: string
  min?: number
  max?: number
  unit?: string
  description?: string
  invertDeltaColor?: boolean // e.g. for GSC average position, lower is better
}

const METRIC_FIELDS: MetricFieldConfig[] = [
  // Google Search Console
  { key: 'gscClicks', label: 'Clicks', category: 'gsc', type: 'integer', description: 'Total search result clicks' },
  { key: 'gscImpressions', label: 'Impressions', category: 'gsc', type: 'integer', description: 'Total search impressions' },
  { key: 'gscCtr', label: 'Click-Through Rate (CTR)', category: 'gsc', type: 'decimal', step: '0.01', unit: '%', description: 'Clicks / Impressions * 100' },
  { key: 'gscPosition', label: 'Average Position', category: 'gsc', type: 'decimal', step: '0.1', invertDeltaColor: true, description: 'Average SERP ranking' },

  // Google Analytics 4
  { key: 'gaSessions', label: 'Sessions', category: 'ga4', type: 'integer', description: 'Total user visits' },
  { key: 'gaUsers', label: 'Total Users', category: 'ga4', type: 'integer', description: 'Unique active users' },
  { key: 'gaNewUsers', label: 'New Users', category: 'ga4', type: 'integer', description: 'First-time visitors' },
  { key: 'gaViews', label: 'Pageviews', category: 'ga4', type: 'integer', description: 'Total page impressions' },
  { key: 'gaEngagementRate', label: 'Engagement Rate', category: 'ga4', type: 'decimal', step: '0.01', unit: '%', description: 'Percentage of engaged sessions' },

  // Google Business Profile
  { key: 'gbpCalls', label: 'Phone Calls', category: 'gbp', type: 'integer', description: 'Direct customer calls via profile' },
  { key: 'gbpViews', label: 'Profile Views', category: 'gbp', type: 'integer', description: 'Map and local search views' },
  { key: 'gbpDirections', label: 'Direction Requests', category: 'gbp', type: 'integer', description: 'Get directions interactions' },
  { key: 'gbpWebsiteClicks', label: 'Website Clicks', category: 'gbp', type: 'integer', description: 'Visits directed to website' },
  { key: 'gbpRating', label: 'Average Rating', category: 'gbp', type: 'decimal', step: '0.1', min: 1.0, max: 5.0, unit: '★', description: 'Google review star score (1.0 - 5.0)' },
  { key: 'gbpReviewsCount', label: 'Total Reviews Count', category: 'gbp', type: 'integer', description: 'Cumulative verified reviews' },

  // SEMrush
  { key: 'semrushAuthorityScore', label: 'Authority Score', category: 'semrush', type: 'integer', min: 0, max: 100, description: 'Domain authority metric (0 - 100)' },
  { key: 'semrushRankedKeywords', label: 'Ranked Keywords', category: 'semrush', type: 'integer', description: 'Total organic search keywords' },
]

export interface MonthlyMetricsFormProps {
  clientId?: string
  partnerId?: string
}

export function MonthlyMetricsForm({ clientId: initialClientId, partnerId }: MonthlyMetricsFormProps) {
  // Date setup: default to previous month as KPI reports lag one calendar month
  const now = new Date()
  const defaultMonth = now.getMonth() === 0 ? 12 : now.getMonth()
  const defaultYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || '')
  const [clientsList, setClientsList] = useState<ClientWithReportCount[]>([])
  const [month, setMonth] = useState<number>(defaultMonth)
  const [year, setYear] = useState<number>(defaultYear)

  // Current values & previous month reference
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [prevRecord, setPrevRecord] = useState<MonthlyMetric | null>(null)
  const [currentRecord, setCurrentRecord] = useState<MonthlyMetric | null>(null)
  const [clientInfo, setClientInfo] = useState<{ id: string; name: string; businessName: string } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  // If agency-wide view without clientId, fetch clients list
  useEffect(() => {
    if (!initialClientId) {
      getClientsServerFn({ data: { partnerId } })
        .then((res) => {
          const list = res.clients || []
          setClientsList(list)
          if (!selectedClientId && list.length > 0) {
            setSelectedClientId(list[0].id)
          }
        })
        .catch((err) => {
          console.error('Failed to load clients:', err)
        })
    }
  }, [initialClientId, partnerId])

  // Fetch metrics whenever selectedClientId, month, or year changes
  const loadMetrics = async (cId: string, m: number, y: number) => {
    if (!cId) return
    setIsLoading(true)
    try {
      const res = await getMonthlyMetricsServerFn({
        data: { clientId: cId, month: m, year: y },
      })
      setClientInfo(res.client)
      setCurrentRecord(res.current)
      setPrevRecord(res.previous)

      // Populate form state from current record if available
      const initialForm: Record<string, string> = {}
      for (const field of METRIC_FIELDS) {
        const val = res.current ? (res.current as any)[field.key] : null
        initialForm[field.key] = val !== null && val !== undefined ? String(val) : ''
      }
      setFormData(initialForm)
    } catch (err: any) {
      addToast('error', 'Failed to Load Metrics', err.message || 'Error fetching monthly records')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClientId) {
      loadMetrics(selectedClientId, month, year)
    }
  }, [selectedClientId, month, year])

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Calculate discrepancies > 50%
  const flaggedDiscrepancies = useMemo(() => {
    const flagged: Array<{
      field: MetricFieldConfig
      enteredVal: number
      prevVal: number
      diffPercent: number
      message: string
    }> = []

    if (!prevRecord) return flagged

    for (const field of METRIC_FIELDS) {
      const enteredStr = formData[field.key]
      if (!enteredStr || enteredStr.trim() === '') continue

      const enteredVal = Number(enteredStr)
      if (isNaN(enteredVal)) continue

      const prevVal = (prevRecord as any)[field.key]
      if (prevVal === null || prevVal === undefined || prevVal === 0) continue

      const diffRatio = Math.abs(enteredVal - prevVal) / Math.abs(prevVal)
      if (diffRatio > 0.5) {
        const diffPercent = ((enteredVal - prevVal) / Math.abs(prevVal)) * 100
        const dir = diffPercent > 0 ? 'increase' : 'drop'
        flagged.push({
          field,
          enteredVal,
          prevVal,
          diffPercent,
          message: `${Math.abs(Math.round(diffPercent))}% ${dir} from prior month (${prevVal} → ${enteredVal})`,
        })
      }
    }

    return flagged
  }, [formData, prevRecord])

  // Save handler: if flagged discrepancies exist, trigger confirmation modal first
  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (flaggedDiscrepancies.length > 0) {
      setConfirmModalOpen(true)
    } else {
      executeSave()
    }
  }

  const executeSave = async () => {
    if (!selectedClientId) {
      addToast('error', 'Client Required', 'Please select a client to save metrics')
      return
    }

    setIsSaving(true)
    try {
      const payload: MonthlyMetricsInput = {}
      for (const field of METRIC_FIELDS) {
        const str = formData[field.key]
        if (str !== undefined && str.trim() !== '') {
          const num = Number(str)
          ;(payload as any)[field.key] = isNaN(num) ? null : num
        } else {
          ;(payload as any)[field.key] = null
        }
      }

      await saveMonthlyMetricsServerFn({
        data: {
          clientId: selectedClientId,
          month,
          year,
          metrics: payload,
        },
      })

      addToast(
        'success',
        'Monthly Metrics Saved',
        `KPI data for ${MONTH_NAMES[month - 1]} ${year} successfully stored.`
      )
      setConfirmModalOpen(false)
      loadMetrics(selectedClientId, month, year)
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Failed to update monthly metrics')
    } finally {
      setIsSaving(false)
    }
  }

  // Quick navigation helpers
  const handleQuickMonth = (target: 'prev' | 'current') => {
    const date = new Date()
    if (target === 'current') {
      setMonth(date.getMonth() + 1)
      setYear(date.getFullYear())
    } else {
      const pMonth = date.getMonth() === 0 ? 12 : date.getMonth()
      const pYear = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()
      setMonth(pMonth)
      setYear(pYear)
    }
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Confirmation Modal for >50% Discrepancies */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirm Large Metric Discrepancies"
        description={
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The following values differ by more than <strong>50%</strong> from the previous month.
              Manual entry is a frequent source of report discrepancies. Please verify each metric before saving:
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs">
              {flaggedDiscrepancies.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">{f.field.label}:</span>
                  <span className="font-mono">
                    Prior: {f.prevVal} → Entered: {f.enteredVal} ({f.diffPercent > 0 ? '+' : ''}{f.diffPercent.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you certain these figures are verified and ready for client reporting?
            </p>
          </div>
        }
        confirmText="Confirm & Save Metrics"
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={executeSave}
        isLoading={isSaving}
      />

      {/* Control Header: Client selection & Month/Year Picker */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Monthly KPI Entry & Performance Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record living search, traffic, and local SEO metrics. Discrepancies exceeding 50% from prior month trigger inline verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickMonth('prev')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Prior Month
            </button>
            <button
              type="button"
              onClick={() => handleQuickMonth('current')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Current Month
            </button>
            <button
              type="button"
              onClick={() => loadMetrics(selectedClientId, month, year)}
              disabled={isLoading || !selectedClientId}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
              title="Refresh values"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Client Selector if agency roll-up view */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Client Account
            </label>
            {initialClientId ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="truncate">{clientInfo?.businessName || 'Selected Client'}</span>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {clientsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.name})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reporting Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing Record Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>
              Target Month: <strong>{MONTH_NAMES[month - 1]} {year}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              {currentRecord ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Existing Record (Last updated {new Date(currentRecord.updatedAt).toLocaleDateString()})
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  New Record (No entries yet)
                </span>
              )}
            </span>
          </div>

          <div>
            <span>Reference Baseline: </span>
            <strong>
              {MONTH_NAMES[month === 1 ? 11 : month - 2]} {month === 1 ? year - 1 : year}
            </strong>{' '}
            ({prevRecord ? 'Data present' : 'No prior data'})
          </div>
        </div>
      </div>

      {/* Discrepancy Global Alert Banner if any >50% warnings */}
      {flaggedDiscrepancies.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Attention: {flaggedDiscrepancies.length} metric{flaggedDiscrepancies.length > 1 ? 's' : ''} deviate by &gt;50% from the prior month
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Significant month-over-month swings have been flagged below with warning badges. Please double-check for extra digits or transposed numbers before saving.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Entry Form */}
      <form onSubmit={handleSaveClick} className="space-y-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Google Search Console */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Search Console (GSC)</h3>
                <p className="text-[11px] text-slate-400">Search impressions, clicks, CTR, and SERP positions</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {METRIC_FIELDS.filter((f) => f.category === 'gsc').map((field) => (
                <MetricInputRow
                  key={field.key}
                  field={field}
                  value={formData[field.key] || ''}
                  prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                  onChange={(val) => handleInputChange(field.key, val)}
                />
              ))}
            </div>
          </div>

          {/* 2. Google Analytics 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Analytics 4 (GA4)</h3>
                <p className="text-[11px] text-slate-400">Sessions, unique users, pageviews, and engagement rate</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {METRIC_FIELDS.filter((f) => f.category === 'ga4').map((field) => (
                <MetricInputRow
                  key={field.key}
                  field={field}
                  value={formData[field.key] || ''}
                  prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                  onChange={(val) => handleInputChange(field.key, val)}
                />
              ))}
            </div>
          </div>

          {/* 3. Google Business Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Business Profile (GBP)</h3>
                <p className="text-[11px] text-slate-400">Local map calls, directions, website clicks, and reviews</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {METRIC_FIELDS.filter((f) => f.category === 'gbp').map((field) => (
                <MetricInputRow
                  key={field.key}
                  field={field}
                  value={formData[field.key] || ''}
                  prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                  onChange={(val) => handleInputChange(field.key, val)}
                />
              ))}
            </div>
          </div>

          {/* 4. SEMrush Domain Authority & Keywords */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">SEMrush Authority & Scope</h3>
                <p className="text-[11px] text-slate-400">Domain authority score and total ranked keywords</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {METRIC_FIELDS.filter((f) => f.category === 'semrush').map((field) => (
                <MetricInputRow
                  key={field.key}
                  field={field}
                  value={formData[field.key] || ''}
                  prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                  onChange={(val) => handleInputChange(field.key, val)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="text-xs font-mono text-slate-500">
            {flaggedDiscrepancies.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {flaggedDiscrepancies.length} input warning{flaggedDiscrepancies.length > 1 ? 's' : ''} require confirmation
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All inputs within normal MoM baseline bounds
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving || !selectedClientId}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-sm cursor-pointer ${
                flaggedDiscrepancies.length > 0
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>
                {isSaving
                  ? 'Saving Metrics...'
                  : flaggedDiscrepancies.length > 0
                  ? `Review & Save (${flaggedDiscrepancies.length} Warnings)`
                  : 'Save Monthly Metrics'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

/**
 * Metric input row with previous month reference value and >50% deviation warning
 */
function MetricInputRow({
  field,
  value,
  prevVal,
  onChange,
}: {
  field: MetricFieldConfig
  value: string
  prevVal: number | null | undefined
  onChange: (val: string) => void
}) {
  const enteredNum = value.trim() !== '' ? Number(value) : null
  const hasValidEntered = enteredNum !== null && !isNaN(enteredNum)
  const hasPrior = prevVal !== null && prevVal !== undefined

  // Calculate percentage change
  let diffPercent: number | null = null
  let isLargeDiscrepancy = false

  if (hasValidEntered && hasPrior && prevVal !== 0) {
    diffPercent = ((enteredNum - prevVal) / Math.abs(prevVal)) * 100
    isLargeDiscrepancy = Math.abs(diffPercent) > 50
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-800 dark:text-slate-200">
          {field.label}
        </label>
        {/* Previous Month Reference Display */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400 dark:text-slate-500">
            Prior: {hasPrior ? prevVal : '—'}
            {hasPrior && field.unit ? field.unit : ''}
          </span>
          {diffPercent !== null && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                diffPercent > 0
                  ? field.invertDeltaColor
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : diffPercent < 0
                  ? field.invertDeltaColor
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {diffPercent > 0 ? '+' : ''}
              {diffPercent.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Input element */}
      <div className="relative">
        <input
          type="number"
          step={field.step || '1'}
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hasPrior ? `Prior: ${prevVal}` : 'Enter value...'}
          className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/80 border transition focus:outline-hidden focus:ring-2 ${
            isLargeDiscrepancy
              ? 'border-amber-400 dark:border-amber-500/80 text-amber-900 dark:text-amber-200 focus:ring-amber-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500'
          }`}
        />
        {field.unit && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
            {field.unit}
          </span>
        )}
      </div>

      {/* Inline Warning for >50% deviation */}
      {isLargeDiscrepancy && diffPercent !== null && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-600 dark:text-amber-400 pt-0.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            ⚠️ {Math.abs(Math.round(diffPercent))}% change from prior month (Prior: {prevVal} vs Entered: {enteredNum}). Confirm this value.
          </span>
        </div>
      )}
    </div>
  )
}
