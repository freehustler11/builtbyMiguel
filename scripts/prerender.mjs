import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const routesToPrerender = [
  '/',
  '/local-seo-gbp',
  '/websites-care',
  '/systems-auto',
  '/work',
  '/about',
  '/contact',
  '/audit',
  '/thank-you',
  '/privacy-policy',
  '/terms',
  '/cookie-policy',
]

async function prerender() {
  console.log('🚀 Starting Static Site Generation (SSG Pre-rendering)...')

  const templatePath = path.resolve(rootDir, 'dist', 'index.html')
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run client build first.')
  }
  const template = fs.readFileSync(templatePath, 'utf-8')

  const serverEntryPath = path.resolve(rootDir, 'dist', 'server', 'entry-server.js')
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error('dist/server/entry-server.js not found. Run SSR build first.')
  }

  const { render } = await import(pathToFileURL(serverEntryPath).href)

  for (const url of routesToPrerender) {
    console.log(`  -> Pre-rendering: ${url}`)
    const { appHtml } = await render(url)

    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )

    let filePath = ''
    if (url === '/') {
      filePath = path.resolve(rootDir, 'dist', 'index.html')
    } else {
      const routeDir = path.resolve(rootDir, 'dist', url.slice(1))
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true })
      }
      filePath = path.resolve(routeDir, 'index.html')
    }

    fs.writeFileSync(filePath, html, 'utf-8')
    console.log(`     ✓ Written to ${path.relative(rootDir, filePath)}`)
  }

  console.log('✨ All routes successfully pre-rendered to static HTML!')
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err)
  process.exit(1)
})
