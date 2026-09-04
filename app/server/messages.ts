import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { db, messages, type Message } from '../db'
import { assertSuperadminSession } from './auth'

/**
 * Server Function: Fetch messages with optional status filter (Superadmin only)
 */
export const getMessagesServerFn = createServerFn({ method: 'GET' })
  .validator((data?: { status?: 'all' | 'new' | 'contacted' | 'archived'; search?: string }) => {
    return data || {}
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()


    const { status = 'all', search } = data || {}

    let query = db.select().from(messages)

    let results: Message[]
    if (status && status !== 'all') {
      results = await db
        .select()
        .from(messages)
        .where(eq(messages.status, status))
        .orderBy(desc(messages.createdAt))
    } else {
      results = await db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
    }

    // Filter by search query in memory if provided
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.businessName.toLowerCase().includes(q) ||
          (m.location && m.location.toLowerCase().includes(q)) ||
          (m.websiteUrl && m.websiteUrl.toLowerCase().includes(q)) ||
          (m.message && m.message.toLowerCase().includes(q)),
      )
    }

    // Compute status counts
    const allMessages = await db.select().from(messages)
    const counts = {
      all: allMessages.length,
      new: allMessages.filter((m) => m.status === 'new').length,
      contacted: allMessages.filter((m) => m.status === 'contacted').length,
      archived: allMessages.filter((m) => m.status === 'archived').length,
    }

    return {
      messages: results,
      counts,
    }
  })

/**
 * Server Function: Update message status (new, contacted, archived)
 */
export const updateMessageStatusServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string; status: 'new' | 'contacted' | 'archived' }) => {
    if (!data.id || !data.status) {
      throw new Error('Message ID and status are required')
    }
    return data
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    const [updated] = await db
      .update(messages)
      .set({ status: data.status })
      .where(eq(messages.id, data.id))
      .returning()

    return { success: true, message: updated }
  })

/**
 * Server Function: Delete a message permanently (Superadmin only)
 */
export const deleteMessageServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) {
      throw new Error('Message ID is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    await assertSuperadminSession()

    await db.delete(messages).where(eq(messages.id, data.id))
    return { success: true }
  })

