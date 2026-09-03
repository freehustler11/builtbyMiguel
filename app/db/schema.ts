import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

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
  slug: text('slug').unique().notNull(),
  keyword: text('keyword'),
  metaDescription: text('meta_description'),
  featuredImage: text('featured_image'),
  content: text('content').notNull(),
  status: text('status', { enum: ['draft', 'published'] })
    .default('draft')
    .notNull(),
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

