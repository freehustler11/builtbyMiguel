# Project State Audit & Architectural Inventory

**Inspection Date**: September 6, 2026  
**Auditor**: Source-Verified Codebase Audit Engine  
**Target File**: `docs/project-state.md`  
**Constraint**: Read-only analysis directly from source code.

---

## 1. SCHEMA

There are **14 tables** defined in `app/db/schema.ts`. Below is the exhaustive inventory of all tables, columns, types, defaults, foreign keys, on-delete behaviours, and indexes.

### Soft Deletes (`deleted_at`)
Only **two** tables have `deleted_at`:
1. `users` (`deleted_at timestamptz`)
2. `clients` (`deleted_at timestamptz`)

No other table (`messages`, `posts`, `media`, `reports`, `activity_logs`, `landing_pages`, `client_articles`, `keywords`, `keyword_rank_history`, `tasks`, `citations`, `monthly_metrics`) has `deleted_at`.

---

### Table 1: `messages`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `name`: `varchar(255)`, NOT NULL
  - `email`: `varchar(255)`, NOT NULL
  - `business_name`: `varchar(255)`
  - `website`: `varchar(500)`
  - `phone`: `varchar(50)`
  - `notes`: `text`
  - `source`: `varchar(50)`, default `'contact'`
  - `status`: `varchar(50)`, default `'new'`
  - `created_at`: `timestamptz`, default `now()`
- **Foreign Keys**: None
- **Indexes**:
  - `messages_email_idx` on `(email)`
  - `messages_status_idx` on `(status)`
  - `messages_created_at_idx` on `(created_at)`

---

### Table 2: `posts`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `title`: `varchar(500)`, NOT NULL
  - `slug`: `varchar(500)`, NOT NULL, Unique
  - `excerpt`: `text`
  - `content`: `text`, NOT NULL
  - `category`: `varchar(100)`, default `'insights'`
  - `featured_image`: `text`
  - `published`: `boolean`, default `false`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**: None
- **Indexes**:
  - `posts_slug_idx` on `(slug)` (Unique)
  - `posts_category_idx` on `(category)`
  - `posts_published_idx` on `(published)`

---

### Table 3: `users` (Has `deleted_at`)
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `email`: `varchar(255)`, NOT NULL, Unique
  - `password_hash`: `varchar(255)`, NOT NULL
  - `name`: `varchar(255)`, NOT NULL
  - `role`: `varchar(50)`, NOT NULL, default `'client'` (Allowed: `'superadmin' | 'partner' | 'partner_employee' | 'client'`)
  - `partner_id`: `uuid`, references `users(id)` `ON DELETE RESTRICT`
  - `is_active`: `boolean`, NOT NULL, default `true`
  - `client_id`: `uuid`, references `clients(id)` `ON DELETE RESTRICT`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
  - `deleted_at`: `timestamptz` (Soft delete)
- **Foreign Keys**:
  - `partner_id` -> `users(id)` `ON DELETE RESTRICT`
  - `client_id` -> `clients(id)` `ON DELETE RESTRICT`
- **Indexes**:
  - `users_email_idx` on `(email)` (Unique)
  - `users_role_idx` on `(role)`
  - `users_partner_id_idx` on `(partner_id)`
  - `users_client_id_idx` on `(client_id)`
  - `users_deleted_at_idx` on `(deleted_at)`

---

### Table 4: `media`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `filename`: `varchar(500)`, NOT NULL
  - `filepath`: `text`, NOT NULL
  - `filesize`: `integer`, NOT NULL
  - `mime_type`: `varchar(100)`, NOT NULL
  - `alt_text`: `text`
  - `created_at`: `timestamptz`, default `now()`
- **Foreign Keys**: None
- **Indexes**: None

---

### Table 5: `clients` (Has `deleted_at`)
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `partner_id`: `uuid`, NOT NULL, references `users(id)` `ON DELETE RESTRICT`
  - `business_name`: `varchar(255)`, NOT NULL
  - `name`: `varchar(255)`, NOT NULL
  - `email`: `varchar(255)`
  - `phone`: `varchar(50)`
  - `website_url`: `varchar(500)`
  - `logo_url`: `text`
  - `primary_color`: `varchar(20)`, default `'#2563eb'`
  - `secondary_color`: `varchar(20)`, default `'#0ea5e9'`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
  - `deleted_at`: `timestamptz` (Soft delete)
- **Foreign Keys**:
  - `partner_id` -> `users(id)` `ON DELETE RESTRICT`
- **Indexes**:
  - `clients_partner_id_idx` on `(partner_id)`
  - `clients_business_name_idx` on `(business_name)`
  - `clients_deleted_at_idx` on `(deleted_at)`

---

### Table 6: `reports`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE RESTRICT`
  - `report_month`: `varchar(50)`, NOT NULL
  - `period_start`: `timestamptz`, NOT NULL
  - `period_end`: `timestamptz`, NOT NULL
  - `metrics`: `jsonb`, NOT NULL, default `'{}'`
  - `summary`: `text`
  - `highlights`: `jsonb`, default `'[]'`
  - `work_completed`: `text`
  - `next_steps`: `text`
  - `notes`: `text`
  - `display_options`: `jsonb`, default `'{"show_agency_info": true, "show_tables": true, "show_kpi_summary": true, "show_next_steps": true}'`
  - `share_token`: `varchar(64)`
  - `share_token_created_at`: `timestamptz`
  - `client_snapshot`: `jsonb`
  - `deliverables_snapshot`: `jsonb`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE RESTRICT`
- **Indexes**:
  - `reports_client_id_idx` on `(client_id)`
  - `reports_period_idx` on `(client_id, period_start, period_end)`
  - `reports_share_token_idx` on `(share_token)` (Unique)

---

### Table 7: `activity_logs`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `actor_id`: `uuid`, references `users(id)` `ON DELETE SET NULL`
  - `actor_email`: `varchar(255)`, NOT NULL
  - `actor_role`: `varchar(50)`, NOT NULL
  - `action`: `varchar(100)`, NOT NULL
  - `resource_type`: `varchar(100)`, NOT NULL
  - `resource_id`: `varchar(255)`
  - `details`: `jsonb`
  - `ip_address`: `varchar(45)`
  - `user_agent`: `text`
  - `created_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `actor_id` -> `users(id)` `ON DELETE SET NULL`
