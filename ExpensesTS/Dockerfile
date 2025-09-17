# Stage 1: Build the app
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Increase Node memory during build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build frontend & backend
RUN npm run build

# Stage 2: Serve static frontend
FROM node:20-slim
WORKDIR /app

# Install "serve" to serve static files
RUN npm install -g serve

# Copy built frontend from build stage
COPY --from=build /app/dist ./dist

# Expose port 8080 and serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
