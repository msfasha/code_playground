# Water Network Monitoring System

## Overview

The monitoring system continuously monitors a **real water distribution network** by comparing **expected values** (from EPANET hydraulic analysis) with **actual values** (from SCADA sensors) to detect anomalies in real-time.

## What's Real vs Simulated

**Real Components:**
- **Water Network**: Real network topology, pipes, junctions, tanks (from .inp file)
- **EPANET Hydraulic Analysis**: Real hydraulic calculations predicting network behavior
- **Expected Values**: Real predictions based on actual network physics

**Simulated Component (Temporary):**
- **SCADA Sensor Readings**: Currently simulated because real sensors aren't connected yet
  - When real SCADA sensors are available, simply replace the simulator with real sensor data
  - The simulator generates realistic readings based on baseline + patterns + noise

**Note**: This is a **monitoring system**, not a simulation system. The network analysis is real. Only the sensor data is simulated temporarily.

## Core Concept

The system works on a simple principle:
1. **EPANET** predicts what the network values *should* be (pressures, flows, tank levels)
2. **SCADA sensors** report what the values *actually* are
3. **Comparison** detects when actual deviates significantly from expected → **Anomaly**

## System Architecture

### Components

```
┌─────────────────┐
│  Frontend       │  User controls:
│  (React)        │  - Start/Stop SCADA Simulator
│                 │  - Start/Stop Monitoring
│                 │  - Configure: generation rate, data loss %, delay params
│                 │  - View real-time status of both processes
└────────┬────────┘
         │
         │ (queries status)
         │
         ▼
┌─────────────────┐
│  Backend API    │  Receives control requests
│  (FastAPI)      │  Provides status endpoints
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────────────┐  ┌─────────────────┐
│ SCADA           │  │ Monitoring      │
│ Simulator       │  │ Service         │
│ (Autonomous)    │  │                 │
│                 │  │                 │
│ - Runs          │  │ - Queries DB    │
│   independently │  │   for readings  │
│ - Generates     │  │ - Gets expected │
│   readings at   │  │   from EPANET   │
│   configurable  │  │ - Compares &    │
│   intervals     │  │   detects       │
│ - Simulates     │  │   anomalies     │
│   data loss     │  │                 │
│ - Applies       │  │                 │
│   timestamp     │  │                 │
│   delays        │  │                 │
│ - Maintains     │  │ - Maintains     │
│   status        │  │   status        │
└────────┬────────┘  └────────┬────────┘
         │                    │
         │                    │
         └──────────┬─────────┘
                    │
                    ▼
         ┌─────────────────┐
         │ Database        │  Store readings & anomalies
         │ (PostgreSQL)    │  Store process status
         └─────────────────┘
                    │
                    ▼
         ┌─────────────────┐
         │ Monitoring      │  EPANET Extended Period
         │ Engine (EPANET) │  Simulation
         └─────────────────┘
```

## How It Works: Step-by-Step

### Phase 1: Network Setup

1. **Network Upload**
   - Network file (.inp) is uploaded to backend
   - Stored in `networks/` directory
   - Network ID generated

2. **Baseline Establishment**
   - EPANET runs a complete hydraulic simulation
   - Extracts "normal" values:
     - Pressures at all junctions and tanks
     - Flows in all pipes
     - Tank levels
     - Demands at junctions
   - These become the **baseline** (reference point)

### Phase 2: SCADA Simulator (Autonomous Process)

The SCADA simulator runs as an **independent, autonomous process** that can be started and stopped from the frontend.

#### Starting the SCADA Simulator

When you click "Start SCADA Simulator" in the frontend:

1. **Configuration** (set in frontend):
   - **Generation Rate**: How often to generate readings (1, 2, 3, 15, 60 minutes, etc.)
   - **Data Loss Proportion**: Percentage of network items to include (e.g., 90% = 10% data loss)
   - **Delay Configuration**:
     - **Delay Mean**: Mean delay for truncated normal distribution (default: 2.5 minutes)
     - **Delay Standard Deviation**: Standard deviation for delays (default: 2.0 minutes)
     - **Maximum Delay**: Upper bound for delays (default: 10 minutes)
     - Delays are bounded between 0 and maximum delay
     - Delays are always positive (readings arrive late, never early)
     - No reading can have a future timestamp

