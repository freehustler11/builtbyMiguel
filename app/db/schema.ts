import {
  type AnyPgColumn,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

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
 * Users table for role-based access control (Superadmin vs Partner Agency)
 */
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: ['superadmin', 'partner', 'client', 'partner_employee'] }).default('partner').notNull(),
    clientId: uuid('client_id'),
    partnerId: uuid('partner_id').references((): AnyPgColumn => users.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').default(true).notNull(),
    name: text('name'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('users_lower_name_idx').on(sql`lower(${table.name})`),
  ]
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

/**
 * Media table for storing uploaded images, documents, and assets (isolated per partner)
 */
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  fileUrl: text('file_url').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  partnerId: uuid('partner_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert

/**
 * Clients table for managing agency clients and their branding
 */
export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    businessName: text('business_name').notNull(),
    websiteUrl: text('website_url'),
    logoUrl: text('logo_url'),
    primaryColor: text('primary_color').default('#2563eb'),
    secondaryColor: text('secondary_color').default('#1e293b'),
    // White-labeling configuration
    isWhiteLabel: boolean('is_white_label').default(false).notNull(),
    partnerName: text('partner_name'),
    partnerLogoUrl: text('partner_logo_url'),
    // Partner assignment (null = direct Superadmin client)
    partnerId: uuid('partner_id').references(() => users.id, { onDelete: 'set null' }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('clients_lower_business_name_idx').on(sql`lower(${table.businessName})`),
  ]
)

export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert

export interface ClientSnapshot {
  businessName: string
  name?: string | null
  websiteUrl?: string | null
  logoUrl?: string | null
  primaryColor?: string
  secondaryColor?: string
  isWhiteLabel?: boolean
  partnerName?: string | null
  partnerLogoUrl?: string | null
}

/**
 * Reports table for monthly performance and analytics reports
 */
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'restrict' }),
  title: text('title').notNull(),
  reportMonth: text('report_month').notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  clientSnapshot: jsonb('client_snapshot').$type<ClientSnapshot>(),
  previousReportId: uuid('previous_report_id').references((): AnyPgColumn => reports.id, { onDelete: 'set null' }),
  // GBP Metrics (Current)
  gbpCalls: integer('gbp_calls').default(0),
  gbpDirections: integer('gbp_directions').default(0),
  gbpViews: integer('gbp_views').default(0),
  gbpWebsiteClicks: integer('gbp_website_clicks').default(0),
  // GBP Metrics (Previous Month Comparison)
  prevGbpCalls: integer('prev_gbp_calls').default(0),
  prevGbpDirections: integer('prev_gbp_directions').default(0),
  prevGbpViews: integer('prev_gbp_views').default(0),
  prevGbpWebsiteClicks: integer('prev_gbp_website_clicks').default(0),
  // GBP Reputation
  gbpRating: doublePrecision('gbp_rating').default(5.0),
  gbpReviewCount: integer('gbp_review_count').default(0),
  gbpReviewsCount: integer('gbp_reviews_count').default(0),
  prevGbpReviewsCount: integer('prev_gbp_reviews_count').default(0),
  // GSC Metrics (Current)
  gscClicks: integer('gsc_clicks').default(0),
  gscImpressions: integer('gsc_impressions').default(0),
  gscCtr: doublePrecision('gsc_ctr').default(0),
  gscPosition: doublePrecision('gsc_position').default(0),
  // GSC Metrics (Previous Month Comparison)
  prevGscClicks: integer('prev_gsc_clicks').default(0),
  prevGscImpressions: integer('prev_gsc_impressions').default(0),
  prevGscCtr: doublePrecision('prev_gsc_ctr').default(0),
  prevGscPosition: doublePrecision('prev_gsc_position').default(0),
  // GA4 Metrics (Current)
  gaUsers: integer('ga_users').default(0),
  gaNewUsers: integer('ga_new_users').default(0),
  gaEngagementRate: doublePrecision('ga_engagement_rate').default(0),
  gaSessions: integer('ga_sessions').default(0),
  gaViews: integer('ga_views').default(0),
  // GA4 Metrics (Previous Month Comparison)
  prevGaUsers: integer('prev_ga_users').default(0),
  prevGaNewUsers: integer('prev_ga_new_users').default(0),
  prevGaEngagementRate: doublePrecision('prev_ga_engagement_rate').default(0),
  prevGaSessions: integer('prev_ga_sessions').default(0),
  prevGaViews: integer('prev_ga_views').default(0),
  // Section Display Customizer Options (JSONB)
  displayOptions: jsonb('display_options').$type<{
    show_agency_info?: boolean
    show_contact_person?: boolean
    show_date_generated?: boolean
    show_summary?: boolean
    show_tables?: boolean
    show_next_steps?: boolean
  }>().default({
    show_agency_info: false,
    show_contact_person: true,
    show_date_generated: false,
    show_summary: true,
    show_tables: true,
    show_next_steps: true,
  }),
  // Deep Metric Tables (JSONB)
  topQueries: jsonb('top_queries').$type<Array<{ query: string; clicks: number | string; impressions: number | string; position: number | string }>>().default([]),
  topPages: jsonb('top_pages').$type<Array<{ path: string; impressions: number | string; position: number | string; clicks?: number | string; users?: number | string }>>().default([]),
  // Narrative Fields
  summaryTitle: text('summary_title').default('Performance Highlights & Strategic Updates'),
  summary: text('summary'),
  workCompleted: text('work_completed'),
  nextSteps: text('next_steps'),
  createdByUserId: uuid('created_by_user_id').references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Report = typeof reports.$inferSelect
