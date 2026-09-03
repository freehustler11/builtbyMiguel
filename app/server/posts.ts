import { createServerFn } from '@tanstack/react-start'
import { desc, eq, and, or, lte } from 'drizzle-orm'
import { db, posts, type Post } from '../db'
import { verifySessionToken } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'admin_session'

/**
 * Server Function: Get all posts for Admin CMS
 */
export const getAdminPostsServerFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: {
      status?: 'all' | 'published' | 'draft' | 'scheduled'
      search?: string
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

    const { status = 'all', search } = data || {}

    let results: Post[]
    if (status && status !== 'all') {
      results = await db
        .select()
        .from(posts)
        .where(eq(posts.status, status))
        .orderBy(desc(posts.createdAt))
    } else {
      results = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.tags && p.tags.toLowerCase().includes(q)) ||
          (p.keyword && p.keyword.toLowerCase().includes(q)) ||
          (p.metaDescription && p.metaDescription.toLowerCase().includes(q)),
      )
    }

    const allPosts = await db.select().from(posts)
    const counts = {
      all: allPosts.length,
      published: allPosts.filter((p) => p.status === 'published').length,
      draft: allPosts.filter((p) => p.status === 'draft').length,
      scheduled: allPosts.filter((p) => p.status === 'scheduled').length,
    }

    return {
      posts: results,
      counts,
    }
  })

/**
 * Server Function: Get post by ID for Admin CMS
 */
export const getPostByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Post ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    const [post] = await db.select().from(posts).where(eq(posts.id, data.id))
    if (!post) {
      throw new Error('Post not found')
    }
    return { post }
  })

/**
 * Server Function: Create a new blog post
 */
export const createPostServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      title: string
      slug: string
      content: string
      keyword?: string
      category?: string
      tags?: string
      metaDescription?: string
      featuredImage?: string
      status: 'draft' | 'published' | 'scheduled'
      scheduledAt?: string | null
      schemaType?: string
      customSchema?: string
      sidebarCtaTitle?: string
      sidebarCtaText?: string
      sidebarCtaButtonText?: string
      sidebarCtaButtonUrl?: string
      bottomCtaTitle?: string
      bottomCtaText?: string
      bottomCtaButtonText?: string
      bottomCtaButtonUrl?: string
    }) => {
      if (!data.title?.trim()) throw new Error('Title is required')
      if (!data.slug?.trim()) throw new Error('Slug is required')
      if (!data.content?.trim()) throw new Error('Content is required')
      return data
    },
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    // Clean slug
    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check slug uniqueness
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, cleanSlug))

    if (existing.length > 0) {
      throw new Error(`A post with slug "${cleanSlug}" already exists. Please choose a unique slug.`)
    }

    const now = new Date()
    const scheduledDate = data.scheduledAt ? new Date(data.scheduledAt) : null

    const [created] = await db
      .insert(posts)
      .values({
        title: data.title.trim(),
        slug: cleanSlug,
        content: data.content.trim(),
        keyword: data.keyword?.trim() || null,
        category: data.category?.trim() || 'Strategy',
        tags: data.tags?.trim() || null,
        metaDescription: data.metaDescription?.trim() || null,
        featuredImage: data.featuredImage?.trim() || null,
        status: data.status,
        scheduledAt: scheduledDate,
        schemaType: data.schemaType?.trim() || 'BlogPosting',
        customSchema: data.customSchema?.trim() || null,
        sidebarCtaTitle: data.sidebarCtaTitle?.trim() || null,
        sidebarCtaText: data.sidebarCtaText?.trim() || null,
        sidebarCtaButtonText: data.sidebarCtaButtonText?.trim() || null,
        sidebarCtaButtonUrl: data.sidebarCtaButtonUrl?.trim() || null,
        bottomCtaTitle: data.bottomCtaTitle?.trim() || null,
        bottomCtaText: data.bottomCtaText?.trim() || null,
        bottomCtaButtonText: data.bottomCtaButtonText?.trim() || null,
        bottomCtaButtonUrl: data.bottomCtaButtonUrl?.trim() || null,
        publishedAt: data.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return { success: true, post: created }
  })

/**
 * Server Function: Update an existing blog post
 */
