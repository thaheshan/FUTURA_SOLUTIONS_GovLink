# backend/Dockerfile

# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Set environment variable for node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install dependencies
# If development, install devDependencies; else production only
RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install --include=dev; \
    else \
        npm install --only=production; \
    fi

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 3000

# Set default command based on environment
CMD if [ "$NODE_ENV" = "development" ]; then \
        npm run dev; \
    else \
        npm start; \
    fi
