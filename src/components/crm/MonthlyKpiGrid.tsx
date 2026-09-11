import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  BarChart3,
  Calendar,
  Save,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Search,
  Building2,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react'
import {
  getMonthlyKpiGridServerFn,
  saveMonthlyKpiRowServerFn,
  type KpiGridClientRow,
  type KpiGridLocationRow,
  type DataSourceStatus,
} from '../../server/workflow'
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

export interface MonthlyKpiGridProps {
  initialMonth?: number
  initialYear?: number
  month?: number
  year?: number
  partnerId?: string
  onMonthChange?: (month: number, year: number) => void
}

interface ClientRowFormState {
  clientId: string
  isDirty: boolean
  isSaving: boolean
  saveStatus: 'idle' | 'saved' | 'saving' | 'error'
  errorMessage?: string
  metrics: {
    gscClicks: string
    gscImpressions: string
    gscCtr: string
    gscPosition: string
    gaSessions: string
    gaUsers: string
    gaViews: string
    gaEngagementRate: string
    gbpCalls: string
    gbpDirections: string
    gbpWebsiteClicks: string
    gbpRating: string
    gbpReviewsCount: string
  }
  locations: Record<
    string,
    {
      gbpCalls: string
      gbpDirections: string
      gbpWebsiteClicks: string
      gbpRating: string
      gbpReviewsCount: string
    }
  >
}

