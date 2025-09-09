# Use full Node.js image to avoid crypto issues
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy project files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Run production
CMD ["npm", "run", "start:prod"]
