# ─────────────────────────────────────────────────────────────────
# Maze Runner Game — Frontend Dockerfile (Multi-stage)
#
# Stages:
#   development → Vite dev server with hot reload (port 3000)
#   build       → Compiles TypeScript and builds production bundle
#   production  → Nginx serving static files (port 80)
# ─────────────────────────────────────────────────────────────────

# ─── Stage 1: Development ─────────────────────────────────────────
FROM node:22-alpine AS development

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Expose Vite default port
EXPOSE 3000

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ─── Stage 2: Build ───────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies (including devDependencies needed for build)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build for production (outputs to /dist)
RUN npm run build


# ─── Stage 3: Production ──────────────────────────────────────────
FROM nginx:alpine AS production

# Copy custom Nginx configuration
# (Assuming a simple nginx.conf exists or using default with fallback routing)
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add SPA routing fallback to Nginx config inline
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ { \
        expires 1y; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ─── Default target: production ───────────────────────────────────
FROM production
