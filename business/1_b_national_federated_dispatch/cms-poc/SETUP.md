# Quick Setup Guide

## Step 1: Database Setup

```bash
# Ensure PostgreSQL is installed and running
sudo systemctl start postgresql  # Linux
# or
brew services start postgresql   # macOS

# Create database
createdb cms_db

# Connect and enable PostGIS
psql cms_db
CREATE EXTENSION postgis;
\q

# Run schema
psql -d cms_db -f backend/db/schema.sql
```

## Step 2: Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials if needed
npm start
```

## Step 3: Frontend

```bash
cd frontend
npm install
npm start
```

## Step 4: Access

Open http://localhost:3000 in your browser (Chrome or Edge recommended for voice input)

## Testing

1. Click "+ Create New Incident"
2. Fill in the form and create an incident
3. Click on the incident to view details
4. Type a message or use the microphone to record
5. See AI agency response appear automatically
6. Click on map markers to navigate between incidents


