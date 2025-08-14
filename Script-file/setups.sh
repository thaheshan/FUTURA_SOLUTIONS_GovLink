#!/bin/bash

# Initialize environment variables
cp .env.example .env

# Create required directories
mkdir -p \
  database/mongodb/data \
  database/redis/data \
  logs/{backend,frontend,nginx,mongodb,redis} \
  uploads \
  docker/nginx/ssl

# Set permissions
chmod -R 777 logs
chmod -R 777 uploads

# Generate self-signed SSL certificate (for development)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out docker/nginx/ssl/localhost.crt \
  -keyout docker/nginx/ssl/localhost.key \
  -days 365 \
  -subj "/C=LK/ST=Western/CN=localhost"

# Build and start containers
docker-compose up -d --build

# Initialize MongoDB
docker exec sri_gov_mongodb mongosh \
  -u $MONGO_USERNAME \
  -p $MONGO_PASSWORD \
  --eval "rs.initiate()"

echo "Setup completed successfully!"
echo "Access the application at http://localhost"