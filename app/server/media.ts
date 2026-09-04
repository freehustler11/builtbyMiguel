import { createServerFn } from '@tanstack/react-start'
import { desc, eq, isNull } from 'drizzle-orm'
import { db, media, users, type Media } from '../db'
import { assertActiveSession } from './auth'
import { uploadFileToStorage, deleteFileFromStorage, getStorageProviderInfo } from './storage'

export interface MediaItemWithPartner extends Media {
  partnerName?: string | null
}

/**
 * Server Function: Get uploaded media with filtering, search, and partner isolation.
 * - Partners can ONLY view their own uploaded media (media.partnerId === auth.userId).
 * - Superadmins can view all media or filter by partnerId ('all' | 'direct' | partner UUID).
 */
export const getMediaServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      type?: 'all' | 'images' | 'documents'
      q?: string
      partnerId?: string
    }) => {
      return data || {}
    },
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const { type = 'all', q, partnerId } = data || {}

    let items: Media[]

    if (auth.role === 'partner') {
      // Partner agency: strictly scoped to files where partner_id === auth.userId
      items = await db
        .select()
        .from(media)
        .where(eq(media.partnerId, auth.userId!))
        .orderBy(desc(media.createdAt))
    } else {
      // Superadmin: can view all, direct agency files, or filter by specific partner
      if (partnerId && partnerId !== 'all') {
        if (partnerId === 'direct') {
          items = await db
            .select()
            .from(media)
            .where(isNull(media.partnerId))
            .orderBy(desc(media.createdAt))
        } else {
          items = await db
            .select()
            .from(media)
            .where(eq(media.partnerId, partnerId))
            .orderBy(desc(media.createdAt))
        }
      } else {
        items = await db
          .select()
          .from(media)
          .orderBy(desc(media.createdAt))
      }
    }

    // Filter by type
    if (type === 'images') {
      items = items.filter((item) => item.mimeType.startsWith('image/'))
    } else if (type === 'documents') {
      items = items.filter(
        (item) =>
          !item.mimeType.startsWith('image/') ||
          item.mimeType.includes('pdf') ||
          item.mimeType.includes('document') ||
          item.mimeType.includes('sheet') ||
          item.mimeType.includes('text')
      )
    }

    // Filter by search query
    if (q && q.trim()) {
      const term = q.toLowerCase().trim()
      items = items.filter(
        (item) =>
          item.filename.toLowerCase().includes(term) ||
          item.mimeType.toLowerCase().includes(term)
      )
    }

    const storageInfo = getStorageProviderInfo()

    return {
      media: items,
      storageInfo,
      totalCount: items.length,
    }
  })

/**
 * Server Function: Upload a new media file (Base64 payload) with ownership tracking
 */
export const uploadMediaServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      filename: string
      mimeType: string
      base64: string
      partnerId?: string | null
    }) => {
      if (!data || !data.filename || !data.base64) {
        throw new Error('Invalid file payload')
      }
      return data
    },
  )
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    // Convert Base64 data string to Buffer
    const cleanBase64 = data.base64.replace(/^data:.*?;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')

    // Enforce 25MB max file size
    if (buffer.length > 25 * 1024 * 1024) {
      throw new Error('File size exceeds the 25MB limit.')
    }

    // Determine ownership:
    // If partner: uploadedBy = auth.userId, partnerId = auth.userId
    // If superadmin: uploadedBy = auth.userId, partnerId = data.partnerId || null
    const uploadedBy = auth.userId || null
    let partnerId: string | null = null
    if (auth.role === 'partner') {
      partnerId = auth.userId
    } else if (data.partnerId && data.partnerId !== 'direct' && data.partnerId !== 'all') {
      partnerId = data.partnerId
    }

    // Upload to configured storage backend (S3 / Supabase / Local)
    const { fileUrl } = await uploadFileToStorage({
      filename: data.filename,
      mimeType: data.mimeType || 'application/octet-stream',
      buffer,
    })

    // Record in database
    const [inserted] = await db
      .insert(media)
      .values({
        filename: data.filename,
        fileUrl,
        mimeType: data.mimeType || 'application/octet-stream',
        fileSize: buffer.length,
        uploadedBy,
        partnerId,
      })
      .returning()

    return {
      success: true,
      item: inserted,
    }
  })

/**
 * Server Function: Delete a media item from storage and database.
 * Partners can strictly ONLY delete their own agency's uploaded files.
 */
export const deleteMediaServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data || !data.id) {
      throw new Error('Media ID is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    const auth = await assertActiveSession()
    if (auth.role === 'client') {
      throw new Error('Unauthorized: Admin or Partner access required')
    }

    const [item] = await db.select().from(media).where(eq(media.id, data.id))

    if (!item) {
      throw new Error('Media item not found')
    }

    // Authorization: Partner can ONLY delete files assigned to their agency
    if (auth.role === 'partner' && item.partnerId !== auth.userId) {
      throw new Error('Unauthorized: You do not have permission to delete this media file')
    }

    // Remove from physical storage
    await deleteFileFromStorage(item.fileUrl)

    // Remove from database
    await db.delete(media).where(eq(media.id, data.id))

    return {
      success: true,
    }
  })
