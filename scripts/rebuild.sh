#!/bin/bash
set -e

APP_DIR="/home/ubuntu/EXPENSES-TRACKING-SYSTEM"

cd $APP_DIR

echo "Stopping old containers..."
docker compose down

echo "Rebuilding and starting containers..."
docker compose up --build -d

echo "Cleanup unused images..."
docker image prune -f

echo "Deployment complete!"
