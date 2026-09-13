import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building2,
  BarChart3,
  UserCheck,
  MessageSquare,
  FileText,
  ImageIcon,
  Activity,
  Menu,
  X,
  Search,
  Calendar,
  Database,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  Table2,
  Send,
  User,
  Target,
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'
import { ChangePasswordModal } from './ChangePasswordModal'
import { EditProfileModal } from './EditProfileModal'
import {
  ClientPickerModal,
  recordRecentClient,
  type ClientItem,
  type AgencyItem,
} from './ClientPickerModal'
import { getClientsServerFn } from '../server/clients'
import { getNavBlockersServerFn, type NavBlockerCounts } from '../server/workflow'

export interface BreadcrumbContext {
  agency?: {
    id?: string | null
    name?: string | null
  } | null
  client?: {
    id?: string | null
    name?: string | null
    businessName?: string | null
  } | null
  section?: string | null
  availableSections?: Array<{ id: string; label: string }>
  onSectionChange?: (sectionId: string) => void
}

export interface AdminShellProps {
  activeTab?:
    | 'dashboard'
    | 'my-work'
    | 'clients'
    | 'agencies'
    | 'reports'
    | 'team'
    | 'messages'
    | 'posts'
    | 'media'
    | 'activity'
    | 'workspace'
  title: string
  description?: string
  actions?: React.ReactNode
  userRole?: 'superadmin' | 'partner' | 'partner_employee' | 'client' | string | null
  userEmail?: string | null
  userName?: string | null
  month?: number
  year?: number
  onMonthChange?: (month: number, year: number) => void
  breadcrumb?: BreadcrumbContext
  clients?: ClientItem[]
  agencies?: AgencyItem[]
  children?: React.ReactNode
}

interface NavItemDef {
  id: string
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  roles: Array<'superadmin' | 'partner' | 'partner_employee'>
  badgeType?: 'kpi' | 'reports' | 'queue'
}

interface NavGroupDef {
  name: string
  items: NavItemDef[]
}

const NAV_GROUPS: NavGroupDef[] = [
  {
    name: 'Today',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/admin',
        icon: LayoutDashboard,
        roles: ['superadmin', 'partner', 'partner_employee'],
      },
      {
        id: 'my-work',
        label: 'My work',
        to: '/my-work',
        icon: CheckSquare,
        roles: ['superadmin', 'partner', 'partner_employee'],
      },
      {
        id: 'queue',
        label: 'Publishing queue',
        to: '/admin/workspace?tab=queue',
        icon: Send,
        roles: ['superadmin', 'partner', 'partner_employee'],
        badgeType: 'queue',
      },
    ],
  },
  {
    name: 'Clients',
    items: [
      {
        id: 'clients',
        label: 'All clients',
        to: '/admin/clients',
        icon: Users,
        roles: ['superadmin', 'partner', 'partner_employee'],
      },
      {
        id: 'leads',
        label: 'Leads & Pipeline',
        to: '/admin/leads',
        icon: Target,
        roles: ['superadmin', 'partner', 'partner_employee'],
      },
      {
        id: 'agencies',
        label: 'Agencies',
        to: '/admin/agencies',
        icon: Building2,
        roles: ['superadmin'],
      },
    ],
  },
  {
    name: 'Reporting',
    items: [
      {
        id: 'metrics-grid',
        label: 'Monthly KPIs',
        to: '/admin/workspace?tab=metrics',
        icon: Table2,
        roles: ['superadmin', 'partner', 'partner_employee'],
        badgeType: 'kpi',
      },
      {
        id: 'reports',
        label: 'Reports',
        to: '/admin/reports',
        icon: BarChart3,
        roles: ['superadmin', 'partner', 'partner_employee'],
        badgeType: 'reports',
      },
    ],
  },
  {
    name: 'Agency',
    items: [
      {
        id: 'team',
        label: 'Team',
        to: '/admin/team',
        icon: UserCheck,
        roles: ['superadmin', 'partner'],
      },
    ],
  },
  {
    name: 'Business',
    items: [
      {
        id: 'messages',
        label: 'Inbound leads',
        to: '/messages',
        icon: MessageSquare,
        roles: ['superadmin'],
      },
    ],
  },
  {
    name: 'Website',
    items: [
      {
        id: 'posts',
        label: 'Blog',
        to: '/admin/posts',
        icon: FileText,
        roles: ['superadmin'],
      },
      {
        id: 'media',
        label: 'Media',
        to: '/admin/media',
        icon: ImageIcon,
        roles: ['superadmin', 'partner', 'partner_employee'],
      },
    ],
  },
  {
    name: 'System',
    items: [
      {
        id: 'activity',
        label: 'Activity',
        to: '/admin/activity',
        icon: Activity,
        roles: ['superadmin'],
      },
    ],
  },
]

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

