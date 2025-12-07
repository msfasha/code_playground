# Copilot Instructions for Raasel Chat Platform

Raasel is a **multi-tenant customer support chat platform** with real-time messaging, built using Express.js + Socket.IO (backend) and React.js (frontend).

## Architecture Overview

### Multi-Database Strategy
- **PostgreSQL**: Organizations, agents, sessions metadata (`raasel_meta`)
- **Cassandra**: Messages partitioned by `organization_id` and `session_id` (`raasel_chat`)
- **Redis**: Real-time session state and Socket.IO mapping (optional, degrades gracefully)

### Multi-Tenant Design
- All data isolated by `organization_id` 
- Agents only access their organization's sessions
- Messages partitioned: `PRIMARY KEY ((organization_id, session_id), timestamp, message_id)`

### Real-Time Communication
- Socket.IO rooms: `org_{organization_id}` and `session_{session_id}`
- Typing indicators scoped to sessions
- Agent assignment via round-robin algorithm in `chatHandler.js`

### Client Architecture
- **Web Client**: React.js app in `client_web/` with HTTPS-first design
- **Mobile Client**: Planned React Native app in `client_mobile/` (currently empty)

## Development Workflow

### Initial Setup
```bash
# Start infrastructure (databases + nginx proxy)
./build.sh

# Backend development server (HTTPS on port 5000)
cd server && npm install && npm run dev

# Frontend development server (HTTPS on port 3000)
cd client_web && npm install && npm start
```

### SSL Certificate Management
```bash
# Auto-generated during build.sh, or manually:
cd server && ./scripts/generate-ssl.sh

# Certificates location: server/ssl/ and root ssl/
# Required files: certificate.crt, private.key
```

### Database Access
```bash
# PostgreSQL metadata
docker exec -it raasel_postgres_1 psql -U postgres -d raasel_meta

# Cassandra messages
docker exec -it raasel_cassandra_1 cqlsh
USE raasel_chat;
```

## Key Implementation Patterns

### Database Graceful Degradation
All database connections in `config/database.js` use try/catch with warnings, not failures. Services continue without Redis/Cassandra if unavailable.

### Socket.IO Event Flow
- Join: `join_organization` → rooms + Redis mapping
- Messages: `send_message` → Cassandra + broadcast to session room
- Typing: `typing_start/stop` → session-scoped broadcasts only

### Agent Assignment Logic
In `chatHandler.js`: Round-robin selection from active agents, automatic assignment when clients send messages to waiting sessions.

### Authentication Patterns
- **JWT Middleware**: Reusable `auth()` function in routes (Bearer token format)
- **Password Hashing**: `bcrypt.hash(password, 12)` for all user passwords
- **Token Structure**: 24h expiry, includes `{id, username, email}` payload
- **Environment**: `JWT_SECRET` must be set in server environment

### HTTPS-First Architecture
- SSL certificates required in `server/ssl/` directory (`certificate.crt`, `private.key`)
- All communication encrypted (client ↔ server, nginx proxy)
- Self-signed certs acceptable for development
- Rate limiting: 100 requests/15min per IP on `/api/*` routes

## File Structure Conventions

### Backend (`server/`)
- `models/`: Database abstractions (Organization, Agent, Session, Message)
- `routes/`: RESTful endpoints grouped by resource
- `socket/chatHandler.js`: All real-time messaging logic
- `config/database.js`: Multi-database connection management

### Frontend (`client_web/src/`)
- `components/`: Reusable UI (AuthForm, ChatWidget, MainChatUI)
- `services/`: API client (`api.js`) and Socket.IO (`socket.js`)
- HTTPS required - development uses self-signed certificates

### Infrastructure
- `docker-compose.yml`: Infrastructure only (nginx, databases)
- `build.sh`: Setup script that excludes app containers for local development
- `nginx/`: SSL termination and reverse proxy to localhost:5000

## Testing Commands
```bash
# Cassandra connection test
cd server && node test-cassandra.js

# Backend tests
cd server && npm test

# Frontend tests  
cd client_web && npm test

# Health check (server must be running)
curl -k https://localhost:5000/health
```

## Security Patterns
- JWT authentication for agents (`bcryptjs` password hashing)
- HTTPS enforced via nginx proxy + Express SSL
- Rate limiting enabled in Express (100 req/15min per IP)
- Multi-tenant data isolation via organization_id
- Debug logging controlled by `DEBUG=true` environment variable

When implementing features, follow the established multi-tenant patterns and maintain database graceful degradation.
