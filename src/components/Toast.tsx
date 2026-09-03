import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type?: 'success' | 'error' | 'info'
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-70 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success' || !t.type
        const isError = t.type === 'error'

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-white/95 dark:bg-[#111827]/95 border-emerald-500/40 text-slate-900 dark:text-white'
                : isError
                  ? 'bg-white/95 dark:bg-[#111827]/95 border-rose-500/40 text-slate-900 dark:text-white'
                  : 'bg-white/95 dark:bg-[#111827]/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isSuccess && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                {isError && (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                {!isSuccess && !isError && (
                  <Info className="w-4 h-4 text-indigo-500" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold">{t.title}</div>
                {t.message && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.message}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
