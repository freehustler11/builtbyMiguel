import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { db, clients, reports, type Client } from '../db'
import { verifySessionToken } from '../lib/auth'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'admin_session'

export interface ClientWithReportCount extends Client {
  reportCount: number
}

/**
 * Server Function: Get all clients with report counts
 */
export const getClientsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    const allClients = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.createdAt))

    // Fetch report counts per client
    const allReports = await db.select({ clientId: reports.clientId }).from(reports)
    const countMap: Record<string, number> = {}
    for (const r of allReports) {
      countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
    }

    const clientList: ClientWithReportCount[] = allClients.map((c) => ({
      ...c,
      reportCount: countMap[c.id] || 0,
    }))

    return { clients: clientList }
  }
)

/**
 * Server Function: Get a single client by ID with their reports
 */
export const getClientByIdServerFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized access')
    }

    const [client] = await db.select().from(clients).where(eq(clients.id, data.id))
    if (!client) {
      throw new Error('Client not found')
    }

    const clientReports = await db
      .select()
      .from(reports)
      .where(eq(reports.clientId, data.id))
      .orderBy(desc(reports.createdAt))

    return { client, reports: clientReports }
  })

/**
 * Server Function: Create a new client
 */
export const createClientServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      name: string
      businessName: string
      websiteUrl?: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
    }) => {
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    const [created] = await db
      .insert(clients)
      .values({
        name: data.name.trim(),
        businessName: data.businessName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        primaryColor: data.primaryColor?.trim() || '#2563eb',
        secondaryColor: data.secondaryColor?.trim() || '#1e293b',
      })
      .returning()

    return { success: true, client: created }
  })

/**
 * Server Function: Update an existing client
 */
export const updateClientServerFn = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      id: string
      name: string
      businessName: string
      websiteUrl?: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
    }) => {
      if (!data.id) throw new Error('Client ID is required')
      if (!data.name?.trim()) throw new Error('Contact name is required')
      if (!data.businessName?.trim()) throw new Error('Business name is required')
      return data
    }
  )
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    const [updated] = await db
      .update(clients)
      .set({
        name: data.name.trim(),
        businessName: data.businessName.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        primaryColor: data.primaryColor?.trim() || '#2563eb',
        secondaryColor: data.secondaryColor?.trim() || '#1e293b',
      })
      .where(eq(clients.id, data.id))
      .returning()

    return { success: true, client: updated }
  })

/**
 * Server Function: Delete a client
 */
export const deleteClientServerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => {
    if (!data.id) throw new Error('Client ID is required')
    return data
  })
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME)
    const isAuthenticated = await verifySessionToken(token)
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }

    await db.delete(clients).where(eq(clients.id, data.id))
    return { success: true }
  })
