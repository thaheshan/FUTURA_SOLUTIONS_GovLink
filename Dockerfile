# Stage 1: Build environment
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY user_backend/package.json user_backend/package-lock.json ./
RUN npm ci --silent

# Build application
COPY user_backend/ ./
COPY shared/ ../shared/
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY user_backend/package.json user_backend/package-lock.json ./
RUN npm ci --production --silent

# Copy built application
COPY --from=builder /app/dist ./dist
COPY shared/ ../shared/

# Create directory for uploads
RUN mkdir -p /app/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose port and start application
EXPOSE 8000
CMD ["node", "dist/server.js"]