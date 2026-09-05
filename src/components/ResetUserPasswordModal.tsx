import React, { useState, useEffect } from 'react'
import { KeyRound, Eye, EyeOff, X, Check, Copy, RefreshCw, AlertCircle, Loader2, ShieldCheck, User } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset User Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set a new login password for this account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {completedCredentials ? (
          /* Success Screen with Copyable Credentials */
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Password Reset Successfully!
              </div>
              <p className="text-emerald-700 dark:text-emerald-400/90 text-xs">
                The account can now sign in using the new password below.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Account</span>
                <span className="font-medium text-slate-900 dark:text-white">{completedCredentials.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>New Password</span>
                <code className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg border border-blue-200/60 dark:border-blue-900/60 text-xs">
                  {completedCredentials.password}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Password Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs leading-relaxed animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Target User Info Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {targetUser.name || 'User'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {targetUser.email}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                {formatRoleName(targetUser.role)}
              </span>
            </div>

            {/* New Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Minimum 6 characters. You can copy the credentials on the next screen.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
