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
      className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-200 ${
        isLeaving
          ? 'opacity-0 translate-y-2 scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-bottom-5'
      } ${
        isSuccess
          ? 'bg-white/95 dark:bg-[#111827]/95 border-emerald-500/40 text-slate-900 dark:text-white'
          : isError
            ? 'bg-white/95 dark:bg-[#111827]/95 border-rose-500/40 text-slate-900 dark:text-white'
            : 'bg-white/95 dark:bg-[#111827]/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-500" />}
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-bold">{toast.title}</div>
          {toast.message && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {toast.message}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleManualDismiss}
        className="p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
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
