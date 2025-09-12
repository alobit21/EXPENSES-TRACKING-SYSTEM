# Frontend build-only image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all frontend source code
COPY . .

# Build frontend assets (outputs to /app/dist)
RUN npm run build:frontend

EXPOSE 5173




# This image only contains the build output
# No ports exposed, no CMD — it's for producing artifacts