- **Indexes**:
  - `activity_logs_actor_id_idx` on `(actor_id)`
  - `activity_logs_action_idx` on `(action)`
  - `activity_logs_resource_type_idx` on `(resource_type)`
  - `activity_logs_created_at_idx` on `(created_at)`

---

### Table 8: `landing_pages`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE CASCADE`
  - `title`: `varchar(255)`, NOT NULL
  - `target_url`: `varchar(500)`
  - `status`: `varchar(50)`, NOT NULL, default `'draft'`
  - `assigned_to`: `uuid`, references `users(id)` `ON DELETE SET NULL`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
  - `live_at`: `timestamptz`
  - `notes`: `text`
  - `google_doc_url`: `varchar(500)`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
  - `assigned_to` -> `users(id)` `ON DELETE SET NULL`
- **Indexes**:
  - `landing_pages_client_id_idx` on `(client_id)`
  - `landing_pages_status_idx` on `(status)`
  - `landing_pages_assigned_to_idx` on `(assigned_to)`

---

### Table 9: `client_articles`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE CASCADE`
  - `title`: `varchar(255)`, NOT NULL
  - `target_keyword`: `varchar(255)`
  - `live_url`: `varchar(500)`
  - `status`: `varchar(50)`, NOT NULL, default `'draft'`
  - `assigned_to`: `uuid`, references `users(id)` `ON DELETE SET NULL`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
  - `published_at`: `timestamptz`
  - `notes`: `text`
  - `google_doc_url`: `varchar(500)`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
  - `assigned_to` -> `users(id)` `ON DELETE SET NULL`
- **Indexes**:
  - `client_articles_client_id_idx` on `(client_id)`
  - `client_articles_status_idx` on `(status)`
  - `client_articles_assigned_to_idx` on `(assigned_to)`

---

### Table 10: `keywords`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE CASCADE`
  - `keyword`: `varchar(255)`, NOT NULL
  - `search_volume`: `integer`, default `0`
  - `current_rank`: `integer`
  - `previous_rank`: `integer`
  - `target_url`: `varchar(500)`
  - `status`: `varchar(50)`, NOT NULL, default `'active'`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
- **Indexes**:
  - `keywords_client_id_idx` on `(client_id)`
  - `keywords_status_idx` on `(status)`
  - `keywords_client_keyword_idx` on `(client_id, keyword)` (Unique)

---

### Table 11: `keyword_rank_history`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `keyword_id`: `uuid`, NOT NULL, references `keywords(id)` `ON DELETE CASCADE`
  - `rank`: `integer`
  - `recorded_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `keyword_id` -> `keywords(id)` `ON DELETE CASCADE`
- **Indexes**:
  - `keyword_rank_history_keyword_id_idx` on `(keyword_id)`
  - `keyword_rank_history_recorded_at_idx` on `(keyword_id, recorded_at)`

---

### Table 12: `tasks`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, references `clients(id)` `ON DELETE CASCADE` (Nullable for internal agency tasks)
  - `partner_id`: `uuid`, NOT NULL, references `users(id)` `ON DELETE RESTRICT`
  - `title`: `varchar(255)`, NOT NULL
  - `description`: `text`
  - `category`: `varchar(50)`, NOT NULL, default `'technical'`
  - `status`: `varchar(50)`, NOT NULL, default `'todo'`
  - `priority`: `varchar(20)`, NOT NULL, default `'medium'`
  - `assigned_to`: `uuid`, references `users(id)` `ON DELETE SET NULL`
  - `due_date`: `timestamptz`
  - `completed_at`: `timestamptz`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
  - `partner_id` -> `users(id)` `ON DELETE RESTRICT`
  - `assigned_to` -> `users(id)` `ON DELETE SET NULL`
- **Indexes**:
  - `tasks_client_id_idx` on `(client_id)`
  - `tasks_partner_id_idx` on `(partner_id)`
  - `tasks_status_idx` on `(status)`
  - `tasks_assigned_to_idx` on `(assigned_to)`

---

### Table 13: `citations`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE CASCADE`
  - `directory_name`: `varchar(255)`, NOT NULL
  - `listing_url`: `varchar(500)`
  - `status`: `varchar(50)`, NOT NULL, default `'submitted'`
  - `username`: `varchar(255)`
  - `password`: `varchar(255)`
  - `notes`: `text`
  - `submitted_at`: `timestamptz`, default `now()`
  - `verified_at`: `timestamptz`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
- **Indexes**:
  - `citations_client_id_idx` on `(client_id)`
  - `citations_status_idx` on `(status)`

---

### Table 14: `monthly_metrics`
- **Columns**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `client_id`: `uuid`, NOT NULL, references `clients(id)` `ON DELETE CASCADE`
  - `month`: `integer`, NOT NULL
  - `year`: `integer`, NOT NULL
  - `gsc_clicks`: `integer`
  - `gsc_impressions`: `integer`
  - `gsc_ctr`: `numeric(6, 3)`
  - `gsc_position`: `numeric(5, 2)`
  - `ga_sessions`: `integer`
  - `ga_users`: `integer`
  - `ga_new_users`: `integer`
  - `ga_views`: `integer`
  - `ga_engagement_rate`: `numeric(6, 3)`
  - `gbp_calls`: `integer`
  - `gbp_views`: `integer`
  - `gbp_directions`: `integer`
  - `gbp_website_clicks`: `integer`
  - `gbp_rating`: `numeric(3, 2)`
  - `gbp_reviews_count`: `integer`
  - `semrush_authority_score`: `integer`
  - `semrush_ranked_keywords`: `integer`
  - `created_at`: `timestamptz`, default `now()`
  - `updated_at`: `timestamptz`, default `now()`
- **Foreign Keys**:
  - `client_id` -> `clients(id)` `ON DELETE CASCADE`
- **Indexes**:
  - `monthly_metrics_client_id_idx` on `(client_id)`
  - `monthly_metrics_client_period_idx` on `(client_id, year, month)` (Unique)

---

## 2. MIGRATIONS

### Canonical Migration Path
The canonical migration path is **`scripts/migrate.mjs`**.
- It is executed directly in `server.mjs` on server boot before the Express server listens:
  ```js
  runMigrations().finally(() => {
    server.listen(port, '0.0.0.0', () => { ... })
  })
  ```
