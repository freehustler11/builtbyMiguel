import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
} from 'lucide-react'
import { AdminNav } from '../../components/AdminNav'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { ResetUserPasswordModal } from '../../components/ResetUserPasswordModal'
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

export const Route = createFileRoute('/admin/team')({
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
  loader: async ({ context }) => {
    const auth = (context as any)?.auth || (await checkAuthServerFn())
    const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
    const [teamData, allUsersData] = await Promise.all([
      getTeamMembersServerFn(),
      isSuperadmin ? getAllUsersForAdminServerFn() : Promise.resolve({ users: [] }),
    ])
    return {
      ...teamData,
      allUsers: allUsersData?.users || [],
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
  const {
    employees: initialEmployees,
    agencyOwner,
    isSuperadmin,
    currentAdmin,
    allUsers: initialAllUsers = [],
  } = Route.useLoaderData()

  const [employees, setEmployees] = useState<EmployeeItem[]>(initialEmployees)
  const [allUsers, setAllUsers] = useState<ManagedUserItem[]>(initialAllUsers)
  const [roleFilter, setRoleFilter] = useState<'all' | 'partner_employee' | 'partner' | 'client' | 'superadmin'>('partner_employee')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeItem | null>(null)
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-slate-100 transition-colors">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Header */}
        <AdminNav
          activeTab="team"
          userRole={currentAdmin?.role}
          title="Team & Sub-Accounts"
          description="Manage team members, staff logins, and access permissions for your agency."
          actions={
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          }
        />

        {/* Agency Owner & Plan Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-600/20 shrink-0">
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
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{agencyOwner?.email}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Full Administrative &amp; Team Permissions
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Team Size</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {initialEmployees.length + 1}
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Sub-Accounts</div>
                <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {initialEmployees.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members List Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{isSuperadmin && roleFilter !== 'partner_employee' ? 'System Accounts & Logins' : 'Active Team Members'}</span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {displayedUsers.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isSuperadmin
                  ? 'Manage team members, agency owners, and reset passwords for any account.'
                  : "Staff members with access to your agency's clients, reports, and media."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Role filter switcher for superadmin */}
              {isSuperadmin && (
                <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold shadow-inner">
                  <button
                    type="button"
                    onClick={() => setRoleFilter('partner_employee')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      roleFilter === 'partner_employee'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Staff ({employees.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      roleFilter === 'all'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    All ({allUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('partner')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      roleFilter === 'partner'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Owners ({allUsers.filter((u) => u.role === 'partner').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('client')}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      roleFilter === 'client'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Clients ({allUsers.filter((u) => u.role === 'client').length})
                  </button>
                </div>
              )}

              {/* Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Table / Cards */}
          {displayedUsers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {searchQuery ? 'No matching users found' : 'No team members added yet'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {searchQuery
                    ? 'Try searching with a different name or email address.'
                    : 'Invite colleagues, virtual assistants, or account managers to collaborate on clients and generate reports.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add First Employee</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4 sm:px-6">Team Member / Account</th>
                      <th className="py-3.5 px-4">Role &amp; Permissions</th>
                      {isSuperadmin && <th className="py-3.5 px-4">Agency / Details</th>}
                      <th className="py-3.5 px-4">Date Added</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {displayedUsers.map((user) => {
                      const initials = user.name
                        ? user.name
                            .split(' ')
                            .map((p: string) => p[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'TM'

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs shadow-2xs">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">
                                  {user.name || 'Account User'}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            {user.role === 'superadmin' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50">
                                <ShieldCheck className="w-3 h-3" />
                                Superadmin
                              </span>
                            ) : user.role === 'partner' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-900/50">
                                <Building2 className="w-3 h-3" />
                                Agency Owner
                              </span>
                            ) : user.role === 'client' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/50">
                                <User className="w-3 h-3" />
                                Client Portal
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/50">
                                <UserCheck className="w-3 h-3" />
                                Agency Staff
                              </span>
                            )}
                          </td>

                          {isSuperadmin && (
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium">
                                  {user.partnerName || (user.role === 'partner' ? 'Partner Owner' : user.role === 'superadmin' ? 'Primary' : 'Direct')}
                                </span>
                              </div>
                            </td>
                          )}

                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{formatDate(user.createdAt)}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                type="button"
                                role="switch"
                                aria-checked={user.isActive}
                                disabled={updatingId === user.id || user.role === 'superadmin'}
                                onClick={() => handleToggleStatus(user)}
                                title={
                                  user.isActive
                                    ? 'Click to suspend account'
                                    : 'Click to reactivate account'
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 ${
                                  user.isActive
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                                }`}
                              >
                                <span className="sr-only">Toggle account status</span>
                                <span
                                  aria-hidden="true"
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    user.isActive ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>

                              {/* Status Label */}
                              <div className="flex items-center gap-1.5 min-w-[75px]">
                                {updatingId === user.id ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                    <span>Updating...</span>
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                      user.isActive
                                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40'
                                        : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        user.isActive ? 'bg-emerald-500' : 'bg-amber-500'
                                      }`}
                                    />
                                    <span>{user.isActive ? 'Active' : 'Suspended'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Reset Password Button */}
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-900/50 transition active:scale-95 shadow-2xs cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-500" />
                                <span>Password</span>
                              </button>

                              {/* Revoke / Delete Button (for staff and client accounts) */}
                              {(user.role === 'partner_employee' || (isSuperadmin && user.role === 'client')) && (
                                <button
                                  type="button"
                                  onClick={() => setEmployeeToDelete(user as EmployeeItem)}
                                  title="Revoke access and delete login"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 transition active:scale-95 shadow-2xs cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Revoke</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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

      {/* Revoke Confirmation Modal */}
      <ConfirmModal
        isOpen={!!employeeToDelete}
        title="Revoke Team Member Access"
        description={`Are you sure you want to revoke access for ${employeeToDelete?.name || employeeToDelete?.email}? This will delete their login credentials immediately.`}
        confirmText="Yes, Revoke Access"
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
    </div>
  )
}
