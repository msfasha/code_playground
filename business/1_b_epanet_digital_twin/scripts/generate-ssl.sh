#!/bin/bash

# Generate self-signed SSL certificates for testing
# For production, use Let's Encrypt instead

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

DOMAIN=${DOMAIN:-46.32.109.46}
CERT_DIR="./certbot/conf/live/${DOMAIN}"

echo -e "${YELLOW}Generating self-signed SSL certificate for ${DOMAIN}...${NC}"

# Create directories
mkdir -p "$CERT_DIR"

# Generate private key
openssl genrsa -out "$CERT_DIR/privkey.pem" 2048

# Generate certificate signing request
openssl req -new -key "$CERT_DIR/privkey.pem" -out "$CERT_DIR/cert.csr" \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN}"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in "$CERT_DIR/cert.csr" -signkey "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem"

# Clean up CSR
rm "$CERT_DIR/cert.csr"

echo -e "${GREEN}✓ Self-signed certificate generated${NC}"
echo -e "${YELLOW}Note: Browsers will show a security warning for self-signed certificates.${NC}"
echo -e "${YELLOW}For production, use Let's Encrypt certificates instead.${NC}"
