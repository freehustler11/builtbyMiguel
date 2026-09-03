import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const routesDir = path.resolve(rootDir, 'src', 'routes')
const publicDir = path.resolve(rootDir, 'public')

const SITE_URL = 'https://builtbymiguel.net'

// Excluded from indexable sitemap (wildcards, 404, root layout, private thank-you pages)
const EXCLUDED_ROUTES = new Set([
  '__root',
  '$',
  'thank-you',
])

// Custom priority & changefreq rules
const ROUTE_CONFIG = {
  '': { priority: '1.0', changefreq: 'daily' },
  'local-seo-gbp': { priority: '0.9', changefreq: 'weekly' },
  'websites-care': { priority: '0.9', changefreq: 'weekly' },
  'systems-auto': { priority: '0.9', changefreq: 'weekly' },
  'audit': { priority: '0.9', changefreq: 'weekly' },
  'work': { priority: '0.8', changefreq: 'weekly' },
  'about': { priority: '0.8', changefreq: 'monthly' },
  'contact': { priority: '0.8', changefreq: 'monthly' },
  'privacy-policy': { priority: '0.3', changefreq: 'monthly' },
  'terms': { priority: '0.3', changefreq: 'monthly' },
  'cookie-policy': { priority: '0.3', changefreq: 'monthly' },
}

export function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0]
  
  // 1. Scan src/routes directory
  const files = fs.readdirSync(routesDir)
  const routes = []

  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
    const routeName = path.basename(file, path.extname(file))

    if (EXCLUDED_ROUTES.has(routeName) || routeName.startsWith('_')) {
      continue
    }

    const routePath = routeName === 'index' ? '' : routeName
    routes.push(routePath)
  }

  // Sort routes: homepage first, then alphabetical
  routes.sort((a, b) => {
    if (a === '') return -1
    if (b === '') return 1
    return a.localeCompare(b)
  })

  // 2. Build XML string
  const urlEntries = routes
    .map((route) => {
      const config = ROUTE_CONFIG[route] || { priority: '0.7', changefreq: 'weekly' }
      const loc = route ? `${SITE_URL}/${route}` : SITE_URL

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`
    })
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`

  // 3. Write public/sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8')
  console.log(`✓ Automatically generated sitemap at ${sitemapPath} (${routes.length} indexable URLs)`)

  // 4. Write public/robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /thank-you
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`
  const robotsPath = path.join(publicDir, 'robots.txt')
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8')
  console.log(`✓ Automatically generated robots.txt at ${robotsPath}`)
}

// Run when executed directly
generateSitemap()
