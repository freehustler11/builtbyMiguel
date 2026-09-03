import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Key,
  FolderOpen,
  Tag,
  Share2,
  BookOpen,
  ArrowRight,
  Check,
  Copy,
  Zap,
  List,
  Sparkles,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { getPublicPostBySlugServerFn } from '../../server/posts'
import type { Post } from '../../db/schema'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    return await getPublicPostBySlugServerFn({ data: { slug: params.slug } })
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      return {
        meta: [
          { charSet: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          { title: 'Article Not Found | built by Miguel' },
          { name: 'robots', content: 'noindex, nofollow' },
        ],
      }
    }

    const metaTitleText = post.metaTitle?.trim() || post.title
    const title = metaTitleText.toLowerCase().includes('built by miguel')
      ? metaTitleText
      : `${metaTitleText} | built by Miguel`
    const description =
      post.metaDescription ||
      `Read ${post.title} - actionable SEO, web development, and local growth strategy from Miguel Umbac.`
    const canonical = `https://builtbymiguel.net/blog/${post.slug}`
    const publishedTime = post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : new Date(post.createdAt).toISOString()

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonical },
        ...(post.featuredImage ? [{ property: 'og:image', content: post.featuredImage }] : []),
        { property: 'article:published_time', publishedTime },
        { property: 'article:author', content: 'Miguel Umbac' },
        ...(post.category ? [{ property: 'article:section', content: post.category }] : []),
        ...(post.tags ? [{ property: 'article:tag', content: post.tags }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        ...(post.featuredImage ? [{ name: 'twitter:image', content: post.featuredImage }] : []),
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': post.schemaType || 'BlogPosting',
            headline: post.title,
            description,
            url: canonical,
            datePublished: publishedTime,
            dateModified: post.updatedAt
              ? new Date(post.updatedAt).toISOString()
              : publishedTime,
            ...(post.category ? { articleSection: post.category } : {}),
            ...(post.tags ? { keywords: post.tags } : {}),
            ...(post.featuredImage ? { image: post.featuredImage } : {}),
            author: {
              '@type': 'Person',
              name: 'Miguel Umbac',
              url: 'https://builtbymiguel.net/about',
            },
            publisher: {
              '@type': 'Organization',
              name: 'built by Miguel',
              url: 'https://builtbymiguel.net',
            },
          }),
        },
        ...(post.customSchema
          ? [
              {
                type: 'application/ld+json',
                children: post.customSchema,
              },
            ]
          : []),
      ],
    }
  },
  component: BlogPostPage,
})

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

interface TocItem {
  id: string
  title: string
  level: 2 | 3
}

