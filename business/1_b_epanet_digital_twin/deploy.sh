#!/bin/bash

# Production Deployment Script for RTDWMS
# Deploys the application using Docker Compose

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}RTDWMS Production Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Use docker compose (v2) if available, otherwise docker-compose (v1)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Warning: .env.production not found.${NC}"
    echo -e "${YELLOW}Creating from env.production.example...${NC}"
    if [ -f "env.production.example" ]; then
        cp env.production.example .env.production
        echo -e "${YELLOW}Please edit .env.production with your actual values before continuing.${NC}"
        echo -e "${YELLOW}Press Enter to continue after editing, or Ctrl+C to cancel...${NC}"
        read
    else
        echo -e "${RED}Error: env.production.example not found.${NC}"
        exit 1
    fi
fi

# Load environment variables
set -a
source .env.production
set +a

# Check SSL certificates and generate self-signed if missing
SSL_CERT_PATH="./certbot/conf/live/${DOMAIN:-46.32.109.46}/fullchain.pem"
if [ ! -f "$SSL_CERT_PATH" ]; then
    echo -e "${YELLOW}SSL certificates not found at $SSL_CERT_PATH${NC}"
    echo -e "${YELLOW}Generating self-signed certificates for testing...${NC}"
    if [ -f "./scripts/generate-ssl.sh" ]; then
        chmod +x ./scripts/generate-ssl.sh
        ./scripts/generate-ssl.sh
    else
        echo -e "${RED}Error: generate-ssl.sh not found${NC}"
        echo -e "${YELLOW}Please create SSL certificates manually or run: ./scripts/generate-ssl.sh${NC}"
        exit 1
    fi
fi

# Create necessary directories
mkdir -p certbot/conf certbot/www nginx/conf.d

# Copy nginx config to conf.d if needed
if [ ! -f "nginx/conf.d/default.conf" ]; then
    cp nginx/nginx.conf nginx/conf.d/default.conf 2>/dev/null || true
fi

# Build and start services
echo -e "\n${BLUE}Building Docker images...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml build

echo -e "\n${BLUE}Starting services...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check service status
echo -e "\n${BLUE}Service Status:${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml ps

# Health check
echo -e "\n${BLUE}Performing health checks...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f -s http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend health check passed${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}Waiting for backend... (${RETRY_COUNT}/${MAX_RETRIES})${NC}"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo -e "${YELLOW}Check logs with: $COMPOSE_CMD -f docker-compose.prod.yml logs backend${NC}"
fi

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Application URL:${NC} https://${DOMAIN:-46.32.109.46}"
echo -e "${BLUE}API Docs:${NC} https://${DOMAIN:-46.32.109.46}/api/docs"
echo -e "\n${BLUE}Useful commands:${NC}"
echo -e "${YELLOW}View logs:${NC} $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo -e "${YELLOW}Stop services:${NC} $COMPOSE_CMD -f docker-compose.prod.yml down"
echo -e "${YELLOW}Restart service:${NC} $COMPOSE_CMD -f docker-compose.prod.yml restart <service>"
echo -e "${YELLOW}View status:${NC} $COMPOSE_CMD -f docker-compose.prod.yml ps"
echo ""

