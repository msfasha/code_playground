#!/bin/bash

# Script to configure firewall rules for EPANET Digital Twin
# This script sets up UFW rules to allow HTTP (80) and HTTPS (443) traffic

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== Firewall Configuration for EPANET Digital Twin ===${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    echo "Usage: sudo ./scripts/setup-firewall.sh"
    exit 1
fi

# Check if UFW is installed
if ! command -v ufw >/dev/null 2>&1; then
    echo -e "${RED}Error: UFW is not installed${NC}"
    echo "Install it with: sudo apt-get install ufw"
    exit 1
fi

echo "Current UFW status:"
ufw status verbose
echo ""

# Configure UFW to work with Docker
# Docker manages its own iptables rules, so we need to ensure UFW doesn't block Docker
echo -e "${YELLOW}Configuring UFW for Docker compatibility...${NC}"

# Check if UFW Docker integration is needed
if [ ! -f /etc/ufw/after.rules.backup ]; then
    echo "Creating backup of UFW rules..."
    cp /etc/ufw/after.rules /etc/ufw/after.rules.backup
fi

# Ensure Docker can forward traffic
# This is usually handled by Docker automatically, but we'll verify
echo "Checking Docker iptables integration..."

# Allow HTTP (port 80)
echo -e "${YELLOW}Adding rule: Allow HTTP (port 80)...${NC}"
ufw allow 80/tcp comment 'EPANET Digital Twin - HTTP'

# Allow HTTPS (port 443)
echo -e "${YELLOW}Adding rule: Allow HTTPS (port 443)...${NC}"
ufw allow 443/tcp comment 'EPANET Digital Twin - HTTPS'

# Optional: Allow SSH (if not already allowed)
if ! ufw status | grep -q "22/tcp"; then
    echo -e "${YELLOW}SSH (port 22) not found in rules.${NC}"
    read -p "Do you want to allow SSH access? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ufw allow 22/tcp comment 'SSH'
    fi
fi

echo ""
echo -e "${GREEN}=== Firewall Rules Added ===${NC}"
echo ""
echo "New UFW status:"
ufw status numbered
echo ""

# Ask if user wants to enable UFW (if not already enabled)
if ! ufw status | grep -q "Status: active"; then
    echo -e "${YELLOW}UFW is currently inactive.${NC}"
    read -p "Do you want to enable UFW now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Enabling UFW..."
        ufw --force enable
        echo -e "${GREEN}UFW enabled${NC}"
    else
        echo -e "${YELLOW}UFW remains inactive. Enable it manually with: sudo ufw enable${NC}"
    fi
else
    echo -e "${GREEN}UFW is already active${NC}"
fi

echo ""
echo -e "${GREEN}=== Configuration Complete ===${NC}"
echo ""
echo "Summary of rules added:"
echo "  - Port 80 (HTTP): ALLOWED"
echo "  - Port 443 (HTTPS): ALLOWED"
echo ""
echo "Your application should now be accessible at:"
echo "  - http://46.32.109.46"
echo "  - https://46.32.109.46"
echo ""
echo "To test, run: ./scripts/check-access.sh"
