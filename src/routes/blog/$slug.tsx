import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Key,
  Sparkles,
  Share2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Zap,
  HelpCircle,
  TrendingUp,
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
          { title: 'Article Not Found | Built by Miguel' },
          { name: 'robots', content: 'noindex, nofollow' },
        ],
      }
    }

    const title = `${post.title} | Built by Miguel`
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
        { name: 'description', description },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonical },
        ...(post.featuredImage ? [{ property: 'og:image', content: post.featuredImage }] : []),
        { property: 'article:published_time', content: publishedTime },
        { property: 'article:author', content: 'Miguel Umbac' },
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
            '@type': 'BlogPosting',
            headline: post.title,
            description,
            url: canonical,
            datePublished: publishedTime,
            dateModified: post.updatedAt
              ? new Date(post.updatedAt).toISOString()
              : publishedTime,
            ...(post.featuredImage ? { image: post.featuredImage } : {}),
            author: {
              '@type': 'Person',
              name: 'Miguel Umbac',
              url: 'https://builtbymiguel.net/about',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Built by Miguel',
              url: 'https://builtbymiguel.net',
            },
          }),
        },
      ],
    }
  },
  component: BlogPostPage,
})

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
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
 * Enhanced Markdown renderer supporting TOC anchors, styled tables, key takeaways, and FAQ accordions
 */
