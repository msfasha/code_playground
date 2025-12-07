#!/bin/bash

echo "🚀 Building Raasel Chat Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/certificate.crt" ]; then
    echo "🔐 Generating SSL certificates..."
    ./server/scripts/generate-ssl.sh
else
    echo "✅ SSL certificates already exist"
fi

# Copy environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating environment file..."
    cp server/env.example server/.env
    echo "⚠️  Please edit server/.env file with your configuration before starting"
fi

# Build and start only the database and nginx containers
echo "🐳 Building and starting Docker containers (databases and nginx only)..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "✅ Raasel Chat Platform infrastructure is starting up!"
echo ""
echo "The frontend and backend were removed from the docker-compose.yml file. You can start them locally by running the following commands:"
echo "   cd server && npm install && npx nodemon server.js"
echo "   cd client && npm install && npm start"
echo ""
echo "🌐 Access the application via Nginx proxy:"
echo "   Frontend: https://localhost"
echo "   Backend API: https://localhost/api"
echo ""
echo "📊 Database ports:"
echo "   PostgreSQL: localhost:5432"
echo "   Cassandra: localhost:9042"
echo "   Redis: localhost:6379"
echo ""
echo "📝 Sample credentials:"
echo "   Agent Email: john@sample.com"
echo "   Agent Password: password123"
echo ""
echo "🔍 Check logs: docker-compose logs -f"
echo "🛑 Stop application: docker-compose down"
echo ""
echo "🚦 To start the backend (Express/Socket.IO) locally:"
echo "   cd server && npm install && npx nodemon server.js"
echo ""
echo "🚦 To start the frontend (React) locally:"
echo "   cd client && npm install && npm start" 