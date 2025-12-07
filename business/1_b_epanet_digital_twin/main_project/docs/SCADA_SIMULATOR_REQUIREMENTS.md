# SCADA Simulator Requirements

## Overview

Build an autonomous SCADA simulator service that generates realistic sensor readings with configurable data loss, timestamp delays, and diurnal patterns. All readings are stored in PostgreSQL database. The simulator runs as an asyncio background task that can be started and stopped from the frontend.

## Key Simplifications

- **Single Network Only**: No manager needed - only one network simulator instance at a time
- **In-Memory Status**: Status stored in memory (not database) for simplicity and speed
- **Frontend Integration**: Status endpoint allows frontend to poll and update start/stop button state

## Database Setup

### Database Models (SQLAlchemy)

Create `backend/models.py` with:

#### SCADAReading
Stores all sensor readings:
- `id`: Primary key (UUID or auto-increment)
- `network_id`: UUID reference to network
- `timestamp`: When reading was taken (with delay applied)
- `sensor_id`: Sensor identifier (e.g., "PRESSURE_29")
- `sensor_type`: "pressure", "flow", or "level"
- `value`: Actual sensor reading value
- `location_id`: Node or link ID from network
- `created_at`: When record was created in database

**Indexes**: network_id, timestamp, sensor_id for query performance

#### BaselineData
Stores baseline values for generating readings:
- `id`: Primary key
- `network_id`: UUID reference to network
- `location_id`: Node or link ID
- `location_type`: "junction", "pipe", or "tank"
- `sensor_type`: "pressure", "flow", or "level"
- `baseline_value`: Reference value for this sensor
- `created_at`: When baseline was calculated

**Indexes**: network_id, location_id

#### Network
Stores network metadata:
- `id`: UUID primary key
- `name`: Network name/title
- `file_path`: Path to .inp file
- `uploaded_at`: Upload timestamp
- `baseline_calculated_at`: When baseline was established

#### NetworkItem
Stores network topology (junctions, pipes, tanks):
- `id`: Primary key
- `network_id`: UUID reference to network
- `item_type`: "junction", "pipe", or "tank"
- `item_id`: Item identifier from .inp file
- `properties`: JSON field for additional properties

#### SCADAGenerationLog
Stores generation cycle logs for frontend display:
- `id`: Primary key
- `network_id`: UUID reference to network
- `generation_timestamp`: When generation cycle ran (real-time, not delayed)
- `readings_generated`: Number of readings generated in this cycle
- `junctions_selected`: Number of junctions selected (after data loss)
- `pipes_selected`: Number of pipes selected (after data loss)
- `tanks_selected`: Number of tanks selected (after data loss)
- `created_at`: When log record was created

**Indexes**: network_id, generation_timestamp for query performance
**Purpose**: Frontend can query recent logs to show user activity and statistics

### Database Connection

Create `backend/database.py`:
- SQLAlchemy async engine and session factory
- Connection to PostgreSQL (TimescaleDB) from docker-compose.yml
- Database initialization function
- Connection string: `postgresql+asyncpg://postgres:postgres@localhost:5432/rtdwms`

## SCADA Simulator Service

### Core Simulator Service

Create `backend/services/scada_simulator.py`:

#### SCADASimulator Class

**Attributes**:
- `network_id`: UUID of network being simulated
- `generation_rate_minutes`: How often to generate readings (1, 2, 3, 15, 60, etc.)
- `data_loss_proportion`: Percentage of items to include (0.0-1.0, e.g., 0.90 = 90%)
- `delay_mean`: Mean delay for truncated normal distribution (default: 2.5 minutes)
- `delay_std_dev`: Standard deviation for delays (default: 2.0 minutes)
- `delay_max`: Maximum delay bound (default: 10.0 minutes)
- `task`: asyncio.Task for background generation loop
- `status`: In-memory status dictionary (not in database)
- `baseline_data`: Dictionary of baseline values {location_id: {sensor_type: value}}
- `network_items`: Dictionary of network topology {item_type: [item_ids]}

**Status Dictionary Structure** (in-memory):
```python
{
    "status": "stopped" | "starting" | "running" | "error",
    "network_id": "uuid",
    "started_at": datetime | None,
    "last_generation_time": datetime | None,
    "total_readings_generated": int,
    "configuration": {
        "generation_rate_minutes": float,
        "data_loss_proportion": float,
        "delay_mean": float,
        "delay_std_dev": float,
        "delay_max": float
    },
    "current_cycle": {
        "junctions_selected": int,
        "pipes_selected": int,
        "tanks_selected": int,
        "readings_generated": int
    },
    "error": str | None
}
```

**Methods**:

- `__init__(network_id, config)`: Initialize simulator
  - Load network items from database
  - Load baseline data from database
  - Initialize status to "stopped"

- `async start()`: Start simulator
  - Validate network and baseline exist
  - Set status to "starting"
  - Create asyncio task for generation loop
  - Set status to "running"
  - Return status

