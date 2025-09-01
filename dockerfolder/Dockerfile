FROM node:latest

WORKDIR /usr/src/app

# Install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build app
RUN npm run build

# Remove dev dependencies to slim image
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/main"]
