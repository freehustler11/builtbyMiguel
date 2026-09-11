import React, { useState, useEffect } from 'react'
import { KeyRound, Eye, EyeOff, X, Check, Copy, RefreshCw, AlertCircle, Loader2, User } from 'lucide-react'
import { adminResetUserPasswordServerFn } from '../server/passwords'

interface TargetUser {
  id: string
  name: string | null
  email: string
  role: string
  partnerName?: string | null
}

interface ResetUserPasswordModalProps {
  isOpen: boolean
  targetUser: TargetUser | null
  onClose: () => void
  onSuccess?: (message: string) => void
}

export function ResetUserPasswordModal({
  isOpen,
  targetUser,
  onClose,
  onSuccess,
}: ResetUserPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [completedCredentials, setCompletedCredentials] = useState<{
    email: string
    password: string
    name: string
  } | null>(null)

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    let pass = 'Agency@'
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    pass += '!'
    setPassword(pass)
  }

  useEffect(() => {
    if (isOpen) {
      generateRandomPassword()
      setError(null)
      setCompletedCredentials(null)
      setCopied(false)
    }
  }, [isOpen, targetUser])

  if (!isOpen || !targetUser) return null

  const handleClose = () => {
    setPassword('')
    setError(null)
    setCompletedCredentials(null)
    setCopied(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || password.trim().length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await adminResetUserPasswordServerFn({
        data: {
          userId: targetUser.id,
          newPassword: password.trim(),
        },
      })

      if (res.success) {
        setCompletedCredentials({
          email: targetUser.email,
          name: targetUser.name || 'User',
          password: password.trim(),
        })
        if (onSuccess) {
          onSuccess(`Password for ${targetUser.name || targetUser.email} has been reset.`)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyCredentials = () => {
    if (!completedCredentials) return
    const text = `built by Miguel Portal Login Credentials:\nURL: https://builtbymiguel.net/login\nEmail: ${completedCredentials.email}\nNew Password: ${completedCredentials.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const formatRoleName = (r: string) => {
    switch (r) {
      case 'superadmin':
        return 'Superadmin'
      case 'partner':
        return 'Agency Owner'
      case 'partner_employee':
        return 'Agency Staff'
      case 'client':
        return 'Client'
      default:
        return r
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[var(--panel)] rounded-[12px] border border-[var(--line)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[var(--ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] bg-[var(--canvas)]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--ink)] leading-tight">
                Reset User Password
              </h3>
              <p className="text-[11px] text-[var(--muted)]">
                Set a new login password for this account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {completedCredentials ? (
          /* Success Screen with Copyable Credentials */
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[12px] space-y-0.5">
              <div className="font-semibold flex items-center gap-1.5 text-[13px]">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Password Reset Successfully!
              </div>
              <p className="text-emerald-700 dark:text-emerald-400/90 text-[11px]">
                The account can now sign in using the new password below.
              </p>
            </div>

            <div className="p-3.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
                <span>Account</span>
                <span className="font-medium text-[var(--ink)]">{completedCredentials.email}</span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
                <span>New Password</span>
                <code className="font-mono font-bold text-[var(--accent)] bg-[var(--panel)] px-2 py-0.5 rounded-[4px] border border-[var(--line)] text-[12px]">
                  {completedCredentials.password}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]/60">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="h-8 inline-flex items-center gap-1.5 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--canvas)] transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="h-8 px-3.5 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Password Input Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-3 rounded-[6px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-rose-700 dark:text-rose-400 text-[12px] leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Target User Info Card */}
            <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-[4px] bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] font-bold text-[11px] shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)] truncate">
                    {targetUser.name || 'User'}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono truncate">
                    {targetUser.email}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] shrink-0">
                {formatRoleName(targetUser.role)}
              </span>
            </div>

            {/* New Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-medium text-[var(--ink)]">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate New</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter or generate password"
                  className="w-full h-8 pl-3 pr-9 rounded-[6px] text-[13px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Minimum 6 characters. You can copy the credentials on the next screen.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]/60">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] border border-[var(--line)] bg-[var(--panel)] transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="h-8 inline-flex items-center gap-1.5 px-3.5 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Set New Password</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