2. **Simulator Initialization**:
   - Loads network information (junctions, pipes, tanks)
   - Initialized with baseline data
   - Creates 24-hour diurnal demand pattern
   - Sets status to "starting"
   - Starts autonomous generation loop
   - Updates status to "running" when loop begins

#### SCADA Generation Loop (Runs Continuously)

The simulator runs independently at the configured generation rate:

```
Every N minutes (configurable: 1, 2, 3, 15, 60, etc.):

1. Get Current Real-Time
   - Current time: e.g., 2:05 PM
   - Current hour: 14 (for pattern lookup)

2. Randomly Select Network Items (Data Loss Simulation)
   - Randomly select X% of junctions (e.g., 90% of 150 = 135 junctions)
   - Randomly select X% of pipes (e.g., 90% of 200 = 180 pipes)
   - Randomly select X% of tanks (e.g., 90% of 5 = 4-5 tanks)
   - Selection is re-randomized each cycle (simulates intermittent failures)

3. Generate Readings for Selected Items
   For each selected sensor:
   - Calculate value: baseline × pattern_multiplier × noise
   - Pattern multiplier based on current hour (diurnal pattern)
   - Add realistic noise (±2% pressure, ±3% flow, ±1% level)
   
4. Apply Timestamp Delays
   For each reading:
   - Generation time: current real-time (e.g., 2:05 PM)
   - Delay: sample from bounded distribution (0 to max_delay minutes)
     - **Recommended**: Truncated normal distribution
       - Mean: configurable (default: 2.5 min)
       - Standard deviation: configurable (default: 2.0 min)
       - Bounds: [0, max_delay] where max_delay is configurable (default: 10 min)
     - **Alternative**: Exponential distribution
       - Scale parameter: configurable (default: 2.5 min)
       - Bounded to [0, max_delay]
     - Ensures delays are bounded and realistic
     - Ensures no reading has a future timestamp
   - Reading timestamp: generation_time - delay (reading arrives late)
   - Example: Generated at 2:05 PM, delay = 3.2 min → timestamp = 2:01:48 PM
   - Example: Generated at 2:05 PM, delay = 0.5 min → timestamp = 2:04:30 PM
   - **Important**: All readings have timestamps in the past (simulates transmission/processing delays)

5. Store Readings in Database
   - All generated readings stored with their delayed timestamps
   - Includes: timestamp, sensor_id, sensor_type, value, location_id, network_id

6. Update Status
   - Updates status with:
     - Last generation time
     - Total readings generated
     - Current configuration (rate, data loss %, delay params)
     - Status: "running"
```

**Key Points**:
- Simulator runs **independently** of monitoring service
- Generation rate is **configurable** from frontend
- Data loss is **simulated** by randomly selecting a proportion each cycle
- Timestamps have **bounded one-directional delays** (0 to max_delay minutes)
  - Uses truncated normal distribution (bounded, realistic)
  - No reading can have a future timestamp
  - Simulates realistic transmission/processing delays
- Readings are stored **asynchronously** as they're generated
- Status is **continuously updated** and accessible from frontend

**Stopping the SCADA Simulator**:
- When you click "Stop SCADA Simulator" in the frontend:
  - Simulator gracefully stops the generation loop
  - Updates status to "stopped"
  - Status remains queryable from frontend

### Phase 3: Monitoring Service (Separate Process)

**IMPORTANT**: The monitoring service is **completely separate** from the SCADA simulator:
- No shared code, classes, or functions
- Only shared: database models (Network, SCADAReading) and database connection
- Can be containerized separately in the future
- Located in `backend/services/monitoring_service.py` and `backend/routers/monitoring.py`

The monitoring service runs as a **separate process** that can be started and stopped independently from the SCADA simulator.

#### Starting the Monitoring Service

When you click "Start Monitoring" in the frontend:

