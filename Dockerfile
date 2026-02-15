# Las 5 del día - Docker multi-stage
# Build estático (output: export) → sirve carpeta out/ con serve
# Build: docker build -t las5deldia .
# Run:   docker run -p 3000:3000 --env-file .env.production las5deldia

# --- Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_WP_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WP_API_URL=$NEXT_PUBLIC_WP_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

# --- Stage 3: Runner (sitio estático)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    npm install -g serve@14
COPY --from=builder --chown=nextjs:nodejs /app/out ./out
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["serve", "out", "-p", "3000"]
