import React, { useState } from 'react'

export interface CodeTab {
  id: string
  label: string
  title: string
  lines: {
    code: string
    highlight?: boolean
  }[]
}

const DEFAULT_CODE_TABS: CodeTab[] = [
  {
    id: 'webhook',
    label: 'lead-pipeline.ts',
    title: 'lead-trigger',
    lines: [
      { code: 'export async function handleInboundLead(lead: Lead) {' },
      { code: '  // 1. Instant SMS & Dispatch Notification', highlight: false },
      { code: '  await smsDispatcher.sendLeadAlert(lead);', highlight: true },
      { code: '  ' },
      { code: '  // 2. Auto-sync to CRM and Google Calendar', highlight: false },
      { code: '  const crmRecord = await crmPipeline.sync(lead);', highlight: false },
      { code: '  await calendar.scheduleDiagnostic(lead.timeSlot);', highlight: false },
      { code: '  ' },
      { code: '  // 3. Provision Client Portal Workspace', highlight: false },
      { code: '  await clientPortal.createWorkspace(lead.email);', highlight: true },
      { code: '}' },
    ],
  },
  {
    id: 'schema',
    label: 'local-schema.json',
    title: 'local-seo-entity',
    lines: [
      { code: '{' },
      { code: '  "@context": "https://schema.org",' },
      { code: '  "@type": "LocalBusiness",' },
      { code: '  "name": "Your Local Business",' },
      { code: '  "geo": { "@type": "GeoCoordinates", "latitude": "30.2672" },', highlight: true },
      { code: '  "areaServed": ["Austin", "Round Rock", "Cedar Park"],' },
      { code: '  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0" }', highlight: true },
      { code: '}' },
    ],
  },
  {
    id: 'speed',
    label: 'speed.config.ts',
    title: 'edge-caching',
    lines: [
      { code: 'export default defineConfig({' },
      { code: '  edgeCaching: {', highlight: false },
      { code: '    ttfbTarget: "<120ms",', highlight: true },
      { code: '    imageOptimization: "avif-webp-adaptive",', highlight: false },
      { code: '    coreWebVitals: "strict-zero-fcp-lag",', highlight: true },
      { code: '  }' },
      { code: '})' },
    ],
  },
]

interface CodeTerminalInspectorProps {
  tabs?: CodeTab[]
}

export function CodeTerminalInspector({ tabs = DEFAULT_CODE_TABS }: CodeTerminalInspectorProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-slate-800 bg-[#111827]/95 shadow-2xl overflow-hidden backdrop-blur-xl transition-colors duration-200">
      {/* Top Bar with Title and Pill Tabs */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#0B0F17]/80">
        <div className="text-xs font-mono text-slate-400 font-semibold tracking-wide">
          {currentTab.title}
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900 border border-slate-800">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Code Snippet Area */}
      <div className="p-5 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-slate-300">
        <pre className="space-y-0.5">
          {currentTab.lines.map((line, idx) => (
            <div
              key={idx}
              className={`px-3 py-0.5 rounded-lg transition-colors ${
                line.highlight
                  ? 'bg-rose-500/15 text-rose-300 border-l-2 border-rose-500 font-medium'
                  : 'hover:bg-slate-800/30'
              }`}
            >
              <code>{line.code || '\u00A0'}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
