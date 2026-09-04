import { doublePrecision, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Messages table for storing Audit and Contact form inquiries
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  type: text('type', { enum: ['audit', 'contact'] }).notNull(),
  name: text('name').notNull(),
  businessName: text('business_name').notNull(),
  email: text('email').notNull(),
  location: text('location'),
  websiteUrl: text('website_url'),
  message: text('message'),
  status: text('status', { enum: ['new', 'contacted', 'archived'] })
    .default('new')
    .notNull(),
})

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

/**
 * Posts table for blog articles and SEO content
 */
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  title: text('title').notNull(),
  metaTitle: text('meta_title'),
  slug: text('slug').unique().notNull(),
  keyword: text('keyword'),
  category: text('category'),
  tags: text('tags'),
  summary: text('summary'), // On-page key executive summary / takeaways callout
  excerpt: text('excerpt'), // Blog thumbnail card short preview
  metaDescription: text('meta_description'), // Google search snippet
  featuredImage: text('featured_image'),
  content: text('content').notNull(),
  status: text('status', { enum: ['draft', 'published', 'scheduled'] })
    .default('draft')
    .notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  schemaType: text('schema_type').default('BlogPosting'),
  customSchema: text('custom_schema'),
  // Customizable Call-to-Action (CTA) fields
  sidebarCtaTitle: text('sidebar_cta_title'),
  sidebarCtaText: text('sidebar_cta_text'),
  sidebarCtaButtonText: text('sidebar_cta_button_text'),
  sidebarCtaButtonUrl: text('sidebar_cta_button_url'),
  bottomCtaTitle: text('bottom_cta_title'),
  bottomCtaText: text('bottom_cta_text'),
  bottomCtaButtonText: text('bottom_cta_button_text'),
  bottomCtaButtonUrl: text('bottom_cta_button_url'),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

/**
 * Media table for storing uploaded images, documents, and assets
 */
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  fileUrl: text('file_url').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert

/**
 * Clients table for managing agency clients and their branding
 */
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  businessName: text('business_name').notNull(),
  websiteUrl: text('website_url'),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#2563eb'),
  secondaryColor: text('secondary_color').default('#1e293b'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert

/**
 * Reports table for monthly performance and analytics reports
 */
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  reportMonth: text('report_month').notNull(),
  // GBP Metrics
  gbpCalls: integer('gbp_calls').default(0),
  gbpDirections: integer('gbp_directions').default(0),
  gbpViews: integer('gbp_views').default(0),
  // GSC Metrics
  gscClicks: integer('gsc_clicks').default(0),
  gscImpressions: integer('gsc_impressions').default(0),
  gscPosition: doublePrecision('gsc_position').default(0),
  // GA4 Metrics
  gaUsers: integer('ga_users').default(0),
  gaSessions: integer('ga_sessions').default(0),
  gaViews: integer('ga_views').default(0),
  // Narrative Fields
  summary: text('summary'),
  workCompleted: text('work_completed'),
  nextSteps: text('next_steps'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Report = typeof reports.$inferSelect
export type NewReport = typeof reports.$inferInsert



