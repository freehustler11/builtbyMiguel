import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search,
  Users,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react'

export interface ClientItem {
  id: string
  name: string
  businessName?: string | null
  websiteUrl?: string | null
  logoUrl?: string | null
  logoBgColor?: string | null
  primaryColor?: string | null
  partnerId?: string | null
  partner?: {
    id: string
    name: string | null
    email: string
  } | null
  reportCount?: number
}

export interface AgencyItem {
  id: string
  name: string | null
  email: string
}

export interface ClientPickerModalProps {
  isOpen: boolean
  onClose: () => void
  clients: ClientItem[]
  agencies?: AgencyItem[]
  selectedClientId?: string | null
  selectedAgencyId?: string | null
  userRole?: string | null
  activeSection?: string | null
  onSelectClient: (client: ClientItem | null) => void
  onSelectAgency?: (agencyId: string | null) => void
}

const RECENT_CLIENTS_KEY = 'admin_recent_clients'

export function recordRecentClient(client: { id: string; name: string; businessName?: string | null }) {
  try {
    const raw = localStorage.getItem(RECENT_CLIENTS_KEY)
    let list: Array<{ id: string; name: string; businessName?: string | null }> = raw ? JSON.parse(raw) : []
    // Remove if already exists
    list = list.filter((item) => item.id !== client.id)
    // Prepend to top
    list.unshift({
      id: client.id,
      name: client.name,
      businessName: client.businessName || null,
    })
    // Keep max 6 recents
    list = list.slice(0, 6)
    localStorage.setItem(RECENT_CLIENTS_KEY, JSON.stringify(list))
  } catch {
    // Ignore localStorage errors
  }
}

