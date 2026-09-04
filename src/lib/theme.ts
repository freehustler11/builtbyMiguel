import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'built_by_miguel_theme'

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    const match = document.cookie.match(new RegExp('(^| )' + THEME_STORAGE_KEY + '=([^;]+)'))
    if (match && (match[2] === 'light' || match[2] === 'dark')) {
      return match[2] as Theme
    }
  } catch {
    // Ignore localStorage/cookie access errors
  }

  // Default to light mode
  return 'light'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore localStorage write errors
  }

  try {
    document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    // Ignore cookie write errors
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for storage changes across tabs
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue as Theme)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  }
}
