import { Link, useLocation } from '@tanstack/react-router'
import {
  MessageSquare,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'

interface AdminNavProps {
  activeTab: 'messages' | 'posts'
  title: string
  description?: string
  actions?: React.ReactNode
}

export function AdminNav({ activeTab, title, description, actions }: AdminNavProps) {
  return (
    <div className="space-y-6 pb-6 border-b border-slate-200 dark:border-slate-800">
      {/* Top Bar: Admin Branding, Tabs, and Logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Badge & Tabs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-mono font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>Admin Console</span>
          </div>

          {/* Navigation Switcher */}
          <nav className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Link
              to="/messages"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'messages'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inbound Leads</span>
            </Link>

            <Link
              to="/admin/posts"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'posts'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Blog CMS</span>
            </Link>
          </nav>
        </div>

        {/* Right: Quick actions & Logout */}
        <div className="flex items-center gap-3">
          <Link
            to="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <LogoutButton />
        </div>
      </div>

      {/* Page Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
