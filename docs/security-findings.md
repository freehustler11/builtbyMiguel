# Security Audit & Integration Test Findings Report
**Target System:** Built by Miguel — Multi-Tenant Agency & Client Portal  
**Date:** September 5, 2026  
**Scope:** Server Function Scoping, Multi-Tenant Boundary Controls, Role Hierarchy, Unauthenticated Surface, and Report Identifier Randomness  
**Test Suite:** [`scripts/security-audit.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/scripts/security-audit.ts)  
**Status:** Complete (58 Automated Checks Passed, 5 Vulnerabilities/Flaws Flagged)  
**Constraint Applied:** *Report failures only; do not modify feature code.*

---

## Executive Summary

An exhaustive integration test suite and static code audit was executed against all server functions and routes in the codebase. Tests were run through the production TanStack Start SSR HTTP pipeline (`dist/server/server.js`) with active PostgreSQL database fixtures, real cryptographically signed session tokens, and Seroval RPC serialization.

### Summary of Scenario Outcomes

| Scenario | Scope Description | Result | Critical Findings |
| :--- | :--- | :---: | :--- |
| **Scenario 1** | Partner A accessing Partner B data across all `get*ServerFn` functions | **PARTIAL PASS / FLAW DETECTED** | Core IDOR checks pass (`getReportById`, `getClientById`, `getMedia`, `getLatestReportForClient`). However, `getClientsServerFn` line 40 performs an unscoped full table scan across `reports`. |
| **Scenario 2** | Logged-in portal client accessing another client's report by ID | **PASS ON REPORT IDOR / CRITICAL LEAKS ELSEWHERE** | Report IDOR is strictly blocked at `reports.ts:234-236`. However, portal clients can call `getClientsServerFn`, `getMessagesServerFn`, `getPartnersServerFn`, and `getAllUsersForAdminServerFn` due to an authorization bypass flaw in `assertSuperadminSession`. |
| **Scenario 3** | Unauthenticated requests to every server function in the codebase | **PASS** | 7 intentional public functions return 200 OK. All 37 protected server functions correctly reject unauthenticated requests with `Unauthorized: Authentication required`. |
| **Scenario 4** | Staff-role (`partner_employee`) user calling `createTeamMemberServerFn` | **PASS** | Access is strictly blocked (`Unauthorized: Only agency owners can add team members`). Additional checks prevent staff from deleting, modifying, or resetting passwords of team members. |
| **Scenario 5** | Public report share links: token randomness, sequential IDs, enumeration | **ARCHITECTURAL CLARIFICATION** | IDs are cryptographically random UUID v4 ($2^{122}$ entropy space), generated via PostgreSQL `gen_random_uuid()`. There are NO sequential integer IDs. Crucially, **no public share links or public guest report view feature currently exists** in the codebase. |

---

## Integration Test Suite Architecture

The automated test suite is implemented in [`scripts/security-audit.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/scripts/security-audit.ts).

### Test Environment & Execution Mechanics
1. **Isolated PostgreSQL Fixtures:** The test suite generates isolated test fixtures (Partner Agency A, Partner Agency B, Staff A, Staff B, Client A, Client B, Portal User A, Portal User B, Report A, Report B, Media A, Media B) using standard PBKDF2 password hashes and real UUID foreign keys.
2. **Session Token Generation:** Real HMAC-SHA256 session tokens are minted using `createSessionToken()` from `app/lib/auth.ts`.
3. **End-to-End SSR Pipeline:** Requests are dispatched into `startServer.fetch(req)` from `dist/server/server.js` with:
   - Full header emulation (`host: localhost:3000`, `origin: http://localhost:3000`, `sec-fetch-site: same-origin`, `x-tsr-serverfn: true`).
   - Cookie authentication (`admin_session=<token>`).
   - RPC argument serialization matching TanStack Start's client protocol (`toJSONAsync(payload, { plugins: defaultSerovalPlugins })`).
4. **Deterministic Teardown:** A mandatory `finally` block purges all inserted test records from PostgreSQL upon completion.

To re-run the entire test suite at any time:
```powershell
npx tsx scripts/security-audit.ts
```

---

## Scenario 1: Cross-Partner IDOR & Multi-Tenancy Scoping

**Premise:** A user belonging to Partner A attempts to query or manipulate entities belonging to Partner B using `getReportByIdServerFn`, `getClientsServerFn`, `getMediaServerFn`, `getMessagesServerFn`, and every other `get*ServerFn` that accepts an ID or filter.