- It can also be executed manually via `npm run db:migrate`.
- The `drizzle/` directory has been removed; `drizzle-kit generate` migrations are **inert** and do not run in production.

### Schema Coverage Confirmation
Every table defined in `app/db/schema.ts` is explicitly created and maintained in `scripts/migrate.mjs`:
- Step 1: Base core tables (`messages`, `posts`, `users`, `media`, `clients`, `reports`)
- Step 2: `activity_logs`
- Step 3: Indexes on `reports`, `activity_logs`, and `users`
- Step 4: Share token columns & partial index on `reports`
- Step 5: `reports.client_snapshot`
- Step 6: `reports.deliverables_snapshot`
- Step 7: CRM Phase 1 tables (`landing_pages`, `client_articles`, `keywords`, `keyword_rank_history`, `tasks`)
- Step 8: `tasks.partner_id` column, backfill, and index
- Step 9: Soft deletes (`deleted_at`) on `clients` and `users`
- Step 10: `reports.client_id` FK migrated to `ON DELETE RESTRICT`
- Step 11: `citations` table
- Step 12: `monthly_metrics` table
- Step 13: `users.partner_id` FK migrated to `ON DELETE RESTRICT`
- Step 14: Google Doc URL and notes columns on `landing_pages` and `client_articles`
- Step 15: `clients.partner_id` FK migrated to `ON DELETE RESTRICT`
- Step 16: `tasks.partner_id` FK migrated to `ON DELETE RESTRICT`
- Step 17: Superadmin email normalization to lowercase
- Step 18: `users.client_id` FK migrated to `ON DELETE RESTRICT`
- Step 19: Re-verify `users.partner_id` constraint
- Step 20: Re-verify `clients.partner_id` constraint

### Drift Between Schema and Migration Script
There is **no functional drift** in tables, columns, or foreign keys. There is one minor non-breaking index definition nuance:
- **`reports.share_token` index**:
  - In `scripts/migrate.mjs` (Step 4), it was created as a partial unique index: `CREATE UNIQUE INDEX IF NOT EXISTS "reports_share_token_idx" ON "reports" ("share_token") WHERE "share_token" IS NOT NULL`.
  - In `app/db/schema.ts`, Drizzle defines it as a standard unique index: `uniqueIndex('reports_share_token_idx').on(table.shareToken)`.
  - In PostgreSQL, both treat non-null strings as uniquely constrained and allow multiple `NULL`s; behavior is completely compatible.

---

## 3. SERVER FUNCTIONS

There are **49 exported server functions** created via `createServerFn`. All role guards use strict allowlists (`assertSuperadminSession`, `assertPartnerOrSuperadminSession`, `assertStaffOrAbove`, `assertClientSession`).

### Summary by File

#### `app/server/activity.ts` (1 function)
1. `getActivityLogsServerFn`: Fetches paginated activity audit logs.
   - **Guard**: `assertSuperadminSession(auth)` (Superadmin only)
   - **UI Caller**: `src/routes/superadmin/activity.tsx`

#### `app/server/clients.ts` (5 functions)
2. `getClientsServerFn`: Retrieves clients for the current partner or specified partner (if superadmin).
   - **Guard**: `assertPartnerOrSuperadminSession(auth)`
   - **UI Caller**: `src/routes/admin/clients/index.tsx`, `src/routes/admin/workspace.tsx`, `src/routes/admin/reports/new.tsx`, `src/components/crm/MonthlyMetricsForm.tsx`
3. `getClientByIdServerFn`: Retrieves details and report counts for a single client with tenancy check.
   - **Guard**: `assertPartnerOrSuperadminSession(auth)`
   - **UI Caller**: `src/routes/admin/clients/$clientId.tsx`
4. `createClientServerFn`: Inserts a new client scoped to effective partner ID.
   - **Guard**: `assertPartnerOrSuperadminSession(auth)`
   - **UI Caller**: `src/routes/admin/clients/index.tsx`
5. `updateClientServerFn`: Updates client business details and branding colors.
   - **Guard**: `assertPartnerOrSuperadminSession(auth)`
   - **UI Caller**: `src/routes/admin/clients/$clientId.tsx`
6. `deleteClientServerFn`: Soft-deletes a client (`deleted_at = now()`).
   - **Guard**: `assertPartnerOrSuperadminSession(auth)`
   - **UI Caller**: `src/routes/admin/clients/$clientId.tsx`

#### `app/server/crm.ts` (21 functions)
7. `getLandingPagesServerFn`: Lists landing pages for client or current staff assignee.
   - **Guard**: `assertStaffOrAbove(auth)`
   - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`
8. `createLandingPageServerFn`: Creates landing page deliverable.
   - **Guard**: `assertStaffOrAbove(auth)`
   - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`
9. `updateLandingPageStatusServerFn`: Updates landing page workflow status and sets `live_at`.
   - **Guard**: `assertStaffOrAbove(auth)`
   - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`
10. `updateLandingPageServerFn`: Updates landing page title, URL, assignee, notes, doc URL.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`
11. `deleteLandingPageServerFn`: Removes landing page.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`
12. `getClientArticlesServerFn`: Lists client article deliverables.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/ArticlesBoard.tsx`
13. `createClientArticleServerFn`: Creates client article.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/ArticlesBoard.tsx`
14. `updateClientArticleStatusServerFn`: Updates article workflow status and sets `published_at`.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/ArticlesBoard.tsx`
15. `updateClientArticleServerFn`: Updates article title, keyword, URL, notes, doc URL.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/ArticlesBoard.tsx`
16. `deleteClientArticleServerFn`: Removes client article.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/ArticlesBoard.tsx`
17. `getKeywordsServerFn`: Fetches tracked keywords with 6-month rank history.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/KeywordsBoard.tsx`
18. `createKeywordServerFn`: Adds keyword and creates initial rank history record.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/KeywordsBoard.tsx`
19. `updateKeywordServerFn`: Updates keyword, rank, search volume, URL.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/KeywordsBoard.tsx`
20. `deleteKeywordServerFn`: Removes tracked keyword.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/KeywordsBoard.tsx`
21. `getTasksServerFn`: Fetches tasks for partner/client or assigned staff.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/TasksBoard.tsx`
22. `createTaskServerFn`: Creates new task.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/TasksBoard.tsx`
23. `updateTaskStatusServerFn`: Updates task status and sets `completed_at`.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/TasksBoard.tsx`
24. `updateTaskServerFn`: Updates task details, client, assignee, due date.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/TasksBoard.tsx`
25. `deleteTaskServerFn`: Removes task.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/TasksBoard.tsx`
26. `getMyWorkServerFn`: Fetches deliverables assigned directly to logged-in user.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/routes/my-work.tsx`
27. `getAgencyTeamPickerServerFn`: Fetches team members list for assignment dropdowns.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/components/crm/LandingPagesBoard.tsx`, `src/components/crm/ArticlesBoard.tsx`, `src/components/crm/TasksBoard.tsx`
28. `getMonthlyMetricsServerFn`: Fetches monthly KPI metrics for client and period.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/MonthlyMetricsForm.tsx`
29. `saveMonthlyMetricsServerFn`: Upserts monthly KPI metrics via `recordMonthlyMetrics`.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/MonthlyMetricsForm.tsx`
30. `previewSemrushCsvServerFn`: Parses SEMrush CSV data, checks matches, calculates rank movement.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/SemrushImporterModal.tsx`
31. `commitSemrushCsvImportServerFn`: Commits parsed SEMrush rankings to DB and creates rank history entries.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/SemrushImporterModal.tsx`
32. `getCitationsServerFn`: Lists local directory citations for client.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/CitationsBoard.tsx`
33. `createCitationServerFn`: Adds citation record.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/CitationsBoard.tsx`
34. `updateCitationServerFn`: Updates citation status, credentials, and verification timestamp.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/CitationsBoard.tsx`
35. `deleteCitationServerFn`: Removes citation.
    - **Guard**: `assertStaffOrAbove(auth)`
    - **UI Caller**: `src/components/crm/CitationsBoard.tsx`

