import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { db, media, users, type Media } from '../db'
import { assertActiveSession, getEffectivePartnerId } from './auth'
import { uploadFileToStorage, deleteFileFromStorage, getStorageProviderInfo } from './storage'

export interface MediaItemWithPartner extends Media {
  partnerName?: string | null
}

export type MediaPurpose = 'site' | 'client' | 'report'

/**
 * Server Function: Get uploaded media with filtering, search, purpose, and partner isolation.
 * - Partners and employees can ONLY view their agency's uploaded media (media.partnerId === effectivePartnerId).
 * - Superadmins default to own direct media (media.partnerId IS NULL), or can filter by specific partnerId or view 'all'.
 * - Contextual filtering: supports purpose ('all' | 'site' | 'client' | 'report') and clientId.
 */
export const getMediaServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      type?: 'all' | 'images' | 'documents'
      purpose?: 'all' | 'site' | 'client' | 'report'
      clientId?: string
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

    const { type = 'all', purpose = 'all', clientId, q, partnerId } = data || {}

    // Build conditions
    const conditions: any[] = []

    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      // Partner agency / employee: strictly scoped to files where partner_id === effectivePartnerId
      // Superadmin-supplied partnerId parameter is IGNORED for partner/employee as per STANDING RULES.
      conditions.push(eq(media.partnerId, effectivePartnerId))
    } else {
      // Superadmin: default to OWN media (partnerId IS NULL) unless 'all' or specific partner UUID is requested
      if (partnerId === 'all') {
        // No partnerId filter, view everything
      } else if (partnerId && partnerId !== 'direct') {
        conditions.push(eq(media.partnerId, partnerId))
      } else {
        // Default ('direct' or undefined): superadmin's own platform marketing assets
        conditions.push(isNull(media.partnerId))
      }
    }

    // Filter by purpose if specified and not 'all'
    if (purpose && purpose !== 'all') {
      conditions.push(eq(media.purpose, purpose))
    }

    // Filter by client if specified
    if (clientId) {
      conditions.push(eq(media.clientId, clientId))
    }

    let items: Media[] = await db
      .select()
      .from(media)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${media.createdAt} desc nulls last`)

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
 * Server Function: Upload a new media file (Base64 payload) with ownership, client, and purpose tracking
 */
export const uploadMediaServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      filename: string
      mimeType: string
      base64: string
      partnerId?: string | null
      clientId?: string | null
      purpose?: MediaPurpose
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
    // If partner / employee: uploadedBy = auth.userId, partnerId = effectivePartnerId
    // If superadmin: uploadedBy = auth.userId, partnerId = data.partnerId || null
    const uploadedBy = auth.userId || null
    let partnerId: string | null = null
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId) {
      partnerId = effectivePartnerId
    } else if (data.partnerId && data.partnerId !== 'direct' && data.partnerId !== 'all') {
      partnerId = data.partnerId
    }

    const clientId = data.clientId || null
    const purpose = data.purpose || 'site'

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
        clientId,
        purpose,
      })
      .returning()

    return {
      success: true,
      item: inserted,
    }
  })

/**
 * Server Function: Delete a media item from storage and database.
 * Partners and employees can strictly ONLY delete their own agency's uploaded files.
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

    // Authorization: Partner / employee can ONLY delete files assigned to their agency
    const effectivePartnerId = getEffectivePartnerId(auth)
    if (effectivePartnerId && item.partnerId !== effectivePartnerId) {
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