/**
 * Helper to render inline markdown: **bold**, *italic*, `code`, [text](url)
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex splitting on markdown tokens
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
        const isExternal = href.startsWith('http')
        parts.push(
          <a
            key={match.index}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
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

interface MarkdownBlockItem {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'hr' | 'image' | 'table' | 'blockquote' | 'ul' | 'ol' | 'code' | 'p'
  content?: string
  alt?: string
  src?: string
  headers?: string[]
  rows?: string[][]
  items?: string[]
  lang?: string
  id?: string
}

function parseMarkdownBlocks(rawContent: string): MarkdownBlockItem[] {
  if (!rawContent) return []
  const lines = rawContent.split(/\r?\n/)
  const blocks: MarkdownBlockItem[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    if (trimmed.startsWith('![') && trimmed.includes('](')) {
      const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/)
      if (imgMatch) {
        blocks.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] })
        i++
        continue
      }
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', content: trimmed.replace(/^#\s+/, '') })
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '')
      blocks.push({ type: 'h2', content: text, id: slugifyHeading(text) })
      i++
      continue
    }
    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '')
      blocks.push({ type: 'h3', content: text, id: slugifyHeading(text) })
      i++
      continue
    }
    if (trimmed.startsWith('#### ')) {
      const text = trimmed.replace(/^####\s+/, '')
      blocks.push({ type: 'h4', content: text, id: slugifyHeading(text) })
      i++
      continue
    }
    if (trimmed.startsWith('##### ')) {
      blocks.push({ type: 'h5', content: trimmed.replace(/^#####\s+/, '') })
      i++
      continue
    }
    if (trimmed.startsWith('###### ')) {
      blocks.push({ type: 'h6', content: trimmed.replace(/^######\s+/, '') })
      i++
      continue
    }

    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace(/^```/, '').trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++
      }
      blocks.push({ type: 'code', lang, content: codeLines.join('\n') })
      continue
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      if (tableLines.length >= 2) {
        const rows = tableLines.map((row) =>
          row
            .split('|')
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        )
        const headers = rows[0]
        const isDivider = rows[1]?.every((c) => /^[-:\s]+$/.test(c))
        const dataRows = isDivider ? rows.slice(2) : rows.slice(1)
        blocks.push({ type: 'table', headers, rows: dataRows })
        continue
      }
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') })
      continue
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items: listItems })
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'ol', items: listItems })
      continue
    }

    const pLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('![') &&
      !lines[i].trim().startsWith('---') &&
      !lines[i].trim().startsWith('***') &&
      !lines[i].trim().startsWith('___') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      pLines.push(lines[i].trim())
      i++
    }
    if (pLines.length > 0) {
      blocks.push({ type: 'p', content: pLines.join(' ') })
    }
  }

  return blocks
}

/**
 * Enhanced Markdown renderer with smooth scroll-margin anchor IDs, H1-H6, tables, and images
 */