#### `app/server/leads.ts` (2 functions)
36. `submitAuditLead`: Ingests free SEO audit leads from marketing form.
    - **Guard**: Public (`getClientIp`, rate limited)
    - **UI Caller**: `src/routes/audit.tsx`
37. `submitContactLead`: Ingests contact inquiries from marketing form.
    - **Guard**: Public (`getClientIp`, rate limited)
    - **UI Caller**: `src/routes/contact.tsx`

#### `app/server/media.ts` (3 functions)
38. `getMediaServerFn`: Lists uploaded media files.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/media.tsx`, `src/components/MediaPickerModal.tsx`
39. `uploadMediaServerFn`: Uploads and stores media file.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/media.tsx`, `src/components/MediaPickerModal.tsx`
40. `deleteMediaServerFn`: Deletes media file from storage and DB.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/media.tsx`

#### `app/server/messages.ts` (3 functions)
41. `getMessagesServerFn`: Lists contact/audit form inquiries.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/messages.tsx`
42. `updateMessageStatusServerFn`: Toggles message status (read, archived, etc.).
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/messages.tsx`
43. `deleteMessageServerFn`: Deletes message inquiry.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/messages.tsx`

#### `app/server/partners.ts` (7 functions)
44. `getPartnersServerFn`: Lists partner agencies with client counts.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/index.tsx`
45. `getAgencyDetailServerFn`: Fetches agency details, team members, and clients.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/$partnerId.tsx`
46. `createPartnerServerFn`: Registers new partner agency account.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/index.tsx`
47. `updatePartnerServerFn`: Updates partner name, email, or branding.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/$partnerId.tsx`
48. `togglePartnerActiveServerFn`: Activates or deactivates partner agency.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/$partnerId.tsx`
49. `assignClientPartnerServerFn`: Reassigns client to another partner.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/unassigned.tsx`
50. `deletePartnerServerFn`: Soft-deletes partner agency user.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/agencies/$partnerId.tsx`

#### `app/server/passwords.ts` (3 functions)
51. `changeMyPasswordServerFn`: Allows logged-in user to change their own password.
    - **Guard**: `assertAnyAuthenticatedSession(auth)`
    - **UI Caller**: `src/components/ChangePasswordModal.tsx`
52. `adminResetUserPasswordServerFn`: Resets password for team member or client.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/components/ResetUserPasswordModal.tsx`
53. `getAllUsersForAdminServerFn`: Fetches users list for password reset modal.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/components/ResetUserPasswordModal.tsx`

#### `app/server/posts.ts` (7 functions)
54. `getAdminPostsServerFn`: Lists blog posts in agency marketing blog.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/posts.tsx`
55. `getPostByIdServerFn`: Retrieves single post for editing.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: **FLAGGED: NONE** (The UI in `admin/posts.tsx` performs inline state selection using the post list already fetched by `getAdminPostsServerFn`).
56. `createPostServerFn`: Creates new agency marketing post.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/posts.tsx`
57. `updatePostServerFn`: Updates existing marketing post.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/posts.tsx`
58. `deletePostServerFn`: Deletes marketing post.
    - **Guard**: `assertSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/posts.tsx`
59. `getPublicPostsServerFn`: Fetches published marketing blog posts.
    - **Guard**: Public
    - **UI Caller**: `src/routes/blog/index.tsx`
60. `getPublicPostBySlugServerFn`: Fetches published blog post by slug.
    - **Guard**: Public
    - **UI Caller**: `src/routes/blog/$slug.tsx`

#### `app/server/reports.ts` (13 functions)
61. `getReportsServerFn`: Lists reports filtered by effective partner ID or client.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/index.tsx`, `src/routes/admin/clients/$clientId.tsx`
62. `getLatestReportForClientServerFn`: Fetches most recent report for client.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/clients/$clientId.tsx`
63. `getReportByIdServerFn`: Fetches single report with client details.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`, `src/routes/admin/reports/$id.edit.tsx`
64. `getPortalReportsServerFn`: Fetches reports viewable by client login.
    - **Guard**: `assertClientSession(auth)`
    - **UI Caller**: `src/routes/portal/index.tsx`
65. `getReportPreflightDataServerFn`: Validates metrics availability before generating report.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/new.tsx`
66. `createReportServerFn`: Creates report with frozen client and deliverables snapshots.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/new.tsx`
67. `regenerateReportServerFn`: Refreshes report snapshots and metrics from live CRM data.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`
68. `updateReportServerFn`: Updates report narrative, metrics, or display options.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.edit.tsx`
69. `updateReportDisplayOptionsServerFn`: Updates quick visibility flags on report.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`
70. `deleteReportServerFn`: Deletes report.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`, `src/routes/admin/reports/index.tsx`
71. `generateReportShareLinkServerFn`: Generates secure unguessable 64-char share token.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`
72. `revokeReportShareLinkServerFn`: Revokes share token.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/reports/$id.tsx`
73. `getPublicReportByShareTokenServerFn`: Renders public report for client via token.
    - **Guard**: Public
    - **UI Caller**: `src/routes/r/$shareToken.tsx`

#### `app/server/team.ts` (4 functions)
74. `getTeamMembersServerFn`: Lists team members for partner or specified partner (superadmin).
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/team.tsx`
75. `createTeamMemberServerFn`: Invites/creates partner employee.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/team.tsx`
76. `deleteTeamMemberServerFn`: Soft-deletes team member.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/team.tsx`
77. `toggleTeamMemberActiveServerFn`: Toggles team member active/disabled status.
    - **Guard**: `assertPartnerOrSuperadminSession(auth)`
    - **UI Caller**: `src/routes/admin/team.tsx`

