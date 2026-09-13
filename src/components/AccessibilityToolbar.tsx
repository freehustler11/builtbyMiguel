import { useState, useEffect, useRef } from 'react'
import { X, RotateCcw } from 'lucide-react'

export interface A11ySettings {
  textSize: 'normal' | 'large' | 'larger'
  highContrast: boolean
  reducedMotion: boolean
  underlineLinks: boolean
}

const STORAGE_KEY = 'bbm_a11y_settings'

const DEFAULT_SETTINGS: A11ySettings = {
  textSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  underlineLinks: false,
}

export function getA11ySettings(): A11ySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // Check OS reduced-motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { ...DEFAULT_SETTINGS, reducedMotion: prefersReducedMotion }
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function applyA11yClasses(settings: A11ySettings) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Text size
  root.classList.remove('a11y-text-large', 'a11y-text-larger')
  if (settings.textSize === 'large') {
    root.classList.add('a11y-text-large')
  } else if (settings.textSize === 'larger') {
    root.classList.add('a11y-text-larger')
  }

  // High contrast
  if (settings.highContrast) {
    root.classList.add('a11y-high-contrast')
  } else {
    root.classList.remove('a11y-high-contrast')
  }

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add('a11y-reduced-motion')
  } else {
    root.classList.remove('a11y-reduced-motion')
  }

  // Underline links
  if (settings.underlineLinks) {
    root.classList.add('a11y-underline-links')
  } else {
    root.classList.remove('a11y-underline-links')
  }
}

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const [cookieBannerActive, setCookieBannerActive] = useState(false)

  // Initialize from storage on mount
  useEffect(() => {
    const initial = getA11ySettings()
    setSettings(initial)
    applyA11yClasses(initial)

    const checkBanner = () => {
      if (typeof window === 'undefined') return
      const consent = localStorage.getItem('bbm_cookie_consent')
      setCookieBannerActive(!consent)
    }
    checkBanner()
    window.addEventListener('bbm-cookie-consent-updated', checkBanner)
    return () => window.removeEventListener('bbm-cookie-consent-updated', checkBanner)
  }, [])

  // Handle ESC key and focus return
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    // Click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const updateSettings = (newSettings: Partial<A11ySettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    applyA11yClasses(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save accessibility settings', e)
    }
  }

  const resetDefaults = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false
    const reset = { ...DEFAULT_SETTINGS, reducedMotion: prefersReducedMotion }
    setSettings(reset)
    applyA11yClasses(reset)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to reset accessibility settings', e)
    }
  }

  return (
    <>
      {/* Floating Launcher Button - Bottom Left */}
      <div
        className={`fixed left-4 sm:left-6 z-[9990] transition-all duration-300 ${
          cookieBannerActive ? 'bottom-56 sm:bottom-6' : 'bottom-4 sm:bottom-6'
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open Accessibility Toolbar"
          className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 shadow-lg hover:shadow-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          {/* Universal Accessibility Symbol (Person in circle) */}
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
          </svg>
        </button>
      </div>

      {/* Flyout Accessibility Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Settings"
          className={`fixed left-4 sm:left-6 w-[calc(100vw-2rem)] sm:w-84 max-w-sm rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-5 text-slate-800 dark:text-slate-200 z-[9991] animate-in fade-in slide-in-from-bottom-4 duration-200 transition-all ${
            cookieBannerActive ? 'bottom-72 sm:bottom-22' : 'bottom-20 sm:bottom-22'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Accessibility
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label="Close Accessibility Toolbar"
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Text Size Control */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-white block">
                Text Size
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'normal' })}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    settings.textSize === 'normal'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'large' })}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    settings.textSize === 'large'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Large
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'larger' })}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    settings.textSize === 'larger'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Larger
                </button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#161f30] border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-900 dark:text-white">
                High Contrast
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle High Contrast Mode"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Reduce Motion Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#161f30] border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-900 dark:text-white">
                Reduce Motion
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle Reduced Motion"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Underline Links Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#161f30] border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-900 dark:text-white">
                Underline All Links
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.underlineLinks}
                  onChange={(e) => updateSettings({ underlineLinks: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle Underline All Links"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Footer Reset */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={resetDefaults}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  )
}
