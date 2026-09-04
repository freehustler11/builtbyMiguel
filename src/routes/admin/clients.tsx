import { createFileRoute, redirect, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
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
} from 'lucide-react'
import { checkAuthServerFn } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { MediaPickerModal } from '../../components/MediaPickerModal'
import {
  getClientsServerFn,
  createClientServerFn,
  updateClientServerFn,
  deleteClientServerFn,
  type ClientWithReportCount,
} from '../../server/clients'
import type { Client } from '../../db/schema'

export const Route = createFileRoute('/admin/clients')({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/admin/clients',
        },
      })
    }
  },
  loader: async () => {
    return await getClientsServerFn()
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
  const { clients } = Route.useLoaderData()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ClientWithReportCount | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Form State
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [secondaryColor, setSecondaryColor] = useState('#1e293b')
  const [formError, setFormError] = useState<string | null>(null)

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

  const openCreateModal = () => {
    setEditingClient(null)
    setName('')
    setBusinessName('')
    setWebsiteUrl('')
    setLogoUrl('')
    setPrimaryColor('#2563eb')
    setSecondaryColor('#1e293b')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setName(client.name)
    setBusinessName(client.businessName)
    setWebsiteUrl(client.websiteUrl || '')
    setLogoUrl(client.logoUrl || '')
    setPrimaryColor(client.primaryColor || '#2563eb')
    setSecondaryColor(client.secondaryColor || '#1e293b')
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError('Contact person name is required')
      return
    }
    if (!businessName.trim()) {
      setFormError('Business name is required')
      return
    }

    try {
      setIsSubmitting(true)
      if (editingClient) {
        await updateClientServerFn({
          data: {
            id: editingClient.id,
            name: name.trim(),
            businessName: businessName.trim(),
            websiteUrl: websiteUrl.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            primaryColor: primaryColor.trim() || undefined,
            secondaryColor: secondaryColor.trim() || undefined,
          },
        })
        addToast('Client Updated', `"${businessName}" details updated successfully.`)
      } else {
        await createClientServerFn({
          data: {
            name: name.trim(),
            businessName: businessName.trim(),
            websiteUrl: websiteUrl.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            primaryColor: primaryColor.trim() || undefined,
            secondaryColor: secondaryColor.trim() || undefined,
          },
        })
        addToast('Client Created', `"${businessName}" has been added to your client portfolio.`)
      }

      setIsModalOpen(false)
      await router.invalidate()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save client profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    try {
      setIsSubmitting(true)
      await deleteClientServerFn({ data: { id: clientToDelete.id } })
      addToast('Client Deleted', `"${clientToDelete.businessName}" and associated reports removed.`)
      setClientToDelete(null)
      await router.invalidate()
    } catch (err: any) {
      addToast('Error Deleting', err?.message || 'Failed to delete client', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clients.filter((c) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      c.businessName.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      (c.websiteUrl && c.websiteUrl.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Navigation */}
        <AdminNav
          activeTab="clients"
          title="Client Portfolio & Branding"
          description="Manage client accounts, logos, and custom color themes used to dynamically render branded monthly reports."
          actions={
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
          }
        />

        {/* Search Bar & Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, contact, or website..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Total Clients: <strong className="text-slate-900 dark:text-white">{clients.length}</strong>
            </span>
            <span>•</span>
            <span>
              Showing: <strong className="text-rose-600 dark:text-rose-400">{filteredClients.length}</strong>
            </span>
          </div>
        </div>

        {/* Clients Cards Grid */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 inline-block">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {searchQuery ? 'No clients matched your search' : 'No clients added yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {searchQuery
                  ? 'Try adjusting your search query.'
                  : 'Add your first agency client with their branding colors and logo to begin generating monthly reports.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const primary = client.primaryColor || '#2563eb'
              const secondary = client.secondaryColor || '#1e293b'

              return (
                <div
                  key={client.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Top Bar: Logo/Initials + Badges + Edit/Delete */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Logo or Initials Avatar */}
                      <div className="flex items-center gap-3">
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
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {client.businessName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{client.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Menu */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(client)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit Client"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setClientToDelete(client)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

                    {/* Branding Color Palette Swatches */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                        Brand Identity
                      </span>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: primary }}
                          />
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{primary}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: secondary }}
                          />
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{secondary}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats & Create Report Link */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      <span>{client.reportCount} {client.reportCount === 1 ? 'Report' : 'Reports'}</span>
                    </div>

                    <Link
                      to="/admin/reports/new"
                      search={{ clientId: client.id }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Report</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingClient ? 'Edit Client Profile' : 'Add New Agency Client'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set up branding, logo, and colors used on reports.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveClient} className="space-y-4">
              {/* Business Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Plumbing Solutions"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Contact Person Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Primary Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Michael Thorne (Founder / Director)"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
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
                  placeholder="e.g. https://apexplumbing.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Logo URL with Media Library Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Client Logo URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://... or choose from Media Library"
                    className="flex-1 px-3.5 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
                    title="Choose from media library"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
                {logoUrl && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <img src={logoUrl} alt="Logo preview" className="h-8 max-w-[120px] object-contain" />
                    <span className="text-[11px] text-slate-400 font-mono truncate">{logoUrl}</span>
                  </div>
                )}
              </div>

              {/* Brand Colors (Primary and Secondary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Primary Color */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Primary Color</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {COLOR_PRESETS.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryColor(color)}
                        className="w-5 h-5 rounded-md border border-black/10 cursor-pointer hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Secondary Color</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: secondaryColor }}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {COLOR_PRESETS.slice(5, 10).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSecondaryColor(color)}
                        className="w-5 h-5 rounded-md border border-black/10 cursor-pointer hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingClient ? 'Save Changes' : 'Create Client'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Logo */}
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