- `async stop()`: Stop simulator
  - Cancel asyncio task gracefully
  - Set status to "stopped"
  - Return success

- `get_status()`: Return current status dictionary
  - Read from in-memory status
  - No database query needed

- `async _generation_loop()`: Main generation loop (private)
  - Runs continuously at configured interval
  - Uses asyncio.sleep for timing
  - Each cycle:
    1. Get current real-time and hour
    2. Randomly select proportion of network items
    3. Generate readings: baseline × pattern_multiplier × noise
    4. Apply timestamp delays (truncated normal distribution)
    5. Bulk insert readings to database
    6. **Insert generation log to database** (SCADAGenerationLog)
    7. Update in-memory status

**Reading Generation Logic**:
- For each selected sensor:
  - Get baseline value from `baseline_data`
  - Get diurnal multiplier from `time_patterns.get_diurnal_multiplier(hour)`
  - Add noise: ±2% for pressure, ±3% for flow, ±1% for tank level
  - Calculate: `value = baseline × pattern_multiplier × (1 + noise)`

**Timestamp Delay Logic**:
- Sample delay from truncated normal distribution:
  - Mean: `delay_mean`
  - Std Dev: `delay_std_dev`
  - Bounds: [0, `delay_max`]
- Use scipy.stats.truncnorm or numpy equivalent
- Reading timestamp: `generation_time - delay`
- Ensures all timestamps are in the past

**Data Loss Simulation**:
- Each generation cycle:
  - Randomly select `data_loss_proportion × total_junctions` junctions
  - Randomly select `data_loss_proportion × total_pipes` pipes
  - Randomly select `data_loss_proportion × total_tanks` tanks
  - Selection re-randomized each cycle (simulates intermittent failures)

## API Endpoints

### FastAPI Routes

Create `backend/routers/scada_simulator.py`:

#### POST /api/scada-simulator/start

**Request Body**:
```json
{
  "network_id": "uuid",
  "generation_rate_minutes": 5,
  "data_loss_proportion": 0.90,
  "delay_mean": 2.5,
  "delay_std_dev": 2.0,
  "delay_max": 10.0
}
```

**Response**:
```json
{
  "success": true,
  "status": {
    "status": "running",
    "network_id": "uuid",
    ...
  }
}
```

**Behavior**:
- Validates network exists and baseline is available
- Creates and starts single simulator instance
- Returns current status

#### POST /api/scada-simulator/stop

**Request Body**:
```json
{
  "network_id": "uuid"  // Optional, can stop current simulator
}
```

**Response**:
```json
{
  "success": true,
  "message": "Simulator stopped"
}
```

**Behavior**:
- Stops simulator gracefully
- Cancels background task
- Updates status to "stopped"

#### GET /api/scada-simulator/status

**Response**:
```json
{
  "status": "running" | "stopped" | "starting" | "error",
  "network_id": "uuid" | null,
  "started_at": "2024-01-15T14:00:00Z" | null,
  "last_generation_time": "2024-01-15T14:05:00Z" | null,
  "total_readings_generated": 1420,
  "configuration": {
    "generation_rate_minutes": 5,
    "data_loss_proportion": 0.90,
    "delay_mean": 2.5,
    "delay_std_dev": 2.0,
    "delay_max": 10.0
  },
  "current_cycle": {
    "junctions_selected": 135,
    "pipes_selected": 180,
    "tanks_selected": 5,
    "readings_generated": 320
  },
  "error": null
}
```

**Behavior**:
- Returns current simulator status from in-memory state
- No database query needed
- Frontend polls this endpoint (e.g., every 5 seconds) to update UI
- Frontend uses status to enable/disable start/stop button

#### GET /api/scada-simulator/logs

**Query Parameters**:
- `network_id` (required): UUID of network
- `limit` (optional, default: 50): Number of recent logs to return
- `offset` (optional, default: 0): Pagination offset

**Response**:
```json
{
  "logs": [
    {
      "id": 123,
      "generation_timestamp": "2024-01-15T14:05:00Z",
      "readings_generated": 320,
      "junctions_selected": 135,
      "pipes_selected": 180,
      "tanks_selected": 5,
      "created_at": "2024-01-15T14:05:01Z"
    },
    {
      "id": 122,
      "generation_timestamp": "2024-01-15T14:00:00Z",
      "readings_generated": 315,
      "junctions_selected": 133,
      "pipes_selected": 178,
      "tanks_selected": 5,
      "created_at": "2024-01-15T14:00:01Z"
    }
  ],
  "total": 1420,
  "limit": 50,
  "offset": 0
}
```

**Behavior**:
- Returns recent generation logs from database
- Ordered by generation_timestamp descending (most recent first)
- Frontend can poll this to show user activity
- **Polling recommendation**: Poll at same interval as generation rate (e.g., if generation_rate=5 min, poll logs every 5 minutes)

#### GET /api/scada-simulator/health

