#!/bin/bash

# Database backup script for production

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Load environment variables
if [ -f ".env.production" ]; then
    set -a
    source .env.production
    set +a
fi

DB_NAME=${POSTGRES_DB:-rtdwms}
DB_USER=${POSTGRES_USER:-postgres}
DB_PASSWORD=${POSTGRES_PASSWORD:-postgres}
CONTAINER_NAME=${CONTAINER_NAME:-rtdwms_db_prod}

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/rtdwms_backup_${TIMESTAMP}.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}Creating database backup...${NC}"

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Database container ${CONTAINER_NAME} is not running${NC}"
    exit 1
fi

# Create backup
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
    pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE}${NC}"

# Keep only last 7 backups
echo -e "${YELLOW}Cleaning old backups (keeping last 7)...${NC}"
cd "$BACKUP_DIR"
ls -t rtdwms_backup_*.sql.gz | tail -n +8 | xargs rm -f 2>/dev/null || true

echo -e "${GREEN}✓ Backup complete${NC}"
