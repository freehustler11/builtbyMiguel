import { ReactNode } from 'react'
import { AlertTriangle, Trash2, CheckCircle2, X } from 'lucide-react'

export interface ConfirmModalProps {
  isOpen: boolean
  onClose?: () => void
  onCancel?: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: ReactNode
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  description,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const handleClose = () => {
    if (onClose) onClose()
    else if (onCancel) onCancel()
  }

  const effectiveDescription = description !== undefined ? description : message

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
          iconBg: 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60',
          btn: 'bg-rose-600 hover:bg-rose-700 text-white',
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          iconBg: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60',
          btn: 'bg-amber-600 hover:bg-amber-700 text-white',
        }
      case 'primary':
      default:
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />,
          iconBg: 'bg-[var(--accent)]/10 border border-[var(--accent)]/20',
          btn: 'bg-[var(--accent)] hover:opacity-90 text-white',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-[var(--panel)] rounded-[12px] border border-[var(--line)] shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 text-[var(--ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 ${styles.iconBg}`}
            >
              {styles.icon}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--ink)] leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-[var(--muted)]">
                Please confirm this action
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

        {/* Modal Body / Description */}
        <div className="text-[13px] text-[var(--muted)] leading-relaxed">
          {effectiveDescription}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]/60">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] border border-[var(--line)] bg-[var(--panel)] transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-8 px-3.5 rounded-[6px] text-[13px] font-medium transition cursor-pointer disabled:opacity-50 ${styles.btn}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
