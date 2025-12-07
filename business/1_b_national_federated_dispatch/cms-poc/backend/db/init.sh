#!/bin/bash

# Database initialization script
# This script creates the database and runs the schema

echo "Initializing CMS Database..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
psql -U postgres -h localhost -c "CREATE DATABASE cms_db;" 2>/dev/null || echo "Database already exists"

# Run schema
echo "Running schema..."
psql -U postgres -h localhost -d cms_db -f schema.sql

echo "Database initialization complete!"


