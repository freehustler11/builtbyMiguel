import { createServerFn } from '@tanstack/react-start'
import { eq, desc, and } from 'drizzle-orm'
import { db, posts, postComments } from '../db'
import { assertSuperadminSession } from './auth'
import { logActivity } from './activity-logger'

async function getServerUtils() {
  return await import(/* @vite-ignore */ '@tanstack/react-start/server')
}

// In-memory rate limiter: Map of IP address -> last submission timestamp (ms)
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 submission per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const lastTime = rateLimitMap.get(ip)
  if (lastTime && now - lastTime < RATE_LIMIT_WINDOW_MS) {
    return true
  }
  rateLimitMap.set(ip, now)
  // Prune entries older than 5 minutes periodically
  if (rateLimitMap.size > 2000) {
    const cutoff = now - 5 * 60 * 1000
    for (const [k, v] of rateLimitMap.entries()) {
      if (v < cutoff) rateLimitMap.delete(k)
    }
  }
  return false
}

/**
 * Public Server Function: Submit a comment on a published blog post
 */
export const submitCommentServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      postId: string
      name: string
      email: string
      content: string
      honeypot?: string
    }) => {
      if (!data.postId || typeof data.postId !== 'string') {
        throw new Error('Post ID is required')
      }
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Name is required')
      }
      if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
        throw new Error('Email is required')
      }
      // Basic email regex format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email.trim())) {
        throw new Error('Please provide a valid email address')
      }
      if (!data.content || typeof data.content !== 'string' || !data.content.trim()) {
        throw new Error('Comment text is required')
      }
      if (data.content.trim().length < 3) {
        throw new Error('Comment must be at least 3 characters')
      }
      if (data.content.trim().length > 3000) {
        throw new Error('Comment must not exceed 3000 characters')
      }
      return {
        postId: data.postId.trim(),
        name: data.name.trim().slice(0, 100),
        email: data.email.trim().toLowerCase().slice(0, 150),
        content: data.content.trim(),
        honeypot: data.honeypot?.trim() || '',
      }
    },
  )
  .handler(async ({ data }) => {
    // 1. Honeypot check: If the hidden honeypot field is filled, silently ignore
    if (data.honeypot) {
      return {
        success: true,
        message: 'Thanks! Your comment is awaiting approval and will appear once reviewed.',
      }
    }

    // 2. Extract Client IP & User Agent for rate-limiting
    let clientIp = '127.0.0.1'
    let userAgent = ''
    try {
      const { getRequestHeader } = await getServerUtils()
      clientIp =
        getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ||
        getRequestHeader('x-real-ip') ||
        '127.0.0.1'
      userAgent = getRequestHeader('user-agent') || ''
    } catch {
      // Server utils unavailable in local mock
    }

    // 3. Rate limiting check (1 comment per IP per minute)
    if (isRateLimited(clientIp)) {
      throw new Error('Please wait a minute before submitting another comment.')
    }

    // 4. Verify post exists and is currently published
    const [post] = await db
      .select({ id: posts.id, status: posts.status })
      .from(posts)
      .where(eq(posts.id, data.postId))

    if (!post || post.status !== 'published') {
      throw new Error('This article is not accepting comments.')
    }

    // 5. Insert new comment with status 'pending'
    await db.insert(postComments).values({
      postId: data.postId,
      name: data.name,
      email: data.email,
      content: data.content,
      status: 'pending',
      ipHash: clientIp,
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
    })

    return {
      success: true,
      message: 'Thanks! Your comment is awaiting approval and will appear once reviewed.',
    }
  })

/**
 * Public Server Function: Get approved comments for a specific post
 * Strictly excludes email addresses and sensitive metadata
 */
export const getPublicPostCommentsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { postId: string }) => {
    if (!data.postId) throw new Error('Post ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        id: postComments.id,
        name: postComments.name,
        content: postComments.content,
        createdAt: postComments.createdAt,
      })
      .from(postComments)
      .where(
        and(
          eq(postComments.postId, data.postId),
          eq(postComments.status, 'published'),
        ),
      )
      .orderBy(desc(postComments.createdAt))

    return {
      comments: rows,
    }
  })

export interface AdminCommentRow {
  id: string
  postId: string
  postTitle: string | null
  postSlug: string | null
  name: string
  email: string
  content: string
  status: 'pending' | 'published' | 'rejected' | 'spam'
  createdAt: Date
}

/**
 * Admin Server Function: Get comments with post info for moderation (Superadmin only)
 */
export const getAdminCommentsServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      status?: 'all' | 'pending' | 'published' | 'rejected' | 'spam'
      search?: string
    }) => {
      return data || {}
    },
  )
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const { status = 'all', search } = data || {}

    // 1. Fetch counts across all statuses
    const allComments = await db
      .select({
        id: postComments.id,
        status: postComments.status,
      })
      .from(postComments)

    const counts = {
      all: allComments.length,
      pending: allComments.filter((c) => c.status === 'pending').length,
      published: allComments.filter((c) => c.status === 'published').length,
      rejected: allComments.filter((c) => c.status === 'rejected').length,
      spam: allComments.filter((c) => c.status === 'spam').length,
    }

    // 2. Query comments with joined post data
    let results = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        postTitle: posts.title,
        postSlug: posts.slug,
        name: postComments.name,
        email: postComments.email,
        content: postComments.content,
        status: postComments.status,
        createdAt: postComments.createdAt,
      })
      .from(postComments)
      .leftJoin(posts, eq(postComments.postId, posts.id))
      .orderBy(desc(postComments.createdAt))

    if (status && status !== 'all') {
      results = results.filter((c) => c.status === status)
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          (c.postTitle && c.postTitle.toLowerCase().includes(q)),
      )
    }

    return {
      comments: results as AdminCommentRow[],
      counts,
    }
  })

/**
 * Admin Server Function: Moderate a comment (Approve / Reject / Mark as Spam / Delete)
 */
export const moderateCommentServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      commentId: string
      action: 'approve' | 'reject' | 'spam' | 'delete'
    }) => {
      if (!data.commentId) throw new Error('Comment ID is required')
      if (!['approve', 'reject', 'spam', 'delete'].includes(data.action)) {
        throw new Error('Invalid moderation action')
      }
      return data
    },
  )
  .handler(async ({ data }) => {
    const session = await assertSuperadminSession()

    const [comment] = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, data.commentId))

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (data.action === 'delete') {
      await db.delete(postComments).where(eq(postComments.id, data.commentId))
      await logActivity({
        userId: session.userId || null,
        userEmail: session.email || null,
        role: 'superadmin',
        action: `comment_deleted_${data.commentId}`,
      })
      return { success: true, newStatus: 'deleted' }
    }

    const statusMap = {
      approve: 'published' as const,
      reject: 'rejected' as const,
      spam: 'spam' as const,
    }

    const nextStatus = statusMap[data.action]

    await db
      .update(postComments)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(postComments.id, data.commentId))

    await logActivity({
      userId: session.userId || null,
      userEmail: session.email || null,
      role: 'superadmin',
      action: `comment_${data.action}_${data.commentId}`,
    })

    return { success: true, newStatus: nextStatus }
  })
