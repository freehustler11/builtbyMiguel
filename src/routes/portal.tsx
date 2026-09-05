import { createFileRoute, Outlet, Link, useRouter, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, LogOut, User, KeyRound } from 'lucide-react'
import { requireClient, checkAuthServerFn, logoutServerFn } from '../lib/auth'
import { ThemeToggle } from '../components/ThemeToggle'
import { ChangePasswordModal } from '../components/ChangePasswordModal'

export const Route = createFileRoute('/portal')({
  beforeLoad: async ({ location }) => {
    await requireClient({ location })
  },
  loader: async () => {
    const auth = await checkAuthServerFn()
    return { auth }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Client Portal | Performance Reports' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: PortalLayout,
})

function PortalLayout() {
  const { auth } = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutServerFn()
      await router.invalidate()
      navigate({ to: '/login' })
    } catch {
      navigate({ to: '/login' })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c111d] text-slate-900 dark:text-white flex flex-col">
      {/* Portal Navbar - Hidden on print */}
      <header className="print:hidden sticky top-0 z-30 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/portal" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
                  Client Portal
                </span>
                <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
                  Monthly Performance Reports
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {auth.email && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="max-w-[200px] truncate">{auth.email}</span>
              </div>
            )}

            <ThemeToggle variant="pill" />

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Change Account Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none">
        <Outlet />
      </main>

      {/* Portal Simple Footer - Hidden on print */}
      <footer className="print:hidden border-t border-slate-200/80 dark:border-slate-800 py-6 px-4 text-center text-xs font-mono text-slate-400">
        <p>Client Performance Portal • Confidential & Proprietary</p>
      </footer>
    </div>
  )
}