const DEFAULT_CLIENT_SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'landing-pages', label: 'Landing pages' },
  { id: 'articles', label: 'Articles' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'deliverables', label: 'Tasks & Deliverables' },
  { id: 'citations', label: 'Citations' },
  { id: 'reports', label: 'Reports' },
  { id: 'metrics', label: 'Monthly Metrics' },
  { id: 'data-sources', label: 'Data Sources' },
  { id: 'locations', label: 'Locations' },
]

export function AdminShell({
  activeTab,
  title,
  description,
  actions,
  userRole,
  userEmail,
  userName,
  month: propMonth,
  year: propYear,
  onMonthChange,
  breadcrumb,
  clients: propClients,
  agencies: propAgencies,
  children,
}: AdminShellProps) {
  const routerState = useRouterState()
  const navigate = useNavigate()
  const currentPath = routerState.location.pathname

  // Sidebar rail toggle (expanded vs 56px icon rail)
  const [isRail, setIsRail] = useState(false)
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // Password change modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  // Profile edit modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeAvatarUrl, setActiveAvatarUrl] = useState<string | null>(null)
  const [activeDisplayName, setActiveDisplayName] = useState<string | null>(null)
  // User profile dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Client Picker Modal
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false)
  // Agency Dropdown in Breadcrumb
  const [isAgencyDropdownOpen, setIsAgencyDropdownOpen] = useState(false)
  const agencyDropdownRef = useRef<HTMLDivElement>(null)
  // Section Dropdown in Breadcrumb
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false)
  const sectionDropdownRef = useRef<HTMLDivElement>(null)

  // Internal client and agency lists if not provided via props
  const [internalClients, setInternalClients] = useState<ClientItem[]>(propClients || [])
  const [internalAgencies, setInternalAgencies] = useState<AgencyItem[]>(propAgencies || [])

  // Current selected month & year
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(propMonth || now.getUTCMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(propYear || now.getUTCFullYear())
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const monthPickerRef = useRef<HTMLDivElement>(null)
  const [blockers, setBlockers] = useState<NavBlockerCounts | null>(null)

  // Role
  const effectiveRole = (userRole as 'superadmin' | 'partner' | 'partner_employee') || 'partner'

  useEffect(() => {
    if (propMonth && propMonth !== selectedMonth) {
      setSelectedMonth(propMonth)
    }
  }, [propMonth])

  useEffect(() => {
    if (propYear && propYear !== selectedYear) {
      setSelectedYear(propYear)
    }
  }, [propYear])

  const currentAgencyId = breadcrumb?.agency?.id || null

  // Fetch nav blocker metrics whenever month, year, or agency changes
  useEffect(() => {
    if (userRole === 'client') return
    let isMounted = true
    getNavBlockersServerFn({
      data: {
        month: selectedMonth,
        year: selectedYear,
        partnerId: currentAgencyId || undefined,
      },
    })
      .then((res) => {
        if (isMounted) setBlockers(res)
      })
      .catch(() => {
        // ignore
      })
    return () => {
      isMounted = false
    }
  }, [userRole, selectedMonth, selectedYear, currentAgencyId])

  const handleMonthYearChange = (newMonth: number, newYear: number) => {
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
    if (onMonthChange) {
      onMonthChange(newMonth, newYear)
    }
  }

  // Fetch client & agency list lazily if missing
  useEffect(() => {
    if (propClients && propClients.length > 0) {
      setInternalClients(propClients)
    }
    if (propAgencies && propAgencies.length > 0) {
      setInternalAgencies(propAgencies)
    }
    if ((!propClients || propClients.length === 0) && userRole !== 'client') {
      getClientsServerFn()
        .then((res) => {
          if (res.clients) {
            setInternalClients(res.clients)
          }
          if (res.partners) {
            setInternalAgencies(res.partners)
          }
        })
        .catch(() => {
          // Ignore
        })
    }
  }, [propClients, propAgencies, userRole])

  // Restore rail preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_rail')
      if (saved !== null) {
        setIsRail(saved === 'true')
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsRail(true)
      }
    } catch {
      // ignore
    }
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false)
    setIsAgencyDropdownOpen(false)
    setIsSectionDropdownOpen(false)
  }, [currentPath])

  // Click outside to close user menu, month picker, and breadcrumb dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
        setIsMonthPickerOpen(false)
      }
      if (agencyDropdownRef.current && !agencyDropdownRef.current.contains(e.target as Node)) {
        setIsAgencyDropdownOpen(false)
      }
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(e.target as Node)) {
        setIsSectionDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut for client picker / search ('/' or 'Ctrl+K' / 'Cmd+K')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === '/' &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')
      ) {
        e.preventDefault()
        setIsClientPickerOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleRail = () => {
    const next = !isRail
    setIsRail(next)
    try {
      localStorage.setItem('admin_sidebar_rail', String(next))
    } catch {
      // ignore
    }
  }

  // Filter navigation items by role
  const visibleGroups = NAV_GROUPS.map((group) => ({
    name: group.name,
    items: group.items.filter((item) => item.roles.includes(effectiveRole)),
  })).filter((group) => group.items.length > 0)

  // Determine active item
  const isItemActive = (item: NavItemDef) => {
    if (activeTab) {
      return activeTab === item.id
    }
    if (item.to === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/'
    }
    return currentPath.startsWith(item.to)
  }

  const roleLabel =
    effectiveRole === 'superadmin'
      ? 'Superadmin'
      : effectiveRole === 'partner'
      ? 'Partner Agency'
      : 'Agency Staff'

  const userInitials = (userName || userEmail || 'U')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase()

  // Breadcrumb Values
  const currentAgencyName =
    breadcrumb?.agency?.name ||
    (currentAgencyId
      ? internalAgencies.find((a) => a.id === currentAgencyId)?.name || 'Agency'
      : 'All Agencies')

  const currentClientId = breadcrumb?.client?.id || null
  const currentClientLabel =
    breadcrumb?.client?.businessName ||
    breadcrumb?.client?.name ||
    (currentClientId
      ? internalClients.find((c) => c.id === currentClientId)?.businessName ||
        internalClients.find((c) => c.id === currentClientId)?.name ||
        'Client'
      : 'All clients')

  const currentSection = breadcrumb?.section || null
  const availableSections = breadcrumb?.availableSections || DEFAULT_CLIENT_SECTIONS
  const currentSectionLabel =
    availableSections.find((s) => s.id === currentSection)?.label ||
    (currentSection ? currentSection.replace('-', ' ') : null)

  // Handle client selection with section preservation & localStorage memory
  const handleSelectClient = (selectedClient: ClientItem | null) => {
    if (!selectedClient) {
      // Navigate to All Clients Roll-Up Workspace
      const validRollupTabs = ['landing-pages', 'articles', 'keywords', 'deliverables', 'citations', 'metrics']
      const targetTab = currentSection && validRollupTabs.includes(currentSection) ? currentSection : 'landing-pages'

      if (effectiveRole === 'superadmin' && currentAgencyId && currentAgencyId !== 'all') {
        navigate({
          to: '/admin/workspace',
          search: { partnerId: currentAgencyId, tab: targetTab } as any,
        })
      } else {
        navigate({
          to: '/admin/workspace',
          search: { tab: targetTab } as any,
        })
      }
      return
    }

    // Save recent client
    recordRecentClient(selectedClient)

    // Preserve current section if available, else restore remembered section
    let targetTab = currentSection
    if (!targetTab) {
      try {
        const saved = localStorage.getItem(`client_last_section_${selectedClient.id}`)
        if (saved) {
          targetTab = saved
        }
      } catch {
        // ignore
      }
    }
    if (!targetTab) {
      targetTab = 'landing-pages'
    }

    try {
      localStorage.setItem(`client_last_section_${selectedClient.id}`, targetTab)
    } catch {
      // ignore
    }

    navigate({
      to: '/admin/clients/$clientId',
      params: { clientId: selectedClient.id },
      search: { tab: targetTab } as any,
    })
  }

  // Handle section selection
  const handleSelectSection = (sectionId: string) => {
    if (breadcrumb?.onSectionChange) {
      breadcrumb.onSectionChange(sectionId)
      return
    }

    if (currentClientId) {
      try {
        localStorage.setItem(`client_last_section_${currentClientId}`, sectionId)
      } catch {
        // ignore
      }
      navigate({
        to: '/admin/clients/$clientId',
        params: { clientId: currentClientId },
        search: { tab: sectionId } as any,
      })
    } else {
      navigate({
        to: '/admin/workspace',
        search: {
          ...(currentAgencyId ? { partnerId: currentAgencyId } : {}),
          tab: sectionId,
        } as any,
      })
    }
  }

  // Handle agency selection (Superadmin only)
  const handleSelectAgency = (agencyId: string | null) => {
    if (agencyId) {
      navigate({
        to: '/admin/workspace',
        search: {
          partnerId: agencyId,
          ...(currentSection ? { tab: currentSection } : {}),
        } as any,
      })
    } else {
      navigate({
        to: '/admin/workspace',
        search: {
          ...(currentSection ? { tab: currentSection } : {}),
        } as any,
      })
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--canvas)] text-[var(--ink)] font-sans">
      {/* ------------------------------------------------------------- */}
      {/* MOBILE DRAWER OVERLAY (< 768px)                                */}
      {/* ------------------------------------------------------------- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR                                                  */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[var(--panel)] border-r border-[var(--line)] transition-all duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-60 shadow-xl' : '-translate-x-full md:translate-x-0'}
          ${isRail ? 'md:w-14' : 'md:w-60'}
        `}
      >
        {/* Brand / Portal Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-[var(--line)] shrink-0">
          <Link
            to="/admin"
            className={`flex items-center gap-2.5 overflow-hidden transition-opacity hover:opacity-90 ${
              isRail ? 'justify-center w-full' : ''
            }`}
            title="built by Miguel Admin"
          >
            <div className="w-7 h-7 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
              M
            </div>
            {!isRail && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[var(--ink)] truncate tracking-tight">
                  built by Miguel
                </span>
                <span className="text-[11px] text-[var(--muted)] truncate">
                  {roleLabel}
                </span>
              </div>
            )}
          </Link>

          {/* Close button on mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.name} className="space-y-0.5">
              {!isRail ? (
                <div className="px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] select-none">
                  {group.name}
                </div>
              ) : (
                <div className="h-px bg-[var(--line)] mx-1.5 my-2" title={group.name} />
              )}

              {group.items.map((item) => {
                const Icon = item.icon
                const active = isItemActive(item)
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    preload="intent"
                    title={isRail ? `${group.name}: ${item.label}` : undefined}
                    className={`
                      relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer
                      ${
                        active
                          ? 'border-l-2 border-[var(--accent)] text-[var(--accent)] font-medium bg-[var(--accent)]/5'
                          : 'border-l-2 border-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 font-normal'
                      }
                      ${isRail ? 'justify-center px-0' : ''}
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--accent)]' : ''}`} />
                    {!isRail && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badgeType === 'kpi' && blockers?.hasKpiBlocker && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30 leading-none"
                            title={`${blockers.missingKpiClientsCount} clients missing KPIs`}
                          >
                            !
                          </span>
                        )}
                        {item.badgeType === 'reports' && Boolean(blockers?.reportsRatio) && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium tabular-nums bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)] leading-none"
                            title={`${blockers?.ungeneratedReportsCount || 0} reports not yet generated`}
                          >
                            {blockers?.reportsRatio}
                          </span>
                        )}
                        {item.badgeType === 'queue' && Boolean(blockers && blockers.publishingQueueCount > 0) && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold tabular-nums bg-[var(--accent)] text-white leading-none"
                            title={`${blockers?.publishingQueueCount || 0} items in review queue`}
                          >
                            {blockers?.publishingQueueCount}
                          </span>
                        )}
                      </>
                    )}
                    {isRail && (
                      <>
                        {item.badgeType === 'kpi' && Boolean(blockers?.hasKpiBlocker) && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--warning)] ring-1 ring-[var(--panel)]" />
                        )}
                        {item.badgeType === 'reports' && Boolean(blockers?.hasReportBlocker) && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)] ring-1 ring-[var(--panel)]" />
                        )}
                        {item.badgeType === 'queue' && Boolean(blockers && blockers.publishingQueueCount > 0) && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)] ring-1 ring-[var(--panel)]" />
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: Rail Collapse Toggle (desktop only) */}
        <div className="hidden md:flex p-2 border-t border-[var(--line)] shrink-0">
          <button
            type="button"
            onClick={toggleRail}
            className={`
              w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[12px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition-colors cursor-pointer
              ${isRail ? 'justify-center px-0' : ''}
            `}
            title={isRail ? 'Expand sidebar (240px)' : 'Collapse to icon rail (56px)'}
          >
            {isRail ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
                <span className="truncate">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER (Right of Sidebar)                             */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out
          ${isRail ? 'md:ml-14' : 'md:ml-60'}
        `}
      >
        {/* ----------------------------------------------------------- */}
        {/* TOP BAR WITH PERSISTENT BREADCRUMB                          */}
        {/* ----------------------------------------------------------- */}
        <header className="h-14 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 bg-[var(--panel)]/90 backdrop-blur-xs border-b border-[var(--line)] gap-3">
          {/* Left: Mobile hamburger & Persistent Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-1.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Container */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium min-w-0 overflow-x-auto no-scrollbar py-1">
              {/* Agency Segment (Superadmin Only) */}
              {effectiveRole === 'superadmin' && (
                <>
                  <div className="relative shrink-0" ref={agencyDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsAgencyDropdownOpen(!isAgencyDropdownOpen)}
                      className="h-8 flex items-center gap-1 px-2 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer max-w-[140px] truncate"
                      title="Select Agency (Superadmin)"
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-[var(--muted)]" />
                      <span className="truncate">{currentAgencyName}</span>
                      <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
                    </button>

                    {isAgencyDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-52 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAgencyDropdownOpen(false)
                            handleSelectAgency(null)
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-[var(--line)]/40 cursor-pointer ${
                            !currentAgencyId ? 'text-[var(--accent)] font-semibold' : 'text-[var(--ink)]'
                          }`}
                        >
                          <span>All Agencies</span>
                          {!currentAgencyId && <span className="text-[10px]">✓</span>}
                        </button>
                        <div className="h-px bg-[var(--line)] my-1" />
                        {internalAgencies.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setIsAgencyDropdownOpen(false)
                              handleSelectAgency(a.id)
                            }}
                            className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-[var(--line)]/40 cursor-pointer ${
                              currentAgencyId === a.id ? 'text-[var(--accent)] font-semibold' : 'text-[var(--ink)]'
                            }`}
                          >
                            <span className="truncate">{a.name || a.email}</span>
                            {currentAgencyId === a.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]/50 shrink-0" />
                </>
              )}

              {/* Client Segment Button */}
              <button
                type="button"
                onClick={() => setIsClientPickerOpen(true)}
                className="h-8 flex items-center gap-1.5 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--line)]/80 hover:bg-[var(--line)]/20 transition cursor-pointer max-w-[160px] sm:max-w-[200px] shrink-0"
                title="Switch Client (Press Cmd+K or /)"
              >
                {currentClientId ? (
                  <Users className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                )}
                <span className="truncate font-medium">{currentClientLabel}</span>
                <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
              </button>

              {/* Section Segment (if available) */}
              {currentSection && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]/50 shrink-0" />
                  <div className="relative shrink-0" ref={sectionDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
                      className="h-8 flex items-center gap-1 px-2 rounded-[6px] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer max-w-[160px]"
                      title="Switch Section"
                    >
                      <span className="truncate capitalize">{currentSectionLabel}</span>
                      <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
                    </button>

                    {isSectionDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-52 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                        {availableSections.map((sec) => (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => {
                              setIsSectionDropdownOpen(false)
                              handleSelectSection(sec.id)
                            }}
                            className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-[var(--line)]/40 cursor-pointer ${
                              currentSection === sec.id
                                ? 'text-[var(--accent)] font-semibold bg-[var(--accent)]/5'
                                : 'text-[var(--ink)]'
                            }`}
                          >
                            <span>{sec.label}</span>
                            {currentSection === sec.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Quick Search Button, Month Selector, PostgreSQL Live, Live site, Theme & User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search / Client Switcher Trigger */}
            <button
              type="button"
              onClick={() => setIsClientPickerOpen(true)}
              className="hidden lg:flex h-8 items-center gap-2 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line)]/80 text-[11px] transition cursor-pointer"
              title="Search Clients & Views (Cmd+K / /)"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>Search...</span>
              <kbd className="inline-flex items-center h-4 px-1 rounded-[3px] bg-[var(--panel)] border border-[var(--line)] text-[9px] text-[var(--muted)] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Month Selector Dropdown */}
            <div className="relative" ref={monthPickerRef}>
              <button
                type="button"
                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                className="h-8 inline-flex items-center gap-1.5 px-2 sm:px-2.5 rounded-[6px] text-[12px] font-medium bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                title="Select Active Month"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                <span className="hidden sm:inline truncate">
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </span>
                <span className="sm:hidden truncate">
                  {MONTH_NAMES[selectedMonth - 1].slice(0, 3)}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--muted)]" />
              </button>

              {isMonthPickerOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-[var(--line)]">
                    <button
                      type="button"
                      onClick={() => handleMonthYearChange(selectedMonth, selectedYear - 1)}
                      className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[12px] font-semibold text-[var(--ink)]">{selectedYear}</span>
                    <button
                      type="button"
                      onClick={() => handleMonthYearChange(selectedMonth, selectedYear + 1)}
                      className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {MONTH_NAMES.map((m, idx) => {
                      const mNum = idx + 1
                      const isSelected = selectedMonth === mNum
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            handleMonthYearChange(mNum, selectedYear)
                            setIsMonthPickerOpen(false)
                          }}
                          className={`px-1.5 py-1 rounded-[4px] text-[11px] font-medium transition cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--accent)] text-white'
                              : 'text-[var(--ink)] hover:bg-[var(--line)]/40'
                          }`}
                        >
                          {m.slice(0, 3)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Live PostgreSQL Badge */}
            <div className="hidden xl:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[11px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
              </span>
              <Database className="w-3 h-3 text-[var(--success)]" />
              <span>PostgreSQL</span>
            </div>

            {/* Live Site Link (Superadmin only) */}
            {userRole === 'superadmin' && (
              <a
                href={
                  typeof window !== 'undefined' && window.location.hostname.includes('localhost')
                    ? '/'
                    : 'https://builtbymiguel.net'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                title="View Public Marketing Site"
              >
                <span>Live site</span>
                <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
              </a>
            )}

            {/* Theme Toggle */}
            <ThemeToggle variant="pill" />

            {/* User Profile Dropdown Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 inline-flex items-center gap-2 pl-1 pr-2 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                aria-label="User account menu"
              >
                {activeAvatarUrl ? (
                  <img
                    src={activeAvatarUrl}
                    alt={activeDisplayName || userName || 'Avatar'}
                    className="w-6 h-6 rounded-full object-cover bg-[var(--panel)] border border-[var(--line)]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-[11px] font-semibold flex items-center justify-center">
                    {userInitials}
                  </div>
                )}
                <span className="hidden sm:inline text-[12px] font-medium text-[var(--ink)] max-w-[100px] truncate">
                  {activeDisplayName || userName || (userEmail ? userEmail.split('@')[0] : 'Account')}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--muted)]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[var(--line)]">
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">
                      {activeDisplayName || userName || (userEmail ? userEmail.split('@')[0] : 'User')}
                    </div>
                    {userEmail && (
                      <div className="text-[11px] text-[var(--muted)] truncate mt-0.5 font-mono">
                        {userEmail}
                      </div>
                    )}
                    <div className="mt-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsProfileModalOpen(true)
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[12px] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span>Edit profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsPasswordModalOpen(true)
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[12px] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span>Change password</span>
                    </button>

                    <a
                      href="https://builtbymiguel.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[12px] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span>Marketing site</span>
                    </a>
                  </div>

                  <div className="p-1 border-t border-[var(--line)]">
                    <LogoutButton className="w-full justify-start text-[12px] border-none bg-transparent hover:bg-[var(--danger-subtle)] hover:text-[var(--danger)] px-2.5 py-1.5" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSuccess={(updated) => {
            if (updated.avatarUrl !== undefined) setActiveAvatarUrl(updated.avatarUrl)
            if (updated.name) setActiveDisplayName(updated.name)
          }}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />

        {/* Client Picker Modal */}
        <ClientPickerModal
          isOpen={isClientPickerOpen}
          onClose={() => setIsClientPickerOpen(false)}
          clients={internalClients}
          agencies={internalAgencies}
          selectedClientId={currentClientId}
          selectedAgencyId={currentAgencyId}
          userRole={effectiveRole}
          activeSection={currentSection}
          onSelectClient={handleSelectClient}
          onSelectAgency={handleSelectAgency}
        />

        {/* ----------------------------------------------------------- */}
        {/* PAGE CONTENT CONTAINER                                      */}
        {/* ----------------------------------------------------------- */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3.5 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4">
          {/* Page Header (Title, Description, and Actions) */}
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-[var(--ink)]">
                  {title}
                </h1>
                {description && (
                  <p className="text-[12px] text-[var(--muted)] mt-0.5 max-w-2xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
            </div>
          )}

          {/* Body */}
          {children}
        </main>
      </div>
    </div>
  )
}