**Response**:
```json
{
  "status": "healthy",
  "database_connected": true
}
```

**Behavior**:
- Health check endpoint
- Verifies database connectivity
- Returns service health status

## Main FastAPI App

Create/update `backend/main.py`:

- FastAPI app initialization
- Database connection setup
- Include scada_simulator router
- CORS middleware for frontend (allow localhost:5173)
- Startup/shutdown events for database connection management
- Global simulator instance variable (single instance, no manager)

**Global Simulator Instance**:
```python
# Global simulator instance (only one network supported)
_simulator: Optional[SCADASimulator] = None
```

## Dependencies

Add to `requirements.txt` or install:

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `sqlalchemy`: ORM
- `asyncpg`: PostgreSQL async driver
- `numpy`: Numerical operations
- `scipy`: Truncated normal distribution
- `epyt`: EPANET Python wrapper (for baseline calculation if needed)
- `python-multipart`: File uploads
- `pydantic`: Request/response validation

## Configuration Defaults

- **Generation Rate**: 5 minutes
- **Data Loss Proportion**: 0.90 (90% of items)
- **Delay Mean**: 2.5 minutes
- **Delay Std Dev**: 2.0 minutes
- **Delay Max**: 10.0 minutes

## Error Handling

- Graceful shutdown on stop (cancel task, update status)
- Error status updates in memory (status = "error", error message stored)
- Logging for debugging (use Python logging module)
- Validation of configuration parameters (ensure valid ranges)
- Handle database connection errors gracefully

## File Structure

```
backend/
├── main.py                      # FastAPI app
├── database.py                  # Database connection
├── models.py                    # SQLAlchemy models
├── routers/
│   └── scada_simulator.py       # API endpoints
└── services/
    ├── scada_simulator.py       # Core simulator logic
    └── time_patterns.py         # Existing diurnal patterns
```

## Frontend Integration

The frontend should:

### Status Polling
1. Poll `GET /api/scada-simulator/status` periodically:
   - **Recommended interval**: Every 2-5 seconds (for UI responsiveness)
   - Used for updating start/stop button state
   - Lightweight (in-memory status, no database query)

2. Update start/stop button state based on status:
   - If status is "stopped": Enable start button, disable stop button
   - If status is "running": Disable start button, enable stop button
   - If status is "starting": Disable both buttons, show loading
   - If status is "error": Show error message, enable stop button

3. Display current configuration and statistics from status response

### Generation Logs Polling
4. Poll `GET /api/scada-simulator/logs` to show user activity:
   - **Recommended interval**: Match the generation rate
     - If `generation_rate_minutes = 1`: Poll every 1 minute
     - If `generation_rate_minutes = 5`: Poll every 5 minutes
     - If `generation_rate_minutes = 15`: Poll every 15 minutes
     - If `generation_rate_minutes = 60`: Poll every 60 minutes
   - **Rationale**: New logs are created at generation rate, so polling at same rate ensures fresh data without unnecessary requests
   - Display recent logs showing:
     - Generation timestamp
     - Number of readings generated
     - Items selected (junctions, pipes, tanks)
   - Show message like: "Last generation: 320 readings at 2:05 PM"

5. Handle errors gracefully (network errors, API errors)

### Polling Strategy Example
```javascript
// Status polling (frequent, for UI responsiveness)
setInterval(() => {
  fetch('/api/scada-simulator/status')
    .then(res => res.json())
    .then(status => updateUI(status));
}, 3000); // Every 3 seconds

// Logs polling (matches generation rate)
const generationRate = status.configuration.generation_rate_minutes;
setInterval(() => {
  fetch(`/api/scada-simulator/logs?network_id=${networkId}&limit=10`)
    .then(res => res.json())
    .then(logs => displayLogs(logs));
}, generationRate * 60 * 1000); // Convert minutes to milliseconds
```

## Implementation Notes

1. **Single Instance**: Only one simulator instance at a time (no manager needed)
2. **In-Memory Status**: Status stored in simulator instance, not database (faster, simpler)
3. **Database Logging**: Generation logs stored in database for persistence and frontend display
4. **Async Operations**: All database operations use async/await
5. **Bulk Inserts**: Use SQLAlchemy bulk insert for performance when storing many readings
6. **Log Insertion**: After each generation cycle, insert single log record to SCADAGenerationLog table
7. **Truncated Normal**: Use scipy.stats.truncnorm for delay distribution
8. **Random Selection**: Use random.sample() for data loss simulation
9. **Diurnal Patterns**: Reuse existing `time_patterns.py` module
10. **Error Recovery**: If generation loop fails, set status to "error" and log error

## Testing Considerations

- Unit tests for delay distribution (verify truncated normal bounds)
- Unit tests for data loss selection (verify proportion)
- Unit tests for reading generation (verify formula: baseline × pattern × noise)
- Integration tests for database operations
- Test simulator start/stop lifecycle
- Test status endpoint returns correct state
- Test error handling and recovery

