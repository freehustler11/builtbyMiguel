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
      { title: 'Blog CMS & SEO Studio | Built by Miguel Admin' },
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

interface SeoCheck {
  id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  points: number
  maxPoints: number
}

/**
 * Real-Time Yoast / RankMath Style SEO Analyzer
 */
function analyzeSeo({
  title,
  slug,
  keyword,
  metaDescription,
  content,
  featuredImage,
}: {
  title: string
  slug: string
  keyword: string
  metaDescription: string
  content: string
  featuredImage: string
}) {
  const checks: SeoCheck[] = []
  const kw = keyword.toLowerCase().trim()
  const words = content.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const lowerMeta = metaDescription.toLowerCase()
  const lowerSlug = slug.toLowerCase()

  // 1. Focus Keyword in Title
  if (!kw) {
    checks.push({
      id: 'kw-title',
      label: 'Focus Keyword in Title',
      status: 'fail',
      detail: 'Set a focus keyword to evaluate on-page optimization.',
      points: 0,
      maxPoints: 15,
    })
  } else if (lowerTitle.includes(kw)) {
    const isEarly = lowerTitle.indexOf(kw) < 20
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

  // 5. Keyword in Subheadings (H2 / H3)
  const headings = content
    .split('\n')
    .filter((l) => l.startsWith('## ') || l.startsWith('### '))
    .map((l) => l.toLowerCase())

  if (!kw) {
    checks.push({
      id: 'kw-headings',
      label: 'Keyword in Subheadings',
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
        label: 'Keyword in Subheadings',
        status: 'pass',
        detail: 'Keyword found in at least one H2 or H3 subheading.',
        points: 10,
        maxPoints: 10,
      })
    } else {
      checks.push({
        id: 'kw-headings',
        label: 'Keyword in Subheadings',
        status: 'warn',
        detail: 'Use your target keyword in an H2/H3 subheading.',
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

  // 8. Title Length
  const titleLen = title.length
  if (titleLen >= 45 && titleLen <= 65) {
    checks.push({
      id: 'title-len',
      label: `Title Length (${titleLen} chars)`,
      status: 'pass',
      detail: 'Optimal length for Google SERP display (no truncation).',
      points: 10,
      maxPoints: 10,
    })
  } else if (titleLen > 65) {
    checks.push({
      id: 'title-len',
      label: `Title Length (${titleLen} chars)`,
      status: 'warn',
      detail: 'Title exceeds 65 characters and may be truncated on Google.',
      points: 5,
      maxPoints: 10,
    })
  } else {
    checks.push({
      id: 'title-len',
      label: `Title Length (${titleLen} chars)`,
      status: titleLen > 0 ? 'warn' : 'fail',
      detail: 'Title is too short. Aim for 45–65 characters.',
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
  const [editorSlug, setEditorSlug] = useState('')
  const [editorKeyword, setEditorKeyword] = useState('')
  const [editorCategory, setEditorCategory] = useState('Local SEO & GBP')
  const [editorTags, setEditorTags] = useState('')
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
      slug: editorSlug,
      keyword: editorKeyword,
      metaDescription: editorMetaDesc,
      content: editorContent,
      featuredImage: editorCoverImage,
    })
  }, [editorTitle, editorSlug, editorKeyword, editorMetaDesc, editorContent, editorCoverImage])

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
    setEditorSlug('')
    setEditorKeyword('')
    setEditorCategory('Local SEO & GBP')
    setEditorTags('')
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
    setIsEditorOpen(true)
  }

  const openEditPostModal = (post: Post) => {
    setEditingPost(post)
    setEditorTitle(post.title)
    setEditorSlug(post.slug)
    setEditorKeyword(post.keyword || '')
    setEditorCategory(post.category || 'Local SEO & GBP')
    setEditorTags(post.tags || '')
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
        category: editorCategory.trim() || undefined,
        tags: editorTags.trim() || undefined,
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
        description="Publish, schedule, categorize, and optimize articles with live RankMath-style SEO scoring and rich Markdown."
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl my-6 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95">
            {/* Modal Top Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200/50 dark:border-rose-900/50">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {editingPost ? 'Edit Blog Article' : 'Create New Article'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modern Markdown editor with category, tags, Yoast/RankMath SEO scoring, and scheduling.
                  </p>
                </div>
              </div>

              {/* Mode Tabs (Editor, Live Preview, Live SEO Score, Schema) */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTab('write')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'write'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('preview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'preview'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('seo')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'seo'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === 'schema'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Schema
                </button>
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
                    <span>Target: 45–65 characters</span>
                    <span
                      className={
                        editorTitle.length >= 45 && editorTitle.length <= 65
                          ? 'text-emerald-500 font-bold'
                          : editorTitle.length > 65
                            ? 'text-amber-500 font-bold'
                            : 'text-slate-400'
                      }
                    >
                      {editorTitle.length}/65 chars
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

              {/* Category & Tags Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>Article Category (For Related Articles Matching)</span>
                  </label>
                  <select
                    value={editorCategory}
                    onChange={(e) => setEditorCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="Local SEO & GBP">📍 Local SEO & GBP</option>
                    <option value="Websites & Care">⚡ Websites & Care Plans</option>
                    <option value="Systems & Automation">🤖 Systems & Automation</option>
                    <option value="Conversion & CRO">📈 Conversion & CRO</option>
                    <option value="Technical SEO">🔍 Technical SEO & Schema</option>
                    <option value="Client Case Studies">🏆 Client Case Studies</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tags (Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={editorTags}
                    onChange={(e) => setEditorTags(e.target.value)}
                    placeholder="e.g. Google Maps, Local Rank, PageSpeed, Schema"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <span className="text-[11px] text-slate-400">
                    Used to intelligently recommend relevant blog articles to readers.
                  </span>
                </div>
              </div>

              {/* Target Keyword, Hero Image & Publishing Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Focus Target Keyword (RankMath)
                  </label>
                  <input
                    type="text"
                    value={editorKeyword}
                    onChange={(e) => setEditorKeyword(e.target.value)}
                    placeholder="e.g. Local SEO mistakes"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Featured Hero Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editorCoverImage}
                      onChange={(e) => setEditorCoverImage(e.target.value)}
                      placeholder="https://... or /uploads/..."
                      className="w-full px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('cover')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition cursor-pointer shadow-2xs"
                      title="Choose image from Media Library"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                      <span className="hidden sm:inline">Choose Media</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Publishing Workflow
                  </label>
                  <select
                    value={editorStatus}
                    onChange={(e) =>
                      setEditorStatus(e.target.value as 'draft' | 'published' | 'scheduled')
                    }
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="draft">📁 Draft (Private)</option>
                    <option value="published">🚀 Published (Live to Public)</option>
                    <option value="scheduled">⏰ Scheduled (Auto-Release)</option>
                  </select>
                </div>
              </div>

              {/* Schedule DateTime Row (Visible when Scheduled) */}
              {editorStatus === 'scheduled' && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 animate-in fade-in">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <CalendarClock className="w-4 h-4 text-indigo-500" />
                    <span>Auto-Publish Release Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editorScheduledAt}
                    onChange={(e) => setEditorScheduledAt(e.target.value)}
                    className="px-4 py-2 rounded-xl text-xs font-mono border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                    The article will automatically become public once this timestamp is reached.
                  </p>
                </div>
              )}

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

              {/* TAB 1: WRITE MODE (Rich Toolbar & Markdown Area) */}
              {previewTab === 'write' && (
                <div className="space-y-2">
                  {/* Rich Modern Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    {/* Headings */}
                    <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2">
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
                        onClick={() => insertMarkdown('#### ', '\n')}
                        className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Heading 4"
                      >
                        <Heading4 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Formatting */}
                    <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2">
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
                        onClick={() => insertMarkdown('~~', '~~')}
                        className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer text-xs font-bold"
                        title="Strikethrough"
                      >
                        <span className="line-through">S</span>
                      </button>
                    </div>

                    {/* Structure & Inserters */}
                    <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2">
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
                        onClick={() => insertMarkdown('1. ', '\n')}
                        className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
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
                        onClick={() => insertMarkdown('\n---\n')}
                        className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Divider Line"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Rich Media: Images, Tables, Code, Links */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('editor')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer shadow-2xs border border-rose-200/80 dark:border-rose-900/50"
                        title="Choose and insert from Media Library"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Media Library</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                        <span>URL Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsTableModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <TableIcon className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Table</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCodeModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <Code className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => insertMarkdown('[', '](https://...)')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <Link2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Link</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="post-markdown-editor"
                    rows={14}
                    required
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write article in Markdown... (Insert images, tables, code snippets, lists, and headings using the toolbar above)"
                    className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
                  />
                </div>
              )}

              {/* TAB 2: LIVE PREVIEW MODE */}
              {previewTab === 'preview' && (
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 min-h-[350px] max-h-[500px] overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        {editorCategory}
                      </span>
                      {editorKeyword && (
                        <span className="text-xs font-mono text-slate-400">
                          Focus: {editorKeyword}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                      {editorTitle || 'Untitled Article'}
                    </h1>
                  </div>
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                    {editorContent || 'No content entered yet.'}
                  </div>
                </div>
              )}

              {/* TAB 3: RANKMATH / YOAST SEO SCORECARD */}
              {previewTab === 'seo' && (
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
                  {/* SEO Score Meter Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-rose-500" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          On-Page RankMath / Yoast SEO Score
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluates focus keyword optimization, SERP length, keyword density, and search intent.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`text-3xl font-extrabold font-mono px-4 py-2 rounded-2xl border ${
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
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Google Search SERP Preview
                    </span>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 font-mono truncate">
                        https://builtbymiguel.net/blog/{editorSlug || 'your-article-slug'}
                      </div>
                      <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer">
                        {editorTitle || 'Article Title - Built by Miguel'}
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
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-start gap-3 shadow-2xs"
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
              )}

              {/* TAB 4: SCHEMA MARKUP & JSON-LD */}
              {previewTab === 'schema' && (
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
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
                        value="Built by Miguel (Miguel Umbac)"
                        className="w-full px-4 py-2.5 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Custom JSON-LD Injection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                      Custom Additional JSON-LD Schema (Optional)
                    </label>
                    <textarea
                      rows={6}
                      value={editorCustomSchema}
                      onChange={(e) => setEditorCustomSchema(e.target.value)}
                      placeholder='{ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...] }'
                      className="w-full px-4 py-2.5 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <p className="text-[11px] text-slate-400">
                      Optional: Paste supplementary FAQ or HowTo JSON-LD schema to inject into the article's head.
                    </p>
                  </div>
                </div>
              )}

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
                      Customize conversion banners for this specific post. Leaves defaults if empty.
                    </p>

                    {/* Sidebar CTA */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Sticky Sidebar CTA (Left / Right Column)</span>
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

                    {/* Bottom CTA */}
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

              {/* Sticky Footer Action Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>
                    {editorContent.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span>·</span>
                  <span>{calculateReadingTime(editorContent)} min read</span>
                  <span>·</span>
                  <span
                    className={`font-bold ${
                      seoReport.overallScore >= 80
                        ? 'text-emerald-500'
                        : seoReport.overallScore >= 50
                          ? 'text-amber-500'
                          : 'text-rose-500'
                    }`}
                  >
                    SEO: {seoReport.overallScore}/100
                  </span>
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
                              : editorStatus === 'scheduled'
                                ? 'Schedule Article'
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
