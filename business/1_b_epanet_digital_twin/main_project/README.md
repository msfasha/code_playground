# HydroTwin

A real-time water distribution network monitoring system that compares expected values from EPANET hydraulic analysis with actual SCADA sensor readings to detect anomalies and monitor network health.

## Overview

HydroTwin is a digital twin platform for water distribution networks that provides:
- **Real-time monitoring** of network performance
- **Anomaly detection** by comparing expected vs actual sensor readings
- **SCADA simulation** for testing and development (can be replaced with real sensors)
- **Network visualization** with interactive maps
- **Dashboard metrics** for network health assessment

The system uses EPANET for hydraulic analysis to predict expected network behavior and compares these predictions with actual sensor readings to identify issues like leaks, pipe breaks, pump failures, and sensor malfunctions.

## Features

### Core Capabilities

- **Network Management**
  - Upload EPANET .inp files
  - Automatic baseline calculation
  - Network topology visualization on interactive maps
  - Coordinate transformation support (WGS84, Jordan Mercator, etc.)

- **SCADA Simulator**
  - Autonomous sensor reading generation
  - Configurable generation rates (1, 2, 3, 15, 60 minutes, etc.)
  - Realistic diurnal demand patterns
  - Data loss simulation (configurable percentage)
  - Timestamp delays with bounded distributions
  - Real-time status monitoring

- **Monitoring Service**
  - Continuous anomaly detection
  - EPANET Extended Period Simulation (EPS) integration
  - Configurable thresholds (pressure, flow, tank level)
  - Tank level feedback loop for improved accuracy
  - Real-time dashboard metrics
  - Network health scoring (0-100)

- **Anomaly Detection**
  - Severity classification (Medium, High, Critical)
  - Configurable deviation thresholds
  - Historical anomaly tracking
  - Real-time alerts

- **Dashboard & Visualization**
  - Network health score with status indicators
  - Demand comparison (SCADA vs Expected)
  - Pressure comparison across junctions
  - Sensor coverage percentage
  - Anomaly rate and severity breakdown
  - Tank levels comparison
  - Interactive network map with Leaflet

## Architecture

```
┌─────────────────┐
│   Frontend      │  React + TypeScript + Leaflet
│   (Port 5173)   │  - Network View Page
└────────┬────────┘  - Simulator Page
         │           - Monitoring Page
         │
         │ HTTP/REST
         │
         ▼
┌─────────────────┐
│   Backend API   │  FastAPI + Python
│   (Port 8000)   │  - Network Management Router
└────────┬────────┘  - SCADA Simulator Router
         │           - Monitoring Router
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────────────┐  ┌─────────────────┐
│ SCADA           │  │ Monitoring      │
│ Simulator       │  │ Service         │
│ (Autonomous)    │  │                 │
│                 │  │ - EPANET EPS    │
│ - Generates     │  │ - Anomaly       │
│   readings      │  │   Detection     │
│ - Data loss     │  │ - Dashboard     │
│   simulation    │  │   Metrics      │
│ - Timestamp     │  │                 │
│   delays        │  │                 │
└────────┬────────┘  └────────┬────────┘
         │                    │
         └──────────┬─────────┘
                    │
                    ▼
         ┌─────────────────┐
         │   PostgreSQL    │  TimescaleDB
         │   (Port 5432)   │  - SCADA Readings
         │                 │  - Anomalies
         │                 │  - Expected Values
         │                 │  - Network Metadata
         └─────────────────┘
```

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with async support
- **PostgreSQL/TimescaleDB** - Time-series database
- **EPANET (epyt)** - Hydraulic analysis engine
- **NumPy/SciPy** - Numerical computations
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **Proj4** - Coordinate transformations

### Infrastructure
- **Docker Compose** - Database containerization
- **PostgreSQL/TimescaleDB** - Database

## Installation

### Prerequisites

- Python 3.9+ 
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HydroTwin
   ```

2. **Set up Python virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Start the database**
   ```bash
   docker-compose up -d
   ```
   This starts a PostgreSQL/TimescaleDB container on port 5432.

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Initialize the database** (if needed)
   The database tables are created automatically on first run.

## Running the Application

### Option 1: Start Everything at Once

Use the provided startup script:
```bash
./start_system.sh
```

This script:
- Checks and starts the database if needed
- Starts the backend on `http://localhost:8000`
- Starts the frontend on `http://localhost:5173`
- Shows logs and status

Press `Ctrl+C` to stop all services.

### Option 2: Start Services Separately

**Start Backend:**
```bash
cd backend
source ../venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Start Database:**
```bash
docker-compose up -d
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (postgres/postgres)

## Usage

### 1. Upload a Network

1. Navigate to the **Network View** page
2. Upload an EPANET .inp file
3. The system will:
   - Parse the network topology
   - Calculate baseline values using EPANET
   - Display the network on an interactive map

### 2. Start SCADA Simulator

1. Navigate to the **Simulator** page
2. Configure settings:
   - **Generation Rate**: How often to generate readings (minutes)
   - **Data Loss Proportion**: Percentage of sensors to include (0.0-1.0)
   - **Delay Parameters**: Mean, std dev, and max delay for timestamps
3. Click **Start SCADA Simulator**
4. Monitor status and generation logs in real-time

### 3. Start Monitoring Service

1. Navigate to the **Monitoring** page
2. Configure settings:
   - **Monitoring Interval**: How often to check for anomalies (minutes)
   - **Time Window**: How far back to query SCADA readings (minutes)
   - **Thresholds**: Deviation thresholds for pressure, flow, and tank level
   - **Tank Feedback**: Enable/disable EPANET tank level updates from SCADA
