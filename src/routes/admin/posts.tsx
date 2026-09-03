import { createFileRoute, useNavigate, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
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
} from 'lucide-react'
import { requireAuth } from '../../lib/auth'
import {
  getAdminPostsServerFn,
  createPostServerFn,
  updatePostServerFn,
  deletePostServerFn,
} from '../../server/posts'
import { AdminNav } from '../../components/AdminNav'
import type { Post } from '../../db/schema'

interface AdminPostsSearch {
  status?: 'all' | 'published' | 'draft'
  q?: string
}

export const Route = createFileRoute('/admin/posts')({
  validateSearch: (search: Record<string, unknown>): AdminPostsSearch => {
    const status = search.status as AdminPostsSearch['status']
    return {
      status: ['all', 'published', 'draft'].includes(status || '') ? status : 'all',
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
      { title: 'Blog CMS & SEO Articles | Built by Miguel Admin' },
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

function AdminPostsPage() {
  const { posts, counts } = Route.useLoaderData()
  const { status = 'all', q = '' } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(q)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editorTitle, setEditorTitle] = useState('')
  const [editorSlug, setEditorSlug] = useState('')
  const [editorKeyword, setEditorKeyword] = useState('')
  const [editorMetaDesc, setEditorMetaDesc] = useState('')
  const [editorCoverImage, setEditorCoverImage] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [editorStatus, setEditorStatus] = useState<'draft' | 'published'>('draft')
  const [editorError, setEditorError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const handleStatusTab = (newStatus: 'all' | 'published' | 'draft') => {
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
  }

  const openNewPostModal = () => {
    setEditingPost(null)
    setEditorTitle('')
    setEditorSlug('')
    setEditorKeyword('')
    setEditorMetaDesc('')
    setEditorCoverImage('')
    setEditorContent('')
    setEditorStatus('draft')
    setEditorError(null)
    setSlugManuallyEdited(false)
    setPreviewTab('write')
    setIsEditorOpen(true)
  }

  const openEditPostModal = (post: Post) => {
    setEditingPost(post)
    setEditorTitle(post.title)
    setEditorSlug(post.slug)
    setEditorKeyword(post.keyword || '')
    setEditorMetaDesc(post.metaDescription || '')
    setEditorCoverImage(post.featuredImage || '')
    setEditorContent(post.content)
    setEditorStatus(post.status as 'draft' | 'published')
    setEditorError(null)
    setSlugManuallyEdited(true)
    setPreviewTab('write')
    setIsEditorOpen(true)
  }

  const handleTitleChange = (val: string) => {
    setEditorTitle(val)
    if (!slugManuallyEdited && !editingPost) {
      setEditorSlug(generateSlug(val))
    }
  }

  const handleSavePost = async (targetStatus?: 'draft' | 'published') => {
    const finalStatus = targetStatus || editorStatus
    if (!editorTitle.trim()) {
      setEditorError('Please provide a post title.')
      return
    }
    if (!editorSlug.trim()) {
      setEditorError('Please provide a valid URL slug.')
      return
    }
    if (!editorContent.trim()) {
      setEditorError('Article content cannot be empty.')
      return
    }

    setIsSaving(true)
    setEditorError(null)

    try {
      if (editingPost) {
        await updatePostServerFn({
          data: {
            id: editingPost.id,
            title: editorTitle,
            slug: editorSlug,
            content: editorContent,
            keyword: editorKeyword || undefined,
            metaDescription: editorMetaDesc || undefined,
            featuredImage: editorCoverImage || undefined,
            status: finalStatus,
          },
        })
      } else {
        await createPostServerFn({
          data: {
            title: editorTitle,
            slug: editorSlug,
            content: editorContent,
            keyword: editorKeyword || undefined,
            metaDescription: editorMetaDesc || undefined,
            featuredImage: editorCoverImage || undefined,
            status: finalStatus,
          },
        })
      }

      await router.invalidate()
      setIsEditorOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save post.'
      setEditorError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePublish = async (post: Post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published'
    try {
      setMutatingId(post.id)
      await updatePostServerFn({
        data: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          keyword: post.keyword || undefined,
          metaDescription: post.metaDescription || undefined,
          featuredImage: post.featuredImage || undefined,
          status: nextStatus,
        },
      })
      await router.invalidate()
    } catch (err) {
      console.error('Failed to toggle post status:', err)
    } finally {
      setMutatingId(null)
    }
  }

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return
    }
    try {
      setMutatingId(id)
      await deletePostServerFn({ data: { id } })
      await router.invalidate()
    } catch (err) {
      console.error('Failed to delete post:', err)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Navigation Banner */}
      <AdminNav
        activeTab="posts"
        title="Blog CMS & SEO Articles"
        description="Publish ranking content, service guides, and customer case studies."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={openNewPostModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
          </div>
        }
      />

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleStatusTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Articles</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('published')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'published'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Published</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
              {counts.published}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusTab('draft')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              status === 'draft'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
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
            placeholder="Search by title, slug, keyword..."
            className="w-full pl-10 pr-20 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No articles found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {q
                ? `No posts matched your query "${q}".`
                : `There are no articles under the "${status}" filter.`}
            </p>
          </div>
          <button
            type="button"
            onClick={openNewPostModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write First Article</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isMutating = mutatingId === post.id
            const isPublished = post.status === 'published'

            return (
              <div
                key={post.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-4 shadow-sm hover:shadow-md ${
                  isPublished
                    ? 'border-slate-200/80 dark:border-slate-800'
                    : 'border-amber-500/30 dark:border-amber-500/20'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Top Row: Status, Date, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isPublished
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span>{post.status}</span>
                    </span>

                    {/* Target Keyword */}
                    {post.keyword && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Key className="w-3 h-3 text-slate-400" />
                        <span>{post.keyword}</span>
                      </span>
                    )}

                    {/* Date */}
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {isPublished
                        ? `Published: ${formatDate(post.publishedAt)}`
                        : `Updated: ${formatDate(post.updatedAt)}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isPublished && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(post)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isPublished
                          ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50'
                          : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50'
                      }`}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditPostModal(post)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Article Info */}
                <div className="space-y-1.5">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {post.title}
                  </h2>
                  <div className="text-xs font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>/blog/{post.slug}</span>
                  </div>
                  {post.metaDescription && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {post.metaDescription}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingPost ? 'Edit Blog Article' : 'Create New Article'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Write high-ranking SEO content with markdown formatting.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {editorError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-300 font-medium">
                {editorError}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How to Rank #1 on Google Map Pack in 2026"
                    className="w-full px-4 py-2.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-mono text-slate-400">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={editorSlug}
                      onChange={(e) => {
                        setEditorSlug(e.target.value)
                        setSlugManuallyEdited(true)
                      }}
                      placeholder="how-to-rank-google-maps"
                      className="w-full pl-16 pr-4 py-2.5 rounded-2xl text-sm font-mono border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Keyword & Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Focus SEO Keyword
                  </label>
                  <input
                    type="text"
                    value={editorKeyword}
                    onChange={(e) => setEditorKeyword(e.target.value)}
                    placeholder="e.g. local seo google maps"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={editorCoverImage}
                    onChange={(e) => setEditorCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              </div>

              {/* Meta Description / Excerpt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Meta Description / Excerpt (SEO Summary)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      editorMetaDesc.length > 160
                        ? 'text-amber-500'
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
                  placeholder="Concise summary for search engine snippets and social sharing cards..."
                  className="w-full px-4 py-2 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              {/* Content Editor & Preview Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Article Body (Markdown Supported) *
                  </label>
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('write')}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        previewTab === 'write'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('preview')}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        previewTab === 'preview'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {previewTab === 'write' ? (
                  <textarea
                    rows={14}
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write article content using markdown (## Headings, **bold**, lists, code blocks)..."
                    className="w-full p-4 rounded-2xl text-sm font-mono leading-relaxed border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                ) : (
                  <div className="w-full min-h-[300px] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 prose dark:prose-invert max-w-none text-sm space-y-4">
                    <h1 className="text-2xl font-bold">{editorTitle || 'Untitled Article'}</h1>
                    {editorCoverImage && (
                      <img
                        src={editorCoverImage}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    )}
                    <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                      {editorContent || 'No content written yet.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Status:</span>
                <select
                  value={editorStatus}
                  onChange={(e) => setEditorStatus(e.target.value as 'draft' | 'published')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePost('draft')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition disabled:opacity-50"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePost('published')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Publish Article'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
