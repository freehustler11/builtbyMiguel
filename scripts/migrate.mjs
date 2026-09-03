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
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" text`
    await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "tags" text`
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
