# Backend Dockerfile
FROM node:22-trixie-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
