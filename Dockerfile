# Use official Node.js image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./


# Install dependencies (including dev, so we can build)
RUN npm install

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy project files
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
