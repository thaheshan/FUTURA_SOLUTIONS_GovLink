# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install build tools
RUN apk add --no-cache bash git python3 make g++ curl

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (local Expo CLI included)
RUN npm install --legacy-peer-deps
RUN npm install expo-cli@latest --global

# Copy source code
COPY . .

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Install build tools
RUN apk add --no-cache bash git python3 make g++ curl

# Copy app from builder
COPY --from=builder /app /app

# Expose Expo ports
EXPOSE 19000 19001 19002 19006

# Start app with npx
CMD ["npx", "expo", "start", "--tunnel"]
