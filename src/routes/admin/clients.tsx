import { createFileRoute, redirect, useRouter, Link, useNavigate } from '@tanstack/react-router'
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
  LayoutGrid,
  List,
  Download,
} from 'lucide-react'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { AdminShell } from '../../components/AdminShell'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { MediaPickerModal } from '../../components/MediaPickerModal'
import { ClientCard } from '../../components/ClientCard'
import { DataTable, type ColumnDef, type BulkAction } from '../../components/ui/DataTable'
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

export interface ClientsSearch {
  sort?: 'name' | 'website' | 'reports' | 'last_report' | 'access' | 'agency'
  order?: 'asc' | 'desc'
  filter?: 'all' | 'missing' | 'connected'
  search?: string
  view?: 'table' | 'grid'
}

export const Route = createFileRoute('/admin/clients')({
  validateSearch: (search: Record<string, unknown>): ClientsSearch => {
    const sort = search.sort as ClientsSearch['sort']
    const order = search.order as ClientsSearch['order']
    const filter = search.filter as ClientsSearch['filter']
    const view = search.view as ClientsSearch['view']
    return {
      sort: ['name', 'website', 'reports', 'last_report', 'access', 'agency'].includes(sort || '') ? sort : undefined,
      order: order === 'desc' ? 'desc' : order === 'asc' ? 'asc' : undefined,
      filter: ['all', 'missing', 'connected'].includes(filter || '') ? filter : undefined,
      search: typeof search.search === 'string' ? search.search : undefined,
      view: view === 'grid' ? 'grid' : 'table',
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    return { auth }
  },
  loaderDeps: ({ search }) => ({
    sort: search.sort,
    order: search.order,
  }),
  loader: async ({ deps, context }) => {
    const { clients, partners } = await getClientsServerFn({
      data: {
        sort: deps.sort,
        order: deps.order,
      },
    })
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
  const navigate = useNavigate({ from: Route.fullPath })
  const searchParams = Route.useSearch()
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
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithReportCount | null>(null)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ClientWithReportCount | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [accessFilter, setAccessFilter] = useState<'all' | 'missing' | 'connected'>(searchParams.filter || 'all')
  const viewMode = searchParams.view || 'table'

  // Form State for Clients
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoBgColor, setLogoBgColor] = useState('#ffffff')
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [secondaryColor, setSecondaryColor] = useState('#1e293b')
  const [isWhiteLabel, setIsWhiteLabel] = useState(false)
  const [partnerName, setPartnerName] = useState('')
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('')
  const [partnerLogoBgColor, setPartnerLogoBgColor] = useState('#ffffff')
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
    setLogoBgColor('#ffffff')
    setPrimaryColor('#2563eb')
    setSecondaryColor('#1e293b')
    setIsWhiteLabel(false)
    setPartnerName('')
    setPartnerLogoUrl('')
    setPartnerLogoBgColor('#ffffff')
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
    setLogoBgColor((client as any).logoBgColor || '#ffffff')
    setPrimaryColor(client.primaryColor || '#2563eb')
    setSecondaryColor(client.secondaryColor || '#1e293b')
    setIsWhiteLabel(Boolean(client.isWhiteLabel))
    setPartnerName(client.partnerName || '')
    setPartnerLogoUrl(client.partnerLogoUrl || '')
    setPartnerLogoBgColor((client as any).partnerLogoBgColor || '#ffffff')
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
      addToast('Partner Assigned', 'Client successfully reassigned.')
      await router.invalidate()
    } catch (err: unknown) {
      addToast('Assignment Failed', err instanceof Error ? err.message : 'Could not assign partner', 'error')
      await router.invalidate()
    } finally {
      setIsAssigningId(null)
    }
  }

  // Toggle Partner active status
  const handleTogglePartnerActive = async (partnerId: string, currentStatus: boolean) => {
    setTogglingPartnerId(partnerId)
    try {
      const res = await togglePartnerActiveServerFn({
        data: {
          id: partnerId,
          isActive: !currentStatus,
        },
      })
      if (res.success) {
        addToast(
          'Status Updated',
          `Partner is now ${!currentStatus ? 'Active' : 'Suspended'}.`
        )
        await loadPartnerAccounts()
        await router.invalidate()
      }
    } catch (err: unknown) {
      addToast('Error', err instanceof Error ? err.message : 'Failed to update partner status.', 'error')
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
      setPartnerFormError('Partner / Agency name is required.')
      return
    }

    if (!partnerFormEmail.trim() || !partnerFormEmail.includes('@')) {
      setPartnerFormError('A valid email address is required.')
      return
    }

    if (!editingPartner && (!partnerFormPassword.trim() || partnerFormPassword.length < 8)) {
      setPartnerFormError('Password must be at least 8 characters.')
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
            password: partnerFormPassword.trim() ? partnerFormPassword.trim() : undefined,
            isActive: partnerFormIsActive,
          },
        })
        addToast('Partner Updated', `Updated agency profile for ${partnerFormName}.`)
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
            logoBgColor: logoBgColor.trim() || '#ffffff',
            primaryColor,
            secondaryColor,
            isWhiteLabel,
            partnerName: partnerName.trim() || undefined,
            partnerLogoUrl: partnerLogoUrl.trim() || undefined,
            partnerLogoBgColor: partnerLogoBgColor.trim() || '#ffffff',
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
            logoBgColor: logoBgColor.trim() || '#ffffff',
            primaryColor,
            secondaryColor,
            isWhiteLabel,
            partnerName: partnerName.trim() || undefined,
            partnerLogoUrl: partnerLogoUrl.trim() || undefined,
            partnerLogoBgColor: partnerLogoBgColor.trim() || '#ffffff',
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
      addToast('Client Archived', `Archived ${clientToDelete.businessName}. Historical reports have been retained.`)
      setClientToDelete(null)
      await router.invalidate()
    } catch (err: unknown) {
      addToast('Archive Failed', err instanceof Error ? err.message : 'Could not archive client.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSortChange = (sortKey: string, order: 'asc' | 'desc') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        sort: sortKey,
        order,
      }),
    })
  }

  const handleViewToggle = (mode: 'table' | 'grid') => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        view: mode,
      }),
    })
  }

  const handleAccessFilterChange = (filter: 'all' | 'missing' | 'connected') => {
    setAccessFilter(filter)
    navigate({
      search: (prev: any) => ({
        ...prev,
        filter: filter === 'all' ? undefined : filter,
      }),
    })
  }

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.businessName.toLowerCase().includes(q) ||
        c.websiteUrl?.toLowerCase().includes(q) ||
        c.partner?.name?.toLowerCase().includes(q) ||
        c.partner?.email?.toLowerCase().includes(q)
      if (!matchesSearch) return false

      if (accessFilter === 'missing') {
        return Boolean(c.missingSources && c.missingSources.length > 0)
      }
      if (accessFilter === 'connected') {
        return !c.missingSources || c.missingSources.length === 0
      }
      return true
    })
  }, [clients, searchQuery, accessFilter])

  // Table Columns Definition
  const clientColumns: ColumnDef<ClientWithReportCount>[] = [
    {
      id: 'client',
      header: 'Client',
      sortKey: 'name',
      accessor: (c) => (
        <div className="flex items-center gap-2.5">
          {c.logoUrl ? (
            <div
              className="w-5 h-5 rounded-[4px] border border-[var(--line)] overflow-hidden p-0.5 flex items-center justify-center shrink-0"
              style={{ backgroundColor: (c as any).logoBgColor || '#ffffff' }}
            >
              <img
                src={c.logoUrl}
                alt={c.businessName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-[4px] text-white flex items-center justify-center font-bold text-[10px] shrink-0"
              style={{ backgroundColor: c.primaryColor || '#2563eb' }}
            >
              {c.businessName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <Link
              to="/admin/clients/$clientId"
              params={{ clientId: c.id }}
              className="font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--accent)] transition truncate"
            >
              {c.businessName}
            </Link>
            <span className="text-[11px] text-[var(--muted)] truncate">
              {c.name}
            </span>
          </div>
        </div>
      ),
    },
    ...(isSuperadmin
      ? [
          {
            id: 'agency',
            header: 'Agency',
            sortKey: 'agency',
            accessor: (c: ClientWithReportCount) => (
              <div className="min-w-0 max-w-[160px]">
                {c.partner ? (
                  <span className="text-[12px] font-medium text-[var(--ink)] truncate block" title={c.partner.name || c.partner.email}>
                    {c.partner.name || c.partner.email}
                  </span>
                ) : (
                  <span className="text-[11px] text-[var(--muted)] italic">Unassigned</span>
                )}
              </div>
            ),
          } as ColumnDef<ClientWithReportCount>,
        ]
      : []),
    {
      id: 'website',
      header: 'Website',
      sortKey: 'website',
      accessor: (c) =>
        c.websiteUrl ? (
          <a
            href={c.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)] hover:underline inline-flex items-center gap-1 font-mono truncate max-w-[180px]"
          >
            <span>{c.websiteUrl.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
          </a>
        ) : (
          <span className="text-[12px] text-[var(--muted)]">—</span>
        ),
    },
    {
      id: 'reports',
      header: 'Reports',
      sortKey: 'reports',
      align: 'right',
      accessor: (c) => (
        <span className="font-mono tabular-nums text-[13px]">{c.reportCount}</span>
      ),
    },
    {
      id: 'last_report',
      header: 'Last report',
      sortKey: 'last_report',
      accessor: (c) => (
        <span className="text-[12px] font-mono tabular-nums text-[var(--muted)]">
          {c.latestReport ? c.latestReport.reportMonth : 'None'}
        </span>
      ),
    },
    {
      id: 'access',
      header: 'Sources',
      sortKey: 'access',
      accessor: (c) => {
        const ds = c.dataSources || { gsc: 'connected', ga4: 'connected', gbp: 'connected' }
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span
              title={`GSC: ${ds.gsc}`}
              className={`px-1.5 py-0.5 rounded-[4px] ${
                ds.gsc === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : ds.gsc === 'no_access'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'bg-[var(--line)]/50 text-[var(--muted)]'
              }`}
            >
              GSC
            </span>
            <span
              title={`GA4: ${ds.ga4}`}
              className={`px-1.5 py-0.5 rounded-[4px] ${
                ds.ga4 === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : ds.ga4 === 'no_access'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'bg-[var(--line)]/50 text-[var(--muted)]'
              }`}
            >
              GA4
            </span>
            <span
              title={`GBP: ${ds.gbp}`}
              className={`px-1.5 py-0.5 rounded-[4px] ${
                ds.gbp === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : ds.gbp === 'no_access'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'bg-[var(--line)]/50 text-[var(--muted)]'
              }`}
            >
              GBP
            </span>
          </div>
        )
      },
    },
  ]

  // Export CSV Helper
  const handleExportCsv = (selected: ClientWithReportCount[]) => {
    const headers = ['Business Name', 'Contact Name', 'Website', 'Reports', 'Last Report', 'Agency']
    const rows = selected.map((c) => [
      `"${(c.businessName || '').replace(/"/g, '""')}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.websiteUrl || '').replace(/"/g, '""')}"`,
      c.reportCount,
      `"${c.latestReport?.reportMonth || 'None'}"`,
      `"${(c.partner?.name || c.partner?.email || 'Unassigned').replace(/"/g, '""')}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `clients_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Bulk Actions
  const bulkActions: BulkAction<ClientWithReportCount>[] = [
    {
      label: 'Generate Reports for Selected',
      icon: FileSpreadsheet,
      variant: 'accent',
      onClick: (selectedItems, clearSelection) => {
        if (selectedItems.length > 0) {
          navigate({
            to: '/admin/reports/new',
            search: { clientId: selectedItems[0].id },
          })
        }
        clearSelection()
      },
    },
    {
      label: 'Export CSV',
      icon: Download,
      variant: 'secondary',
      onClick: (selectedItems, clearSelection) => {
        handleExportCsv(selectedItems)
        clearSelection()
      },
    },
  ]

  return (
    <AdminShell
      activeTab="clients"
      userRole={currentAdmin?.role}
      userEmail={currentAdmin?.email}
      userName={currentAdmin?.name}
      title={isSuperadmin ? 'All clients' : 'Clients'}
      description={
        isSuperadmin
          ? 'Manage agency clients across all partners, assign accounts, and configure white-label branding.'
          : 'Manage your assigned agency clients and generate branded monthly performance reports.'
      }
      actions={
        <div className="flex items-center gap-2">
          {isSuperadmin && (
            <button
              type="button"
              onClick={handleOpenPartnersModal}
              className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--line)]/50 transition cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span>Manage partners ({partnersList.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={openCreateClientModal}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add client</span>
          </button>
        </div>
      }
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-4">

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <input
                type="text"
                placeholder={isSuperadmin ? 'Search clients, websites, partners...' : 'Search your assigned clients...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3.5 text-[13px] rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* Access Filter Pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px]">
              <button
                type="button"
                onClick={() => handleAccessFilterChange('all')}
                className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                  accessFilter === 'all'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleAccessFilterChange('missing')}
                className={`h-7 px-2.5 rounded-[6px] font-medium transition flex items-center gap-1 cursor-pointer ${
                  accessFilter === 'missing'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span>Missing access</span>
                {clients.filter((c) => c.missingSources && c.missingSources.length > 0).length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-[6px] text-[10px] bg-rose-50 dark:bg-rose-950/40 text-[var(--danger)] border border-rose-200/60 dark:border-rose-900/40">
                    {clients.filter((c) => c.missingSources && c.missingSources.length > 0).length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleAccessFilterChange('connected')}
                className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                  accessFilter === 'connected'
                    ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                All connected
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[var(--muted)] w-full md:w-auto justify-between md:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
              <button
                type="button"
                onClick={() => handleViewToggle('table')}
                title="Table view"
                className={`h-7 px-2 rounded-[4px] transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleViewToggle('grid')}
                title="Grid view"
                className={`h-7 px-2 rounded-[4px] transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <span>
              Showing <strong className="text-[var(--ink)] font-medium tabular-nums">{filteredClients.length}</strong> of <strong className="text-[var(--ink)] font-medium tabular-nums">{clients.length}</strong>
            </span>
          </div>
        </div>

        {/* Clients Table or Cards Grid */}
        {filteredClients.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-[var(--line)] p-12 text-center bg-[var(--panel)] space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[8px] bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[15px] font-medium text-[var(--ink)]">
                {searchQuery ? 'No matching clients found' : 'No clients found'}
              </h3>
              <p className="text-[13px] text-[var(--muted)] max-w-sm mx-auto">
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
                className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create client</span>
              </button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          <DataTable<ClientWithReportCount>
            data={filteredClients}
            columns={clientColumns}
            keyExtractor={(c) => c.id}
            selectable
            sortKey={searchParams.sort}
            sortOrder={searchParams.order}
            onSort={handleSortChange}
            bulkActions={bulkActions}
            rowActions={(client) => (
              <div className="flex items-center justify-end gap-1">
                <Link
                  to="/admin/workspace"
                  search={{ client: client.id }}
                  title="Open client workspace"
                  className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEditClientModal(client)}
                  title="Edit client details"
                  className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setClientToDelete(client)}
                  title="Archive client"
                  className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          />
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
                            onClick={() => handleTogglePartnerActive(partner.id, partner.isActive)}
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
                    <div
                      className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: logoBgColor !== 'transparent' ? logoBgColor : undefined }}
                    >
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

                {/* Logo Background Color Customization */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-600 dark:text-slate-400 block">
                      Logo Background Color
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Set a dark, white, or custom background for white or transparent logos.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={logoBgColor.startsWith('#') ? logoBgColor : '#ffffff'}
                      onChange={(e) => setLogoBgColor(e.target.value)}
                      className="w-8 h-8 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800 shrink-0"
                    />
                    <input
                      type="text"
                      value={logoBgColor}
                      onChange={(e) => setLogoBgColor(e.target.value)}
                      placeholder="#ffffff"
                      className="w-20 px-2.5 py-1 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-1.5 pl-1">
                      <button
                        type="button"
                        onClick={() => setLogoBgColor('#ffffff')}
                        title="White"
                        className={`w-5 h-5 rounded-full border border-slate-300 shadow-xs cursor-pointer transition ${logoBgColor === '#ffffff' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        style={{ backgroundColor: '#ffffff' }}
                      />
                      <button
                        type="button"
                        onClick={() => setLogoBgColor('#0f172a')}
                        title="Dark Slate"
                        className={`w-5 h-5 rounded-full border border-slate-700 shadow-xs cursor-pointer transition ${logoBgColor === '#0f172a' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        style={{ backgroundColor: '#0f172a' }}
                      />
                      <button
                        type="button"
                        onClick={() => setLogoBgColor('#000000')}
                        title="Black"
                        className={`w-5 h-5 rounded-full border border-slate-800 shadow-xs cursor-pointer transition ${logoBgColor === '#000000' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        style={{ backgroundColor: '#000000' }}
                      />
                      <button
                        type="button"
                        onClick={() => setLogoBgColor(primaryColor)}
                        title="Brand Primary"
                        className={`w-5 h-5 rounded-full border border-white shadow-xs cursor-pointer transition ${logoBgColor === primaryColor ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
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
                          <div
                            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-2xs"
                            style={{ backgroundColor: partnerLogoBgColor !== 'transparent' ? partnerLogoBgColor : undefined }}
                          >
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

                      {/* Partner Logo Background Selector */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] text-slate-500 font-mono">Logo Background:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={partnerLogoBgColor.startsWith('#') ? partnerLogoBgColor : '#ffffff'}
                            onChange={(e) => setPartnerLogoBgColor(e.target.value)}
                            className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                          />
                          <input
                            type="text"
                            value={partnerLogoBgColor}
                            onChange={(e) => setPartnerLogoBgColor(e.target.value)}
                            placeholder="#ffffff"
                            className="w-20 px-2 py-0.5 rounded-lg text-[11px] font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 inline-flex items-center px-3 rounded-[6px] text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 inline-flex items-center gap-1.5 px-4 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingClient ? 'Save changes' : 'Create client'}</span>
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
        purpose="client"
        clientId={editingClient?.id}
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
        purpose="site"
        title="Select Partner Agency Logo from Media Library"
        onSelect={(media) => {
          setPartnerLogoUrl(media.fileUrl)
          setIsPartnerLogoModalOpen(false)
          addToast('Partner Logo Selected', `Selected "${media.filename}".`)
        }}
      />

      {/* Confirm Archive Client Modal */}
      <ConfirmModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        title="Archive Client Account?"
        description={
          clientToDelete ? (
            <span>
              Are you sure you want to archive <strong>{clientToDelete.businessName}</strong>? The client will be hidden
              from your active roster, but all historical monthly reports ({clientToDelete.reportCount}) will be permanently preserved.
            </span>
          ) : null
        }
        confirmText="Archive Client (Retain Reports)"
        variant="danger"
        isLoading={isSubmitting}
      />
    </AdminShell>
  )
}
