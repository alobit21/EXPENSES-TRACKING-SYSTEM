# Use official Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build application (if you have build step)
RUN npm run build

# Expose port (matching your app)
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]
