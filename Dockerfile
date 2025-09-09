# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project
COPY . .

# Copy wait-for-postgres script
COPY wait-for-postgres.sh /usr/src/app/wait-for-postgres.sh
RUN chmod +x /usr/src/app/wait-for-postgres.sh

# Expose application port
EXPOSE 3000

# Start the app after Postgres is ready
CMD ["/usr/src/app/wait-for-postgres.sh", "postgres", "npm", "run", "start:prod"]
