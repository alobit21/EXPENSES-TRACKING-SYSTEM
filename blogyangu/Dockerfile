FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest
COPY . .

EXPOSE 3000

# Run migrations before starting Next.js
CMD npx prisma migrate deploy && npm run build && npm run start
