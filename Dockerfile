# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Create uploads directory
RUN mkdir -p src/public/uploads

# Set proper permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]