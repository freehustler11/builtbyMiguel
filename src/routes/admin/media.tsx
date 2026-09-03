import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
  Cloud,
  HardDrive,
  FolderOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Layers,
} from 'lucide-react'
import { checkAuthServerFn } from '../../lib/auth'
import { AdminNav } from '../../components/AdminNav'
import { ConfirmModal } from '../../components/ConfirmModal'
import { ToastContainer, type ToastMessage } from '../../components/Toast'
import {
  getMediaServerFn,
  uploadMediaServerFn,
  deleteMediaServerFn,
} from '../../server/media'
import type { Media } from '../../db/schema'

interface MediaSearch {
  type?: 'all' | 'images' | 'documents'
  q?: string
}

export const Route = createFileRoute('/admin/media')({
  validateSearch: (search: Record<string, unknown>): MediaSearch => {
    return {
      type:
        search.type === 'images' || search.type === 'documents'
          ? search.type
          : 'all',
      q: typeof search.q === 'string' ? search.q : undefined,
    }
  },
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuthServerFn()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/admin/media',
        },
      })
    }
  },
  loader: async ({ location }) => {
    const search = location.search as MediaSearch
    return await getMediaServerFn({
      data: {
        type: search.type || 'all',
        q: search.q,
      },
    })
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Media Library & Files | Admin | Built by Miguel' },
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
    return <ImageIcon className="w-6 h-6 text-rose-500" />
  }
  if (mimeType.includes('pdf')) {
    return <FileText className="w-6 h-6 text-rose-600" />
  }
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
    return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
  }
  return <File className="w-6 h-6 text-slate-500" />
}

function AdminMediaPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const { type = 'all', q } = Route.useSearch()
  const { media: mediaItems, storageInfo } = Route.useLoaderData()

  // State
  const [searchInput, setSearchInput] = useState(q || '')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

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
        q: searchInput.trim() || undefined,
      },
    })
  }

  const handleTypeTab = (newType: 'all' | 'images' | 'documents') => {
    navigate({
      to: '.',
      search: {
        type: newType,
        q: searchInput.trim() || undefined,
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
    // Resolve absolute URL if relative
    const fullUrl =
      url.startsWith('http') || typeof window === 'undefined'
        ? url
        : `${window.location.origin}${url}`

    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    addToast('Link Copied to Clipboard', fullUrl)
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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Soft Ambient Light Glow Matching Homepage */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <AdminNav
        activeTab="media"
        title="Media Library & File Manager"
        description="Upload, organize, and manage image assets, case study attachments, and documents for blog posts and site components."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-rose-400 dark:text-white" />
              <span>Upload Assets</span>
            </button>
          </div>
        }
      />

      {/* Beginner's Guide Collapsible Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md overflow-hidden shadow-xs">
        <div
          onClick={() => setShowGuide(!showGuide)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Beginner's Quick Guide · Managing Media & Post Assets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How to upload photos, grab permanent URLs, and use them inside articles.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            {showGuide ? 'Hide Guide' : 'Show Guide'}
          </button>
        </div>

        {showGuide && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span>01.</span> Drag & Drop
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Drop PNG, JPG, WebP photos or PDF documents directly into the upload zone below. Supports batch uploads up to 25MB.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <span>02.</span> 1-Click Copy Link
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Hover any item and click the Copy icon to get its permanent web address copied to your clipboard instantly.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>03.</span> Direct Post Editor Picker
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Inside the Blog CMS editor, click "Choose from Media" to insert images directly into your Markdown text without copying links.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overview Bento Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Assets */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Total Assets
            </span>
            <FolderOpen className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalFiles}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {formatFileSize(totalSizeBytes)} total storage
          </div>
        </div>

        {/* Images */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Photos & Graphics
            </span>
            <ImageIcon className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {imageCount}
          </div>
          <div className="text-[11px] font-mono text-slate-400">WebP, PNG, JPG, SVG</div>
        </div>

        {/* Documents */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Documents & Sheets
            </span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {docCount}
          </div>
          <div className="text-[11px] font-mono text-slate-400">PDFs, Sheets, Docs</div>
        </div>

        {/* Storage Provider Status */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Storage Engine
            </span>
            {storageInfo.provider === 'local' ? (
              <HardDrive className="w-4 h-4 text-amber-500" />
            ) : (
              <Cloud className="w-4 h-4 text-indigo-500" />
            )}
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
            {storageInfo.name}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
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
        className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md shadow-xs'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(e) => handleFilesUpload(e.target.files)}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-500 shadow-inner mb-3">
          {isUploading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isUploading ? uploadProgress : 'Drop files here, or browse from computer'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            PNG, JPG, WebP, SVG, PDF, DOCX, XLSX up to 25MB per file
          </p>
        </div>
      </div>

      {/* Filter Tabs, Search & Count */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Segmented Filter Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleTypeTab('all')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              type === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Files ({totalFiles})
          </button>
          <button
            type="button"
            onClick={() => handleTypeTab('images')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              type === 'images'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Images ({imageCount})
          </button>
          <button
            type="button"
            onClick={() => handleTypeTab('documents')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              type === 'documents'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Documents ({docCount})
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search filenames..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 font-mono shadow-xs"
          />
        </form>
      </div>

      {/* Media Items Gallery Grid */}
      {mediaItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {q ? `No media items matching "${q}"` : 'No Media Assets Uploaded Yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Use the drag-and-drop zone above to upload your first image or document.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map((item) => {
            const isImage = item.mimeType.startsWith('image/')
            const isCopied = copiedId === item.id

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md overflow-hidden hover:border-rose-500/50 dark:hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 shadow-xs"
              >
                {/* Visual Thumbnail */}
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center overflow-hidden relative border-b border-slate-100 dark:border-slate-800/80">
                  {isImage ? (
                    <img
                      src={item.fileUrl}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700">
                        {getFileIcon(item.mimeType)}
                      </div>
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                        {item.filename.split('.').pop()} Document
                      </span>
                    </div>
                  )}

                  {/* Top Floating Action Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-black text-white backdrop-blur-md transition shadow-md"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* File Details & Actions */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                      title={item.filename}
                    >
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatFileSize(item.fileSize)}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => copyUrlToClipboard(item.fileUrl, item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                      title="Copy URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900/40 transition cursor-pointer shadow-2xs"
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

      {/* Delete Confirmation Modal (Custom themed, zero browser popups) */}
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
  )
}
