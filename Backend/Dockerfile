# Base stage 
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install -g pm2
RUN npm install --legacy-peer-deps && npm cache clean --force
COPY . .

# Development stage
FROM base AS dev
EXPOSE 8080
CMD ["npm", "run", "start:dev"]

# Production build stage
FROM base AS prod
RUN npm run build
EXPOSE 8080
CMD ["pm2-runtime", "dist/main.js"]