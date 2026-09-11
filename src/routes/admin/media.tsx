import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  Upload,
  Search,
  ImageIcon,
  FileText,
  FileSpreadsheet,
  File,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  HardDrive,
  FolderOpen,
  Loader2,
  Building2,
} from 'lucide-react'
import { AdminShell } from '../../components/AdminShell'
import { checkAuthServerFn, requireAdmin } from '../../lib/auth'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import {
  getMediaServerFn,
  uploadMediaServerFn,
  deleteMediaServerFn,
} from '../../server/media'
import { getClientsServerFn } from '../../server/clients'
import type { Media } from '../../db/schema'

interface MediaSearch {
  type?: 'all' | 'images' | 'documents'
  purpose?: 'all' | 'site' | 'client' | 'report'
  clientId?: string
  q?: string
  partnerId?: string
}

export const Route = createFileRoute('/admin/media')({
  validateSearch: (search: Record<string, unknown>): MediaSearch => {
    const type = search.type as MediaSearch['type']
    const purpose = search.purpose as MediaSearch['purpose']
    return {
      type: ['all', 'images', 'documents'].includes(type || '') ? type : 'all',
      purpose: ['all', 'site', 'client', 'report'].includes(purpose || '') ? purpose : 'all',
      clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
      q: typeof search.q === 'string' ? search.q : undefined,
      partnerId: typeof search.partnerId === 'string' ? search.partnerId : undefined,
    }
  },
  beforeLoad: async ({ location }) => {
    const auth = await requireAdmin({ location })
    return { auth }
  },
  loader: async ({ location, context }) => {
    const search = location.search as MediaSearch
    const [mediaData, clientsData] = await Promise.all([
      getMediaServerFn({
        data: {
          type: search.type || 'all',
          purpose: search.purpose || 'all',
          clientId: search.clientId,
          strictClientOnly: Boolean(search.clientId && search.clientId !== 'all'),
          q: search.q,
          partnerId: search.partnerId,
        },
      }),
      getClientsServerFn(),
    ])
    return {
      ...mediaData,
      auth: (context as any)?.auth || (await checkAuthServerFn()),
      partners: clientsData.partners || [],
      clients: clientsData.clients || [],
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Media Library & Files | Admin | built by Miguel' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminMediaPage,
})

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="w-5 h-5 text-[var(--accent)]" />
  }
  if (mimeType.includes('pdf')) {
    return <FileText className="w-5 h-5 text-rose-500" />
  }
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
  }
  return <File className="w-5 h-5 text-[var(--muted)]" />
}

function AdminMediaPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const { type = 'all', purpose = 'all', clientId, q, partnerId } = Route.useSearch()
  const { media: mediaItems, storageInfo, auth, partners, clients = [] } = Route.useLoaderData()

  const isPartner = auth.role === 'partner'
  const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'

  // State
  const [searchInput, setSearchInput] = useState(q || '')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showGuide, setShowGuide] = useState(() => {
    try {
      return localStorage.getItem('ui_guide_media') === 'true'
    } catch {
      return false
    }
  })

  const handleToggleGuide = () => {
    const next = !showGuide
    setShowGuide(next)
    try {
      localStorage.setItem('ui_guide_media', String(next))
    } catch {
      // ignore
    }
  }

  // Custom Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<Media | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, title, message, type }])
  }
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await router.invalidate()
    setIsRefreshing(false)
    addToast('Media Library Refreshed', 'Latest assets retrieved.')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '.',
      search: {
        type,
        purpose,
        clientId,
        q: searchInput.trim() || undefined,
        partnerId,
      },
    })
  }

  const handleTypeTab = (newType: 'all' | 'images' | 'documents') => {
    navigate({
      to: '.',
      search: {
        type: newType,
        purpose,
        clientId,
        q: searchInput.trim() || undefined,
        partnerId,
      },
    })
  }

  const handlePurposeTab = (newPurpose: 'all' | 'site' | 'client' | 'report') => {
    navigate({
      to: '.',
      search: {
        type,
        purpose: newPurpose,
        clientId: newPurpose === 'client' ? clientId : undefined,
        q: searchInput.trim() || undefined,
        partnerId,
      },
    })
  }

  const handleClientFilter = (newClientId: string) => {
    navigate({
      to: '.',
      search: {
        type,
        purpose,
        clientId: newClientId === 'all' ? undefined : newClientId,
        q: searchInput.trim() || undefined,
        partnerId,
      },
    })
  }

  const handlePartnerFilter = (newPartnerId: string) => {
    navigate({
      to: '.',
      search: {
        type,
        purpose,
        clientId,
        q: searchInput.trim() || undefined,
        partnerId: newPartnerId === 'direct' ? undefined : newPartnerId,
      },
    })
  }

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)

    const total = files.length
    let successful = 0

    for (let i = 0; i < total; i++) {
      const file = files[i]
      setUploadProgress(`Uploading ${i + 1} of ${total}: ${file.name}...`)

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        await uploadMediaServerFn({
          data: {
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            base64,
            partnerId: partnerId || null,
            clientId: clientId || null,
            purpose: purpose && purpose !== 'all' ? purpose : 'site',
          },
        })
        successful++
      } catch (err: any) {
        console.error('Upload failed for', file.name, err)
        addToast(
          'Upload Failed',
          `Could not upload "${file.name}": ${err?.message || 'Unknown error'}`,
          'error'
        )
      }
    }

    setIsUploading(false)
    setUploadProgress(null)
    await router.invalidate()

    if (successful > 0) {
      addToast(
        'Upload Complete',
        `Successfully added ${successful} asset${successful === 1 ? '' : 's'} to storage.`
      )
    }
  }

  const copyUrlToClipboard = (url: string, id: string) => {
    const fullUrl =
      url.startsWith('http') || typeof window === 'undefined'
        ? url
        : `${window.location.origin}${url}`

    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    addToast('Link Copied', fullUrl)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return
    try {
      setIsDeleting(true)
      await deleteMediaServerFn({ data: { id: itemToDelete.id } })
      addToast('Asset Deleted', `"${itemToDelete.filename}" was permanently deleted.`)
      setItemToDelete(null)
      await router.invalidate()
    } catch (err: any) {
      console.error('Delete failed:', err)
      addToast('Delete Failed', err?.message || 'Could not delete item.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Compute storage statistics
  const totalFiles = mediaItems.length
  const totalSizeBytes = mediaItems.reduce((acc, item) => acc + (item.fileSize || 0), 0)
  const imageCount = mediaItems.filter((i) => i.mimeType.startsWith('image/')).length
  const docCount = totalFiles - imageCount

  return (
    <AdminShell
      activeTab="media"
      userRole={auth.role}
      userEmail={auth.email}
      userName={auth.name}
      title={isPartner ? 'Partner media library' : 'Media library & file manager'}
      description={
        isPartner
          ? 'Upload and manage image assets and documents for your agency and clients.'
          : 'Upload, organize, and manage image assets, case study attachments, and documents for blog posts and site components.'
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] bg-[var(--panel)] hover:bg-[var(--canvas)] border border-[var(--line)] transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload file</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Toast Notification Container */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* Beginner's Guide Collapsible Card */}
        <div className="rounded-[8px] border border-[var(--line)] bg-[var(--panel)] overflow-hidden shadow-2xs">
          <div
            onClick={handleToggleGuide}
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-[var(--canvas)] transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-[6px] bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-[13px] font-medium text-[var(--ink)]">
                  Beginner's Quick Guide · Managing Media & Post Assets
                </h2>
                <p className="text-[11px] text-[var(--muted)]">
                  How to upload photos, grab permanent URLs, and use them inside articles.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              {showGuide ? 'Hide Guide' : 'Show Guide'}
            </button>
          </div>

          {showGuide && (
            <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
                <div className="font-mono font-bold text-[var(--accent)] flex items-center gap-1.5 text-[12px]">
                  <span>01.</span> Drag & Drop
                </div>
                <p className="text-[var(--muted)] text-[11px] leading-relaxed">
                  Drop PNG, JPG, WebP photos or PDF documents directly into the upload zone below. Supports batch uploads up to 25MB.
                </p>
              </div>
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
                <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 text-[12px]">
                  <span>02.</span> 1-Click Copy Link
                </div>
                <p className="text-[var(--muted)] text-[11px] leading-relaxed">
                  Hover any item and click the Copy icon to get its permanent web address copied to your clipboard instantly.
                </p>
              </div>
              <div className="p-3 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] space-y-1">
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-[12px]">
                  <span>03.</span> Direct Post Editor Picker
                </div>
                <p className="text-[var(--muted)] text-[11px] leading-relaxed">
                  Inside the Blog CMS editor, click "Choose from Media" to insert images directly into your Markdown text without copying links.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Overview Bento Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Assets */}
          <div className="p-4 rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted)]">
                Total Assets
              </span>
              <FolderOpen className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--ink)] tabular-nums">
              {totalFiles}
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)]">
              {formatFileSize(totalSizeBytes)} total storage
            </div>
          </div>

          {/* Images */}
          <div className="p-4 rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted)]">
                Photos & Graphics
              </span>
              <ImageIcon className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-bold text-[var(--ink)] tabular-nums">
              {imageCount}
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)]">WebP, PNG, JPG, SVG</div>
          </div>

          {/* Documents */}
          <div className="p-4 rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted)]">
                Documents & Sheets
              </span>
              <FileText className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-[var(--ink)] tabular-nums">
              {docCount}
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)]">PDFs, Sheets, Docs</div>
          </div>

          {/* Storage Provider Status */}
          <div className="p-4 rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted)]">
                Storage Engine
              </span>
              <HardDrive className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-[16px] font-bold text-[var(--ink)] truncate">
              {storageInfo.name}
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active & Synchronized</span>
            </div>
          </div>
        </div>

        {/* Drag and Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFilesUpload(e.dataTransfer.files)
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition ${
            isDragging
              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-[var(--line)] hover:border-[var(--muted)] bg-[var(--panel)]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={(e) => handleFilesUpload(e.target.files)}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] mb-2.5 shadow-2xs">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-0.5">
            <h3 className="text-[14px] font-semibold text-[var(--ink)]">
              {isUploading ? uploadProgress : 'Drop files here, or browse from computer'}
            </h3>
            <p className="text-[11px] text-[var(--muted)] font-mono">
              PNG, JPG, WebP, SVG, PDF, DOCX, XLSX up to 25MB per file
            </p>
          </div>
        </div>

        {/* Filter Tabs, Partner Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
          {/* Left: Filter Switcher & Scope Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Segmented Filter Switcher */}
            <div className="flex items-center p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium">
              <button
                type="button"
                onClick={() => handleTypeTab('all')}
                className={`h-7 px-3 rounded-[4px] transition cursor-pointer ${
                  type === 'all'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                All ({totalFiles})
              </button>
              <button
                type="button"
                onClick={() => handleTypeTab('images')}
                className={`h-7 px-3 rounded-[4px] transition cursor-pointer ${
                  type === 'images'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Images ({imageCount})
              </button>
              <button
                type="button"
                onClick={() => handleTypeTab('documents')}
                className={`h-7 px-3 rounded-[4px] transition cursor-pointer ${
                  type === 'documents'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Docs ({docCount})
              </button>
            </div>

            {/* Superadmin Partner Agency Filter Dropdown */}
            {isSuperadmin && partners.length > 0 && (
              <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span className="text-[11px] font-mono font-medium text-[var(--muted)] uppercase">Scope:</span>
                <select
                  value={partnerId || 'direct'}
                  onChange={(e) => handlePartnerFilter(e.target.value)}
                  className="text-[12px] font-medium bg-transparent text-[var(--ink)] focus:outline-none cursor-pointer"
                >
                  <option value="direct">My Media (Direct)</option>
                  <option value="all">All Agencies (Global)</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      Agency: {p.name || p.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Purpose Filter Pills */}
            <div className="flex items-center p-0.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[12px] font-medium">
              <button
                type="button"
                onClick={() => handlePurposeTab('all')}
                className={`h-7 px-2.5 rounded-[4px] transition cursor-pointer ${
                  purpose === 'all'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                All Usages
              </button>
              <button
                type="button"
                onClick={() => handlePurposeTab('site')}
                className={`h-7 px-2.5 rounded-[4px] transition cursor-pointer ${
                  purpose === 'site'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Site / Blog
              </button>
              <button
                type="button"
                onClick={() => handlePurposeTab('client')}
                className={`h-7 px-2.5 rounded-[4px] transition cursor-pointer ${
                  purpose === 'client'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Logos & Branding
              </button>
              <button
                type="button"
                onClick={() => handlePurposeTab('report')}
                className={`h-7 px-2.5 rounded-[4px] transition cursor-pointer ${
                  purpose === 'report'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Reports
              </button>
            </div>

            {/* Client Filter Dropdown */}
            {clients.length > 0 && (
              <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[var(--canvas)] border border-[var(--line)]">
                <span className="text-[11px] font-mono font-medium text-[var(--muted)] uppercase">Client:</span>
                <select
                  value={clientId || 'all'}
                  onChange={(e) => handleClientFilter(e.target.value)}
                  className="text-[12px] font-medium bg-transparent text-[var(--ink)] focus:outline-none cursor-pointer max-w-[140px] truncate"
                >
                  <option value="all">All Clients</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName || c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search filenames..."
              className="w-full h-8 pl-9 pr-3 text-[13px] rounded-[6px] bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
            />
          </form>
        </div>

        {/* Media Items Gallery Grid */}
        {mediaItems.length === 0 ? (
          <div className="rounded-[8px] border border-[var(--line)] bg-[var(--panel)] p-12 text-center space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-[6px] bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[14px] font-semibold text-[var(--ink)]">
                {q ? `No media items matching "${q}"` : 'No Media Assets Uploaded Yet'}
              </h3>
              <p className="text-[12px] text-[var(--muted)] max-w-sm mx-auto">
                Use the drag-and-drop zone above to upload your first image or document.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item) => {
              const isImage = item.mimeType.startsWith('image/')
              const isCopied = copiedId === item.id

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-[8px] border border-[var(--line)] bg-[var(--panel)] overflow-hidden hover:border-[var(--accent)] hover:shadow-md transition shadow-2xs"
                >
                  {/* Visual Thumbnail */}
                  <div className="h-40 w-full bg-[var(--canvas)] flex items-center justify-center overflow-hidden relative border-b border-[var(--line)]/60">
                    {isImage ? (
                      <img
                        src={item.fileUrl}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 p-4 text-center">
                        <div className="p-2.5 rounded-[6px] bg-[var(--panel)] shadow-2xs border border-[var(--line)]">
                          {getFileIcon(item.mimeType)}
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                          {item.filename.split('.').pop()} Document
                        </span>
                      </div>
                    )}

                    {/* Top Floating Action Pill */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-[6px] bg-black/70 hover:bg-black text-white backdrop-blur-xs transition shadow-xs"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* File Details & Actions */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p
                        className="text-[13px] font-medium text-[var(--ink)] truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                        <span>{formatFileSize(item.fileSize)}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {/* Purpose Tag */}
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono font-semibold bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)] uppercase">
                          {item.purpose || 'site'}
                        </span>

                        {/* Client Tag */}
                        {item.clientId && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                            <span>
                              {clients.find((c) => c.id === item.clientId)?.businessName ||
                                clients.find((c) => c.id === item.clientId)?.name ||
                                'Client Asset'}
                            </span>
                          </span>
                        )}

                        {/* Partner Tag for Superadmin */}
                        {isSuperadmin && item.partnerId && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[var(--canvas)] border border-[var(--line)] text-[9px] font-mono text-[var(--muted)]">
                            <Building2 className="w-2.5 h-2.5" />
                            <span>
                              {partners.find((p) => p.id === item.partnerId)?.name ||
                                partners.find((p) => p.id === item.partnerId)?.email ||
                                'Partner File'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2.5 border-t border-[var(--line)]/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrlToClipboard(item.fileUrl, item.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-[6px] text-[12px] font-medium text-[var(--ink)] bg-[var(--canvas)] hover:bg-[var(--line)]/40 border border-[var(--line)] transition cursor-pointer"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="h-7 w-7 rounded-[6px] text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center transition cursor-pointer shrink-0"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!itemToDelete}
          title="Delete Media Asset?"
          description={`Are you sure you want to delete "${itemToDelete?.filename}"? This will permanently remove the file from storage and database records. Any blog posts embedding this URL may show broken links.`}
          confirmText="Yes, Delete Asset"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onClose={() => setItemToDelete(null)}
        />
      </div>
    </AdminShell>
  )
}
