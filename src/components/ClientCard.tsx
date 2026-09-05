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
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-5 group">
      <div className="space-y-4">
        {/* Card Header: Logo, Name, Edit / Delete */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {client.logoUrl ? (
              <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white p-1 flex items-center justify-center shrink-0">
                <img
                  src={client.logoUrl}
                  alt={client.businessName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0"
                style={{ backgroundColor: primary }}
              >
                {client.businessName.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {client.businessName}
                </h3>
                {client.isWhiteLabel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    <span>White-Label</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <User className="w-3 h-3 text-slate-400" />
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
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Client"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(client)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Delete Client"
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
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 truncate max-w-full"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{client.websiteUrl.replace(/^https?:\/\//, '')}</span>
            <ArrowUpRight className="w-3 h-3 shrink-0" />
          </a>
        )}

        {/* Partner Agency Assignment Section */}
        {isSuperadmin ? (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Assigned Partner Agency
                </span>
              </div>
              {client.partner ? (
                <Link
                  to="/admin/agencies/$partnerId"
                  params={{ partnerId: client.partner.id }}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:underline"
                >
                  {client.partner.name || client.partner.email}
                </Link>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Direct Client
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
                  className="w-full text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Direct Client (Superadmin)</option>
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
          <div className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Managed by Your Agency</span>
            </div>
          </div>
        )}

        {/* Branding Colors Preview & White-Label Details */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Brand Theme</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full border border-white dark:border-slate-800 shadow-xs"
                style={{ backgroundColor: primary }}
                title={`Primary: ${primary}`}
              />
              <div
                className="w-4 h-4 rounded-full border border-white dark:border-slate-800 shadow-xs"
                style={{ backgroundColor: secondary }}
                title={`Secondary: ${secondary}`}
              />
            </div>
          </div>

          {client.isWhiteLabel && client.partnerName && (
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
              Partner: <strong className="text-slate-700 dark:text-slate-300">{client.partnerName}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Reports Count & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Monthly Reports</span>
          <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
            {client.reportCount} reports
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to="/admin/reports/new"
            search={{ clientId: client.id }}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Report</span>
          </Link>

          <Link
            to="/admin/reports"
            search={{ clientId: client.id }}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>All Reports</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
