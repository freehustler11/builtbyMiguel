import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader, getCookie } from '@tanstack/react-start/server'
import { getSessionData } from './auth'

export type HostType = 'main' | 'app' | 'dev'

/**
 * Classifies an incoming host into 'main' (builtbymiguel.net), 'app' (app.builtbymiguel.net), or 'dev' (localhost/dev)
 */
export function classifyHost(rawHost: string | null | undefined): HostType {
  if (!rawHost) return 'dev'
  const host = rawHost.split(':')[0].toLowerCase().trim()

  if (host === 'app.builtbymiguel.net') {
    return 'app'
  }
  if (host === 'builtbymiguel.net' || host === 'www.builtbymiguel.net') {
    return 'main'
  }
  return 'dev'
}

/**
 * Checks if a pathname is an internal application route
 */
export function isInternalPath(pathname: string): boolean {
  const p = pathname.toLowerCase()
  return (
    p === '/login' ||
    p.startsWith('/login/') ||
    p === '/admin' ||
    p.startsWith('/admin/') ||
    p === '/portal' ||
    p.startsWith('/portal/') ||
    p === '/messages' ||
    p.startsWith('/messages/')
  )
}

/**
 * Checks if a pathname is a technical, static, or API asset
 */
export function isTechnicalOrAsset(pathname: string): boolean {
  const p = pathname.toLowerCase()
  return (
    p.startsWith('/_server') ||
    p.startsWith('/_build') ||
    p.startsWith('/assets/') ||
    p.startsWith('/api/') ||
    p.startsWith('/favicon') ||
    p.startsWith('/logo') ||
    p === '/robots.txt' ||
    p === '/sitemap.xml' ||
    p === '/llms.txt' ||
    p === '/llms-full.txt'
  )
}

/**
 * Checks if a pathname is a marketing/public route
 */
export function isMarketingPath(pathname: string): boolean {
  if (isTechnicalOrAsset(pathname)) return false
  if (isInternalPath(pathname)) return false
  return true
}

export interface HostnameRoutingResult {
  redirectUrl: string | null
}

/**
 * Server function to check hostname routing during SSR or client beforeLoad
 */
export const checkHostnameRoutingServerFn = createServerFn({ method: 'GET' })
  .validator((d: { pathname: string; search?: string }) => d)
  .handler(async ({ data }): Promise<HostnameRoutingResult> => {
    const rawHost = getRequestHeader('x-forwarded-host') || getRequestHeader('host') || ''
    const hostType = classifyHost(rawHost)
    const { pathname, search = '' } = data

    // 1. On main domain (builtbymiguel.net): redirect internal app routes to app.builtbymiguel.net
    if (hostType === 'main') {
      if (isInternalPath(pathname)) {
        return {
          redirectUrl: `https://app.builtbymiguel.net${pathname}${search}`,
        }
      }
    }

    // 2. On app subdomain (app.builtbymiguel.net):
    if (hostType === 'app') {
      // Root / redirects to login or admin
      if (pathname === '/') {
        const token = getCookie('admin_session')
        const session = token ? await getSessionData(token) : null
        if (session && session.isActive !== false) {
          const dest =
            session.role === 'partner'
              ? '/admin/clients'
              : session.role === 'client'
              ? '/portal'
              : '/admin'
          return {
            redirectUrl: `https://app.builtbymiguel.net${dest}`,
          }
        }
        return {
          redirectUrl: 'https://app.builtbymiguel.net/login',
        }
      }

      // Public marketing routes redirect back to builtbymiguel.net
      if (isMarketingPath(pathname)) {
        return {
          redirectUrl: `https://builtbymiguel.net${pathname}${search}`,
        }
      }
    }

    // In dev or valid routes on respective hosts, no redirection
    return { redirectUrl: null }
  })
