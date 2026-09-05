import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../../lib/auth'
import { AdminNav } from '../../../components/AdminNav'
import { ToastContainer, type ToastMessage } from '../../../components/Toast'
import { ClientCard } from '../../../components/ClientCard'
import {
  getClientsServerFn,
  type ClientWithReportCount,
} from '../../../server/clients'
import {
  getPartnersServerFn,
  assignClientPartnerServerFn,
  type PartnerItem,
} from '../../../server/partners'

export const Route = createFileRoute('/admin/agencies/unassigned')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role !== 'superadmin' && auth.role !== 'admin') {
      throw redirect({ to: '/admin' })
    }
    return { auth }
  },
  loader: async ({ context }) => {
    const [clientsRes, partnersRes] = await Promise.all([
      getClientsServerFn({ data: { partnerId: 'unassigned' } }),
      getPartnersServerFn(),
    ])
    return {
      clients: clientsRes.clients || [],
      partners: partnersRes.partners || [],
      currentAdmin: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Unassigned Clients | Agencies | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminUnassignedClientsPage,
})

function AdminUnassignedClientsPage() {
  const { clients: initialClients, partners, currentAdmin } = Route.useLoaderData()
  const [clients, setClients] = useState<ClientWithReportCount[]>(initialClients)
  const [isAssigningId, setIsAssigningId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  const handleAssignPartner = async (clientId: string, partnerId: string) => {
    setIsAssigningId(clientId)
    try {
      const res = await assignClientPartnerServerFn({
        data: {
          clientId,
          partnerId: partnerId || null,
        },
      })
      if (res?.client) {
        if (partnerId) {
          // If assigned to a partner, remove from unassigned view
          setClients((prev) => prev.filter((c) => c.id !== clientId))
          const targetPartner = partners.find((p) => p.id === partnerId)
          const pName = targetPartner ? targetPartner.name || targetPartner.email : 'partner agency'
          addToast('success', 'Client Reassigned', `Client successfully assigned to ${pName}.`)
        } else {
          addToast('info', 'Client Updated', 'Client kept as direct Superadmin account.')
        }
      }
    } catch (err: any) {
      addToast('error', 'Assignment Failed', err.message || 'Failed to update partner assignment.')
    } finally {
      setIsAssigningId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminNav
          activeTab="agencies"
          title="Unassigned Clients"
          description="Direct clients belonging to Superadmin that have not been assigned to any partner agency."
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
          <span className="font-bold text-slate-900 dark:text-white">
            Unassigned Clients
          </span>
        </nav>

        {/* Context Banner */}
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Direct Superadmin Accounts ({clients.length})
              </h2>
              <p className="text-xs text-amber-700 dark:text-amber-300/80">
                These clients are directly managed by built by Miguel. You can instantly assign any of them to a partner agency using the dropdown selector on each card.
              </p>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Unassigned Clients</h3>
              <p className="text-xs text-slate-500 font-mono max-w-md mx-auto">
                Every client in the system is currently assigned to a partner agency portfolio.
              </p>
            </div>
            <Link
              to="/admin/agencies"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
            >
              <span>Return to Agencies</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isSuperadmin={true}
                partnersList={partners}
                isAssigningId={isAssigningId}
                onAssignPartner={handleAssignPartner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
