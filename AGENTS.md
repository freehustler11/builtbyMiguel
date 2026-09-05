# AGENTS.md

This document serves as the single source of truth for architectural standards, directory boundaries, database tenancy, naming conventions, and runtime deployment rules for this codebase.

---

## STANDING RULES

### DIRECTORIES
- `/app` is canonical for backend: `db/schema.ts`, `db/index.ts`, `server/*.ts`, `lib/auth.ts`, `server/auth.ts`, `server/activity-logger.ts`, `server/storage.ts`.
- `/src` is canonical for frontend: `routes`, `components`, `main.tsx`, `router.tsx`.
- The re-export shims in `src/db/`, `src/server/`, `src/lib/auth.ts` are **INTENTIONAL**. They exist because `tsconfig.app.json` includes only `"src"` and aliases `@` to `./src`. Do not delete or "clean up" these shims.
- New backend code goes in `/app`. New UI goes in `/src`.

### ROLES — exactly four, no others:
`superadmin | partner | partner_employee | client`
- "partner" IS the agency. There is no agencies table. An agency is a row in `users` where `role = 'partner'`.
- Never introduce an "agency" table, entity, or column. The tenant is called partner everywhere in code.

### TENANCY
- `getEffectivePartnerId(auth)` resolves `partner` -> own `userId`, `partner_employee` -> their `partnerId`, everyone else -> `null`.
- `clients.partner_id -> users.id`. `reports` have **NO** `partner_id`; they inherit tenancy by joining through `clients`.
- Every query touching client-scoped data filters by the effective partner id.
- Tenancy is enforced in server functions only. Postgres RLS is NOT enabled.

### GUARDS
- All role guards are **ALLOWLISTS**. A guard states which roles it permits, never which it blocks. Denylist guards are how the client-role bypass happened.
- When a server function accepts a `partnerId` or similar filter argument, that argument is honoured **ONLY** for `superadmin`. For `partner` and `partner_employee` the argument is ignored entirely and the query is scoped to `getEffectivePartnerId(auth)`. `getTeamMembersServerFn` is the reference implementation of this pattern — copy it.

### NAMING
- CRM deliverable articles are called **`client_articles`**. Never "blogs" or "posts". The `posts` table is the agency's own marketing blog and is unrelated.
- Marketing site content: `posts`. Client deliverables: `client_articles`.

### STACK
- React 19, Vite, TanStack Start + Router + Query, Tailwind v4, TypeScript strict, Drizzle ORM, PostgreSQL.
- Production runs `server.mjs` on Node 22, port 3000. NOT nginx, NOT port 80.
- No test framework installed. Verification is: `npx tsc -b`, `npm run build`, `npm run test:simulate`.

### PROCESS
- Produce an implementation plan and stop. Wait for my approval before writing code.
- If anything in my instructions contradicts these rules or contradicts itself, stop and ask rather than guessing.

---

## DATABASE ARCHITECTURE & MIGRATION ENGINE

### Canonical Migration Engine: `scripts/migrate.mjs`
- All schema alterations, table creations, column additions, indexes, constraints, and data backfills **MUST** be written into `scripts/migrate.mjs`.
- `scripts/migrate.mjs` is executed automatically on boot by `server.mjs` before the HTTP server starts listening:
  ```js
  runMigrations().finally(() => {
    server.listen(port, '0.0.0.0', ...)
  })
  ```
- It can also be run manually via `npm run db:migrate`.
- **Drizzle-Kit Migrations Inert / Obsolete**: The `drizzle/` directory has been removed. `drizzle-kit generate` migrations are **inert** and do not run in production. All CRM tables, foreign keys, and indexes must go through `scripts/migrate.mjs` exclusively.

### Database Conventions
- **Soft Deletes**: `clients` and `users` use soft delete via `deleted_at` (`timestamptz`). Never hard delete. All queries must filter with `isNull(table.deletedAt)`.
- **Foreign Key Integrity**: `reports.client_id` uses `ON DELETE RESTRICT` to prevent cascade deletions.
- **Report Immutability**: `reports.client_snapshot` (`jsonb`) freezes `businessName`, `name`, `websiteUrl`, `logoUrl`, `primaryColor`, `secondaryColor`, `isWhiteLabel`, `partnerName`, and `partnerLogoUrl` upon report creation and update.
- **Report Periods**: Stored as UTC `timestamptz NOT NULL` in `reports.period_start` and `reports.period_end`. `report_month` text is preserved for UI display.

