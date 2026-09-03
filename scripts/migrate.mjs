import 'dotenv/config'
import postgres from 'postgres'

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL
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
