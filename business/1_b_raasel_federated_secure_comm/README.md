# Raasel Chat Platform

A secure, multi-tenant customer support chat platform built with Node.js, Express, React, and Socket.IO.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🏢 **Multi-tenant**: Support for multiple organizations
- 💬 **Real-time Chat**: WebSocket-based real-time messaging
- 🛡️ **SSL/TLS**: Secure HTTPS communication
- 📱 **Responsive UI**: Modern React frontend with mobile support
- 🗄️ **PostgreSQL**: Robust database backend

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- SSL certificates (for HTTPS)

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb raasel

# Run initialization script
psql -d raasel -f init.sql
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Generate SSL certificates (development)
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/certificate.crt -days 365 -nodes

# Start server
npm run dev
```

### 3. Client Setup

```bash
cd client_web

# Install dependencies
npm install

# Create SSL certificates (development)
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/certificate.crt -days 365 -nodes

# Start client
npm start
```

## Environment Configuration

### Server (.env)

```env
NODE_ENV=development
PORT=3001
HOST=localhost
DEBUG=true

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=raasel
PG_PASSWORD=password
PG_PORT=5432

CLIENT_URL=https://localhost:3000
```

### Client (.env)

```env
REACT_APP_API_URL=https://localhost:3001/api
```

## API Endpoints

### Authentication

- `POST /api/clients/register` - Register new client
- `POST /api/clients/login` - Client login
- `GET /api/clients/me` - Get current user profile

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "path": "field_name",
      "msg": "Validation error message"
    }
  ]
}
```

## Database Schema

### Clients Table
- `id` (UUID) - Primary key
- `username` (VARCHAR) - Unique username
- `email` (VARCHAR) - Unique email
- `password_hash` (VARCHAR) - Bcrypt hashed password
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Organizations Table
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Organization name
- `domain` (VARCHAR) - Unique domain
- `settings` (JSONB) - Organization settings
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Agents Table
- `id` (UUID) - Primary key
- `organization_id` (UUID) - Foreign key to organizations
- `username` (VARCHAR) - Unique username
- `email` (VARCHAR) - Unique email
- `password_hash` (VARCHAR) - Bcrypt hashed password
- `role` (VARCHAR) - Agent role
- `is_active` (BOOLEAN) - Active status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Tokens**: 24-hour expiration
- **Input Validation**: Express-validator middleware
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: HTTP security headers
- **SSL/TLS**: HTTPS encryption

## Development

### Running in Development

```bash
# Server (with auto-reload)
npm run dev

# Client (with auto-reload)
npm start
```

### Debug Mode

```bash
# Server debug
npm run debug

# Client debug
# Open browser dev tools
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper SSL certificates
4. Set up database with proper permissions
5. Configure reverse proxy (nginx recommended)
6. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **SSL Certificate Errors**: Ensure certificates are in the correct location and have proper permissions
2. **Database Connection**: Verify PostgreSQL is running and credentials are correct
3. **CORS Errors**: Check CLIENT_URL configuration
4. **JWT Errors**: Ensure JWT_SECRET is set

### Logs

- Server logs are output to console
- Enable DEBUG=true for detailed logging
- Check browser console for client-side errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 