1. **Configuration** (set in frontend):
   - **Monitoring Interval**: How often to run monitoring cycle (default: 1.0 minute, configurable)
   - **Time Window**: How far back to query SCADA readings (default: 5.0 minutes, configurable)
   - **Pressure Threshold**: Deviation threshold for pressure sensors (default: 10.0%)
   - **Flow Threshold**: Deviation threshold for flow sensors (default: 15.0%)
   - **Tank Level Threshold**: Deviation threshold for tank level sensors (default: 5.0%)
   - **Enable Tank Feedback**: Whether to update EPANET tank levels from SCADA (default: True)

2. **Monitoring Engine Setup**:
   - Loads EPANET network file (.inp)
   - Initializes Extended Period Simulation (EPS)
   - Runs initial simulation to get current state
   - Sets status to "starting"

3. **Monitoring Loop Begins**:
   - Starts background asyncio task
   - Updates status to "running" when loop begins

**Stopping the Monitoring Service**:
- When you click "Stop Monitoring" in the frontend:
  - Monitoring service gracefully stops the monitoring loop
  - Closes EPANET instance
  - Updates status to "stopped"
  - Status remains queryable from frontend

### Phase 3: Continuous Monitoring Loop

The monitoring loop runs every **N minutes** (configurable from frontend, default: 1 minute):

#### Step 1: Query Recent SCADA Readings

```
Current Time: 2:05 PM (real-world)
Query Window: 5 minutes (configurable)
Last Processed Timestamp: 2:00 PM

Query SCADA readings:
- WHERE timestamp > last_processed_timestamp
- AND timestamp <= current_time
- AND timestamp >= (current_time - time_window_minutes)

This ensures:
- No readings are reprocessed (tracked by last_processed_timestamp)
- Only recent readings are considered (bounded by time_window)
- Handles late-arriving readings gracefully
```

**Key Point**: The monitoring service uses `last_processed_timestamp` to track which readings have been processed. This avoids:
- Reprocessing the same readings
- Missing readings that arrive late
- Querying too far back in time

#### Step 2: Run EPANET Extended Period Simulation

```
Current Time: 2:05 PM (real-world)
EPS Time: 14:05 (synchronized to real-time)

EPANET calculates:
- Expected pressures at each junction/tank
- Expected flows in each pipe
- Expected tank levels (cumulative, based on inflows/outflows)
```

**Key Point**: EPANET uses Extended Period Simulation, which means:
- Tank levels change cumulatively over time (not reset each time)
- Network state is preserved between steps
- Patterns from .inp file are applied based on simulation time
- The simulation uses time patterns that match real-time diurnal variations

#### Step 3: Compare Readings and Detect Anomalies

```
For each SCADA reading:
1. Get expected value from EPANET (by location_id and sensor_type)
2. Calculate deviation: |actual - expected| / expected × 100%
3. Get threshold based on sensor_type:
   - Pressure: pressure_threshold_percent (default: 10%)
   - Flow: flow_threshold_percent (default: 15%)
   - Tank Level: tank_level_threshold_percent (default: 5%)
4. If deviation > threshold:
   → Create anomaly record
   → Classify severity:
      - Medium: 1.0× - 1.5× threshold
      - High: 1.5× - 2.0× threshold
      - Critical: ≥ 2.0× threshold
```

**Example**:
```
Sensor: PRESSURE_29
Expected: 45.2 m
Actual: 38.5 m
Deviation: |38.5 - 45.2| / 45.2 × 100% = 14.82%
Threshold: 10%
Result: ANOMALY (High severity - 1.48× threshold)
```

#### Step 4: Update Tank Levels from SCADA (Optional Feedback Loop)

```
If enable_tank_feedback is True (default):
- Uses actual tank level readings from SCADA
- Updates EPANET tank initial levels
- Makes future predictions more accurate

This feedback loop improves monitoring accuracy by:
- Correcting EPANET predictions with actual tank levels
- Accounting for real-world tank operations
- Reducing false positives from tank level predictions
```

#### Step 5: Store Anomalies

```
Detected anomalies stored in database (anomalies table):
- Timestamp (when anomaly was detected)
- Sensor information (sensor_id, sensor_type, location_id)
- Actual vs Expected values
- Deviation percentage
- Threshold that was exceeded
- Severity level (medium, high, critical)
- Network ID
```

#### Step 6: Store Expected Values for Historical Analysis

