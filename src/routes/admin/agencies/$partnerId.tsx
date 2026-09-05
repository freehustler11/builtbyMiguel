import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Building2,
  Users,
  BarChart3,
  Calendar,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Plus,
  ArrowLeft,
  FileSpreadsheet,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { AdminNav } from '../../../components/AdminNav'
import { ClientCard } from '../../../components/ClientCard'
import { getAgencyDetailServerFn, type AgencyDetailData } from '../../../server/partners'

export const Route = createFileRoute('/admin/agencies/$partnerId')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role !== 'superadmin' && auth.role !== 'admin') {
      throw redirect({ to: '/admin' })
    }
    return { auth }
  },
  loader: async ({ params, context }) => {
    const detail = await getAgencyDetailServerFn({
      data: { partnerId: params.partnerId },
    })
    return {
      detail,
      currentAdmin: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: ({ loaderData }) => {
    const name = loaderData?.detail?.partner?.name || loaderData?.detail?.partner?.email || 'Agency Detail'
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title: `${name} | Agencies | Admin | built by Miguel` },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: AdminAgencyDetailPage,
})

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function AdminAgencyDetailPage() {
  const { detail, currentAdmin } = Route.useLoaderData()
  const { partner, staff, clients, counts } = detail

  const agencyDisplayName = partner.name || partner.email
  const isSuspended = !partner.isActive

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminNav
          activeTab="agencies"
          title={agencyDisplayName}
          description="Agency portfolio, assigned staff accounts, and client report history."
          userRole={currentAdmin?.role}
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/admin/agencies"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Agencies</span>
              </Link>
            </div>
          }
        />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link
            to="/admin/agencies"
            className="hover:text-slate-900 dark:hover:text-white transition underline-offset-4 hover:underline"
          >
            Agencies
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {agencyDisplayName}
          </span>
        </nav>

        {/* Suspended Agency Alert Banner */}
        {isSuspended && (
          <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold">This agency account is currently suspended / inactive</p>
              <p className="text-rose-600 dark:text-rose-300">
                Agency login and staff member access are disabled until reactivated by a superadmin.
              </p>
            </div>
          </div>
        )}

        {/* Agency Profile Header Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center font-black text-lg shrink-0">
                {agencyDisplayName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {agencyDisplayName}
                  </h1>
                  {partner.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active Agency</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Suspended</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined {formatDate(partner.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500">Staff Members</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{counts.staffCount}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500">Managed Clients</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{counts.clientCount}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500">Reports This Month</span>
              <p className="text-lg font-black text-purple-600 dark:text-purple-400">{counts.reportsThisMonthCount}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500">Total Lifetime Reports</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{counts.totalReportsCount}</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: AGENCY STAFF (PARTNER EMPLOYEES)                               */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Agency Staff</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {staff.length}
              </span>
            </div>
          </div>

          {staff.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No staff members added yet</p>
              <p className="text-xs text-slate-500 font-mono">
                This agency owner has not created any staff sub-accounts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-6 font-semibold">Staff Member</th>
                    <th className="py-3 px-6 font-semibold">Email</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                        {member.name || member.email}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-600 dark:text-slate-300">
                        {member.email}
                      </td>
                      <td className="py-3.5 px-6">
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-400 text-xs">
                        {formatDate(member.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: AGENCY CLIENTS (REUSING CLIENTCARD COMPONENT)                  */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Agency Clients</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {clients.length}
              </span>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-2">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No clients assigned yet</p>
              <p className="text-xs text-slate-500 font-mono">
                This agency does not manage any clients currently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  isSuperadmin={true}
                  partnersList={[{
                    id: partner.id,
                    name: partner.name,
                    email: partner.email,
                    isActive: partner.isActive,
                  }]}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