export type NewReport = typeof reports.$inferInsert

/**
 * Activity logs table for superadmin auditing & security tracking
 */
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
  userEmail: text('user_email'),
  role: text('role'),
  action: text('action').notNull(), // 'login' | 'logout' | 'failed_login' | 'create_client' | 'delete_report' | 'create_report'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert

/**
 * Landing pages deliverable table
 */
export const landingPages = pgTable(
  'landing_pages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    targetUrl: text('target_url'),
    focusKeyword: text('focus_keyword'),
    ctaGoal: text('cta_goal'),
    status: text('status', { enum: ['planning', 'copywriting', 'design', 'client_review', 'live'] })
      .default('planning')
      .notNull(),
    wentLiveAt: timestamp('went_live_at', { withTimezone: true }),
    assignedTo: uuid('assigned_to').references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('landing_pages_client_id_idx').on(table.clientId),
  ]
)

export type LandingPage = typeof landingPages.$inferSelect
export type NewLandingPage = typeof landingPages.$inferInsert

/**
 * Client articles deliverable table (NOT "blogs" — posts is marketing blog)
 */
export const clientArticles = pgTable(
  'client_articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    draftUrl: text('draft_url'),
    liveUrl: text('live_url'),
    targetKeyword: text('target_keyword'),
    status: text('status', { enum: ['idea', 'drafting', 'review', 'approved', 'live'] })
      .default('idea')
      .notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    writerId: uuid('writer_id').references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('client_articles_client_id_idx').on(table.clientId),
  ]
)

export type ClientArticle = typeof clientArticles.$inferSelect
export type NewClientArticle = typeof clientArticles.$inferInsert

/**
 * Keywords tracking table
 */
export const keywords = pgTable(
  'keywords',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
    keyword: text('keyword').notNull(),
    location: text('location'),
    searchVolume: integer('search_volume'),
    estimatedTraffic: integer('estimated_traffic'),
    currentRank: integer('current_rank'),
    previousRank: integer('previous_rank'),
    targetUrl: text('target_url'),
    status: text('status', { enum: ['research', 'targeting_next', 'in_progress', 'ranking'] })
      .default('research')
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('keywords_client_id_idx').on(table.clientId),
    index('keywords_client_id_status_idx').on(table.clientId, table.status),
  ]
)

export type Keyword = typeof keywords.$inferSelect
export type NewKeyword = typeof keywords.$inferInsert

/**
 * Keyword rank history table (append-only historical tracking)
 */
export const keywordRankHistory = pgTable(
  'keyword_rank_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    keywordId: uuid('keyword_id').notNull().references(() => keywords.id, { onDelete: 'cascade' }),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    rank: integer('rank'),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('keyword_rank_history_unique_idx').on(table.keywordId, table.month, table.year),
    index('keyword_rank_history_kw_ym_idx').on(table.keywordId, table.year, table.month),
  ]
)

export type KeywordRankHistory = typeof keywordRankHistory.$inferSelect
export type NewKeywordRankHistory = typeof keywordRankHistory.$inferInsert

/**
 * Tasks table (nullable client_id for internal work, direct partner_id tenancy)
 */
export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').references(() => clients.id, { onDelete: 'restrict' }),
    partnerId: uuid('partner_id').notNull().references((): AnyPgColumn => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    category: text('category', { enum: ['citations', 'technical_seo', 'on_page', 'backlinks', 'schema', 'gbp'] }).notNull(),
    status: text('status', { enum: ['todo', 'done'] }).default('todo').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    assignedTo: uuid('assigned_to').references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('tasks_client_id_idx').on(table.clientId),
    index('tasks_partner_id_idx').on(table.partnerId),
    index('tasks_assigned_to_idx').on(table.assignedTo),
  ]
)

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

/**
 * Monthly metrics table (living editable entry surface and source of MoM history)
 */
export const monthlyMetrics = pgTable(
  'monthly_metrics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    gscClicks: integer('gsc_clicks'),
    gscImpressions: integer('gsc_impressions'),
    gscCtr: doublePrecision('gsc_ctr'),
    gscPosition: doublePrecision('gsc_position'),
    gaSessions: integer('ga_sessions'),
    gaUsers: integer('ga_users'),
    gaNewUsers: integer('ga_new_users'),
    gaViews: integer('ga_views'),
    gaEngagementRate: doublePrecision('ga_engagement_rate'),
    gbpCalls: integer('gbp_calls'),
    gbpViews: integer('gbp_views'),
    gbpDirections: integer('gbp_directions'),
    gbpWebsiteClicks: integer('gbp_website_clicks'),
    gbpRating: doublePrecision('gbp_rating'),
    gbpReviewsCount: integer('gbp_reviews_count'),
    semrushAuthorityScore: integer('semrush_authority_score'),
    semrushRankedKeywords: integer('semrush_ranked_keywords'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('monthly_metrics_client_month_year_unique_idx').on(table.clientId, table.month, table.year),
    index('monthly_metrics_client_id_idx').on(table.clientId),
  ]
)

export type MonthlyMetric = typeof monthlyMetrics.$inferSelect
export type NewMonthlyMetric = typeof monthlyMetrics.$inferInsert
