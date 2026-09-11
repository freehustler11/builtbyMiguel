import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  User,
  Edit2,
  Trash2,
  Globe,
  ArrowUpRight,
  Briefcase,
  Building2,
  Plus,
  FileSpreadsheet,
} from 'lucide-react'
import type { ClientWithReportCount, PartnerSummary } from '../server/clients'

export interface ClientCardProps {
  client: ClientWithReportCount
  isSuperadmin: boolean
  partnersList?: PartnerSummary[]
  isAssigningId?: string | null
  onEdit?: (client: ClientWithReportCount) => void
  onDelete?: (client: ClientWithReportCount) => void
  onAssignPartner?: (clientId: string, partnerId: string) => void
}

export function ClientCard({
  client,
  isSuperadmin,
  partnersList = [],
  isAssigningId = null,
  onEdit,
  onDelete,
  onAssignPartner,
}: ClientCardProps) {
  const primary = client.primaryColor || '#2563eb'
  const secondary = client.secondaryColor || '#1e293b'

  return (
    <div className="rounded-[8px] bg-[var(--panel)] border border-[var(--line)] p-5 transition flex flex-col justify-between space-y-4 group">
      <div className="space-y-4">
        {/* Card Header: Logo, Name, Edit / Delete */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {client.logoUrl ? (
              <div
                className="w-10 h-10 rounded-[6px] border border-[var(--line)] overflow-hidden p-1 flex items-center justify-center shrink-0"
                style={{ backgroundColor: (client as any).logoBgColor || '#ffffff' }}
              >
                <img
                  src={client.logoUrl}
                  alt={client.businessName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-[6px] flex items-center justify-center font-medium text-sm text-white shrink-0"
                style={{ backgroundColor: primary }}
              >
                {client.businessName.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-medium text-[var(--ink)] truncate">
                  {client.businessName}
                </h3>
                {client.isWhiteLabel && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    <span>White-label</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                <User className="w-3 h-3 text-[var(--muted)]" />
                <span className="truncate">{client.name}</span>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(client)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Edit client"
                  aria-label="Edit client"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(client)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                  title="Archive client"
                  aria-label="Archive client"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Website Link */}
        {client.websiteUrl && (
          <a
            href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--accent)] truncate max-w-full"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
            <span className="truncate">{client.websiteUrl.replace(/^https?:\/\//, '')}</span>
            <ArrowUpRight className="w-3 h-3 shrink-0" />
          </a>
        )}

        {/* Partner Agency Assignment Section */}
        {isSuperadmin ? (
          <div className="p-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span className="text-[11px] font-medium text-[var(--muted)]">
                  Assigned partner agency
                </span>
              </div>
              {client.partner ? (
                <Link
                  to="/admin/agencies/$partnerId"
                  params={{ partnerId: client.partner.id }}
                  className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--muted)]"
                >
                  {client.partner.name || client.partner.email}
                </Link>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-[var(--panel)] text-[var(--muted)] border border-[var(--line)]">
                  Direct client
                </span>
              )}
            </div>

            {/* Instant Assignment Dropdown */}
            {onAssignPartner && (
              <div className="relative">
                <select
                  value={client.partnerId || ''}
                  disabled={isAssigningId === client.id}
                  onChange={(e) => onAssignPartner(client.id, e.target.value)}
                  aria-label="Assign partner agency"
                  className="w-full text-[13px] font-normal rounded-[6px] border border-[var(--line)] bg-[var(--panel)] py-1.5 px-2.5 text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer disabled:opacity-50"
                >
                  <option value="">Direct client (Superadmin)</option>
                  {partnersList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.email} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span className="font-normal text-[var(--ink)]">Managed by your agency</span>
            </div>
          </div>
        )}

        {/* Branding Colors Preview & White-Label Details */}
        <div className="space-y-2 pt-1 border-t border-[var(--line)]">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[var(--muted)] text-[11px] font-medium">Brand theme</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-[var(--line)]"
                style={{ backgroundColor: primary }}
                title={`Primary: ${primary}`}
              />
              <div
                className="w-3.5 h-3.5 rounded-full border border-[var(--line)]"
                style={{ backgroundColor: secondary }}
                title={`Secondary: ${secondary}`}
              />
            </div>
          </div>

          {client.isWhiteLabel && client.partnerName && (
            <div className="text-[11px] text-[var(--muted)] truncate">
              Partner: <strong className="text-[var(--ink)] font-medium">{client.partnerName}</strong>
            </div>
          )}

          {/* Data Source Connection Badges */}
          <div className="flex items-center justify-between text-[13px] pt-1 border-t border-[var(--line)]">
            <span className="text-[var(--muted)] text-[11px] font-medium">Data access</span>
            <div className="flex items-center gap-1.5">
              {client.missingSources && client.missingSources.length === 0 ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] border border-emerald-200 dark:border-emerald-800">
                  All connected
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  {(['gsc', 'ga4', 'gbp'] as const).map((src) => {
                    const status = client.dataSources?.[src] || 'connected'
                    const label = src.toUpperCase()
                    if (status === 'connected') {
                      return (
                        <span
                          key={src}
                          className="px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/30 text-[var(--success)] border border-emerald-200/60 dark:border-emerald-900/40"
                          title={`${label}: Connected`}
                        >
                          {label}
                        </span>
                      )
                    }
                    if (status === 'no_access') {
                      return (
                        <span
                          key={src}
                          className="px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium bg-rose-50 dark:bg-rose-950/30 text-[var(--danger)] border border-rose-200/60 dark:border-rose-900/40"
                          title={`${label}: No Access`}
                        >
                          No {label}
                        </span>
                      )
                    }
                    return (
                      <span
                        key={src}
                        className="px-1.5 py-0.5 rounded-[6px] text-[11px] font-medium bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]"
                        title={`${label}: N/A`}
                      >
                        {label} N/A
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Reports Count & Action Buttons */}
      <div className="pt-3 border-t border-[var(--line)] space-y-2.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[var(--muted)] text-[11px] font-medium">Monthly reports</span>
          <span className="font-medium text-[var(--ink)] px-2 py-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] tabular-nums text-[11px]">
            {client.reportCount} reports
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <Link
            to="/admin/clients/$clientId"
            params={{ clientId: client.id }}
            className="h-8 inline-flex items-center justify-center gap-1.5 px-2 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition"
            title="Open client CRM workspace"
          >
            <Briefcase className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Workspace</span>
          </Link>

          <Link
            to="/admin/reports/new"
            search={{ clientId: client.id }}
            className="h-8 inline-flex items-center justify-center gap-1 px-2 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition"
            title="Create new report"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report</span>
          </Link>

          <Link
            to="/admin/reports"
            search={{ clientId: client.id }}
            className="h-8 inline-flex items-center justify-center gap-1 px-2 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition"
            title="View client reports"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>Reports</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
