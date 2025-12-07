"""
API endpoints for Monitoring Service.

Provides REST API for starting, stopping, and querying the monitoring service.
This router is completely separate from SCADA simulator router.
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Anomaly, ExpectedValue, Network, NetworkItem, SCADAReading
from services.monitoring_service import MonitoringService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])

# Global monitoring service instance (only one network supported)
_monitoring_service: Optional[MonitoringService] = None


class StartMonitoringRequest(BaseModel):
    """Request model for starting monitoring service."""

    network_id: UUID = Field(..., description="UUID of the network to monitor")
    monitoring_interval_minutes: float = Field(
        1.0, ge=0.1, le=1440, description="Monitoring interval in minutes (0.1 to 1440)"
    )
    time_window_minutes: float = Field(
        5.0, ge=0.1, le=60, description="Time window for querying SCADA readings in minutes (0.1 to 60)"
    )
    pressure_threshold_percent: float = Field(
        10.0, ge=0.0, le=100.0, description="Deviation threshold for pressure sensors (0.0 to 100.0)"
    )
    flow_threshold_percent: float = Field(
        15.0, ge=0.0, le=100.0, description="Deviation threshold for flow sensors (0.0 to 100.0)"
    )
    tank_level_threshold_percent: float = Field(
        5.0, ge=0.0, le=100.0, description="Deviation threshold for tank level sensors (0.0 to 100.0)"
    )
    enable_tank_feedback: bool = Field(
        True, description="Whether to update EPANET tank levels from SCADA readings"
    )


class StopMonitoringRequest(BaseModel):
    """Request model for stopping monitoring service."""

    network_id: Optional[UUID] = Field(
        None, description="UUID of network (optional, stops current monitoring service)"
    )


@router.post("/start")
async def start_monitoring(request: StartMonitoringRequest, db: AsyncSession = Depends(get_db)):
    """
    Start the monitoring service.
    
    Validates that the network exists and has baseline data,
    then starts the monitoring service with the provided configuration.
    
    The monitoring service will:
    - Load the network .inp file and initialize EPANET
    - Synchronize EPANET EPS to current real-time
    - Start monitoring loop that runs at the configured interval
    - Query SCADA readings from database and compare with EPANET predictions
    - Detect and store anomalies
    - Store expected values for historical analysis
    
    Request Body:
        - network_id: UUID of network to monitor
        - monitoring_interval_minutes: How often to run monitoring cycle (default: 1.0)
        - time_window_minutes: How far back to query SCADA readings (default: 5.0)
        - pressure_threshold_percent: Threshold for pressure sensors (default: 10.0)
        - flow_threshold_percent: Threshold for flow sensors (default: 15.0)
        - tank_level_threshold_percent: Threshold for tank level sensors (default: 5.0)
        - enable_tank_feedback: Whether to update EPANET from SCADA (default: True)
    
    Returns:
        JSON with success status and current monitoring service status
    """
    global _monitoring_service

    # Check if monitoring service is already running
    if _monitoring_service and _monitoring_service.status["status"] == "running":
        raise HTTPException(
            status_code=400, detail="Monitoring service is already running. Stop it first."
        )

    # Validate network exists
    stmt = select(Network).where(Network.id == request.network_id)
    result = await db.execute(stmt)
    network = result.scalar_one_or_none()

    if not network:
        raise HTTPException(status_code=404, detail=f"Network {request.network_id} not found")

    if not network.baseline_calculated_at:
        raise HTTPException(
            status_code=400,
            detail=f"Baseline not calculated for network {request.network_id}. Calculate baseline first.",
        )

    try:
        # Create and start monitoring service
        _monitoring_service = MonitoringService(
            network_id=request.network_id,
            monitoring_interval_minutes=request.monitoring_interval_minutes,
            time_window_minutes=request.time_window_minutes,
            pressure_threshold_percent=request.pressure_threshold_percent,
            flow_threshold_percent=request.flow_threshold_percent,
            tank_level_threshold_percent=request.tank_level_threshold_percent,
            enable_tank_feedback=request.enable_tank_feedback,
        )

        await _monitoring_service.start()

        return {
            "success": True,
            "status": _monitoring_service.get_status(),
        }
    except Exception as e:
        logger.error(f"Failed to start monitoring service: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to start monitoring service: {str(e)}"
        )


@router.post("/stop")
async def stop_monitoring(request: StopMonitoringRequest):
    """
    Stop the monitoring service.
    
    Gracefully stops the running monitoring service and updates status.
    Also closes EPANET instance.
    
    Request Body:
        - network_id: Optional UUID of network (if provided, validates it matches)
    
    Returns:
        JSON with success status and message
    """
    global _monitoring_service

    if not _monitoring_service:
        raise HTTPException(status_code=400, detail="No monitoring service is running")

    if request.network_id and _monitoring_service.network_id != request.network_id:
        raise HTTPException(
            status_code=400,
            detail=f"Monitoring service is running for a different network",
        )

    try:
        await _monitoring_service.stop()
        return {"success": True, "message": "Monitoring service stopped"}
    except Exception as e:
        logger.error(f"Failed to stop monitoring service: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to stop monitoring service: {str(e)}"
        )


@router.get("/status")
async def get_monitoring_status():
    """
    Get current monitoring service status.
    
    Returns the current status of the monitoring service including:
    - Status (stopped, starting, running, error)
    - Configuration (intervals, thresholds)
    - Statistics (anomalies detected, readings processed)
    - EPS synchronization status
    
    Returns:
        JSON with current monitoring service status
    """
    global _monitoring_service

    if not _monitoring_service:
        return {
            "status": "stopped",
            "network_id": None,
            "started_at": None,
            "last_check_time": None,
            "last_processed_timestamp": None,
            "total_anomalies_detected": 0,
            "configuration": None,
            "eps_synchronization": {
                "synced": False,
                "current_eps_hour": 0.0,
                "real_time_hour": 0.0,
                "elapsed_minutes": 0.0,
            },
            "last_check_stats": {
                "readings_processed": 0,
                "anomalies_found": 0,
                "comparison_time_ms": 0.0,
            },
            "error": None,
        }

    return _monitoring_service.get_status()


@router.get("/anomalies")
async def get_anomalies(
    network_id: UUID = Query(..., description="UUID of network"),
    severity: Optional[str] = Query(None, description="Filter by severity (medium, high, critical)"),
    start_time: Optional[str] = Query(None, description="Start time filter (ISO format)"),
    end_time: Optional[str] = Query(None, description="End time filter (ISO format)"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of anomalies to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
):
    """
    Query anomalies detected by monitoring service.
    
    Returns anomalies for a specific network with optional filters.
    Results are ordered by timestamp descending (most recent first).
    
    Query Parameters:
        - network_id: UUID of network (required)
        - severity: Filter by severity (optional: "medium", "high", "critical")
        - start_time: Start time filter in ISO format (optional)
        - end_time: End time filter in ISO format (optional)
        - limit: Maximum number of results (default: 100, max: 1000)
        - offset: Pagination offset (default: 0)
    
    Returns:
        JSON with list of anomalies and pagination info
    """
    from datetime import datetime

    # Build query
    stmt = select(Anomaly).where(Anomaly.network_id == network_id)

    # Apply filters
    if severity:
        stmt = stmt.where(Anomaly.severity == severity)

    if start_time:
        try:
            start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
            stmt = stmt.where(Anomaly.timestamp >= start_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_time format")

    if end_time:
        try:
            end_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
            stmt = stmt.where(Anomaly.timestamp <= end_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_time format")

    # Order by timestamp descending (most recent first)
    stmt = stmt.order_by(Anomaly.timestamp.desc())

    # Get total count (before pagination)
    count_stmt = select(Anomaly).where(Anomaly.network_id == network_id)
    if severity:
        count_stmt = count_stmt.where(Anomaly.severity == severity)
    if start_time:
        try:
            start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
            count_stmt = count_stmt.where(Anomaly.timestamp >= start_dt)
        except ValueError:
            pass
    if end_time:
        try:
            end_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
            count_stmt = count_stmt.where(Anomaly.timestamp <= end_dt)
        except ValueError:
            pass

    total_result = await db.execute(count_stmt)
    total = len(total_result.scalars().all())

    # Apply pagination
    stmt = stmt.offset(offset).limit(limit)

    # Execute query
    result = await db.execute(stmt)
    anomalies = result.scalars().all()

    # Convert to dictionaries
    anomalies_list = [
        {
            "id": a.id,
            "network_id": str(a.network_id),
            "timestamp": a.timestamp.isoformat(),
            "sensor_id": a.sensor_id,
            "sensor_type": a.sensor_type,
            "location_id": a.location_id,
            "actual_value": a.actual_value,
            "expected_value": a.expected_value,
            "deviation_percent": a.deviation_percent,
            "threshold_percent": a.threshold_percent,
            "severity": a.severity,
            "created_at": a.created_at.isoformat(),
        }
        for a in anomalies
    ]

    return {
        "anomalies": anomalies_list,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/dashboard-metrics")
async def get_dashboard_metrics(
    network_id: UUID = Query(..., description="UUID of network"),
    time_window_minutes: float = Query(5.0, ge=0.1, le=60, description="Time window for metrics in minutes"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get dashboard metrics for monitoring page.
    
    Returns aggregated metrics comparing SCADA readings vs EPANET predictions:
    - Total demand (SCADA vs Expected) - sum of flow readings
    - Average pressure (SCADA vs Expected)
    - Sensor coverage (active sensors / total sensors)
    - Anomaly statistics (count, rate, by severity)
    - Tank levels (actual vs expected)
    - Network health score (0-100)
    
    Query Parameters:
        - network_id: UUID of network (required)
        - time_window_minutes: How far back to query data (default: 5.0, max: 60)
    
    Returns:
        JSON with dashboard metrics
    """
    from datetime import datetime, timedelta
    from sqlalchemy import and_

    # Calculate time window
    end_time = datetime.now()
    start_time = end_time - timedelta(minutes=time_window_minutes)

    # Query recent SCADA readings
    scada_stmt = select(SCADAReading).where(
        and_(
            SCADAReading.network_id == network_id,
            SCADAReading.timestamp >= start_time,
            SCADAReading.timestamp <= end_time,
        )
    )
    scada_result = await db.execute(scada_stmt)
    scada_readings = scada_result.scalars().all()

    # Query recent expected values (matching time window)
    expected_stmt = select(ExpectedValue).where(
        and_(
            ExpectedValue.network_id == network_id,
            ExpectedValue.timestamp >= start_time,
            ExpectedValue.timestamp <= end_time,
        )
    )
    expected_result = await db.execute(expected_stmt)
    expected_values = expected_result.scalars().all()

    # Query recent anomalies
    anomaly_stmt = select(Anomaly).where(
        and_(
            Anomaly.network_id == network_id,
            Anomaly.timestamp >= start_time,
            Anomaly.timestamp <= end_time,
        )
    )
    anomaly_result = await db.execute(anomaly_stmt)
    anomalies = anomaly_result.scalars().all()

    # Get total sensor count from network items
    items_stmt = select(NetworkItem).where(NetworkItem.network_id == network_id)
    items_result = await db.execute(items_stmt)
    network_items = items_result.scalars().all()

    # Calculate metrics
    # 1. Total Demand (sum of flow readings)
    scada_flows = [r.value for r in scada_readings if r.sensor_type == "flow"]
    expected_flows = [ev.expected_value for ev in expected_values if ev.sensor_type == "flow"]
    
    total_scada_demand = sum(scada_flows) if scada_flows else 0.0
    total_expected_demand = sum(expected_flows) if expected_flows else 0.0
    demand_deviation_percent = (
        ((total_scada_demand - total_expected_demand) / total_expected_demand * 100)
        if total_expected_demand > 0
        else 0.0
    )

    # 2. Average Pressure
    scada_pressures = [r.value for r in scada_readings if r.sensor_type == "pressure"]
    expected_pressures = [ev.expected_value for ev in expected_values if ev.sensor_type == "pressure"]
    
    avg_scada_pressure = sum(scada_pressures) / len(scada_pressures) if scada_pressures else 0.0
    avg_expected_pressure = sum(expected_pressures) / len(expected_pressures) if expected_pressures else 0.0
    pressure_deviation_percent = (
        ((avg_scada_pressure - avg_expected_pressure) / avg_expected_pressure * 100)
        if avg_expected_pressure > 0
        else 0.0
    )

    # 3. Sensor Coverage
    # Count unique sensor locations in SCADA readings
    active_sensor_locations = set(r.location_id for r in scada_readings)
    total_sensors = len(network_items)
    sensor_coverage_percent = (len(active_sensor_locations) / total_sensors * 100) if total_sensors > 0 else 0.0

    # 4. Anomaly Statistics
    total_readings = len(scada_readings)
    anomaly_count = len(anomalies)
    anomaly_rate_percent = (anomaly_count / total_readings * 100) if total_readings > 0 else 0.0
    
    # Count by severity
    anomaly_by_severity = {
        "medium": len([a for a in anomalies if a.severity == "medium"]),
        "high": len([a for a in anomalies if a.severity == "high"]),
        "critical": len([a for a in anomalies if a.severity == "critical"]),
    }

    # 5. Tank Levels
    tank_levels = []
    scada_tank_readings = {r.location_id: r.value for r in scada_readings if r.sensor_type == "level"}
    expected_tank_values = {ev.location_id: ev.expected_value for ev in expected_values if ev.sensor_type == "level"}
    
    # Get all tank locations
    tank_locations = set(list(scada_tank_readings.keys()) + list(expected_tank_values.keys()))
    
    for tank_id in tank_locations:
        actual = scada_tank_readings.get(tank_id)
        expected = expected_tank_values.get(tank_id)
        if actual is not None or expected is not None:
            deviation = (
                ((actual - expected) / expected * 100)
                if expected and expected > 0
                else 0.0
            )
            tank_levels.append({
                "tank_id": tank_id,
                "actual_level": actual,
                "expected_level": expected,
                "deviation_percent": deviation,
            })

    # 6. Network Health Score (0-100)
    # Factors:
    # - Anomaly rate (lower is better): 40% weight
    # - Pressure deviation (lower is better): 30% weight
    # - Demand match (closer is better): 20% weight
    # - Sensor coverage (higher is better): 10% weight
    
    # Normalize anomaly rate (0% = 100 points, 50%+ = 0 points)
    anomaly_score = max(0, 100 - (anomaly_rate_percent * 2))
    
    # Normalize pressure deviation (0% = 100 points, 20%+ = 0 points)
    pressure_score = max(0, 100 - (abs(pressure_deviation_percent) * 5))
    
    # Normalize demand deviation (0% = 100 points, 30%+ = 0 points)
    demand_score = max(0, 100 - (abs(demand_deviation_percent) * 3.33))
    
    # Sensor coverage (direct percentage)
    coverage_score = sensor_coverage_percent
    
    # Weighted health score
    health_score = (
        anomaly_score * 0.4 +
        pressure_score * 0.3 +
        demand_score * 0.2 +
        coverage_score * 0.1
    )
    health_score = max(0, min(100, health_score))  # Clamp to 0-100

    # Determine health status
    if health_score >= 80:
        health_status = "excellent"
    elif health_score >= 60:
        health_status = "good"
    elif health_score >= 40:
        health_status = "fair"
    else:
        health_status = "poor"

    return {
        "time_window_minutes": time_window_minutes,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "demand": {
            "total_scada_demand": total_scada_demand,
            "total_expected_demand": total_expected_demand,
            "deviation_percent": demand_deviation_percent,
            "unit": "L/s",
        },
        "pressure": {
            "avg_scada_pressure": avg_scada_pressure,
            "avg_expected_pressure": avg_expected_pressure,
            "deviation_percent": pressure_deviation_percent,
            "unit": "m",
        },
        "sensor_coverage": {
            "active_sensors": len(active_sensor_locations),
            "total_sensors": total_sensors,
            "coverage_percent": sensor_coverage_percent,
        },
        "anomalies": {
            "total_count": anomaly_count,
            "rate_percent": anomaly_rate_percent,
            "by_severity": anomaly_by_severity,
            "total_readings": total_readings,
        },
        "tank_levels": tank_levels,
        "network_health": {
            "score": round(health_score, 1),
            "status": health_status,
            "breakdown": {
                "anomaly_score": round(anomaly_score, 1),
                "pressure_score": round(pressure_score, 1),
                "demand_score": round(demand_score, 1),
                "coverage_score": round(coverage_score, 1),
            },
        }
    }