```
Expected values stored in database (epanet_computed_expected table):
- Timestamp (when prediction was made)
- Location ID and sensor type
- Expected value from EPANET
- EPS hour (simulation hour)
- Network ID

This enables:
- Trend analysis over time
- Pattern detection
- Model accuracy tracking
- Digital twin insights
```

#### Step 7: Update Last Processed Timestamp

```
Update last_processed_timestamp:
- If readings were processed: use latest reading timestamp
- If no readings: use current time

This ensures:
- Next cycle only queries new readings
- No readings are missed or reprocessed
```

#### Step 8: Update Status

```
Update monitoring service status with:
- Last check time
- Last processed timestamp
- Total anomalies detected
- Current monitoring interval
- EPS synchronization status
- Last check statistics (readings processed, anomalies found, comparison time)
- Status: "running"
```

#### Step 9: Wait for Next Interval

```
Sleep for N minutes (monitoring_interval_minutes, configurable from frontend)
Then repeat from Step 1
```

## Real-Time Synchronization

EPS synchronization with real-time:

1. **On Start**: 
   - Load EPANET network file
   - Run `solveCompleteHydraulics()` to initialize simulation
   - Track current real-time hour
   - EPANET uses time patterns from .inp file that match diurnal variations
   - EPS hour is tracked to match real-time hour

2. **During Monitoring**:
   - Each cycle: Run `solveCompleteHydraulics()` to get current network state
   - EPANET applies time patterns based on simulation time
   - Extract expected values at current real-time hour
   - EPS hour tracked to match real-time hour

**Note**: EPANET's `solveCompleteHydraulics()` runs the entire simulation period defined in the .inp file. The synchronization is achieved by:
- Using time patterns in .inp file that match real-time diurnal patterns
- Tracking real-time hour and matching it with EPS hour
- Extracting values at the appropriate simulation time

### Example Timeline

```
Start: 2:00 PM (14:00)
├─ Load EPANET network
├─ Run solveCompleteHydraulics() (initializes simulation)
├─ Track EPS hour: 14, Real-time hour: 14 ✓

After 1 minute: 2:01 PM
├─ Query SCADA readings since 2:00 PM
├─ Run solveCompleteHydraulics() (gets current state)
├─ Extract expected values
├─ Compare and detect anomalies
├─ Update last_processed_timestamp
├─ EPS hour: 14.017, Real-time hour: 14.017 ✓

After 1 hour: 3:00 PM
├─ EPS hour: 15, Real-time hour: 15 ✓
├─ Patterns match real-time demand variations
```

## Diurnal Patterns

Both EPANET and SCADA use the same 24-hour demand pattern:

```
Hour 0-5:   0.7-0.8  (Night - low demand)
Hour 6-7:   0.7-1.4  (Morning rise)
Hour 8-9:   1.4       (Morning peak - high demand)
Hour 10-11: 1.2-1.4   (Post-morning)
Hour 12-13: 0.8-1.0   (Midday)
Hour 14-17: 0.6-0.9   (Afternoon - low demand)
Hour 18-19: 0.9-1.3   (Evening peak - high demand)
Hour 20-23: 0.8-1.0   (Evening to night)
```

**How it works**:
- At 8 AM: Both EPANET and SCADA use 1.4x multiplier (morning peak)
- At 2 PM: Both use 0.6x multiplier (afternoon low)
- Patterns always match because both use real-time hour

## Anomaly Detection

### Thresholds

| Sensor Type | Threshold | Example |
|------------|-----------|---------|
| Pressure   | 10%       | Expected: 45 m, Actual: 40 m → 11% deviation → **Anomaly** |
| Flow       | 15%       | Expected: 100 L/s, Actual: 120 L/s → 20% deviation → **Anomaly** |
| Tank Level | 5%        | Expected: 10 m, Actual: 9.4 m → 6% deviation → **Anomaly** |

### Severity Levels

| Severity | Range | Example (Pressure, 10% threshold) |
|----------|-------|-----------------------------------|
| Medium   | 1.0x - 1.5x | 10% - 15% deviation |
| High     | 1.5x - 2.0x | 15% - 20% deviation |
| Critical | > 2.0x      | > 20% deviation |

### What Causes Anomalies?

