import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const routesDir = path.resolve(rootDir, 'src', 'routes')
const publicDir = path.resolve(rootDir, 'public')

const SITE_URL = 'https://builtbymiguel.net'

// Pages that must NEVER appear in the sitemap.
// These are private/internal app routes or technical utility routes.
const EXCLUDED_ROUTES = new Set([
  '__root',       // TanStack root layout — not a real page
  '$',            // 404 catch-all
  'thank-you',    // Transactional confirmation — no SEO value
  'login',        // Authentication page
  'admin',        // Staff CMS — requires login
  'superadmin',   // Superadmin dashboard — requires login
  'messages',     // Internal messaging — requires login
  'portal',       // Client portal — requires login
  'my-work',      // Internal agent work log — requires login
  'r',            // /r/:shareToken public share links — transactional, not indexable
  'local-seo-gbp',// Redirects 301 to /seo/local
  'national-seo', // Redirects 301 to /seo/national
  'aeo-geo',      // Top-level legacy redirect (redirects 301 to /seo/aeo-geo)
  'website-design', // Redirects 301 to /websites/design-and-development
  'websites-care',// Redirects 301 to /websites/hosting-and-maintenance
  'seo/ai-search',// Redirects 301 to /seo/aeo-geo
])

// Static-route priority & changefreq
const ROUTE_CONFIG = {
  '':               { priority: '1.0', changefreq: 'daily' },
  'seo':            { priority: '0.9', changefreq: 'weekly' },
  'seo/local':      { priority: '0.9', changefreq: 'weekly' },
  'seo/national':   { priority: '0.9', changefreq: 'weekly' },
  'seo/aeo-geo':    { priority: '0.9', changefreq: 'weekly' },
  'websites':       { priority: '0.9', changefreq: 'weekly' },
  'websites/design-and-development': { priority: '0.9', changefreq: 'weekly' },
  'websites/hosting-and-maintenance': { priority: '0.9', changefreq: 'weekly' },
  'website-demo':   { priority: '0.9', changefreq: 'weekly' },
  'systems-auto':   { priority: '0.9', changefreq: 'weekly' },
  'audit':          { priority: '0.9', changefreq: 'weekly' },
  'work':           { priority: '0.8', changefreq: 'weekly' },
  'about':          { priority: '0.8', changefreq: 'monthly' },
  'contact':        { priority: '0.8', changefreq: 'monthly' },
  'blog':           { priority: '0.8', changefreq: 'weekly' },
  'privacy-policy': { priority: '0.3', changefreq: 'yearly' },
  'terms':          { priority: '0.3', changefreq: 'yearly' },
  'cookie-policy':  { priority: '0.3', changefreq: 'yearly' },
}

/**
 * Fetch published blog posts from the DB.
 * Returns an array of { slug, lastmod } objects.
 * Gracefully returns [] if the DB is unreachable (e.g. CI build without DB).
 */
async function fetchPublishedPosts() {
  try {
    const { default: postgres } = await import('postgres')
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:zvorhklm2hyhlzn1@2.29.45.40:5432/postgres'

    const sql = postgres(connectionString, { prepare: false, max: 1 })

    try {
      const now = new Date().toISOString()
      const rows = await sql`
        SELECT slug, published_at, updated_at
        FROM posts
        WHERE status = 'published'
           OR (status = 'scheduled' AND scheduled_at <= ${now}::timestamptz)
        ORDER BY published_at DESC NULLS LAST
      `
      return rows.map((r) => ({
        slug: r.slug,
        // Use updated_at for accurate lastmod; fall back to published_at
        lastmod: (r.updated_at || r.published_at || new Date()).toISOString().split('T')[0],
      }))
    } finally {
      await sql.end()
    }
  } catch (err) {
    console.warn('⚠️  Could not fetch posts from DB for sitemap (proceeding without blog post URLs):', err.message)
    return []
  }
}

