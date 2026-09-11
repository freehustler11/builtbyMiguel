import React, { useState, useEffect } from 'react'
import {
  Search,
  BarChart3,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import {
  getClientDataSourcesServerFn,
  updateClientDataSourceServerFn,
  type ClientDataSourceItem,
  type DataSourceStatus,
} from '../../server/clients'
import { ToastContainer, type ToastMessage } from '../Toast'

interface DataSourcesBoardProps {
  clientId: string
}

interface SourceMeta {
  source: 'gsc' | 'ga4' | 'gbp'
  title: string
  shortName: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
}

const SOURCES: SourceMeta[] = [
  {
    source: 'gsc',
    title: 'Google Search Console',
    shortName: 'GSC',
    description: 'Organic search impressions, organic clicks, CTR, and SERP positions.',
    icon: Search,
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    source: 'ga4',
    title: 'Google Analytics 4',
    shortName: 'GA4',
    description: 'Sessions, unique users, pageviews, and engagement rate.',
    icon: BarChart3,
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    source: 'gbp',
    title: 'Google Business Profile',
    shortName: 'GBP',
    description: 'Local map listings, calls, direction requests, website clicks, and reviews.',
    icon: Building2,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
]

export function DataSourcesBoard({ clientId }: DataSourcesBoardProps) {
  const [sources, setSources] = useState<ClientDataSourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSource, setSavingSource] = useState<string | null>(null)
  const [formState, setFormState] = useState<
    Record<string, { status: DataSourceStatus; notes: string }>
  >({})
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  const loadDataSources = async () => {
    setLoading(true)
    try {
      const res = await getClientDataSourcesServerFn({ data: { clientId } })
      const list = res.dataSources || []
      setSources(list)

      const initial: Record<string, { status: DataSourceStatus; notes: string }> = {}
      for (const meta of SOURCES) {
        const found = list.find((item) => item.source === meta.source)
        initial[meta.source] = {
          status: (found?.status as DataSourceStatus) || 'connected',
          notes: found?.notes || '',
        }
      }
      setFormState(initial)
    } catch (err: any) {
      addToast('error', 'Failed to Load Sources', err?.message || 'Could not fetch data source access')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clientId) {
      loadDataSources()
    }
  }, [clientId])

  const handleSave = async (source: 'gsc' | 'ga4' | 'gbp') => {
    const current = formState[source]
    if (!current) return

    setSavingSource(source)
    try {
      await updateClientDataSourceServerFn({
        data: {
          clientId,
          source,
          status: current.status,
          notes: current.notes.trim() || undefined,
        },
      })
      addToast(
        'success',
        'Access Updated',
        `${source.toUpperCase()} connection status updated to ${current.status.replace('_', ' ')}.`
      )
      await loadDataSources()
    } catch (err: any) {
      addToast('error', 'Update Failed', err?.message || 'Could not update data source access')
    } finally {
      setSavingSource(null)
    }
  }

  return (
    <div className="space-y-3.5">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Header card */}
      <div className="p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[var(--accent)]/10 text-[var(--accent)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[var(--ink)]">
                Data Source Access & Connections
              </h2>
              <p className="text-[12px] text-[var(--muted)]">
                Manage reporting access to client analytics platforms. Unmeasured sources (No Access / Not Applicable) are cleanly excluded from reports.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadDataSources}
            disabled={loading}
            className="p-1.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[var(--accent)]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {SOURCES.map((meta) => {
          const Icon = meta.icon
          const state = formState[meta.source] || { status: 'connected', notes: '' }
          const existing = sources.find((s) => s.source === meta.source)
          const isSaving = savingSource === meta.source

          return (
            <div
              key={meta.source}
              className="p-4 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-[6px] ${meta.iconBg} ${meta.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                        {meta.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--muted)] uppercase font-semibold">
                        {meta.shortName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-medium shrink-0 border ${
                      state.status === 'connected'
                        ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30'
                        : state.status === 'no_access'
                        ? 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30'
                        : 'bg-[var(--canvas)] text-[var(--muted)] border-[var(--line)]'
                    }`}
                  >
                    {state.status === 'connected'
                      ? 'Connected'
                      : state.status === 'no_access'
                      ? 'No Access'
                      : 'Not Applicable'}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  {meta.description}
                </p>

                {/* Status Dropdown */}
                <div className="space-y-1 pt-2 border-t border-[var(--line)]">
                  <label className="block text-[11px] font-medium text-[var(--muted)]">
                    Connection Status
                  </label>
                  <select
                    value={state.status}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        [meta.source]: {
                          ...prev[meta.source],
                          status: e.target.value as DataSourceStatus,
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="connected">Connected & Measured</option>
                    <option value="no_access">No Access (Missing Permissions)</option>
                    <option value="not_applicable">Not Applicable (Online only / No listing)</option>
                  </select>
                </div>

                {/* Notes Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-[var(--muted)]">
                    Notes & Status Details
                  </label>
                  <textarea
                    rows={2}
                    value={state.notes}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        [meta.source]: {
                          ...prev[meta.source],
                          notes: e.target.value,
                        },
                      }))
                    }
                    placeholder={`e.g., Requested access on ${new Date().toLocaleDateString()}`}
                    className="w-full px-2.5 py-1.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted)] resize-none"
                  />
                </div>

                {existing?.updatedAt && (
                  <div className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Updated {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(existing.updatedAt))}
                    </span>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => handleSave(meta.source)}
                disabled={isSaving}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save {meta.shortName}</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
