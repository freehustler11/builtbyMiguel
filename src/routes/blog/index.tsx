import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  Clock,
  Calendar,
  Key,
  BookOpen,
  ArrowUpRight,
  FolderOpen,
  Tag,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { getPublicPostsServerFn } from '../../server/posts'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    return await getPublicPostsServerFn()
  },
  head: () => {
    const title = 'Blog & Local Growth Playbooks | built by Miguel'
    const description =
      'Actionable SEO breakdowns, Google Business Profile ranking tactics, and high-converting web architecture playbooks for home service contractors and local businesses.'
    const canonical = 'https://builtbymiguel.net/blog'

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonical },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            description,
            url: canonical,
            publisher: {
              '@type': 'Person',
              name: 'Miguel Umbac',
              url: 'https://builtbymiguel.net',
            },
          }),
        },
      ],
    }
  },
  component: BlogIndexPage,
})

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(dateInput: string | Date | null) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

function BlogIndexPage() {
  const { posts } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Extract all unique categories present in posts
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim())
      }
    }
    return ['All', ...Array.from(set)]
  }, [posts])

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts
    return posts.filter(
      (p) => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [posts, selectedCategory])

  return (
    <div className="relative space-y-12 sm:space-y-16 py-6 sm:py-10">
      {/* Soft Ambient Light Glow Matching Homepage */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span>Growth Playbooks & Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
          Local SEO, Web Architecture &{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Automated Systems.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Deep-dive technical guides on ranking in competitive local markets, turning website traffic into booked calls, and automating client operations.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-md ring-1 ring-slate-900/10'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm shadow-2xs'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-10 text-center space-y-6 shadow-sm">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedCategory !== 'All'
                ? `No playbooks under "${selectedCategory}" yet`
                : 'New Articles Coming Soon'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We are currently finalizing in-depth case studies and SEO blueprints. In the meantime, get a free personalized video teardown of your Google ranking.
            </p>
          </div>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Request Free 24-Hour Audit</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const readingTime = calculateReadingTime(post.content)
            const tagsList = (post.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)

            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md overflow-hidden hover:border-rose-500/40 dark:hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Cover Image or Aesthetic Pattern */}
                  {post.featuredImage ? (
                    <div className="w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-slate-100 via-rose-50/30 to-amber-50/20 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-rose-500 shadow-sm border border-slate-200/60 dark:border-slate-700">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    {/* Category & Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {post.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700">
                          <FolderOpen className="w-2.5 h-2.5 text-rose-500" />
                          <span>{post.category}</span>
                        </span>
                      )}

                      {post.keyword && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider border border-rose-200/60 dark:border-rose-900/50">
                          <Key className="w-2.5 h-2.5" />
                          {post.keyword}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readingTime} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2">
                      <Link to="/blog/$slug" params={{ slug: post.slug }}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {(post.excerpt || post.summary || post.metaDescription) && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
                        {post.excerpt || post.summary || post.metaDescription}
                      </p>
                    )}

                    {/* Tags */}
                    {tagsList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-2">
                        {tagsList.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono border border-slate-200/60 dark:border-slate-700/60"
                          >
                            <Tag className="w-2 h-2 text-slate-400" />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Full Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
