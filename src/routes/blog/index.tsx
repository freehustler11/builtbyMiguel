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
  ArrowRight,
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
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24">
        {/* Soft Ambient Light Glow */}
        <div className="relative text-center max-w-3xl mx-auto space-y-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Header Banner */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Growth Playbooks & Case Studies</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Local SEO, Web Architecture &{' '}
            <span className="text-amber-600 dark:text-amber-400">
              Automated Systems.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
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
                      ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-400/60 border border-slate-200 dark:border-slate-800 shadow-2xs'
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
          <div className="max-w-xl mx-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-10 text-center space-y-6 shadow-sm">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition"
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
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden hover:border-amber-400/60 hover:shadow-lg transition-all duration-300 shadow-sm"
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
                      <div className="w-full h-36 bg-gradient-to-br from-slate-100 via-amber-50/20 to-orange-50/10 dark:from-slate-900 dark:via-amber-950/10 dark:to-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 shadow-sm border border-slate-200/60 dark:border-slate-700">
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
                            <FolderOpen className="w-2.5 h-2.5 text-amber-500" />
                            <span>{post.category}</span>
                          </span>
                        )}

                        {post.keyword && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider border border-amber-200/60 dark:border-amber-800/50">
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
                      <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
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
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group-hover:translate-x-1 transition-all"
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

      {/* Bottom CTA Banner */}
      <section className="w-full bg-[#0B0F17] dark:bg-[#070A0F] text-white py-16 sm:py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-amber-950/50 border border-amber-700/50 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Free Video Teardown
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.15]">
            Want More Calls from Google in Your Area?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Request a free 5-minute video audit of your local search rankings, website speed, and competitor gaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Get Your Free 5-Minute Video Audit</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-sm transition-all duration-200"
            >
              <span>Contact Miguel Directly</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
