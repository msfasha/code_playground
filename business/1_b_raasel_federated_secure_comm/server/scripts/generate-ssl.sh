#!/bin/bash

# Create SSL directory
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/private.key 2048

# Generate certificate signing request
openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt

# Set permissions
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt

echo "SSL certificates generated successfully!"
echo "Private key: ssl/private.key"
echo "Certificate: ssl/certificate.crt" 