import { createFileRoute, redirect, useRouter, useNavigate } from '@tanstack/react-router'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Trash2,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Calendar,
  Check,
  Copy,
  RefreshCw,
  AlertCircle,
  Building2,
  X,
  Search,
  CheckCircle2,
  Lock,
  UserCheck,
  Loader2,
  KeyRound,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { ResetUserPasswordModal } from '../../components/ResetUserPasswordModal'
import { DataTable, type ColumnDef } from '../../components/ui/DataTable'
import { checkAuthServerFn } from '../../lib/auth'
import {
  getTeamMembersServerFn,
  createTeamMemberServerFn,
  deleteTeamMemberServerFn,
  toggleTeamMemberActiveServerFn,
  type EmployeeItem,
  type AgencyOwnerInfo,
} from '../../server/team'
import {
  getAllUsersForAdminServerFn,
  type ManagedUserItem,
} from '../../server/passwords'
import { getPartnersServerFn, type PartnerItem } from '../../server/partners'

interface TeamSearch {
  partnerId?: string
  sort?: 'name' | 'role' | 'agency' | 'createdAt' | 'status'
  order?: 'asc' | 'desc'
}

export const Route = createFileRoute('/admin/team')({
  validateSearch: (search: Record<string, unknown>): TeamSearch => {
    const sort = search.sort as TeamSearch['sort']
    const order = search.order as TeamSearch['order']
    const partnerId = typeof search.partnerId === 'string' ? search.partnerId : undefined
    return {
      partnerId,
      sort: ['name', 'role', 'agency', 'createdAt', 'status'].includes(sort || '') ? sort : undefined,
      order: order === 'desc' ? 'desc' : order === 'asc' ? 'asc' : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await checkAuthServerFn()
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    if (auth.role === 'client') {
      throw redirect({ to: '/portal' })
    }
    if (auth.role === 'partner_employee') {
      throw redirect({ to: '/admin/clients' })
    }
    return { auth }
  },
  loaderDeps: ({ search }) => ({
    partnerId: search.partnerId,
    sort: search.sort,
    order: search.order,
  }),
  loader: async ({ deps, context }) => {
    const auth = (context as any)?.auth || (await checkAuthServerFn())
    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const [teamData, allUsersData, partnersData] = await Promise.all([
      getTeamMembersServerFn({ data: { partnerId: deps.partnerId, sort: deps.sort, order: deps.order } }),
      isSuperadmin
        ? getAllUsersForAdminServerFn({ data: { sort: deps.sort, order: deps.order } })
        : Promise.resolve({ users: [] }),
      isSuperadmin
        ? getPartnersServerFn({})
        : Promise.resolve({ partners: [] }),
    ])
    return {
      ...teamData,
      allUsers: allUsersData?.users || [],
      partners: (partnersData?.partners || []) as PartnerItem[],
      currentAdmin: auth,
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Team & Employee Management | Agency Portal | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminTeamPage,
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

function AdminTeamPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    employees: initialEmployees,
    agencyOwner,
    isSuperadmin,
    currentAdmin,
    allUsers: initialAllUsers = [],
    partners = [],
  } = Route.useLoaderData()

  const [employees, setEmployees] = useState<EmployeeItem[]>(initialEmployees)
  const [allUsers, setAllUsers] = useState<ManagedUserItem[]>(initialAllUsers)
  const [roleFilter, setRoleFilter] = useState<'all' | 'partner_employee' | 'partner' | 'client' | 'superadmin'>('partner_employee')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    search.partnerId && search.partnerId !== 'all' ? search.partnerId : ''
  )
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeItem | null>(null)

  const handleHeaderSort = (columnKey: 'name' | 'role' | 'agency' | 'createdAt' | 'status') => {
    let nextOrder: 'asc' | 'desc' = 'asc'
    if (search.sort === columnKey) {
      nextOrder = search.order === 'asc' ? 'desc' : 'asc'
    } else if (columnKey === 'createdAt') {
      nextOrder = 'desc'
    }
    navigate({
      search: (prev: any) => ({
        ...prev,
        sort: columnKey,
        order: nextOrder,
      }),
    })
  }
  const [userToResetPassword, setUserToResetPassword] = useState<{
    id: string
    name: string | null
    email: string
    role: string
    partnerName?: string | null
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Keep state perfectly synchronized with router loader data
  useEffect(() => {
    setEmployees(initialEmployees)
  }, [initialEmployees])

  useEffect(() => {
    setAllUsers(initialAllUsers)
  }, [initialAllUsers])

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [autoGen, setAutoGen] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  // Success Credentials Modal (to show temporary credentials immediately)
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string
    email: string
    password?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev: ToastMessage[]) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev: ToastMessage[]) => prev.filter((t: ToastMessage) => t.id !== id))
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    let pass = 'Agency@'
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    pass += '!'
    setPassword(pass)
  }

  const openAddModal = () => {
    setName('')
    setEmail('')
    setFormError(null)
    setAutoGen(true)
    generateRandomPassword()
    setIsAddModalOpen(true)
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError('Please enter full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!autoGen && (!password || password.length < 6)) {
      setFormError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createTeamMemberServerFn({
        data: {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          partnerId: isSuperadmin ? (selectedPartnerId || undefined) : undefined,
        },
      })

      if (res.success && res.employee) {
        const createdEmp = res.employee as EmployeeItem
        setEmployees((prev) => [createdEmp, ...prev])
        setAllUsers((prev) => [
          {
            ...createdEmp,
            partnerName: agencyOwner?.name || null,
          },
          ...prev,
        ])
        setIsAddModalOpen(false)
        addToast('success', 'Team Member Added', `${res.employee.name} can now sign in.`)
        setCreatedCredentials({
          name: res.employee.name || 'Team Member',
          email: res.employee.email,
          password: res.temporaryPassword || password.trim(),
        })
        await router.invalidate()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create team member.'
      setFormError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMember = async () => {
    if (!employeeToDelete) return
    const targetId = employeeToDelete.id
    setIsSubmitting(true)
    try {
      await deleteTeamMemberServerFn({
        data: { id: targetId },
      })
      setEmployees((prev) => prev.filter((e) => e.id !== targetId))
      setAllUsers((prev) => prev.filter((u) => u.id !== targetId))
      addToast('success', 'Access Revoked', `Removed login access for ${employeeToDelete.name || employeeToDelete.email}.`)
      setEmployeeToDelete(null)
      await router.invalidate()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revoke access.'
      addToast('error', 'Revocation Failed', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (emp: { id: string; name: string | null; email: string; isActive: boolean }) => {
    try {
      setUpdatingId(emp.id)
      const nextActive = !emp.isActive
      // Optimistically update local state for 0ms instant toggle animation
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, isActive: nextActive } : e))
      )
      setAllUsers((prev) =>
        prev.map((u) => (u.id === emp.id ? { ...u, isActive: nextActive } : u))
      )

      const res = await toggleTeamMemberActiveServerFn({
        data: { id: emp.id, isActive: nextActive },
      })
      if (res.success) {
        addToast(
          'info',
          'Account Status Updated',
          `${emp.name || emp.email} account ${nextActive ? 'activated' : 'suspended'}.`
        )
        await router.invalidate()
      } else {
        // Revert on failure
        setEmployees((prev) =>
          prev.map((e) => (e.id === emp.id ? { ...e, isActive: emp.isActive } : e))
        )
        setAllUsers((prev) =>
          prev.map((u) => (u.id === emp.id ? { ...u, isActive: emp.isActive } : u))
        )
      }
    } catch (err: unknown) {
      // Revert on failure
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, isActive: emp.isActive } : e))
      )
      setAllUsers((prev) =>
        prev.map((u) => (u.id === emp.id ? { ...u, isActive: emp.isActive } : u))
      )
      const msg = err instanceof Error ? err.message : 'Failed to update status.'
      addToast('error', 'Update Failed', msg)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCopyCredentials = () => {
    if (!createdCredentials) return
    const text = `built by Miguel Agency Portal Login:\nURL: https://builtbymiguel.net/login\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password || '(Custom password set)'}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    addToast('success', 'Copied to Clipboard', 'Login credentials copied.')
  }

  // Filtered employees or users
  const displayedUsers = useMemo(() => {
    let source: (EmployeeItem | ManagedUserItem)[] = employees
    if (isSuperadmin && roleFilter !== 'partner_employee') {
      source = roleFilter === 'all' ? allUsers : allUsers.filter((u) => u.role === roleFilter)
    }

    if (!searchQuery.trim()) return source
    const q = searchQuery.toLowerCase().trim()
    return source.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        e.email.toLowerCase().includes(q) ||
        (e.partnerName && e.partnerName.toLowerCase().includes(q))
    )
  }, [employees, allUsers, isSuperadmin, roleFilter, searchQuery])

  return (
    <AdminShell
      activeTab="team"
      userRole={currentAdmin?.role}
      userEmail={currentAdmin?.email}
      userName={currentAdmin?.name}
      title="Team & sub-accounts"
      description="Manage team members, staff logins, and access permissions for your agency."
      actions={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] bg-[var(--accent)] hover:opacity-90 text-white text-[13px] font-medium transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add team member</span>
        </button>
      }
    >
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="space-y-3.5">

        {/* Agency Owner & Plan Card */}
        <div className="p-5 sm:p-6 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[6px] bg-[var(--accent)] flex items-center justify-center text-white font-medium text-[15px] shrink-0">
                {agencyOwner?.name
                  ? agencyOwner.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'AO'}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {agencyOwner?.name || 'Primary Agency Account'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
                    <ShieldCheck className="w-3 h-3" />
                    Agency Owner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>{agencyOwner?.email}</span>
                  <span className="opacity-40">·</span>
                  <span>
                    Full Administrative &amp; Team Permissions
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Inline Strip */}
            <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--line)] text-[12px] text-[var(--muted)]">
              <span><strong className="text-[var(--ink)] font-semibold tabular-nums">{initialEmployees.length + 1}</strong> total team</span>
              <span className="opacity-40">·</span>
              <span><strong className="text-[var(--accent)] font-semibold tabular-nums">{initialEmployees.length}</strong> staff accounts</span>
            </div>
          </div>
        </div>

        {/* Superadmin Agency Scope Switcher */}
        {isSuperadmin && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Workspace / Agency Scope</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {search.partnerId === 'all'
                    ? 'Viewing employees across all partner agencies combined'
                    : search.partnerId
                    ? 'Viewing staff members assigned to selected agency'
                    : 'Viewing internal staff accounts added under Superadmin'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={search.partnerId || ''}
                onChange={(e) => {
                  const val = e.target.value
                  navigate({
                    search: (prev: any) => ({
                      ...prev,
                      partnerId: val || undefined,
                    }),
                  })
                }}
                className="text-xs font-mono font-medium px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Superadmin Workspace (Internal Staff)</option>
                <option value="all">All Agencies Staff (Combined)</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    Agency: {p.name || p.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Team Members List Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full h-8 pl-9 pr-3 text-[13px] rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Role filter switcher for superadmin */}
              {isSuperadmin && (
                <div className="flex items-center gap-1 p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px]">
                  <button
                    type="button"
                    onClick={() => setRoleFilter('partner_employee')}
                    className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                      roleFilter === 'partner_employee'
                        ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Staff ({employees.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('all')}
                    className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                      roleFilter === 'all'
                        ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    All ({allUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('partner')}
                    className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                      roleFilter === 'partner'
                        ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Owners ({allUsers.filter((u) => u.role === 'partner').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('client')}
                    className={`h-7 px-2.5 rounded-[6px] font-medium transition cursor-pointer ${
                      roleFilter === 'client'
                        ? 'bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Clients ({allUsers.filter((u) => u.role === 'client').length})
                  </button>
                </div>
              )}
            </div>

            <span className="text-[12px] text-[var(--muted)]">
              Showing <strong className="text-[var(--ink)] font-medium tabular-nums">{displayedUsers.length}</strong> accounts
            </span>
          </div>

          {/* Table */}
          {displayedUsers.length === 0 ? (
            <div className="p-12 text-center rounded-[8px] bg-[var(--panel)] border border-dashed border-[var(--line)] space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center mx-auto text-[var(--muted)]">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-[15px] font-medium text-[var(--ink)]">
                  {searchQuery ? 'No matching users found' : 'No team members added yet'}
                </h4>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                  {searchQuery
                    ? 'Try searching with a different name or email address.'
                    : 'Invite colleagues, virtual assistants, or account managers to collaborate on clients and generate reports.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] bg-[var(--accent)] hover:opacity-90 text-white text-[13px] font-medium transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add First Employee</span>
                </button>
              )}
            </div>
          ) : (
            <DataTable<EmployeeItem | ManagedUserItem>
              data={displayedUsers}
              columns={[
                {
                  id: 'name',
                  header: 'Team member',
                  sortKey: 'name',
                  accessor: (user) => {
                    const initials = user.name
                      ? user.name
                          .split(' ')
                          .map((p: string) => p[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'TM'
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-[4px] bg-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-[10px] shrink-0">
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-[13px] text-[var(--ink)] truncate">
                            {user.name || 'Account User'}
                          </span>
                          <span className="text-[11px] text-[var(--muted)] font-mono truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    )
                  },
                },
                {
                  id: 'role',
                  header: 'Role',
                  sortKey: 'role',
                  accessor: (user) => (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${
                        user.role === 'superadmin'
                          ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
                          : user.role === 'partner'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40'
                          : user.role === 'client'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                          : 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40'
                      }`}
                    >
                      {user.role === 'superadmin'
                        ? 'Superadmin'
                        : user.role === 'partner'
                        ? 'Agency Owner'
                        : user.role === 'client'
                        ? 'Client Portal'
                        : 'Agency Staff'}
                    </span>
                  ),
                },
                ...(isSuperadmin
                  ? [
                      {
                        id: 'agency',
                        header: 'Agency',
                        sortKey: 'agency',
                        accessor: (user: EmployeeItem | ManagedUserItem) => (
                          <span className="text-[12px] text-[var(--ink)] truncate max-w-[160px] block">
                            {user.partnerName ||
                              (user.role === 'partner'
                                ? 'Partner Owner'
                                : user.role === 'superadmin'
                                ? 'Internal'
                                : 'Direct')}
                          </span>
                        ),
                      } as ColumnDef<EmployeeItem | ManagedUserItem>,
                    ]
                  : []),
                {
                  id: 'status',
                  header: 'Status',
                  sortKey: 'status',
                  accessor: (user) => (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={user.isActive}
                      disabled={updatingId === user.id || user.role === 'superadmin'}
                      onClick={() => handleToggleStatus(user)}
                      title={user.role === 'superadmin' ? 'Superadmin account cannot be deactivated' : user.isActive ? 'Click to deactivate account' : 'Click to activate account'}
                      className={`inline-flex items-center gap-2 px-1 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          user.isActive ? 'bg-emerald-500' : 'bg-[var(--line)]'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-2xs transition duration-200 ease-in-out ${
                            user.isActive ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </span>
                      <span className={`text-[11px] font-medium ${user.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--muted)]'}`}>
                        {updatingId === user.id ? 'Updating...' : user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  ),
                },
                {
                  id: 'createdAt',
                  header: 'Date added',
                  sortKey: 'createdAt',
                  accessor: (user) => (
                    <span className="text-[12px] font-mono tabular-nums text-[var(--muted)]">
                      {formatDate(user.createdAt)}
                    </span>
                  ),
                },
              ]}
              keyExtractor={(u) => u.id}
              sortKey={search.sort}
              sortOrder={search.order}
              onSort={(k: string) => handleHeaderSort(k as any)}
              rowActions={(user) => (
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setUserToResetPassword({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        partnerName: user.partnerName,
                      })
                    }
                    title={`Reset password for ${user.name || user.email}`}
                    className="p-1 rounded-[4px] text-[var(--muted)] hover:text-amber-600 hover:bg-[var(--line)]/50 transition cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                  {(user.role === 'partner_employee' || (isSuperadmin && user.role === 'client')) && (
                    <button
                      type="button"
                      onClick={() => setEmployeeToDelete(user as EmployeeItem)}
                      title="Revoke access and delete login"
                      className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--line)]/50 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            />
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Add Agency Team Member
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create a sub-account for your employee or account manager.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {isSuperadmin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Assign To Workspace / Agency
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Superadmin Workspace (Internal Staff)</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        Agency: {p.name || p.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@youragency.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Used as the employee's username on the universal login screen.
                </p>
              </div>

              {/* Password Configuration */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setAutoGen(false)
                    }}
                    placeholder="Enter or generate temporary password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tenant Scope &amp; Role Permissions</span>
                  </div>
                  <p className="text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                    Employees can view and manage your agency's clients, reports, and media. They are strictly blocked from superadmin routes, blog settings, and removing agency owners.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Team Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Credentials Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Team Member Created!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Share these login credentials with your new staff member.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Login URL:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  https://builtbymiguel.net/login
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {createdCredentials.email}
                </span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-slate-500 dark:text-slate-400">Password:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {createdCredentials.password || '(Custom)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedCredentials(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive / Revoke Confirmation Modal */}
      <ConfirmModal
        isOpen={!!employeeToDelete}
        title="Archive Team Member Account"
        description={`Are you sure you want to archive ${employeeToDelete?.name || employeeToDelete?.email}? Their login access will be immediately terminated, but past report authorship and activity history will be retained.`}
        confirmText="Archive Account"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
        onConfirm={handleDeleteMember}
        onClose={() => setEmployeeToDelete(null)}
      />

      {/* Reset User Password Modal */}
      <ResetUserPasswordModal
        isOpen={!!userToResetPassword}
        targetUser={userToResetPassword}
        onClose={() => setUserToResetPassword(null)}
        onSuccess={(msg) => addToast('success', 'Password Reset', msg)}
      />
    </AdminShell>
  )
}
