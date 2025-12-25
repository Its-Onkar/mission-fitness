#!/bin/bash

# Mission Fitness Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="mission-fitness"
DOCKER_IMAGE="$PROJECT_NAME:latest"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo "❌ Invalid environment. Use: development, staging, or production"
    exit 1
fi

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed."; exit 1; }

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo "📋 Loading environment variables from .env.$ENVIRONMENT"
    export $(cat .env.$ENVIRONMENT | xargs)
elif [ -f ".env" ]; then
    echo "📋 Loading environment variables from .env"
    export $(cat .env | xargs)
else
    echo "❌ No environment file found"
    exit 1
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if MongoDB is accessible
if ! docker-compose exec mongo mongosh --eval "db.runCommand({ping: 1})" >/dev/null 2>&1; then
    echo "⚠️  MongoDB is not accessible, starting services..."
    docker-compose up -d mongo
    sleep 10
fi

# Run tests
echo "🧪 Running tests..."
npm run test:ci || {
    echo "❌ Tests failed. Deployment aborted."
    exit 1
}

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level moderate || {
    echo "❌ Security vulnerabilities found. Please fix them before deployment."
    exit 1
}

# Build Docker image
echo "🏗️  Building Docker image..."
docker build -t $DOCKER_IMAGE . || {
    echo "❌ Docker build failed"
    exit 1
}

# Backup database (production only)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "💾 Creating database backup..."
    BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).gz"
    docker-compose exec mongo mongodump --archive=/tmp/$BACKUP_FILE --gzip
    docker cp $(docker-compose ps -q mongo):/tmp/$BACKUP_FILE ./backups/
    echo "✅ Database backup created: ./backups/$BACKUP_FILE"
fi

# Deploy with zero downtime
echo "🚀 Deploying application..."

if [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment with rolling update
    docker-compose up -d --no-deps app
    
    # Health check
    echo "🏥 Performing health check..."
    sleep 10
    
    for i in {1..30}; do
        if curl -f http://localhost:${PORT:-5000}/health >/dev/null 2>&1; then
            echo "✅ Health check passed"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "❌ Health check failed after 30 attempts"
            echo "🔄 Rolling back..."
            docker-compose down
            exit 1
        fi
        
        echo "⏳ Waiting for application to start... ($i/30)"
        sleep 2
    done
else
    # Development/staging deployment
    docker-compose up -d
fi

# Post-deployment tasks
echo "🔧 Running post-deployment tasks..."

# Database migrations (if any)
if [ -f "scripts/migrate.js" ]; then
    echo "📊 Running database migrations..."
    docker-compose exec app node scripts/migrate.js
fi

# Clear cache (if Redis is used)
if docker-compose ps redis >/dev/null 2>&1; then
    echo "🧹 Clearing cache..."
    docker-compose exec redis redis-cli FLUSHALL
fi

# Cleanup old Docker images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost:${PORT:-5000}"
echo "🏥 Health check: http://localhost:${PORT:-5000}/health"

# Send notification (if configured)
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Mission Fitness deployed successfully to $ENVIRONMENT\"}" \
        $SLACK_WEBHOOK_URL
fi

echo "📊 Deployment summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Image: $DOCKER_IMAGE"
echo "  Timestamp: $(date)"
echo "  Version: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"