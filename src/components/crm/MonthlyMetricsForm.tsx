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
  Edit3,
  Lock,
  Unlock,
  X,
} from 'lucide-react'
import {
  getMonthlyMetricsServerFn,
  saveMonthlyMetricsServerFn,
  type MonthlyMetricsInput,
  type LocationMonthlyMetricsInput,
  type MonthlyMetric,
} from '../../server/crm'
import { getClientsServerFn, getClientDataSourcesServerFn, type ClientWithReportCount } from '../../server/clients'
import type { ClientLocation } from '../../db/schema'
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

  // Edit/View mode protection
  const [isEditing, setIsEditing] = useState(false)

  // Current values & previous month reference
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [prevRecord, setPrevRecord] = useState<MonthlyMetric | null>(null)
  const [currentRecord, setCurrentRecord] = useState<MonthlyMetric | null>(null)
  const [clientInfo, setClientInfo] = useState<{ id: string; name: string; businessName: string } | null>(null)
  const [clientDataSources, setClientDataSources] = useState<Record<string, 'connected' | 'no_access' | 'not_applicable'>>({
    gsc: 'connected',
    ga4: 'connected',
    gbp: 'connected',
  })

  // Multi-location state
  const [locations, setLocations] = useState<ClientLocation[]>([])
  const [locationFormData, setLocationFormData] = useState<Record<string, Record<string, string>>>({})
  const [prevLocationRecords, setPrevLocationRecords] = useState<Record<string, any>>({})

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
    setIsEditing(false)
    try {
      const [res, sourcesRes] = await Promise.all([
        getMonthlyMetricsServerFn({
          data: { clientId: cId, month: m, year: y },
        }),
        getClientDataSourcesServerFn({
          data: { clientId: cId },
        }).catch(() => ({ dataSources: [] })),
      ])
      setClientInfo(res.client)
      setCurrentRecord(res.current)
      setPrevRecord(res.previous)
      setLocations(res.locations || [])

      const dsMap: Record<string, 'connected' | 'no_access' | 'not_applicable'> = {
        gsc: 'connected',
        ga4: 'connected',
        gbp: 'connected',
      }
      if (sourcesRes && sourcesRes.dataSources) {
        for (const s of sourcesRes.dataSources) {
          dsMap[s.source] = s.status
        }
      }
      setClientDataSources(dsMap)

      // Populate form state from current record if available
      const initialForm: Record<string, string> = {}
      for (const field of METRIC_FIELDS) {
        const val = res.current ? (res.current as any)[field.key] : null
        initialForm[field.key] = val !== null && val !== undefined ? String(val) : ''
      }
      setFormData(initialForm)

      // Populate per-location form state and prior records
      const initialLocForm: Record<string, Record<string, string>> = {}
      const curLocMetricsMap = new Map((res.currentLocationMetrics || []).map((m: any) => [m.locationId, m]))
      const prevLocMetricsMap = new Map((res.previousLocationMetrics || []).map((m: any) => [m.locationId, m]))

      const prevLocsRecordObj: Record<string, any> = {}
      for (const loc of res.locations || []) {
        prevLocsRecordObj[loc.id] = prevLocMetricsMap.get(loc.id) || null
        const curM = curLocMetricsMap.get(loc.id)
        initialLocForm[loc.id] = {
          gbpCalls: curM?.gbpCalls !== null && curM?.gbpCalls !== undefined ? String(curM.gbpCalls) : '',
          gbpDirections: curM?.gbpDirections !== null && curM?.gbpDirections !== undefined ? String(curM.gbpDirections) : '',
          gbpWebsiteClicks: curM?.gbpWebsiteClicks !== null && curM?.gbpWebsiteClicks !== undefined ? String(curM.gbpWebsiteClicks) : '',
          gbpViews: curM?.gbpViews !== null && curM?.gbpViews !== undefined ? String(curM.gbpViews) : '',
          gbpRating: curM?.gbpRating !== null && curM?.gbpRating !== undefined ? String(curM.gbpRating) : '',
          gbpReviewsCount: curM?.gbpReviewsCount !== null && curM?.gbpReviewsCount !== undefined ? String(curM.gbpReviewsCount) : '',
        }
      }
      setLocationFormData(initialLocForm)
      setPrevLocationRecords(prevLocsRecordObj)
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

  const handleLocationInputChange = (locationId: string, key: string, value: string) => {
    setLocationFormData((prev) => ({
      ...prev,
      [locationId]: {
        ...(prev[locationId] || {}),
        [key]: value,
      },
    }))
  }

  const handleCancelEdit = () => {
    if (currentRecord) {
      const initialForm: Record<string, string> = {}
      for (const field of METRIC_FIELDS) {
        const val = (currentRecord as any)[field.key]
        initialForm[field.key] = val !== null && val !== undefined ? String(val) : ''
      }
      setFormData(initialForm)
    } else {
      setFormData({})
    }
    setIsEditing(false)
  }

  // Quick navigation buttons
  const handleQuickMonth = (target: 'prev' | 'current') => {
    const curMonth = now.getMonth() + 1
    const curYear = now.getFullYear()
    if (target === 'current') {
      setMonth(curMonth)
      setYear(curYear)
    } else {
      const pm = curMonth === 1 ? 12 : curMonth - 1
      const py = curMonth === 1 ? curYear - 1 : curYear
      setMonth(pm)
      setYear(py)
    }
  }

  // Detect >50% discrepancies against previous month
  const flaggedDiscrepancies = useMemo(() => {
    if (!prevRecord) return []
    const flagged: Array<{
      field: MetricFieldConfig
      enteredVal: number
      prevVal: number
      diffPercent: number
      message: string
    }> = []

    for (const field of METRIC_FIELDS) {
      const valStr = formData[field.key]
      if (valStr === undefined || valStr.trim() === '') continue
      const enteredVal = Number(valStr)
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
        // Enforce null for disconnected sources
        if (field.category in clientDataSources && clientDataSources[field.category] !== 'connected') {
          ;(payload as any)[field.key] = null
          continue
        }

        const str = formData[field.key]
        if (str !== undefined && str.trim() !== '') {
          const num = Number(str)
          ;(payload as any)[field.key] = isNaN(num) ? null : num
        } else {
          ;(payload as any)[field.key] = null
        }
      }

      // If client has configured locations, attach per-location metrics
      if (locations.length > 0) {
        const locPayloads: LocationMonthlyMetricsInput[] = []
        for (const loc of locations) {
          const locFields = locationFormData[loc.id] || {}
          const parseNum = (v?: string) => {
            if (!v || v.trim() === '') return null
            const n = Number(v)
            return isNaN(n) ? null : n
          }

          locPayloads.push({
            locationId: loc.id,
            gbpCalls: parseNum(locFields.gbpCalls),
            gbpDirections: parseNum(locFields.gbpDirections),
            gbpWebsiteClicks: parseNum(locFields.gbpWebsiteClicks),
            gbpViews: parseNum(locFields.gbpViews),
            gbpRating: parseNum(locFields.gbpRating),
            gbpReviewsCount: parseNum(locFields.gbpReviewsCount),
          })
        }
        payload.locationMetrics = locPayloads
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
      setIsEditing(false)
      loadMetrics(selectedClientId, month, year)
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Failed to update monthly metrics')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Discrepancy Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Verify Significant Month-over-Month Discrepancies"
        variant="warning"
        description={
          <div className="space-y-3">
            <p className="text-xs leading-relaxed">
              The following values deviate by more than <strong>50%</strong> from the prior month's performance record.
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-[6px] border border-amber-200 dark:border-amber-800/60 text-[11px]">
              {flaggedDiscrepancies.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">{f.field.label}:</span>
                  <span className="font-mono">
                    Prior: {f.prevVal} → Entered: {f.enteredVal} ({f.diffPercent > 0 ? '+' : ''}{f.diffPercent.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--muted)]">
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
      <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--panel)] border border-[var(--line)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold text-[var(--ink)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                <span>Monthly KPI Entry & Performance Metrics</span>
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                isEditing
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-[var(--canvas)] text-[var(--muted)] border-[var(--line)]'
              }`}>
                {isEditing ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{isEditing ? 'Editing Mode Active' : 'View / Locked'}</span>
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              Record living search, traffic, and local SEO metrics. Inputs are protected against accidental edits.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={!selectedClientId || isLoading}
                className="h-9 inline-flex items-center gap-1.5 px-4 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Metrics</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="h-9 inline-flex items-center gap-1 px-3.5 rounded-full text-[12px] font-medium bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={isSaving || !selectedClientId}
                  className="h-9 inline-flex items-center gap-1.5 px-4 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Metrics'}</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleQuickMonth('prev')}
              className="h-9 px-3.5 rounded-full text-[12px] font-medium bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
            >
              Prior Month
            </button>
            <button
              type="button"
              onClick={() => handleQuickMonth('current')}
              className="h-9 px-3.5 rounded-full text-[12px] font-medium bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
            >
              Current Month
            </button>
            <button
              type="button"
              onClick={() => loadMetrics(selectedClientId, month, year)}
              disabled={isLoading || !selectedClientId}
              className="h-9 w-9 flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
              title="Refresh values"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[var(--accent)]' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 border-t border-[var(--line)]">
          {/* Client Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
              Client Account
            </label>
            {initialClientId ? (
              <div className="flex items-center gap-2 h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium text-[var(--ink)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="truncate">{clientInfo?.businessName || 'Selected Client'}</span>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)]"
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
            <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
              Reporting Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)]"
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
            <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)]"
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
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] bg-[var(--canvas)] p-2 rounded-[6px] border border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            <span>
              Target Month: <strong className="text-[var(--ink)]">{MONTH_NAMES[month - 1]} {year}</strong>
            </span>
            <span className="text-[var(--line)]">•</span>
            <span>
              {currentRecord ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Saved Record (Updated {new Date(currentRecord.updatedAt).toLocaleDateString()})
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  No Entries Yet
                </span>
              )}
            </span>
          </div>

          <div>
            <span>Reference Baseline: </span>
            <strong className="text-[var(--ink)]">
              {MONTH_NAMES[month === 1 ? 11 : month - 2]} {month === 1 ? year - 1 : year}
            </strong>{' '}
            ({prevRecord ? 'Data present' : 'No prior data'})
          </div>
        </div>
      </div>

      {/* Discrepancy Global Alert Banner if any >50% warnings */}
      {flaggedDiscrepancies.length > 0 && (
        <div className="p-3.5 rounded-[8px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[12px] font-semibold text-amber-900 dark:text-amber-200">
              Attention: {flaggedDiscrepancies.length} metric{flaggedDiscrepancies.length > 1 ? 's' : ''} deviate by &gt;50% from the prior month
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Significant month-over-month swings have been flagged below with warning badges. Please verify before saving.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Entry Form */}
      <form onSubmit={handleSaveClick} className="space-y-4">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1. Google Search Console */}
          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[6px] bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-[var(--ink)]">Google Search Console (GSC)</h3>
                  <p className="text-[11px] text-[var(--muted)]">Search impressions, clicks, CTR, and SERP positions</p>
                </div>
              </div>
              {clientDataSources.gsc !== 'connected' && (
                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold ${
                  clientDataSources.gsc === 'no_access'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
                }`}>
                  {clientDataSources.gsc === 'no_access' ? 'No Access' : 'Not Applicable'}
                </span>
              )}
            </div>

            {clientDataSources.gsc !== 'connected' ? (
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                  <Info className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Access Not Configured ({clientDataSources.gsc === 'no_access' ? 'No Access' : 'Not Applicable'})</span>
                </div>
                <p className="leading-relaxed">
                  Search Console metrics are excluded for this client and saved as unmeasured (NULL).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {METRIC_FIELDS.filter((f) => f.category === 'gsc').map((field) => (
                  <MetricInputRow
                    key={field.key}
                    field={field}
                    isEditing={isEditing}
                    value={formData[field.key] || ''}
                    prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                    onChange={(val) => handleInputChange(field.key, val)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. Google Analytics 4 */}
          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[6px] bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-[var(--ink)]">Google Analytics 4 (GA4)</h3>
                  <p className="text-[11px] text-[var(--muted)]">Sessions, unique users, pageviews, and engagement rate</p>
                </div>
              </div>
              {clientDataSources.ga4 !== 'connected' && (
                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold ${
                  clientDataSources.ga4 === 'no_access'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
                }`}>
                  {clientDataSources.ga4 === 'no_access' ? 'No Access' : 'Not Applicable'}
                </span>
              )}
            </div>

            {clientDataSources.ga4 !== 'connected' ? (
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                  <Info className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Access Not Configured ({clientDataSources.ga4 === 'no_access' ? 'No Access' : 'Not Applicable'})</span>
                </div>
                <p className="leading-relaxed">
                  Google Analytics metrics are excluded for this client and saved as unmeasured (NULL).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {METRIC_FIELDS.filter((f) => f.category === 'ga4').map((field) => (
                  <MetricInputRow
                    key={field.key}
                    field={field}
                    isEditing={isEditing}
                    value={formData[field.key] || ''}
                    prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                    onChange={(val) => handleInputChange(field.key, val)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 3. Google Business Profile */}
          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-[var(--ink)]">Google Business Profile (GBP)</h3>
                  <p className="text-[11px] text-[var(--muted)]">Local map calls, directions, website clicks, and reviews</p>
                </div>
              </div>
              {clientDataSources.gbp !== 'connected' && (
                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold ${
                  clientDataSources.gbp === 'no_access'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
                }`}>
                  {clientDataSources.gbp === 'no_access' ? 'No Access' : 'Not Applicable'}
                </span>
              )}
            </div>

            {clientDataSources.gbp !== 'connected' ? (
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--muted)] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                  <Info className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Access Not Configured ({clientDataSources.gbp === 'no_access' ? 'No Access' : 'Not Applicable'})</span>
                </div>
                <p className="leading-relaxed">
                  Google Business Profile metrics are excluded for this client and saved as unmeasured (NULL).
                </p>
              </div>
            ) : locations.length > 1 ? (
              /* Multi-Location Rendering: One sub-card per active location */
              <div className="space-y-3.5">
                <div className="p-2.5 rounded-[6px] bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300">
                  Tracking <strong>{locations.length}</strong> GBP locations. Figures roll up automatically into the client report.
                </div>

                {locations.map((loc) => {
                  const locFields = locationFormData[loc.id] || {}
                  const prevLoc = prevLocationRecords[loc.id]
                  const locConnected = loc.accessStatus === 'connected'

                  return (
                    <div
                      key={loc.id}
                      className="p-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)]/50 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-[var(--line)]">
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-semibold text-[var(--ink)] truncate" title={loc.name}>
                            {loc.name}
                          </h4>
                          {loc.address && (
                            <p className="text-[10px] text-[var(--muted)] truncate">{loc.address}</p>
                          )}
                        </div>
                        <span
                          className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold shrink-0 ${
                            loc.accessStatus === 'connected'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : loc.accessStatus === 'no_access'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
                          }`}
                        >
                          {loc.accessStatus === 'connected' ? 'Connected' : loc.accessStatus === 'no_access' ? 'No Access' : 'N/A'}
                        </span>
                      </div>

                      {!locConnected ? (
                        <div className="p-2 rounded-[4px] bg-[var(--canvas)] text-[11px] text-[var(--muted)] italic">
                          Profile access marked as {loc.accessStatus === 'no_access' ? 'No Access' : 'Not Applicable'}.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {METRIC_FIELDS.filter((f) => f.category === 'gbp').map((field) => (
                            <MetricInputRow
                              key={field.key}
                              field={field}
                              isEditing={isEditing}
                              value={locFields[field.key] || ''}
                              prevVal={prevLoc ? prevLoc[field.key] : null}
                              onChange={(val) => handleLocationInputChange(loc.id, field.key, val)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {METRIC_FIELDS.filter((f) => f.category === 'gbp').map((field) => (
                  <MetricInputRow
                    key={field.key}
                    field={field}
                    isEditing={isEditing}
                    value={formData[field.key] || ''}
                    prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                    onChange={(val) => handleInputChange(field.key, val)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. SEMrush Domain Authority & Keywords */}
          <div className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--line)]">
              <div className="p-1.5 rounded-[6px] bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--ink)]">SEMrush Authority & Scope</h3>
                <p className="text-[11px] text-[var(--muted)]">Domain authority score and total ranked keywords</p>
              </div>
            </div>

            <div className="space-y-3">
              {METRIC_FIELDS.filter((f) => f.category === 'semrush').map((field) => (
                <MetricInputRow
                  key={field.key}
                  field={field}
                  isEditing={isEditing}
                  value={formData[field.key] || ''}
                  prevVal={prevRecord ? (prevRecord as any)[field.key] : null}
                  onChange={(val) => handleInputChange(field.key, val)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xs flex items-center justify-between flex-wrap gap-2">
          <div className="text-[11px] font-mono text-[var(--muted)]">
            {flaggedDiscrepancies.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {flaggedDiscrepancies.length} input warning{flaggedDiscrepancies.length > 1 ? 's' : ''} require confirmation
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All inputs within normal MoM baseline bounds
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={!selectedClientId || isLoading}
                className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[12px] font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Metrics</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="h-8 inline-flex items-center gap-1 px-3 rounded-[6px] text-[12px] font-medium bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !selectedClientId}
                  className={`h-8 inline-flex items-center gap-1.5 px-4 rounded-[6px] text-[12px] font-semibold text-white transition cursor-pointer shadow-xs ${
                    flaggedDiscrepancies.length > 0
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-[var(--accent)] hover:opacity-90'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {isSaving
                      ? 'Saving Metrics...'
                      : flaggedDiscrepancies.length > 0
                      ? `Review & Save (${flaggedDiscrepancies.length} Warnings)`
                      : 'Save Monthly Metrics'}
                  </span>
                </button>
              </>
            )}
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
  isEditing,
  onChange,
}: {
  field: MetricFieldConfig
  value: string
  prevVal: number | null | undefined
  isEditing: boolean
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
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <label className="font-semibold text-[var(--ink)]">
          {field.label}
        </label>
        {/* Previous Month Reference Display */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-[var(--muted)]">
            Prior: {hasPrior ? prevVal : '—'}
            {hasPrior && field.unit ? field.unit : ''}
          </span>
          {diffPercent !== null && (
            <span
              className={`px-1.5 py-0.2 rounded-[3px] text-[9px] font-bold ${
                diffPercent > 0
                  ? field.invertDeltaColor
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : diffPercent < 0
                  ? field.invertDeltaColor
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]'
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
          disabled={!isEditing}
          readOnly={!isEditing}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hasPrior ? `Prior: ${prevVal}` : '—'}
          className={`w-full h-8 px-2.5 rounded-[6px] text-[12px] font-mono font-medium transition ${
            !isEditing
              ? 'bg-[var(--canvas)] text-[var(--muted)] cursor-not-allowed border border-[var(--line)] opacity-85'
              : isLargeDiscrepancy
              ? 'border-amber-500 bg-[var(--panel)] text-amber-700 dark:text-amber-300 focus:outline-hidden focus:border-amber-500'
              : 'border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)]'
          }`}
        />
        {field.unit && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[var(--muted)] font-mono">
            {field.unit}
          </span>
        )}
      </div>

      {/* Inline Warning for >50% deviation */}
      {isLargeDiscrepancy && diffPercent !== null && (
        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 pt-0.5">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>
            ⚠️ {Math.abs(Math.round(diffPercent))}% MoM swing (Prior: {prevVal} vs {enteredNum}). Verify.
          </span>
        </div>
      )}
    </div>
  )
}