In real systems, anomalies indicate:
- **Leaks**: Pressure drops, flow increases
- **Pipe breaks**: Significant pressure/flow changes
- **Pump failures**: Flow/pressure drops
- **Sensor malfunctions**: Readings don't match expected
- **Demand spikes**: Unusual consumption patterns
- **Valve issues**: Flow restrictions or blockages

## Data Storage

### SCADA Readings Table

Stores all sensor readings over time:
```sql
scada_readings (
    id,
    network_id,
    timestamp,        -- When reading was taken
    sensor_id,        -- e.g., "PRESSURE_29"
    sensor_type,      -- "pressure", "flow", "level"
    value,            -- Actual sensor reading
    location_id       -- Node or link ID
)
```

**Storage Rate**: 
- Every 5 minutes (monitoring interval)
- All sensors at once (pressures + flows + tank levels)
- Example: 200 sensors × 12 readings/hour = 2,400 rows/hour

### Anomalies Table

Stores detected anomalies:
```sql
anomalies (
    id,
    network_id,
    timestamp,         -- When anomaly was detected (real-time)
    sensor_id,         -- e.g., "PRESSURE_29"
    sensor_type,       -- "pressure", "flow", "level"
    location_id,       -- Node or link ID
    actual_value,      -- What sensor reported
    expected_value,    -- What EPANET predicted
    deviation_percent, -- How much they differ: |actual - expected| / expected × 100
    threshold_percent, -- Threshold that was exceeded
    severity,          -- "medium", "high", "critical"
    created_at         -- When record was created
)
```

**Indexes**: network_id, timestamp, severity for efficient querying

### Expected Values Table

Stores EPANET predictions for historical analysis:
```sql
epanet_computed_expected (
    id,
    network_id,
    timestamp,         -- When prediction was made (real-time)
    location_id,       -- Node or link ID
    sensor_type,       -- "pressure", "flow", "level"
    expected_value,    -- Predicted value from EPANET
    eps_hour,          -- EPANET simulation hour (0-24)
    created_at         -- When record was created
)
```

**Indexes**: network_id, timestamp, location_id for efficient querying

**Purpose**: Enables trend analysis, pattern detection, and model accuracy tracking for digital twin insights.




## Process Status

Both the **SCADA Simulator** and **Monitoring Service** maintain their own independent status that is continuously updated and accessible from the frontend.

### Status States

Each process can be in one of the following states:
- **`stopped`**: Process is not running
- **`starting`**: Process is initializing
- **`running`**: Process is actively running
- **`error`**: Process encountered an error and stopped

### SCADA Simulator Status

The SCADA simulator status includes:

```json
{
  "status": "running" | "stopped" | "starting" | "error",
  "network_id": "uuid",
  "started_at": "2024-01-15T14:00:00Z",
  "last_generation_time": "2024-01-15T14:05:00Z",
  "total_readings_generated": 1420,
  "configuration": {
    "generation_rate_minutes": 5,
    "data_loss_proportion": 0.90,
    "delay_mean_minutes": 2.5,
    "delay_std_dev_minutes": 2.0,
    "delay_max_minutes": 10.0
  },
  "current_cycle": {
    "junctions_selected": 135,
    "pipes_selected": 180,
    "tanks_selected": 5,
    "readings_generated": 320
  },
  "error": null | "error message"
}
```

**Status Updates**:
- Updated after each generation cycle
- Includes real-time statistics
- Accessible via API endpoint: `GET /api/scada-simulator/status`

### Monitoring Service Status

The monitoring service status includes:

```json
{
  "status": "running" | "stopped" | "starting" | "error",
  "network_id": "uuid",
  "started_at": "2024-01-15T14:00:00Z",
  "last_check_time": "2024-01-15T14:01:00Z",
  "last_processed_timestamp": "2024-01-15T14:01:00Z",
  "total_anomalies_detected": 12,
  "configuration": {
    "monitoring_interval_minutes": 1.0,
    "time_window_minutes": 5.0,
    "pressure_threshold_percent": 10.0,
    "flow_threshold_percent": 15.0,
    "tank_level_threshold_percent": 5.0,
    "enable_tank_feedback": true
  },
  "eps_synchronization": {
    "synced": true,
    "current_eps_hour": 14.017,
    "real_time_hour": 14.017,
    "elapsed_minutes": 840.0
  },
  "last_check_stats": {
    "readings_processed": 320,
    "anomalies_found": 2,
    "comparison_time_ms": 1250
  },
  "error": null | "error message"
}
```

