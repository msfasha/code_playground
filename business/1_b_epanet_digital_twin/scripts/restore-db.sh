#!/bin/bash

# Database restore script for production

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

if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide backup file path${NC}"
    echo -e "${YELLOW}Usage: $0 <backup_file.sql.gz>${NC}"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${RED}WARNING: This will replace all data in the database!${NC}"
echo -e "${YELLOW}Backup file: ${BACKUP_FILE}${NC}"
echo -e "${YELLOW}Database: ${DB_NAME}${NC}"
echo -e "${YELLOW}Are you sure you want to continue? (yes/no)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Database container ${CONTAINER_NAME} is not running${NC}"
    exit 1
fi

echo -e "${YELLOW}Restoring database...${NC}"

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    TEMP_FILE=$(mktemp)
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    BACKUP_FILE="$TEMP_FILE"
fi

# Restore database
docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
    psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

# Cleanup temp file if created
if [ -n "$TEMP_FILE" ]; then
    rm -f "$TEMP_FILE"
fi

echo -e "${GREEN}✓ Database restored successfully${NC}"
