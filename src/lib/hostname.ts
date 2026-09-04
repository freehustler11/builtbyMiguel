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
