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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Log out of admin session"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{children || (loading ? 'Logging out...' : 'Sign Out')}</span>
    </button>
  )
}
