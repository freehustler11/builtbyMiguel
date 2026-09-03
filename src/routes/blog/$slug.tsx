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
} from 'lucide-react'
import { useState } from 'react'
import { getPublicPostBySlugServerFn } from '../../server/posts'

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
        { name: 'description', content: description },
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

/**
 * Render Markdown formatted text into styled React elements
 */
function MarkdownRenderer({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim()

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-100 dark:border-slate-800/80 tracking-tight"
            >
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          )
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4 tracking-tight"
            >
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          )
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-rose-500 text-slate-800 dark:text-slate-200 italic space-y-1 font-serif text-lg"
            >
              {trimmed.replace(/^>\s*/gm, '')}
            </blockquote>
          )
        }

        // Bullet List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n/).filter(Boolean)
          return (
            <ul key={idx} className="space-y-2.5 my-4 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-base sm:text-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-3 shrink-0" />
                  <span>{item.replace(/^[-*]\s+/, '')}</span>
                </li>
              ))}
            </ul>
          )
        }

        // Numbered List
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(Boolean)
          return (
            <ol key={idx} className="space-y-3 my-4 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-base sm:text-lg">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                    {itemIdx + 1}
                  </span>
                  <span>{item.replace(/^\d+\.\s+/, '')}</span>
                </li>
              ))}
            </ol>
          )
        }

        // Regular Paragraph
        return (
          <p key={idx} className="whitespace-pre-line leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

function BlogPostPage() {
  const { post } = Route.useLoaderData()
  const [copied, setCopied] = useState(false)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <BookOpen className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Article Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The article you are looking for does not exist or may have been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All Articles</span>
          </Link>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Free Audit</span>
          </Link>
        </div>
      </div>
    )
  }

  const readingTime = calculateReadingTime(post.content)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Playbooks</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
          {post.keyword && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider border border-rose-200/80 dark:border-rose-900/50">
              <Key className="w-3 h-3" />
              {post.keyword}
            </span>
          )}

          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>

          <span>•</span>

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {post.title}
        </h1>

        {post.metaDescription && (
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {post.metaDescription}
          </p>
        )}

        {/* Author Bio Bar */}
        <div className="flex items-center gap-3.5 pt-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            MU
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Miguel Umbac
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Founder & Local Search Systems Architect
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.featuredImage && (
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <main className="pt-2">
        <MarkdownRenderer content={post.content} />
      </main>

      {/* Bottom Growth CTA Banner */}
      <section className="mt-16 p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1424] text-white space-y-6 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Execute This Strategy
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Want us to implement this ranking blueprint for your business?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Get a personalized 5-minute video audit of your Google Business Profile, local ranking grid, and website conversion bottlenecks. 100% free, delivered in 24 hours.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <Link
            to="/audit"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Request Free Video Audit</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition"
          >
            <span>Ask a Question</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </article>
  )
}
