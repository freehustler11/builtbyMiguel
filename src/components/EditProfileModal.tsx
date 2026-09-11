import React, { useState, useEffect, useRef } from 'react'
import { User, Camera, Upload, X, Loader2, CheckCircle2, Trash2 } from 'lucide-react'
import { getMyProfileServerFn, updateMyProfileServerFn } from '../server/team'
import { uploadMediaServerFn } from '../server/media'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (updatedUser: { name: string | null; avatarUrl: string | null }) => void
}

export function EditProfileModal({ isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setError(null)
      setSuccessMsg(null)
      setIsLoading(true)
      getMyProfileServerFn()
        .then((res) => {
          setName(res.name || '')
          setEmail(res.email || '')
          setRole(res.role || '')
          setAvatarUrl(res.avatarUrl || null)
          setPreviewUrl(res.avatarUrl || null)
        })
        .catch((err) => {
          setError(err.message || 'Failed to load profile')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = reader.result as string
          setPreviewUrl(base64)

          const res = await uploadMediaServerFn({
            data: {
              filename: file.name,
              mimeType: file.type,
              base64,
              purpose: 'site',
            },
          })

          if (res?.item?.fileUrl) {
            setAvatarUrl(res.item.fileUrl)
            setPreviewUrl(res.item.fileUrl)
          }
        } catch (uploadErr: any) {
          setError(uploadErr.message || 'Failed to upload image')
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError(err.message || 'Failed to read image file')
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await updateMyProfileServerFn({
        data: {
          name: name.trim() || null,
          avatarUrl: avatarUrl || null,
        },
      })

      if (res.success) {
        setSuccessMsg('Profile updated successfully!')
        if (onSuccess) {
          onSuccess({
            name: res.user.name,
            avatarUrl: res.user.avatarUrl,
          })
        }
        setTimeout(() => {
          onClose()
        }, 800)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = (name || email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[var(--panel)] rounded-[20px] border border-[var(--line)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] bg-[var(--canvas)]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--ink)] leading-tight">Edit Profile</h3>
              <p className="text-[11px] text-[var(--muted)]">Update your photo and personal details</p>
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

        {/* Content */}
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-2 text-[var(--muted)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="text-[12px]">Loading profile...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-[6px] bg-[var(--danger-subtle)] border border-[var(--danger)]/30 text-[var(--danger)] text-[12px] flex items-center gap-2">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-[6px] bg-[var(--success-subtle)] border border-[var(--success)]/30 text-[var(--success)] text-[12px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-3.5 rounded-[14px] bg-[var(--canvas)]/70 border border-[var(--line)]">
              <div className="relative group shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={name || 'Avatar'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--panel)] shadow-sm bg-[var(--panel)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-white text-[18px] font-bold flex items-center justify-center shadow-sm">
                    {initials}
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="text-[13px] font-semibold text-[var(--ink)]">Profile Picture</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading || isSaving}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSaving}
                    className="h-7 inline-flex items-center gap-1.5 px-2.5 rounded-[6px] text-[11px] font-medium bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3 h-3 text-[var(--muted)]" />
                    <span>{previewUrl ? 'Change image' : 'Upload image'}</span>
                  </button>

                  {previewUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploading || isSaving}
                      className="h-7 inline-flex items-center gap-1 px-2 rounded-[6px] text-[11px] font-medium text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition cursor-pointer disabled:opacity-50"
                      title="Remove profile picture"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[var(--muted)]">PNG, JPG, or WebP up to 5MB.</p>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full h-9 px-3 rounded-[10px] text-[13px] bg-[var(--canvas)]/70 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:bg-[var(--panel)] focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--accent)] transition"
              />
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-9 px-3 rounded-[10px] text-[13px] bg-[var(--canvas)]/40 border border-[var(--line)] text-[var(--muted)] cursor-not-allowed font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="btn btn-ghost rounded-full h-8 px-4 text-[12px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="btn btn-primary rounded-full h-8 px-5 text-[12px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save changes</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
