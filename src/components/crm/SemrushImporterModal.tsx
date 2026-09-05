import React, { useState, useRef, useEffect } from 'react'
import {
  Upload,
  X,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react'
import {
  previewSemrushCsvServerFn,
  commitSemrushCsvImportServerFn,
  type SemrushPreviewMatchedItem,
  type SemrushPreviewUnmatchedItem,
} from '../../server/crm'

export interface SemrushImporterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clientId?: string
  clientName?: string
  clientsList?: Array<{ id: string; name: string; businessName: string }>
}

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

export function SemrushImporterModal({
  isOpen,
  onClose,
  onSuccess,
  clientId: propClientId,
  clientName: propClientName,
  clientsList = [],
}: SemrushImporterModalProps) {
  const now = new Date()
  const [selectedClientId, setSelectedClientId] = useState<string>(
    propClientId || (clientsList.length > 0 ? clientsList[0].id : '')
  )
  const [month, setMonth] = useState<number>(now.getMonth() + 1)
  const [year, setYear] = useState<number>(now.getFullYear())

  // Keep selectedClientId in sync if propClientId changes
  useEffect(() => {
    if (propClientId) {
      setSelectedClientId(propClientId)
    } else if (!selectedClientId && clientsList.length > 0) {
      setSelectedClientId(clientsList[0].id)
    }
  }, [propClientId, clientsList])

  // Step state: 'upload' | 'preview' | 'committing' | 'done'
  const [step, setStep] = useState<'upload' | 'preview' | 'committing' | 'done'>('upload')
  const [fileName, setFileName] = useState<string>('')
  const [rawRows, setRawRows] = useState<Array<{ keyword: string; rank?: number | null; searchVolume?: number | null; targetUrl?: string | null }>>([])
  const [isParsing, setIsParsing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Preview results from server
  const [matched, setMatched] = useState<SemrushPreviewMatchedItem[]>([])
  const [unmatched, setUnmatched] = useState<SemrushPreviewUnmatchedItem[]>([])
  const [stats, setStats] = useState<{
    matchedCount: number
    unmatchedCount: number
    improvedCount: number
    declinedCount: number
    unchangedCount: number
  } | null>(null)

  // Unmatched opt-in creation toggle (strictly default false!)
  const [createUnmatched, setCreateUnmatched] = useState<boolean>(false)

  // Commit results
  const [commitSummary, setCommitSummary] = useState<{ updatedCount: number; createdCount: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Reset state when closing or starting fresh
  const handleReset = () => {
    setStep('upload')
    setFileName('')
    setRawRows([])
    setIsParsing(false)
    setErrorMsg(null)
    setMatched([])
    setUnmatched([])
    setStats(null)
    setCreateUnmatched(false)
    setCommitSummary(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processCsvFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processCsvFile(file)
    }
  }

  // Parse CSV client-side into structured rows
  const processCsvFile = (file: File) => {
    setErrorMsg(null)
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Please upload a standard .csv file.')
      return
    }

    setFileName(file.name)
    setIsParsing(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = (event.target?.result as string) || ''
        const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0)

        if (lines.length < 2) {
          throw new Error('CSV file contains no data rows.')
        }

        // Header detection
        const rawHeaders = parseCsvLine(lines[0])
        const headers = rawHeaders.map((h) => h.toLowerCase().trim().replace(/['"]/g, ''))

        // Locate column indices
        const keywordIdx = headers.findIndex((h) =>
          ['keyword', 'keywords', 'search query', 'query', 'term'].includes(h)
        )
        const rankIdx = headers.findIndex((h) =>
          ['position', 'current position', 'rank', 'pos', 'google position'].includes(h)
        )
        const volumeIdx = headers.findIndex((h) =>
          ['search volume', 'volume', 'monthly volume', 'vol'].includes(h)
        )
        const urlIdx = headers.findIndex((h) =>
          ['url', 'target url', 'landing page', 'ranking url'].includes(h)
        )

        if (keywordIdx === -1) {
          throw new Error(
            `Could not find a "Keyword" column header in CSV. Detected headers: ${rawHeaders.join(', ')}`
          )
        }

        const parsedRows: Array<{ keyword: string; rank?: number | null; searchVolume?: number | null; targetUrl?: string | null }> = []

        for (let i = 1; i < lines.length; i++) {
          const cells = parseCsvLine(lines[i])
          const keyword = cells[keywordIdx]?.trim()
          if (!keyword) continue

          const rawRank = rankIdx !== -1 ? cells[rankIdx]?.trim() : ''
          const numRank = rawRank && !isNaN(Number(rawRank)) ? Number(rawRank) : null

          const rawVol = volumeIdx !== -1 ? cells[volumeIdx]?.trim().replace(/,/g, '') : ''
          const numVol = rawVol && !isNaN(Number(rawVol)) ? Number(rawVol) : null

          const rawUrl = urlIdx !== -1 ? cells[urlIdx]?.trim() : null

          parsedRows.push({
            keyword,
            rank: numRank,
            searchVolume: numVol,
            targetUrl: rawUrl,
          })
        }

        if (parsedRows.length === 0) {
          throw new Error('No valid keyword rows found in CSV.')
        }

        setRawRows(parsedRows)

        // Call server preview
        const res = await previewSemrushCsvServerFn({
          data: {
            clientId: selectedClientId,
            month,
            year,
            rows: parsedRows,
          },
        })

        setMatched(res.matched)
        setUnmatched(res.unmatched)
        setStats(res.stats)
        setStep('preview')
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse CSV file.')
      } finally {
        setIsParsing(false)
      }
    }

    reader.onerror = () => {
      setErrorMsg('Failed to read file from disk.')
      setIsParsing(false)
    }

    reader.readAsText(file)
  }

  // Basic CSV line parser handling quoted cells
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  // Commit handler
  const handleCommit = async () => {
    setStep('committing')
    setErrorMsg(null)

    try {
      const res = await commitSemrushCsvImportServerFn({
        data: {
          clientId: selectedClientId,
          month,
          year,
          matched: matched.map((m) => ({
            keywordId: m.keywordId,
            newRank: m.newCurrentRank,
            newVolume: m.newVolume,
            targetUrl: m.targetUrl,
          })),
          createUnmatched,
          unmatchedKeywords: unmatched,
        },
      })

      setCommitSummary({
        updatedCount: res.updatedCount,
        createdCount: res.createdCount,
      })
      setStep('done')
      onSuccess()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to commit CSV changes to database.')
      setStep('preview')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>SEMrush CSV Importer & Diff Preview</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Bulk Sync
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update keyword rankings, shift previous ranks, and record rank history for {propClientName || 'Client'}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Snapshot Month & Year Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Rank History Snapshot Period & Client Target</span>
                </div>
                <p className="text-xs text-slate-500">
                  Imported rankings will automatically be recorded into <strong>keyword_rank_history</strong> for this month and year:
                </p>

                {!propClientId && clientsList.length > 0 && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Client Account
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {clientsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.businessName} ({c.name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-3xl text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 hover:bg-purple-50/30 dark:hover:bg-purple-950/20"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isParsing ? 'Parsing CSV File...' : 'Drop your SEMrush Position Tracking CSV here'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Click to browse from your computer. Standard columns (Keyword, Position, Search Volume, URL) are detected automatically.
                </p>
              </div>

              {/* SEMrush Format Instructions */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>SEMrush Importer Safety Rules</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400">
                  <li><strong>Diff Preview Guarantee:</strong> No database changes are made until you review the exact rank changes.</li>
                  <li><strong>Rank Shifting:</strong> Existing rank shifts to <code>previous_rank</code> so movement indicators update accurately.</li>
                  <li><strong>No Silent Creations:</strong> Unmatched keywords are reported and will only be created if you explicitly opt-in.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: DIFF PREVIEW */}
          {step === 'preview' && (
            <div className="space-y-6">
              {/* Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-[10px] font-mono uppercase text-slate-400">Total in CSV</span>
                  <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
                    {rawRows.length}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-center">
                  <span className="block text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400">Matched</span>
                  <span className="text-base font-mono font-bold text-purple-700 dark:text-purple-300">
                    {stats?.matchedCount || 0}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="block text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400">Improved</span>
                  <span className="text-base font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    +{stats?.improvedCount || 0}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-center">
                  <span className="block text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400">Declined</span>
                  <span className="text-base font-mono font-bold text-rose-700 dark:text-rose-300">
                    -{stats?.declinedCount || 0}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-center">
                  <span className="block text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400">Unmatched</span>
                  <span className="text-base font-mono font-bold text-amber-700 dark:text-amber-300">
                    {stats?.unmatchedCount || 0}
                  </span>
                </div>
              </div>

              {/* Matched Keywords Diff Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Matched Keywords ({matched.length}) — Diff Preview</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Existing rank will shift to Previous Rank
                  </span>
                </div>

                {matched.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    No keywords matched your currently tracked client keywords.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 text-[10px] font-mono uppercase text-slate-500 z-10">
                          <tr>
                            <th className="py-2.5 px-3">Keyword</th>
                            <th className="py-2.5 px-3">Rank Shift</th>
                            <th className="py-2.5 px-3">Movement</th>
                            <th className="py-2.5 px-3">Search Vol</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {matched.map((m) => (
                            <tr key={m.keywordId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                                {m.keyword}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 line-through">
                                    {m.oldCurrentRank ? `#${m.oldCurrentRank}` : 'Unranked'}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                  <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {m.newCurrentRank ? `#${m.newCurrentRank}` : 'Unranked'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {m.rankDelta !== null && m.rankDelta > 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <TrendingUp className="w-3 h-3" />
                                    +{m.rankDelta}
                                  </span>
                                ) : m.rankDelta !== null && m.rankDelta < 0 ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                    <TrendingDown className="w-3 h-3" />
                                    {m.rankDelta}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    Unchanged
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">
                                {m.newVolume ? m.newVolume.toLocaleString() : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Unmatched Rows Section with Explicit Creation Opt-In */}
              {unmatched.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Unmatched Keywords ({unmatched.length} Rows Reported)</span>
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        These queries exist in your SEMrush CSV export but are <strong>not</strong> currently in this client's tracked keywords list.
                      </p>
                    </div>

                    {/* Explicit Creation Checkbox (DEFAULT: UNCHECKED) */}
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 shadow-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={createUnmatched}
                        onChange={(e) => setCreateUnmatched(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        Create {unmatched.length} new keywords
                      </span>
                    </label>
                  </div>

                  <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                    Silent creation is disabled to prevent export typos and junk queries from polluting client reports.
                    Leave unchecked to safely ignore unmatched rows.
                  </p>

                  {/* Sample list of unmatched queries */}
                  <div className="max-h-32 overflow-y-auto p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40 text-xs font-mono divide-y divide-amber-100 dark:divide-amber-900/30">
                    {unmatched.slice(0, 10).map((u, i) => (
                      <div key={i} className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>{u.keyword}</span>
                        <span className="text-[10px] text-slate-400">
                          Rank: {u.rank ? `#${u.rank}` : '—'} | Vol: {u.searchVolume ? u.searchVolume.toLocaleString() : '—'}
                        </span>
                      </div>
                    ))}
                    {unmatched.length > 10 && (
                      <div className="py-1 text-center text-[10px] text-amber-600 font-sans">
                        + {unmatched.length - 10} more unmatched queries
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUCCESS SUMMARY */}
          {step === 'done' && commitSummary && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  SEMrush CSV Import Committed Successfully
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Updated <strong>{commitSummary.updatedCount}</strong> tracked keywords with new rankings.
                  {commitSummary.createdCount > 0 && (
                    <span> Created <strong>{commitSummary.createdCount}</strong> new keywords.</span>
                  )}
                  {' '}Rank history snapshots recorded for <strong>{MONTH_NAMES[month - 1]} {year}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {step === 'preview' && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Upload Different File
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {step === 'done' ? 'Close' : 'Cancel'}
            </button>

            {step === 'preview' && (
              <button
                type="button"
                onClick={handleCommit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  Commit {matched.length} Updates {createUnmatched && unmatched.length > 0 ? `+ ${unmatched.length} New` : ''}
                </span>
              </button>
            )}

            {step === 'committing' && (
              <button
                disabled
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 opacity-60 cursor-not-allowed"
              >
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Applying Changes...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
