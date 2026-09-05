import { createFileRoute, redirect, useRouter, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  FileSpreadsheet,
  Palette,
  Sparkles,
  X,
  Check,
  Building2,
  User,
  Image as ImageIcon,
  ArrowUpRight,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { MediaPickerModal } from '../../components/MediaPickerModal'
import { ClientCard } from '../../components/ClientCard'
import {
  getClientsServerFn,
  createClientServerFn,
  updateClientServerFn,
  deleteClientServerFn,
  type ClientWithReportCount,
  type PartnerSummary,
} from '../../server/clients'
import {
  getPartnersServerFn,
  createPartnerServerFn,
  updatePartnerServerFn,
  togglePartnerActiveServerFn,
  assignClientPartnerServerFn,
  type PartnerItem,
} from '../../server/partners'
import type { Client } from '../../db/schema'

export const Route = createFileRoute('/admin/clients')({
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    if (auth.role === 'superadmin' || auth.role === 'admin') {
      throw redirect({ to: '/admin/agencies' })
    }
    return { auth }
  },
  loader: async ({ context }) => {
    const { clients, partners } = await getClientsServerFn()
    return {
      clients,
      partners: partners || [],
      currentAdmin: (context as any)?.auth || (await checkAuthServerFn()),
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Client Manager | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminClientsPage,
})

const COLOR_PRESETS = [
  '#2563eb', // Royal Blue
  '#e11d48', // Crimson Rose
  '#059669', // Emerald Green
  '#7c3aed', // Purple
  '#ea580c', // Sunset Orange
  '#0891b2', // Cyan / Teal
  '#4f46e5', // Indigo
  '#d97706', // Amber
  '#0f172a', // Midnight Slate
  '#1e293b', // Deep Charcoal
]

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function AdminClientsPage() {
  const router = useRouter()
  const { clients: initialClients, partners: initialPartners, currentAdmin } = Route.useLoaderData()
  const isSuperadmin = currentAdmin?.role === 'superadmin' || currentAdmin?.role === 'admin'

  const [clients, setClients] = useState(initialClients)
  const [partnersList, setPartnersList] = useState<PartnerSummary[]>(initialPartners)

  useEffect(() => {
    setClients(initialClients)
  }, [initialClients])

  useEffect(() => {
    setPartnersList(initialPartners)
  }, [initialPartners])

  // General State
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ClientWithReportCount | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Form State for Clients
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [secondaryColor, setSecondaryColor] = useState('#1e293b')
  const [isWhiteLabel, setIsWhiteLabel] = useState(false)
  const [partnerName, setPartnerName] = useState('')
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('')
  const [formPartnerId, setFormPartnerId] = useState<string>('')
  const [isPartnerLogoModalOpen, setIsPartnerLogoModalOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Partner Assignment State
  const [isAssigningId, setIsAssigningId] = useState<string | null>(null)

  // Partners Management Modal State (Superadmin only)
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false)
  const [partnerAccounts, setPartnerAccounts] = useState<PartnerItem[]>([])
  const [isLoadingPartners, setIsLoadingPartners] = useState(false)

  // Partner Create / Edit Sub-Modal
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null)
  const [partnerFormName, setPartnerFormName] = useState('')
  const [partnerFormEmail, setPartnerFormEmail] = useState('')
  const [partnerFormPassword, setPartnerFormPassword] = useState('')
  const [partnerFormIsActive, setPartnerFormIsActive] = useState(true)
  const [partnerFormError, setPartnerFormError] = useState<string | null>(null)
  const [partnerFormSubmitting, setPartnerFormSubmitting] = useState(false)
  const [togglingPartnerId, setTogglingPartnerId] = useState<string | null>(null)

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Load full partner accounts with client counts
  const loadPartnerAccounts = async () => {
    if (!isSuperadmin) return
    setIsLoadingPartners(true)
    try {
      const res = await getPartnersServerFn()
      setPartnerAccounts(res.partners)
      setPartnersList(
        res.partners.map((p) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          isActive: p.isActive,
        }))
      )
    } catch (err: unknown) {
      addToast('Error Loading Partners', err instanceof Error ? err.message : 'Could not fetch partners', 'error')
    } finally {
      setIsLoadingPartners(false)
    }
  }

  const handleOpenPartnersModal = () => {
    setIsPartnersModalOpen(true)
    loadPartnerAccounts()
  }

  const openCreateClientModal = () => {
    setEditingClient(null)
    setName('')
    setBusinessName('')
    setWebsiteUrl('')
    setLogoUrl('')
    setPrimaryColor('#2563eb')
    setSecondaryColor('#1e293b')
    setIsWhiteLabel(false)
    setPartnerName('')
    setPartnerLogoUrl('')
    setFormPartnerId('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditClientModal = (client: ClientWithReportCount) => {
    setEditingClient(client)
    setName(client.name)
    setBusinessName(client.businessName)
    setWebsiteUrl(client.websiteUrl || '')
    setLogoUrl(client.logoUrl || '')
    setPrimaryColor(client.primaryColor || '#2563eb')
    setSecondaryColor(client.secondaryColor || '#1e293b')
    setIsWhiteLabel(Boolean(client.isWhiteLabel))
    setPartnerName(client.partnerName || '')
    setPartnerLogoUrl(client.partnerLogoUrl || '')
    setFormPartnerId(client.partnerId || '')
    setFormError(null)
    setIsModalOpen(true)
  }

  // Instant Partner Assignment via Dropdown on Client Card
  const handleAssignPartner = async (clientId: string, newPartnerId: string) => {
    setIsAssigningId(clientId)
    const targetPartnerId = newPartnerId.trim() || null

    const matchedPartner = partnersList.find((p) => p.id === targetPartnerId)

    // Optimistic local update
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            partnerId: targetPartnerId,
            partner: matchedPartner ? { id: matchedPartner.id, name: matchedPartner.name, email: matchedPartner.email } : null,
          }
        }
        return c
      })
    )

    try {
      await assignClientPartnerServerFn({
        data: {
          clientId,
          partnerId: targetPartnerId,
        },
      })
      addToast(
        'Assignment Updated',
        matchedPartner
          ? `Client assigned to ${matchedPartner.name || matchedPartner.email}.`
          : 'Client set to Direct Agency Client (Superadmin).'
      )
      await router.invalidate()
    } catch (err: unknown) {
      addToast('Assignment Failed', err instanceof Error ? err.message : 'Could not reassign partner', 'error')
      await router.invalidate()
    } finally {
      setIsAssigningId(null)
    }
  }

  // Toggle Partner active status
  const handleTogglePartnerActive = async (partner: PartnerItem) => {
    const nextActive = !partner.isActive
    setTogglingPartnerId(partner.id)

    // Optimistic update
    setPartnerAccounts((prev) =>
      prev.map((p) => (p.id === partner.id ? { ...p, isActive: nextActive } : p))
    )

    try {
      await togglePartnerActiveServerFn({
        data: {
          id: partner.id,
          isActive: nextActive,
        },
      })
      addToast(
        nextActive ? 'Partner Activated' : 'Partner Suspended',
        `${partner.name || partner.email} account is now ${nextActive ? 'active' : 'suspended'}.`
      )
      await router.invalidate()
    } catch (err: unknown) {
      addToast('Status Update Failed', err instanceof Error ? err.message : 'Could not toggle partner status', 'error')
      // Revert
      setPartnerAccounts((prev) =>
        prev.map((p) => (p.id === partner.id ? { ...p, isActive: partner.isActive } : p))
      )
    } finally {
      setTogglingPartnerId(null)
    }
  }

  const openCreatePartnerForm = () => {
    setEditingPartner(null)
    setPartnerFormName('')
    setPartnerFormEmail('')
    setPartnerFormPassword('')
    setPartnerFormIsActive(true)
    setPartnerFormError(null)
    setIsPartnerFormOpen(true)
  }

  const openEditPartnerForm = (partner: PartnerItem) => {
    setEditingPartner(partner)
    setPartnerFormName(partner.name || '')
    setPartnerFormEmail(partner.email)
    setPartnerFormPassword('')
    setPartnerFormIsActive(partner.isActive)
    setPartnerFormError(null)
    setIsPartnerFormOpen(true)
  }

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setPartnerFormError(null)

    if (!partnerFormName.trim()) {
      setPartnerFormError('Partner name is required.')
      return
    }
    if (!partnerFormEmail.trim() || !partnerFormEmail.includes('@')) {
      setPartnerFormError('A valid email address is required.')
      return
    }
    if (!editingPartner && (!partnerFormPassword || partnerFormPassword.length < 6)) {
      setPartnerFormError('A password of at least 6 characters is required.')
      return
    }
    if (editingPartner && partnerFormPassword && partnerFormPassword.length < 6) {
      setPartnerFormError('New password must be at least 6 characters.')
      return
    }

    setPartnerFormSubmitting(true)
    try {
      if (editingPartner) {
        await updatePartnerServerFn({
          data: {
            id: editingPartner.id,
            name: partnerFormName.trim(),
            email: partnerFormEmail.trim(),
            password: partnerFormPassword.trim() || undefined,
            isActive: partnerFormIsActive,
          },
        })
        addToast('Partner Updated', `Updated account for ${partnerFormName}.`)
      } else {
        await createPartnerServerFn({
          data: {
            name: partnerFormName.trim(),
            email: partnerFormEmail.trim(),
            password: partnerFormPassword.trim(),
            isActive: partnerFormIsActive,
          },
        })
        addToast('Partner Created', `Created partner agency account for ${partnerFormName}.`)
      }

      setIsPartnerFormOpen(false)
      await loadPartnerAccounts()
      await router.invalidate()
    } catch (err: unknown) {
      setPartnerFormError(err instanceof Error ? err.message : 'Failed to save partner account.')
    } finally {
      setPartnerFormSubmitting(false)
    }
  }

  // Client Create & Edit Submit
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError('Contact name is required.')
      return
    }
    if (!businessName.trim()) {
      setFormError('Business name is required.')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingClient) {
        const res = await updateClientServerFn({
          data: {
            id: editingClient.id,
            name: name.trim(),
            businessName: businessName.trim(),
            websiteUrl: websiteUrl.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            primaryColor,
            secondaryColor,
            isWhiteLabel,
            partnerName: partnerName.trim() || undefined,
            partnerLogoUrl: partnerLogoUrl.trim() || undefined,
            partnerId: isSuperadmin ? formPartnerId.trim() || null : undefined,
          },
        })

        if (res.success && res.client) {
          const updated = res.client
          setClients((prev) =>
            prev.map((c) =>
              c.id === updated.id
                ? {
                    ...c,
                    ...updated,
                    partner: updated.partnerId
                      ? partnersList.find((p) => p.id === updated.partnerId) || c.partner
                      : null,
                  }
                : c
            )
          )
          addToast('Client Updated', `Updated ${res.client.businessName}.`)
          setIsModalOpen(false)
          await router.invalidate()
        }
      } else {
        const res = await createClientServerFn({
          data: {
            name: name.trim(),
            businessName: businessName.trim(),
            websiteUrl: websiteUrl.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            primaryColor,
            secondaryColor,
            isWhiteLabel,
            partnerName: partnerName.trim() || undefined,
            partnerLogoUrl: partnerLogoUrl.trim() || undefined,
            partnerId: isSuperadmin ? formPartnerId.trim() || null : undefined,
          },
        })

        if (res.success && res.client) {
          const created = res.client
          const matchedPartner = created.partnerId
            ? partnersList.find((p) => p.id === created.partnerId) || null
            : null
          const newClientItem: ClientWithReportCount = {
            ...created,
            reportCount: 0,
            partner: matchedPartner
              ? { id: matchedPartner.id, name: matchedPartner.name, email: matchedPartner.email }
              : null,
          }
          setClients((prev) => [newClientItem, ...prev])
          addToast('Client Created', `Created ${res.client.businessName}.`)
          setIsModalOpen(false)
          await router.invalidate()
        }
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'An error occurred while saving client.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return

    const targetId = clientToDelete.id
    setIsSubmitting(true)
    try {
      await deleteClientServerFn({ data: { id: targetId } })
      setClients((prev) => prev.filter((c) => c.id !== targetId))
      addToast('Client Deleted', `Removed ${clientToDelete.businessName} and associated reports.`)
      setClientToDelete(null)
      await router.invalidate()
    } catch (err: unknown) {
      addToast('Delete Failed', err instanceof Error ? err.message : 'Could not delete client.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      const matchName = c.name.toLowerCase().includes(q)
      const matchBiz = c.businessName.toLowerCase().includes(q)
      const matchWeb = c.websiteUrl?.toLowerCase().includes(q)
      const matchPartner = c.partner?.name?.toLowerCase().includes(q) || c.partner?.email?.toLowerCase().includes(q)
      return matchName || matchBiz || matchWeb || matchPartner
    })
  }, [clients, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Navigation */}
        <AdminNav
          activeTab="clients"
          userRole={currentAdmin?.role}
          title={isSuperadmin ? 'Client & Partner Manager' : 'Agency Clients'}
          description={
            isSuperadmin
              ? 'Manage agency clients, assign accounts to partner agencies, and configure white-label branding.'
              : 'Manage your assigned agency clients and generate branded monthly performance reports.'
          }
          actions={
            <div className="flex items-center gap-2.5">
              {isSuperadmin && (
                <button
                  type="button"
                  onClick={handleOpenPartnersModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>Manage Partners ({partnersList.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={openCreateClientModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </button>
            </div>
          }
        />

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isSuperadmin ? 'Search clients, websites, partners...' : 'Search your assigned clients...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Showing <strong>{filteredClients.length}</strong> of <strong>{clients.length}</strong> clients
            </span>
          </div>
        </div>

        {/* Client Cards Grid */}
        {filteredClients.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/30 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {searchQuery ? 'No matching clients found' : 'No clients found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try modifying your search keywords.'
                  : isSuperadmin
                  ? 'Add your first client or assign clients to partner agencies.'
                  : 'You do not have any clients assigned to your partner account yet.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={openCreateClientModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isSuperadmin={isSuperadmin}
                partnersList={partnersList}
                isAssigningId={isAssigningId}
                onEdit={openEditClientModal}
                onDelete={setClientToDelete}
                onAssignPartner={handleAssignPartner}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PARTNER AGENCIES MANAGEMENT MODAL (Superadmin only)                       */}
      {/* ========================================================================= */}
      {isPartnersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Partner Agencies Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create partner login accounts and view their assigned client portfolios.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openCreatePartnerForm}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Partner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPartnersModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content: Partners List */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {isLoadingPartners ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                  <span>Loading partner agency accounts...</span>
                </div>
              ) : partnerAccounts.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                  <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">No partner accounts yet</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Create partner agency logins so they can access their assigned clients and reports without seeing your internal agency leads and CMS.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openCreatePartnerForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Partner</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {partnerAccounts.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {partner.name || 'Unnamed Partner'}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              partner.isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                partner.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                              }`}
                            />
                            {partner.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span className="truncate">{partner.email}</span>
                          <span>·</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {partner.clientCount} assigned {partner.clientCount === 1 ? 'client' : 'clients'}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Active Toggle & Edit */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-slate-400">Status:</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={partner.isActive}
                            disabled={togglingPartnerId === partner.id}
                            onClick={() => handleTogglePartnerActive(partner)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                              partner.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span className="sr-only">Toggle partner active status</span>
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                partner.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => openEditPartnerForm(partner)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
              <span>Partners log in at <code>/login</code> using their email & password.</span>
              <button
                type="button"
                onClick={() => setIsPartnersModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTNER CREATE / EDIT SUB-MODAL                                           */}
      {/* ========================================================================= */}
      {isPartnerFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingPartner ? 'Edit Partner Account' : 'New Partner Agency Account'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set up credentials and dashboard access.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPartnerFormOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {partnerFormError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {partnerFormError}
              </div>
            )}

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Agency Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerFormName}
                  onChange={(e) => setPartnerFormName(e.target.value)}
                  placeholder="Apex Growth Agency"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Partner Login Email *
                </label>
                <input
                  type="email"
                  required
                  value={partnerFormEmail}
                  onChange={(e) => setPartnerFormEmail(e.target.value)}
                  placeholder="partner@agency.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    {editingPartner ? 'Reset Password (optional)' : 'Password *'}
                  </label>
                  {editingPartner && (
                    <span className="text-[10px] font-mono text-slate-400">Leave blank to keep current</span>
                  )}
                </div>
                <input
                  type="password"
                  required={!editingPartner}
                  value={partnerFormPassword}
                  onChange={(e) => setPartnerFormPassword(e.target.value)}
                  placeholder={editingPartner ? '•••••••• (leave blank to keep)' : 'At least 6 characters'}
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Active Account Access
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {partnerFormIsActive
                      ? 'Partner can sign in and manage assigned clients.'
                      : 'Account suspended. Sign-in attempts will be blocked.'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={partnerFormIsActive}
                  onClick={() => setPartnerFormIsActive(!partnerFormIsActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    partnerFormIsActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className="sr-only">Toggle partner active access</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      partnerFormIsActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPartnerFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={partnerFormSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {partnerFormSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingPartner ? 'Save Changes' : 'Create Partner Account'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLIENT CREATE / EDIT MODAL                                                */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingClient ? 'Edit Client Profile' : 'New Client Profile'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure branding, contact details, and assigned agency.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-5">
              {/* Partner Assignment (Superadmin only) */}
              {isSuperadmin && (
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <label className="text-xs font-mono font-bold uppercase text-blue-900 dark:text-blue-300">
                      Assigned Partner Agency
                    </label>
                  </div>
                  <select
                    value={formPartnerId}
                    onChange={(e) => setFormPartnerId(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Direct Agency Client (Superadmin)</option>
                    {partnersList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.email} ({p.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    If assigned to a partner, only that partner agency and superadmins can view or generate reports for this client.
                  </p>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Roofing & Solar"
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Website URL
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://acmeroofing.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              {/* Client Logo Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Client Logo
                </label>
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 bg-white flex items-center justify-center shrink-0">
                      <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="flex-1 px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0 cursor-pointer"
                    >
                      Media Library
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COLOR_PRESETS.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryColor(color)}
                        className="w-5 h-5 rounded-full border border-white dark:border-slate-800 shadow-xs cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COLOR_PRESETS.slice(5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSecondaryColor(color)}
                        className="w-5 h-5 rounded-full border border-white dark:border-slate-800 shadow-xs cursor-pointer transition hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* White-Label Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      White-Label Report Branding
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Replace "built by Miguel" branding on client PDFs with custom partner agency details.
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isWhiteLabel}
                    onClick={() => setIsWhiteLabel(!isWhiteLabel)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isWhiteLabel ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span className="sr-only">Toggle white-label</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isWhiteLabel ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {isWhiteLabel && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                        Partner Agency Name
                      </label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="e.g. Apex Marketing Co."
                        className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                        Partner Agency Logo
                      </label>
                      <div className="flex items-center gap-3">
                        {partnerLogoUrl ? (
                          <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white flex items-center justify-center shrink-0">
                            <img src={partnerLogoUrl} alt="Partner Logo" className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={partnerLogoUrl}
                            onChange={(e) => setPartnerLogoUrl(e.target.value)}
                            placeholder="https://.../partner-logo.png"
                            className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono truncate"
                          />
                          <button
                            type="button"
                            onClick={() => setIsPartnerLogoModalOpen(true)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition shrink-0 cursor-pointer"
                          >
                            Browse
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingClient ? 'Save Changes' : 'Create Client'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Client Logo */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        acceptTypes="images"
        title="Select Client Logo from Media Library"
        onSelect={(media) => {
          setLogoUrl(media.fileUrl)
          setIsMediaModalOpen(false)
          addToast('Logo Selected', `Selected "${media.filename}".`)
        }}
      />

      {/* Media Picker Modal for Partner Logo */}
      <MediaPickerModal
        isOpen={isPartnerLogoModalOpen}
        onClose={() => setIsPartnerLogoModalOpen(false)}
        acceptTypes="images"
        title="Select Partner Agency Logo from Media Library"
        onSelect={(media) => {
          setPartnerLogoUrl(media.fileUrl)
          setIsPartnerLogoModalOpen(false)
          addToast('Partner Logo Selected', `Selected "${media.filename}".`)
        }}
      />

      {/* Confirm Delete Client Modal */}
      <ConfirmModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        title="Delete Client Account?"
        description={
          clientToDelete ? (
            <span>
              Are you sure you want to delete <strong>{clientToDelete.businessName}</strong>? All associated monthly
              reports ({clientToDelete.reportCount}) will also be permanently deleted.
            </span>
          ) : null
        }
        confirmText="Delete Client and Reports"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  )
}
