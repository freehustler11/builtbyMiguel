# React + Vite + TanStack Router + TanStack Query + Tailwind CSS

A modern full-stack React starter with file-based routing, declarative server-state management, and utility-first styling, pre-configured for **GitHub** and **Dokploy** deployments.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Routing**: [TanStack Router](https://tanstack.com/router) (File-based with auto-generated route tree)
- **Data Fetching & State**: [TanStack Query](https://tanstack.com/query) (v5)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Deployment**: [Dokploy](https://dokploy.com/) / Docker (Multi-stage NGINX with SPA fallback)
- **CI/CD**: GitHub Actions

---

## 🛠️ Local Development

### 1. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. Build for Production
```bash
npm run build
```

### 3. Run with Docker Locally
```bash
docker compose up --build
```
Then visit `http://localhost:8080`.

---

## 🚢 Deploying with GitHub & Dokploy

### Step 1: Push Code to GitHub
1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: React + TanStack + Dokploy setup"
   ```
2. Create a new repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure in Dokploy
1. Log in to your **Dokploy Dashboard**.
2. Click **Create Project** (or open an existing project) $\rightarrow$ click **Create Application**.
3. Under **Provider**, select **GitHub**:
   - Choose your GitHub account / organization.
   - Select your repository.
   - Set **Branch** to `main`.
4. Under **Build Type**:
   - Select **Dockerfile** (uses the root `Dockerfile` and `nginx.conf`).
   *(Alternatively, selecting **Nixpacks** also works seamlessly)*.
5. Under **General / Network Settings**:
   - Set **Container Port** to `80`.
6. (Optional) Under **Domains**:
   - Add your custom domain (e.g. `app.example.com`) and enable automatic Let's Encrypt SSL.
7. Click **Deploy**!
8. Enable **Auto Deploy Webhook** so any subsequent `git push` to `main` automatically triggers a zero-downtime rebuild and redeployment.

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow
├── src/
│   ├── components/
│   │   └── Navbar.tsx         # Shared top navigation with active route highlights
│   ├── lib/
│   │   └── utils.ts           # Styling helper (cn)
│   ├── routes/
│   │   ├── __root.tsx         # Root layout route (<Navbar />, <Outlet />, devtools)
│   │   ├── index.tsx          # Home page route (/) with TanStack Query demo
│   │   └── about.tsx          # About page route (/about)
│   ├── routeTree.gen.ts       # Auto-generated route tree by TanStack Router
│   ├── index.css              # Tailwind CSS entry stylesheet
│   ├── main.tsx               # App entry, QueryClient & Router initialization
│   └── vite-env.d.ts          # Vite client types
├── Dockerfile                 # Multi-stage production container build
├── nginx.conf                 # NGINX configuration with SPA fallback routing
├── docker-compose.yml         # Local Docker compose configuration
├── .dockerignore              # Excludes node_modules, dist, etc. from Docker build context
├── index.html                 # HTML shell
├── vite.config.ts             # Vite configuration with TanStack & Tailwind plugins
├── tsconfig.json              # TypeScript root configuration
└── package.json               # Dependencies and scripts
```
