#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Build and push Docker images
docker-compose build
docker push your-registry/sri-gov-backend:latest
docker push your-registry/sri-gov-frontend:latest

# Deploy to production swarm
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml sri-gov

# Perform database migrations
docker exec $(docker ps -q -f name=sri_gov_backend) npm run migrate

# Cleanup old containers
docker system prune -f

echo "Deployment completed successfully!"