**Status Updates**:
- Updated after each monitoring cycle
- Includes EPS synchronization status
- Tracks last_processed_timestamp to avoid reprocessing readings
- Accessible via API endpoint: `GET /api/monitoring/status`

### Frontend Status Display

The frontend can:
- **Query status** via API endpoints (polling or WebSocket)
- **Display real-time status** for both processes
- **Show configuration** currently in use
- **Display statistics** (readings generated, anomalies detected, etc.)
- **Indicate process state** with visual indicators (running/stopped/error)
- **Display dashboard metrics** with visual cards showing:
  - Network health score and status
  - Total demand comparison (SCADA vs Expected)
  - Average pressure comparison (SCADA vs Expected)
  - Sensor coverage percentage
  - Anomaly rate and severity breakdown
  - Tank levels (actual vs expected)

**Example Frontend Status Display**:
```
┌─────────────────────────────────┐
│ SCADA Simulator                 │
│ Status: 🟢 Running              │
│ Last Generation: 2:05 PM       │
│ Total Readings: 1,420          │
│ Config: 5 min, 90%, delay: 2.5±2.0 (max: 10)│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Monitoring Service               │
│ Status: 🟢 Running              │
│ Last Check: 2:05 PM             │
│ Anomalies Detected: 12          │
│ EPS: Synced (Hour 14)           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Dashboard Metrics                │
│                                  │
│ ┌──────────┐ ┌──────────┐      │
│ │ Health   │ │ Demand   │      │
│ │ 85.3/100 │ │ 1250 L/s │      │
│ │ Excellent│ │ ↑ 4.21%  │      │
│ └──────────┘ └──────────┘      │
│                                  │
│ ┌──────────┐ ┌──────────┐      │
│ │ Pressure │ │ Coverage │      │
│ │ 42.5 m   │ │ 90.14%   │      │
│ │ ↓ 5.56%  │ │ 320/355  │      │
│ └──────────┘ └──────────┘      │
│                                  │
│ ┌──────────┐ ┌──────────┐      │
│ │ Anomaly  │ │ Tanks    │      │
│ │ Rate     │ │ TANK1:   │      │
│ │ 1.56%    │ │ 8.5/9.0m │      │
│ │ M:3 H:2  │ │ ↓ 5.56%  │      │
│ └──────────┘ └──────────┘      │
└─────────────────────────────────┘
```

### Status Storage

Process status can be:
- **In-memory**: Fast access, lost on restart
- **Database**: Persistent, survives restarts
- **Hybrid**: In-memory for speed, database for persistence

**Recommendation**: Store status in database for persistence and queryability, with in-memory cache for fast frontend access.

## Key Features

### 1. Real-Time Synchronization
- EPS starts at current real-time hour
- Stays synchronized throughout monitoring
- Patterns match between EPANET and SCADA

### 2. Cumulative Tank Level Tracking
- EPS maintains tank levels over time
- Accounts for inflows/outflows
- More accurate than snapshot analysis (which would reset tank levels each time)

### 3. Configurable Monitoring
- Adjustable monitoring interval (default: 1 minute, configurable from frontend)
- Configurable time window for SCADA queries (default: 5 minutes)
- Configurable anomaly thresholds (pressure, flow, tank level)
- Configurable tank feedback (enable/disable)
- Single network support (for now)

### 4. Comprehensive Data Storage
- All SCADA readings stored (from SCADA simulator)
- All anomalies tracked (detected by monitoring service)
- Expected values stored for historical analysis
- Time-series database for efficient queries
- Indexed queries for performance

### 5. Dashboard Metrics
- Real-time aggregated metrics comparing SCADA vs EPANET
- Network health score (0-100) with status indicators
- Total demand comparison (sum of flow readings)
- Average pressure comparison across all junctions
- Sensor coverage percentage (active/total sensors)
- Anomaly rate and severity breakdown
- Tank levels comparison (actual vs expected)
- Visual dashboard with color-coded indicators
- Auto-updates at monitoring interval

