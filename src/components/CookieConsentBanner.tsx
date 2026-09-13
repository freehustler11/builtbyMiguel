import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

export interface CookieConsentPreferences {
  strictlyNecessary: boolean
  analytics: boolean
  functional: boolean
  timestamp: string
  version: string
}

const STORAGE_KEY = 'bbm_cookie_consent'
const CURRENT_VERSION = '2026-09-13'
const EXPIRY_DAYS = 365

export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsentPreferences
    if (parsed.version !== CURRENT_VERSION) return null
    const age = Date.now() - new Date(parsed.timestamp).getTime()
    if (age > EXPIRY_DAYS * 24 * 60 * 60 * 1000) return null
    return parsed
  } catch {
    return null
  }
}

export function hasConsent(category: 'analytics' | 'functional'): boolean {
  const consent = getCookieConsent()
  if (!consent) return false
  return Boolean(consent[category])
}

function saveConsentCookie(consent: CookieConsentPreferences) {
  if (typeof document === 'undefined') return
  const maxAge = EXPIRY_DAYS * 24 * 60 * 60
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(consent))}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)
  const [functionalAllowed, setFunctionalAllowed] = useState(false)

  useEffect(() => {
    const existing = getCookieConsent()
    if (!existing) {
      setIsOpen(true)
    } else {
      setAnalyticsAllowed(existing.analytics)
      setFunctionalAllowed(existing.functional)
    }

    const handleOpenPreferences = () => {
      const current = getCookieConsent()
      if (current) {
        setAnalyticsAllowed(current.analytics)
        setFunctionalAllowed(current.functional)
      }
      setIsModalOpen(true)
    }

    window.addEventListener('open-cookie-preferences', handleOpenPreferences)
    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenPreferences)
    }
  }, [])

  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const applyPreferences = (analytics: boolean, functional: boolean) => {
    const preferences: CookieConsentPreferences = {
      strictlyNecessary: true,
      analytics,
      functional,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      saveConsentCookie(preferences)
      window.dispatchEvent(
        new CustomEvent('bbm-cookie-consent-updated', { detail: preferences })
      )
    } catch (e) {
      console.error('Failed to save cookie preferences', e)
    }

    setAnalyticsAllowed(analytics)
    setFunctionalAllowed(functional)
    setIsOpen(false)
    setIsModalOpen(false)
  }

  const handleAcceptAll = () => {
    applyPreferences(true, true)
  }

  const handleRejectNonEssential = () => {
    applyPreferences(false, false)
  }

  const handleSaveModalPreferences = () => {
    applyPreferences(analyticsAllowed, functionalAllowed)
  }

  return (
    <>
      {/* Site-Wide Cookie Consent Banner */}
      {isOpen && !isModalOpen && (
        <aside
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-lg z-[9995] animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-md text-slate-700 dark:text-slate-300 text-sm">
            <p className="leading-relaxed text-slate-800 dark:text-slate-200">
              We use cookies to run this site and, with your consent, to understand how it&apos;s used. See our{' '}
              <Link
                to="/cookie-policy"
                className="text-amber-600 dark:text-amber-400 font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                Cookie Policy
              </Link>{' '}
              for details.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98] cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#FAF8F5] dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3
                id="cookie-preferences-title"
                className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight"
              >
                Cookie Preferences
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Preferences Modal"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">
                    Strictly Necessary
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Required for the site to work. Cannot be turned off.
                  </p>
                </div>
                <div className="flex items-center pt-0.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed">
                    Always on
                  </span>
                </div>
              </div>

              {/* Category 2: Analytics */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">
                    Analytics
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Helps us understand site traffic and improve performance.
                  </p>
                </div>
                <div className="flex items-center pt-0.5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsAllowed}
                      onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Toggle Analytics Cookies"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              {/* Category 3: Functional */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">
                    Functional
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Remembers your preferences for a better experience.
                  </p>
                </div>
                <div className="flex items-center pt-0.5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={functionalAllowed}
                      onChange={(e) => setFunctionalAllowed(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Toggle Functional Cookies"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalPreferences}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