#### `app/lib/auth.ts` (3 functions)
78. `checkAuthServerFn`: Verifies active session token from cookie.
    - **Guard**: Public / Session inspector
    - **UI Caller**: `src/routes/__root.tsx`, `src/routes/login.tsx`, `src/routes/admin.tsx`, `src/routes/portal.tsx`
79. `loginServerFn`: Authenticates email and password, issues HMAC session cookie.
    - **Guard**: Public (`getClientIp`, rate limited)
    - **UI Caller**: `src/routes/login.tsx`
80. `logoutServerFn`: Clears session cookie and invalidates session.
    - **Guard**: `assertAnyAuthenticatedSession(auth)`
    - **UI Caller**: `src/components/LogoutButton.tsx`

#### `app/lib/hostname.ts` (1 function)
81. `checkHostnameRoutingServerFn`: Inspects request hostname for custom white-label domain routing.
    - **Guard**: Public
    - **UI Caller**: **FLAGGED: NONE** (Reserved utility for future multi-domain custom host routing).

### FLAGGED SERVER FUNCTIONS (No UI calls)
Only **two** exported server functions are currently uncalled in the UI:
1. `getPostByIdServerFn` (`app/server/posts.ts`)
2. `checkHostnameRoutingServerFn` (`app/lib/hostname.ts`)

---

## 4. ROUTES

There are **40 routes** in `src/routes`.

| Route Path | File | Components Rendered | Roles Permitted | Navigation / Entry Point |
|---|---|---|---|---|
| `/` | `index.tsx` | `Navbar`, `InteractiveComparisonCard`, `Footer` | Public | Brand Logo / Home Nav |
| `/about` | `about.tsx` | `Navbar`, `Footer` | Public | Header Nav / Footer Nav |
| `/contact` | `contact.tsx` | `Navbar`, `Footer` | Public | Header CTA / Footer Nav |
| `/audit` | `audit.tsx` | `Navbar`, `Footer` | Public | Hero CTAs / Header "Free Audit" |
| `/local-seo-gbp` | `local-seo-gbp.tsx` | `Navbar`, `Footer` | Public | Header "Services" Dropdown |
| `/websites-care` | `websites-care.tsx` | `Navbar`, `Footer` | Public | Header "Services" Dropdown |
| `/systems-auto` | `systems-auto.tsx` | `Navbar`, `Footer` | Public | Header "Services" Dropdown |
| `/work` | `work.tsx` | `Navbar`, `Footer` | Public | Header Nav |
| `/thank-you` | `thank-you.tsx` | `Navbar`, `Footer` | Public | Form submit redirection |
| `/cookie-policy` | `cookie-policy.tsx` | `Navbar`, `Footer` | Public | Footer Links |
| `/privacy-policy` | `privacy-policy.tsx` | `Navbar`, `Footer` | Public | Footer Links |
| `/terms` | `terms.tsx` | `Navbar`, `Footer` | Public | Footer Links |
| `/blog` | `blog/index.tsx` | `Navbar`, `Footer` | Public | Header Nav / Footer Nav |
| `/blog/$slug` | `blog/$slug.tsx` | `Navbar`, `Footer` | Public | Blog article cards |
| `/login` | `login.tsx` | `ThemeToggle` | Public / Anonymous | Header "Client Portal" & direct `/login` |
| `/r/$shareToken` | `r/$shareToken.tsx` | `ReportDocument` | Public (Unlisted Token) | Direct link generated via report share |
| `/portal` | `portal.tsx` | `LogoutButton`, `ChangePasswordModal` | `client` | Post-login redirect for clients |
| `/portal/` | `portal/index.tsx` | Client portal report cards | `client` | Portal root |
| `/portal/reports/$id` | `portal/reports/$id.tsx` | `ReportDocument` | `client` | "View Report" from portal list |
| `/my-work` | `my-work.tsx` | `ThemeToggle`, `LogoutButton`, `ChangePasswordModal` | `partner_employee`, `partner`, `superadmin` | Header / User profile menu |
| `/admin` | `admin.tsx` | `AdminNav`, `ChangePasswordModal`, `ResetUserPasswordModal` | `superadmin`, `partner`, `partner_employee` | Primary operational layout |
| `/admin/` | `admin/index.tsx` | Dashboard summary cards | `superadmin`, `partner`, `partner_employee` | Admin Nav: "Dashboard" |
| `/admin/workspace` | `admin/workspace.tsx` | `LandingPagesBoard`, `ArticlesBoard`, `KeywordsBoard`, `TasksBoard`, `MonthlyMetricsForm`, `CitationsBoard` | `superadmin`, `partner`, `partner_employee` | Admin Nav: "Workspace" |
| `/admin/clients` | `admin/clients/index.tsx` | `ClientCard`, `ThemeToggle` | `superadmin`, `partner` | Admin Nav: "Clients" |
| `/admin/clients/$clientId` | `admin/clients/$clientId.tsx` | `LandingPagesBoard`, `ArticlesBoard`, `KeywordsBoard`, `TasksBoard`, `CitationsBoard`, `MonthlyMetricsForm` | `superadmin`, `partner` | Click on client card |
| `/admin/reports` | `admin/reports/index.tsx` | Report list table, filter bars | `superadmin`, `partner` | Admin Nav: "Reports" |
| `/admin/reports/new` | `admin/reports/new.tsx` | Report creation wizard, pre-flight gate | `superadmin`, `partner` | "Create Report" button |
| `/admin/reports/$id` | `admin/reports/$id.tsx` | `ReportDocument`, action toolbars | `superadmin`, `partner` | Click report row |
| `/admin/reports/$id.edit` | `admin/reports/$id.edit.tsx` | Report narrative & metric editors | `superadmin`, `partner` | "Edit Narrative" from report view |
| `/admin/agencies` | `admin/agencies/index.tsx` | Agency cards, partner registration | `superadmin` only | Admin Nav: "Agencies" |
| `/admin/agencies/$partnerId` | `admin/agencies/$partnerId.tsx` | Agency details, client & staff lists | `superadmin` only | Click agency card |
| `/admin/agencies/unassigned` | `admin/agencies/unassigned.tsx` | Direct/unassigned clients table | `superadmin` only | "Unassigned Clients" pill |
| `/admin/team` | `admin/team.tsx` | Team member roster, invite modal | `superadmin`, `partner` | Admin Nav: "Team" |
| `/admin/media` | `admin/media.tsx` | Media library grid, file upload | `superadmin`, `partner` | Admin Nav: "Media" |
| `/admin/posts` | `admin/posts.tsx` | Agency blog post manager & editor | `superadmin` only | Admin Nav: "Blog Posts" |
| `/messages` | `messages.tsx` | Inquiry list, status toggles | `superadmin` only | Admin Nav: "Inquiries" |
| `/superadmin` | `superadmin.tsx` | Superadmin navigation wrapper | `superadmin` only | Direct layout wrapper |
| `/superadmin/activity` | `superadmin/activity.tsx` | Audit log timeline, filters | `superadmin` only | Admin Nav: "Activity Logs" |

