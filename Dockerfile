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
COPY wait-for-postgres.sh /usr/src/app/
RUN chmod +x /usr/src/app/wait-for-postgres.sh

EXPOSE 3000

CMD ["/usr/src/app/wait-for-postgres.sh", "postgres", "npm", "run", "start:prod"]


 