export const updatePostServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      title: string
      slug: string
      content: string
      keyword?: string
      category?: string
      tags?: string
      metaDescription?: string
      featuredImage?: string
      status: 'draft' | 'published' | 'scheduled'
      scheduledAt?: string | null
      schemaType?: string
      customSchema?: string
      sidebarCtaTitle?: string
      sidebarCtaText?: string
      sidebarCtaButtonText?: string
      sidebarCtaButtonUrl?: string
      bottomCtaTitle?: string
      bottomCtaText?: string
      bottomCtaButtonText?: string
      bottomCtaButtonUrl?: string
    }) => {
      if (!data.id) throw new Error('Post ID is required')
      if (!data.title?.trim()) throw new Error('Title is required')
      if (!data.slug?.trim()) throw new Error('Slug is required')
      if (!data.content?.trim()) throw new Error('Content is required')
      return data
    },
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    const [current] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, data.id))

    if (!current) {
      throw new Error('Post not found')
    }

    // Clean slug
    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check slug collision with other posts
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, cleanSlug))

    const conflict = existing.find((p) => p.id !== data.id)
    if (conflict) {
      throw new Error(`A post with slug "${cleanSlug}" already exists.`)
    }

    const now = new Date()
    let publishedAt = current.publishedAt
    if (data.status === 'published' && !publishedAt) {
      publishedAt = now
    } else if (data.status === 'draft') {
      publishedAt = null
    }

    const scheduledDate = data.scheduledAt ? new Date(data.scheduledAt) : null

    const [updated] = await db
      .update(posts)
      .set({
        title: data.title.trim(),
        slug: cleanSlug,
        content: data.content.trim(),
        keyword: data.keyword?.trim() || null,
        category: data.category?.trim() || 'Strategy',
        tags: data.tags?.trim() || null,
        metaDescription: data.metaDescription?.trim() || null,
        featuredImage: data.featuredImage?.trim() || null,
        status: data.status,
        scheduledAt: scheduledDate,
        schemaType: data.schemaType?.trim() || 'BlogPosting',
        customSchema: data.customSchema?.trim() || null,
        sidebarCtaTitle: data.sidebarCtaTitle?.trim() || null,
        sidebarCtaText: data.sidebarCtaText?.trim() || null,
        sidebarCtaButtonText: data.sidebarCtaButtonText?.trim() || null,
        sidebarCtaButtonUrl: data.sidebarCtaButtonUrl?.trim() || null,
        bottomCtaTitle: data.bottomCtaTitle?.trim() || null,
        bottomCtaText: data.bottomCtaText?.trim() || null,
        bottomCtaButtonText: data.bottomCtaButtonText?.trim() || null,
        bottomCtaButtonUrl: data.bottomCtaButtonUrl?.trim() || null,
        publishedAt,
        updatedAt: now,
      })
      .where(eq(posts.id, data.id))
      .returning()

    return { success: true, post: updated }
  })

/**
 * Server Function: Delete a blog post
 */
export const deletePostServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Post ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    await db.delete(posts).where(eq(posts.id, data.id))
    return { success: true }
  })

/**
 * Public Server Function: Get all published/live posts for the public blog
 */
export const getPublicPostsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const now = new Date()
    const allPosts = await db
      .select()
      .from(posts)
      .where(
        or(
          eq(posts.status, 'published'),
          and(eq(posts.status, 'scheduled'), lte(posts.scheduledAt, now)),
        ),
      )
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))

    return { posts: allPosts }
  },
)

/**
 * Public Server Function: Get a single post by slug and fetch intelligently matched Related Blogs
 */
export const getPublicPostBySlugServerFn = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => {
    if (!data.slug) throw new Error('Slug is required')
    return data
  })
  .handler(async ({ data }) => {
    const now = new Date()
    const [post] = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.slug, data.slug),
          or(
            eq(posts.status, 'published'),
            and(eq(posts.status, 'scheduled'), lte(posts.scheduledAt, now)),
          ),
        ),
      )

    if (!post) {
      return { post: null, relatedPosts: [] }
    }

    // Fetch all other published posts to find the most relevant ones
    const allPublic = await db
      .select()
      .from(posts)
      .where(
        and(
          or(
            eq(posts.status, 'published'),
            and(eq(posts.status, 'scheduled'), lte(posts.scheduledAt, now)),
          ),
        ),
      )
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))

    const otherPosts = allPublic.filter((p) => p.id !== post.id)

    // Current post tags array
    const postTags = (post.tags || '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    // Score other posts based on Category and Tag match
    const scoredPosts = otherPosts.map((other) => {
      let score = 0
      // Same category match = +10 pts
      if (
        post.category &&
        other.category &&
        post.category.toLowerCase() === other.category.toLowerCase()
      ) {
        score += 10
      }

      // Shared tags match = +5 pts per tag
      if (other.tags && postTags.length > 0) {
        const otherTags = other.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
        const shared = otherTags.filter((t) => postTags.includes(t))
        score += shared.length * 5
      }

      return { post: other, score }
    })

    // Sort by relevance score, then recent
    scoredPosts.sort((a, b) => b.score - a.score)

    const related = scoredPosts.slice(0, 3).map((item) => item.post)

    return { post, relatedPosts: related }
  })
