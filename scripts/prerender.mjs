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

const ROUTE_META = {
  '/': {
    title: 'Built by Miguel | High-Performance Websites & Local SEO Systems',
    description: 'High-speed React websites, verified local search optimization, and custom lead automation workflows for local businesses and contractors.',
    canonical: 'https://builtbymiguel.net',
  },
  '/local-seo-gbp': {
    title: 'Local SEO & Google Business Profile Optimization | Built by Miguel',
    description: 'Systematic Google Map Pack optimization and AI search engine visibility (ChatGPT, Perplexity). Complete local SEO retainers and NAP citation cleanup.',
    canonical: 'https://builtbymiguel.net/local-seo-gbp',
  },
  '/websites-care': {
    title: 'High-Speed Websites & Monthly Care Plans | Built by Miguel',
    description: 'Sub-second custom websites built for local service businesses. Fast mobile load times, high conversion architecture, and 24/7 care & maintenance retainers.',
    canonical: 'https://builtbymiguel.net/websites-care',
  },
  '/systems-auto': {
    title: 'Custom Business Systems & Workflow Automation | Built by Miguel',
    description: 'Automate your local business operations. Custom lead CRMs, instant SMS dispatch, client intake engines, and real-time business dashboards.',
    canonical: 'https://builtbymiguel.net/systems-auto',
  },
  '/work': {
    title: 'Built In-House Software & Client Results | Built by Miguel',
    description: 'Explore the custom software, automation engines, and high-speed web systems built by Miguel to dominate local search and streamline business operations.',
    canonical: 'https://builtbymiguel.net/work',
  },
  '/about': {
    title: 'About Miguel | Full-Stack Local SEO & Systems Engineer',
    description: 'Learn about Miguel, the developer and growth strategist behind Built by Miguel. Discover the engineering philosophy combining sub-second websites, local SEO, and custom business automation.',
    canonical: 'https://builtbymiguel.net/about',
  },
  '/contact': {
    title: 'Contact Miguel | Direct Inquiries & Project Discovery',
    description: 'Get in touch directly with Miguel to discuss Local SEO, high-speed custom websites, or operational business automation. 24-hour response guaranteed.',
    canonical: 'https://builtbymiguel.net/contact',
  },
  '/audit': {
    title: 'Claim Your Free 5-Minute Local Visibility Audit | Built by Miguel',
    description: 'Request a personalized 5-minute video breakdown of your Google Map Pack ranking, website speed bottlenecks, and competitor gaps. Delivered in 24 hours.',
    canonical: 'https://builtbymiguel.net/audit',
  },
  '/thank-you': {
    title: 'Thank You | Audit Request Received | Built by Miguel',
    description: 'Your local search and speed audit has been queued for review by Miguel.',
    canonical: 'https://builtbymiguel.net/thank-you',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Built by Miguel',
    description: 'Privacy Policy and data protection terms for Built by Miguel. Zero data selling, strict form confidentiality, and minimal analytics.',
    canonical: 'https://builtbymiguel.net/privacy-policy',
  },
  '/terms': {
    title: 'Terms of Service | Built by Miguel',
    description: 'Terms of Service for software development, Local SEO retainers, and care plan services provided by Built by Miguel.',
    canonical: 'https://builtbymiguel.net/terms',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Built by Miguel',
    description: 'Cookie Policy for Built by Miguel. Minimal cookies, zero tracking ad pixels, and strict performance metrics.',
    canonical: 'https://builtbymiguel.net/cookie-policy',
  },
}

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

    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )

    const meta = ROUTE_META[url]
    if (meta) {
      if (meta.canonical) {
        html = html.replace(
          /<link rel="canonical" href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${meta.canonical}" />`
        )
      }
      if (meta.title) {
        html = html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${meta.title}</title>`
        )
        html = html.replace(
          /<meta property="og:title" content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${meta.title}" />`
        )
        html = html.replace(
          /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
          `<meta name="twitter:title" content="${meta.title}" />`
        )
      }
      if (meta.description) {
        html = html.replace(
          /<meta name="description" content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${meta.description}" />`
        )
        html = html.replace(
          /<meta property="og:description" content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${meta.description}" />`
        )
        html = html.replace(
          /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
          `<meta name="twitter:description" content="${meta.description}" />`
        )
      }
      if (meta.canonical) {
        html = html.replace(
          /<meta property="og:url" content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${meta.canonical}" />`
        )
      }
    }

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
