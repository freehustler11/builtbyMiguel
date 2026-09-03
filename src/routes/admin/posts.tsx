import { createFileRoute, useNavigate, useRouter, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Globe,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileEdit,
  X,
  Image as ImageIcon,
  Key,
  Calendar,
  Eye,
  Check,
  RefreshCw,
  Layers,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  BookOpen,
  TrendingUp,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  CodeXml,
  AlertTriangle,
  Minus,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2,
  Sliders,
  Send,
  CalendarClock,
  ShieldCheck,
  Tag,
  FolderOpen,
  Lightbulb,
  Zap,
} from 'lucide-react'
import { requireAuth } from '../../lib/auth'
import {
  getAdminPostsServerFn,
  createPostServerFn,
  updatePostServerFn,
  deletePostServerFn,
} from '../../server/posts'
import { AdminNav } from '../../components/AdminNav'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import { MediaPickerModal } from '../../components/MediaPickerModal'
import type { Post } from '../../db/schema'

interface AdminPostsSearch {
  status?: 'all' | 'published' | 'draft' | 'scheduled'
  q?: string
}

export const Route = createFileRoute('/admin/posts')({
  validateSearch: (search: Record<string, unknown>): AdminPostsSearch => {
    const status = search.status as AdminPostsSearch['status']
    return {
      status: ['all', 'published', 'draft', 'scheduled'].includes(status || '')
        ? status
        : 'all',
      q: typeof search.q === 'string' ? search.q : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
  },
  loaderDeps: ({ search }) => ({
    status: search.status || 'all',
    q: search.q || '',
  }),
  loader: async ({ deps }) => {
    return await getAdminPostsServerFn({
      data: {
        status: deps.status,
        search: deps.q,
      },
    })
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Blog CMS & SEO Studio | built by Miguel Admin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminPostsPage,
})

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function renderAdminInlineFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-xs border border-slate-200/60 dark:border-slate-700/60"
        >
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/)
      if (linkMatch) {
        const [, label, href] = linkMatch
        parts.push(
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            {label}
          </a>
        )
      } else {
        parts.push(token)
      }
    } else {
      parts.push(token)
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

function AdminMarkdownRenderer({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim()

        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={idx} className="my-6 border-t border-slate-200 dark:border-slate-800" />
        }

        if (trimmed.startsWith('![') && trimmed.includes('](')) {
          const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/)
          if (imgMatch) {
            const [, alt, src] = imgMatch
            return (
              <figure key={idx} className="my-6 space-y-1.5">
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <img src={src} alt={alt || 'Visual'} className="w-full max-h-[450px] object-cover" />
                </div>
                {alt && <figcaption className="text-center text-xs text-slate-400 font-mono">{alt}</figcaption>}
              </figure>
            )
          }
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
              {renderAdminInlineFormatting(trimmed.replace(/^##\s+/, ''))}
            </h2>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4">
              {renderAdminInlineFormatting(trimmed.replace(/^###\s+/, ''))}
            </h3>
          )
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-3">
              {renderAdminInlineFormatting(trimmed.replace(/^####\s+/, ''))}
            </h4>
          )
        }

        if (trimmed.startsWith('##### ')) {
          return (
            <h5 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2">
              {renderAdminInlineFormatting(trimmed.replace(/^#####\s+/, ''))}
            </h5>
          )
        }

        if (trimmed.startsWith('###### ')) {
          return (
            <h6 key={idx} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 pt-2">
              {renderAdminInlineFormatting(trimmed.replace(/^######\s+/, ''))}
            </h6>
          )
        }

        if (trimmed.includes('|') && trimmed.includes('\n')) {
          const rows = trimmed.split('\n').map((row) =>
            row
              .split('|')
              .map((c) => c.trim())
              .filter((c, i, arr) => i > 0 && i < arr.length - 1)
          )
          const headerRow = rows[0]
          const bodyRows = rows.slice(2)

          if (headerRow && headerRow.length > 0) {
            return (
              <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      {headerRow.map((cell, cIdx) => (
                        <th key={cIdx} className="px-3 py-2 font-bold text-slate-900 dark:text-white font-mono">
                          {renderAdminInlineFormatting(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-850'}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                            {renderAdminInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-rose-500 italic text-slate-800 dark:text-slate-200 my-4 text-sm sm:text-base">
              {trimmed
                .replace(/^>\s+/, '')
                .split('\n')
                .map((line, lIdx) => (
                  <p key={lIdx}>{renderAdminInlineFormatting(line.replace(/^>\s*/, ''))}</p>
                ))}
            </blockquote>
          )
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().length > 0)
          return (
            <ul key={idx} className="space-y-1.5 my-3 pl-2">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>{renderAdminInlineFormatting(item.replace(/^[-*]\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter((l) => l.trim().length > 0)
          return (
            <ol key={idx} className="space-y-2 my-3 pl-2">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] font-bold shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                    {iIdx + 1}
                  </span>
                  <span>{renderAdminInlineFormatting(item.replace(/^\d+\.\s+/, ''))}</span>
                </li>
              ))}
            </ol>
          )
        }

        if (trimmed.startsWith('```')) {
          const codeText = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
          return (
            <pre key={idx} className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto my-4 border border-slate-800">
              <code>{codeText}</code>
            </pre>
          )
        }

        return (
          <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            {renderAdminInlineFormatting(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function traverseInlineNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()
  const style = el.getAttribute('style') || ''
  const isBold = tag === 'b' || tag === 'strong' || /font-weight:\s*(bold|[6-9]00)/i.test(style)
  const isItalic = tag === 'i' || tag === 'em' || /font-style:\s*italic/i.test(style)
  const isCode = tag === 'code' || /font-family:\s*(monospace|courier|consolas)/i.test(style)
  const isStrike = tag === 's' || tag === 'del' || tag === 'strike' || /text-decoration:\s*line-through/i.test(style)

  let content = ''
  for (const child of Array.from(el.childNodes)) {
    content += traverseInlineNode(child)
  }

  if (!content.trim()) return content

  if (tag === 'a') {
    const href = el.getAttribute('href')
    if (href && href !== content) {
      return `[${content}](${href})`
    }
  }

  if (tag === 'br') {
    return '\n'
  }

  if (isCode) {
    return `\`${content.replace(/`/g, '')}\``
  }
  if (isBold) {
    return `**${content.trim()}**`
  }
  if (isItalic) {
    return `*${content.trim()}*`
  }
  if (isStrike) {
    return `~~${content.trim()}~~`
  }

  return content
}

function parseHtmlInline(html: string): string {
  if (!html) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  return traverseInlineNode(doc.body.firstChild || doc.body).trim()
}

function parseGoogleSheetsTable(body: HTMLElement): string | null {
  const table = body.querySelector('table')
  if (!table) return null

  const rows = Array.from(table.querySelectorAll('tr'))
  if (rows.length === 0) return null

  const grid: Array<
    Array<{
      text: string
      html: string
      isBold: boolean
      fontSizePt: number
      headingLevel: number | null
    }>
  > = []

  for (const tr of rows) {
    const cells = Array.from(tr.querySelectorAll('td, th'))
    if (cells.length === 0) continue

    const rowData = cells.map((td) => {
      const text = td.textContent?.trim() || ''
      const style = td.getAttribute('style') || ''
      const innerHtml = td.innerHTML

      let fontSizePt = 0
      const ptMatch = style.match(/font-size:\s*([\d.]+)pt/i)
      const pxMatch = style.match(/font-size:\s*([\d.]+)px/i)
      if (ptMatch) {
        fontSizePt = parseFloat(ptMatch[1])
      } else if (pxMatch) {
        fontSizePt = parseFloat(pxMatch[1]) * 0.75
      }

      const isBold =
        /font-weight:\s*(bold|[6-9]00)/i.test(style) ||
        td.querySelector('b, strong') !== null

      const hTag = td.querySelector('h1, h2, h3, h4, h5, h6')
      let headingLevel: number | null = null
      if (hTag) {
        headingLevel = parseInt(hTag.tagName.replace('H', ''), 10)
      }

      const hPrefixMatch = text.match(/^(?:h([1-6])|heading\s*([1-6]))[:\s\t-]+(.*)$/i)
      if (hPrefixMatch) {
        headingLevel = parseInt(hPrefixMatch[1] || hPrefixMatch[2], 10)
      } else if (/^#+\s/.test(text)) {
        headingLevel = text.match(/^#+/)?.[0].length || 2
      }

      return {
        text,
        html: innerHtml,
        isBold,
        fontSizePt,
        headingLevel,
      }
    })

    grid.push(rowData)
  }

  if (grid.length === 0) return null

  // Check for 2-column Outline (e.g. Col 1: H2/H3/Body, Col 2: Text)
  const isOutlineFormat =
    grid.length > 1 &&
    grid.every((r) => r.length <= 2) &&
    grid.some((r) => {
      const col1 = r[0]?.text.toLowerCase().trim() || ''
      return /^(h[1-6]|heading\s*[1-6]|title|intro|body|paragraph|bullet|quote|callout|cta|takeaway)$/i.test(
        col1
      )
    })

  if (isOutlineFormat) {
    const markdownLines: string[] = []
    for (const row of grid) {
      if (row.length === 0 || !row[0]) continue
      const col1 = row[0].text.toLowerCase().trim()
      const col2Node = row[1]
      const col2Text = col2Node ? parseHtmlInline(col2Node.html) : ''
      if (!col2Text) continue

      if (/^(h1|heading\s*1|title)$/i.test(col1)) {
        markdownLines.push(`# ${col2Text}\n`)
      } else if (/^(h2|heading\s*2|section)$/i.test(col1)) {
        markdownLines.push(`## ${col2Text}\n`)
      } else if (/^(h3|heading\s*3|subsection)$/i.test(col1)) {
        markdownLines.push(`### ${col2Text}\n`)
      } else if (/^(h4|heading\s*4|step)$/i.test(col1)) {
        markdownLines.push(`#### ${col2Text}\n`)
      } else if (/^(h5|heading\s*5)$/i.test(col1)) {
        markdownLines.push(`##### ${col2Text}\n`)
      } else if (/^(h6|heading\s*6)$/i.test(col1)) {
        markdownLines.push(`###### ${col2Text}\n`)
      } else if (/^(bullet|list|item)$/i.test(col1)) {
        markdownLines.push(`- ${col2Text}`)
      } else if (/^(quote|callout|takeaway)$/i.test(col1)) {
        markdownLines.push(`> ${col2Text}\n`)
      } else if (/^(cta)$/i.test(col1)) {
        markdownLines.push(`> **CTA:** ${col2Text}\n`)
      } else {
        markdownLines.push(`${col2Text}\n`)
      }
    }
    return markdownLines.join('\n')
  }

  // Check for 1-column Outline down rows
  const maxCols = Math.max(...grid.map((r) => r.length))
  if (maxCols === 1) {
    const markdownLines: string[] = []
    for (const row of grid) {
      const cell = row[0]
      if (!cell || !cell.text) continue

      const cleanInline = parseHtmlInline(cell.html)

      if (cell.headingLevel) {
        const hashes = '#'.repeat(cell.headingLevel)
        const textWithoutPrefix = cleanInline
          .replace(/^(?:h[1-6]|heading\s*[1-6])[:\s\t-]+/i, '')
          .replace(/^#+\s*/, '')
        markdownLines.push(`${hashes} ${textWithoutPrefix}\n`)
      } else if (cell.fontSizePt >= 20 || (cell.fontSizePt >= 16 && cell.isBold)) {
        markdownLines.push(`## ${cleanInline}\n`)
      } else if (cell.fontSizePt >= 13.5 && cell.isBold) {
        markdownLines.push(`### ${cleanInline}\n`)
      } else if (cell.fontSizePt >= 12 && cell.isBold && cleanInline.length < 120) {
        markdownLines.push(`#### ${cleanInline}\n`)
      } else {
        markdownLines.push(`${cleanInline}\n`)
      }
    }
    return markdownLines.join('\n')
  }

  // Multi-column Table Grid
  const tableLines: string[] = []
  const colCount = maxCols
  const headerRow = grid[0]

  if (headerRow) {
    const headerCells = Array.from({ length: colCount }, (_, i) => {
      const cell = headerRow[i]
      return cell ? parseHtmlInline(cell.html).replace(/\|/g, '\\|') : ''
    })
    tableLines.push(`| ${headerCells.join(' | ')} |`)
    tableLines.push(`| ${Array(colCount).fill('---').join(' | ')} |`)
  }

  for (let r = 1; r < grid.length; r++) {
    const row = grid[r]
    const cells = Array.from({ length: colCount }, (_, i) => {
      const cell = row[i]
      return cell ? parseHtmlInline(cell.html).replace(/\|/g, '\\|') : ''
    })
    tableLines.push(`| ${cells.join(' | ')} |`)
  }

  return tableLines.join('\n')
}

function parseStyleSheetClasses(
  doc: Document
): Map<string, { fontSizePt: number; isBold: boolean; isItalic: boolean; isCode: boolean }> {
  const map = new Map<string, { fontSizePt: number; isBold: boolean; isItalic: boolean; isCode: boolean }>()
  const styleTags = doc.querySelectorAll('style')

  for (const styleEl of Array.from(styleTags)) {
    const css = styleEl.textContent || ''
    const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g
    let match: RegExpExecArray | null
    while ((match = ruleRegex.exec(css)) !== null) {
      const className = match[1]
      const rules = match[2]

      let fontSizePt = 0
      const ptMatch = rules.match(/font-size:\s*([\d.]+)pt/i)
      const pxMatch = rules.match(/font-size:\s*([\d.]+)px/i)
      if (ptMatch) fontSizePt = parseFloat(ptMatch[1])
      else if (pxMatch) fontSizePt = parseFloat(pxMatch[1]) * 0.75

      const isBold = /font-weight:\s*(bold|[6-9]00)/i.test(rules)
      const isItalic = /font-style:\s*italic/i.test(rules)
      const isCode = /font-family:\s*['"]?(courier|consolas|monospace)/i.test(rules)

      map.set(className, { fontSizePt, isBold, isItalic, isCode })
    }
  }

  return map
}

function getElementStyleMetrics(
  el: HTMLElement,
  classMap: Map<string, any>
): { fontSizePt: number; isBold: boolean; isItalic: boolean; isCode: boolean; headingTagLevel: number | null } {
  const tag = el.tagName.toLowerCase()
  let headingTagLevel: number | null = null
  if (/^h[1-6]$/.test(tag)) {
    headingTagLevel = parseInt(tag.replace('h', ''), 10)
  }

  let fontSizePt = 0
  let isBold = tag === 'b' || tag === 'strong'
  let isItalic = tag === 'i' || tag === 'em'
  let isCode = tag === 'code' || tag === 'pre'

  const style = el.getAttribute('style') || ''
  const ptMatch = style.match(/font-size:\s*([\d.]+)pt/i)
  const pxMatch = style.match(/font-size:\s*([\d.]+)px/i)
  if (ptMatch) fontSizePt = parseFloat(ptMatch[1])
  else if (pxMatch) fontSizePt = parseFloat(pxMatch[1]) * 0.75

  if (/font-weight:\s*(bold|[6-9]00)/i.test(style)) isBold = true
  if (/font-style:\s*italic/i.test(style)) isItalic = true
  if (/font-family:\s*['"]?(courier|consolas|monospace)/i.test(style)) isCode = true

  const classes = el.className && typeof el.className === 'string' ? el.className.split(/\s+/) : []
  for (const c of classes) {
    const classData = classMap.get(c)
    if (classData) {
      if (classData.fontSizePt > fontSizePt) fontSizePt = classData.fontSizePt
      if (classData.isBold) isBold = true
      if (classData.isItalic) isItalic = true
      if (classData.isCode) isCode = true
    }
  }

  // Check children spans for Google Docs inline heading styles
  const spans = el.querySelectorAll('span')
  for (const span of Array.from(spans)) {
    const spanStyle = span.getAttribute('style') || ''
    const spanPt = spanStyle.match(/font-size:\s*([\d.]+)pt/i)
    const spanPx = spanStyle.match(/font-size:\s*([\d.]+)px/i)
    let spanFontSize = 0
    if (spanPt) spanFontSize = parseFloat(spanPt[1])
    else if (spanPx) spanFontSize = parseFloat(spanPx[1]) * 0.75

    if (spanFontSize > fontSizePt) fontSizePt = spanFontSize
    if (/font-weight:\s*(bold|[6-9]00)/i.test(spanStyle) || span.querySelector('b, strong')) {
      isBold = true
    }

    const spanClasses = span.className && typeof span.className === 'string' ? span.className.split(/\s+/) : []
    for (const c of spanClasses) {
      const classData = classMap.get(c)
      if (classData) {
        if (classData.fontSizePt > fontSizePt) fontSizePt = classData.fontSizePt
        if (classData.isBold) isBold = true
      }
    }
  }

  return { fontSizePt, isBold, isItalic, isCode, headingTagLevel }
}

function parseHtmlNodes(container: HTMLElement, classMap: Map<string, any>): string {
  const result: string[] = []

  // If container has Google Docs internal wrapper, drill into its children
  const googleDocsWrapper = container.querySelector('b[id^="docs-internal-guid"]')
  const targetRoot = googleDocsWrapper || container

  for (const child of Array.from(targetRoot.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim()
      if (text) result.push(text)
      continue
    }

    if (child.nodeType !== Node.ELEMENT_NODE) continue

    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()
    const { fontSizePt, isBold, headingTagLevel } = getElementStyleMetrics(el, classMap)

    // Heading Evaluation (Google Docs Heading 1/2/3/4 or HTML <h1-h6>)
    if (headingTagLevel === 1 || fontSizePt >= 23.5) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`# ${content}\n`)
    } else if (
      headingTagLevel === 2 ||
      (fontSizePt >= 15.2 && (isBold || fontSizePt >= 18))
    ) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`## ${content}\n`)
    } else if (headingTagLevel === 3 || (fontSizePt >= 13.2 && isBold)) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`### ${content}\n`)
    } else if (
      headingTagLevel === 4 ||
      (fontSizePt >= 11.5 && fontSizePt < 13.2 && isBold && (el.textContent?.trim().length || 0) < 140)
    ) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`#### ${content}\n`)
    } else if (headingTagLevel === 5) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`##### ${content}\n`)
    } else if (headingTagLevel === 6) {
      const content = parseHtmlInline(el.innerHTML)
      if (content) result.push(`###### ${content}\n`)
    } else if (tag === 'p' || tag === 'div') {
      const inner = parseHtmlInline(el.innerHTML)
      if (inner) {
        const hMatch = inner.match(/^(?:h([1-6])|heading\s*([1-6]))[:\s\t-]+(.*)$/i)
        if (hMatch) {
          const lvl = parseInt(hMatch[1] || hMatch[2], 10)
          result.push(`${'#'.repeat(lvl)} ${hMatch[3]}\n`)
        } else {
          result.push(`${inner}\n`)
        }
      }
    } else if (tag === 'ul') {
      const lis = Array.from(el.querySelectorAll('li'))
      for (const li of lis) {
        result.push(`- ${parseHtmlInline(li.innerHTML)}`)
      }
      result.push('')
    } else if (tag === 'ol') {
      const lis = Array.from(el.querySelectorAll('li'))
      lis.forEach((li, idx) => {
        result.push(`${idx + 1}. ${parseHtmlInline(li.innerHTML)}`)
      })
      result.push('')
    } else if (tag === 'blockquote') {
      result.push(`> ${parseHtmlInline(el.innerHTML)}\n`)
    } else if (tag === 'hr') {
      result.push('---\n')
    } else if (tag === 'table') {
      const tableMd = parseGoogleSheetsTable(el.parentElement || container)
      if (tableMd) result.push(tableMd)
    } else {
      const inner = parseHtmlNodes(el, classMap)
      if (inner) result.push(inner)
    }
  }

  return result.join('\n\n')
}

function convertPlainTextOutlineOrTable(text: string): string {
  if (!text) return ''
  const lines = text.split(/\r?\n/)
  const result: string[] = []
  const hasTabs = lines.some((l) => l.includes('\t'))

  if (!hasTabs) {
    for (const line of lines) {
      const trimmed = line.trim()
      const hMatch = trimmed.match(/^(?:h([1-6])|heading\s*([1-6]))[:\s\t-]+(.*)$/i)
      if (hMatch) {
        const lvl = parseInt(hMatch[1] || hMatch[2], 10)
        result.push(`${'#'.repeat(lvl)} ${hMatch[3]}`)
      } else {
        result.push(line)
      }
    }
    return result.join('\n')
  }

  const rows = lines.map((l) => l.split('\t').map((c) => c.trim()))
  const is2ColOutline =
    rows.length > 1 &&
    rows.every((r) => r.length <= 2) &&
    rows.some((r) =>
      /^(h[1-6]|heading\s*[1-6]|title|body|bullet|quote)$/i.test(r[0])
    )

  if (is2ColOutline) {
    for (const r of rows) {
      if (r.length === 0 || !r[0]) continue
      const col1 = r[0].toLowerCase()
      const col2 = r[1] || ''
      if (/^(h1|heading\s*1|title)$/i.test(col1)) {
        result.push(`# ${col2}\n`)
      } else if (/^(h2|heading\s*2)$/i.test(col1)) {
        result.push(`## ${col2}\n`)
      } else if (/^(h3|heading\s*3)$/i.test(col1)) {
        result.push(`### ${col2}\n`)
      } else if (/^(h4|heading\s*4)$/i.test(col1)) {
        result.push(`#### ${col2}\n`)
      } else if (/^(bullet|list)$/i.test(col1)) {
        result.push(`- ${col2}`)
      } else if (/^(quote|callout)$/i.test(col1)) {
        result.push(`> ${col2}\n`)
      } else {
        result.push(`${col2 || r[0]}\n`)
      }
    }
    return result.join('\n')
  }

  const maxCols = Math.max(...rows.map((r) => r.length))
  if (maxCols > 1) {
    const tableLines: string[] = []
    const headerRow = rows[0]
    tableLines.push(
      `| ${Array.from({ length: maxCols }, (_, i) => headerRow[i] || '').join(' | ')} |`
    )
    tableLines.push(`| ${Array(maxCols).fill('---').join(' | ')} |`)
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i]
      tableLines.push(
        `| ${Array.from({ length: maxCols }, (_, j) => r[j] || '').join(' | ')} |`
      )
    }
    return tableLines.join('\n')
  }

  return text
}

export function convertHtmlOrSheetsToMarkdown(html: string, plainText: string): string {
  if (!html || !html.trim()) {
    return convertPlainTextOutlineOrTable(plainText)
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body
    const classMap = parseStyleSheetClasses(doc)

    const isGoogleSheets =
      html.includes('google-sheets-html-origin') ||
      body.querySelector('google-sheets-html-origin') !== null ||
      (body.querySelector('table') !== null && !html.includes('docs-internal-guid'))

    if (isGoogleSheets) {
      const sheetsResult = parseGoogleSheetsTable(body)
      if (sheetsResult) return sheetsResult
    }

    const parsed = parseHtmlNodes(body, classMap).trim()
    return parsed || convertPlainTextOutlineOrTable(plainText)
  } catch (err) {
    console.error('Failed to parse clipboard HTML:', err)
    return convertPlainTextOutlineOrTable(plainText)
  }
}

interface SeoCheck {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  points: number
  maxPoints: number
}

/**
 * Real-Time On-Page SEO Intelligence Analyzer
 */
function analyzeSeo({
  title,
  metaTitle,
  slug,
  keyword,
  metaDescription,
  content,
  featuredImage,
}: {
  title: string
  metaTitle?: string
  slug: string
  keyword: string
  metaDescription: string
  content: string
  featuredImage: string
}) {
  const checks: SeoCheck[] = []
  const kw = keyword.toLowerCase().trim()
  const effectiveMetaTitle = metaTitle?.trim() || title
  const words = content.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const lowerMetaTitle = effectiveMetaTitle.toLowerCase()
  const lowerMeta = metaDescription.toLowerCase()
  const lowerSlug = slug.toLowerCase()

  // 1. Focus Keyword in Title / Meta Title
  if (!kw) {
    checks.push({
      id: 'kw-title',
      label: 'Focus Keyword in Title',
      status: 'fail',
      detail: 'Set a focus keyword to evaluate on-page optimization.',
      points: 0,
      maxPoints: 15,
    })
  } else if (lowerTitle.includes(kw) || lowerMetaTitle.includes(kw)) {
    const isEarly = lowerTitle.indexOf(kw) < 20 || lowerMetaTitle.indexOf(kw) < 20
    checks.push({
      id: 'kw-title',
      label: 'Focus Keyword in Title',
      status: 'pass',
      detail: isEarly
        ? 'Great! Keyword appears near the beginning of the title.'
        : 'Keyword is present in the title.',
      points: 15,
      maxPoints: 15,
    })
  } else {
    checks.push({
      id: 'kw-title',
      label: 'Focus Keyword in Title',
      status: 'fail',
      detail: `Your title does not contain the focus keyword "${kw}".`,
      points: 0,
      maxPoints: 15,
    })
  }

  // 2. Focus Keyword in Meta Description
  if (!kw) {
    checks.push({
      id: 'kw-meta',
      label: 'Keyword in Meta Description',
      status: 'fail',
      detail: 'Set a focus keyword to evaluate meta description.',
      points: 0,
      maxPoints: 10,
    })
  } else if (lowerMeta.includes(kw)) {
    checks.push({
      id: 'kw-meta',
      label: 'Keyword in Meta Description',
      status: 'pass',
      detail: 'Keyword is present in your Google search snippet.',
      points: 10,
      maxPoints: 10,
    })
  } else {
    checks.push({
      id: 'kw-meta',
      label: 'Keyword in Meta Description',
      status: 'warn',
      detail: 'Include your focus keyword in the meta description for higher CTR.',
      points: 0,
      maxPoints: 10,
    })
  }

  // 3. Focus Keyword in URL Slug
  if (!kw) {
    checks.push({
      id: 'kw-slug',
      label: 'Keyword in URL Slug',
      status: 'fail',
      detail: 'Focus keyword not defined.',
      points: 0,
      maxPoints: 10,
    })
  } else {
    const kwSlug = generateSlug(kw)
    if (lowerSlug.includes(kwSlug) || kw.split(' ').every((w) => lowerSlug.includes(w))) {
      checks.push({
        id: 'kw-slug',
        label: 'Keyword in URL Slug',
        status: 'pass',
        detail: 'URL slug is optimized with your target keyword.',
        points: 10,
        maxPoints: 10,
      })
    } else {
      checks.push({
        id: 'kw-slug',
        label: 'Keyword in URL Slug',
        status: 'warn',
        detail: 'Include your target keyword in the permalink slug.',
        points: 0,
        maxPoints: 10,
      })
    }
  }

  // 4. Keyword in Content Introduction (First 10%)
  if (!kw) {
    checks.push({
      id: 'kw-intro',
      label: 'Keyword in Introduction',
      status: 'fail',
      detail: 'Focus keyword not set.',
      points: 0,
      maxPoints: 10,
    })
  } else {
    const introSnippet = lowerContent.slice(0, Math.min(600, Math.floor(content.length * 0.2)))
    if (introSnippet.includes(kw)) {
      checks.push({
        id: 'kw-intro',
        label: 'Keyword in Introduction',
        status: 'pass',
        detail: 'Keyword appears early in the opening paragraph.',
        points: 10,
        maxPoints: 10,
      })
    } else {
      checks.push({
        id: 'kw-intro',
        label: 'Keyword in Introduction',
        status: 'warn',
        detail: 'Add your focus keyword in the first paragraph.',
        points: 3,
        maxPoints: 10,
      })
    }
  }

  // 5. Keyword in Subheadings (H2 / H3 / H4)
  const headings = content
    .split('\n')
    .filter((l) => l.startsWith('## ') || l.startsWith('### ') || l.startsWith('#### '))
    .map((l) => l.toLowerCase())

  if (!kw) {
    checks.push({
      id: 'kw-headings',
      label: 'Keyword in Subheadings (H2, H3, H4)',
      status: 'fail',
      detail: 'Focus keyword not set.',
      points: 0,
      maxPoints: 10,
    })
  } else {
    const inHeadings = headings.some((h) => h.includes(kw))
    if (inHeadings) {
      checks.push({
        id: 'kw-headings',
        label: 'Keyword in Subheadings (H2, H3, H4)',
        status: 'pass',
        detail: 'Keyword found in at least one H2, H3, or H4 subheading.',
        points: 10,
        maxPoints: 10,
      })
    } else {
      checks.push({
        id: 'kw-headings',
        label: 'Keyword in Subheadings (H2, H3, H4)',
        status: 'warn',
        detail: 'Use your target keyword in an H2, H3, or H4 subheading.',
        points: 2,
        maxPoints: 10,
      })
    }
  }

  // 6. Keyword Density
  if (!kw || wordCount < 50) {
    checks.push({
      id: 'kw-density',
      label: 'Keyword Density',
      status: 'warn',
      detail: 'Write more content to calculate keyword frequency.',
      points: 0,
      maxPoints: 10,
    })
  } else {
    const matches = (lowerContent.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    const density = (matches / Math.max(1, wordCount)) * 100
    if (density >= 0.7 && density <= 2.5) {
      checks.push({
        id: 'kw-density',
        label: `Keyword Density (${density.toFixed(1)}%)`,
        status: 'pass',
        detail: `Optimal keyword density (${matches} occurrences in ${wordCount} words).`,
        points: 10,
        maxPoints: 10,
      })
    } else if (density > 2.5) {
      checks.push({
        id: 'kw-density',
        label: `Keyword Density (${density.toFixed(1)}%)`,
        status: 'warn',
        detail: `Density is slightly high (${matches} occurrences). Avoid keyword stuffing.`,
        points: 5,
        maxPoints: 10,
      })
    } else {
      checks.push({
        id: 'kw-density',
        label: `Keyword Density (${density.toFixed(1)}%)`,
        status: 'warn',
        detail: `Keyword appears only ${matches} time(s). Aim for 0.8%–2.0% density.`,
        points: 4,
        maxPoints: 10,
      })
    }
  }

  // 7. Word Count & Depth
  if (wordCount >= 750) {
    checks.push({
      id: 'word-count',
      label: `Article Word Count (${wordCount} words)`,
      status: 'pass',
      detail: 'Comprehensive content length. Ideal for search depth & ranking.',
      points: 15,
      maxPoints: 15,
    })
  } else if (wordCount >= 350) {
    checks.push({
      id: 'word-count',
      label: `Article Word Count (${wordCount} words)`,
      status: 'warn',
      detail: 'Acceptable length, but aim for 750+ words for maximum topical authority.',
      points: 8,
      maxPoints: 15,
    })
  } else {
    checks.push({
      id: 'word-count',
      label: `Article Word Count (${wordCount} words)`,
      status: 'fail',
      detail: 'Content is too short (less than 350 words). Add more valuable insights.',
      points: 2,
      maxPoints: 15,
    })
  }

  // 8. Meta / Search Title Length
  const titleLen = effectiveMetaTitle.length
  if (titleLen >= 45 && titleLen <= 65) {
    checks.push({
      id: 'title-len',
      label: `SEO Title Length (${titleLen} chars)`,
      status: 'pass',
      detail: 'Optimal length for Google SERP display (no truncation).',
      points: 10,
      maxPoints: 10,
    })
  } else if (titleLen > 65) {
    checks.push({
      id: 'title-len',
      label: `SEO Title Length (${titleLen} chars)`,
      status: 'warn',
      detail: 'SEO title exceeds 65 characters and may be truncated on Google.',
      points: 5,
      maxPoints: 10,
    })
  } else {
    checks.push({
      id: 'title-len',
      label: `SEO Title Length (${titleLen} chars)`,
      status: titleLen > 0 ? 'warn' : 'fail',
      detail: 'SEO title is too short. Aim for 45–65 characters.',
      points: titleLen > 20 ? 4 : 0,
      maxPoints: 10,
    })
  }

  // 9. Meta Description Length
  const metaLen = metaDescription.length
  if (metaLen >= 120 && metaLen <= 160) {
    checks.push({
      id: 'meta-len',
      label: `Meta Description (${metaLen} chars)`,
      status: 'pass',
      detail: 'Perfect snippet length for Google search results.',
      points: 10,
      maxPoints: 10,
    })
  } else if (metaLen > 160) {
    checks.push({
      id: 'meta-len',
      label: `Meta Description (${metaLen} chars)`,
      status: 'warn',
      detail: 'Description exceeds 160 characters and will be clipped in search.',
      points: 5,
      maxPoints: 10,
    })
  } else {
    checks.push({
      id: 'meta-len',
      label: `Meta Description (${metaLen} chars)`,
      status: metaLen > 0 ? 'warn' : 'fail',
      detail: 'Write a compelling 120–160 character description.',
      points: metaLen > 50 ? 4 : 0,
      maxPoints: 10,
    })
  }

  // Total Score Calculation
  const totalEarned = checks.reduce((sum, c) => sum + c.points, 0)
  const totalPossible = checks.reduce((sum, c) => sum + c.maxPoints, 0)
  const overallScore = Math.round((totalEarned / Math.max(1, totalPossible)) * 100)

  return { checks, overallScore }
}

function AdminPostsPage() {
  const { posts, counts } = Route.useLoaderData()
  const { status = 'all', q = '' } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(q)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mutatingId, setMutatingId] = useState<string | null>(null)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [showBeginnerTips, setShowBeginnerTips] = useState(true)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editorTitle, setEditorTitle] = useState('')
  const [editorMetaTitle, setEditorMetaTitle] = useState('')
  const [editorSlug, setEditorSlug] = useState('')
  const [editorKeyword, setEditorKeyword] = useState('')
  const [editorCategory, setEditorCategory] = useState('Local SEO & GBP')
  const [editorTags, setEditorTags] = useState('')
  const [editorSummary, setEditorSummary] = useState('')
  const [editorExcerpt, setEditorExcerpt] = useState('')
  const [editorMetaDesc, setEditorMetaDesc] = useState('')
  const [editorCoverImage, setEditorCoverImage] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [editorStatus, setEditorStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [editorScheduledAt, setEditorScheduledAt] = useState('')
  const [editorSchemaType, setEditorSchemaType] = useState('BlogPosting')
  const [editorCustomSchema, setEditorCustomSchema] = useState('')
  const [editorError, setEditorError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [previewTab, setPreviewTab] = useState<'write' | 'preview' | 'seo' | 'schema'>('write')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [isSidebarSettingsOpen, setIsSidebarSettingsOpen] = useState(true)

  // Custom CTA Section State
  const [showCtaSettings, setShowCtaSettings] = useState(false)
  const [sidebarCtaTitle, setSidebarCtaTitle] = useState('')
  const [sidebarCtaText, setSidebarCtaText] = useState('')
  const [sidebarCtaButtonText, setSidebarCtaButtonText] = useState('')
  const [sidebarCtaButtonUrl, setSidebarCtaButtonUrl] = useState('')
  const [bottomCtaTitle, setBottomCtaTitle] = useState('')
  const [bottomCtaText, setBottomCtaText] = useState('')
  const [bottomCtaButtonText, setBottomCtaButtonText] = useState('')
  const [bottomCtaButtonUrl, setBottomCtaButtonUrl] = useState('')

  // Quick Insert Modals
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [insertImageUrl, setInsertImageUrl] = useState('')
  const [insertImageAlt, setInsertImageAlt] = useState('')
  const [isTableModalOpen, setIsTableModalOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [codeLang, setCodeLang] = useState('typescript')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | 'editor' | null>(null)

  // Calculate high-level stats
  const totalPosts = counts.all
  const publishedPosts = counts.published
  const draftPosts = counts.draft
  const scheduledPosts = counts.scheduled || 0
  const totalWords = posts.reduce(
    (acc, p) => acc + (p.content ? p.content.trim().split(/\s+/).filter(Boolean).length : 0),
    0
  )

  // Live SEO Analysis
  const seoReport = useMemo(() => {
    return analyzeSeo({
      title: editorTitle,
      metaTitle: editorMetaTitle,
      slug: editorSlug,
      keyword: editorKeyword,
      metaDescription: editorMetaDesc,
      content: editorContent,
      featuredImage: editorCoverImage,
    })
  }, [editorTitle, editorMetaTitle, editorSlug, editorKeyword, editorMetaDesc, editorContent, editorCoverImage])

  const handleStatusTab = (newStatus: 'all' | 'published' | 'draft' | 'scheduled') => {
    navigate({
      to: '.',
      search: {
        status: newStatus,
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '.',
      search: {
        status,
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await router.invalidate()
    setIsRefreshing(false)
    addToast('CMS Refreshed', 'Articles list updated.')
  }

  const openNewPostModal = () => {
    setEditingPost(null)
    setEditorTitle('')
    setEditorMetaTitle('')
    setEditorSlug('')
    setEditorKeyword('')
    setEditorCategory('Local SEO & GBP')
    setEditorTags('')
    setEditorSummary('')
    setEditorExcerpt('')
    setEditorMetaDesc('')
    setEditorCoverImage('')
    setEditorContent('')
    setEditorStatus('draft')
    setEditorScheduledAt('')
    setEditorSchemaType('BlogPosting')
    setEditorCustomSchema('')
    setSidebarCtaTitle('')
    setSidebarCtaText('')
    setSidebarCtaButtonText('')
    setSidebarCtaButtonUrl('')
    setBottomCtaTitle('')
    setBottomCtaText('')
    setBottomCtaButtonText('')
    setBottomCtaButtonUrl('')
    setShowCtaSettings(false)
    setEditorError(null)
    setSlugManuallyEdited(false)
    setPreviewTab('write')
    setIsSidebarSettingsOpen(true)
    setIsEditorOpen(true)
  }

  const openEditPostModal = (post: Post) => {
    setEditingPost(post)
    setEditorTitle(post.title)
    setEditorMetaTitle(post.metaTitle || '')
    setEditorSlug(post.slug)
    setEditorKeyword(post.keyword || '')
    setEditorCategory(post.category || 'Local SEO & GBP')
    setEditorTags(post.tags || '')
    setEditorSummary(post.summary || '')
    setEditorExcerpt(post.excerpt || '')
    setEditorMetaDesc(post.metaDescription || '')
    setEditorCoverImage(post.featuredImage || '')
    setEditorContent(post.content || '')
    setEditorStatus((post.status as 'draft' | 'published' | 'scheduled') || 'draft')
    setEditorScheduledAt(
      post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ''
    )
    setEditorSchemaType(post.schemaType || 'BlogPosting')
    setEditorCustomSchema(post.customSchema || '')
    setSidebarCtaTitle(post.sidebarCtaTitle || '')
    setSidebarCtaText(post.sidebarCtaText || '')
    setSidebarCtaButtonText(post.sidebarCtaButtonText || '')
    setSidebarCtaButtonUrl(post.sidebarCtaButtonUrl || '')
    setBottomCtaTitle(post.bottomCtaTitle || '')
    setBottomCtaText(post.bottomCtaText || '')
    setBottomCtaButtonText(post.bottomCtaButtonText || '')
    setBottomCtaButtonUrl(post.bottomCtaButtonUrl || '')
    setShowCtaSettings(
      Boolean(
        post.sidebarCtaTitle ||
          post.sidebarCtaText ||
          post.bottomCtaTitle ||
          post.bottomCtaText
      )
    )
    setEditorError(null)
    setSlugManuallyEdited(true)
    setPreviewTab('write')
    setIsSidebarSettingsOpen(true)
    setIsEditorOpen(true)
  }

  const handleTitleChange = (val: string) => {
    setEditorTitle(val)
    if (!slugManuallyEdited) {
      setEditorSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (val: string) => {
    setEditorSlug(generateSlug(val))
    setSlugManuallyEdited(true)
  }

  // Markdown formatting shortcuts
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-markdown-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)
    const replacement = prefix + (selected || 'text') + suffix
    const updated = text.substring(0, start) + replacement + text.substring(end)

    setEditorContent(updated)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4))
    }, 50)
  }

  const handleInsertImage = () => {
    if (!insertImageUrl.trim()) return
    const alt = insertImageAlt.trim() || 'Image'
    insertMarkdown(`\n![${alt}](${insertImageUrl.trim()})\n`)
    setInsertImageUrl('')
    setInsertImageAlt('')
    setIsImageModalOpen(false)
    addToast('Image Inserted', 'Image code added to editor.')
  }

  const handleInsertTable = () => {
    let tableMd = '\n'
    const headers = Array.from({ length: tableCols }, (_, i) => `Header ${i + 1}`).join(' | ')
    const dividers = Array.from({ length: tableCols }, () => '---').join(' | ')
    tableMd += `| ${headers} |\n| ${dividers} |\n`
    for (let r = 0; r < tableRows; r++) {
      const row = Array.from({ length: tableCols }, (_, i) => `Row ${r + 1} Col ${i + 1}`).join(' | ')
      tableMd += `| ${row} |\n`
    }
    tableMd += '\n'
    insertMarkdown(tableMd)
    setIsTableModalOpen(false)
    addToast('Table Inserted', 'Markdown table template generated.')
  }

  const handleInsertCode = () => {
    insertMarkdown(`\n\`\`\`${codeLang}\n${codeSnippet || '// code here'}\n\`\`\`\n`)
    setCodeSnippet('')
    setIsCodeModalOpen(false)
    addToast('Code Block Inserted', `Formatted for ${codeLang}.`)
  }

  const handleEditorPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html')
    const plainText = e.clipboardData.getData('text/plain')

    // Detect HTML formatting, Google Sheets tables, tab-separated rows, or explicit heading markers
    if (
      html ||
      plainText.includes('\t') ||
      /^(?:h[1-6]|heading\s*[1-6])[:\s\t-]/i.test(plainText) ||
      /^#+\s/m.test(plainText)
    ) {
      const converted = convertHtmlOrSheetsToMarkdown(html, plainText)
      if (converted && converted.trim() !== plainText.trim()) {
        e.preventDefault()
        const textarea = e.currentTarget
        const start = textarea.selectionStart || 0
        const end = textarea.selectionEnd || 0
        const currentValue = editorContent
        const before = currentValue.substring(0, start)
        const after = currentValue.substring(end)

        const separatorBefore = before.length > 0 && !before.endsWith('\n') ? '\n\n' : ''
        const insertion = `${separatorBefore}${converted}`
        const newValue = before + insertion + after

        setEditorContent(newValue)
        addToast(
          'Google Sheets / Rich Text Converted',
          'Retained headings (H2, H3, H4) and converted sheets formatting to Markdown.'
        )

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertion.length
          textarea.focus()
        }, 0)
      }
    }
  }

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditorError(null)

    if (!editorTitle.trim()) {
      setEditorError('Title is required')
      return
    }
    if (!editorSlug.trim()) {
      setEditorError('Slug is required')
      return
    }
    if (!editorContent.trim()) {
      setEditorError('Article content is required')
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        title: editorTitle.trim(),
        metaTitle: editorMetaTitle.trim() || undefined,
        slug: editorSlug.trim(),
        keyword: editorKeyword.trim() || undefined,
        category: editorCategory.trim() || undefined,
        tags: editorTags.trim() || undefined,
        summary: editorSummary.trim() || undefined,
        excerpt: editorExcerpt.trim() || undefined,
        metaDescription: editorMetaDesc.trim() || undefined,
        featuredImage: editorCoverImage.trim() || undefined,
        content: editorContent.trim(),
        status: editorStatus,
        scheduledAt: editorScheduledAt ? new Date(editorScheduledAt).toISOString() : null,
        schemaType: editorSchemaType,
        customSchema: editorCustomSchema.trim() || undefined,
        sidebarCtaTitle: sidebarCtaTitle.trim() || undefined,
        sidebarCtaText: sidebarCtaText.trim() || undefined,
        sidebarCtaButtonText: sidebarCtaButtonText.trim() || undefined,
        sidebarCtaButtonUrl: sidebarCtaButtonUrl.trim() || undefined,
        bottomCtaTitle: bottomCtaTitle.trim() || undefined,
        bottomCtaText: bottomCtaText.trim() || undefined,
        bottomCtaButtonText: bottomCtaButtonText.trim() || undefined,
        bottomCtaButtonUrl: bottomCtaButtonUrl.trim() || undefined,
      }

      if (editingPost) {
        await updatePostServerFn({
          data: {
            id: editingPost.id,
            ...payload,
          },
        })
        addToast('Article Updated', `"${editorTitle}" saved successfully.`)
      } else {
        await createPostServerFn({
          data: payload,
        })
        addToast(
          editorStatus === 'published' ? 'Article Published Live!' : 'Article Created',
          `"${editorTitle}" is ready.`
        )
      }

      setIsEditorOpen(false)
      await router.invalidate()
    } catch (err: any) {
      setEditorError(err.message || 'Failed to save post. Ensure the slug is unique.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuickStatusChange = async (
    post: Post,
    newStatus: 'draft' | 'published' | 'scheduled'
  ) => {
    try {
      setMutatingId(post.id)
      await updatePostServerFn({
        data: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          keyword: post.keyword || undefined,
          category: post.category || undefined,
          tags: post.tags || undefined,
          metaDescription: post.metaDescription || undefined,
          featuredImage: post.featuredImage || undefined,
          status: newStatus,
          scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString() : null,
          schemaType: post.schemaType || undefined,
          customSchema: post.customSchema || undefined,
          sidebarCtaTitle: post.sidebarCtaTitle || undefined,
          sidebarCtaText: post.sidebarCtaText || undefined,
          sidebarCtaButtonText: post.sidebarCtaButtonText || undefined,
          sidebarCtaButtonUrl: post.sidebarCtaButtonUrl || undefined,
          bottomCtaTitle: post.bottomCtaTitle || undefined,
          bottomCtaText: post.bottomCtaText || undefined,
          bottomCtaButtonText: post.bottomCtaButtonText || undefined,
          bottomCtaButtonUrl: post.bottomCtaButtonUrl || undefined,
        },
      })
      await router.invalidate()
      addToast(
        newStatus === 'published' ? 'Article is now Live!' : 'Moved to Draft',
        `"${post.title}" status updated.`
      )
    } catch (err) {
      console.error('Failed to update status:', err)
      addToast('Status Change Failed', 'Please try again.', 'error')
    } finally {
      setMutatingId(null)
    }
  }

  const confirmDeletePost = async () => {
    if (!postToDelete) return
    try {
      setMutatingId(postToDelete.id)
      await deletePostServerFn({ data: { id: postToDelete.id } })
      setPostToDelete(null)
      await router.invalidate()
      addToast('Article Deleted', 'The article was permanently removed.')
    } catch (err) {
      console.error('Failed to delete post:', err)
      addToast('Delete Failed', 'Could not delete article.', 'error')
    } finally {
      setMutatingId(null)
    }
  }

  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return 'Unpublished'
    const d = new Date(dateInput)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Soft Ambient Light Glow Matching Homepage */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <AdminNav
        activeTab="posts"
        title="Blog CMS & SEO Studio"
        description="Publish, schedule, categorize, and optimize articles with real-time SEO intelligence scoring and rich Markdown."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={openNewPostModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </button>
          </div>
        }
      />

      {/* Beginner Friendly Quick Workflow Guide Banner (Dismissible / Collapsible) */}
      <div className="rounded-3xl border border-rose-200/80 dark:border-rose-950/60 bg-gradient-to-br from-rose-50/60 via-white to-slate-50 dark:from-rose-950/20 dark:via-[#111827] dark:to-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Beginner's 4-Step Publishing Workflow
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowBeginnerTips(!showBeginnerTips)}
            className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <span>{showBeginnerTips ? 'Hide Guide' : 'Show Guide'}</span>
            {showBeginnerTips ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showBeginnerTips && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-rose-100 dark:border-rose-900/30 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono text-[10px]">
                  1
                </span>
                <span>Title & Category</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Enter your headline, pick a category, and set a focus keyword for Google rank tracking.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                  2
                </span>
                <span>Rich Toolbar</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Use 1-click toolbar buttons to quickly insert images, tables, code, and headings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono text-[10px]">
                  3
                </span>
                <span>Live SEO Gauge</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Aim for a green score (80+) on the SEO tab to ensure full Google search visibility.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono text-[10px]">
                  4
                </span>
                <span>Publish or Schedule</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Hit <strong>"Publish Live"</strong> to go live immediately, or schedule an auto-release date.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Bento Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Total Articles
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalPosts}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            All CMS entries
          </div>
        </div>

        {/* Live Published */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Published Live
            </span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {publishedPosts}
          </div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
            Active in public index
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-indigo-500/30 dark:border-indigo-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Scheduled
            </span>
            <CalendarClock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {scheduledPosts}
          </div>
          <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80 font-medium">
            Auto-publishing pipeline
          </div>
        </div>

        {/* Total Content Volume */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Content Volume
            </span>
            <BookOpen className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalWords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Total words written
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('published')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'published'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Published</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
              {counts.published}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('scheduled')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'scheduled'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Scheduled</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
              {counts.scheduled || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('draft')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'draft'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Drafts</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold">
              {counts.draft}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md flex items-center"
        >
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles by title, keyword, category, tags..."
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                navigate({
                  to: '.',
                  search: { status, q: undefined },
                })
              }}
              className="absolute right-16 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No articles found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {q
                ? `No posts matched your query "${q}". Try clearing the search.`
                : `There are currently no posts under the "${status}" filter.`}
            </p>
          </div>
          <button
            type="button"
            onClick={openNewPostModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Article</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isMutating = mutatingId === post.id
            const isPublished = post.status === 'published'
            const isScheduled = post.status === 'scheduled'
            const readingTime = calculateReadingTime(post.content || '')
            const hasCustomCta = Boolean(post.sidebarCtaTitle || post.bottomCtaTitle)
            const tagList = (post.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)

            return (
              <div
                key={post.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-4 shadow-xs hover:shadow-md ${
                  isPublished
                    ? 'border-slate-200/80 dark:border-slate-800'
                    : isScheduled
                      ? 'border-indigo-500/40 dark:border-indigo-500/30'
                      : 'border-amber-500/40 dark:border-amber-500/30'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Header Row: Status, Category, Keywords, Dates, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                        isPublished
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : isScheduled
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-500'
                            : isScheduled
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                        }`}
                      />
                      <span className="capitalize">{post.status}</span>
                    </span>

                    {/* Category Badge */}
                    {post.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        <FolderOpen className="w-3 h-3 text-rose-500" />
                        <span>{post.category}</span>
                      </span>
                    )}

                    {/* Target Keyword Badge */}
                    {post.keyword && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                        <Key className="w-3 h-3" />
                        <span>{post.keyword}</span>
                      </span>
                    )}

                    {/* Custom CTA Indicator */}
                    {hasCustomCta && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50">
                        <Megaphone className="w-3 h-3" />
                        <span>Custom CTA</span>
                      </span>
                    )}

                    {/* Reading Time */}
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{readingTime} min read</span>
                    </span>

                    {/* Date / Scheduled Date */}
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {isScheduled && post.scheduledAt
                          ? `Scheduled: ${formatDate(post.scheduledAt)}`
                          : formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Quick Publish / Unpublish Switcher */}
                    {isPublished ? (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(post, 'draft')}
                        title="Unpublish and revert to Draft"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900 transition cursor-pointer"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(post, 'published')}
                        title="Publish Live immediately"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 transition cursor-pointer"
                      >
                        Publish Now
                      </button>
                    )}

                    {isPublished && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditPostModal(post)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Article Info */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition">
                    <button
                      type="button"
                      onClick={() => openEditPostModal(post)}
                      className="text-left cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span>URL Slug:</span>
                    <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                      /blog/{post.slug}
                    </span>

                    {/* Tags Badges */}
                    {tagList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                        {tagList.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {(post.excerpt || post.summary || post.metaDescription) && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {post.excerpt || post.summary || post.metaDescription}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (Replaces browser confirm) */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={confirmDeletePost}
        title="Delete Blog Article"
        description={
          postToDelete ? (
            <span>
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white">
                "{postToDelete.title}"
              </strong>
              ? This action cannot be undone and will remove the live permalink.
            </span>
          ) : null
        }
        confirmText="Delete Permanently"
        variant="danger"
        isLoading={Boolean(mutatingId)}
      />

      {/* Modern Full-Featured Post Editor & SEO Studio Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          <div className="w-full max-w-[1440px] h-[95vh] max-h-[95vh] bg-white dark:bg-[#0c111d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 dark:bg-[#111827]/90 backdrop-blur-md shrink-0">
              {/* Left: Article info & Status */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-[280px] md:max-w-[380px]">
                      {editorTitle || 'Untitled Article'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                        editorStatus === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : editorStatus === 'scheduled'
                            ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {editorStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>{editorContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span>{calculateReadingTime(editorContent)} min read</span>
                  </div>
                </div>
              </div>

              {/* Center: Segmented Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/90 border border-slate-300/40 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setPreviewTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'write'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'preview'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('seo')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'seo'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      seoReport.overallScore >= 80
                        ? 'bg-emerald-500'
                        : seoReport.overallScore >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                  />
                  <span>SEO ({seoReport.overallScore}/100)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('schema')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'schema'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CodeXml className="w-3.5 h-3.5" />
                  <span>Schema</span>
                </button>
              </div>

              {/* Right: Settings Toggle & Actions */}
              <div className="flex items-center gap-2">
                {previewTab === 'write' && (
                  <button
                    type="button"
                    onClick={() => setIsSidebarSettingsOpen(!isSidebarSettingsOpen)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSidebarSettingsOpen
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                    title={isSidebarSettingsOpen ? 'Collapse Metadata Inspector' : 'Open Metadata Inspector'}
                  >
                    <Sliders className="w-3.5 h-3.5 text-rose-500" />
                    <span className="hidden sm:inline">{isSidebarSettingsOpen ? 'Hide Panel' : 'Settings'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSavePost}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {editingPost
                          ? 'Save Changes'
                          : editorStatus === 'published'
                            ? 'Publish Live'
                            : editorStatus === 'scheduled'
                              ? 'Schedule'
                              : 'Save Draft'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {editorError && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-between shrink-0">
                <span>{editorError}</span>
                <button type="button" onClick={() => setEditorError(null)} className="p-1 hover:opacity-75">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 1: WRITE MODE (2-Column Studio: Canvas + Inspector)  */}
            {/* ========================================================= */}
            {previewTab === 'write' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
                {/* Left Column: Dedicated Writing Studio Canvas */}
                <div
                  className={`${
                    isSidebarSettingsOpen ? 'lg:col-span-8' : 'lg:col-span-12'
                  } flex flex-col min-h-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c111d] overflow-hidden`}
                >
                  {/* Article Title & Permalink Pinned Header */}
                  <div className="p-6 pb-3 space-y-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                    <input
                      type="text"
                      required
                      value={editorTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Article Title (H1 Heading)..."
                      className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-600 px-0 leading-tight"
                    />

                    {/* Permalink & Quick Category Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
                        <span>/blog/</span>
                        <input
                          type="text"
                          required
                          value={editorSlug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="article-slug"
                          className="font-mono text-slate-900 dark:text-white font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-xs w-48 sm:w-64 truncate"
                        />
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200/60 dark:border-rose-900/40 text-[11px]">
                        {editorCategory}
                      </span>
                    </div>
                  </div>

                  {/* Markdown Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 px-4 py-2 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 text-xs">
                    {/* Headings */}
                    <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-2">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('## ', '\n')}
                        className="px-2 py-1 rounded-lg font-bold hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Heading 2 (H2)"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('### ', '\n')}
                        className="px-2 py-1 rounded-lg font-bold hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Heading 3 (H3)"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('#### ', '\n')}
                        className="px-2 py-1 rounded-lg font-bold hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Heading 4 (H4)"
                      >
                        H4
                      </button>
                    </div>

                    {/* Inline Formatting */}
                    <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-2">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('**', '**')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('*', '*')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('`', '`')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer font-mono font-bold"
                        title="Inline Code"
                      >
                        &lt;/&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('~~', '~~')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer line-through font-bold text-xs"
                        title="Strikethrough"
                      >
                        S
                      </button>
                    </div>

                    {/* Structural Elements */}
                    <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-2">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('- ', '\n')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('1. ', '\n')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('> ', '\n')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Quote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('\n---\n')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Horizontal Divider"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Media & Inserters */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('editor')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold cursor-pointer shadow-2xs border border-rose-200/80 dark:border-rose-900/50"
                        title="Choose and insert from Cloud Storage / Media Library"
                      >
                        <FolderOpen className="w-3 h-3" />
                        <span>Media Library</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Insert Image by URL"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsTableModalOpen(true)}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Insert Table"
                      >
                        <TableIcon className="w-3.5 h-3.5 text-cyan-500" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCodeModalOpen(true)}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Insert Code Block"
                      >
                        <Code className="w-3.5 h-3.5 text-indigo-500" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertMarkdown('[', '](https://...)')}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Insert Link"
                      >
                        <Link2 className="w-3.5 h-3.5 text-emerald-500" />
                      </button>

                      <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-700 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Sheets / Doc Paste Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Spacious Markdown Canvas Textarea */}
                  <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto">
                    <textarea
                      id="post-markdown-editor"
                      required
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      onPaste={handleEditorPaste}
                      placeholder="Write or paste your article here...&#10;&#10;✓ Direct Paste from Google Sheets & Docs retains H2, H3, H4, bold, lists, and tables&#10;✓ Use ## for major sections (auto-indexed in Table of Contents)&#10;✓ Click 'Media Library' to insert photos and documents with 1-click."
                      className="w-full h-full min-h-[450px] font-mono text-xs sm:text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-none leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Right Column: Metadata & Inspector Sidebar */}
                {isSidebarSettingsOpen && (
                  <div className="lg:col-span-4 overflow-y-auto p-5 space-y-5 bg-slate-50/70 dark:bg-[#090d16] border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                    {/* Card 1: Publishing & Categorization */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        <FolderOpen className="w-3.5 h-3.5 text-rose-500" />
                        <span>Publishing & Taxonomy</span>
                      </div>

                      {/* Status */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                          Status
                        </label>
                        <select
                          value={editorStatus}
                          onChange={(e) =>
                            setEditorStatus(e.target.value as 'draft' | 'published' | 'scheduled')
                          }
                          className="w-full px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="draft">📁 Draft (Private)</option>
                          <option value="published">🚀 Published (Live to Public)</option>
                          <option value="scheduled">⏰ Scheduled (Auto-Release)</option>
                        </select>
                      </div>

                      {/* Scheduled DateTime */}
                      {editorStatus === 'scheduled' && (
                        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5 animate-in fade-in">
                          <label className="text-xs font-mono font-bold uppercase text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Auto-Release Timestamp</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={editorScheduledAt}
                            onChange={(e) => setEditorScheduledAt(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-mono border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                          Category
                        </label>
                        <select
                          value={editorCategory}
                          onChange={(e) => setEditorCategory(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="Local SEO & GBP">📍 Local SEO & GBP</option>
                          <option value="Websites & Care">⚡ Websites & Care Plans</option>
                          <option value="Systems & Automation">🤖 Systems & Automation</option>
                          <option value="Conversion & CRO">📈 Conversion & CRO</option>
                          <option value="Technical SEO">🔍 Technical SEO & Schema</option>
                          <option value="Client Case Studies">🏆 Client Case Studies</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span>Tags (Comma-separated)</span>
                          <Tag className="w-3 h-3 text-slate-400" />
                        </label>
                        <input
                          type="text"
                          value={editorTags}
                          onChange={(e) => setEditorTags(e.target.value)}
                          placeholder="Google Maps, Ranking, Speed"
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      {/* Featured Hero Cover Image */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                            Featured Hero Cover Image
                          </label>
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget('cover')}
                            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Media Library</span>
                          </button>
                        </div>

                        {editorCoverImage && (
                          <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
                            <img src={editorCoverImage} alt="Cover" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setEditorCoverImage('')}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-rose-600 transition cursor-pointer"
                              title="Remove cover"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <input
                          type="text"
                          value={editorCoverImage}
                          onChange={(e) => setEditorCoverImage(e.target.value)}
                          placeholder="Image URL or choose from library..."
                          className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    {/* Card 2: Excerpts & On-Page Summary (SEPARATED) */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Excerpts & Key Summary</span>
                      </div>

                      {/* Thumbnail / Card Excerpt */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                            Thumbnail Card Excerpt
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {editorExcerpt.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={editorExcerpt}
                          onChange={(e) => setEditorExcerpt(e.target.value)}
                          placeholder="Short 1-2 sentence preview text used on blog index cards and thumbnails..."
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400">
                          Appears on blog cards (/blog) and related playbook grids.
                        </p>
                      </div>

                      {/* On-Page Key Summary Callout */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1 text-rose-600 dark:text-rose-400">
                            <Zap className="w-3 h-3 text-rose-500" />
                            <span>On-Page Key Summary (Callout)</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {editorSummary.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={editorSummary}
                          onChange={(e) => setEditorSummary(e.target.value)}
                          placeholder="Key takeaways or executive summary displayed in a prominent callout box at the top of the article page..."
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400">
                          Renders inside the ⚡ KEY SUMMARY box at the top of the article. Leave blank to hide the box.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Google SEO & Search Snippet */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Google Search & Snippet</span>
                      </div>

                      {/* Target Keyword */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                          Focus Target Keyword
                        </label>
                        <input
                          type="text"
                          value={editorKeyword}
                          onChange={(e) => setEditorKeyword(e.target.value)}
                          placeholder="e.g. Local SEO mistakes"
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      {/* SEO Meta Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                            SEO Meta Title
                          </label>
                          <span
                            className={`text-[10px] font-mono ${
                              (editorMetaTitle || editorTitle).length >= 45 && (editorMetaTitle || editorTitle).length <= 60
                                ? 'text-emerald-500 font-bold'
                                : (editorMetaTitle || editorTitle).length > 60
                                  ? 'text-amber-500 font-bold'
                                  : 'text-slate-400'
                            }`}
                          >
                            {(editorMetaTitle || editorTitle).length}/60 chars (45–60 target)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editorMetaTitle}
                          onChange={(e) => setEditorMetaTitle(e.target.value)}
                          placeholder={`Defaults to "${editorTitle || 'Article Title'}"`}
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                            Meta Description (Google Snippet)
                          </label>
                          <span
                            className={`text-[10px] font-mono ${
                              editorMetaDesc.length >= 120 && editorMetaDesc.length <= 160
                                ? 'text-emerald-500 font-bold'
                                : editorMetaDesc.length > 160
                                  ? 'text-amber-500 font-bold'
                                  : 'text-slate-400'
                            }`}
                          >
                            {editorMetaDesc.length}/160 chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={editorMetaDesc}
                          onChange={(e) => setEditorMetaDesc(e.target.value)}
                          placeholder="Summarize the article in 1-2 compelling sentences with focus keyword for Google search results..."
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                        />
                      </div>

                      {/* Mini Live SERP Snippet Preview */}
                      <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          https://builtbymiguel.net/blog/{editorSlug || 'slug'}
                        </div>
                        <div className="text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline truncate">
                          {editorMetaTitle || editorTitle
                            ? `${editorMetaTitle || editorTitle} | built by Miguel`
                            : 'Article Title | built by Miguel'}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 leading-snug">
                          {editorMetaDesc || 'Write a meta description to see how it appears on Google...'}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Custom CTAs (Collapsible) */}
                    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowCtaSettings(!showCtaSettings)}
                        className="w-full p-4 flex items-center justify-between text-xs font-mono font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-3.5 h-3.5 text-rose-500" />
                          <span>Custom Conversion CTAs</span>
                        </div>
                        {showCtaSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showCtaSettings && (
                        <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                          {/* Sidebar CTA */}
                          <div className="space-y-2 pt-2">
                            <span className="font-bold text-slate-900 dark:text-white">Sidebar CTA</span>
                            <input
                              type="text"
                              value={sidebarCtaTitle}
                              onChange={(e) => setSidebarCtaTitle(e.target.value)}
                              placeholder="Sidebar Heading"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                            />
                            <input
                              type="text"
                              value={sidebarCtaText}
                              onChange={(e) => setSidebarCtaText(e.target.value)}
                              placeholder="Sidebar Subtitle"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={sidebarCtaButtonText}
                                onChange={(e) => setSidebarCtaButtonText(e.target.value)}
                                placeholder="Button Text"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                              />
                              <input
                                type="text"
                                value={sidebarCtaButtonUrl}
                                onChange={(e) => setSidebarCtaButtonUrl(e.target.value)}
                                placeholder="Button Link URL"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                              />
                            </div>
                          </div>

                          {/* Bottom CTA */}
                          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-900 dark:text-white">Bottom Banner CTA</span>
                            <input
                              type="text"
                              value={bottomCtaTitle}
                              onChange={(e) => setBottomCtaTitle(e.target.value)}
                              placeholder="Banner Heading"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                            />
                            <input
                              type="text"
                              value={bottomCtaText}
                              onChange={(e) => setBottomCtaText(e.target.value)}
                              placeholder="Banner Subtitle"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={bottomCtaButtonText}
                                onChange={(e) => setBottomCtaButtonText(e.target.value)}
                                placeholder="Button Text"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                              />
                              <input
                                type="text"
                                value={bottomCtaButtonUrl}
                                onChange={(e) => setBottomCtaButtonUrl(e.target.value)}
                                placeholder="Button Link URL"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: LIVE PREVIEW MODE                                  */}
            {/* ========================================================= */}
            {previewTab === 'preview' && (
              <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10 bg-slate-50 dark:bg-[#0c111d]">
                <div className="max-w-4xl mx-auto space-y-8 bg-white dark:bg-[#111827] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {/* Category & Meta */}
                  <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/50">
                        {editorCategory}
                      </span>
                      {editorKeyword && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          Focus: {editorKeyword}
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{calculateReadingTime(editorContent)} min read</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {editorTitle || 'Untitled Article'}
                    </h1>
                  </div>

                  {/* Featured Image */}
                  {editorCoverImage && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 aspect-16/9 bg-slate-100 dark:bg-slate-800">
                      <img src={editorCoverImage} alt={editorTitle} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Key Summary Callout */}
                  {editorSummary && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-rose-950/20 dark:via-slate-900/60 dark:to-slate-900/30 border border-rose-100 dark:border-rose-900/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 text-rose-500" />
                        <span>Key Summary</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {editorSummary}
                      </p>
                    </div>
                  )}

                  {/* Rendered Markdown Body */}
                  <div className="pt-2">
                    {editorContent ? (
                      <AdminMarkdownRenderer content={editorContent} />
                    ) : (
                      <p className="text-slate-400 italic">No article content entered yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: ON-PAGE SEO INTELLIGENCE SCORECARD                 */}
            {/* ========================================================= */}
            {previewTab === 'seo' && (
              <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 bg-slate-50 dark:bg-[#0c111d]">
                <div className="max-w-4xl mx-auto space-y-6 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {/* Meter Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-rose-500" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          On-Page SEO Intelligence Score
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluates focus keyword optimization, SERP title & snippet lengths, keyword density, and search intent.
                      </p>
                    </div>

                    <div
                      className={`text-3xl font-extrabold font-mono px-5 py-2.5 rounded-2xl border shrink-0 ${
                        seoReport.overallScore >= 80
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-300 dark:border-emerald-800'
                          : seoReport.overallScore >= 50
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {seoReport.overallScore}/100
                    </div>
                  </div>

                  {/* Google Search SERP Snippet Preview */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Google Search SERP Preview
                    </span>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 font-mono truncate">
                        https://builtbymiguel.net/blog/{editorSlug || 'your-article-slug'}
                      </div>
                      <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer">
                        {editorMetaTitle || editorTitle
                          ? `${editorMetaTitle || editorTitle} | built by Miguel`
                          : 'Article SEO Title | built by Miguel'}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {editorMetaDesc || 'Write a meta description to see how it appears in Google search results...'}
                      </div>
                    </div>
                  </div>

                  {/* Checklist of SEO Checks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                      Actionable SEO Recommendations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {seoReport.checks.map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start gap-3 shadow-2xs"
                        >
                          {c.status === 'pass' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                          {c.status === 'warn' && (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          {c.status === 'fail' && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {c.label}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {c.detail}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: SCHEMA MARKUP & JSON-LD                            */}
            {/* ========================================================= */}
            {previewTab === 'schema' && (
              <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 bg-slate-50 dark:bg-[#0c111d]">
                <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CodeXml className="w-4 h-4 text-rose-500" />
                      <span>Schema.org Structured Data & Rich Results</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure Google rich results structured data. Auto-generates standard JSON-LD or inject custom FAQ/TechArticle schema.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                        Primary Schema Type
                      </label>
                      <select
                        value={editorSchemaType}
                        onChange={(e) => setEditorSchemaType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="BlogPosting">BlogPosting (Standard Blog Article)</option>
                        <option value="TechArticle">TechArticle (Technical Guide / Code)</option>
                        <option value="HowTo">HowTo (Step-by-Step Playbook)</option>
                        <option value="FAQPage">FAQPage (Q&A FAQ Rich Result)</option>
                        <option value="Article">Article (General Editorial)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                        Publisher Entity
                      </label>
                      <input
                        type="text"
                        disabled
                        value="built by Miguel (Miguel Umbac)"
                        className="w-full px-4 py-2.5 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                      Custom Additional JSON-LD Schema (Optional)
                    </label>
                    <textarea
                      rows={6}
                      value={editorCustomSchema}
                      onChange={(e) => setEditorCustomSchema(e.target.value)}
                      placeholder='{ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...] }'
                      className="w-full px-4 py-3 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Inserter Modal: Image */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-500" />
              <span>Insert Image into Article</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={insertImageUrl}
                  onChange={(e) => setInsertImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Alt Text (SEO Description)
                </label>
                <input
                  type="text"
                  value={insertImageAlt}
                  onChange={(e) => setInsertImageAlt(e.target.value)}
                  placeholder="e.g. Local SEO ranking chart screenshot"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Inserter Modal: Table */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-cyan-500" />
              <span>Insert Markdown Table</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Columns
                </label>
                <input
                  type="number"
                  min={2}
                  max={6}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Rows
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 cursor-pointer shadow-xs"
              >
                Insert Table Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Inserter Modal: Code Snippet */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-500" />
              <span>Insert Code Block</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Programming Language
                </label>
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS / Tailwind</option>
                  <option value="sql">SQL / Postgres</option>
                  <option value="json">JSON</option>
                  <option value="bash">Bash / Shell</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Code Snippet
                </label>
                <textarea
                  rows={5}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste your code snippet here"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertCode}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Insert Code Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        acceptTypes={mediaPickerTarget === 'cover' ? 'images' : 'all'}
        title={
          mediaPickerTarget === 'cover'
            ? 'Select Hero Cover Image'
            : 'Select Asset for Article'
        }
        onSelect={(chosen) => {
          if (mediaPickerTarget === 'cover') {
            setEditorCoverImage(chosen.fileUrl)
            addToast('Hero Image Set', `Cover image set to "${chosen.filename}".`)
          } else if (mediaPickerTarget === 'editor') {
            if (chosen.mimeType.startsWith('image/')) {
              insertMarkdown(`\n![${chosen.filename}](${chosen.fileUrl})\n`)
            } else {
              insertMarkdown(`[📄 Download ${chosen.filename}](${chosen.fileUrl})`)
            }
            addToast('Asset Inserted', `Added "${chosen.filename}" to Markdown.`)
          }
          setMediaPickerTarget(null)
        }}
      />
    </div>
  )
}
