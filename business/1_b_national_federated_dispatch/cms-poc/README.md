# CMS POC - Crisis Management System

A browser-based split-screen crisis operations dashboard with AI-simulated agency responses and voice command input.

## Features

- **Incident Management**: Create, view, update, and manage crisis incidents
- **AI-Simulated Agency Responses**: Get contextual responses from Jordanian agencies (PSD, Civil Defense, MoH, MoPW, Armed Forces, Governorate HQ)
- **Voice Command Input**: Record voice messages in Arabic with automatic transcription
- **GIS Mapping**: Interactive map with incident visualization and filtering
- **Real-time Updates**: WebSocket-based live synchronization across all views
- **Split-Screen Interface**: Incident list, details with messaging, and map view

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher) with PostGIS extension
- npm or yarn

## Setup Instructions

### 1. Database Setup

```bash
# Install PostGIS extension (if not already installed)
# On Ubuntu/Debian:
sudo apt-get install postgresql-postgis

# On macOS with Homebrew:
brew install postgis

# Create database and run schema
cd backend/db
chmod +x init.sh
./init.sh

# Or manually:
psql -U postgres -c "CREATE DATABASE cms_db;"
psql -U postgres -d cms_db -f schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# Optional: Add OPENAI_API_KEY for enhanced AI responses

# Start backend server
npm start
```

The backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: cms_db)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `PORT`: Backend server port (default: 4000)
- `OPENAI_API_KEY`: (Optional) OpenAI API key for enhanced AI responses

## Usage

1. **Create an Incident**: Click "+ Create New Incident" in the left panel
2. **View Incident Details**: Click on any incident in the list
3. **Send Messages**: 
   - Type a message in the text input and click "Send"
   - Or click the microphone icon to record a voice message
4. **AI Agency Responses**: When you send a message, the system automatically generates a response from a random Jordanian agency
5. **View on Map**: Click incidents in the list or markers on the map to synchronize views
6. **Filter Incidents**: Use the filter controls on the map to filter by type or status

## Project Structure

```
cms-poc/
├── backend/
│   ├── db/
│   │   ├── schema.sql          # Database schema with PostGIS
│   │   └── init.sh             # Database initialization script
│   ├── server.js               # Express server with WebSocket
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IncidentList.js      # Incident list component
│   │   │   ├── IncidentDetails.js   # Incident details with messaging
│   │   │   ├── MapView.js            # GIS map component
│   │   │   ├── MessageList.js       # Messaging interface
│   │   │   └── VoiceInput.js         # Voice recording component
│   │   ├── context/
│   │   │   └── IncidentContext.js    # React context with WebSocket
│   │   ├── services/
│   │   │   └── aiService.js          # AI agency response service
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## Technology Stack

- **Backend**: Node.js, Express, PostgreSQL with PostGIS, Socket.io
- **Frontend**: React, Leaflet, Web Speech API, Socket.io Client
- **AI**: OpenAI API (optional, with fallback responses)

## Notes

- The system works without OpenAI API key using simple fallback responses
- Voice input requires browser support for Web Speech API (Chrome, Edge recommended)
- Arabic voice recognition works best in Chrome/Edge browsers
- Database must have PostGIS extension enabled for geospatial features

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `pg_isready`
- Check database credentials in `.env` file
- Verify PostGIS extension is installed: `psql -d cms_db -c "SELECT PostGIS_version();"`

### Voice Input Not Working
- Ensure you're using Chrome or Edge browser
- Check browser permissions for microphone access
- Web Speech API may not work in all browsers

### AI Responses Not Working
- If OpenAI API key is not set, the system uses fallback responses
- Check browser console for API errors
- Verify network connectivity

## License

This is a proof-of-concept project for demonstration purposes.