export function MonthlyKpiGrid({
  initialMonth,
  initialYear,
  month: propMonth,
  year: propYear,
  partnerId,
  onMonthChange,
}: MonthlyKpiGridProps) {
  const now = new Date()
  const [month, setMonth] = useState(propMonth || initialMonth || now.getUTCMonth() + 1)
  const [year, setYear] = useState(propYear || initialYear || now.getUTCFullYear())

  useEffect(() => {
    if (propMonth && propMonth !== month) {
      setMonth(propMonth)
    }
  }, [propMonth])

  useEffect(() => {
    if (propYear && propYear !== year) {
      setYear(propYear)
    }
  }, [propYear])

  const [data, setData] = useState<KpiGridClientRow[]>([])
  const [rowStates, setRowStates] = useState<Record<string, ClientRowFormState>>({})
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  // Load KPI Grid data
  const loadData = async () => {
    setIsLoading(true)
    try {
      const res = await getMonthlyKpiGridServerFn({
        data: { month, year, partnerId },
      })
      setData(res.rows)

      // Initialize form state
      const initialStates: Record<string, ClientRowFormState> = {}
      for (const row of res.rows) {
        const locState: Record<string, any> = {}
        for (const loc of row.locations) {
          locState[loc.locationId] = {
            gbpCalls: loc.gbpCalls !== null ? String(loc.gbpCalls) : '',
            gbpDirections: loc.gbpDirections !== null ? String(loc.gbpDirections) : '',
            gbpWebsiteClicks: loc.gbpWebsiteClicks !== null ? String(loc.gbpWebsiteClicks) : '',
            gbpRating: loc.gbpRating !== null ? String(loc.gbpRating) : '',
            gbpReviewsCount: loc.gbpReviewsCount !== null ? String(loc.gbpReviewsCount) : '',
          }
        }

        initialStates[row.clientId] = {
          clientId: row.clientId,
          isDirty: false,
          isSaving: false,
          saveStatus: 'idle',
          metrics: {
            gscClicks: row.metrics.gscClicks !== null ? String(row.metrics.gscClicks) : '',
            gscImpressions: row.metrics.gscImpressions !== null ? String(row.metrics.gscImpressions) : '',
            gscCtr: row.metrics.gscCtr !== null ? String(row.metrics.gscCtr) : '',
            gscPosition: row.metrics.gscPosition !== null ? String(row.metrics.gscPosition) : '',
            gaSessions: row.metrics.gaSessions !== null ? String(row.metrics.gaSessions) : '',
            gaUsers: row.metrics.gaUsers !== null ? String(row.metrics.gaUsers) : '',
            gaViews: row.metrics.gaViews !== null ? String(row.metrics.gaViews) : '',
            gaEngagementRate: row.metrics.gaEngagementRate !== null ? String(row.metrics.gaEngagementRate) : '',
            gbpCalls: row.metrics.gbpCalls !== null ? String(row.metrics.gbpCalls) : '',
            gbpDirections: row.metrics.gbpDirections !== null ? String(row.metrics.gbpDirections) : '',
            gbpWebsiteClicks: row.metrics.gbpWebsiteClicks !== null ? String(row.metrics.gbpWebsiteClicks) : '',
            gbpRating: row.metrics.gbpRating !== null ? String(row.metrics.gbpRating) : '',
            gbpReviewsCount: row.metrics.gbpReviewsCount !== null ? String(row.metrics.gbpReviewsCount) : '',
          },
          locations: locState,
        }
      }
      setRowStates(initialStates)
    } catch (err: unknown) {
      addToast('error', 'Error', 'Failed to load monthly KPI grid')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [month, year, partnerId])

  // Filtered rows
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter(
      (r) =>
        r.businessName.toLowerCase().includes(q) ||
        (r.websiteUrl && r.websiteUrl.toLowerCase().includes(q))
    )
  }, [data, searchQuery])

  // Toggle multi-location expansion
  const toggleExpand = (clientId: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev)
      if (next.has(clientId)) {
        next.delete(clientId)
      } else {
        next.add(clientId)
      }
      return next
    })
  }

  // Handle client-level input change
  const handleClientMetricChange = (
    clientId: string,
    field: keyof ClientRowFormState['metrics'],
    value: string
  ) => {
    setRowStates((prev) => {
      const current = prev[clientId]
      if (!current) return prev
      return {
        ...prev,
        [clientId]: {
          ...current,
          isDirty: true,
          saveStatus: 'idle',
          metrics: {
            ...current.metrics,
            [field]: value,
          },
        },
      }
    })
  }

  // Handle location-level input change & calculate rollup
  const handleLocationMetricChange = (
    clientId: string,
    locationId: string,
    field: string,
    value: string
  ) => {
    setRowStates((prev) => {
      const current = prev[clientId]
      if (!current) return prev
      const currentLoc = current.locations[locationId] || {
        gbpCalls: '',
        gbpDirections: '',
        gbpWebsiteClicks: '',
        gbpRating: '',
        gbpReviewsCount: '',
      }

      const updatedLocations = {
        ...current.locations,
        [locationId]: {
          ...currentLoc,
          [field]: value,
        },
      }

      // Compute rollup totals for connected locations
      const clientRow = data.find((c) => c.clientId === clientId)
      let sumCalls = 0
      let hasCalls = false
      let sumDirections = 0
      let hasDirections = false
      let sumClicks = 0
      let hasClicks = false
      let sumReviews = 0
      let hasReviews = false
      let ratingWeighted = 0
      let ratingCount = 0

      if (clientRow && clientRow.locations.length > 0) {
        for (const loc of clientRow.locations) {
          if (loc.accessStatus !== 'connected') continue
          const locValues = updatedLocations[loc.locationId]
          if (!locValues) continue

          if (locValues.gbpCalls.trim() !== '') {
            sumCalls += parseInt(locValues.gbpCalls, 10) || 0
            hasCalls = true
          }
          if (locValues.gbpDirections.trim() !== '') {
            sumDirections += parseInt(locValues.gbpDirections, 10) || 0
            hasDirections = true
          }
          if (locValues.gbpWebsiteClicks.trim() !== '') {
            sumClicks += parseInt(locValues.gbpWebsiteClicks, 10) || 0
            hasClicks = true
          }
          if (locValues.gbpReviewsCount.trim() !== '') {
            sumReviews += parseInt(locValues.gbpReviewsCount, 10) || 0
            hasReviews = true
          }
          if (locValues.gbpRating.trim() !== '') {
            const r = parseFloat(locValues.gbpRating)
            if (!isNaN(r)) {
              ratingWeighted += r
              ratingCount++
            }
          }
        }
      }

      const updatedParentMetrics = { ...current.metrics }
      if (hasCalls) updatedParentMetrics.gbpCalls = String(sumCalls)
      if (hasDirections) updatedParentMetrics.gbpDirections = String(sumDirections)
      if (hasClicks) updatedParentMetrics.gbpWebsiteClicks = String(sumClicks)
      if (hasReviews) updatedParentMetrics.gbpReviewsCount = String(sumReviews)
      if (ratingCount > 0) {
        updatedParentMetrics.gbpRating = (ratingWeighted / ratingCount).toFixed(1)
      }

      return {
        ...prev,
        [clientId]: {
          ...current,
          isDirty: true,
          saveStatus: 'idle',
          metrics: updatedParentMetrics,
          locations: updatedLocations,
        },
      }
    })
  }

  // Save a single client's row
  const handleSaveRow = async (clientId: string) => {
    const rowState = rowStates[clientId]
    const clientRow = data.find((c) => c.clientId === clientId)
    if (!rowState || !clientRow) return

    setRowStates((prev) => ({
      ...prev,
      [clientId]: { ...prev[clientId], isSaving: true, saveStatus: 'saving' },
    }))

    try {
      const parseNum = (val: string) => (val.trim() === '' ? null : Number(val))
      const parseDec = (val: string) => (val.trim() === '' ? null : Number(val))

      const locationMetricsPayload = clientRow.locations.map((loc) => {
        const locVals = rowState.locations[loc.locationId] || {
          gbpCalls: '',
          gbpDirections: '',
          gbpWebsiteClicks: '',
          gbpRating: '',
          gbpReviewsCount: '',
        }
        return {
          locationId: loc.locationId,
          gbpCalls: parseNum(locVals.gbpCalls),
          gbpDirections: parseNum(locVals.gbpDirections),
          gbpWebsiteClicks: parseNum(locVals.gbpWebsiteClicks),
          gbpRating: parseDec(locVals.gbpRating),
          gbpReviewsCount: parseNum(locVals.gbpReviewsCount),
        }
      })

      await saveMonthlyKpiRowServerFn({
        data: {
          clientId,
          month,
          year,
          metrics: {
            gscClicks: clientRow.dataSources.gsc === 'connected' ? parseNum(rowState.metrics.gscClicks) : null,
            gscImpressions: clientRow.dataSources.gsc === 'connected' ? parseNum(rowState.metrics.gscImpressions) : null,
            gscCtr: clientRow.dataSources.gsc === 'connected' ? parseDec(rowState.metrics.gscCtr) : null,
            gscPosition: clientRow.dataSources.gsc === 'connected' ? parseDec(rowState.metrics.gscPosition) : null,
            gaSessions: clientRow.dataSources.ga4 === 'connected' ? parseNum(rowState.metrics.gaSessions) : null,
            gaUsers: clientRow.dataSources.ga4 === 'connected' ? parseNum(rowState.metrics.gaUsers) : null,
            gaViews: clientRow.dataSources.ga4 === 'connected' ? parseNum(rowState.metrics.gaViews) : null,
            gaEngagementRate: clientRow.dataSources.ga4 === 'connected' ? parseDec(rowState.metrics.gaEngagementRate) : null,
            gbpCalls: clientRow.dataSources.gbp === 'connected' ? parseNum(rowState.metrics.gbpCalls) : null,
            gbpDirections: clientRow.dataSources.gbp === 'connected' ? parseNum(rowState.metrics.gbpDirections) : null,
            gbpWebsiteClicks: clientRow.dataSources.gbp === 'connected' ? parseNum(rowState.metrics.gbpWebsiteClicks) : null,
            gbpRating: clientRow.dataSources.gbp === 'connected' ? parseDec(rowState.metrics.gbpRating) : null,
            gbpReviewsCount: clientRow.dataSources.gbp === 'connected' ? parseNum(rowState.metrics.gbpReviewsCount) : null,
            locationMetrics: locationMetricsPayload.length > 0 ? locationMetricsPayload : undefined,
          },
        },
      })

      setRowStates((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          isDirty: false,
          isSaving: false,
          saveStatus: 'saved',
        },
      }))

      addToast('success', 'Saved', `KPI metrics for ${clientRow.businessName} saved successfully.`)
    } catch (err: unknown) {
      setRowStates((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          isSaving: false,
          saveStatus: 'error',
          errorMessage: err instanceof Error ? err.message : 'Save failed',
        },
      }))
      addToast('error', 'Save Failed', err instanceof Error ? err.message : 'Failed to save KPI metrics.')
    }
  }

  // Save all dirty rows
  const handleSaveAllDirty = async () => {
    const dirtyClientIds = Object.keys(rowStates).filter((id) => rowStates[id].isDirty)
    if (dirtyClientIds.length === 0) return

    for (const id of dirtyClientIds) {
      await handleSaveRow(id)
    }
  }

  const dirtyCount = Object.values(rowStates).filter((s) => s.isDirty).length

  return (
    <div className="space-y-4">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Action Toolbar */}
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

          <div className="text-[12px] text-[var(--muted)]">
            <span>{filteredRows.length} client{filteredRows.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dirtyCount > 0 && (
            <button
              type="button"
              onClick={handleSaveAllDirty}
              className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--accent)] text-white hover:opacity-90 shadow-2xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save All ({dirtyCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer disabled:opacity-50"
            title="Refresh grid data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--muted)] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Data Grid */}
      <div className="w-full overflow-x-auto rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          {/* Header */}
          <thead className="bg-[var(--canvas)]/90 sticky top-0 z-10 border-b border-[var(--line)] backdrop-blur-xs select-none">
            {/* Super Header */}
            <tr className="border-b border-[var(--line)]/50 text-[11px] font-medium text-[var(--muted)]">
              <th className="px-3.5 py-1.5 w-64" colSpan={2}>
                Client & Locations
              </th>
              <th className="px-3 py-1.5 text-center border-l border-[var(--line)]/50" colSpan={4}>
                Google Search Console
              </th>
              <th className="px-3 py-1.5 text-center border-l border-[var(--line)]/50" colSpan={4}>
                Google Analytics 4
              </th>
              <th className="px-3 py-1.5 text-center border-l border-[var(--line)]/50" colSpan={5}>
                Google Business Profile
              </th>
              <th className="px-3 py-1.5 text-right w-24 border-l border-[var(--line)]/50">
                Action
              </th>
            </tr>

            {/* Column Header */}
            <tr className="text-[12px] font-medium text-[var(--muted)]">
              <th className="px-3.5 py-2 w-48">Client</th>
              <th className="px-2 py-2 w-20 text-center">Status</th>

              {/* GSC */}
              <th className="px-2 py-2 w-24 text-right border-l border-[var(--line)]/50">Clicks</th>
              <th className="px-2 py-2 w-24 text-right">Impr.</th>
              <th className="px-2 py-2 w-20 text-right">CTR %</th>
              <th className="px-2 py-2 w-20 text-right">Avg Pos</th>

              {/* GA4 */}
              <th className="px-2 py-2 w-24 text-right border-l border-[var(--line)]/50">Sessions</th>
              <th className="px-2 py-2 w-24 text-right">Users</th>
              <th className="px-2 py-2 w-24 text-right">Pageviews</th>
              <th className="px-2 py-2 w-20 text-right">Engage %</th>

              {/* GBP */}
              <th className="px-2 py-2 w-24 text-right border-l border-[var(--line)]/50">Calls</th>
              <th className="px-2 py-2 w-24 text-right">Direct.</th>
              <th className="px-2 py-2 w-24 text-right">Web Clicks</th>
              <th className="px-2 py-2 w-20 text-right">Rating</th>
              <th className="px-2 py-2 w-20 text-right">Reviews</th>

              {/* Actions */}
              <th className="px-3 py-2 text-right border-l border-[var(--line)]/50">Save</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--line)]/50 text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={16} className="px-4 py-16 text-center text-[var(--muted)]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    <span>Loading KPI grid records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={16} className="px-4 py-16 text-center text-[var(--muted)]">
                  No clients found for this filter.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const state = rowStates[row.clientId] || {
                  clientId: row.clientId,
                  isDirty: false,
                  isSaving: false,
                  saveStatus: 'idle',
                  metrics: {
                    gscClicks: '',
                    gscImpressions: '',
                    gscCtr: '',
                    gscPosition: '',
                    gaSessions: '',
                    gaUsers: '',
                    gaViews: '',
                    gaEngagementRate: '',
                    gbpCalls: '',
                    gbpDirections: '',
                    gbpWebsiteClicks: '',
                    gbpRating: '',
                    gbpReviewsCount: '',
                  },
                  locations: {},
                }

                const isExpanded = expandedClients.has(row.clientId)
                const hasLocations = row.locations.length > 0
                const gscDisabled = row.dataSources.gsc === 'no_access'
                const ga4Disabled = row.dataSources.ga4 === 'no_access'
                const gbpDisabled = row.dataSources.gbp === 'no_access'

                return (
                  <React.Fragment key={row.clientId}>
                    {/* Primary Client Row */}
                    <tr
                      className={`group transition-colors ${
                        state.isDirty ? 'bg-[var(--accent)]/5' : 'hover:bg-[var(--line)]/10'
                      }`}
                    >
                      {/* Client Name & Expand Button */}
                      <td className="px-3.5 py-2.5 font-medium text-[var(--ink)]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {hasLocations ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(row.clientId)}
                              className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer shrink-0"
                              title={isExpanded ? 'Collapse locations' : 'Expand locations'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[var(--accent)]" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <div className="w-5 shrink-0" />
                          )}

                          <div className="min-w-0">
                            <div className="truncate font-semibold text-[13px]">{row.businessName}</div>
                            {hasLocations && (
                              <div className="text-[11px] text-[var(--muted)]">
                                {row.locations.length} location{row.locations.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Row Save Status */}
                      <td className="px-2 py-2 text-center shrink-0">
                        {state.isSaving ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
                            <div className="w-3 h-3 rounded-full border border-[var(--accent)] border-t-transparent animate-spin" />
                          </span>
                        ) : state.isDirty ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            ● Unsaved
                          </span>
                        ) : state.saveStatus === 'saved' || row.isSaved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-[11px] text-[var(--muted)]/60">—</span>
                        )}
                      </td>

                      {/* GSC Clicks */}
                      <td className="px-1 py-1.5 border-l border-[var(--line)]/50">
                        {gscDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gscClicks}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gscClicks', v)}
                            placeholder="0"
                          />
                        )}
                      </td>

                      {/* GSC Impressions */}
                      <td className="px-1 py-1.5">
                        {gscDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gscImpressions}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gscImpressions', v)}
                            placeholder="0"
                          />
                        )}
                      </td>

                      {/* GSC CTR */}
                      <td className="px-1 py-1.5">
                        {gscDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gscCtr}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gscCtr', v)}
                            placeholder="0.0"
                            step="0.01"
                          />
                        )}
                      </td>

                      {/* GSC Position */}
                      <td className="px-1 py-1.5">
                        {gscDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gscPosition}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gscPosition', v)}
                            placeholder="0.0"
                            step="0.1"
                          />
                        )}
                      </td>

                      {/* GA4 Sessions */}
                      <td className="px-1 py-1.5 border-l border-[var(--line)]/50">
                        {ga4Disabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gaSessions}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gaSessions', v)}
                            placeholder="0"
                          />
                        )}
                      </td>

                      {/* GA4 Users */}
                      <td className="px-1 py-1.5">
                        {ga4Disabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gaUsers}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gaUsers', v)}
                            placeholder="0"
                          />
                        )}
                      </td>

                      {/* GA4 Views */}
                      <td className="px-1 py-1.5">
                        {ga4Disabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gaViews}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gaViews', v)}
                            placeholder="0"
                          />
                        )}
                      </td>

                      {/* GA4 Engagement Rate */}
                      <td className="px-1 py-1.5">
                        {ga4Disabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gaEngagementRate}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gaEngagementRate', v)}
                            placeholder="0.0"
                            step="0.01"
                          />
                        )}
                      </td>

                      {/* GBP Calls */}
                      <td className="px-1 py-1.5 border-l border-[var(--line)]/50">
                        {gbpDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gbpCalls}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gbpCalls', v)}
                            placeholder="0"
                            readOnly={hasLocations}
                            title={hasLocations ? 'Calculated from location entries below' : undefined}
                          />
                        )}
                      </td>

                      {/* GBP Directions */}
                      <td className="px-1 py-1.5">
                        {gbpDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gbpDirections}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gbpDirections', v)}
                            placeholder="0"
                            readOnly={hasLocations}
                            title={hasLocations ? 'Calculated from location entries below' : undefined}
                          />
                        )}
                      </td>

                      {/* GBP Website Clicks */}
                      <td className="px-1 py-1.5">
                        {gbpDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gbpWebsiteClicks}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gbpWebsiteClicks', v)}
                            placeholder="0"
                            readOnly={hasLocations}
                            title={hasLocations ? 'Calculated from location entries below' : undefined}
                          />
                        )}
                      </td>

                      {/* GBP Rating */}
                      <td className="px-1 py-1.5">
                        {gbpDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gbpRating}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gbpRating', v)}
                            placeholder="5.0"
                            step="0.1"
                            readOnly={hasLocations}
                            title={hasLocations ? 'Calculated from location entries below' : undefined}
                          />
                        )}
                      </td>

                      {/* GBP Reviews */}
                      <td className="px-1 py-1.5">
                        {gbpDisabled ? (
                          <NoAccessBadge />
                        ) : (
                          <NumericInput
                            value={state.metrics.gbpReviewsCount}
                            onChange={(v) => handleClientMetricChange(row.clientId, 'gbpReviewsCount', v)}
                            placeholder="0"
                            readOnly={hasLocations}
                            title={hasLocations ? 'Calculated from location entries below' : undefined}
                          />
                        )}
                      </td>

                      {/* Row Save Button */}
                      <td className="px-3 py-1.5 text-right border-l border-[var(--line)]/50">
                        <button
                          type="button"
                          disabled={!state.isDirty || state.isSaving}
                          onClick={() => handleSaveRow(row.clientId)}
                          className={`h-7 px-2.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer ${
                            state.isDirty
                              ? 'bg-[var(--accent)] text-white hover:opacity-90 shadow-2xs'
                              : 'bg-[var(--line)]/30 text-[var(--muted)] opacity-50 cursor-not-allowed'
                          }`}
                          title="Save changes for this client"
                        >
                          Save
                        </button>
                      </td>
                    </tr>

                    {/* Multi-Location Sub-Rows */}
                    {hasLocations &&
                      isExpanded &&
                      row.locations.map((loc) => {
                        const locDisabled = loc.accessStatus === 'no_access' || gbpDisabled
                        const locValues = state.locations[loc.locationId] || {
                          gbpCalls: '',
                          gbpDirections: '',
                          gbpWebsiteClicks: '',
                          gbpRating: '',
                          gbpReviewsCount: '',
                        }

                        return (
                          <tr
                            key={loc.locationId}
                            className="bg-[var(--canvas)]/40 hover:bg-[var(--line)]/20 transition-colors text-[12px]"
                          >
                            {/* Location Name */}
                            <td className="pl-9 pr-3.5 py-1.5 font-medium text-[var(--muted)]">
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                                <span className="truncate">{loc.locationName}</span>
                                {loc.address && <span className="text-[10px] text-[var(--muted)]/70">({loc.address})</span>}
                              </div>
                            </td>

                            {/* Location Status */}
                            <td className="px-2 py-1.5 text-center text-[10px] text-[var(--muted)]">
                              Location
                            </td>

                            {/* GSC Columns (N/A for location level) */}
                            <td colSpan={4} className="px-2 py-1.5 text-center text-[11px] text-[var(--muted)]/40 border-l border-[var(--line)]/50">
                              —
                            </td>

                            {/* GA4 Columns (N/A for location level) */}
                            <td colSpan={4} className="px-2 py-1.5 text-center text-[11px] text-[var(--muted)]/40 border-l border-[var(--line)]/50">
                              —
                            </td>

                            {/* Location GBP Calls */}
                            <td className="px-1 py-1.5 border-l border-[var(--line)]/50">
                              {locDisabled ? (
                                <NoAccessBadge />
                              ) : (
                                <NumericInput
                                  value={locValues.gbpCalls}
                                  onChange={(v) => handleLocationMetricChange(row.clientId, loc.locationId, 'gbpCalls', v)}
                                  placeholder="0"
                                />
                              )}
                            </td>

                            {/* Location GBP Directions */}
                            <td className="px-1 py-1.5">
                              {locDisabled ? (
                                <NoAccessBadge />
                              ) : (
                                <NumericInput
                                  value={locValues.gbpDirections}
                                  onChange={(v) => handleLocationMetricChange(row.clientId, loc.locationId, 'gbpDirections', v)}
                                  placeholder="0"
                                />
                              )}
                            </td>

                            {/* Location GBP Website Clicks */}
                            <td className="px-1 py-1.5">
                              {locDisabled ? (
                                <NoAccessBadge />
                              ) : (
                                <NumericInput
                                  value={locValues.gbpWebsiteClicks}
                                  onChange={(v) => handleLocationMetricChange(row.clientId, loc.locationId, 'gbpWebsiteClicks', v)}
                                  placeholder="0"
                                />
                              )}
                            </td>

                            {/* Location GBP Rating */}
                            <td className="px-1 py-1.5">
                              {locDisabled ? (
                                <NoAccessBadge />
                              ) : (
                                <NumericInput
                                  value={locValues.gbpRating}
                                  onChange={(v) => handleLocationMetricChange(row.clientId, loc.locationId, 'gbpRating', v)}
                                  placeholder="5.0"
                                  step="0.1"
                                />
                              )}
                            </td>

                            {/* Location GBP Reviews */}
                            <td className="px-1 py-1.5">
                              {locDisabled ? (
                                <NoAccessBadge />
                              ) : (
                                <NumericInput
                                  value={locValues.gbpReviewsCount}
                                  onChange={(v) => handleLocationMetricChange(row.clientId, loc.locationId, 'gbpReviewsCount', v)}
                                  placeholder="0"
                                />
                              )}
                            </td>

                            {/* Empty Action cell for location row */}
                            <td className="px-3 py-1.5 text-right border-l border-[var(--line)]/50 text-[10px] text-[var(--muted)]">
                              Included
                            </td>
                          </tr>
                        )
                      })}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NumericInput({
  value,
  onChange,
  placeholder = '',
  step,
  readOnly = false,
  title,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  step?: string
  readOnly?: boolean
  title?: string
}) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      title={title}
      className={`w-full h-7 px-2 text-right font-mono text-[12px] tabular-nums rounded-[4px] border border-[var(--line)]/70 bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition ${
        readOnly ? 'bg-[var(--canvas)] text-[var(--muted)] cursor-not-allowed border-dashed' : ''
      }`}
    />
  )
}

function NoAccessBadge() {
  return (
    <div
      className="w-full h-7 flex items-center justify-center gap-1 rounded-[4px] bg-[var(--line)]/20 text-[10px] font-medium text-[var(--muted)] select-none border border-[var(--line)]/40"
      title="Data Source configured as No Access in Track 1"
    >
      <Lock className="w-3 h-3 text-[var(--muted)]/60" />
      <span>No Access</span>
    </div>
  )
}