function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content)

  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {blocks.map((block, idx) => {
        if (block.type === 'hr') {
          return (
            <hr
              key={idx}
              className="my-8 border-t border-slate-200/80 dark:border-slate-800"
            />
          )
        }

        if (block.type === 'image' && block.src) {
          return (
            <figure key={idx} className="my-8 space-y-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <img
                  src={block.src}
                  alt={block.alt || 'Article visual'}
                  className="w-full max-h-[520px] object-cover"
                  loading="lazy"
                />
              </div>
              {block.alt && (
                <figcaption className="text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          )
        }

        if (block.type === 'h1' && block.content) {
          return (
            <h1
              key={idx}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white pt-8 pb-3 tracking-tight"
            >
              {renderInlineFormatting(block.content)}
            </h1>
          )
        }

        if (block.type === 'h2' && block.content) {
          return (
            <h2
              key={idx}
              id={block.id}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-8 pb-2 border-b border-slate-200/80 dark:border-slate-800 tracking-tight scroll-mt-28 flex items-center gap-2 group"
            >
              <span>{renderInlineFormatting(block.content)}</span>
            </h2>
          )
        }

        if (block.type === 'h3' && block.content) {
          return (
            <h3
              key={idx}
              id={block.id}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 tracking-tight scroll-mt-28"
            >
              {renderInlineFormatting(block.content)}
            </h3>
          )
        }

        if (block.type === 'h4' && block.content) {
          return (
            <h4
              key={idx}
              id={block.id}
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4 tracking-tight scroll-mt-28"
            >
              {renderInlineFormatting(block.content)}
            </h4>
          )
        }

        if (block.type === 'h5' && block.content) {
          return (
            <h5
              key={idx}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-3 tracking-tight"
            >
              {renderInlineFormatting(block.content)}
            </h5>
          )
        }

        if (block.type === 'h6' && block.content) {
          return (
            <h6
              key={idx}
              className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 tracking-tight uppercase tracking-wider text-rose-600 dark:text-rose-400"
            >
              {renderInlineFormatting(block.content)}
            </h6>
          )
        }

        if (block.type === 'table' && block.headers && block.rows) {
          return (
            <div
              key={idx}
              className="my-8 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700">
                    {block.headers.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-4 py-3.5 font-bold text-slate-900 dark:text-white font-mono text-xs uppercase tracking-wider"
                      >
                        {renderInlineFormatting(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? 'bg-white dark:bg-slate-900'
                          : 'bg-slate-50/60 dark:bg-slate-850'
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-slate-700 dark:text-slate-300"
                        >
                          {renderInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.type === 'blockquote' && block.content) {
          return (
            <blockquote
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-rose-500 italic text-slate-800 dark:text-slate-200 my-6 text-base sm:text-lg"
            >
              {block.content.split('\n').map((line, lIdx) => (
                <p key={lIdx}>{renderInlineFormatting(line)}</p>
              ))}
            </blockquote>
          )
        }

        if (block.type === 'ul' && block.items) {
          return (
            <ul key={idx} className="space-y-2 my-4 pl-2">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-base sm:text-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-2.5 shrink-0" />
                  <span>{renderInlineFormatting(item)}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ol' && block.items) {
          return (
            <ol key={idx} className="space-y-3 my-4 pl-2">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-base sm:text-lg"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold shrink-0 mt-0.5 border border-slate-200/80 dark:border-slate-700">
                    {iIdx + 1}
                  </span>
                  <span>{renderInlineFormatting(item)}</span>
                </li>
              ))}
            </ol>
          )
        }

        if (block.type === 'code' && block.content) {
          return (
            <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-100 shadow-lg">
              {block.lang && (
                <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
                  <span>{block.lang}</span>
                </div>
              )}
              <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                <code>{block.content}</code>
              </pre>
            </div>
          )
        }

        if (block.content) {
          return (
            <p
              key={idx}
              className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300"
            >
              {renderInlineFormatting(block.content)}
            </p>
          )
        }

        return null
      })}
    </div>
  )
}

function BlogPostPage() {
  const data = Route.useLoaderData()
  const post = data?.post
  const relatedPosts = data?.relatedPosts || []
  const [copiedLink, setCopiedLink] = useState(false)

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Article Not Found
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              The blog article you are looking for might have been moved, renamed, or is still in draft mode.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Playbooks</span>
          </Link>
        </div>
      </div>
    )
  }

  const readingTime = calculateReadingTime(post.content)
  const tagsList = (post.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  // Extract Table of Contents specifically from H2 headings (## Heading)
  const tocHeadings = useMemo(() => {
    const headings: TocItem[] = []
    const lines = post.content.split('\n')
    for (const line of lines) {
      if (line.startsWith('## ')) {
        const title = line.replace(/^##\s+/, '').trim()
        headings.push({ id: slugifyHeading(title), title, level: 2 })
      }
    }
    return headings
  }, [post.content])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const copyArticleLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Sidebar CTA values with calm fallbacks
  const sidebarTitle = post.sidebarCtaTitle || 'Free 5-Min Local Audit'
  const sidebarText =
    post.sidebarCtaText ||
    'See why competitors outrank you on Google Maps and quick wins to rank higher.'
  const sidebarBtnText = post.sidebarCtaButtonText || 'Get Free Audit'
  const sidebarBtnUrl = post.sidebarCtaButtonUrl || '/audit'

  // Bottom Banner CTA values with calm fallbacks
  const bottomTitle =
    post.bottomCtaTitle || 'Want a Custom Local Search Breakdown?'
  const bottomText =
    post.bottomCtaText ||
    'Get a 5-minute video analysis of your local rankings, conversion leaks, and high-impact growth opportunities.'
  const bottomBtnText = post.bottomCtaButtonText || 'Claim Free Video Audit'
  const bottomBtnUrl = post.bottomCtaButtonUrl || '/audit'

  return (
    <article className="relative min-h-screen py-6 sm:py-10 space-y-12">
      {/* Soft Ambient Light Glow Matching Homepage */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Top Container: Navigation, Title, Category & Meta */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        {/* Back Button, Category & Keyword Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-left">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Playbooks</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-sm">
                <FolderOpen className="w-3 h-3 text-rose-500" />
                <span>{post.category}</span>
              </span>
            )}

            {post.keyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                <Key className="w-3 h-3" />
                <span>{post.keyword}</span>
              </span>
            )}
          </div>
        </div>

        {/* Featured Cover Graphic */}
        {post.featuredImage && (
          <div className="mx-auto max-w-3xl rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-md aspect-16/9 backdrop-blur-sm">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Main Article Title */}
        <div className="space-y-4 pt-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
            {post.title}
          </h1>

          {/* Author Chip & Publication Meta */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 shadow-2xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">Miguel Umbac</span>
              <span className="text-slate-400">· Full-Stack SEO Engineer</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Sidebar: Table of Contents + Subtle Sidebar CTA */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 order-2 lg:order-1">
            {/* 1. TABLE OF CONTENTS */}
            {tocHeadings.length > 0 && (
              <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-rose-500" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {tocHeadings.length} sections
                  </span>
                </div>

                {/* Clickable H2 TOC Links */}
                <nav className="space-y-1 max-h-[42vh] overflow-y-auto pr-1">
                  {tocHeadings.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToHeading(h.id)}
                      className="w-full text-left flex items-start gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer leading-snug group"
                    >
                      <span className="font-mono text-[10px] text-slate-400 group-hover:text-rose-500 shrink-0 mt-0.5">
                        0{i + 1}
                      </span>
                      <span className="font-medium">{h.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Social Share Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    Share
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyArticleLink}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                      title="Copy link"
                    >
                      {copiedLink ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.href : ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      title="Share on X"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.href : ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-[#0A66C2] bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUBTLE, CALM SIDEBAR CTA */}
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Resource
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {sidebarTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {sidebarText}
                </p>
              </div>

              <Link
                to={sidebarBtnUrl.startsWith('/') ? (sidebarBtnUrl as any) : undefined}
                href={!sidebarBtnUrl.startsWith('/') ? sidebarBtnUrl : undefined}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition shadow-2xs cursor-pointer"
              >
                <span>{sidebarBtnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Center Column: Focused Article Content Column */}
          <section className="lg:col-span-8 space-y-8 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm order-1 lg:order-2">
            {/* Key Summary / Executive Takeaways Card */}
            {post.summary && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-rose-950/20 dark:via-slate-900/60 dark:to-slate-900/30 border border-rose-100 dark:border-rose-900/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-rose-500" />
                  <span>Key Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Markdown Body */}
            <MarkdownRenderer content={post.content} />

            {/* Tags Pills Section */}
            {tagsList.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Topics:</span>
                </span>
                {tagsList.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200/80 dark:border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Tasteful Article Conclusion Callout */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/40 via-white to-orange-50/30 dark:from-rose-950/20 dark:via-slate-900/60 dark:to-slate-900/30 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {bottomTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                  {bottomText}
                </p>
                <div className="pt-2">
                  <Link
                    to={bottomBtnUrl.startsWith('/') ? (bottomBtnUrl as any) : undefined}
                    href={!bottomBtnUrl.startsWith('/') ? bottomBtnUrl : undefined}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-xs cursor-pointer"
                  >
                    <span>{bottomBtnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Explore Related Blogs Section */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Related Playbooks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                More articles matching this topic and category.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => {
              const relReadingTime = calculateReadingTime(related.content || '')
              return (
                <Link
                  key={related.id}
                  to="/blog/$slug"
                  params={{ slug: related.slug }}
                  className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Related Article Image */}
                  <div className="aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    {related.featuredImage ? (
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Related Article Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                        {related.category && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                            {related.category}
                          </span>
                        )}
                        <span>{formatDate(related.publishedAt || related.createdAt)}</span>
                        <span>·</span>
                        <span>{relReadingTime} min read</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition leading-snug line-clamp-2">
                        {related.title}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition duration-150">
                      <span>Read Playbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}
