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
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Link2,
  BookOpen,
  TrendingUp,
  Megaphone,
  ChevronDown,
  ChevronUp,
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
      { title: 'Blog CMS & SEO Playbooks | Built by Miguel Admin' },
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
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
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

  // Calculate high-level stats
  const totalPosts = counts.all
  const publishedPosts = counts.published
  const draftPosts = counts.draft
  const totalWords = posts.reduce(
    (acc, p) => acc + (p.content ? p.content.trim().split(/\s+/).length : 0),
    0
  )

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
    setIsEditorOpen(true)
  }

  const openEditPostModal = (post: Post) => {
    setEditingPost(post)
    setEditorTitle(post.title)
    setEditorSlug(post.slug)
    setEditorKeyword(post.keyword || '')
    setEditorMetaDesc(post.metaDescription || '')
    setEditorCoverImage(post.featuredImage || '')
    setEditorContent(post.content || '')
    setEditorStatus((post.status as 'draft' | 'published') || 'draft')
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
        slug: editorSlug.trim(),
        keyword: editorKeyword.trim() || undefined,
        metaDescription: editorMetaDesc.trim() || undefined,
        featuredImage: editorCoverImage.trim() || undefined,
        content: editorContent.trim(),
        status: editorStatus,
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
      } else {
        await createPostServerFn({
          data: payload,
        })
      }

      setIsEditorOpen(false)
      await router.invalidate()
    } catch (err: any) {
      setEditorError(err.message || 'Failed to save post. Ensure the slug is unique.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePublish = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
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
          sidebarCtaTitle: post.sidebarCtaTitle || undefined,
          sidebarCtaText: post.sidebarCtaText || undefined,
          sidebarCtaButtonText: post.sidebarCtaButtonText || undefined,
          sidebarCtaButtonUrl: post.sidebarCtaButtonUrl || undefined,
          bottomCtaTitle: post.bottomCtaTitle || undefined,
          bottomCtaText: post.bottomCtaText || undefined,
          bottomCtaButtonText: post.bottomCtaButtonText || undefined,
          bottomCtaButtonUrl: post.bottomCtaButtonUrl || undefined,
          status: newStatus,
        },
      })
      await router.invalidate()
    } catch (err) {
      console.error('Failed to toggle post status:', err)
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
      {/* Navigation Header */}
      <AdminNav
        activeTab="posts"
        title="Blog & SEO Content Engine"
        description="Publish, manage, and optimize high-converting articles and customizable conversion CTAs."
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
            Published and drafts in CMS
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
            Indexed & visible to search
          </div>
        </div>

        {/* Drafts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-amber-500/30 dark:border-amber-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Drafts in Progress
            </span>
            <FileEdit className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {draftPosts}
          </div>
          <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
            Unpublished manuscripts
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
            Total words generated
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
            placeholder="Search articles by title, keyword, slug..."
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
            const readingTime = calculateReadingTime(post.content || '')
            const hasCustomCta = Boolean(post.sidebarCtaTitle || post.bottomCtaTitle)

            return (
              <div
                key={post.id}
                className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-[#111827] p-6 sm:p-7 space-y-4 shadow-xs hover:shadow-md ${
                  isPublished
                    ? 'border-slate-200/80 dark:border-slate-800'
                    : 'border-amber-500/40 dark:border-amber-500/30'
                } ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Header Row: Status, Keywords, Dates, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(post)}
                      title={`Click to switch to ${isPublished ? 'draft' : 'published'}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition cursor-pointer ${
                        isPublished
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="capitalize">{post.status}</span>
                    </button>

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

                    {/* Published Date */}
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </span>
                  </div>

                  {/* Actions: View Live, Edit, Delete */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isPublished && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditPostModal(post)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
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

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span>URL Slug:</span>
                    <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                      /blog/{post.slug}
                    </span>
                  </div>

                  {post.metaDescription && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {post.metaDescription}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Article
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white">
                "{postToDelete.title}"
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Featured Post Editor Slide-Over Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200/50 dark:border-rose-900/50">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {editingPost ? 'Edit Blog Article' : 'Create New Article'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Write in Markdown with live SEO character meters and custom CTA controls.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePost} className="p-6 space-y-6 overflow-y-auto flex-1">
              {editorError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {editorError}
                </div>
              )}

              {/* Title & Slug Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editorTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 5 Fatal Local SEO Mistakes Killing Your Google Maps Rank"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Target: 50–65 characters</span>
                    <span
                      className={
                        editorTitle.length > 70
                          ? 'text-amber-500 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {editorTitle.length} chars
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-2xl border-y border-l border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500">
                      /blog/
                    </span>
                    <input
                      type="text"
                      required
                      value={editorSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="5-fatal-local-seo-mistakes"
                      className="w-full px-4 py-2.5 rounded-r-2xl text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Target Keyword & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Focus Target Keyword
                  </label>
                  <input
                    type="text"
                    value={editorKeyword}
                    onChange={(e) => setEditorKeyword(e.target.value)}
                    placeholder="e.g. Local SEO audit"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Featured Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={editorCoverImage}
                    onChange={(e) => setEditorCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Publication Status
                  </label>
                  <select
                    value={editorStatus}
                    onChange={(e) =>
                      setEditorStatus(e.target.value as 'draft' | 'published')
                    }
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Live to Public)</option>
                  </select>
                </div>
              </div>

              {/* Meta Description for SEO */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Meta Description (Google Snippet)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
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
                  placeholder="Summarize the article in 1-2 compelling sentences with your target keyword for Google search results..."
                  className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
                />
              </div>

              {/* Collapsible Custom CTA Banners Section */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowCtaSettings(!showCtaSettings)}
                  className="flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      🎯 Custom Call-To-Action (CTA) Banners (Sidebar & Bottom)
                    </span>
                  </div>
                  {showCtaSettings ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showCtaSettings && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in duration-150">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Customize the sidebar and bottom conversion banners for this specific article. If left blank, the standard "5-Minute Free Audit" banners will be displayed automatically.
                    </p>

                    {/* Sidebar CTA Customization */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Sticky Sidebar CTA (Right / Left Column)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Sidebar CTA Heading
                          </label>
                          <input
                            type="text"
                            value={sidebarCtaTitle}
                            onChange={(e) => setSidebarCtaTitle(e.target.value)}
                            placeholder="e.g. Free Local Rank Audit"
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Sidebar Button Text
                          </label>
                          <input
                            type="text"
                            value={sidebarCtaButtonText}
                            onChange={(e) => setSidebarCtaButtonText(e.target.value)}
                            placeholder="e.g. Claim Free Audit"
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Sidebar Subtitle / Copy
                          </label>
                          <input
                            type="text"
                            value={sidebarCtaText}
                            onChange={(e) => setSidebarCtaText(e.target.value)}
                            placeholder="e.g. See why competitors outrank you."
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Sidebar Button Destination URL
                          </label>
                          <input
                            type="text"
                            value={sidebarCtaButtonUrl}
                            onChange={(e) => setSidebarCtaButtonUrl(e.target.value)}
                            placeholder="e.g. /audit or /contact"
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner CTA Customization */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Full-Width Bottom Banner CTA</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Bottom Banner Headline
                          </label>
                          <input
                            type="text"
                            value={bottomCtaTitle}
                            onChange={(e) => setBottomCtaTitle(e.target.value)}
                            placeholder="e.g. Never Scramble for Client Evidence Again"
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Bottom Button Text
                          </label>
                          <input
                            type="text"
                            value={bottomCtaButtonText}
                            onChange={(e) => setBottomCtaButtonText(e.target.value)}
                            placeholder="e.g. Get Started Today"
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Bottom Subtitle / Paragraph
                          </label>
                          <input
                            type="text"
                            value={bottomCtaText}
                            onChange={(e) => setBottomCtaText(e.target.value)}
                            placeholder="e.g. Claim your free 5-minute video breakdown of your local market."
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Bottom Button Destination URL
                          </label>
                          <input
                            type="text"
                            value={bottomCtaButtonUrl}
                            onChange={(e) => setBottomCtaButtonUrl(e.target.value)}
                            placeholder="e.g. /audit or https://..."
                            className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Content Area with Markdown Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                  {/* Toolbar Shortcuts */}
                  <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## ', '\n')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('### ', '\n')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('**', '**')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('*', '*')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- ', '\n')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('> ', '\n')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('`', '`')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Code snippet"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('[', '](https://...)')}
                      className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Insert Link"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mode Tabs: Write vs Preview */}
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('write')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewTab === 'write'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('preview')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewTab === 'preview'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {previewTab === 'write' ? (
                  <textarea
                    id="post-markdown-editor"
                    rows={12}
                    required
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write article in Markdown... (Supports ## Headings, lists, tables, code blocks, and bold copy)"
                    className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
                  />
                ) : (
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 min-h-[300px] prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[400px]">
                    <h1 className="text-xl font-bold mb-3">{editorTitle || 'Untitled Article'}</h1>
                    <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                      {editorContent || 'No content entered yet.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer Action Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-400">
                  {editorContent.trim().split(/\s+/).filter(Boolean).length} words ·{' '}
                  {calculateReadingTime(editorContent)} min read
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Article...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {editingPost
                            ? 'Update Article'
                            : editorStatus === 'published'
                              ? 'Publish Live'
                              : 'Save Draft'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