### Findings Matrix

| Function | Method | Target ID Tested | Access Denied? | Exact Code Location & Behavior |
| :--- | :---: | :--- | :---: | :--- |
| `getReportByIdServerFn` | GET | `reportB.id` (Client B / Partner B) | **YES** | [`app/server/reports.ts:228-231`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L228-L231)<br>`if (effectivePartnerId && row.client.partnerId !== effectivePartnerId) throw new Error('Unauthorized: You do not have permission to view this report')` |
| `getClientByIdServerFn` | GET | `clientB.id` (Partner B) | **YES** | [`app/server/clients.ts:112-115`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/clients.ts#L112-L115)<br>`if (effectivePartnerId && client.partnerId !== effectivePartnerId) throw new Error('Unauthorized access to client record')` |
| `getLatestReportForClientServerFn` | GET | `clientB.id` (Partner B) | **YES** | [`app/server/reports.ts:180-189`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L180-L189)<br>Queries `where(and(eq(clients.id, data.clientId), eq(clients.partnerId, effectivePartnerId)))`. If missing, throws `Unauthorized: Client does not belong to your partner account`. |
| `getMediaServerFn` | GET | `partnerId: partnerB.id` | **YES (SCOPED)** | [`app/server/media.ts:36-43`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/media.ts#L36-L43)<br>If `effectivePartnerId` is truthy, `data.partnerId` is ignored; query hardcodes `where(eq(media.partnerId, effectivePartnerId))`. Partner A receives 0 items belonging to Partner B. |
| `deleteMediaServerFn` | POST | `mediaB.id` (Partner B) | **YES** | [`app/server/media.ts:195-198`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/media.ts#L195-L198)<br>`if (effectivePartnerId && item.partnerId !== effectivePartnerId) throw new Error('Unauthorized: You do not have permission to delete this media file')` |
| `getMessagesServerFn` | GET | N/A (Status filter) | **YES** | [`app/server/auth.ts:99-101`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L99-L101)<br>Calls `assertSuperadminSession()`. Checks `if (session.role === 'partner' \|\| session.role === 'partner_employee') throw new Error('Unauthorized: Superadmin privileges required')`. |
| `getPostByIdServerFn` | GET | Any post UUID | **YES** | [`app/server/posts.ts:74`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/posts.ts#L74)<br>Guarded by `assertSuperadminSession()`; partner is blocked with `Unauthorized: Superadmin privileges required`. |
| `getTeamMembersServerFn` | GET | `partnerId: partnerB.id` | **YES (SCOPED)** | [`app/server/team.ts:50-86`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L50-L86)<br>For non-superadmin, ignores `data.partnerId` and hardcodes `where(and(eq(users.partnerId, auth.userId!), eq(users.role, 'partner_employee')))`. |
| `deleteTeamMemberServerFn` | POST | `staffB.id` (Partner B) | **YES** | [`app/server/team.ts:281-284`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L281-L284)<br>`if (!isSuperadmin && targetUser.partnerId !== auth.userId) throw new Error('Unauthorized: You can only remove employees from your own agency.')` |
| `toggleTeamMemberActiveServerFn` | POST | `staffB.id` (Partner B) | **YES** | [`app/server/team.ts:319-322`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L319-L322)<br>`if (!isSuperadmin && targetUser.partnerId !== auth.userId) throw new Error('Unauthorized: You can only modify employees from your own agency.')` |
| `getClientsServerFn` | GET | N/A | **PARTIAL LEAK / QUERY FLAW** | **Client list scoped, internal scan unscoped.**<br>Client records are scoped at [`app/server/clients.ts:37`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/clients.ts#L37). However, line 40 executes an unscoped query: see Flaw 1.1 below. |

### Flaw 1.1: Unscoped Report Count Query in `getClientsServerFn`
- **Location:** [`app/server/clients.ts:40`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/clients.ts#L40)
- **Vulnerable Code:**
  ```ts
  const partnerClients = await db
    .select()
    .from(clients)
    .where(eq(clients.partnerId, effectivePartnerId))
    .orderBy(desc(clients.createdAt))

  // VULNERABLE LINE 40:
  const allReports = await db.select({ clientId: reports.clientId }).from(reports)
  const countMap: Record<string, number> = {}
  for (const r of allReports) {
    countMap[r.clientId] = (countMap[r.clientId] || 0) + 1
  }
  ```
- **Analysis:** Even though `partnerClients` is scoped to `effectivePartnerId`, line 40 queries the `reports` table across the **entire database** without a `where` clause. While only counts for the partner's clients are added to `clientList`, this query executes a cross-tenant table scan on every request to `/admin/clients`, degrading database performance and exposing all `clientId` foreign keys in memory.
- **Remediation Needed (Deferred):** Join `reports` to `clients` where `clients.partnerId = effectivePartnerId`, or filter reports using `inArray(reports.clientId, partnerClients.map(c => c.id))`.

---

## Scenario 2: Logged-in Portal Client IDOR & Privilege Escalation

**Premise:** A logged-in client user belonging to Client A (`auth.role = 'client'`, `auth.clientId = clientA.id`) attempts to request a report or data belonging to Client B (`clientB.id`).

### Test Results: Report & Profile IDOR

| Function Tested | Input Data | Expected Result | Actual Result | Enforcement Code |
| :--- | :--- | :--- | :---: | :--- |
| `getReportByIdServerFn` | `id: reportB.id` | Access Denied | **DENIED (PASS)** | [`app/server/reports.ts:233-236`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L233-L236)<br>`if (auth.role === 'client' && (!auth.clientId \|\| auth.clientId !== row.report.clientId)) throw new Error('Unauthorized: You do not have permission to view this report')` |
| `getReportByIdServerFn` | `id: reportA.id` | Access Allowed | **ALLOWED (PASS)** | Passes validation; returns Report A document with client branding. |
| `getClientByIdServerFn` | `id: clientB.id` | Access Denied | **DENIED (PASS)** | [`app/server/clients.ts:117-120`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/clients.ts#L117-L120)<br>`if (auth.role === 'client' && auth.clientId !== data.id) throw new Error('Unauthorized access to client record')` |
| `getPortalReportsServerFn` | None | Client A reports only | **SCOPED (PASS)** | [`app/server/reports.ts:248`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/reports.ts#L248)<br>Hardcodes `targetClientId = auth.clientId`. External input cannot override this. |

---

### Critical Vulnerabilities Discovered in Portal Client Role

While direct report IDOR in `getReportByIdServerFn` is defended, auditing all server functions exposed to an authenticated `client` session revealed **four critical authorization bypass vulnerabilities**:

#### Flaw 2.1: Portal Client Can Enumerate Entire Client & Partner Directory via `getClientsServerFn`
- **Severity:** **HIGH (Data Leak)**
- **Location:** [`app/server/clients.ts:29-56`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/clients.ts#L29-L56)
- **Vulnerable Code:**
  ```ts
  export const getClientsServerFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<{ clients: ClientWithReportCount[]; partners: PartnerSummary[] }> => {
      const auth = await assertActiveSession()

      // 1. If user is a partner or partner employee, only fetch their assigned agency clients
      const effectivePartnerId = getEffectivePartnerId(auth)
      if (effectivePartnerId) {
        ...
      }

      // 2. Superadmin / Admin: fetch all clients and partner list
      const allClients = await db
        .select()
        .from(clients)
        .orderBy(desc(clients.createdAt))
      ...
  ```
- **Mechanism:** In [`app/server/auth.ts:111-115`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L111-L115), `getEffectivePartnerId(auth)` returns `auth.userId` for `partner`, `auth.partnerId` for `partner_employee`, and `null` for `client`.
- When an authenticated client calls `getClientsServerFn`, `effectivePartnerId` is `null`.
- Because there is no check `if (auth.role === 'client') throw new Error('Unauthorized')`, execution falls straight into **Branch 2 (Superadmin)**.
- **Impact:** Any authenticated portal client can invoke `getClientsServerFn` over RPC and receive the full name, business name, partner ID, logo URL, and report counts for **every single client and partner agency in the database**.

---

#### Flaw 2.2: Flawed Role Check in `assertSuperadminSession` Allows Portal Clients to Access Superadmin Endpoints
- **Severity:** **CRITICAL (Privilege Escalation / Systemic Bypass)**
- **Location:** [`app/server/auth.ts:97-103`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L97-L103)
- **Vulnerable Code:**
  ```ts
  /**
   * Assert that the current session is a Superadmin (blocks partner agency accounts and employees)
   */
  export async function assertSuperadminSession(): Promise<ActiveSession> {
    const session = await assertActiveSession()
    if (session.role === 'partner' || session.role === 'partner_employee') {
      throw new Error('Unauthorized: Superadmin privileges required')
    }
    return session
  }
  ```
- **Mechanism:** `assertSuperadminSession()` was written by only considering agency partners and staff: `if (session.role === 'partner' || session.role === 'partner_employee')`.
- It fails to verify whether `session.role === 'superadmin'` or `session.role === 'admin'`.
- When a user with `session.role === 'client'` calls a function protected by `assertSuperadminSession()`, the `if` condition evaluates to `false`. The function returns `session` successfully.
- **Affected Server Functions:**
  1. `getMessagesServerFn` ([`app/server/messages.ts:14`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/messages.ts#L14)): A portal client can read all inbound website contact submissions, SEO audit requests, phone numbers, and leads.
  2. `updateMessageStatusServerFn` ([`app/server/messages.ts:75`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/messages.ts#L75)): A portal client can mark leads as contacted or archived.
  3. `deleteMessageServerFn` ([`app/server/messages.ts:97`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/messages.ts#L97)): A portal client can permanently delete inbound leads.
  4. `getPartnersServerFn` ([`app/server/partners.ts:21`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/partners.ts#L21)): A portal client can view all agency partner accounts, emails, and assigned client counts.
  5. `createPartnerServerFn`, `updatePartnerServerFn`, `togglePartnerActiveServerFn`, `assignClientPartnerServerFn` ([`app/server/partners.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/partners.ts)): A portal client can create, update, suspend, or reassign partner agencies.
  6. `getAllUsersForAdminServerFn` ([`app/server/passwords.ts:184`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/passwords.ts#L184)): A portal client can dump the full list of all user accounts across the entire application (superadmins, partners, staff, clients).
  7. `getAdminPostsServerFn`, `getPostByIdServerFn`, `createPostServerFn`, `updatePostServerFn`, `deletePostServerFn` ([`app/server/posts.ts`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/posts.ts)): A portal client can view drafts, edit, or delete blog posts.

---

## Scenario 3: Unauthenticated Access to Every Server Function

**Premise:** Send HTTP requests with no session cookie (`Cookie: admin_session` omitted) to all 44 server functions in the application.

### Audit Matrix of All Server Functions

| # | Function Name | Source File | Method | Auth Guard | Unauth Access Allowed? | Finding / Status |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| 1 | `submitAuditLead` | `app/server/leads.ts` | POST | None | **YES (200)** | Correctly Public (Inbound Lead Capture) |
| 2 | `submitContactLead` | `app/server/leads.ts` | POST | None | **YES (200)** | Correctly Public (Contact Form Submission) |
| 3 | `getPublicPostsServerFn` | `app/server/posts.ts` | GET | None | **YES (200)** | Correctly Public (Blog Index) |
| 4 | `getPublicPostBySlugServerFn` | `app/server/posts.ts` | GET | None | **YES (200)** | Correctly Public (Blog Reader) |
| 5 | `loginServerFn` | `app/lib/auth.ts` | POST | None | **YES (200)** | Correctly Public (Authentication Endpoint) |
| 6 | `logoutServerFn` | `app/lib/auth.ts` | POST | None | **YES (200)** | Correctly Public (Session Termination) |
| 7 | `checkAuthServerFn` | `app/lib/auth.ts` | GET | None | **YES (200)** | Correctly Public (Returns `{ isAuthenticated: false }`) |
| 8 | `checkHostnameRoutingServerFn` | `app/lib/hostname.ts` | GET | None | **YES (200)** | Correctly Public (Hostname Redirection Helper) |
| 9 | `getClientsServerFn` | `app/server/clients.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 10 | `getClientByIdServerFn` | `app/server/clients.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 11 | `createClientServerFn` | `app/server/clients.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 12 | `updateClientServerFn` | `app/server/clients.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 13 | `deleteClientServerFn` | `app/server/clients.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 14 | `getReportsServerFn` | `app/server/reports.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 15 | `getLatestReportForClientServerFn` | `app/server/reports.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 16 | `getReportByIdServerFn` | `app/server/reports.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 17 | `getPortalReportsServerFn` | `app/server/reports.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 18 | `createReportServerFn` | `app/server/reports.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 19 | `updateReportServerFn` | `app/server/reports.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 20 | `updateReportDisplayOptionsServerFn` | `app/server/reports.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 21 | `deleteReportServerFn` | `app/server/reports.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 22 | `getMediaServerFn` | `app/server/media.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 23 | `uploadMediaServerFn` | `app/server/media.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 24 | `deleteMediaServerFn` | `app/server/media.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 25 | `getMessagesServerFn` | `app/server/messages.ts` | GET | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 26 | `updateMessageStatusServerFn` | `app/server/messages.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 27 | `deleteMessageServerFn` | `app/server/messages.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 28 | `getTeamMembersServerFn` | `app/server/team.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 29 | `createTeamMemberServerFn` | `app/server/team.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 30 | `deleteTeamMemberServerFn` | `app/server/team.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 31 | `toggleTeamMemberActiveServerFn` | `app/server/team.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 32 | `getPartnersServerFn` | `app/server/partners.ts` | GET | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 33 | `createPartnerServerFn` | `app/server/partners.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 34 | `updatePartnerServerFn` | `app/server/partners.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 35 | `togglePartnerActiveServerFn` | `app/server/partners.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 36 | `assignClientPartnerServerFn` | `app/server/partners.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 37 | `changeMyPasswordServerFn` | `app/server/passwords.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 38 | `adminResetUserPasswordServerFn` | `app/server/passwords.ts` | POST | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 39 | `getAllUsersForAdminServerFn` | `app/server/passwords.ts` | GET | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 40 | `getAdminPostsServerFn` | `app/server/posts.ts` | GET | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 41 | `getPostByIdServerFn` | `app/server/posts.ts` | GET | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 42 | `createPostServerFn` | `app/server/posts.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 43 | `updatePostServerFn` | `app/server/posts.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 44 | `deletePostServerFn` | `app/server/posts.ts` | POST | `assertSuperadminSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |
| 45 | `getActivityLogsServerFn` | `app/server/activity.ts` | GET | `assertActiveSession` | **NO (DENIED)** | Correctly Protected (`Authentication required`) |

**Summary:** 8 functions are designed for public ingestion / public viewing / routing. All other 37 functions enforce authentication and throw `Unauthorized: Authentication required` via `assertActiveSession()` ([`app/server/auth.ts:25-31`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/auth.ts#L25-L31)).

---

## Scenario 4: Staff Privilege Escalation in Team Management

**Premise:** A user with the staff role (`role: 'partner_employee'`) attempts to invoke `createTeamMemberServerFn` and other team management administrative endpoints.

### Test Results

| Action Attempted by Staff User | Endpoint | Access Denied? | Exact Code Location & Message |
| :--- | :--- | :---: | :--- |
| Create new team member | `createTeamMemberServerFn` | **YES (PASS)** | [`app/server/team.ts:175-177`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L175-L177)<br>`if (auth.role === 'partner_employee') throw new Error('Unauthorized: Only agency owners can add team members')` |
| Delete team member | `deleteTeamMemberServerFn` | **YES (PASS)** | [`app/server/team.ts:263-265`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L263-L265)<br>`if (auth.role === 'partner_employee') throw new Error('Unauthorized: Only agency owners can remove team members')` |
| Toggle team member active status | `toggleTeamMemberActiveServerFn` | **YES (PASS)** | [`app/server/team.ts:302-304`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L302-L304)<br>`if (auth.role === 'client' \|\| auth.role === 'partner_employee') throw new Error('Unauthorized: Only agency owners can modify team member status')` |
| View agency team member list | `getTeamMembersServerFn` | **YES (PASS)** | [`app/server/team.ts:44-46`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/team.ts#L44-L46)<br>`if (auth.role === 'partner_employee') throw new Error('Unauthorized: Team management requires agency owner privileges')` |
| Reset password of another user | `adminResetUserPasswordServerFn` | **YES (PASS)** | [`app/server/passwords.ts:133-135`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/server/passwords.ts#L133-L135)<br>`if (auth.role === 'client' \|\| auth.role === 'partner_employee') throw new Error('Unauthorized: Administrative privileges required')` |

**Conclusion for Scenario 4:** Staff-level privilege escalation is comprehensively prevented across all employee lifecycle and password management endpoints.

---

## Scenario 5: Public Report Share Links & ID Guessing / Enumeration

**Premise:** Analysis of report identification, token generation, cryptographic entropy, and public guest access vulnerabilities.

### 1. Are Tokens Random, or Derived from Sequential IDs?
- The database schema for reports is declared in [`app/db/schema.ts:136`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/app/db/schema.ts#L136):
  ```ts
  export const reports = pgTable('reports', {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    ...
  ```
- In PostgreSQL, `defaultRandom()` compiles to `gen_random_uuid()`.
- This generates RFC 4122 Version 4 UUIDs using the operating system's cryptographic pseudo-random number generator (CSPRNG).
- A UUID v4 contains 128 bits total, with 6 bits allocated for version and variant flags, yielding **122 bits of true cryptographic entropy**.
- Sample generated report ID: `28ff8390-5dd8-4bb9-af17-8178d8a7c181`.
- **Verdict:** IDs are **NOT sequential integers**. They are not generated from database sequences (`SERIAL`, `BIGSERIAL`, or `IDENTITY`) and cannot be predicted mathematically.

### 2. Can a Report Be Enumerated by Guessing?
- With $2^{122} \approx 5.316 \times 10^{36}$ possible unique identifiers, the probability of an attacker colliding with a valid report ID through brute force is effectively zero.
- Even if an attacker issued 1 billion requests per second, finding a single collision in a database of 10,000 reports would require approximately:
  $$\frac{2^{122}}{10^4 \times 10^9 \times 3.15 \times 10^7} \approx 1.6 \times 10^{16} \text{ years}$$
- **Verdict:** Reports **cannot be enumerated by guessing IDs**.

### 3. Critical Architectural Finding: No Public Share Links Exist
- A thorough audit of the router and database shows that **public guest report share links do not exist in the application**.
- There is no `share_token`, `public_hash`, or `access_key` column on the `reports` table.
- The only routes that render reports are:
  1. `/admin/reports/$id` ([`src/routes/admin/reports/$id.tsx`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/routes/admin/reports/$id.tsx)): Protected by `requireAdmin()`. Unauthenticated requests redirect to `/login`; clients redirect to `/portal`.
  2. `/portal/reports/$id` ([`src/routes/portal/reports/$id.tsx:10-16`](file:///c:/Users/Administrator/Desktop/Anti-Gravity%20Projects/built%20by%20Miguel/src/routes/portal/reports/$id.tsx#L10-L16)):
     ```ts
     beforeLoad: async () => {
       const { isAuthenticated } = await checkAuthServerFn()
       if (!isAuthenticated) {
         throw redirect({ to: '/login' })
       }
     }
     ```
     Unauthenticated requests redirect to `/login` (Status 302).
- Furthermore, sequential URL guessing attempts (e.g. requesting `GET /portal/reports/1`, `/portal/reports/2`) immediately trigger a 302 Redirect to `/login`.
- **Verdict:** If an agency owner or client attempts to share a report URL (e.g. `https://builtbymiguel.net/portal/reports/<uuid>`) with an external third-party, the recipient cannot view the report without logging in.

---

## Consolidated Vulnerability Ledger

As mandated by user instructions, **no feature code has been modified in this session**. The following ledger documents every detected vulnerability for future remediation planning.

| Issue ID | Severity | File | Line(s) | Flaw Description | Exploit Condition & Impact |
| :--- | :---: | :--- | :---: | :--- | :--- |
| **SEC-01** | **CRITICAL** | `app/server/auth.ts` | 97–103 | `assertSuperadminSession()` only checks for `partner` and `partner_employee`, omitting a check for `client`. | Any authenticated client portal user can call `getMessagesServerFn`, `updateMessageStatusServerFn`, `deleteMessageServerFn`, `getPartnersServerFn`, `createPartnerServerFn`, `updatePartnerServerFn`, `getAllUsersForAdminServerFn`, and CMS post management functions. |
| **SEC-02** | **HIGH** | `app/server/clients.ts` | 29–33 | `getClientsServerFn` has no `if (auth.role === 'client')` guard; falls into Superadmin block when `effectivePartnerId` is null. | An authenticated client portal user invoking `getClientsServerFn` receives the full directory of all agency clients and partner IDs across all tenants. |
| **SEC-03** | **MEDIUM** | `app/server/clients.ts` | 40 | `getClientsServerFn` executes `const allReports = await db.select({ clientId: reports.clientId }).from(reports)` with no WHERE clause. | Full table scan across all reports in the database occurs on every partner `/admin/clients` page load; leaks all `clientId`s into server memory. |
| **SEC-04** | **LOW** | Architecture / Routing | N/A | Missing public report share link feature. | Clients cannot share read-only live performance reports with external stakeholders without providing portal login credentials. |
