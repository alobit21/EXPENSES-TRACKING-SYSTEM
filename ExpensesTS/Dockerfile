# Stage 1: Build the frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the frontend
RUN npm run build:frontend

# Output: /app/dist contains the static site
