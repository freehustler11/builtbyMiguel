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
    await sql`CREATE INDEX IF NOT EXISTS "clients_partner_id_idx" ON "clients" ("partner_id")`

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
    await sql`CREATE INDEX IF NOT EXISTS "users_partner_id_idx" ON "users" ("partner_id")`
    await sql`UPDATE "users" SET "role" = 'superadmin' WHERE "role" = 'admin'`
    await sql`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'partner'`

    // 8. Ensure reports table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "reports" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE CASCADE,
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

    // 9. Ensure media table isolation per partner
    await sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "uploaded_by" uuid REFERENCES "users"("id") ON DELETE SET NULL`
    await sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "partner_id" uuid REFERENCES "users"("id") ON DELETE CASCADE`
    await sql`CREATE INDEX IF NOT EXISTS "media_partner_id_idx" ON "media" ("partner_id")`
    await sql`CREATE INDEX IF NOT EXISTS "media_uploaded_by_idx" ON "media" ("uploaded_by")`

    // 10. Ensure reports.client_id has ON DELETE CASCADE in PostgreSQL
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
        ALTER TABLE "reports" ADD CONSTRAINT "reports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE;
      END $$;
    `

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
