import 'dotenv/config'
import postgres from 'postgres'

export async function runMigrations() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:zvorhklm2hyhlzn1@2.29.45.40:5432/postgres'
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL is not set. Skipping database table initialization.')
    return
  }

  console.log('🔄 Checking & initializing PostgreSQL database tables...')
  const sql = postgres(connectionString, { max: 1 })

  try {
    // 1. Ensure messages table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "type" text NOT NULL,
        "name" text NOT NULL,
        "business_name" text NOT NULL,
        "email" text NOT NULL,
        "location" text,
        "website_url" text,
        "message" text,
        "status" text DEFAULT 'new' NOT NULL
      );
    `

    // 2. Ensure posts table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        "published_at" timestamp with time zone,
        "title" text NOT NULL,
        "slug" text NOT NULL,
        "keyword" text,
        "meta_description" text,
        "featured_image" text,
        "content" text NOT NULL,
        "status" text DEFAULT 'draft' NOT NULL
      );
    `

    // 3. Ensure unique index on posts.slug
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_unique" ON "posts" ("slug");
    `

    // 4. Ensure CTA, scheduling, schema, category & tags columns exist on posts table
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "meta_title" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "tags" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "summary" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "excerpt" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "scheduled_at" timestamp with time zone`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "schema_type" text DEFAULT 'BlogPosting'`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "custom_schema" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "sidebar_cta_title" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "sidebar_cta_text" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "sidebar_cta_button_url" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "bottom_cta_title" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "bottom_cta_text" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "bottom_cta_button_text" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "bottom_cta_button_url" text`

    // 5. Ensure media table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "media" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "filename" text NOT NULL,
        "file_url" text NOT NULL,
        "mime_type" text NOT NULL,
        "file_size" integer NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `

    // 6. Ensure clients table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "clients" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "business_name" text NOT NULL,
        "website_url" text,
        "logo_url" text,
        "primary_color" text DEFAULT '#2563eb',
        "secondary_color" text DEFAULT '#1e293b',
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "is_white_label" boolean DEFAULT false NOT NULL`
    await sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "partner_name" text`
    await sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "partner_logo_url" text`
    await sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "partner_id" uuid REFERENCES "users"("id") ON DELETE SET NULL`
    await sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone`
    await sql`CREATE INDEX IF NOT EXISTS "clients_partner_id_idx" ON "clients" ("partner_id")`
    await sql`CREATE INDEX IF NOT EXISTS "clients_deleted_at_idx" ON "clients" ("deleted_at")`

    // 7. Ensure users table exists (RBAC: Superadmin vs Partner Agency)
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" text UNIQUE NOT NULL,
        "password_hash" text NOT NULL,
        "role" text DEFAULT 'partner' NOT NULL,
        "client_id" uuid,
        "name" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "users_client_id_idx" ON "users" ("client_id")`
    await sql`CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email")`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "partner_id" uuid REFERENCES "users"("id") ON DELETE CASCADE`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone`
    await sql`CREATE INDEX IF NOT EXISTS "users_partner_id_idx" ON "users" ("partner_id")`
    await sql`CREATE INDEX IF NOT EXISTS "users_deleted_at_idx" ON "users" ("deleted_at")`
    await sql`UPDATE "users" SET "role" = 'superadmin' WHERE "role" = 'admin'`
    await sql`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'partner'`

    // 8. Ensure reports table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "reports" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid REFERENCES "clients"("id") ON DELETE SET NULL,
        "title" text NOT NULL,
        "report_month" text NOT NULL,
        "gbp_calls" integer DEFAULT 0,
        "gbp_directions" integer DEFAULT 0,
        "gbp_views" integer DEFAULT 0,
        "gsc_clicks" integer DEFAULT 0,
        "gsc_impressions" integer DEFAULT 0,
        "gsc_position" double precision DEFAULT 0,
        "ga_users" integer DEFAULT 0,
        "ga_sessions" integer DEFAULT 0,
        "ga_views" integer DEFAULT 0,
        "summary" text,
        "work_completed" text,
        "next_steps" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "previous_report_id" uuid REFERENCES "reports"("id") ON DELETE SET NULL`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gbp_calls" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gbp_directions" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gbp_views" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "gbp_rating" double precision DEFAULT 5.0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "gbp_review_count" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gsc_clicks" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gsc_impressions" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gsc_position" double precision DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_ga_users" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_ga_sessions" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_ga_views" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "gbp_reviews_count" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gbp_reviews_count" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "gsc_ctr" double precision DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gsc_ctr" double precision DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "ga_new_users" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_ga_new_users" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "ga_engagement_rate" double precision DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_ga_engagement_rate" double precision DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "display_options" jsonb DEFAULT '{"show_agency_info":false,"show_contact_person":true,"show_date_generated":false,"show_summary":true,"show_tables":true,"show_next_steps":true}'::jsonb`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "top_queries" jsonb DEFAULT '[]'::jsonb`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "top_pages" jsonb DEFAULT '[]'::jsonb`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "gbp_website_clicks" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "prev_gbp_website_clicks" integer DEFAULT 0`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "summary_title" text DEFAULT 'Performance Highlights & Strategic Updates'`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "period_start" timestamp with time zone`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "period_end" timestamp with time zone`
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "client_snapshot" jsonb`
    await sql`CREATE INDEX IF NOT EXISTS "reports_period_start_idx" ON "reports" ("period_start")`

    // 9. Ensure media table isolation per partner
    await sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "uploaded_by" uuid REFERENCES "users"("id") ON DELETE SET NULL`
    await sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "partner_id" uuid REFERENCES "users"("id") ON DELETE CASCADE`
    await sql`CREATE INDEX IF NOT EXISTS "media_partner_id_idx" ON "media" ("partner_id")`
    await sql`CREATE INDEX IF NOT EXISTS "media_uploaded_by_idx" ON "media" ("uploaded_by")`

    // 10. Ensure reports.client_id is nullable and has ON DELETE SET NULL in PostgreSQL
    await sql`ALTER TABLE "reports" ALTER COLUMN "client_id" DROP NOT NULL`
    await sql`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (
          SELECT tc.constraint_name 
          FROM information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'reports' 
            AND kcu.column_name = 'client_id'
        ) LOOP
          EXECUTE 'ALTER TABLE "reports" DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        END LOOP;
        ALTER TABLE "reports" ADD CONSTRAINT "reports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT;
      END $$;
    `

    // 11. Ensure reports.created_by_user_id column exists
    await sql`ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "created_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL`
    await sql`CREATE INDEX IF NOT EXISTS "reports_created_by_user_id_idx" ON "reports" ("created_by_user_id")`

    // 12. Ensure activity_logs table exists for superadmin activity tracking
    await sql`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "user_email" text,
        "role" text,
        "action" text NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs" ("created_at" DESC)`
    await sql`CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs" ("action")`
    await sql`CREATE INDEX IF NOT EXISTS "activity_logs_user_id_idx" ON "activity_logs" ("user_id")`

    // 13. Backfill period_start, period_end, and client_snapshot for reports
    const monthNames = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    }

    const unpopulatedReports = await sql`
      SELECT r.id, r.report_month, r.client_id, r.period_start, r.period_end, r.client_snapshot,
             c.name, c.website_url, c.business_name, c.logo_url, c.primary_color, c.secondary_color,
             c.is_white_label, c.partner_name, c.partner_logo_url
      FROM "reports" r
      LEFT JOIN "clients" c ON r.client_id = c.id
      WHERE r.period_start IS NULL OR r.period_end IS NULL OR r.client_snapshot IS NULL
    `

    for (const rep of unpopulatedReports) {
      let pStart = rep.period_start
      let pEnd = rep.period_end

      if ((!pStart || !pEnd) && rep.report_month) {
        const parts = rep.report_month.trim().split(/\s+/)
        if (parts.length >= 2) {
          const mStr = parts[0].toLowerCase()
          const yNum = parseInt(parts[1], 10)
          if (monthNames[mStr] !== undefined && !isNaN(yNum)) {
            const mIdx = monthNames[mStr]
            pStart = new Date(Date.UTC(yNum, mIdx, 1, 0, 0, 0, 0))
            pEnd = new Date(Date.UTC(yNum, mIdx + 1, 0, 23, 59, 59, 999))
          }
        }
      }

      // Default fallback if report_month text parsing failed
      if (!pStart) pStart = new Date()
      if (!pEnd) pEnd = new Date()

      let snapshot = rep.client_snapshot
      if (!snapshot && rep.business_name) {
        snapshot = {
          businessName: rep.business_name,
          name: rep.name || null,
          websiteUrl: rep.website_url || null,
          logoUrl: rep.logo_url || null,
          primaryColor: rep.primary_color || '#2563eb',
          secondaryColor: rep.secondary_color || '#1e293b',
          isWhiteLabel: Boolean(rep.is_white_label),
          partnerName: rep.partner_name || null,
          partnerLogoUrl: rep.partner_logo_url || null,
        }
      }

      await sql`
        UPDATE "reports"
        SET
          "period_start" = COALESCE("period_start", ${pStart}),
          "period_end" = COALESCE("period_end", ${pEnd}),
          "client_snapshot" = COALESCE("client_snapshot", ${snapshot ? sql.json(snapshot) : null})
        WHERE "id" = ${rep.id}
      `
    }

    // Enforce NOT NULL on period_start and period_end
    await sql`ALTER TABLE "reports" ALTER COLUMN "period_start" SET NOT NULL`
    await sql`ALTER TABLE "reports" ALTER COLUMN "period_end" SET NOT NULL`

    // Ensure lowercase indexes for alphabetical directory sorting
    await sql`CREATE INDEX IF NOT EXISTS "clients_lower_business_name_idx" ON "clients" (lower("business_name"))`
    await sql`CREATE INDEX IF NOT EXISTS "users_lower_name_idx" ON "users" (lower("name"))`

    // 10. Ensure landing_pages table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "landing_pages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE RESTRICT,
        "title" text NOT NULL,
        "target_url" text,
        "focus_keyword" text,
        "cta_goal" text,
        "status" text DEFAULT 'planning' NOT NULL,
        "went_live_at" timestamp with time zone,
        "assigned_to" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "landing_pages_client_id_idx" ON "landing_pages" ("client_id");`

    // 11. Ensure client_articles table exists (NOT "blogs" — client deliverables)
    await sql`
      CREATE TABLE IF NOT EXISTS "client_articles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE RESTRICT,
        "title" text NOT NULL,
        "draft_url" text,
        "live_url" text,
        "target_keyword" text,
        "status" text DEFAULT 'idea' NOT NULL,
        "published_at" timestamp with time zone,
        "writer_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "client_articles_client_id_idx" ON "client_articles" ("client_id");`

    // 12. Ensure keywords table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "keywords" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE RESTRICT,
        "keyword" text NOT NULL,
        "location" text,
        "search_volume" integer,
        "estimated_traffic" integer,
        "current_rank" integer,
        "previous_rank" integer,
        "target_url" text,
        "status" text DEFAULT 'research' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "keywords_client_id_idx" ON "keywords" ("client_id");`
    await sql`CREATE INDEX IF NOT EXISTS "keywords_client_id_status_idx" ON "keywords" ("client_id", "status");`

    // 13. Ensure keyword_rank_history table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "keyword_rank_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "keyword_id" uuid NOT NULL REFERENCES "keywords"("id") ON DELETE CASCADE,
        "month" integer NOT NULL,
        "year" integer NOT NULL,
        "rank" integer,
        "recorded_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "keyword_rank_history_unique_idx" ON "keyword_rank_history" ("keyword_id", "month", "year");`
    await sql`CREATE INDEX IF NOT EXISTS "keyword_rank_history_kw_ym_idx" ON "keyword_rank_history" ("keyword_id", "year", "month");`

    // 14. Ensure tasks table exists (nullable client_id for internal work, direct partner_id tenancy)
    await sql`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid REFERENCES "clients"("id") ON DELETE RESTRICT,
        "partner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "category" text NOT NULL,
        "status" text DEFAULT 'todo' NOT NULL,
        "completed_at" timestamp with time zone,
        "assigned_to" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS "tasks_client_id_idx" ON "tasks" ("client_id");`
    await sql`CREATE INDEX IF NOT EXISTS "tasks_partner_id_idx" ON "tasks" ("partner_id");`
    await sql`CREATE INDEX IF NOT EXISTS "tasks_assigned_to_idx" ON "tasks" ("assigned_to");`

    // 15. Ensure monthly_metrics table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "monthly_metrics" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE RESTRICT,
        "month" integer NOT NULL,
        "year" integer NOT NULL,
        "gsc_clicks" integer,
        "gsc_impressions" integer,
        "gsc_ctr" double precision,
        "gsc_position" double precision,
        "ga_sessions" integer,
        "ga_users" integer,
        "ga_new_users" integer,
        "ga_views" integer,
        "ga_engagement_rate" double precision,
        "gbp_calls" integer,
        "gbp_views" integer,
        "gbp_directions" integer,
        "gbp_website_clicks" integer,
        "gbp_rating" double precision,
        "gbp_reviews_count" integer,
        "semrush_authority_score" integer,
        "semrush_ranked_keywords" integer,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "monthly_metrics_client_month_year_unique_idx" ON "monthly_metrics" ("client_id", "month", "year");`
    await sql`CREATE INDEX IF NOT EXISTS "monthly_metrics_client_id_idx" ON "monthly_metrics" ("client_id");`

    console.log('✅ PostgreSQL database tables initialized & synchronized.')
  } catch (err) {
    console.error('❌ Database initialization error:', err)
  } finally {
    await sql.end()
  }
}

// Run if executed directly
if (process.argv[1] && process.argv[1].endsWith('migrate.mjs')) {
  runMigrations().then(() => process.exit(0))
}
