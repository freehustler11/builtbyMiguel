import { createServerFn } from '@tanstack/react-start'
import { desc, eq, ilike, or } from 'drizzle-orm'
import { db, media, type Media } from '../db'
import { verifySessionToken } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'
import { uploadFileToStorage, deleteFileFromStorage, getStorageProviderInfo } from './storage'

const COOKIE_NAME = 'admin_session'

/**
 * Server Function: Get all uploaded media with filtering and search
 */
export const getMediaServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      type?: 'all' | 'images' | 'documents'
      q?: string
    }) => {
      return data || {}
    },
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    const { type = 'all', q } = data || {}

    let items: Media[] = await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt))

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
 * Server Function: Upload a new media file (Base64 payload)
 */
export const uploadMediaServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      filename: string
      mimeType: string
      base64: string
    }) => {
      if (!data || !data.filename || !data.base64) {
        throw new Error('Invalid file payload')
      }
      return data
    },
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    // Convert Base64 data string to Buffer
    const cleanBase64 = data.base64.replace(/^data:.*?;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')

    // Enforce 25MB max file size
    if (buffer.length > 25 * 1024 * 1024) {
      throw new Error('File size exceeds the 25MB limit.')
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
      })
      .returning()

    return {
      success: true,
      item: inserted,
    }
  })

/**
 * Server Function: Delete a media item from storage and database
 */
export const deleteMediaServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data || !data.id) {
      throw new Error('Media ID is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    const [item] = await db.select().from(media).where(eq(media.id, data.id))

    if (!item) {
      throw new Error('Media item not found')
    }

    // Remove from physical storage
    await deleteFileFromStorage(item.fileUrl)

    // Remove from database
    await db.delete(media).where(eq(media.id, data.id))

    return {
      success: true,
    }
  })
