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
} from 'lucide-react'
import { getMediaServerFn, uploadMediaServerFn } from '../server/media'
import type { Media } from '../db/schema'

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: { fileUrl: string; filename: string; mimeType: string }) => void
  title?: string
  acceptTypes?: 'all' | 'images' | 'documents'
  purpose?: 'all' | 'site' | 'client' | 'report'
  clientId?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select from Media Library',
  acceptTypes = 'all',
  purpose = 'all',
  clientId,
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
          purpose: purpose !== 'all' ? purpose : undefined,
          clientId: clientId || undefined,
          q: searchQuery.trim() || undefined,
        },
      })

      let sortedItems = res.media
      if (clientId) {
        sortedItems = [...res.media].sort((a, b) => {
          const aMatch = a.clientId === clientId ? 1 : 0
          const bMatch = b.clientId === clientId ? 1 : 0
          return bMatch - aMatch
        })
      }
      setItems(sortedItems)
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
  }, [isOpen, filterType, searchQuery, purpose, clientId])

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
              clientId: clientId || null,
              purpose: purpose && purpose !== 'all' ? purpose : 'site',
            },
          })

          if (res.success && res.item) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-150">
      {/* Modal Dialog Box */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[20px] border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--canvas)]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[var(--ink)] leading-tight">{title}</h2>
              <p className="text-[11px] text-[var(--muted)]">
                Click any file to insert it immediately or upload a new asset.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Upload Button */}
        <div className="p-3.5 sm:px-6 border-b border-[var(--line)] bg-[var(--panel)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename..."
              className="w-full h-9 pl-9 pr-3 text-[13px] rounded-full bg-[var(--canvas)]/80 border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:bg-[var(--panel)] focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--accent)]"
            />
          </div>

          {/* Right Side: Type Filters & Upload */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {/* Type Filter Switcher */}
            <div className="flex items-center rounded-full border border-[var(--line)] p-0.5 bg-[var(--canvas)]/80 text-[12px] font-medium">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`h-7 px-3 rounded-full transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('images')}
                className={`h-7 px-3 rounded-full transition cursor-pointer ${
                  filterType === 'images'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Images
              </button>
              <button
                type="button"
                onClick={() => setFilterType('documents')}
                className={`h-7 px-3 rounded-full transition cursor-pointer ${
                  filterType === 'documents'
                    ? 'bg-[var(--panel)] text-[var(--ink)] shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
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
                className="btn btn-primary rounded-full h-8 px-4 text-[13px] shrink-0"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload new</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mx-6 mt-3 p-3 rounded-[6px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[12px] text-rose-600 dark:text-rose-300">
            {uploadError}
          </div>
        )}

        {/* Media Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[350px]">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2.5 text-[var(--muted)]">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
              <span className="text-[12px] font-mono">Loading media library...</span>
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
              className={`h-64 rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                  : 'border-[var(--line)] hover:border-[var(--muted)] bg-[var(--canvas)]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-[6px] bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--muted)] shadow-2xs">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[13px] font-medium text-[var(--ink)]">
                  No files found. Click or drag files here to upload.
                </p>
                <p className="text-[11px] text-[var(--muted)] font-mono">
                  Supports Images (PNG, JPG, WebP, SVG) and Documents (PDF, DOCX) up to 25MB
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
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
                    className="group relative flex flex-col rounded-[14px] border border-[var(--line)] bg-[var(--panel)] overflow-hidden hover:border-[var(--accent)] hover:shadow-lg hover:shadow-indigo-500/5 transition text-left cursor-pointer"
                  >
                    {/* Thumbnail Preview */}
                    <div className="h-32 w-full bg-[var(--canvas)] flex items-center justify-center overflow-hidden relative border-b border-[var(--line)]/60">
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
                          <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold">
                            {item.filename.split('.').pop()}
                          </span>
                        </div>
                      )}

                      {/* Select Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[12px] font-medium">
                        <Check className="w-4 h-4" />
                        <span>Select</span>
                      </div>

                      {/* Purpose / Match Tag */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {clientId && item.clientId === clientId && (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-medium bg-[var(--accent)] text-white uppercase tracking-wider">
                            Client Asset
                          </span>
                        )}
                        {item.purpose && item.purpose !== 'site' && (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-medium bg-black/70 backdrop-blur-xs text-white uppercase tracking-wider">
                            {item.purpose}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* File Meta */}
                    <div className="p-2.5 space-y-0.5">
                      <p
                        className="text-[12px] font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
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
        <div className="px-6 py-3 border-t border-[var(--line)] bg-[var(--canvas)]/40 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[var(--muted)]">
            {items.length} file{items.length === 1 ? '' : 's'} available
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 rounded-[6px] text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] border border-[var(--line)] bg-[var(--panel)] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