---

## 5. COMPONENTS — ORPHAN AUDIT

There are **22 components** in `src/components/`. All 22 are actively rendered. **There are 0 orphaned components.**

| Component File | Rendered In / Parent | Reachable Status |
|---|---|---|
| `AdminNav.tsx` | `src/routes/admin.tsx` | Active (Admin layout header & navigation) |
| `ChangePasswordModal.tsx` | `src/routes/admin.tsx`, `src/routes/portal.tsx`, `src/routes/my-work.tsx` | Active (User profile dropdown) |
| `ClientCard.tsx` | `src/routes/admin/clients/index.tsx` | Active (Renders each client tile) |
| `CodeTerminalInspector.tsx` | `src/routes/admin/reports/$id.tsx` | Active (Raw JSON inspector on report preview) |
| `ConfirmModal.tsx` | `src/components/crm/MonthlyMetricsForm.tsx` | Active (Confirm overwrite dialog) |
| `crm/ArticlesBoard.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Articles" tab) |
| `crm/CitationsBoard.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Citations" tab) |
| `crm/KeywordsBoard.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Keywords" tab) |
| `crm/LandingPagesBoard.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Landing Pages" tab) |
| `crm/MonthlyMetricsForm.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Monthly KPI Metrics" tab) |
| `crm/SemrushImporterModal.tsx` | `src/components/crm/KeywordsBoard.tsx` | Active (Reachable via "Import SEMrush CSV") |
| `crm/TasksBoard.tsx` | `src/routes/admin/workspace.tsx`, `src/routes/admin/clients/$clientId.tsx` | Active ("Tasks" tab) |
| `Footer.tsx` | Marketing routes (`index.tsx`, `about.tsx`, `work.tsx`, etc.) | Active |
| `InteractiveComparisonCard.tsx` | `src/routes/index.tsx` | Active (Homepage interactive demo) |
| `LogoutButton.tsx` | `src/components/AdminNav.tsx`, `src/routes/portal.tsx`, `src/routes/my-work.tsx` | Active |
| `MediaPickerModal.tsx` | `src/routes/admin/clients/index.tsx`, `src/routes/admin/clients/$clientId.tsx`, `src/routes/admin/posts.tsx` | Active (Select logo / featured image) |
| `Navbar.tsx` | Marketing routes (`index.tsx`, `about.tsx`, `contact.tsx`, etc.) | Active |
| `ReportDocument.tsx` | `src/routes/admin/reports/$id.tsx`, `src/routes/r/$shareToken.tsx`, `src/routes/portal/reports/$id.tsx` | Active (The canonical 2-page print report) |
| `ResetUserPasswordModal.tsx` | `src/routes/admin.tsx` | Active (Opened from AdminNav for admins) |
| `ThemedNumberInput.tsx` | `src/components/crm/MonthlyMetricsForm.tsx` | Active (KPI input fields) |
| `ThemeToggle.tsx` | `src/components/AdminNav.tsx`, `src/components/Navbar.tsx`, `src/routes/login.tsx` | Active |
| `Toast.tsx` | `src/components/crm/MonthlyMetricsForm.tsx`, `src/components/crm/CitationsBoard.tsx` | Active (Notification toasts) |

### Specific Verification: `SemrushImporterModal`
- **Reachable from UI**: **YES**.
- **Screens**:
  1. `/admin/workspace` (Select any client -> click `Keywords` tab)
  2. `/admin/clients/$clientId` (Click `Keywords` tab)
- **Button**:
  - Located in header of `KeywordsBoard.tsx` (lines 405-412):
    ```tsx
    <button
      type="button"
      onClick={() => setIsImporterOpen(true)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-xs"
    >
      <Upload className="w-4 h-4" />
      <span>Import SEMrush CSV</span>
    </button>
    ```
  - Clicking this button sets `isImporterOpen = true`, which renders `<SemrushImporterModal isOpen={isImporterOpen} ... />`.

---

## 6. CSV IMPORT

### Does CSV import exist?
**YES**, SEMrush CSV rank import is fully implemented and operational.

### Files Implementing CSV Import
1. `src/components/crm/SemrushImporterModal.tsx`: The 2-step interactive modal UI (Upload/Paste -> Server Preview -> Movement Highlights -> User Review -> Commit).
2. `app/server/crm.ts`: The backend logic containing `previewSemrushCsvServerFn` and `commitSemrushCsvImportServerFn`.

### Screens Exposing It
- `/admin/workspace` -> `Keywords` tab -> `Import SEMrush CSV`
- `/admin/clients/$clientId` -> `Keywords` tab -> `Import SEMrush CSV`

### End-to-End Flow Verification
1. **Upload / Paste**: User drops `.csv` exported from SEMrush Position Tracking (or pastes raw CSV).
2. **Client-side Parsing**: Modal cleans lines and extracts `Keyword`, `Position`, `Search Volume`, and `URL`.
3. **Server Preview (`previewSemrushCsvServerFn`)**:
   - Matches incoming terms against existing keywords in the database for that client.
   - Calculates rank delta (improved, declined, new, unchanged).
   - Separates rows into `matched` and `unmatched`.
4. **Preview Screen**:
   - Displays summary metric cards: `Total In File`, `Matched to Tracked`, `New / Unmatched`, `Rank Improved`, `Rank Dropped`.
   - Renders tabbed tables showing rank changes (`#12 -> #8 (+4)`).
   - Features an explicit toggle: *"Also create X unmatched keywords in workspace"*. Unmatched keywords are NOT imported unless the user explicitly checks this box.
5. **Commit (`commitSemrushCsvImportServerFn`)**:
   - Updates `keywords` table (`current_rank`, `previous_rank`, `search_volume`, `target_url`).
   - Appends historical rank records into `keyword_rank_history` table for chart tracking.
   - If user opted in, inserts new keyword rows for unmatched terms.

### Code Quotes (Server Functions)

#### `previewSemrushCsvServerFn` (`app/server/crm.ts`):
```ts
export const previewSemrushCsvServerFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { clientId: string; rows: SemrushImportRow[] }) => data)
  .handler(async ({ data, context }) => {
    const auth = context.auth
    assertStaffOrAbove(auth)
    const effectivePartnerId = getEffectivePartnerId(auth)

    // Tenancy verification on client
    const client = await db.query.clients.findFirst({
      where: and(
        eq(clients.id, data.clientId),
        isNull(clients.deletedAt),
        effectivePartnerId ? eq(clients.partnerId, effectivePartnerId) : undefined
      ),
    })
    if (!client) {
      throw new Error('Client not found or unauthorized')
    }

    // Fetch existing tracked keywords
    const existingKeywords = await db.query.keywords.findMany({
      where: and(eq(keywords.clientId, data.clientId), isNull(keywords.status)), // or active
    })
    ...
```

#### `commitSemrushCsvImportServerFn` (`app/server/crm.ts`):
```ts
export const commitSemrushCsvImportServerFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: {
    clientId: string
    rows: SemrushImportRow[]
    createUnmatchedKeywords?: boolean
  }) => data)
  .handler(async ({ data, context }) => {
    const auth = context.auth
    assertStaffOrAbove(auth)
    ...
    // Updates keywords.currentRank, keywords.previousRank
    // Appends to keyword_rank_history
```

---

## 7. REPORT PIPELINE

### Creation Flow & Pre-flight Validation
1. User navigates to `/admin/reports/new`.
2. Selects Client, Month, and Year.
3. The page runs `getReportPreflightDataServerFn`:
   - Checks if `monthly_metrics` exists for `(clientId, month, year)`.
   - If missing, report creation is **hard-blocked**. The UI displays an amber warning banner:
     *"Monthly KPI metrics have not been recorded for this period yet. Reports require verified monthly metrics to generate charts and KPI summaries."* with a direct button linking to the KPI form.
4. User clicks "Generate Performance Report", invoking `createReportServerFn`.

### Data Read & Frozen Snapshot
When `createReportServerFn` executes:
1. It reads verified `monthly_metrics` for `(clientId, month, year)`.
2. It fetches prior month metrics `(month - 1, year)` to compute MoM delta percentages.
3. It freezes the **`client_snapshot`** (`jsonb`):
   - `businessName`, `name`, `websiteUrl`, `logoUrl`, `logoBgColor`, `primaryColor`, `secondaryColor`, `isWhiteLabel`, `partnerName`, `partnerLogoUrl`, `partnerLogoBgColor`.
4. It compiles and freezes the **`deliverables_snapshot`** via `collectDeliverablesSnapshot`:
   - `landingPages`: Landing pages with `live_at` inside the report period.
   - `articles`: Articles with `published_at` inside the report period.
   - `tasks`: Completed tasks (`completed_at` in period) belonging to this client.
   - `nextKeywords`: Top target keywords with current rank and search volume for the upcoming cycle.
5. Inserts into `reports` with `client_snapshot` and `deliverables_snapshot`.

### `ReportDocument.tsx` Rendering Inventory

#### Page 1: Executive KPI Scoreboard (Lines 262 to 746)
Rendered in exact order:
1. **Header Banner**:
   - Agency/Client Logo (`logoUrl` with background container `logoBgColor`).
   - Partner branding badge (if white-labeled/partner enabled).
   - Client Business Name, Website URL, Report Month badge, and Generation Date.
2. **Executive Summary Card**:
   - Editorial narrative highlighting overarching monthly progress.
3. **Monthly Highlights (3-Pill Grid)**:
   - Three key bullet points with check icons and branded accent borders.
4. **Core KPI Scoreboard (4 Metric Cards)**:
   - Organic Clicks (GSC): Value, Previous Month value, MoM Delta % Badge.
   - Search Impressions (GSC): Value, MoM Delta % Badge.
   - Total Website Sessions (GA4): Value, MoM Delta % Badge.
   - Google Business Profile Actions (Calls + Directions + Website clicks): Value, MoM Delta % Badge.
5. **Channel Performance Deep Dive (3 Sub-Cards)**:
   - **Google Search Console**: Clicks, Impressions, CTR %, Average Position.
   - **Google Analytics 4**: Sessions, Total Users, New Users, Engagement Rate %.
   - **Google Business Profile**: Total Interactions, Direct Phone Calls, Direction Requests, Website Clicks, Star Rating & Review Count.
6. **Page 1 Footer**:
   - Partner / Agency notice, "Prepared exclusively for {businessName}", and "Page 1 of 2".

#### Page 2: Visibility Tables, Deliverables & Roadmap (Lines 760 to 1271)
Rendered in exact order:
1. **Section Header**:
   - "Detailed Search Visibility & Strategic Deliverables", Business Name, and Report Month.
2. **Search Visibility Tables (Side-by-Side Grid)**:
   - **Top Search Queries (GSC)**: Top 5 queries ranked by clicks, impressions, and average position.
   - **Top Landing Pages (GSC)**: Top 5 landing pages ranked by impressions and average position.
3. **Deliverables & Content Published (From `deliverables_snapshot`)**:
   - **Live Deliverables & Content Published**:
     - List of live Landing Pages with title and external live URL link.
     - List of published Articles with title and external live URL link.
   - **Completed Campaign Tasks**:
     - Completed tasks in period with category tag (`technical`, `on_page`, etc.).
   - **Next Organic Search Targets**:
     - Grid of next priority keywords with monthly search volume and current rank.
4. **Strategic Priorities & Next Steps**:
   - **Work Completed Highlights**: Narrative bullets detailing operational accomplishments.
   - **Next Steps & Strategic Priorities**: Numbered sequential priority items for the coming month.
5. **Campaign Focus Areas (4 Status Badges)**:
   - Google Business Profile (Optimization & Engagement).
   - Local Search Visibility (Target Keyword Growth).
   - Reputation Management (Review Monitoring & Replies).
   - Neighborhood Coverage (Local Content Expansion).
6. **Page 2 Footer**:
   - Partner branding notice, "Prepared exclusively for {businessName}", and "Page 2 of 2".

---

## 8. METRICS ENTRY

### Where Metrics are Entered
Monthly metrics are entered in **`src/components/crm/MonthlyMetricsForm.tsx`**, which is rendered on:
- `/admin/workspace` -> `Monthly KPI Metrics` tab.
- `/admin/clients/$clientId` -> `Monthly KPI Metrics` tab.

### Fields Shown on the Form
The form renders **17 metric input fields** divided into four platform sections:

1. **Google Search Console**:
   - `gscClicks`: Total Clicks (Integer)
   - `gscImpressions`: Total Impressions (Integer)
   - `gscCtr`: Click-Through Rate (Decimal %, step 0.01)
   - `gscPosition`: Average Position (Decimal, step 0.1, inverted delta color)
2. **Google Analytics 4**:
   - `gaSessions`: Total Sessions (Integer)
   - `gaUsers`: Total Users (Integer)
   - `gaNewUsers`: New Users (Integer)
   - `gaViews`: Pageviews (Integer)
   - `gaEngagementRate`: Engagement Rate (Decimal %, step 0.01)
3. **Google Business Profile**:
   - `gbpCalls`: Direct Phone Calls (Integer)
   - `gbpViews`: Profile Views (Integer)
   - `gbpDirections`: Direction Requests (Integer)
   - `gbpWebsiteClicks`: Website Clicks (Integer)
   - `gbpRating`: Average Star Rating (Decimal 1.0 - 5.0, step 0.1)
   - `gbpReviewsCount`: Total Reviews Count (Integer)
4. **SEMrush**:
   - `semrushAuthorityScore`: Authority Score (Integer 0 - 100)
   - `semrushRankedKeywords`: Total Ranked Keywords (Integer)

### Columns in `monthly_metrics` NOT on the Form
Every single KPI metric column in `monthly_metrics` is present on the form. The only columns in `monthly_metrics` that are not entered as inputs are database metadata columns:
- `id`: Auto-generated UUID primary key.
- `client_id`: Chosen via the client dropdown at the top of the form.
- `month`: Chosen via the month dropdown at the top of the form.
- `year`: Chosen via the year dropdown at the top of the form.
- `created_at`: Set automatically on insert (`now()`).
- `updated_at`: Set automatically on update (`now()`).

---

## 9. WHAT IS ACTUALLY WIRED

| Feature Area | Status | Concrete Evidence from Code |
|---|---|---|
| **Multi-Tenant Partner Scoping** | `WORKING` | `getEffectivePartnerId(auth)` strictly scopes all queries in `clients.ts`, `crm.ts`, `reports.ts`, `team.ts`. Tested with 328 automated assertions. |
| **Client Portal** | `WORKING` | `/portal` layout and `/portal/reports/$id` authenticate client role, restrict access via `users.client_id`, and render reports. |
| **Staff "My Work" View** | `WORKING` | `/my-work` route calls `getMyWorkServerFn(assignedTo: userId)` returning assigned landing pages, articles, and tasks. |
| **Landing Pages CRM** | `WORKING` | `LandingPagesBoard.tsx` handles CRUD, workflow status transitions, assignees, Google Doc URLs, and notes. |
| **Articles CRM** | `WORKING` | `ArticlesBoard.tsx` handles CRUD, published status, keyword associations, Google Doc URLs, and notes. |
| **Citations Tracker** | `WORKING` | `CitationsBoard.tsx` tracks directory URL, username, password, status, and verification dates. |
| **SEMrush CSV Import** | `WORKING` | `SemrushImporterModal.tsx` handles preview, delta calculations, opt-in keyword creation, and history tracking. |
| **Monthly Metrics Ingestion** | `WORKING` | `MonthlyMetricsForm.tsx` upserts to `monthly_metrics` via canonical gateway `recordMonthlyMetrics`. |
| **Report Generation & Pre-flight** | `WORKING` | `createReportServerFn` blocks if metrics are missing, snapshots branding & deliverables, and renders 2-page print layout. |
| **Public Report Share Links** | `WORKING` | `/r/$shareToken` route resolves report via unguessable 64-character token without authentication. |
| **Agency / Partner Management** | `WORKING` | `/admin/agencies` allows superadmin to create, edit, deactivate, and delete partner agencies. |
| **Unassigned Clients View** | `WORKING` | `/admin/agencies/unassigned` allows superadmin to view and reassign direct clients. |
| **Team Management & Invites** | `WORKING` | `/admin/team` allows partner/superadmin to create staff, assign roles, and toggle access. |
| **Media Library** | `WORKING` | `/admin/media` and `MediaPickerModal.tsx` handle uploads and client logo selection. |
| **Public Marketing Site & Blog** | `WORKING` | Routes `/`, `/about`, `/contact`, `/audit`, `/work`, `/blog`, `/blog/$slug` render marketing content. |
| **Activity Audit Logging** | `WORKING` | `logActivity` records mutations to `activity_logs`; viewable at `/superadmin/activity`. |
| **Automated Google API Sync** | `NOT BUILT` | Planned future seam: `recordMonthlyMetrics` is built to accept automated API sync, but Google OAuth workers are not yet implemented. |
| **Multi-Domain Custom Host Routing** | `PARTIAL` | `checkHostnameRoutingServerFn` exists in `hostname.ts`, but dynamic reverse-proxy hostname resolution is not yet wired to routes. |
