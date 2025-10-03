# Base image
FROM node:18-alpine AS base

# Development stage
FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "run", "dev"]

# Builder stage - optimized for caching
FROM base AS builder
WORKDIR /app

# 1. Copy only package files first for better layer caching
COPY package.json package-lock.json ./

# 2. Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# 3. Copy the rest of the application
COPY . .

# 4. Build the application
RUN npm run build

# Production stage
FROM base AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set up production dependencies
RUN npm install --only=production --legacy-peer-deps

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]