function MarkdownRenderer({
  content,
  onHeadingParsed,
}: {
  content: string
  onHeadingParsed?: (headings: TocItem[]) => void
}) {
  const paragraphs = content.split(/\n\n+/)

  const renderContent = useMemo(() => {
    const headings: TocItem[] = []

    const rendered = paragraphs.map((p, idx) => {
      const trimmed = p.trim()

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace(/^##\s+/, '')
        const id = slugifyHeading(title)
        headings.push({ id, title, level: 2 })

        return (
          <h2
            key={idx}
            id={id}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-8 pb-3 border-b border-slate-200/80 dark:border-slate-800 tracking-tight scroll-mt-24 flex items-center gap-2"
          >
            <span>{title}</span>
          </h2>
        )
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace(/^###\s+/, '')
        const id = slugifyHeading(title)
        headings.push({ id, title, level: 3 })

        return (
          <h3
            key={idx}
            id={id}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 tracking-tight scroll-mt-24"
          >
            {title}
          </h3>
        )
      }

      // Markdown Table (| Col 1 | Col 2 |)
      if (trimmed.includes('|') && trimmed.includes('\n')) {
        const rows = trimmed.split('\n').map((row) =>
          row
            .split('|')
            .map((c) => c.trim())
            .filter((c, i, arr) => i > 0 && i < arr.length - 1)
        )
        const headerRow = rows[0]
        const bodyRows = rows.slice(2) // Skip separator row

        if (headerRow && headerRow.length > 0) {
          return (
            <div
              key={idx}
              className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-4 py-3 font-bold text-slate-900 dark:text-white font-mono"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? 'bg-white dark:bg-slate-900'
                          : 'bg-slate-50/50 dark:bg-slate-900/40'
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-slate-700 dark:text-slate-300"
                        >
                          {cell}
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

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border-l-4 border-rose-500 text-slate-800 dark:text-slate-200 italic space-y-1 text-base sm:text-lg my-6 shadow-2xs"
          >
            {trimmed
              .replace(/^>\s+/, '')
              .split('\n')
              .map((line, lIdx) => (
                <p key={lIdx}>{line.replace(/^>\s*/, '')}</p>
              ))}
          </blockquote>
        )
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter((l) => l.trim().length > 0)
        return (
          <ul key={idx} className="space-y-2.5 my-4 pl-2">
            {items.map((item, iIdx) => (
              <li
                key={iIdx}
                className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-base sm:text-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0" />
                <span>{item.replace(/^[-*]\s+/, '')}</span>
              </li>
            ))}
          </ul>
        )
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter((l) => l.trim().length > 0)
        return (
          <ol key={idx} className="space-y-3 my-4 pl-2">
            {items.map((item, iIdx) => (
              <li
                key={iIdx}
                className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-base sm:text-lg"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                  {iIdx + 1}
                </span>
                <span>{item.replace(/^\d+\.\s+/, '')}</span>
              </li>
            ))}
          </ol>
        )
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const codeText = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
        return (
          <pre
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto my-6 border border-slate-800 shadow-xs"
          >
            <code>{codeText}</code>
          </pre>
        )
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300"
        >
          {trimmed}
        </p>
      )
    })

    return { rendered, headings }
  }, [content])

  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {renderContent.rendered}
    </div>
  )
}

function BlogPostPage() {
  const data = Route.useLoaderData()
  const post = data?.post
  const relatedPosts = data?.relatedPosts || []
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null)

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

  // Extract Table of Contents from headings
  const tocHeadings = useMemo(() => {
    const headings: TocItem[] = []
    const lines = post.content.split('\n')
    for (const line of lines) {
      if (line.startsWith('## ')) {
        const title = line.replace(/^##\s+/, '').trim()
        headings.push({ id: slugifyHeading(title), title, level: 2 })
      } else if (line.startsWith('### ')) {
        const title = line.replace(/^###\s+/, '').trim()
        headings.push({ id: slugifyHeading(title), title, level: 3 })
      }
    }
    return headings
  }, [post.content])

  const copyArticleLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Sidebar CTA values with intelligent fallbacks
  const sidebarTitle = post.sidebarCtaTitle || 'Claim Free Video Audit'
  const sidebarText =
    post.sidebarCtaText ||
    'See why your local competitors outrank you on Google Maps and how to win top 3 pack rankings.'
  const sidebarBtnText = post.sidebarCtaButtonText || 'Get 5-Min Audit'
  const sidebarBtnUrl = post.sidebarCtaButtonUrl || '/audit'

  // Bottom Banner CTA values with intelligent fallbacks
  const bottomTitle =
    post.bottomCtaTitle || 'Never Scramble for Local Leads Again'
  const bottomText =
    post.bottomCtaText ||
    'Get a custom 5-minute video breakdown of your local market rankings, website speed leaks, and actionable quick wins.'
  const bottomBtnText = post.bottomCtaButtonText || 'Claim Free Video Audit'
  const bottomBtnUrl = post.bottomCtaButtonUrl || '/audit'

  return (
    <article className="min-h-screen py-8 sm:py-14 space-y-16">
      {/* Top Container: Back Navigation, Hero Card, Title & Meta */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        {/* Back Button & Category Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-left">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Playbooks</span>
          </Link>

          {post.keyword && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-2xs">
              <Key className="w-3 h-3" />
              <span>{post.keyword}</span>
            </span>
          )}
        </div>

        {/* Featured Graphic Hero Card (Centered with Halo Glow) */}
        {post.featuredImage ? (
          <div className="relative mx-auto max-w-3xl group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-cyan-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl aspect-16/9">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
            </div>
          </div>
        ) : (
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-cyan-500/20 blur-xl opacity-60" />
            <div className="relative p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 border border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Engineering & SEO Playbook
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Article Title */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {post.title}
          </h1>

          {/* Author Chip & Publication Meta */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">Miguel Umbac</span>
              <span className="text-slate-400">· Full-Stack SEO Engineer</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-rose-600 dark:text-rose-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Section: Left Sticky TOC & Sidebar CTA + Center Content Column */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (4 cols on Desktop): Sticky Table of Contents, Share, and Custom CTA */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents Box */}
            {tocHeadings.length > 0 && (
              <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>On This Page</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {tocHeadings.length} sections
                  </span>
                </div>

                <nav className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
                  {tocHeadings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className={`block text-xs transition-colors py-1 leading-snug hover:text-rose-600 dark:hover:text-rose-400 ${
                        h.level === 3
                          ? 'pl-4 text-slate-500 dark:text-slate-400 font-normal'
                          : 'text-slate-800 dark:text-slate-200 font-semibold'
                      }`}
                    >
                      {h.title}
                    </a>
                  ))}
                </nav>

                {/* Social Share Controls */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    Share Playbook
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyArticleLink}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
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
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
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
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#0A66C2] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
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

            {/* Sticky Sidebar Custom CTA Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-black text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Free Strategy Resource</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  {sidebarTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sidebarText}
                </p>
              </div>
              <Link
                to={sidebarBtnUrl.startsWith('/') ? (sidebarBtnUrl as any) : undefined}
                href={!sidebarBtnUrl.startsWith('/') ? sidebarBtnUrl : undefined}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg cursor-pointer"
              >
                <span>{sidebarBtnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Center Column (8 cols on Desktop): Main Article Content */}
          <section className="lg:col-span-8 space-y-8 bg-white dark:bg-[#111827] p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Key Takeaways Card at the top */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/5 via-indigo-500/5 to-cyan-500/5 dark:from-rose-950/30 dark:via-indigo-950/20 dark:to-cyan-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-rose-500" />
                <span>Executive Summary & Key Takeaways</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {post.metaDescription ||
                  'Actionable technical takeaways and implementation steps covered in this playbook.'}
              </p>
            </div>

            {/* Markdown Body */}
            <MarkdownRenderer content={post.content} />
          </section>
        </div>
      </main>

      {/* Explore Related Blogs Section */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Continue Reading
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Explore More Playbooks
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                  className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Related Article Image */}
                  <div className="aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    {related.featuredImage ? (
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Related Article Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>{formatDate(related.publishedAt || related.createdAt)}</span>
                        <span>·</span>
                        <span>{relReadingTime} min read</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition leading-snug line-clamp-2">
                        {related.title}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition duration-200">
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

      {/* Full-Width Bottom Conversion Banner (Customizable per Post via CMS) */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Direct Strategy Guarantee</span>
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {bottomTitle}
            </h2>

            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {bottomText}
            </p>
          </div>

          <div className="pt-2 relative">
            <Link
              to={bottomBtnUrl.startsWith('/') ? (bottomBtnUrl as any) : undefined}
              href={!bottomBtnUrl.startsWith('/') ? bottomBtnUrl : undefined}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-xl hover:shadow-rose-600/30 cursor-pointer"
            >
              <span>{bottomBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  )
}
