# Stage 1: Build React app
FROM node:18-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY ExpensesTS/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY ExpensesTS/. .

# Build React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy Nginx config from project root
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