export function getRecentClients(): Array<{ id: string; name: string; businessName?: string | null }> {
  try {
    const raw = localStorage.getItem(RECENT_CLIENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function ClientPickerModal({
  isOpen,
  onClose,
  clients,
  agencies = [],
  selectedClientId,
  selectedAgencyId,
  userRole,
  activeSection,
  onSelectClient,
  onSelectAgency,
}: ClientPickerModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const isSuperadmin = userRole === 'superadmin' || userRole === 'admin'

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Get recent clients list
  const recentList = useMemo(() => {
    if (!isOpen) return []
    const stored = getRecentClients()
    // Map stored IDs to actual client objects in memory to get fresh details
    const map = new Map(clients.map((c) => [c.id, c]))
    return stored
      .map((item) => map.get(item.id))
      .filter((c): c is ClientItem => Boolean(c))
  }, [isOpen, clients])

  // Filtered clients list
  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase()
    let pool = clients
    if (isSuperadmin && selectedAgencyId && selectedAgencyId !== 'all') {
      if (selectedAgencyId === 'unassigned') {
        pool = pool.filter((c) => !c.partnerId)
      } else {
        pool = pool.filter((c) => c.partnerId === selectedAgencyId)
      }
    }

    if (!q) return pool

    return pool.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(q)
      const bizMatch = c.businessName?.toLowerCase().includes(q)
      const urlMatch = c.websiteUrl?.toLowerCase().includes(q)
      const agencyMatch = c.partner?.name?.toLowerCase().includes(q)
      return nameMatch || bizMatch || urlMatch || agencyMatch
    })
  }, [clients, query, isSuperadmin, selectedAgencyId])

  // Construct flat list of selectable items for keyboard navigation:
  // Item 0: "All Clients (Roll-Up Workspace)"
  // Followed by filtered clients
  const allSelectableItems = useMemo(() => {
    const items: Array<{ type: 'rollup' | 'client'; data?: ClientItem }> = [
      { type: 'rollup' },
    ]
    for (const c of filteredClients) {
      items.push({ type: 'client', data: c })
    }
    return items
  }, [filteredClients])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % allSelectableItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + allSelectableItems.length) % allSelectableItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = allSelectableItems[selectedIndex]
        if (selected) {
          if (selected.type === 'rollup') {
            onSelectClient(null)
          } else if (selected.data) {
            recordRecentClient(selected.data)
            onSelectClient(selected.data)
          }
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allSelectableItems, onClose, onSelectClient])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector('[data-active="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl rounded-[12px] bg-[var(--panel)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Client Selector"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--line)] gap-2.5 bg-[var(--canvas)]/40">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search clients by name, business, or domain..."
            className="flex-1 bg-transparent text-[13px] text-[var(--ink)] placeholder-[var(--muted)] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded-[4px] bg-[var(--panel)] border border-[var(--line)] text-[10px] text-[var(--muted)] font-mono">
            ESC
          </kbd>
        </div>

        {/* Agency Filter (Superadmin only) */}
        {isSuperadmin && agencies.length > 0 && (
          <div className="px-4 py-2 border-b border-[var(--line)] bg-[var(--canvas)]/20 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[var(--muted)] font-medium shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Agency:
            </span>
            <button
              type="button"
              onClick={() => onSelectAgency?.(null)}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition cursor-pointer shrink-0 ${
                !selectedAgencyId || selectedAgencyId === 'all'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
              }`}
            >
              All Agencies
            </button>
            {agencies.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelectAgency?.(a.id)}
                className={`px-2 py-0.5 rounded-[4px] font-medium transition cursor-pointer shrink-0 ${
                  selectedAgencyId === a.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50'
                }`}
              >
                {a.name || a.email}
              </button>
            ))}
          </div>
        )}

        {/* Client List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Option: All Clients (Roll-Up) */}
          <div
            data-active={selectedIndex === 0}
            onClick={() => {
              onSelectClient(null)
              onClose()
            }}
            className={`
              flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors text-[13px]
              ${
                selectedIndex === 0
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                  : 'text-[var(--ink)] hover:bg-[var(--line)]/30'
              }
              ${!selectedClientId ? 'ring-1 ring-[var(--accent)]/30' : ''}
            `}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 ${
                  selectedIndex === 0
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--line)]/60 text-[var(--muted)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">All Clients (Agency Roll-Up)</span>
                <span className="text-[11px] text-[var(--muted)]">
                  Cross-client boards and internal tasks
                </span>
              </div>
            </div>
            {!selectedClientId && (
              <span className="text-[11px] font-medium text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--accent)]/10">
                Active
              </span>
            )}
          </div>

          {/* Recent Clients Section (only when not actively searching) */}
          {!query && recentList.length > 0 && (
            <div className="pt-2 pb-1">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recent Clients
              </div>
              <div className="grid grid-cols-2 gap-1.5 px-1 py-1">
                {recentList.map((rc) => {
                  const isCurrent = selectedClientId === rc.id
                  return (
                    <button
                      key={`recent-${rc.id}`}
                      type="button"
                      onClick={() => {
                        recordRecentClient(rc)
                        onSelectClient(rc)
                        onClose()
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] border text-left transition cursor-pointer ${
                        isCurrent
                          ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]'
                          : 'border-[var(--line)] bg-[var(--canvas)]/50 text-[var(--ink)] hover:border-[var(--line)]/80 hover:bg-[var(--canvas)]'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-[4px] bg-[var(--line)]/70 text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {(rc.businessName || rc.name || 'C').slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-[12px] font-medium truncate">
                        {rc.businessName || rc.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* All Filtered Clients Section */}
          <div className="pt-2">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted)] flex items-center justify-between">
              <span>Clients ({filteredClients.length})</span>
              {activeSection && (
                <span className="text-[10px] text-[var(--accent)] lowercase font-normal">
                  keeps section: {activeSection.replace('-', ' ')}
                </span>
              )}
            </div>

            {filteredClients.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">
                No clients found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredClients.map((client, idx) => {
                const itemIndex = idx + 1 // +1 for Roll-Up option
                const isFocused = selectedIndex === itemIndex
                const isSelected = selectedClientId === client.id

                return (
                  <div
                    key={client.id}
                    data-active={isFocused}
                    onClick={() => {
                      recordRecentClient(client)
                      onSelectClient(client)
                      onClose()
                    }}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors text-[13px]
                      ${
                        isFocused
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                          : 'text-[var(--ink)] hover:bg-[var(--line)]/30'
                      }
                      ${isSelected ? 'ring-1 ring-[var(--accent)]/40 bg-[var(--accent)]/5' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {client.logoUrl ? (
                        <div
                          className="w-7 h-7 rounded-[6px] border border-[var(--line)] overflow-hidden p-0.5 flex items-center justify-center shrink-0"
                          style={{ backgroundColor: client.logoBgColor || '#ffffff' }}
                        >
                          <img
                            src={client.logoUrl}
                            alt={client.businessName || client.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-[6px] flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[var(--accent)] text-white'
                              : 'bg-[var(--line)] text-[var(--ink)]'
                          }`}
                          style={client.primaryColor && !isSelected ? { backgroundColor: client.primaryColor, color: '#ffffff' } : undefined}
                        >
                          {(client.businessName || client.name || 'C').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[13px] truncate">
                            {client.businessName || client.name}
                          </span>
                          {client.businessName && client.name && (
                            <span className="text-[11px] text-[var(--muted)] truncate">
                              ({client.name})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                          {client.websiteUrl && (
                            <span className="truncate">
                              {client.websiteUrl.replace(/^https?:\/\//, '')}
                            </span>
                          )}
                          {isSuperadmin && client.partner?.name && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-[var(--line)]/50">
                              <Building2 className="w-2.5 h-2.5" />
                              {client.partner.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="text-[11px] font-medium text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--accent)]/10">
                          Active
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[var(--muted)] opacity-50" />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[var(--line)] bg-[var(--canvas)]/40 flex items-center justify-between text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px]">
                ↑
              </kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px]">
                ↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[10px]">
                ↵
              </kbd>{' '}
              select
            </span>
          </div>
          <span className="hidden sm:inline">
            Preserves active tab on client switch
          </span>
        </div>
      </div>
    </div>
  )
}