### 6. Independent Process Status
- SCADA Simulator maintains its own status (running/stopped/error)
- Monitoring Service maintains its own status (running/stopped/error)
- Status accessible from frontend via API endpoints
- Real-time statistics and configuration visible
- Process states can be monitored independently

## API Endpoints

The monitoring service provides the following REST API endpoints:

### POST /api/monitoring/start
Start the monitoring service with configuration.

**Request Body**:
```json
{
  "network_id": "uuid",
  "monitoring_interval_minutes": 1.0,
  "time_window_minutes": 5.0,
  "pressure_threshold_percent": 10.0,
  "flow_threshold_percent": 15.0,
  "tank_level_threshold_percent": 5.0,
  "enable_tank_feedback": true
}
```

### POST /api/monitoring/stop
Stop the monitoring service.

**Request Body**:
```json
{
  "network_id": "uuid"  // Optional
}
```

### GET /api/monitoring/status
Get current monitoring service status.

**Response**: Returns status dictionary with configuration, statistics, and EPS synchronization info.

### GET /api/monitoring/anomalies
Query detected anomalies.

**Query Parameters**:
- `network_id` (required): UUID of network
- `severity` (optional): Filter by severity ("medium", "high", "critical")
- `start_time` (optional): Start time filter (ISO format)
- `end_time` (optional): End time filter (ISO format)
- `limit` (default: 100): Maximum number of results
- `offset` (default: 0): Pagination offset

### GET /api/monitoring/dashboard-metrics
Get aggregated dashboard metrics for monitoring page.

**Query Parameters**:
- `network_id` (required): UUID of network
- `time_window_minutes` (default: 5.0, max: 60): How far back to query data for metrics

**Response**:
```json
{
  "time_window_minutes": 5.0,
  "start_time": "2024-01-15T14:00:00Z",
  "end_time": "2024-01-15T14:05:00Z",
  "demand": {
    "total_scada_demand": 1250.5,
    "total_expected_demand": 1200.0,
    "deviation_percent": 4.21,
    "unit": "L/s"
  },
  "pressure": {
    "avg_scada_pressure": 42.5,
    "avg_expected_pressure": 45.0,
    "deviation_percent": -5.56,
    "unit": "m"
  },
  "sensor_coverage": {
    "active_sensors": 320,
    "total_sensors": 355,
    "coverage_percent": 90.14
  },
  "anomalies": {
    "total_count": 5,
    "rate_percent": 1.56,
    "by_severity": {
      "medium": 3,
      "high": 2,
      "critical": 0
    },
    "total_readings": 320
  },
  "tank_levels": [
    {
      "tank_id": "TANK1",
      "actual_level": 8.5,
      "expected_level": 9.0,
      "deviation_percent": -5.56
    }
  ],
  "network_health": {
    "score": 85.3,
    "status": "excellent",
    "breakdown": {
      "anomaly_score": 96.88,
      "pressure_score": 72.2,
      "demand_score": 86.0,
      "coverage_score": 90.14
    }
  }
}
```

**Metrics Explained**:
- **Demand**: Total flow demand from SCADA vs EPANET expected (sum of all flow readings)
- **Pressure**: Average pressure across all junctions (SCADA vs EPANET expected)
- **Sensor Coverage**: Percentage of sensors reporting data (active/total)
- **Anomalies**: Anomaly count, rate, and breakdown by severity
- **Tank Levels**: Actual vs expected levels for each tank with deviation
- **Network Health**: Composite score (0-100) based on:
  - Anomaly rate (40% weight): Lower is better
  - Pressure deviation (30% weight): Lower is better
  - Demand match (20% weight): Closer is better
  - Sensor coverage (10% weight): Higher is better
  - Status: "excellent" (≥80), "good" (≥60), "fair" (≥40), "poor" (<40)

### GET /api/monitoring/health
Health check endpoint.

## Example Scenario

**Setup**:
- Network: 150 junctions, 200 pipes, 5 tanks
- Start time: 2:00 PM (14:00)
- Monitoring interval: 1 minute (configurable)
- Time window: 5 minutes (configurable)

