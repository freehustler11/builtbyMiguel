# Codebase Architectural Audit & System Reality Report

**Date**: September 5, 2026  
**Target Repository**: `builtbyMiguel`  
**Purpose**: Comprehensive technical audit of directory reality, multi-tenant partner architecture, authentication & route guards, report data models, PostgreSQL database schema, deployment infrastructure, and test capabilities before planning new features.

---

## 1. Directory Reality: `/app` vs `/src`

### 1.1 Overview & Architecture Split
The codebase contains both `/app` and `/src` directories. This is not an intentional dual-architecture; it is an **asymmetrical, half-migrated split** between the frontend UI and the backend database/server layers:

- **`/src` is CANONICAL for the Frontend**: All live routes, UI layouts, interactive modals, client-side entrypoints, stylesheets, and asset components are loaded and compiled from `/src`.
- **`/app` is CANONICAL for the Backend & Database**: The Drizzle ORM schema, database client connection pool, and all server-side functions (`createServerFn`) execute from `/app`.
- **The Bridge**: The two directories interoperate through thin, 1-line re-export shims. `src/server/*`, `src/db/*`, and `src/lib/auth.ts` re-export from `app/`, while older vestigial shims in `app/routes/*` and `app/components/*` point back to `src/`.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                      VITE BUILD                        │
                    │               (tsconfig.app.json)                      │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
                                      Entry: /src/main.tsx
                                      Routes: /src/routes/*
                                      Router: /src/router.tsx
                                               │
                                               ▼
                              ┌──────────────────────────────────┐
                              │           /src (FRONTEND)        │
                              │  - UI Pages & Layouts            │
                              │  - ReportDocument.tsx            │
                              │  - Modals & Components           │
                              │  - Re-export Shims:              │
                              │    src/server/* ──┐              │
                              │    src/db/*     ──┼──┐           │
                              │    src/lib/auth ──┼──┼──┐        │
                              └───────────────────┼──┼──┼────────┘
                                                  │  │  │
                                    (Imports via  │  │  │ relative
                                     re-exports)  │  │  │ paths)
                                                  ▼  ▼  ▼
                              ┌──────────────────────────────────┐
                              │            /app (BACKEND)        │
                              │  - app/db/schema.ts (Drizzle DB) │
                              │  - app/db/index.ts (Postgres)    │
                              │  - app/server/*.ts (All RPC fns) │
                              │  - app/lib/auth.ts (Auth Engine) │
                              │  - app/server/activity-logger.ts │
                              │  - app/server/storage.ts         │
                              └──────────────────────────────────┘
```

---

### 1.2 Build System & Configuration Reality
- **Which `tsconfig.json` is used?**  
  The root [`tsconfig.json`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/tsconfig.json) references [`tsconfig.app.json`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/tsconfig.app.json) and [`tsconfig.node.json`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/tsconfig.node.json).  
  In [`tsconfig.app.json`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/tsconfig.app.json):
  ```json
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
  ```
  `app` is **not** included in `"include"`. TypeScript only type-checks files in `app/` because files in `src/` import them via relative paths.
- **Which `package.json` is used?**  
  There is only one [`package.json`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/package.json) at the root.
- **Vite & TanStack Start resolution**:  
  - [`vite.config.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/vite.config.ts) defines alias `@` pointing strictly to `./src`.
  - [`index.html`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/index.html) line 91 loads: `<script type="module" src="/src/main.tsx"></script>`.
  - `@tanstack/start-plugin-core` defaults `srcDirectory` to `'src'`, causing TanStack Router to generate [`src/routeTree.gen.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/routeTree.gen.ts) and bundle [`src/router.tsx`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/router.tsx).
  - Drizzle config ([`drizzle.config.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/drizzle.config.ts)) points directly to `./app/db/schema.ts`.

---

### 1.3 Detailed File-by-File Overlap Audit (54 Files)

There are 54 file paths that exist in both `/app` and `/src`. They fall into four clear categories:

#### Group A: Identical Static Assets & Styles (4 Files)
| File | `app` Content | `src` Content | Status |
| :--- | :--- | :--- | :--- |
| `assets/logo-black.png` | Binary identical | Binary identical | Duplicate asset |
| `assets/logo-white.png` | Binary identical | Binary identical | Duplicate asset |
| `assets/miguel-umbac.png` | Binary identical | Binary identical | Duplicate asset |
| `index.css` | 100% identical Tailwind CSS stylesheet | 100% identical Tailwind CSS stylesheet | Duplicate file |

#### Group B: `app/` Re-exports `src/` (15 Files — `app` is Dead Shim)
In these files, the real implementation lives in `src/`, and `app/` contains a 1-line re-export:
| File Path | `app/` Size | `src/` Size | Which is Imported by Live Routes? |
| :--- | :--- | :--- | :--- |
| `components/AdminNav.tsx` | 47 B (shim) | 10.2 KB (live code) | **`src/components/AdminNav.tsx`** |
| `components/Footer.tsx` | 45 B (shim) | 11.6 KB (live code) | **`src/components/Footer.tsx`** |
| `components/Navbar.tsx` | 45 B (shim) | 17.7 KB (live code) | **`src/components/Navbar.tsx`** |
| `routes/admin/index.tsx` | 106 B (shim) | 534 B (live route) | **`src/routes/admin/index.tsx`** |
| `routes/admin/posts.tsx` | 106 B (shim) | 170.8 KB (live route) | **`src/routes/admin/posts.tsx`** |
| `routes/admin.tsx` | 88 B (shim) | 429 B (live route) | **`src/routes/admin.tsx`** |
| `routes/blog/$slug.tsx` | 104 B (shim) | 41.2 KB (live route) | **`src/routes/blog/$slug.tsx`** |
| `routes/blog/index.tsx` | 104 B (shim) | 13.2 KB (live route) | **`src/routes/blog/index.tsx`** |
| `routes/cookie-policy.tsx` | 104 B (shim) | 4.3 KB (live route) | **`src/routes/cookie-policy.tsx`** |
| `routes/index.tsx` | 88 B (shim) | 35.4 KB (live route) | **`src/routes/index.tsx`** |
| `routes/local-seo-gbp.tsx` | 104 B (shim) | 27.3 KB (live route) | **`src/routes/local-seo-gbp.tsx`** |
| `routes/login.tsx` | 88 B (shim) | 11.5 KB (live route) | **`src/routes/login.tsx`** |
| `routes/messages.tsx` | 94 B (shim) | 44.5 KB (live route) | **`src/routes/messages.tsx`** |
| `routes/systems-auto.tsx` | 102 B (shim) | 21.6 KB (live route) | **`src/routes/systems-auto.tsx`** |
| `routeTree.gen.ts` | 88 B (shim) | 23.3 KB (live routeTree) | **`src/routeTree.gen.ts`** |

#### Group C: `src/` Re-exports `app/` (14 Files — `app` is Canonical Backend)
In these files, the real implementation lives in `app/`, and `src/` contains a 1-line re-export:
| File Path | `src/` Size | `app/` Size | Which is Canonical? |
| :--- | :--- | :--- | :--- |
| `components/LogoutButton.tsx` | 50 B (shim) | 1.6 KB (live code) | **`app/components/LogoutButton.tsx`** |
| `db/index.ts` | 35 B (shim) | 790 B (live code) | **`app/db/index.ts`** (Postgres client) |
| `db/schema.ts` | 36 B (shim) | 9.8 KB (live code) | **`app/db/schema.ts`** (Drizzle schema) |
| `lib/auth.ts` | 35 B (shim) | 16.5 KB (live code) | **`app/lib/auth.ts`** (Auth engine & guards) |
| `server/activity.ts` | 42 B (shim) | 3.8 KB (live code) | **`app/server/activity.ts`** |
| `server/clients.ts` | 41 B (shim) | 8.8 KB (live code) | **`app/server/clients.ts`** |
| `server/leads.ts` | 39 B (shim) | 4.7 KB (live code) | **`app/server/leads.ts`** |
| `server/media.ts` | 39 B (shim) | 6.6 KB (live code) | **`app/server/media.ts`** |
| `server/messages.ts` | 42 B (shim) | 3.1 KB (live code) | **`app/server/messages.ts`** |
| `server/partners.ts` | 42 B (shim) | 7.5 KB (live code) | **`app/server/partners.ts`** |
| `server/passwords.ts` | 43 B (shim) | 6.7 KB (live code) | **`app/server/passwords.ts`** |
| `server/posts.ts` | 39 B (shim) | 12.8 KB (live code) | **`app/server/posts.ts`** |
| `server/reports.ts` | 41 B (shim) | 23.3 KB (live code) | **`app/server/reports.ts`** |
| `server/team.ts` | 38 B (shim) | 9.8 KB (live code) | **`app/server/team.ts`** |

#### Group D: Diverged Files (21 Files)
These files exist with full content in both folders, but have diverged over time:
| File Path | Difference Description | Which One is Imported / Live? | Dead File |
| :--- | :--- | :--- | :--- |
| `components/CodeTerminalInspector.tsx` | Line breaks only (CRLF vs LF). | `src/components/CodeTerminalInspector.tsx` | `app/` is dead |
| `components/InteractiveComparisonCard.tsx` | Line breaks only (CRLF vs LF). | `src/components/InteractiveComparisonCard.tsx` | `app/` is dead |
| `components/ThemeToggle.tsx` | `src/` has `print:hidden` for clean report printing; `app/` lacks it. | `src/components/ThemeToggle.tsx` | `app/` is dead |
| `entry-server.tsx` | `app/` imports `../src/routeTree.gen`; `src/` imports `./routeTree.gen`. | Neither is used; TanStack Start uses plugin default. | Both redundant |
| `lib/hostname.ts` | `app/` has server function `checkHostnameRoutingServerFn`; `src/` has client pure helpers. | Both are used in their respective scopes. | Neither |
| `lib/theme.ts` | `src/` has expanded theme token utilities; `app/` is an older snapshot. | `src/lib/theme.ts` | `app/` is dead |
| `lib/utils.ts` | Line breaks only (`cn` helper). | `src/lib/utils.ts` | `app/` is dead |
| `main.tsx` | `index.html` explicitly targets `/src/main.tsx`. | `src/main.tsx` | `app/` is dead |
| `router.tsx` | TanStack Start resolves `src/router.tsx` as router factory. | `src/router.tsx` | `app/` is dead |
| `routes/$.tsx` | `src/` has responsive classes (`w-14 h-14 sm:w-20 sm:h-20`). | `src/routes/$.tsx` | `app/` is dead |
| `routes/about.tsx` | Formatting and line endings. | `src/routes/about.tsx` | `app/` is dead |
| `routes/audit.tsx` | Meta tag polish in `src/`. | `src/routes/audit.tsx` | `app/` is dead |
| `routes/contact.tsx` | Form styling polish in `src/`. | `src/routes/contact.tsx` | `app/` is dead |
| `routes/privacy-policy.tsx` | Formatting and line endings. | `src/routes/privacy-policy.tsx` | `app/` is dead |
| `routes/terms.tsx` | Formatting and line endings. | `src/routes/terms.tsx` | `app/` is dead |
| `routes/thank-you.tsx` | Responsive styling in `src/`. | `src/routes/thank-you.tsx` | `app/` is dead |
| `routes/websites-care.tsx` | Keyword casing fix in `src/`. | `src/routes/websites-care.tsx` | `app/` is dead |
| `routes/work.tsx` | Formatting and line endings. | `src/routes/work.tsx` | `app/` is dead |
| `routes/__root.tsx` | `src/` is 266 lines with router state, subdomain routing, and devtools. `app/` is 204 lines. | `src/routes/__root.tsx` | `app/` is dead |
| `server/forms.ts` | Formatting and line endings (CRLF vs LF). | `src/server/forms.ts` | `app/` is dead |
| `vite-env.d.ts` | Line endings only. | `src/vite-env.d.ts` | `app/` is dead |

---

### 1.4 Files Existing ONLY in One Directory

#### Files Existing ONLY in `/app` (3 Core Backend Files)
- `app/server/activity-logger.ts`: The central logging engine capturing IP, User-Agent, browser, OS, and recording events to `activity_logs`.
- `app/server/auth.ts`: Server-side session verification, `assertActiveSession()`, `assertSuperadminSession()`, and `getEffectivePartnerId()`.
- `app/server/storage.ts`: Disk storage abstraction for uploaded media assets.

#### Files Existing ONLY in `/src` (19 Core Frontend Files)
- **Modals & UI Components**:
  - `src/components/ChangePasswordModal.tsx`
  - `src/components/ResetUserPasswordModal.tsx`
  - `src/components/ReportDocument.tsx` (Complete 1,210-line 2-page print report)
  - `src/components/ThemedNumberInput.tsx`
  - `src/components/ConfirmModal.tsx`
  - `src/components/MediaPickerModal.tsx`
  - `src/components/Toast.tsx`
- **Protected Admin & Portal Routes**:
  - `src/routes/admin/clients.tsx`
  - `src/routes/admin/media.tsx`
  - `src/routes/admin/team.tsx`
  - `src/routes/admin/reports/index.tsx`
  - `src/routes/admin/reports/new.tsx`
  - `src/routes/admin/reports/$id.tsx`
  - `src/routes/admin/reports/$id.edit.tsx`
  - `src/routes/portal.tsx`
  - `src/routes/portal/index.tsx`
  - `src/routes/portal/reports/$id.tsx`
  - `src/routes/superadmin.tsx`
  - `src/routes/superadmin/activity.tsx`

---

### 1.5 What Would Break If Either Directory Were Deleted?

#### If `/app` were deleted:
1. **Database layer crashes immediately**: `src/db/schema.ts` and `src/db/index.ts` re-export from `app/db/`. Drizzle migrations (`scripts/migrate.mjs`), `scripts/simulate.ts`, and `drizzle.config.ts` will fail to compile.
2. **All server functions fail**: `app/server/auth.ts`, `app/server/activity-logger.ts`, and `app/server/storage.ts` exist **only** in `app/`. All 11 files in `src/server/` are shims re-exporting `app/server/`.
3. **Authentication fails**: `src/lib/auth.ts` is a shim re-exporting `app/lib/auth.ts`.
4. **Summary**: The entire backend, database connection, and API RPC layer would completely collapse.

#### If `/src` were deleted:
1. **Frontend build fails immediately**: `index.html` references `/src/main.tsx`. `tsconfig.app.json` includes only `"src"`. `vite.config.ts` aliases `@` to `./src`.
2. **All protected routes vanish**: `/admin/clients`, `/admin/media`, `/admin/team`, `/admin/reports/*`, `/portal/*`, and `/superadmin/*` do not exist in `app/`.
3. **Report generation fails**: `ReportDocument.tsx` does not exist in `app/`.
4. **Summary**: The entire user interface, routing tree, client bundle, and SSR layout would be completely obliterated.

---

## 2. Tenancy & The Partner Model

### 2.1 The "Partner" Entity: Table & Columns
In this codebase, there is **no separate `partners` table**. A partner agency is represented directly as a row in the `users` table where `role = 'partner'`.

#### Columns in `users` governing tenancy:
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `defaultRandom()` | Acts as the **Partner ID** (Agency Owner ID) |
| `email` | `text` | Unique, Not Null | Login email of the agency owner |
| `role` | `text` | Enum (`'superadmin' \| 'partner' \| 'client' \| 'partner_employee'`) | Identifies user privilege tier |
| `partner_id` | `uuid` | Foreign Key `users.id`, `ON DELETE CASCADE` | Self-referential FK. For `partner_employee`, points to the parent agency owner's `users.id`. Null for agency owners and superadmins. |
| `client_id` | `uuid` | Foreign Key `clients.id` | Populated for `role = 'client'` to link portal logins to a specific client record. |
| `is_active` | `boolean` | Default `true`, Not Null | Account suspension toggle |
| `name` | `text` | Nullable | Agency owner or staff display name |

---

### 2.2 How Partner Scoping is Enforced

Tenancy scoping is handled using `getEffectivePartnerId(auth)` ([`app/server/auth.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L106-L115)):

```typescript
export function getEffectivePartnerId(auth: ActiveSession): string | null {
  if (auth.role === 'partner') return auth.userId
  if (auth.role === 'partner_employee') return auth.partnerId || null
  return null
}
```

This ensures both the agency owner (`partner`) and their employees (`partner_employee`) resolve to the **same root tenant ID** (the agency owner's `users.id`). Superadmins resolve to `null` (global, unscoped access).

#### Resource Scoping Rules:
1. **Clients (`clients` table)**:
   - `clients.partner_id`: Foreign key referencing `users.id` (`onDelete: 'set null'`).
   - If `partner_id IS NULL`, the client is a direct Superadmin account.
   - When a partner or employee queries clients via `getClientsServerFn`, the query executes:  
     `.where(eq(clients.partnerId, effectivePartnerId))`.
   - Creating a client automatically attaches `partnerId: effectivePartnerId`.
2. **Reports (`reports` table)**:
   - `reports.client_id`: Foreign key referencing `clients.id` (`onDelete: 'cascade'`).
   - Reports do not have a direct `partner_id` column; they inherit tenancy via their parent client.
   - In `getReportsServerFn`, `reports` is inner-joined to `clients`:  
     `.innerJoin(clients, eq(reports.clientId, clients.id)).where(eq(clients.partnerId, effectivePartnerId))`.
3. **Media (`media` table)**:
   - `media.partner_id`: Foreign key referencing `users.id` (`onDelete: 'cascade'`).
   - `media.uploaded_by`: Foreign key referencing `users.id` (`onDelete: 'set null'`).
   - Partners can only query and upload files where `media.partnerId === effectivePartnerId`.
4. **Team Members (`users` table with `role = 'partner_employee'`)**:
   - `users.partner_id` links staff directly to the agency owner's user ID.
   - `getTeamMembersServerFn`: Returns users where `partnerId === auth.userId` and `role = 'partner_employee'`.
   - `partner_employee` users are strictly forbidden from calling team management APIs (`HTTP 403`).
5. **Supporting Types**:
   - `AgencyOwnerInfo` ([`app/server/team.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L18-L23)): Metadata object `{ id, name, email, role }` returned to display the parent agency owner in team management cards.
   - `MediaItemWithPartner` ([`app/server/media.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/media.ts#L7-L9)): Extended `Media` interface containing `partnerName?: string | null` so superadmins can view uploaded assets alongside their partner owner.

---

### 2.3 Database Layer vs Server Function Layer Enforcement

> [!IMPORTANT]
> **Partner scoping is enforced SOLELY AT THE APPLICATION LAYER in server functions.**

- **PostgreSQL Row-Level Security (RLS)**: Is **NOT enabled** on any table in the database.
- **Database Connection**: The backend connects using a single connection string (`process.env.DATABASE_URL`) with the `postgres` superuser. Any raw SQL or un-scoped query has unrestricted visibility across all tenants.
- **Database Constraints**: The database layer enforces integrity constraints (`ON DELETE CASCADE` on `users.partner_id`, `clients.id`, `media.partner_id`), ensuring that deleting a partner agency automatically cleans up their employees, media, and client reports, but read/write boundary isolation relies entirely on TypeScript query filters (`eq(..., effectivePartnerId)`).

---

## 3. Authentication & Route Guards

### 3.1 User Roles
The application defines four distinct roles in `app/db/schema.ts`:
1. `superadmin`: Global system administrator. Full unscoped access across all agencies, clients, media, team accounts, blog posts, public messages, and system activity logs.
2. `partner`: Agency owner. Manages their own clients, reports, media library, and sub-account staff members.
3. `partner_employee`: Sub-account staff member belonging to a partner agency. Can create and edit reports and upload media for assigned clients, but cannot access team management or superadmin settings.
4. `client`: End-client portal user. Can only view reports belonging to their specific client record (`/portal`). Blocked from all `/admin` routes.

*(Note: Older code references `'admin'`, but database migrations explicitly ran `UPDATE "users" SET "role" = 'superadmin' WHERE "role" = 'admin'` and the schema enum strictly specifies the four roles above).*

---

### 3.2 Route Guards Comparison (`beforeLoad` Hooks)

The route guards are defined in [`app/lib/auth.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/lib/auth.ts#L502-L589) and execute inside TanStack Router's `beforeLoad` cycle:

| Route Guard | Authenticated Check | Role Checks & Redirections | Allowed Roles |
| :--- | :--- | :--- | :--- |
| **`requireAdmin`** | If `!auth.isAuthenticated` $\rightarrow$ redirect `/login?redirect=...` | If `auth.role === 'client'` $\rightarrow$ redirect `/portal` | `superadmin`, `partner`, `partner_employee` |
| **`requireSuperadmin`** | If `!auth.isAuthenticated` $\rightarrow$ redirect `/login?redirect=...` | If `auth.role === 'partner' \|\| 'partner_employee'` $\rightarrow$ redirect `/admin/clients`<br>If `auth.role === 'client'` $\rightarrow$ redirect `/portal` | `superadmin` only |
| **`requireClient`** | If `!auth.isAuthenticated` $\rightarrow$ redirect `/login?redirect=...` | None (allows any authenticated user into portal) | `client`, `superadmin`, `partner`, `partner_employee` |
| **`requireAuth`** | Calls `requireSuperadmin` (backward compatibility alias) | Same as `requireSuperadmin` | `superadmin` only |

---

### 3.3 Server Functions Security Audit

Route guards (`requireAdmin`, `requireSuperadmin`, etc.) **only protect client router transitions**. Server functions are independent HTTP/RPC endpoints called over the network. They enforce security via `assertActiveSession()` and `assertSuperadminSession()`.

There are **45 server functions** in the codebase. Here is the complete audit of functions that do **NOT** require authentication:

#### Unauthenticated / Public Server Functions (8 Functions)
1. `submitAuditLead` ([`app/server/leads.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/leads.ts#L39)): Public lead capture form on `/audit`.
2. `submitContactLead` ([`app/server/leads.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/leads.ts#L104)): Public contact inquiry form on `/contact`.
3. `getPublicPostsServerFn` ([`app/server/posts.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/posts.ts#L316)): Public blog index page (`/blog`).
4. `getPublicPostBySlugServerFn` ([`app/server/posts.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/posts.ts#L337)): Public article page (`/blog/$slug`).
5. `loginServerFn` ([`app/server/auth.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L372)): Authenticates credentials and sets HTTP-only session cookie.
6. `checkAuthServerFn` ([`app/server/auth.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L263)): Session inspection endpoint used by route guards; returns `{ isAuthenticated: false }` if unauthenticated without throwing.
7. `checkHostnameRoutingServerFn` ([`app/lib/hostname.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/lib/hostname.ts#L30)): Public request header analyzer for domain classification (`builtbymiguel.net` vs `app.builtbymiguel.net`).
8. `logoutServerFn` ([`app/server/auth.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L480)): Clears session cookie; safe to call without active session.

#### Protected Server Functions (37 Functions)
All remaining 37 server functions strictly enforce authentication:
- **Superadmin Only (`assertSuperadminSession`)**: `getActivityLogsServerFn`, `getPartnersServerFn`, `createPartnerServerFn`, `updatePartnerServerFn`, `togglePartnerActiveServerFn`, `assignClientPartnerServerFn`, `getAllUsersForAdminServerFn`, `getAdminPostsServerFn`, `createPostServerFn`, `updatePostServerFn`, `deletePostServerFn`, `getMessagesServerFn`, `updateMessageStatusServerFn`, `deleteMessageServerFn`.
- **Partner & Staff Allowed (`assertActiveSession` + tenant check)**: `getClientsServerFn`, `getClientByIdServerFn`, `createClientServerFn`, `updateClientServerFn`, `deleteClientServerFn`, `getReportsServerFn`, `getReportByIdServerFn`, `createReportServerFn`, `updateReportServerFn`, `updateReportDisplayOptionsServerFn`, `deleteReportServerFn`, `getMediaServerFn`, `uploadMediaServerFn`, `deleteMediaServerFn`, `getTeamMembersServerFn`, `createTeamMemberServerFn`, `deleteTeamMemberServerFn`, `toggleTeamMemberActiveServerFn`, `adminResetUserPasswordServerFn`.
- **Any Authenticated User (`assertActiveSession`)**: `getLatestReportForClientServerFn`, `getPortalReportsServerFn`, `changeMyPasswordServerFn`.

---

## 4. Reports Architecture: Frozen Snapshot vs Live Data

### 4.1 Precision Answer: Snapshot vs Live Read

> [!IMPORTANT]
> **The report uses a HYBRID model: Performance metrics are a frozen snapshot, but Client identity and branding are read LIVE at render time.**

#### 1. What is Frozen (The Snapshot):
When [`createReportServerFn`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L286) or [`updateReportServerFn`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L434) is executed:
- All analytical performance metrics (`gbpCalls`, `gscClicks`, `gaUsers`, etc.)
- All previous month comparison metrics (`prevGbpCalls`, `prevGscClicks`, etc.)
- The reputation metrics (`gbpRating`, `gbpReviewsCount`)
- Narrative text (`summaryTitle`, `summary`, `workCompleted`, `nextSteps`)
- Deep JSONB metric tables (`topQueries`, `topPages`)
- Section visibility toggles (`displayOptions`)

... are **written directly to columns in the `reports` table** and frozen.

#### 2. What is Live (Dynamic Join at Render Time):
The `reports` table **does not store** client business names, contact names, website URLs, logos, primary/secondary colors, or partner white-label branding. It stores only `reports.clientId` (a UUID foreign key).

When a report is rendered ([`getReportByIdServerFn`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L214-L221)):
```typescript
const [row] = await db
  .select({
    report: reports,
    client: clients,
  })
  .from(reports)
  .innerJoin(clients, eq(reports.clientId, clients.id))
  .where(eq(reports.id, data.id))
```
The server performs a **live inner join against the `clients` table**, returning `{ report: row.report, client: row.client }` to [`ReportDocument.tsx`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/components/ReportDocument.tsx#L131).

---

### 4.2 Practical Impact When a Client is Renamed After Report Creation

Because `ReportDocumentProps` takes `client: Client` (the current live record), **renaming or updating a client retroactively alters all historical reports**:

1. **Header & Business Name**:  
   [`ReportDocument.tsx`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/components/ReportDocument.tsx#L234) renders `{client.businessName}`. If "Bob's Plumbing" is renamed to "Apex Plumbing Co.", an archived report from 6 months ago will render with **"Apex Plumbing Co."**.
2. **Title Inconsistency**:  
   If the report's `title` was saved as `"Bob's Plumbing - March 2026 Performance"`, the frozen `report.title` string retains the old name, while the header title badge evaluates:
   ```typescript
   {report.title && !report.title.includes(client.businessName)
     ? report.title.toUpperCase()
     : 'MONTHLY PERFORMANCE REPORT'}
   ```
   Because `"Bob's Plumbing"` does not include `"Apex Plumbing Co."`, the document will display the old title badge right next to the new business name.
3. **Branding & Logos**:  
   Updating a client's logo URL, brand colors (`primaryColor`, `secondaryColor`), or partner white-label assignment immediately and retroactively updates the appearance of all past PDF prints and portal views.

---

## 5. Full PostgreSQL Schema Dump

Below is the complete specification of all **7 tables** in [`app/db/schema.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/db/schema.ts), including column types, defaults, nullability, foreign key actions, and database indexes:

### Table 1: `users`
*Role-based access control, tenancy root, and agency employee sub-accounts.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `email` | `text` | `text` | NO | None | Unique constraint |
| `password_hash` | `text` | `text` | NO | None | None |
| `role` | `text` | `text` | NO | `'partner'` | Enum: `'superadmin'`, `'partner'`, `'client'`, `'partner_employee'` |
| `client_id` | `uuid` | `uuid` | YES | None | Optional link for `client` logins |
| `partner_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE CASCADE` |
| `is_active` | `boolean` | `boolean` | NO | `true` | Account active toggle |
| `name` | `text` | `text` | YES | None | User display name |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |
| `updated_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |

**Indexes (`users`)**:
- Primary Key on `id`
- Unique Index: `users_email_unique` ON (`email`)
- Index: `users_email_idx` ON (`email`)
- Index: `users_client_id_idx` ON (`client_id`)
- Index: `users_partner_id_idx` ON (`partner_id`)

---

### Table 2: `clients`
*Agency client profiles, branding tokens, and white-label assignments.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `name` | `text` | `text` | NO | None | Client contact person name |
| `business_name` | `text` | `text` | NO | None | Legal / trade business name |
| `website_url` | `text` | `text` | YES | None | Client website |
| `logo_url` | `text` | `text` | YES | None | Client brand logo URL |
| `primary_color` | `text` | `text` | YES | `'#2563eb'` | Hex primary accent |
| `secondary_color` | `text` | `text` | YES | `'#1e293b'` | Hex secondary accent |
| `is_white_label` | `boolean` | `boolean` | NO | `false` | Enable partner agency branding |
| `partner_name` | `text` | `text` | YES | None | White-label agency display name |
| `partner_logo_url` | `text` | `text` | YES | None | White-label agency logo |
| `partner_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE SET NULL` |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |

**Indexes (`clients`)**:
- Primary Key on `id`
- Index: `clients_partner_id_idx` ON (`partner_id`)

---

### Table 3: `reports`
*Monthly performance reports, GBP/GSC/GA4 snapshots, and narrative summaries.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `client_id` | `uuid` | `uuid` | NO | None | FK $\rightarrow$ `clients(id)` `ON DELETE CASCADE` |
| `title` | `text` | `text` | NO | None | Report title |
| `report_month` | `text` | `text` | NO | None | E.g., `"September 2026"` |
| `previous_report_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `reports(id)` `ON DELETE SET NULL` |
| `gbp_calls` | `integer` | `integer` | YES | `0` | Google Business Profile calls |
| `gbp_directions`| `integer` | `integer` | YES | `0` | GBP direction requests |
| `gbp_views` | `integer` | `integer` | YES | `0` | GBP total search/map views |
| `gbp_website_clicks` | `integer` | `integer` | YES | `0` | GBP website click actions |
| `prev_gbp_calls`| `integer` | `integer` | YES | `0` | Prior period GBP calls |
| `prev_gbp_directions` | `integer` | `integer` | YES | `0` | Prior period directions |
| `prev_gbp_views`| `integer` | `integer` | YES | `0` | Prior period views |
| `prev_gbp_website_clicks`| `integer` | `integer` | YES | `0` | Prior period website clicks |
| `gbp_rating` | `doublePrecision`| `float8` | YES | `5.0` | GBP average review rating |
| `gbp_review_count` | `integer` | `integer` | YES | `0` | Legacy review count |
| `gbp_reviews_count`| `integer` | `integer` | YES | `0` | Total review count |
| `prev_gbp_reviews_count` | `integer` | `integer` | YES | `0` | Prior period review count |
| `gsc_clicks` | `integer` | `integer` | YES | `0` | Google Search Console clicks |
| `gsc_impressions`| `integer` | `integer` | YES | `0` | GSC total impressions |
| `gsc_ctr` | `doublePrecision`| `float8` | YES | `0` | GSC average click-through rate (%) |
| `gsc_position` | `doublePrecision`| `float8` | YES | `0` | GSC average organic ranking |
| `prev_gsc_clicks`| `integer` | `integer` | YES | `0` | Prior period GSC clicks |
| `prev_gsc_impressions` | `integer` | `integer` | YES | `0` | Prior period impressions |
| `prev_gsc_ctr` | `doublePrecision`| `float8` | YES | `0` | Prior period CTR |
| `prev_gsc_position` | `doublePrecision`| `float8` | YES | `0` | Prior period average position |
| `ga_users` | `integer` | `integer` | YES | `0` | GA4 total active users |
| `ga_new_users` | `integer` | `integer` | YES | `0` | GA4 first-time visitors |
| `ga_engagement_rate` | `doublePrecision`| `float8` | YES | `0` | GA4 engagement rate (%) |
| `ga_sessions` | `integer` | `integer` | YES | `0` | GA4 total user sessions |
| `ga_views` | `integer` | `integer` | YES | `0` | GA4 pageviews |
| `prev_ga_users` | `integer` | `integer` | YES | `0` | Prior period total users |
| `prev_ga_new_users` | `integer` | `integer` | YES | `0` | Prior period new users |
| `prev_ga_engagement_rate` | `doublePrecision`| `float8` | YES | `0` | Prior period engagement rate |
| `prev_ga_sessions`| `integer` | `integer` | YES | `0` | Prior period sessions |
| `prev_ga_views` | `integer` | `integer` | YES | `0` | Prior period pageviews |
| `display_options`| `jsonb` | `jsonb` | YES | Defaults object | Section visibility toggles |
| `top_queries` | `jsonb` | `jsonb` | YES | `'[]'::jsonb` | Top 5 GSC search queries array |
| `top_pages` | `jsonb` | `jsonb` | YES | `'[]'::jsonb` | Top 5 landing pages array |
| `summary_title`| `text` | `text` | YES | Default title | Heading for narrative callout |
| `summary` | `text` | `text` | YES | None | Executive takeaways narrative |
| `work_completed`| `text` | `text` | YES | None | Bullet list of completed deliverables |
| `next_steps` | `text` | `text` | YES | None | Strategic initiatives for next month |
| `created_by_user_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE SET NULL` |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |

**Indexes (`reports`)**:
- Primary Key on `id`
- Index: `reports_client_id_clients_id_fk` ON (`client_id`)
- Index: `reports_created_by_user_id_idx` ON (`created_by_user_id`)

---

### Table 4: `media`
*File storage records for images and documents with partner isolation.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `filename` | `text` | `text` | NO | None | Uploaded file name |
| `file_url` | `text` | `text` | NO | None | Public serving path / URL |
| `mime_type` | `text` | `text` | NO | None | MIME type string |
| `file_size` | `integer` | `integer` | NO | None | Byte count |
| `uploaded_by` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE SET NULL` |
| `partner_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE CASCADE` |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |

**Indexes (`media`)**:
- Primary Key on `id`
- Index: `media_partner_id_idx` ON (`partner_id`)
- Index: `media_uploaded_by_idx` ON (`uploaded_by`)

---

### Table 5: `activity_logs`
*Superadmin security auditing and tracking of system events.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `user_id` | `uuid` | `uuid` | YES | None | FK $\rightarrow$ `users(id)` `ON DELETE SET NULL` |
| `user_email` | `text` | `text` | YES | None | Email at event time |
| `role` | `text` | `text` | YES | None | Role at event time |
| `action` | `text` | `text` | NO | None | Event name (`login`, `logout`, `failed_login`, etc.) |
| `ip_address` | `text` | `text` | YES | None | Client IP from request headers |
| `user_agent` | `text` | `text` | YES | None | Raw User-Agent string |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |

**Indexes (`activity_logs`)**:
- Primary Key on `id`
- Index: `activity_logs_created_at_idx` ON (`created_at` DESC)
- Index: `activity_logs_action_idx` ON (`action`)
- Index: `activity_logs_user_id_idx` ON (`user_id`)

---

### Table 6: `posts`
*Marketing blog posts and SEO articles.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |
| `updated_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |
| `published_at`| `timestamp` | `timestamptz`| YES | None | Publish date |
| `title` | `text` | `text` | NO | None | Article title |
| `meta_title` | `text` | `text` | YES | None | SEO title tag override |
| `slug` | `text` | `text` | NO | None | URL slug (Unique) |
| `keyword` | `text` | `text` | YES | None | Primary target SEO keyword |
| `category` | `text` | `text` | YES | None | Content category |
| `tags` | `text` | `text` | YES | None | Comma-separated tags |
| `summary` | `text` | `text` | YES | None | Executive callout box text |
| `excerpt` | `text` | `text` | YES | None | Card preview snippet |
| `meta_description` | `text` | `text` | YES | None | Search engine description |
| `featured_image` | `text` | `text` | YES | None | Hero banner image URL |
| `content` | `text` | `text` | NO | None | Full article Markdown / HTML |
| `status` | `text` | `text` | NO | `'draft'` | Enum: `'draft'`, `'published'`, `'scheduled'` |
| `scheduled_at`| `timestamp` | `timestamptz`| YES | None | Scheduled release time |
| `schema_type` | `text` | `text` | YES | `'BlogPosting'` | JSON-LD schema type |
| `custom_schema`| `text` | `text` | YES | None | Custom JSON-LD schema |
| `sidebar_cta_*`| `text` (4 cols)| `text` | YES | None | Title, text, button text, URL |
| `bottom_cta_*` | `text` (4 cols)| `text` | YES | None | Title, text, button text, URL |

**Indexes (`posts`)**:
- Primary Key on `id`
- Unique Index: `posts_slug_unique` ON (`slug`)

---

### Table 7: `messages`
*Inbound leads from Audit and Contact forms.*
| Column | Drizzle Type | SQL Type | Nullable | Default | Foreign Key & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid` | NO | `gen_random_uuid()` | Primary Key |
| `created_at` | `timestamp` | `timestamptz`| NO | `now()` | Auto-populated |
| `type` | `text` | `text` | NO | None | Enum: `'audit'`, `'contact'` |
| `name` | `text` | `text` | NO | None | Submitter name |
| `business_name` | `text` | `text` | NO | None | Submitter company |
| `email` | `text` | `text` | NO | None | Submitter email |
| `location` | `text` | `text` | YES | None | Geographic area |
| `website_url` | `text` | `text` | YES | None | Existing website URL |
| `message` | `text` | `text` | YES | None | Message content |
| `status` | `text` | `text` | NO | `'new'` | Enum: `'new'`, `'contacted'`, `'archived'` |

**Indexes (`messages`)**:
- Primary Key on `id`

---

## 6. Deployment: Stale README vs Actual Runtime Reality

> [!WARNING]
> **The `README.md` is SEVERELY STALE and inaccurate.**
> Following the deployment instructions in `README.md` will break the application.

### Comparison Table
| Feature | `README.md` Claims | Actual Production Reality |
| :--- | :--- | :--- |
| **Architecture** | Client-only static SPA | **Full-stack SSR with Node.js 22 runtime** |
| **Server Engine** | NGINX alpine container (`nginx.conf`) | **Custom Node HTTP server ([`server.mjs`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/server.mjs)) running TanStack Start** |
| **Container Port** | Port `80` | **Port `3000`** (`EXPOSE 3000`, `PORT=3000`) |
| **Database** | Not mentioned | **PostgreSQL (via `postgres` driver & Drizzle ORM)** |
| **Migrations** | Not mentioned | **Executed on container boot ([`scripts/migrate.mjs`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/scripts/migrate.mjs))** |
| **RPC / Server Functions**| Not mentioned | **45 `createServerFn` RPC endpoints dynamically imported from `dist/server/server.js`** |
| **`nginx.conf`** | Configured for deployment | **Completely dead and unused** |

### How the Application Actually Deploys
1. **Multi-Stage Build ([`Dockerfile`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/Dockerfile))**:
   - **Stage 1 (`builder`)**: Uses `node:22-alpine`. Installs dependencies (`npm ci --legacy-peer-deps`), compiles TypeScript sitemaps, and runs `npm run build` (Vite client build $\rightarrow$ `dist/client`, and Vite SSR bundle $\rightarrow$ `dist/server`).
   - **Stage 2 (`runner`)**: Uses `node:22-alpine`. Installs production dependencies only (`npm ci --omit=dev`), copies `dist/`, `public/`, `server.mjs`, and `scripts/`. Exposes port `3000`. Sets command: `CMD ["node", "server.mjs"]`.
2. **Container Startup Sequence**:
   - When the container boots, `server.mjs` executes `runMigrations()` from `scripts/migrate.mjs`.
   - `runMigrations()` connects to PostgreSQL via `process.env.DATABASE_URL`, ensures all 7 tables exist, applies missing columns (e.g. `created_by_user_id`, `partner_id`), adds foreign key constraints with cascade rules, and builds indexes.
3. **Request Lifecycle**:
   - Static asset requests (`/assets/*`, `/favicon.ico`, `/llms.txt`) are served directly by `server.mjs` with immutable caching headers.
   - All other routes and RPC server function calls (`POST /_server/*`) are dispatched directly into the TanStack Start handler imported dynamically from `dist/server/server.js`.
4. **Dokploy / Host Configuration**:
   - **Port**: Must be mapped to container port **3000** (not 80).
   - **Environment Variables**: Must provide `DATABASE_URL` and `SESSION_SECRET`.

---

## 7. Test Suite & CRM Fixture Generation

### 7.1 Existing Test Coverage
There are **no standard testing frameworks** (no Vitest, Jest, Playwright, or Cypress) in `package.json`.

Test coverage is comprised of:
1. **Static Type Safety**: TypeScript compiler check (`npx tsc -b`) covering 100% of routes, components, and server endpoints.
2. **Custom Integration & End-to-End Simulation Runner**: `npm run test:simulate`, which runs [`scripts/simulate.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/scripts/simulate.ts) via `tsx`.

---

### 7.2 What `scripts/simulate.ts` Does
`scripts/simulate.ts` executes **11 comprehensive simulations** with **103 discrete assertions** directly against the live PostgreSQL database and the React SSR rendering engine:

1. **Simulation 1: Database Connectivity & Core Tables**: Validates live connection and checks existing rows in `users`, `clients`, and `reports`.
2. **Simulation 2: Superadmin Account & PBKDF2 Password Hashing**: Verifies superadmin existence, PBKDF2 hash verification, and rejects invalid passwords.
3. **Simulation 3: Session Token Signing & Payload Decoding**: Tests HMAC session token generation, tamper detection, and payload extraction.
4. **Simulation 4: ReportDocument HTML Generation & Formatting**: Tests React SSR `renderToStaticMarkup` of `ReportDocument.tsx`, verifies 2-page print layout, 0-baseline pill handling, label spacing, white-label partner headers, and landing page tables.
5. **Simulation 5: Hostname Routing & Redirection Rules**: Tests domain classification (`main` vs `app` vs `dev`) and internal vs marketing path detection.
6. **Simulation 6: Role-Based Routing & Access Matrix**: Verifies permission redirection rules for `superadmin`, `partner`, `partner_employee`, and `client`.
7. **Simulation 7: Partner Employees, Sub-Accounts & Tenant Isolation**: Verifies employee session creation, `getEffectivePartnerId` parent inheritance, database foreign key constraints, and tests that deleting an agency owner triggers `ON DELETE CASCADE` on their employee accounts.
8. **Simulation 8: Superadmin Activity Tracking & Device Parsing**: Tests User-Agent parsing into OS/Browser strings, IP logging, and database auditing in `activity_logs`.
9. **Simulation 9: Internal Report Creator Attribution**: Verifies `created_by_user_id` foreign key joins and ensures the creator ID is stripped from client portal responses.
10. **Simulation 10: Self-Service Password Change**: Validates current password verification, PBKDF2 re-hashing, and cache invalidation.
11. **Simulation 11: Superadmin & Agency Owner Password Resets**: Tests hierarchical password resets (superadmin can reset anyone; agency owner can only reset their own staff) and verifies unauthorized cross-agency resets are rejected.

---

### 7.3 Can `scripts/simulate.ts` Be Extended to Generate CRM Fixture Data?

> [!TIP]
> **YES. `scripts/simulate.ts` is ideally suited to generate CRM fixture data.**

#### Why it is uniquely qualified:
1. **Existing Infrastructure**: It already imports the real database client (`db`), Drizzle schema (`users`, `clients`, `reports`, `media`, `messages`), and auth utilities (`hashPassword`).
2. **Realistic Generators Already Implemented**: Simulations 7, 9, 10, and 11 already construct full realistic partner owners, employee logins, client organizations with branding hex colors, and monthly performance reports with GA4, GSC, and GBP metric series.
3. **Current Teardown Pattern**: Currently, the simulation immediately deletes the records it creates (`await db.delete(...)`) to keep test runs idempotent.

#### How to extend it into a Fixture Generator:
- A new CLI flag can be added (e.g. `npx tsx scripts/simulate.ts --seed` or a dedicated script [`scripts/seed-crm.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/scripts/seed-crm.ts)) that:
  1. Accepts an agency count and client count (e.g., 2 partner agencies, 5 employees each, 10 clients with 6 months of historical reports).
  2. Runs the exact same insertion logic used in Simulations 7 and 9.
  3. Bypasses the final `db.delete(...)` cleanup step.
  4. Generates consistent, known passwords (e.g. `Demo123!`) so engineers or sales reps can log in as any role immediately.
