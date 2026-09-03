import { useState, useEffect, useRef } from 'react'
import {
  X,
  Upload,
  Search,
  ImageIcon,
  FileText,
  FileSpreadsheet,
  File,
  Check,
  Loader2,
  FolderOpen,
  Sparkles,
} from 'lucide-react'
import { getMediaServerFn, uploadMediaServerFn } from '../server/media'
import type { Media } from '../db/schema'

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: { fileUrl: string; filename: string; mimeType: string }) => void
  title?: string
  acceptTypes?: 'all' | 'images' | 'documents'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="w-5 h-5 text-rose-500" />
  }
  if (mimeType.includes('pdf')) {
    return <FileText className="w-5 h-5 text-rose-600" />
  }
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
  }
  return <File className="w-5 h-5 text-slate-500" />
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select from Media Library',
  acceptTypes = 'all',
}: MediaPickerModalProps) {
  const [items, setItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>(acceptTypes)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = async () => {
    try {
      setIsLoading(true)
      const res = await getMediaServerFn({
        data: {
          type: filterType,
          q: searchQuery.trim() || undefined,
        },
      })
      setItems(res.media)
    } catch (err) {
      console.error('Failed to load media items:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMedia()
    }
  }, [isOpen, filterType, searchQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const base64 = reader.result as string
          const res = await uploadMediaServerFn({
            data: {
              filename: file.name,
              mimeType: file.type || 'application/octet-stream',
              base64,
            },
          })

          if (res.success && res.item) {
            // Immediately select the freshly uploaded file
            onSelect({
              fileUrl: res.item.fileUrl,
              filename: res.item.filename,
              mimeType: res.item.mimeType,
            })
            onClose()
          }
        } catch (uploadErr: any) {
          setUploadError(uploadErr?.message || 'Failed to upload file.')
          setIsUploading(false)
        }
      }

      reader.readAsDataURL(file)
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to read file.')
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Darkened Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#111827]/95 text-slate-900 dark:text-white shadow-2xl backdrop-blur-xl z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any file to insert it immediately or upload a new asset.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Upload Button */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 font-mono"
            />
          </div>

          {/* Type Filter Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('images')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'images'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setFilterType('documents')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'documents'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Quick Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-300">
            {uploadError}
          </div>
        )}

        {/* Media Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[350px]">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
              <span className="text-xs font-mono">Loading media library...</span>
            </div>
          ) : items.length === 0 ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                handleFileUpload(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No files found. Click or drag files here to upload.
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Supports Images (PNG, JPG, WebP, SVG) and Documents (PDF, DOCX) up to 25MB
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => {
                const isImage = item.mimeType.startsWith('image/')
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect({
                        fileUrl: item.fileUrl,
                        filename: item.filename,
                        mimeType: item.mimeType,
                      })
                      onClose()
                    }}
                    className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-rose-500/60 dark:hover:border-rose-500/60 hover:shadow-md transition text-left cursor-pointer"
                  >
                    {/* Thumbnail Preview */}
                    <div className="h-32 w-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center overflow-hidden relative">
                      {isImage ? (
                        <img
                          src={item.fileUrl}
                          alt={item.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 p-3 text-center">
                          {getFileIcon(item.mimeType)}
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            {item.filename.split('.').pop()}
                          </span>
                        </div>
                      )}

                      {/* Select Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                        <Check className="w-4 h-4" />
                        <span>Select</span>
                      </div>
                    </div>

                    {/* File Meta */}
                    <div className="p-3 space-y-1">
                      <p
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-500 transition-colors"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{formatFileSize(item.fileSize)}</span>
                        <span>{item.mimeType.split('/')[1] || 'file'}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {items.length} file{items.length === 1 ? '' : 's'} available
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
