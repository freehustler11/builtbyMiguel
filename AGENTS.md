# AGENTS.md

This document serves as the single source of truth for architectural standards, directory boundaries, database tenancy, naming conventions, and runtime deployment rules for this codebase.

---

## 1. Confirmed Stack & Runtime Architecture

- **Framework**: TanStack Start (SSR full-stack React framework with `@tanstack/react-router`).
- **Server Engine**: Nitro / Vite Node server (`@tanstack/react-start/server`), running on **Node.js 22 LTS**.
- **Database**: PostgreSQL with Drizzle ORM (`drizzle-orm/postgres-js`).
- **Styling**: Tailwind CSS v4 with Lucide React icons.
- **Port**: **3000** (`PORT=3000`). All containerized deployments bind to port 3000, never port 80.

---

## 2. Directory Structure Reality & Boundary Rules

The codebase intentionally uses a split directory architecture:
- **/app**: Canonical directory for **backend / server-side logic**:
  - `app/server/`: TanStack Start `createServerFn` RPC endpoints (auth, clients, reports, team, partners, activity, passwords).
  - `app/db/`: Database connection (`index.ts`) and Drizzle schema (`schema.ts`).
  - `app/lib/`: Server utilities, cookie session handlers, password hashing.
  - `app/router.tsx`: Root TanStack router instantiation.
- **/src**: Canonical directory for **frontend / UI logic**:
  - `src/routes/`: File-based routing pages and layouts (`/admin`, `/portal`, `/login`, `/superadmin`, etc.).
  - `src/components/`: Reusable React components (`ReportDocument`, `Sidebar`, `ThemeToggle`, UI widgets).
  - `src/lib/`: Frontend utilities.
- **Re-export Shims (`src/` -> `app/`)**:
  - `src/server/*`, `src/db/*`, and `src/lib/*` include thin re-export shims pointing to `../../app/*`.
  - **Rationale**: `tsconfig.app.json` specifies `"include": ["src"]`. These shims allow frontend route components in `src/routes/` to import server functions and types without violating TypeScript project boundaries.
  - **Rule**: Do NOT delete these Group C shims. When adding new server functions or database models in `app/`, create matching re-exports in `src/` if imported by frontend routes.

---

## 3. Tenancy & Access Control

### Naming Decision: "Partner", Never "Agency"
- The multi-tenant entity is strictly called **`partner`**.
- Do **NOT** introduce or rename anything to "agency" in schema, database columns, API parameters, or types.

### Roles
The system defines exactly four authenticated roles (plus the historical `admin` alias, which normalizes to `superadmin`):
1. **`superadmin`** (or `admin`): Unrestricted administrative access across all partners and clients.
2. **`partner`**: Tenant owner account. Can manage assigned clients, view and edit their reports, and invite employees.
3. **`partner_employee`**: Staff account belonging to a partner agency (`users.partnerId = partner.id`). Can manage clients and reports for their partner, but cannot manage other team members or view other partners.
4. **`client`**: Read-only portal user linked directly to a single client (`users.clientId = client.id`). Restricted strictly to their own client's reports.

### Tenancy Enforcement Rule
- Every client-scoped query **must** filter by the active user's partner:
  ```ts
  const auth = await assertActiveSession()
  const effectivePartnerId = getEffectivePartnerId(auth)
  if (effectivePartnerId) {
    // Restrict query to clients where client.partnerId === effectivePartnerId
  }
  ```
- **Allowlist Guards**: Role checks must be explicit allowlists (`if (auth.role !== 'superadmin') throw ...`), never denylists (`if (role === 'client')`).

---

## 4. Database Schema & Migration Path

### Chosen Migration Engine: `scripts/migrate.mjs`
- All schema changes, table creations, column additions, indexes, and data backfills **MUST** be written into `scripts/migrate.mjs`.
- `scripts/migrate.mjs` is automatically executed on application boot by `server.mjs` before the HTTP server starts listening.
- It can also be run manually via `npm run db:migrate`.
- **Drizzle-Kit Migrations**: The `drizzle/` SQL directory and `drizzle-kit generate` migrations are **inert / obsolete**. Do NOT rely on drizzle-kit migrations for production deployments.

### Soft Delete Pattern
- `clients` and `users` use soft delete via `deleted_at` (`timestamptz`).
- **Never** perform hard `DELETE` queries on `clients` or `users`. Always execute:
  ```ts
  await db.update(clients).set({ deletedAt: new Date() }).where(...)
  await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(...)
  ```
- All `SELECT` queries across the application must explicitly filter out soft-deleted records: `isNull(table.deletedAt)`.
- Foreign key references on reports (`reports.client_id`) use `ON DELETE SET NULL` (or `RESTRICT`), ensuring that report history is permanently preserved even if a client is deleted.

### Immutability & Snapshots
- Reports freeze branding attributes in `reports.client_snapshot` (`jsonb`) upon creation and update:
  - `businessName`, `logoUrl`, `primaryColor`, `secondaryColor`, `isWhiteLabel`, `partnerName`, `partnerLogoUrl`.
- Renderers (such as `ReportDocument.tsx`) read branding from `report.client_snapshot` with fallback to the live `client` join if the snapshot is absent.
- The title-badge comparison (`!report.title.includes(businessName)`) evaluates against the snapshot `businessName`.

### Timestamps & Date Boundaries
- Date ranges and timestamps are stored in UTC using `timestamptz`.
- Report periods define start and end timestamps (`period_start` and `period_end`) spanning UTC month boundaries (e.g., `2026-08-01T00:00:00.000Z` to `2026-08-31T23:59:59.999Z`).
- `report_month` text is preserved for UI display (e.g., `"August 2026"`).

---

## 5. Upcoming CRM Conventions
- Deliverable articles created for clients are named **`client_articles`**, never "blogs" or "posts".
- All future CRM tables must link to `client_id` and respect the partner tenancy boundary via `clients.partner_id`.
