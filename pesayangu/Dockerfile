FROM node:20-alpine

WORKDIR /app

# Copy backend package.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy backend source code
COPY . .

# Build backend - use the correct script name
RUN npm run build  # This runs "nest build"

EXPOSE 3000

# Start backend in production mode
CMD ["npm", "run", "start:prod"]  # This runs "node dist/main"