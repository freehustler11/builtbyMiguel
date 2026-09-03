import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:zvorhklm2hyhlzn1@2.29.45.40:5432/postgres'

// Prevent multiple connections in development/HMR
declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: postgres.Sql | undefined
}

const client =
  globalThis.__postgresClient ||
  postgres(connectionString, {
    prepare: false, // Recommended for PgBouncer / Transaction pooler mode (Supabase, Neon, etc.)
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__postgresClient = client
}

export const db = drizzle(client, { schema })
export * from './schema'
