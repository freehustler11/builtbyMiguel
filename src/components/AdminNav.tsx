import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  MessageSquare,
  FileText,
  ImageIcon,
  Users,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Activity,
  Database,
  Building2,
  UserCheck,
  KeyRound,
  LayoutGrid,
  CheckSquare,
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'
import { ChangePasswordModal } from './ChangePasswordModal'

interface AdminNavProps {
  activeTab: 'messages' | 'posts' | 'media' | 'clients' | 'reports' | 'team' | 'activity' | 'agencies' | 'workspace' | 'my-work'
  title: string
  description?: string
  actions?: React.ReactNode
  userRole?: 'superadmin' | 'partner' | 'partner_employee' | 'admin' | string | null
}

export function AdminNav({ activeTab, title, description, actions, userRole }: AdminNavProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const isPartner = userRole === 'partner' || userRole === 'partner_employee'
  const isEmployee = userRole === 'partner_employee'

  return (
    <div className="space-y-6 pb-6 border-b border-slate-200 dark:border-slate-800">
      {/* Top Bar: Admin Branding, System Health, Tabs, and Logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Badge & Tabs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {isPartner ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/50 dark:via-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/50 text-xs font-mono font-bold tracking-wide shadow-xs">
              <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{isEmployee ? 'Agency Staff Portal' : 'Partner Agency Portal'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/50 dark:via-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 text-xs font-mono font-bold tracking-wide shadow-xs">
              <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
              <span>built by Miguel · Superadmin</span>
            </div>
          )}

          {/* Navigation Segmented Switcher */}
          <nav className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner">
            {!isPartner && (
              <>
                <Link
                  to="/messages"
                  preload="intent"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inbound Leads</span>
                </Link>

                <Link
                  to="/admin/posts"
                  preload="intent"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'posts'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Blog CMS</span>
                </Link>

                <Link
                  to="/superadmin/activity"
                  preload="intent"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'activity'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity Logs</span>
                </Link>
              </>
            )}

            <Link
              to="/admin/media"
              preload="intent"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'media'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media Library</span>
            </Link>

            {isPartner ? (
              <Link
                to="/admin/clients"
                preload="intent"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'clients'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Clients</span>
              </Link>
            ) : (
              <Link
                to="/admin/agencies"
                preload="intent"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'agencies' || activeTab === 'clients'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Agencies</span>
              </Link>
            )}

            <Link
              to="/admin/reports"
              preload="intent"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Reports</span>
            </Link>

            {!isEmployee && (
              <Link
                to="/admin/team"
                preload="intent"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'team'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Team</span>
              </Link>
            )}

            {/* CRM Workspace (Dual-scope roll-up) */}
            <Link
              to="/admin/workspace"
              preload="intent"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'workspace'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>

            {/* My Work cross-client user dashboard */}
            <Link
              to="/my-work"
              preload="intent"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-work'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>My Work</span>
            </Link>
          </nav>
        </div>


        {/* Right: Live Connection Indicator, Public Preview & Logout */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Database & System Live Pulse */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Database className="w-3 h-3 text-emerald-500" />
            <span>PostgreSQL Live</span>
          </div>

          <a
            href={typeof window !== 'undefined' && window.location.hostname.includes('localhost') ? '/' : 'https://builtbymiguel.net'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <ThemeToggle variant="pill" />

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shadow-xs hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer"
            title="Change Account Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Password</span>
          </button>

          <LogoutButton />
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Page Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
