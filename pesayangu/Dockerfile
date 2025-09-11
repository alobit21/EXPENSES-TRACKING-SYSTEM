# Stage 1: Build NestJS backend
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Install Nest CLI globally (needed for build)
RUN npm install -g @nestjs/cli

COPY . .
RUN npm run build

# Stage 2: Run production
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/main.js"]
