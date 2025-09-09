# Use official Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Install build tools for native modules
RUN apt-get update && \
    apt-get install -y python3 g++ make && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy project files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Use non-root user for security
RUN useradd -m appuser
USER appuser

# Start app
CMD ["npm", "run", "start:prod"]
