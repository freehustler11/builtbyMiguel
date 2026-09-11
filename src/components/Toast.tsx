import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [isLeaving, setIsLeaving] = useState(false)
  const isSuccess = toast.type === 'success' || !toast.type
  const isError = toast.type === 'error'
  const duration = toast.duration ?? (isError ? 5000 : 4000)

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true)
      const removeTimer = setTimeout(() => {
        onDismiss(toast.id)
      }, 200)
      return () => clearTimeout(removeTimer)
    }, duration)

    return () => clearTimeout(dismissTimer)
  }, [toast.id, duration, onDismiss])

  const handleManualDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 200)
  }

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-xl backdrop-blur-md transition-all duration-200 text-[var(--ink)] ${
        isLeaving
          ? 'opacity-0 translate-y-2 scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-bottom-5'
      } ${
        isSuccess
          ? 'border-l-4 border-l-emerald-500'
          : isError
            ? 'border-l-4 border-l-rose-500'
            : 'border-l-4 border-l-[var(--accent)]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-[var(--accent)]" />}
        </div>
        <div className="space-y-0.5">
          <div className="text-[13px] font-semibold text-[var(--ink)]">{toast.title}</div>
          {toast.message && (
            <div className="text-[11px] text-[var(--muted)] leading-relaxed">
              {toast.message}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleManualDismiss}
        className="p-1 -mr-1 -mt-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-70 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