3. Click **Start Monitoring**
4. View:
   - Real-time dashboard metrics
   - Network health score
   - Detected anomalies
   - Comparison charts (SCADA vs Expected)

### 4. View Anomalies

- Anomalies are automatically detected and displayed on the Monitoring page
- Filter by severity (Medium, High, Critical)
- View detailed information including:
  - Sensor ID and type
  - Actual vs Expected values
  - Deviation percentage
  - Timestamp

## Project Structure

```
HydroTwin/
├── backend/                    # FastAPI backend
│   ├── main.py                # FastAPI app entry point
│   ├── database.py            # Database connection and setup
│   ├── models.py              # SQLAlchemy models
│   ├── routers/               # API route handlers
│   │   ├── network_management_router.py
│   │   ├── scada_simulator_router.py
│   │   └── monitoring_router.py
│   └── services/              # Business logic
│       ├── scada_simulator_service.py
│       ├── monitoring_service.py
│       └── time_patterns.py
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.tsx            # Main app component with routing
│   │   ├── components/       # Reusable components
│   │   │   ├── FileUpload.tsx
│   │   │   ├── NetworkMap.tsx
│   │   │   └── NetworkOverlay.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── NetworkViewPage.tsx
│   │   │   ├── SimulatorPage.tsx
│   │   │   └── MonitoringPage.tsx
│   │   ├── context/          # React context
│   │   │   └── NetworkContext.tsx
│   │   └── utils/            # Utility functions
│   │       ├── epanetParser.ts
│   │       └── coordinateTransform.ts
│   └── package.json
│
├── docs/                       # Documentation
│   ├── MONITORING_SYSTEM.md
│   ├── SCADA_SIMULATOR_REQUIREMENTS.md
│   └── EPANET_PARSING_NOTES.md
│
├── docker-compose.yml          # Database container config
├── requirements.txt            # Python dependencies
├── start_system.sh            # Startup script
└── README.md                  # This file
```

## API Documentation

The API is fully documented with OpenAPI/Swagger. Once the backend is running, visit:

**http://localhost:8000/docs**

### Key Endpoints

#### Network Management
- `POST /api/networks/upload` - Upload .inp file
- `GET /api/networks` - List networks
- `GET /api/networks/{network_id}` - Get network details

#### SCADA Simulator
- `POST /api/scada-simulator/start` - Start simulator
- `POST /api/scada-simulator/stop` - Stop simulator
- `GET /api/scada-simulator/status` - Get simulator status
- `GET /api/scada-simulator/logs` - Get generation logs

#### Monitoring
- `POST /api/monitoring/start` - Start monitoring service
- `POST /api/monitoring/stop` - Stop monitoring service
- `GET /api/monitoring/status` - Get monitoring status
- `GET /api/monitoring/anomalies` - Query anomalies
- `GET /api/monitoring/dashboard-metrics` - Get dashboard metrics

## Configuration

### SCADA Simulator Defaults
- **Generation Rate**: 5 minutes
- **Data Loss Proportion**: 0.90 (90% of sensors)
- **Delay Mean**: 2.5 minutes
- **Delay Std Dev**: 2.0 minutes
- **Delay Max**: 10.0 minutes

### Monitoring Service Defaults
- **Monitoring Interval**: 1.0 minute
- **Time Window**: 5.0 minutes
- **Pressure Threshold**: 10.0%
- **Flow Threshold**: 15.0%
- **Tank Level Threshold**: 5.0%
- **Tank Feedback**: Enabled

## Database Schema

### Key Tables

- **networks** - Network metadata and .inp file paths
- **network_items** - Network topology (junctions, pipes, tanks)
- **baseline_data** - Baseline values for sensor generation
- **scada_readings** - All sensor readings over time
- **anomalies** - Detected anomalies with severity classification
- **epanet_computed_expected** - EPANET predictions for historical analysis
- **scada_generation_logs** - Simulator generation cycle logs

## Development

### Backend Development

```bash
cd backend
source ../venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Database Migrations

The database schema is managed through SQLAlchemy models. Tables are created automatically on first run. For production, consider using Alembic for migrations.

### Logging

- Backend logs: `tail -f backend.log`
- Frontend logs: `tail -f frontend.log`
- Database logs: `docker-compose logs postgres`

## Testing

### Manual Testing

1. Upload a network file (.inp)
2. Start SCADA simulator and verify readings are generated
3. Start monitoring service and verify anomalies are detected
4. Check dashboard metrics update in real-time

### Example Network Files

Sample .inp files are available in:
- `inp_files/` directory
- `backend/networks/` directory (after upload)

## Troubleshooting

### Database Connection Issues
- Ensure Docker container is running: `docker ps`
- Check database logs: `docker-compose logs postgres`
- Verify connection string in `backend/database.py`

### Port Already in Use
- Backend (8000): Check for existing uvicorn processes
- Frontend (5173): Check for existing Vite processes
- Database (5432): Check for existing PostgreSQL instances

### EPANET Errors
- Ensure .inp file is valid EPANET format
- Check network file path is correct
- Verify epyt library is installed correctly

## Documentation

Additional documentation is available in the `docs/` directory:

- **MONITORING_SYSTEM.md** - Detailed monitoring system architecture
- **SCADA_SIMULATOR_REQUIREMENTS.md** - SCADA simulator specifications
- **EPANET_PARSING_NOTES.md** - EPANET file parsing details

## License

[Specify your license here]

## Contributing

[Add contribution guidelines if applicable]

## Acknowledgments

- EPANET for hydraulic analysis capabilities
- TimescaleDB for time-series data storage
- React and FastAPI communities

---

For more information, visit the API documentation at http://localhost:8000/docs when the backend is running.

