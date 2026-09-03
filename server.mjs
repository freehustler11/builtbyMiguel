import 'dotenv/config'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { runMigrations } from './scripts/migrate.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = __dirname
const clientDir = path.resolve(rootDir, 'dist', 'client')
const publicDir = path.resolve(rootDir, 'public')
const serverEntry = path.resolve(rootDir, 'dist', 'server', 'server.js')

const port = Number(process.env.PORT) || 3000

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

// Dynamically import TanStack Start Server
const { default: startServer } = await import(pathToFileURL(serverEntry).href)

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0]

  // 1. Check for static client build assets in dist/client
  const clientFilePath = path.join(clientDir, urlPath)
  if (urlPath !== '/' && fs.existsSync(clientFilePath) && fs.statSync(clientFilePath).isFile()) {
    res.setHeader('Content-Type', getMimeType(clientFilePath))
    if (urlPath.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
    fs.createReadStream(clientFilePath).pipe(res)
    return
  }

  // 2. Check for public folder static files (e.g., /llms.txt, /favicon.ico)
  const publicFilePath = path.join(publicDir, urlPath)
  if (urlPath !== '/' && fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    res.setHeader('Content-Type', getMimeType(publicFilePath))
    fs.createReadStream(publicFilePath).pipe(res)
    return
  }

  // 3. Dynamic TanStack Start SSR Handler
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${port}`
    const fullUrl = `${protocol}://${host}${req.url}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v))
        } else {
          headers.set(key, value)
        }
      }
    }

    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half',
    })

    const response = await startServer.fetch(webRequest)

    res.statusCode = response.status

    // Correctly propagate Set-Cookie header arrays for session authentication
    if (typeof response.headers.getSetCookie === 'function') {
      const setCookies = response.headers.getSetCookie()
      if (setCookies && setCookies.length > 0) {
        res.setHeader('set-cookie', setCookies)
      }
    }

    response.headers.forEach((val, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        res.setHeader(key, val)
      }
    })

    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch (err) {
    console.error('SSR Server Error:', err)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

// Initialize database tables & start listening
runMigrations().finally(() => {
  server.listen(port, () => {
    console.log(`🚀 TanStack Start Dynamic SSR Server listening on port ${port}`)
  })
})
