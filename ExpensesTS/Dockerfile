# Stage 1: Build React app
FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Build React app (ignoring TS errors)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
