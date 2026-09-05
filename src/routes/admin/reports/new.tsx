import { createFileRoute, redirect, useRouter, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  BarChart3,
  ArrowLeft,
  Building2,
  Calendar,
  PhoneCall,
  Navigation,
  Eye,
  MousePointerClick,
  Globe,
  Users,
  Layers,
  FileText,
  ListOrdered,
  ListChecks,
  Check,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Search,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { ThemedNumberInput } from '../../../components/ThemedNumberInput'
import { ThemeToggle } from '../../../components/ThemeToggle'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { getClientsServerFn } from '../../../server/clients'
import {
  createReportServerFn,
  updateReportServerFn,
  getReportByIdServerFn,
  getLatestReportForClientServerFn,
  getReportPreflightDataServerFn,
  type QueryItem,
  type PageItem,
} from '../../../server/reports'

function parseDecimalValue(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  const cleaned = String(val).replace(/[^0-9.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

interface NewReportSearch {
  clientId?: string
  editId?: string
}

export const Route = createFileRoute('/admin/reports/new')({
  validateSearch: (search: Record<string, unknown>): NewReportSearch => {
    return {
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
      editId: typeof search.editId === 'string' ? search.editId : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    await requireAdmin({ location })
  },

  loaderDeps: ({ search }) => ({
    clientId: search.clientId,
    editId: search.editId,
  }),
  loader: async ({ deps }) => {
    const [{ clients }, existingReportData] = await Promise.all([
      getClientsServerFn(),
      deps.editId
        ? getReportByIdServerFn({ data: { id: deps.editId } }).catch(() => null)
        : Promise.resolve(null),
    ])

    if (deps.editId && (!existingReportData || !existingReportData.report)) {
      throw redirect({
        to: '/admin/reports',
        search: {
          error: 'access_denied',
        },
      })
    }

    return {
      clients,
      existingReport: existingReportData?.report || null,
      editClient: existingReportData?.client || null,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: loaderData?.existingReport
          ? 'Edit Performance Report | Admin | built by Miguel'
          : 'Create Performance Report | Admin | built by Miguel',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminReportFormPage,
})

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const YEARS = Array.from({ length: 8 }, (_, i) => String(2024 + i))

function parseMonthYear(str: string) {
  const trimmed = (str || '').trim()
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) {
    const m = parts[0]
    const y = parts[parts.length - 1]
    if (MONTH_NAMES.includes(m) && /^\d{4}$/.test(y)) {
      return { month: m, year: y }
    }
  }
  const now = new Date()
  return {
    month: MONTH_NAMES[now.getMonth()],
    year: String(now.getFullYear()),
  }
}

function getDefaultMonthString(): string {
  const now = new Date()
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)
}

const DEFAULT_QUERY_ITEMS: QueryItem[] = [
  { query: '', clicks: '', impressions: '', position: '' },
  { query: '', clicks: '', impressions: '', position: '' },
  { query: '', clicks: '', impressions: '', position: '' },
  { query: '', clicks: '', impressions: '', position: '' },
  { query: '', clicks: '', impressions: '', position: '' },
]

const DEFAULT_PAGE_ITEMS: PageItem[] = [
  { path: '/', impressions: '', position: '' },
  { path: '', impressions: '', position: '' },
  { path: '', impressions: '', position: '' },
  { path: '', impressions: '', position: '' },
  { path: '', impressions: '', position: '' },
]

function AdminReportFormPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const { clientId: queryClientId, editId } = Route.useSearch()
  const { clients, existingReport } = Route.useLoaderData()

  const isEditing = Boolean(editId && existingReport)

  // Form State
  const initialMonthYear = parseMonthYear(
    existingReport?.reportMonth || getDefaultMonthString()
  )
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonthYear.month)
  const [selectedYear, setSelectedYear] = useState<string>(initialMonthYear.year)
  const [selectedClientId, setSelectedClientId] = useState(
    existingReport?.clientId || queryClientId || clients[0]?.id || ''
  )
  const [reportMonth, setReportMonth] = useState(
    existingReport?.reportMonth || `${initialMonthYear.month} ${initialMonthYear.year}`
  )

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    setReportMonth(`${month} ${selectedYear}`)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setReportMonth(`${selectedMonth} ${year}`)
  }

  const [title, setTitle] = useState(existingReport?.title || '')
  const [hasManuallyEditedTitle, setHasManuallyEditedTitle] = useState(isEditing)
  const [previousReportId, setPreviousReportId] = useState<string>(
    existingReport?.previousReportId || ''
  )

  // GBP Metrics - Current
  const [gbpCalls, setGbpCalls] = useState<number | string>(existingReport?.gbpCalls ?? 0)
  const [gbpDirections, setGbpDirections] = useState<number | string>(existingReport?.gbpDirections ?? 0)
  const [gbpViews, setGbpViews] = useState<number | string>(existingReport?.gbpViews ?? 0)
  const [gbpWebsiteClicks, setGbpWebsiteClicks] = useState<number | string>(
    (existingReport as any)?.gbpWebsiteClicks ?? existingReport?.gbpViews ?? 0
  )

  // GBP Metrics - Previous Month
  const [prevGbpCalls, setPrevGbpCalls] = useState<number | string>(existingReport?.prevGbpCalls ?? 0)
  const [prevGbpDirections, setPrevGbpDirections] = useState<number | string>(existingReport?.prevGbpDirections ?? 0)
  const [prevGbpViews, setPrevGbpViews] = useState<number | string>(existingReport?.prevGbpViews ?? 0)
  const [prevGbpWebsiteClicks, setPrevGbpWebsiteClicks] = useState<number | string>(
    (existingReport as any)?.prevGbpWebsiteClicks ?? existingReport?.prevGbpViews ?? 0
  )

  // GBP Reputation
  const [gbpRating, setGbpRating] = useState<number | string>(existingReport?.gbpRating ?? 5.0)
  const [gbpReviewCount, setGbpReviewCount] = useState<number | string>(existingReport?.gbpReviewsCount ?? existingReport?.gbpReviewCount ?? 0)
  const [gbpReviewsCount, setGbpReviewsCount] = useState<number | string>(existingReport?.gbpReviewsCount ?? existingReport?.gbpReviewCount ?? 0)
  const [prevGbpReviewsCount, setPrevGbpReviewsCount] = useState<number | string>(existingReport?.prevGbpReviewsCount ?? 0)

  // GSC Metrics - CTR
  const [gscCtr, setGscCtr] = useState<number | string>(existingReport?.gscCtr !== undefined && existingReport?.gscCtr !== null ? existingReport.gscCtr : '')
  const [prevGscCtr, setPrevGscCtr] = useState<number | string>(existingReport?.prevGscCtr !== undefined && existingReport?.prevGscCtr !== null ? existingReport.prevGscCtr : '')

  // GA4 Metrics - New Users
  const [gaNewUsers, setGaNewUsers] = useState<number | string>(existingReport?.gaNewUsers !== undefined && existingReport?.gaNewUsers !== null ? existingReport.gaNewUsers : '')
  const [prevGaNewUsers, setPrevGaNewUsers] = useState<number | string>(existingReport?.prevGaNewUsers !== undefined && existingReport?.prevGaNewUsers !== null ? existingReport.prevGaNewUsers : '')

  // GSC Metrics - Current
  const [gscClicks, setGscClicks] = useState<number | string>(existingReport?.gscClicks ?? 0)
  const [gscImpressions, setGscImpressions] = useState<number | string>(existingReport?.gscImpressions ?? 0)
  const [gscPosition, setGscPosition] = useState<number | string>(existingReport?.gscPosition ?? 0)

  // GSC Metrics - Previous Month
  const [prevGscClicks, setPrevGscClicks] = useState<number | string>(existingReport?.prevGscClicks ?? 0)
  const [prevGscImpressions, setPrevGscImpressions] = useState<number | string>(existingReport?.prevGscImpressions ?? 0)
  const [prevGscPosition, setPrevGscPosition] = useState<number | string>(existingReport?.prevGscPosition ?? 0)

  // GA4 Metrics - Current
  const [gaUsers, setGaUsers] = useState<number | string>(existingReport?.gaUsers ?? 0)
  const [gaSessions, setGaSessions] = useState<number | string>(existingReport?.gaSessions ?? 0)
  const [gaViews, setGaViews] = useState<number | string>(existingReport?.gaViews ?? 0)

  // GA4 Metrics - Previous Month
  const [prevGaUsers, setPrevGaUsers] = useState<number | string>(existingReport?.prevGaUsers ?? 0)
  const [prevGaSessions, setPrevGaSessions] = useState<number | string>(existingReport?.prevGaSessions ?? 0)
  const [prevGaViews, setPrevGaViews] = useState<number | string>(existingReport?.prevGaViews ?? 0)

  // Deep Metric Tables
  const [topQueries, setTopQueries] = useState<QueryItem[]>(() => {
    if (existingReport && Array.isArray(existingReport.topQueries) && existingReport.topQueries.length > 0) {
      const items = [...existingReport.topQueries]
      while (items.length < 5) {
        items.push({ query: '', clicks: '', impressions: '', position: '' })
      }
      return items.slice(0, 5).map((q) => ({
        query: q.query || '',
        clicks: q.clicks !== undefined && q.clicks !== null ? q.clicks : '',
        impressions: q.impressions !== undefined && q.impressions !== null ? q.impressions : '',
        position: q.position !== undefined && q.position !== null ? q.position : '',
      }))
    }
    return DEFAULT_QUERY_ITEMS
  })

  const [topPages, setTopPages] = useState<PageItem[]>(() => {
    if (existingReport && Array.isArray(existingReport.topPages) && existingReport.topPages.length > 0) {
      const items = [...existingReport.topPages]
      while (items.length < 5) {
        items.push({ path: '', impressions: '', position: '' })
      }
      return items.slice(0, 5).map((p: any) => ({
        path: p.path || '',
        impressions: p.impressions !== undefined && p.impressions !== null ? p.impressions : (p.clicks !== undefined && p.clicks !== null ? p.clicks : ''),
        position: p.position !== undefined && p.position !== null ? p.position : '',
      }))
    }
    return DEFAULT_PAGE_ITEMS
  })

  // Narrative Text
  const [summaryTitle, setSummaryTitle] = useState(
    (existingReport as any)?.summaryTitle || 'Performance Highlights & Strategic Updates'
  )
  const [summary, setSummary] = useState(existingReport?.summary || '')
  const [workCompleted, setWorkCompleted] = useState(existingReport?.workCompleted || '')
  const [nextSteps, setNextSteps] = useState(existingReport?.nextSteps || '')

  // Pre-flight & CRM Metric Ingestion State
  const [preflightData, setPreflightData] = useState<any>(null)
  const [isCheckingPreflight, setIsCheckingPreflight] = useState(false)
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set())
  const [manuallyEditedFields, setManuallyEditedFields] = useState<Set<string>>(new Set())

  const markFieldEdited = (fieldName: string) => {
    setManuallyEditedFields((prev) => {
      const next = new Set(prev)
      next.add(fieldName)
      return next
    })
  }

  const renderFieldBadge = (fieldName: string) => {
    if (manuallyEditedFields.has(fieldName)) {
      return (
        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 ml-1.5 inline-block">
          Edited
        </span>
      )
    }
    if (autoFilledFields.has(fieldName)) {
      return (
        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 ml-1.5 inline-block">
          Auto
        </span>
      )
    }
    return null
  }

  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPullingPrior, setIsPullingPrior] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Selected client object
  const selectedClient = clients.find((c) => c.id === selectedClientId)

  // Auto-generate title if creating new and not manually customized
  useEffect(() => {
    if (!isEditing && !hasManuallyEditedTitle && selectedClient) {
      setTitle(`${selectedClient.businessName} - Monthly Performance Report (${reportMonth})`)
    }
  }, [selectedClient, reportMonth, hasManuallyEditedTitle, isEditing])

  // Pre-flight check & auto-population effect
  useEffect(() => {
    if (!selectedClientId || !reportMonth) return

    let isMounted = true
    setIsCheckingPreflight(true)

    getReportPreflightDataServerFn({
      data: {
        clientId: selectedClientId,
        reportMonth,
      },
    })
      .then((data) => {
        if (!isMounted) return
        setPreflightData(data)
        setIsCheckingPreflight(false)

        // If ready and creating new report (not editing an existing snapshot), auto-populate metrics
        if (data.ready && data.metrics && !isEditing) {
          const filled = new Set<string>()

          // GBP Current
          if (data.metrics.gbpCalls !== null && data.metrics.gbpCalls !== undefined) {
            setGbpCalls(data.metrics.gbpCalls)
            filled.add('gbpCalls')
          }
          if (data.metrics.gbpDirections !== null && data.metrics.gbpDirections !== undefined) {
            setGbpDirections(data.metrics.gbpDirections)
            filled.add('gbpDirections')
          }
          if (data.metrics.gbpViews !== null && data.metrics.gbpViews !== undefined) {
            setGbpViews(data.metrics.gbpViews)
            filled.add('gbpViews')
          }
          if (data.metrics.gbpWebsiteClicks !== null && data.metrics.gbpWebsiteClicks !== undefined) {
            setGbpWebsiteClicks(data.metrics.gbpWebsiteClicks)
            filled.add('gbpWebsiteClicks')
          }
          if (data.metrics.gbpRating !== null && data.metrics.gbpRating !== undefined) {
            setGbpRating(data.metrics.gbpRating)
            filled.add('gbpRating')
          }
          if (data.metrics.gbpReviewsCount !== null && data.metrics.gbpReviewsCount !== undefined) {
            setGbpReviewCount(data.metrics.gbpReviewsCount)
            setGbpReviewsCount(data.metrics.gbpReviewsCount)
            filled.add('gbpReviewCount')
          }

          // GSC Current
          if (data.metrics.gscClicks !== null && data.metrics.gscClicks !== undefined) {
            setGscClicks(data.metrics.gscClicks)
            filled.add('gscClicks')
          }
          if (data.metrics.gscImpressions !== null && data.metrics.gscImpressions !== undefined) {
            setGscImpressions(data.metrics.gscImpressions)
            filled.add('gscImpressions')
          }
          if (data.metrics.gscPosition !== null && data.metrics.gscPosition !== undefined) {
            setGscPosition(data.metrics.gscPosition)
            filled.add('gscPosition')
          }
          if (data.metrics.gscCtr !== null && data.metrics.gscCtr !== undefined) {
            setGscCtr(data.metrics.gscCtr)
            filled.add('gscCtr')
          }

          // GA4 Current
          if (data.metrics.gaUsers !== null && data.metrics.gaUsers !== undefined) {
            setGaUsers(data.metrics.gaUsers)
            filled.add('gaUsers')
          }
          if (data.metrics.gaNewUsers !== null && data.metrics.gaNewUsers !== undefined) {
            setGaNewUsers(data.metrics.gaNewUsers)
            filled.add('gaNewUsers')
          }
          if (data.metrics.gaSessions !== null && data.metrics.gaSessions !== undefined) {
            setGaSessions(data.metrics.gaSessions)
            filled.add('gaSessions')
          }
          if (data.metrics.gaViews !== null && data.metrics.gaViews !== undefined) {
            setGaViews(data.metrics.gaViews)
            filled.add('gaViews')
          }

          // Previous Month Metrics (Auto-populate comparison figures)
          if (data.prevMetrics) {
            if (data.prevMetrics.gbpCalls !== null && data.prevMetrics.gbpCalls !== undefined) {
              setPrevGbpCalls(data.prevMetrics.gbpCalls)
              filled.add('prevGbpCalls')
            }
            if (data.prevMetrics.gbpDirections !== null && data.prevMetrics.gbpDirections !== undefined) {
              setPrevGbpDirections(data.prevMetrics.gbpDirections)
              filled.add('prevGbpDirections')
            }
            if (data.prevMetrics.gbpViews !== null && data.prevMetrics.gbpViews !== undefined) {
              setPrevGbpViews(data.prevMetrics.gbpViews)
              filled.add('prevGbpViews')
            }
            if (data.prevMetrics.gbpWebsiteClicks !== null && data.prevMetrics.gbpWebsiteClicks !== undefined) {
              setPrevGbpWebsiteClicks(data.prevMetrics.gbpWebsiteClicks)
              filled.add('prevGbpWebsiteClicks')
            }
            if (data.prevMetrics.gbpReviewsCount !== null && data.prevMetrics.gbpReviewsCount !== undefined) {
              setPrevGbpReviewsCount(data.prevMetrics.gbpReviewsCount)
              filled.add('prevGbpReviewsCount')
            }
            if (data.prevMetrics.gscClicks !== null && data.prevMetrics.gscClicks !== undefined) {
              setPrevGscClicks(data.prevMetrics.gscClicks)
              filled.add('prevGscClicks')
            }
            if (data.prevMetrics.gscImpressions !== null && data.prevMetrics.gscImpressions !== undefined) {
              setPrevGscImpressions(data.prevMetrics.gscImpressions)
              filled.add('prevGscImpressions')
            }
            if (data.prevMetrics.gscPosition !== null && data.prevMetrics.gscPosition !== undefined) {
              setPrevGscPosition(data.prevMetrics.gscPosition)
              filled.add('prevGscPosition')
            }
            if (data.prevMetrics.gscCtr !== null && data.prevMetrics.gscCtr !== undefined) {
              setPrevGscCtr(data.prevMetrics.gscCtr)
              filled.add('prevGscCtr')
            }
            if (data.prevMetrics.gaUsers !== null && data.prevMetrics.gaUsers !== undefined) {
              setPrevGaUsers(data.prevMetrics.gaUsers)
              filled.add('prevGaUsers')
            }
            if (data.prevMetrics.gaNewUsers !== null && data.prevMetrics.gaNewUsers !== undefined) {
              setPrevGaNewUsers(data.prevMetrics.gaNewUsers)
              filled.add('prevGaNewUsers')
            }
            if (data.prevMetrics.gaSessions !== null && data.prevMetrics.gaSessions !== undefined) {
              setPrevGaSessions(data.prevMetrics.gaSessions)
              filled.add('prevGaSessions')
            }
            if (data.prevMetrics.gaViews !== null && data.prevMetrics.gaViews !== undefined) {
              setPrevGaViews(data.prevMetrics.gaViews)
              filled.add('prevGaViews')
            }
          }

          setAutoFilledFields(filled)
        }
      })
      .catch((err) => {
        if (!isMounted) return
        setIsCheckingPreflight(false)
        console.error('Pre-flight check failed:', err)
      })

    return () => {
      isMounted = false
    }
  }, [selectedClientId, reportMonth, isEditing])

  // Handler: Auto-pull prior month metrics from latest client report
  const handleAutoPullPriorMonth = async () => {
    if (!selectedClientId) {
      addToast('Select Client', 'Please select a client first.', 'error')
      return
    }

    try {
      setIsPullingPrior(true)
      const res = await getLatestReportForClientServerFn({ data: { clientId: selectedClientId } })

      if (!res.report) {
        addToast('No Prior Report', 'No previous report was found for this client.', 'info')
        return
      }

      // If currently editing and latest is this same report, notify user
      if (editId && res.report.id === editId) {
        addToast('Notice', 'The most recent report on record is this report currently being edited.', 'info')
        return
      }

      const p = res.report
      setPreviousReportId(p.id)
      setPrevGbpCalls(p.gbpCalls ?? 0)
      setPrevGbpDirections(p.gbpDirections ?? 0)
      setPrevGbpViews(p.gbpViews ?? 0)
      setPrevGbpWebsiteClicks((p as any).gbpWebsiteClicks ?? p.gbpViews ?? 0)
      setPrevGscClicks(p.gscClicks ?? 0)
      setPrevGscImpressions(p.gscImpressions ?? 0)
      setPrevGscPosition(p.gscPosition ?? 0)
      setPrevGaUsers(p.gaUsers ?? 0)
      setPrevGaSessions(p.gaSessions ?? 0)
      setPrevGaViews(p.gaViews ?? 0)
      setPrevGbpReviewsCount(p.gbpReviewsCount ?? p.gbpReviewCount ?? 0)
      setPrevGscCtr(p.gscCtr ?? 0)
      setPrevGaNewUsers(p.gaNewUsers ?? 0)

      addToast(
        'Prior Metrics Loaded',
        `Successfully auto-filled comparison figures from the ${p.reportMonth} report!`,
        'success'
      )
    } catch (err: any) {
      addToast('Auto-Pull Failed', err?.message || 'Could not retrieve previous report', 'error')
    } finally {
      setIsPullingPrior(false)
    }
  }

  const handleQueryChange = (idx: number, field: keyof QueryItem, value: any) => {
    setTopQueries((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const handlePageChange = (idx: number, field: keyof PageItem, value: any) => {
    setTopPages((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const handleDraftSummaryFromMetrics = () => {
    const callsNum = Number(gbpCalls) || 0
    const prevCallsNum = Number(prevGbpCalls) || 0
    const dirNum = Number(gbpDirections) || 0
    const prevDirNum = Number(prevGbpDirections) || 0
    const gbpClicksNum = Number(gbpWebsiteClicks) || 0
    const gbpRatingNum = Number(gbpRating) || 5.0
    const reviewsNum = Number(gbpReviewsCount) || Number(gbpReviewCount) || 0

    const clicksNum = Number(gscClicks) || 0
    const prevClicksNum = Number(prevGscClicks) || 0
    const impNum = Number(gscImpressions) || 0
    const posNum = Number(gscPosition) || 0
    const ctrNum = Number(gscCtr) || 0

    const usersNum = Number(gaUsers) || 0
    const prevUsersNum = Number(prevGaUsers) || 0
    const newUsersNum = Number(gaNewUsers) || 0
    const sessionsNum = Number(gaSessions) || 0

    const calcDiff = (curr: number, prev: number) => {
      if (prev <= 0) return curr > 0 ? '+100%' : '0%'
      const pct = Math.round(((curr - prev) / prev) * 100)
      return pct >= 0 ? `+${pct}%` : `${pct}%`
    }

    // Bullet 1: Traffic & Organic Search Visibility
    let bullet1 = ''
    if (clicksNum > 0 || impNum > 0) {
      const clickDiff = calcDiff(clicksNum, prevClicksNum)
      bullet1 = `• Organic Search Visibility: Generated ${clicksNum.toLocaleString()} organic search clicks (${clickDiff} MoM) across ${impNum.toLocaleString()} search impressions, maintaining an average search ranking position of ${posNum > 0 ? posNum.toFixed(1) : 'top 10'}${ctrNum > 0 ? ` with a ${ctrNum.toFixed(1)}% CTR` : ''}.`
    } else if (usersNum > 0) {
      const userDiff = calcDiff(usersNum, prevUsersNum)
      bullet1 = `• Website Audience Growth: Reached ${usersNum.toLocaleString()} total visitors (${userDiff} MoM)${newUsersNum > 0 ? ` including ${newUsersNum.toLocaleString()} first-time visitors` : ''} across ${sessionsNum.toLocaleString()} active browsing sessions.`
    } else {
      bullet1 = `• Digital Presence Baseline: Search and website tracking channels active for ${reportMonth}, monitoring ongoing search impressions and audience acquisition.`
    }

    // Bullet 2: Direct Inquiries & Engagement
    let bullet2 = ''
    if (callsNum > 0 || dirNum > 0 || gbpClicksNum > 0) {
      const callDiff = calcDiff(callsNum, prevCallsNum)
      const actionsList = []
      if (callsNum > 0) actionsList.push(`${callsNum.toLocaleString()} phone calls (${callDiff} MoM)`)
      if (dirNum > 0) actionsList.push(`${dirNum.toLocaleString()} direction requests`)
      if (gbpClicksNum > 0) actionsList.push(`${gbpClicksNum.toLocaleString()} website clicks`)
      bullet2 = `• High-Intent Conversion: Captured ${actionsList.join(', ')} from Google Business Profile, backed by a strong ${gbpRatingNum.toFixed(1)}★ rating across ${reviewsNum} verified reviews.`
    } else if (sessionsNum > 0) {
      bullet2 = `• On-Site Engagement: Sustained solid audience activity across ${sessionsNum.toLocaleString()} visits${newUsersNum > 0 ? ` (${newUsersNum.toLocaleString()} first-time visitors)` : ''}, reflecting high commercial relevance among incoming visitors.`
    } else {
      bullet2 = `• Local Authority & Trust: Maintained Google Business Profile visibility at ${gbpRatingNum.toFixed(1)}★ rating across ${reviewsNum} customer reviews to drive local search trust.`
    }

    // Bullet 3: Strategic Opportunity & Recommended Focus
    let bullet3 = ''
    if (prevClicksNum > 0 && clicksNum < prevClicksNum) {
      bullet3 = `• Strategic Focus: Address slight dip in search clicks by expanding target keyword coverage, refreshing core landing page meta titles, and accelerating local link acquisition.`
    } else if (prevCallsNum > 0 && callsNum < prevCallsNum) {
      bullet3 = `• Strategic Focus: Boost local lead conversion with targeted call-to-actions, updated business hours/promotions on Google Maps, and review velocity campaigns.`
    } else if (ctrNum > 0 && ctrNum < 2.5) {
      bullet3 = `• Strategic Focus: Optimize title tags and meta descriptions for high-impression search queries to push organic CTR above 3.0% and capture untapped search demand.`
    } else if (posNum > 15) {
      bullet3 = `• Strategic Focus: Target striking-distance keyword rankings (positions 11-20) with technical schema updates and internal link optimization to move them onto page 1.`
    } else {
      bullet3 = `• Strategic Focus: Capitalize on positive momentum by scaling high-converting landing pages, building niche local citations, and capturing fresh client testimonials.`
    }

    const generated = `${bullet1}\n${bullet2}\n${bullet3}`
    setSummary(generated)
    addToast('Summary Drafted', 'Generated 3-bullet dynamic summary from current metrics!', 'success')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!selectedClientId) {
      setFormError('Please select a client')
      return
    }
    if (!reportMonth.trim()) {
      setFormError('Report month is required')
      return
    }
    if (!title.trim()) {
      setFormError('Report title is required')
      return
    }

    // Filter out empty rows
    const cleanedQueries = topQueries
      .filter((q) => q.query.trim().length > 0)
      .map((q) => ({
        query: q.query.trim(),
        clicks: Number(q.clicks) || 0,
        impressions: Number(q.impressions) || 0,
        position: Number(q.position) || 1.0,
      }))

    const cleanedPages = topPages
      .filter((p) => p.path && p.path.trim().length > 0)
      .map((p) => ({
        path: p.path.trim(),
        impressions: Number(p.impressions) || 0,
        position: p.position ? (Number(p.position) || 1.0) : 1.0,
      }))

    try {
      setIsSubmitting(true)

      const payload = {
        clientId: selectedClientId,
        title: title.trim(),
        reportMonth: reportMonth.trim(),
        previousReportId: previousReportId || undefined,
        // GBP Current
        gbpCalls: Number(gbpCalls) || 0,
        gbpDirections: Number(gbpDirections) || 0,
        gbpViews: Number(gbpWebsiteClicks || gbpViews) || 0,
        gbpWebsiteClicks: Number(gbpWebsiteClicks) || 0,
        // GBP Previous
        prevGbpCalls: Number(prevGbpCalls) || 0,
        prevGbpDirections: Number(prevGbpDirections) || 0,
        prevGbpViews: Number(prevGbpWebsiteClicks || prevGbpViews) || 0,
        prevGbpWebsiteClicks: Number(prevGbpWebsiteClicks) || 0,
        // GBP Reputation
        gbpRating: Number(gbpRating) || 5.0,
        gbpReviewCount: Number(gbpReviewsCount || gbpReviewCount) || 0,
        gbpReviewsCount: Number(gbpReviewsCount || gbpReviewCount) || 0,
        prevGbpReviewsCount: Number(prevGbpReviewsCount) || 0,
        // GSC Current
        gscClicks: Number(gscClicks) || 0,
        gscImpressions: Number(gscImpressions) || 0,
        gscCtr: parseDecimalValue(gscCtr),
        gscPosition: parseDecimalValue(gscPosition),
        // GSC Previous
        prevGscClicks: Number(prevGscClicks) || 0,
        prevGscImpressions: Number(prevGscImpressions) || 0,
        prevGscCtr: parseDecimalValue(prevGscCtr),
        prevGscPosition: parseDecimalValue(prevGscPosition),
        // GA4 Current
        gaUsers: Number(gaUsers) || 0,
        gaNewUsers: Number(gaNewUsers) || 0,
        gaEngagementRate: 0,
        gaSessions: Number(gaSessions) || 0,
        gaViews: Number(gaViews) || 0,
        // GA4 Previous
        prevGaUsers: Number(prevGaUsers) || 0,
        prevGaNewUsers: Number(prevGaNewUsers) || 0,
        prevGaEngagementRate: 0,
        prevGaSessions: Number(prevGaSessions) || 0,
        prevGaViews: Number(prevGaViews) || 0,
        // Deep Metric Tables
        topQueries: cleanedQueries,
        topPages: cleanedPages,
        // Narrative
        summaryTitle: summaryTitle.trim() || 'Performance Highlights & Strategic Updates',
        summary: summary.trim() || undefined,
        workCompleted: workCompleted.trim() || undefined,
        nextSteps: nextSteps.trim() || undefined,
      }

      if (isEditing && editId) {
        const updateRes = await updateReportServerFn({
          data: {
            id: editId,
            ...payload,
          },
        })
        const targetId = updateRes?.report?.id || editId
        addToast('Report Updated', 'Saved changes successfully!')
        await router.invalidate()
        navigate({
          to: '/admin/reports/$id',
          params: { id: targetId },
        })
      } else {
        const res = await createReportServerFn({
          data: payload,
        })
        const newReportId = res?.report?.id
        if (!newReportId) {
          throw new Error('Failed to create report: ID not returned from server.')
        }
        addToast('Report Created', 'Redirecting to your branded report...')
        await router.invalidate()
        navigate({
          to: '/admin/reports/$id',
          params: { id: newReportId },
        })
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save report')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Sticky Quick Nav Bar */}
        <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-[#0c111d]/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Reports</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">Theme:</span>
            <ThemeToggle variant="pill" />
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Performance Report' : 'Create Monthly Performance Report'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure metrics, month-over-month comparisons, search keywords, and strategic deliverables.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <ThemeToggle variant="pill" />
          </div>
        </div>

        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {formError}
          </div>
        )}

        {/* PRE-FLIGHT CHECK WARNING BANNER */}
        {preflightData && !preflightData.ready && preflightData.missing === 'monthly_metrics' && !isEditing && (
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 shadow-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Missing Monthly KPI Metrics
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  Monthly KPI metrics for <strong>{reportMonth}</strong> have not been recorded for{' '}
                  <strong>{preflightData.clientName || 'this client'}</strong>. Report generation is blocked to prevent producing reports of empty or zeroed figures.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to="/admin/workspace"
                    search={{ tab: 'metrics', client: selectedClientId }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-xs transition"
                  >
                    <span>Enter Monthly Metrics</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                    Takes ~60 seconds or import Semrush CSV
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRE-FLIGHT SUCCESS DELIVERABLES PREVIEW */}
        {preflightData && preflightData.ready && preflightData.deliverables && !isEditing && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                CRM Metrics & Deliverables Synchronized for {reportMonth}:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                {preflightData.deliverables.landingPages?.length || 0} Landing Pages
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                {preflightData.deliverables.articles?.length || 0} Articles
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                {preflightData.deliverables.tasks?.length || 0} Tasks Completed
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                {preflightData.deliverables.nextKeywords?.length || 0} Target Keywords
              </span>
            </div>
          </div>
        )}

        {clients.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Clients Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must create at least one client before generating a branded performance report.
            </p>
            <Link
              to="/admin/clients"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
            >
              <span>Add Client First</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Client & Period Metadata */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Building2 className="w-4 h-4 text-rose-500" />
                <span>Client & Reporting Period</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Select Client *
                  </label>
                  <select
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName} ({c.name}) {c.isWhiteLabel ? '• [White-Label]' : ''}
                      </option>
                    ))}
                  </select>

                  {/* Client Info Pill */}
                  {selectedClient && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedClient.primaryColor || '#2563eb' }}
                      />
                      <span>Brand Color: {selectedClient.primaryColor || '#2563eb'}</span>
                      {selectedClient.isWhiteLabel && (
                        <span className="text-purple-600 font-bold">• White-Label Partner</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Reporting Period / Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Report Period / Month *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                    >
                      {MONTH_NAMES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setHasManuallyEditedTitle(true)
                  }}
                  placeholder="e.g. Local SEO Report or Apex Plumbing - Monthly Performance Report"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>

              {/* Google Business Profile Reputation (Rating + Review Count) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>GBP Star Rating (e.g. 4.9 or 5.0)</span>
                  </label>
                  <ThemedNumberInput
                    theme="blue"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={gbpRating}
                    onChange={(e) => setGbpRating(e.target.value)}
                    inputClassName="rounded-2xl px-3.5 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>Total Review Count</span>
                  </label>
                  <ThemedNumberInput
                    theme="blue"
                    min="0"
                    value={gbpReviewCount}
                    onChange={(e) => setGbpReviewCount(e.target.value)}
                    inputClassName="rounded-2xl px-3.5 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Grouped Metrics with MoM Comparison */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <BarChart3 className="w-4 h-4 text-rose-500" />
                  <span>Key Performance Indicators (Current vs. Prior Month)</span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoPullPriorMonth}
                  disabled={isPullingPrior || !selectedClientId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
                  title="Auto-fill previous month columns from client's latest existing report"
                >
                  <Zap className={`w-3.5 h-3.5 text-amber-500 ${isPullingPrior ? 'animate-spin' : ''}`} />
                  <span>{isPullingPrior ? 'Pulling Data...' : '⚡ Auto-pull Prior Month'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Google Business Profile (GBP) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Google Business Profile</span>
                  </div>

                  {/* Calls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Calls (Current) {renderFieldBadge('gbpCalls')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={gbpCalls}
                        onChange={(e) => {
                          setGbpCalls(e.target.value)
                          markFieldEdited('gbpCalls')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGbpCalls')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={prevGbpCalls}
                        onChange={(e) => {
                          setPrevGbpCalls(e.target.value)
                          markFieldEdited('prevGbpCalls')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Directions (Current) {renderFieldBadge('gbpDirections')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={gbpDirections}
                        onChange={(e) => {
                          setGbpDirections(e.target.value)
                          markFieldEdited('gbpDirections')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGbpDirections')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={prevGbpDirections}
                        onChange={(e) => {
                          setPrevGbpDirections(e.target.value)
                          markFieldEdited('prevGbpDirections')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Website Clicks */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Website Clicks (Current) {renderFieldBadge('gbpWebsiteClicks')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={gbpWebsiteClicks}
                        onChange={(e) => {
                          setGbpWebsiteClicks(e.target.value)
                          setGbpViews(e.target.value)
                          markFieldEdited('gbpWebsiteClicks')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGbpWebsiteClicks')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={prevGbpWebsiteClicks}
                        onChange={(e) => {
                          setPrevGbpWebsiteClicks(e.target.value)
                          setPrevGbpViews(e.target.value)
                          markFieldEdited('prevGbpWebsiteClicks')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Reviews Count (Current vs Prior) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Reviews (Current) {renderFieldBadge('gbpReviewsCount')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={gbpReviewsCount}
                        onChange={(e) => {
                          setGbpReviewsCount(e.target.value)
                          setGbpReviewCount(e.target.value)
                          markFieldEdited('gbpReviewsCount')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGbpReviewsCount')}
                      </label>
                      <ThemedNumberInput
                        theme="blue"
                        min="0"
                        value={prevGbpReviewsCount}
                        onChange={(e) => {
                          setPrevGbpReviewsCount(e.target.value)
                          markFieldEdited('prevGbpReviewsCount')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Google Search Console (GSC) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Search Console (GSC)</span>
                  </div>

                  {/* Clicks */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Clicks (Current) {renderFieldBadge('gscClicks')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        min="0"
                        value={gscClicks}
                        onChange={(e) => {
                          setGscClicks(e.target.value)
                          markFieldEdited('gscClicks')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGscClicks')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        min="0"
                        value={prevGscClicks}
                        onChange={(e) => {
                          setPrevGscClicks(e.target.value)
                          markFieldEdited('prevGscClicks')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Impressions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Impr. (Current) {renderFieldBadge('gscImpressions')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        min="0"
                        value={gscImpressions}
                        onChange={(e) => {
                          setGscImpressions(e.target.value)
                          markFieldEdited('gscImpressions')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGscImpressions')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        min="0"
                        value={prevGscImpressions}
                        onChange={(e) => {
                          setPrevGscImpressions(e.target.value)
                          markFieldEdited('prevGscImpressions')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Avg Pos (Current) {renderFieldBadge('gscPosition')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        step="0.1"
                        min="0"
                        value={gscPosition}
                        onChange={(e) => {
                          setGscPosition(e.target.value)
                          markFieldEdited('gscPosition')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGscPosition')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        step="0.1"
                        min="0"
                        value={prevGscPosition}
                        onChange={(e) => {
                          setPrevGscPosition(e.target.value)
                          markFieldEdited('prevGscPosition')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Click-Through Rate (CTR %) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        CTR % (Current) {renderFieldBadge('gscCtr')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        step="0.1"
                        min="0"
                        placeholder="e.g. 2.6"
                        value={gscCtr}
                        onChange={(e) => {
                          setGscCtr(e.target.value)
                          markFieldEdited('gscCtr')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGscCtr')}
                      </label>
                      <ThemedNumberInput
                        theme="emerald"
                        step="0.1"
                        min="0"
                        placeholder="e.g. 2.2"
                        value={prevGscCtr}
                        onChange={(e) => {
                          setPrevGscCtr(e.target.value)
                          markFieldEdited('prevGscCtr')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 3: Google Analytics 4 (GA4) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>Analytics (GA4)</span>
                  </div>

                  {/* Total Users */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Total Users (Current) {renderFieldBadge('gaUsers')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={gaUsers}
                        onChange={(e) => {
                          setGaUsers(e.target.value)
                          markFieldEdited('gaUsers')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block" title="Total Users (Prior Month)">
                        Prior Month {renderFieldBadge('prevGaUsers')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={prevGaUsers}
                        onChange={(e) => {
                          setPrevGaUsers(e.target.value)
                          markFieldEdited('prevGaUsers')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Sessions (Current) {renderFieldBadge('gaSessions')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={gaSessions}
                        onChange={(e) => {
                          setGaSessions(e.target.value)
                          markFieldEdited('gaSessions')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGaSessions')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={prevGaSessions}
                        onChange={(e) => {
                          setPrevGaSessions(e.target.value)
                          markFieldEdited('prevGaSessions')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Pageviews */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        Views (Current) {renderFieldBadge('gaViews')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={gaViews}
                        onChange={(e) => {
                          setGaViews(e.target.value)
                          markFieldEdited('gaViews')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGaViews')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={prevGaViews}
                        onChange={(e) => {
                          setPrevGaViews(e.target.value)
                          markFieldEdited('prevGaViews')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* New Users */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-500 truncate block">
                        New Users (Current) {renderFieldBadge('gaNewUsers')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={gaNewUsers}
                        onChange={(e) => {
                          setGaNewUsers(e.target.value)
                          markFieldEdited('gaNewUsers')
                        }}
                        inputClassName="font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-400 truncate block">
                        Prior Month {renderFieldBadge('prevGaNewUsers')}
                      </label>
                      <ThemedNumberInput
                        theme="indigo"
                        min="0"
                        value={prevGaNewUsers}
                        onChange={(e) => {
                          setPrevGaNewUsers(e.target.value)
                          markFieldEdited('prevGaNewUsers')
                        }}
                        inputClassName="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Deep Metric Tables */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Deep Metric Tables (Top 5 Queries &amp; Top 5 Pages)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Detailed search queries and landing pages for Page 2 of the report
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Table 1: Top 5 Search Queries */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        <Search className="w-3.5 h-3.5" />
                        <span>Top 5 Search Keywords (Google Search Console)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md font-semibold border border-emerald-200 dark:border-emerald-800">
                        GSC Performance
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Where to find: In <strong className="text-slate-700 dark:text-slate-300">GSC &gt; Performance &gt; Queries</strong> tab. Enter the top 5 search terms driving impressions and clicks.
                    </p>
                  </div>

                  {/* Header labels row */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    <div className="col-span-6 flex items-center gap-1">
                      <span>#</span>
                      <span className="ml-1">Search Query / Keyword</span>
                    </div>
                    <div className="col-span-2 text-right" title="Organic Clicks from Google Search">
                      Clicks
                    </div>
                    <div className="col-span-2 text-right" title="Search Impressions in Google Results">
                      Impressions
                    </div>
                    <div className="col-span-2 text-right" title="Average Ranking Position on Google">
                      Avg. Pos
                    </div>
                  </div>

                  <div className="space-y-2">
                    {topQueries.map((q, idx) => {
                      const queryPlaceholders = [
                        'e.g. weed dispensary near me',
                        'e.g. cannabis delivery service',
                        'e.g. dispensaries open late',
                        'e.g. best weed deals near me',
                        'e.g. thc edibles and vapes',
                      ]
                      return (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-6 flex items-center gap-1.5">
                            <span className="w-5 text-center text-[10px] font-mono font-bold text-slate-400 shrink-0">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              placeholder={queryPlaceholders[idx] || `Keyword #${idx + 1}`}
                              value={q.query}
                              onChange={(e) => handleQueryChange(idx, 'query', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <ThemedNumberInput
                              theme="emerald"
                              min="0"
                              placeholder="0"
                              value={q.clicks === 0 || q.clicks === '' ? '' : q.clicks}
                              onChange={(e) => handleQueryChange(idx, 'clicks', e.target.value)}
                              inputClassName="text-right focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <ThemedNumberInput
                              theme="emerald"
                              min="0"
                              placeholder="0"
                              value={q.impressions === 0 || q.impressions === '' ? '' : q.impressions}
                              onChange={(e) => handleQueryChange(idx, 'impressions', e.target.value)}
                              inputClassName="text-right focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <ThemedNumberInput
                              theme="emerald"
                              step="0.1"
                              min="1.0"
                              placeholder="1.0"
                              value={q.position !== undefined && q.position !== null ? q.position : ''}
                              onChange={(e) => handleQueryChange(idx, 'position', e.target.value)}
                              inputClassName="text-right focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Table 2: Top 5 High-Value Pages */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Top 5 Landing Pages (GSC)</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md font-semibold border border-indigo-200 dark:border-indigo-800">
                        Google Search Console
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Where to find: In <strong className="text-slate-700 dark:text-slate-300">GSC &gt; Performance &gt; Search results &gt; Pages</strong> tab. Enter the top URLs by impressions and average position.
                    </p>
                  </div>

                  {/* Header labels row */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    <div className="col-span-6 flex items-center gap-1">
                      <span>#</span>
                      <span className="ml-1">Page URL / Path</span>
                    </div>
                    <div className="col-span-3 text-right" title="Search Impressions for this URL">
                      Impressions
                    </div>
                    <div className="col-span-3 text-right" title="Average Search Ranking Position">
                      Avg. Position
                    </div>
                  </div>

                  <div className="space-y-2">
                    {topPages.map((p, idx) => {
                      const pagePlaceholders = [
                        '/ (Homepage)',
                        '/menu or /products',
                        '/deals or /specials',
                        '/about-us or /locations',
                        '/contact-us',
                      ]
                      return (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-6 flex items-center gap-1.5">
                            <span className="w-5 text-center text-[10px] font-mono font-bold text-slate-400 shrink-0">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              placeholder={pagePlaceholders[idx] || (idx === 0 ? '/' : `/service-${idx}`)}
                              value={p.path}
                              onChange={(e) => handlePageChange(idx, 'path', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <ThemedNumberInput
                              theme="indigo"
                              min="0"
                              placeholder="0"
                              value={p.impressions === 0 || p.impressions === '' || p.impressions === undefined ? '' : p.impressions}
                              onChange={(e) => handlePageChange(idx, 'impressions', e.target.value)}
                              inputClassName="text-right focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <ThemedNumberInput
                              theme="indigo"
                              step="0.1"
                              min="1.0"
                              placeholder="1.0"
                              value={p.position !== undefined && p.position !== null ? p.position : ''}
                              onChange={(e) => handlePageChange(idx, 'position', e.target.value)}
                              inputClassName="text-right focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Narrative Text Fields */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <FileText className="w-4 h-4 text-rose-500" />
                <span>{summaryTitle || 'Performance Highlights & Strategic Updates'}</span>
              </div>

              {/* Customizable Summary Heading / Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Summary Section Heading / Title
                </label>
                <input
                  type="text"
                  value={summaryTitle}
                  onChange={(e) => setSummaryTitle(e.target.value)}
                  placeholder="e.g. Performance Highlights & Strategic Updates"
                  className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>

              {/* Summary Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Summary Content
                  </label>
                  <button
                    type="button"
                    onClick={handleDraftSummaryFromMetrics}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer shadow-2xs"
                    title="Draft 3 structured bullet points based on live metrics"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>⚡ Draft Summary from Metrics</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide a concise 1-2 paragraph overview of performance, milestones achieved, and key growth drivers during this reporting period..."
                  className="w-full p-4 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Work Completed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Work Completed This Month (One item per line)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Renders as styled checklist</span>
                </div>
                <textarea
                  rows={5}
                  value={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.value)}
                  placeholder="• Optimized Google Business Profile primary category and weekly posts&#10;• Fixed meta title and description lengths across top 10 landing pages&#10;• Built 15 high-authority local citations and directory links&#10;• Reduced mobile Cumulative Layout Shift (CLS) on the service quote page"
                  className="w-full p-4 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Next Steps */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Next Steps & Priorities (One item per line)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Renders as roadmap targets</span>
                </div>
                <textarea
                  rows={4}
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="• Launch review generation SMS campaign targeting past 60-day customers&#10;• Implement structured schema markup for LocalBusiness and FAQ items&#10;• Publish 2 localized case study articles targeting high-intent suburbs"
                  className="w-full p-4 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/admin/reports"
                className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || Boolean(preflightData && !preflightData.ready && !isEditing)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-sm transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                title={preflightData && !preflightData.ready && !isEditing ? 'Monthly KPI metrics must be recorded first' : undefined}
              >
                {preflightData && !preflightData.ready && !isEditing ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                    <span>Monthly Metrics Required</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isEditing ? 'Updating Report...' : 'Generating Report...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Update Performance Report' : 'Save & View Branded Report'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