@router.delete("/clear-data")
async def clear_monitoring_data(
    network_id: UUID = Query(..., description="UUID of network"),
    db: AsyncSession = Depends(get_db),
):
    """
    Clear monitoring results data for a network.
    
    This endpoint deletes all records from:
    - Anomalies
    - Expected Values
    
    NOTE: This does NOT delete:
    - Network Items (network topology)
    - Baseline Data (reference values for simulation)
    
    WARNING: This action cannot be undone!
    
    Query Parameters:
        - network_id: UUID of network (required)
    
    Returns:
        JSON with deletion counts for each table
    """
    from sqlalchemy import delete
    
    # Verify network exists
    stmt = select(Network).where(Network.id == network_id)
    result = await db.execute(stmt)
    network = result.scalar_one_or_none()
    
    if not network:
        raise HTTPException(status_code=404, detail=f"Network {network_id} not found")
    
    deletion_counts = {}
    
    try:
        # Delete anomalies
        stmt = delete(Anomaly).where(Anomaly.network_id == network_id)
        result = await db.execute(stmt)
        deletion_counts["anomalies"] = result.rowcount
        
        # Delete expected values
        stmt = delete(ExpectedValue).where(ExpectedValue.network_id == network_id)
        result = await db.execute(stmt)
        deletion_counts["expected_values"] = result.rowcount
        
        # Commit all deletions
        await db.commit()
        
        logger.info(
            f"Cleared monitoring results for network {network_id}: "
            f"{deletion_counts['anomalies']} anomalies, "
            f"{deletion_counts['expected_values']} expected values"
        )
        
        return {
            "success": True,
            "network_id": str(network_id),
            "deletion_counts": deletion_counts,
            "message": "Monitoring results cleared successfully"
        }
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error clearing monitoring data: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear monitoring data: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring service.
    
    Returns the health status of the monitoring service.
    
    Returns:
        JSON with health status
    """
    global _monitoring_service

    if not _monitoring_service:
        return {"status": "healthy", "monitoring_service_running": False}

    status = _monitoring_service.get_status()
    return {
        "status": "healthy",
        "monitoring_service_running": status["status"] == "running",
        "monitoring_service_status": status["status"],
    }

