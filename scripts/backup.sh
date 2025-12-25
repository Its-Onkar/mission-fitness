#!/bin/bash

# Mission Fitness Database Backup Script
# Usage: ./scripts/backup.sh [environment]

set -e

ENVIRONMENT=${1:-production}
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="mission-fitness-$ENVIRONMENT-$DATE"

echo "💾 Starting database backup for $ENVIRONMENT environment..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat .env.$ENVIRONMENT | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | xargs)
fi

# Check if MongoDB is running
if ! docker-compose ps mongo | grep -q "Up"; then
    echo "❌ MongoDB container is not running"
    exit 1
fi

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"

# Full database backup
docker-compose exec -T mongo mongodump \
    --archive=/tmp/$BACKUP_FILE.gz \
    --gzip \
    --db mission-fitness

# Copy backup from container to host
docker cp $(docker-compose ps -q mongo):/tmp/$BACKUP_FILE.gz $BACKUP_DIR/

# Verify backup
if [ -f "$BACKUP_DIR/$BACKUP_FILE.gz" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)
    echo "✅ Backup created successfully: $BACKUP_FILE.gz ($BACKUP_SIZE)"
else
    echo "❌ Backup failed"
    exit 1
fi

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "mission-fitness-$ENVIRONMENT-*.gz" -mtime +7 -delete

# Upload to cloud storage (if configured)
if [ ! -z "$AWS_S3_BACKUP_BUCKET" ]; then
    echo "☁️  Uploading backup to S3..."
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE.gz" "s3://$AWS_S3_BACKUP_BUCKET/backups/"
fi

echo "✅ Backup process completed!"
echo "📁 Backup location: $BACKUP_DIR/$BACKUP_FILE.gz"