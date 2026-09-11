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
      className={`h-8 px-3 rounded-[6px] text-[13px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:text-[var(--danger)] hover:border-[var(--danger)]/40 transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${className}`}
      aria-label="Log out of admin session"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--muted)]" />
      ) : (
        <LogOut className="w-3.5 h-3.5 text-[var(--muted)]" />
      )}
      <span>{children || (loading ? 'Logging out...' : 'Sign out')}</span>
    </button>
  )
}
