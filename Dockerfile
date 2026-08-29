# Stage 1: Build the React Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code and configuration files
COPY . .

# Build static assets (runs TypeScript checks and Vite build)
RUN npm run build

# Stage 2: Serve with lightweight NGINX Alpine
FROM nginx:alpine AS runner

# Remove default nginx configs and add custom SPA-ready config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled distribution files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard container port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
