# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Default command (can be overridden in docker-compose)
CMD ["node", "src/server.js"]