**What Happens**:

1. **2:00 PM - Start**:
   - Load EPANET network file
   - Initialize EPS (run solveCompleteHydraulics())
   - Track EPS hour: 14, Real-time hour: 14 ✓
   - Monitoring loop begins

2. **2:01 PM - First Check**:
   - Query SCADA readings: timestamp > 2:00 PM AND <= 2:01 PM
   - Run EPANET solveCompleteHydraulics() (gets current state)
   - Compare readings with expected values
   - No anomalies detected (values match within thresholds)
   - Store expected values for historical analysis
   - Update last_processed_timestamp = 2:01 PM
   - Update tank levels from SCADA (if enabled)

3. **2:02 PM - Second Check**:
   - Query SCADA readings: timestamp > 2:01 PM AND <= 2:02 PM
   - Run EPANET solveCompleteHydraulics()
   - Compare readings
   - 1 anomaly detected (pressure drop at junction 29)
   - Store anomaly and expected values
   - Update last_processed_timestamp = 2:02 PM

4. **Continues every 1 minute...**

## Implementation Details

### Code Structure

**Monitoring Service** (`backend/services/monitoring_service.py`):
- `MonitoringService` class: Core monitoring logic
- Completely separate from SCADA simulator
- Simple, well-documented code
- No fancy patterns or abstractions

**API Router** (`backend/routers/monitoring_router.py`):
- REST API endpoints for monitoring control
- Dashboard metrics endpoint for aggregated statistics
- Request/response models
- Error handling

**Database Models** (`backend/models.py`):
- `Anomaly`: Stores detected anomalies
- `ExpectedValue`: Stores EPANET predictions for historical analysis

### Key Implementation Features

1. **Reading Processing Tracking**:
   - Uses `last_processed_timestamp` to track processed readings
   - Avoids reprocessing the same readings
   - Handles late-arriving readings gracefully
   - Bounded by `time_window_minutes` to limit query range

2. **EPANET Integration**:
   - Loads network .inp file on start
   - Runs `solveCompleteHydraulics()` each cycle
   - Extracts expected values for all locations
   - Updates tank levels from SCADA (optional feedback)

3. **Anomaly Detection**:
   - Compares actual vs expected for each reading
   - Calculates deviation: `|actual - expected| / expected × 100`
   - Classifies severity: medium (1.0-1.5× threshold), high (1.5-2.0×), critical (≥2.0×)
   - Stores anomalies with full context

4. **Historical Analysis**:
   - Stores expected values every monitoring cycle
   - Enables trend analysis and pattern detection
   - Supports digital twin insights

5. **Dashboard Metrics**:
   - Aggregates SCADA readings, expected values, and anomalies
   - Calculates network health score based on multiple factors
   - Provides real-time comparison metrics (demand, pressure, coverage)
   - Updates automatically at monitoring interval
   - Accessible via `/api/monitoring/dashboard-metrics` endpoint

## Summary

The monitoring system:
- ✅ Runs continuously in the background (configurable interval, default: 1 minute)
- ✅ Uses EPANET hydraulic analysis to predict expected values (real network analysis)
- ✅ Queries SCADA readings from database (does not generate them)
- ✅ Tracks processed readings to avoid reprocessing
- ✅ Compares expected vs actual values with configurable thresholds
- ✅ Detects anomalies and classifies severity
- ✅ Stores anomalies and expected values for analysis
- ✅ Updates EPANET tank levels from SCADA (optional feedback loop)
- ✅ Stores all data in database with proper indexes
- ✅ Handles errors gracefully
- ✅ Completely separate from SCADA simulator (can be containerized independently)
- ✅ Simple, well-documented code
- ✅ Provides dashboard metrics endpoint for real-time aggregated statistics
- ✅ Calculates network health score (0-100) based on multiple factors
- ✅ Frontend dashboard displays metrics with visual indicators and comparisons

**Important Note**: This is a **monitoring system** for **real water networks**. The only simulated component is the SCADA sensor readings (because real sensors aren't connected yet). EPANET performs real hydraulic analysis of the actual network to predict what values should be. When real SCADA sensors are connected, the monitoring service will automatically use real sensor data from the database.