/**
 * Build the XML for a single <url> entry.
 */
function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

/**
 * Core function: build and return the sitemap XML string.
 * Called both at build time (writes to file) and at runtime (served dynamically).
 */
export async function buildSitemapXml() {
  const today = new Date().toISOString().split('T')[0]

  // --- Static routes from src/routes ---
  const staticRoutes = []
  const EXCLUDED_DIRS = new Set(['admin', 'superadmin', 'portal', 'r', 'node_modules'])

  function scanDir(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name)) continue
        if (entry.name === 'blog') {
          staticRoutes.push('blog')
          continue
        }
        scanDir(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name)
        continue
      }
      if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue

      const routeName = path.basename(entry.name, path.extname(entry.name))
      if (routeName.startsWith('_')) continue

      let routePath = prefix
        ? (routeName === 'index' ? prefix : `${prefix}/${routeName}`)
        : (routeName === 'index' ? '' : routeName.replace(/_\.?/g, '/'))

      if (EXCLUDED_ROUTES.has(routePath)) continue

      if (routePath !== undefined && !staticRoutes.includes(routePath)) {
        staticRoutes.push(routePath)
      }
    }
  }

  scanDir(routesDir)

  // Sort: homepage first, then alphabetical
  staticRoutes.sort((a, b) => {
    if (a === '') return -1
    if (b === '') return 1
    return a.localeCompare(b)
  })

  const staticEntries = staticRoutes.map((route) => {
    const config = ROUTE_CONFIG[route] || { priority: '0.7', changefreq: 'weekly' }
    const loc = route ? `${SITE_URL}/${route}` : SITE_URL
    return urlEntry({ loc, lastmod: today, changefreq: config.changefreq, priority: config.priority })
  })

  // --- Blog post URLs from DB ---
  const publishedPosts = await fetchPublishedPosts()

  const postEntries = publishedPosts.map(({ slug, lastmod }) =>
    urlEntry({
      loc: `${SITE_URL}/blog/${slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    })
  )

  // Update /blog index lastmod to newest post date when posts exist
  if (publishedPosts.length > 0) {
    const newestPostDate = publishedPosts[0].lastmod
    const blogIdx = staticEntries.findIndex((e) => e.includes(`${SITE_URL}/blog<`))
    if (blogIdx !== -1) {
      staticEntries[blogIdx] = staticEntries[blogIdx].replace(
        /<lastmod>.*?<\/lastmod>/,
        `<lastmod>${newestPostDate}</lastmod>`
      )
    }
  }

  const allEntries = [...staticEntries, ...postEntries].join('\n')
  const totalUrls = staticRoutes.length + publishedPosts.length

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allEntries}
</urlset>`

  return { xml, totalUrls, postCount: publishedPosts.length }
}

/**
 * The canonical robots.txt content.
 * Single source of truth — used by both the build-time file writer
 * and the runtime dynamic handler in server.mjs.
 */
export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

# Private app routes — require authentication
Disallow: /login
Disallow: /admin/
Disallow: /superadmin/
Disallow: /portal/
Disallow: /messages/
Disallow: /my-work

# Transactional / non-indexable pages
Disallow: /thank-you
Disallow: /r/

# API routes
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`
}

/**
 * Build-time entry point: generate both files and write them to public/.
 * Runs during `npm run build` and `node scripts/generate-sitemap.mjs`.
 */
export async function generateSitemap() {
  const { xml, totalUrls, postCount } = await buildSitemapXml()
  const robotsTxt = buildRobotsTxt()

  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, xml, 'utf-8')
  console.log(
    `✓ Automatically generated sitemap at ${sitemapPath} (${totalUrls} indexable URLs, ${postCount} blog posts)`
  )

  const robotsPath = path.join(publicDir, 'robots.txt')
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8')
  console.log(`✓ Automatically generated robots.txt at ${robotsPath}`)
}

// Run when executed directly
generateSitemap()


