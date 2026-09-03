import { useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { LogOut, Loader2 } from 'lucide-react'
import { logoutServerFn } from '../lib/auth'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
  redirectTo?: string
}

export function LogoutButton({
  className = '',
  children,
  redirectTo = '/login',
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logoutServerFn()
      await router.invalidate()
      navigate({ to: redirectTo })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Log out of admin session"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
      ) : (
        <LogOut className="w-3.5 h-3.5 text-rose-500" />
      )}
      <span>{children || (loading ? 'Logging out...' : 'Sign Out')}</span>
    </button>
  )
}
