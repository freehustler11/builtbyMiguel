import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme'

interface ThemeToggleProps {
  variant?: 'pill' | 'row'
  className?: string
}

export function ThemeToggle({ variant = 'pill', className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${
          isDark
            ? 'text-slate-200 bg-slate-800/80 hover:bg-slate-800'
            : 'text-slate-700 bg-slate-100 hover:bg-slate-200/80'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-amber-300" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          <span>{isDark ? 'Dark Mode (Midnight)' : 'Light Mode'}</span>
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-slate-700/50 text-slate-400">
          {isDark ? 'ON' : 'OFF'}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95 ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-amber-300 hover:text-amber-200 hover:border-slate-700 shadow-sm shadow-slate-950/50'
          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 fill-amber-300/20" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 text-amber-500 fill-amber-500/20" />
      )}
    </button>
  )
}
