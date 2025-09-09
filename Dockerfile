# Use a lightweight official Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for faster builds
COPY package*.json ./

# Install dependencies (only what’s needed)
RUN npm install --production

# Copy the rest of the application, excluding files in .dockerignore
COPY . .

# Build application if needed (uncomment if you have a build step)
# RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose your application port
EXPOSE 3000

# Start the app with PM2
CMD ["pm2-runtime", "start", "npm", "--name", "pesayangu-app", "--", "run", "start:prod"]
