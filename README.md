# Performance Marketing & Client Portal Platform

A full-stack SSR application built with **TanStack Start**, **React 19**, **PostgreSQL**, **Drizzle ORM**, and **Tailwind CSS v4**. Features multi-tenant partner isolation, client portals, real-time metrics dashboards, immutable report snapshot generation, and audit logging.

---

## 🚀 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack SSR on [Nitro](https://nitro.unjs.io/) / Vite)
- **Frontend / Routing**: [TanStack Router](https://tanstack.com/router) (Strictly typed file-based routing)
- **Runtime**: **Node.js 22 LTS**
- **Database**: **PostgreSQL** with [Drizzle ORM](https://orm.drizzle.team/)
- **Migrations**: `scripts/migrate.mjs` (Automatic boot migration runner)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Lucide React icons
- **Deployment**: Docker (`node:22-alpine`), container port **3000**, orchestrated via Dokploy

---

## 🔐 Tenancy & Authentication

The platform supports 4 distinct user tiers:
1. **Superadmin**: Full unrestricted platform control, cross-partner management, user password resets, global audits.
2. **Partner**: Agency owner managing their own assigned clients and team members.
3. **Partner Employee**: Staff account scoped to a partner's assigned clients; cannot manage agency credentials or owners.
4. **Client**: Authenticated client portal user scoped exclusively to their own organization's reports and profile.

All client-scoped queries enforce partner isolation via `getEffectivePartnerId()`. Role checks strictly use allowlist assertions (`assertActiveSession`, `assertSuperadminSession`).

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js 22+
- PostgreSQL database

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ADMIN_PASSWORD=your_superadmin_password
SESSION_SECRET=your_32_byte_session_encryption_secret
```

### 3. Install Dependencies & Run Migrations
```bash
npm install
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 5. Run Verification & Test Suite
```bash
npm run test:simulate
```

---

## 🚢 Docker & Production Deployment (Dokploy)

The application packages into a multi-stage Docker container running Node.js 22:
- Builds client and server bundles (`npm run build`).
- Bundles migration scripts and starts `node server.mjs`.
- Automatically applies pending database migrations on container boot prior to binding HTTP listeners.

### Dokploy Configuration
1. **Create Application** in your Dokploy project.
2. Select **GitHub** provider and point to your repository (`main` branch).
3. Set **Build Type** to **Dockerfile**.
4. Set **Container Port** to **`3000`** (do **not** use port 80).
5. Add Environment Variables:
   - `PORT`: `3000`
   - `DATABASE_URL`: `postgresql://...`
   - `ADMIN_PASSWORD`: `<secure-password>`
   - `SESSION_SECRET`: `<secure-random-key>`
6. Enable automatic SSL under your Domain settings.
7. Deploy!

---

## 📁 Project Structure

```
├── app/                       # Canonical backend tree
│   ├── db/                    # Drizzle connection & schema definitions
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib/                   # Server-side auth, crypto, and session utilities
│   │   ├── auth.ts
│   │   └── hostname.ts
│   ├── server/                # TanStack Start RPC server functions (createServerFn)
│   │   ├── activity-logger.ts
│   │   ├── activity.ts
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── partners.ts
│   │   ├── passwords.ts
│   │   ├── reports.ts
│   │   └── team.ts
│   └── router.tsx             # Root TanStack router instantiation
├── src/                       # Canonical frontend tree
│   ├── components/            # React UI components (ReportDocument, Sidebar, etc.)
│   ├── lib/                   # Client-side utilities & tsconfig shims
│   ├── routes/                # File-based routes (/admin, /portal, /login, etc.)
│   └── server/                # Re-export shims for tsconfig.app.json resolution
├── scripts/
│   ├── migrate.mjs            # Production migration script (runs on container boot)
│   ├── simulate.ts            # Simulation and access-control integration tests
│   └── security-audit.ts      # Automated security regression test suite
├── Dockerfile                 # Production multi-stage Dockerfile (Node 22, Port 3000)
├── server.mjs                 # Production server boot entry (runs migrations, starts SSR)
├── AGENTS.md                  # Comprehensive AI & architectural documentation
└── package.json
```
