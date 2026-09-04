import { createServerFn } from '@tanstack/react-start'
import { getSessionData } from './auth'
import {
  classifyHost,
  isInternalPath,
  isTechnicalOrAsset,
  isMarketingPath,
  type HostType,
} from '../../src/lib/hostname'

export {
  classifyHost,
  isInternalPath,
  isTechnicalOrAsset,
  isMarketingPath,
  type HostType,
}

export interface HostnameRoutingResult {
  redirectUrl: string | null
}

async function getServerUtils() {
  return await import(/* @vite-ignore */ '@tanstack/react-start/server')
}

/**
 * Server function to check hostname routing during SSR or client beforeLoad
 */
export const checkHostnameRoutingServerFn = createServerFn({ method: 'GET' })
  .validator((d: { pathname: string; search?: string }) => d)
  .handler(async ({ data }): Promise<HostnameRoutingResult> => {
    const { getRequestHeader, getCookie } = await getServerUtils()
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
