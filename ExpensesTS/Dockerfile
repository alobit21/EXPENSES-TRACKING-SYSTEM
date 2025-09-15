FROM node:20

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy only the prebuilt static files
COPY dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]



