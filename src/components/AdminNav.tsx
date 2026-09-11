import React from 'react'
import { AdminShell, type AdminShellProps } from './AdminShell'

export { AdminShell, type AdminShellProps }

export interface AdminNavProps {
  activeTab?:
    | 'dashboard'
    | 'messages'
    | 'posts'
    | 'media'
    | 'clients'
    | 'reports'
    | 'team'
    | 'activity'
    | 'agencies'
    | 'workspace'
    | 'my-work'
  title: string
  description?: string
  actions?: React.ReactNode
  userRole?: 'superadmin' | 'partner' | 'partner_employee' | 'client' | string | null
  userEmail?: string | null
  userName?: string | null
  children?: React.ReactNode
}

/**
 * AdminNav component maintained for backward compatibility.
 * Delegates to AdminShell.
 */
export function AdminNav({
  activeTab,
  title,
  description,
  actions,
  userRole,
  userEmail,
  userName,
  children,
}: AdminNavProps) {
  // If children are passed, render as full AdminShell wrapper
  if (children) {
    return (
      <AdminShell
        activeTab={activeTab as any}
        title={title}
        description={description}
        actions={actions}
        userRole={userRole}
        userEmail={userEmail}
        userName={userName}
      >
        {children}
      </AdminShell>
    )
  }

  // If rendered without children (legacy header pattern before wrapping page),
  // render the title, description, and actions row
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        {description && (
          <p className="text-[13px] text-[var(--muted)] mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
    </div>
  )
}
