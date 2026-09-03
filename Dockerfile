# Stage 1: Build the TanStack Start Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code and configuration files
COPY . .

# Build application (runs TypeScript checks, sitemap generation, and Vite build)
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production Node.js 22 Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy dependency files and install production dependencies only
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled bundles, public static files, server entry, and migration scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.mjs ./server.mjs
COPY --from=builder /app/scripts ./scripts

# Expose container port
EXPOSE 3000

# Run database migrations on startup and start the TanStack Start SSR Server
CMD ["node", "server.mjs"]
