# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Raasel is a multi-tenant customer support chat platform built with Express.js, Socket.IO, and React. It supports real-time messaging with typing indicators, agent management, and scalable multi-organization architecture.

### Key Architecture Components

- **Multi-tenant Design**: Organizations have isolated data and agents
- **Hybrid Database**: PostgreSQL (metadata) + Cassandra (messages) + Redis (real-time state)
- **Real-time Communication**: Socket.IO for instant messaging and typing indicators
- **Agent Assignment**: Round-robin load balancing with availability tracking
- **Security**: JWT authentication, HTTPS, rate limiting, bcrypt password hashing

## Development Commands

### Infrastructure Setup
```bash
# Start Docker infrastructure (databases + nginx)
cd dockerized && ./build.sh

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop infrastructure
docker-compose down
```

### Backend Development
```bash
# Install dependencies and start development server
cd dockerized/server
npm install
npm run dev

# Run tests
npm test

# Test Cassandra connection
node test-cassandra.js
```

### Frontend Development
```bash
# Install dependencies and start React app
cd dockerized/client
npm install
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Access
```bash
# PostgreSQL (metadata)
docker exec -it dockerized_postgres_1 psql -U postgres -d raasel_meta

# Cassandra (messages)
docker exec -it dockerized_cassandra_1 cqlsh
USE raasel_chat;
DESCRIBE tables;

# Redis (sessions)
docker exec -it dockerized_redis_1 redis-cli
```

## Architecture Details

### Database Schema

**PostgreSQL (raasel_meta):**
- `organizations`: Multi-tenant organization data with JSON settings
- `agents`: Agent authentication and role management (agent/supervisor/admin)
- `sessions`: Chat session lifecycle and agent assignment
- `clients`: Client authentication and profiles

**Cassandra (raasel_chat):**
- `messages`: Partitioned by organization_id and session_id, clustered by timestamp
- Primary key: `((organization_id, session_id), timestamp, message_id)`

**Redis:**
- Session mappings and real-time state
- Socket.IO session tracking

### Socket.IO Events

**Client Events:**
- `join_organization`: Connect to organization room
- `send_message`: Send message to session
- `typing_start/stop`: Typing indicators
- `get_session_history`: Retrieve message history

**Server Events:**
- `new_message`: Broadcast new messages
- `agent_assigned`: Notify of agent assignment
- `typing_start/stop`: Broadcast typing status
- `session_status_updated`: Session state changes

### API Endpoints

**Organizations:**
- `GET /api/organizations/discover/:domain`
- `GET /api/organizations/:id`
- `POST /api/organizations`

**Agents:**
- `POST /api/agents/login`
- `POST /api/agents`
- `GET /api/agents/organization/:id`
- `PUT /api/agents/:id/status`

**Sessions:**
- `POST /api/sessions`
- `GET /api/sessions/:id`
- `GET /api/sessions/:id/messages`
- `PUT /api/sessions/:id/assign`
- `PUT /api/sessions/:id/close`

## Key Files

### Backend Structure
- `server/server.js`: Main Express server with Socket.IO setup
- `server/socket/chatHandler.js`: Real-time message handling and agent assignment
- `server/models/`: Database models for Organization, Agent, Session, Message
- `server/routes/`: RESTful API endpoints
- `server/config/database.js`: Database connection configuration

### Frontend Structure
- `client/src/App.js`: Main React app with authentication flow
- `client/src/components/AuthForm.js`: Login/registration component
- `client/src/components/MainChatUI.js`: Chat interface with session management
- `client/src/components/ChatWidget.js`: Embeddable chat widget
- `client/src/services/`: API and Socket.IO client services

### Infrastructure
- `docker-compose.yml`: Multi-service Docker setup
- `init.sql`: PostgreSQL schema initialization
- `build.sh`: Infrastructure setup script
- `nginx/nginx.conf`: Reverse proxy and SSL configuration

## Development Workflow

### Initial Setup
1. Run `./dockerized/build.sh` to start infrastructure
2. Set up environment variables in `server/.env`
3. Start backend: `cd dockerized/server && npm run dev`
4. Start frontend: `cd dockerized/client && npm start`

### Database Initialization
- PostgreSQL schema auto-created via `init.sql`
- Cassandra keyspace/table created via docker-compose init service
- Sample data includes test organization and agent

### Testing
- Backend tests with Jest: `npm test` in server directory
- Frontend tests with React Testing Library: `npm test` in client directory
- Cassandra connection test: `node test-cassandra.js`

### SSL Certificates
- Development: Auto-generated self-signed certificates via `generate-ssl.sh`
- Production: Replace certificates in `ssl/` directory

## Multi-Tenant Features

### Organization Isolation
- All data partitioned by organization_id
- Agents only see sessions from their organization
- Messages stored with organization_id partition key

### Agent Management
- Three roles: agent, supervisor, admin
- Status tracking: active, inactive, busy
- Round-robin assignment algorithm

### Session Lifecycle
- States: waiting, active, closed
- Automatic agent assignment for new client messages
- Session history persistence in Cassandra

## Sample Credentials

**Test Organization:**
- Domain: `sample.com`
- Agent Email: `john@sample.com`
- Agent Password: `password123`

## Development Tips

### Local Development
- Backend runs on port 5000
- Frontend runs on port 3000
- All services accessible via nginx proxy on port 443/80

### Database Debugging
- Use Docker logs to debug connection issues
- Cassandra requires time to fully initialize
- Redis is optional - app degrades gracefully without it

### Socket.IO Development
- Join organization rooms for message isolation
- Session rooms for participant-specific events
- Typing indicators use session-scoped broadcasts