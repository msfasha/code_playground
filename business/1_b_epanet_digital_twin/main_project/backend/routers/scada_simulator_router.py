"""
API endpoints for SCADA Simulator.

Provides REST API for starting, stopping, and querying the simulator.
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Network, SCADAGenerationLog, SCADAReading
from services.scada_simulator_service import SCADASimulator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scada-simulator", tags=["scada-simulator"])

# Global simulator instance (only one network supported)
_simulator: Optional[SCADASimulator] = None


class StartSimulatorRequest(BaseModel):
    """Request model for starting simulator."""

    network_id: UUID = Field(..., description="UUID of the network to simulate")
    generation_rate_minutes: float = Field(
        5.0, ge=0.1, le=1440, description="Generation rate in minutes (0.1 to 1440)"
    )
    data_loss_proportion: float = Field(
        0.10, ge=0.0, le=1.0, description="Mean proportion of items to lose/exclude (0.0 to 1.0). Example: 0.10 means 10% lost, 90% kept"
    )
    data_loss_variance: float = Field(
        0.05, ge=0.0, le=0.5, description="Variance for randomizing data loss proportion (0.0 to 0.5). Applied to loss proportion, so actual loss varies around the mean"
    )
    delay_mean: float = Field(
        2.5, ge=0.0, description="Mean delay for timestamp distribution (minutes)"
    )
    delay_std_dev: float = Field(
        2.0, ge=0.0, description="Standard deviation for delays (minutes)"
    )
    delay_max: float = Field(
        10.0, ge=0.0, description="Maximum delay bound (minutes)"
    )
    pressure_noise_percent: float = Field(
        2.0, ge=0.0, le=50.0, description="Noise level for pressure sensors as percentage (0.0 to 50.0). Example: 2.0 means ±2% noise"
    )
    flow_noise_percent: float = Field(
        3.0, ge=0.0, le=50.0, description="Noise level for flow sensors as percentage (0.0 to 50.0). Example: 3.0 means ±3% noise"
    )
    tank_level_noise_percent: float = Field(
        1.0, ge=0.0, le=50.0, description="Noise level for tank level sensors as percentage (0.0 to 50.0). Example: 1.0 means ±1% noise"
    )


class StopSimulatorRequest(BaseModel):
    """Request model for stopping simulator."""

    network_id: Optional[UUID] = Field(
        None, description="UUID of network (optional, stops current simulator)"
    )


class ClearReadingsRequest(BaseModel):
    """Request model for clearing SCADA readings."""

    network_id: UUID = Field(..., description="UUID of network to clear readings for")


@router.post("/start")
async def start_simulator(request: StartSimulatorRequest, db: AsyncSession = Depends(get_db)):
    """
    Start the SCADA simulator.
    
    Validates that the network exists and has baseline data,
    then starts the simulator with the provided configuration.
    """
    global _simulator

    # Check if simulator is already running
    if _simulator and _simulator.status["status"] == "running":
        raise HTTPException(
            status_code=400, detail="Simulator is already running. Stop it first."
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

    # Validate delay parameters
    if request.delay_mean >= request.delay_max:
        raise HTTPException(
            status_code=400,
            detail="delay_mean must be less than delay_max",
        )

    try:
        # Create and start simulator
        _simulator = SCADASimulator(
            network_id=request.network_id,
            generation_rate_minutes=request.generation_rate_minutes,
            data_loss_proportion=request.data_loss_proportion,
            data_loss_variance=request.data_loss_variance,
            delay_mean=request.delay_mean,
            delay_std_dev=request.delay_std_dev,
            delay_max=request.delay_max,
            pressure_noise_percent=request.pressure_noise_percent,
            flow_noise_percent=request.flow_noise_percent,
            tank_level_noise_percent=request.tank_level_noise_percent,
        )

        await _simulator.start()

        return {
            "success": True,
            "status": _simulator.get_status(),
        }
    except Exception as e:
        logger.error(f"Failed to start simulator: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to start simulator: {str(e)}")


@router.post("/stop")
async def stop_simulator(request: StopSimulatorRequest):
    """
    Stop the SCADA simulator.
    
    Gracefully stops the running simulator and updates status.
    """
    global _simulator

    if not _simulator:
        raise HTTPException(status_code=400, detail="No simulator is running")

    if request.network_id and _simulator.network_id != request.network_id:
        raise HTTPException(
            status_code=400,
            detail=f"Simulator is running for a different network",
        )

    try:
        await _simulator.stop()
        return {"success": True, "message": "Simulator stopped"}
    except Exception as e:
        logger.error(f"Failed to stop simulator: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to stop simulator: {str(e)}")


@router.post("/clear-readings")
async def clear_readings(request: ClearReadingsRequest, db: AsyncSession = Depends(get_db)):
    """
    Clear all SCADA readings and generation logs for a network.
    
    Deletes all SCADAReading and SCADAGenerationLog records for the specified network.
    This is useful for resetting simulation data.
    """
    # Validate network exists
    stmt = select(Network).where(Network.id == request.network_id)
    result = await db.execute(stmt)
    network = result.scalar_one_or_none()

    if not network:
        raise HTTPException(status_code=404, detail=f"Network {request.network_id} not found")

    try:
        # Delete all SCADA readings for this network
        readings_delete_stmt = delete(SCADAReading).where(SCADAReading.network_id == request.network_id)
        readings_result = await db.execute(readings_delete_stmt)
        readings_count = readings_result.rowcount

        # Delete all generation logs for this network
        logs_delete_stmt = delete(SCADAGenerationLog).where(SCADAGenerationLog.network_id == request.network_id)
        logs_result = await db.execute(logs_delete_stmt)
        logs_count = logs_result.rowcount

        await db.commit()

        logger.info(
            f"Cleared {readings_count} readings and {logs_count} logs for network {request.network_id}"
        )

        return {
            "success": True,
            "message": f"Cleared {readings_count} readings and {logs_count} logs",
            "readings_deleted": readings_count,
            "logs_deleted": logs_count,
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to clear readings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to clear readings: {str(e)}")


@router.get("/status")
async def get_status():
    """
    Get current simulator status.
    
    Returns in-memory status including configuration, statistics,
    and current cycle information.
    """
    global _simulator

    if not _simulator:
        # Return stopped status if no simulator exists
        return {
            "status": "stopped",
            "network_id": None,
            "started_at": None,
            "last_generation_time": None,
            "total_readings_generated": 0,
            "configuration": None,
            "current_cycle": {
                "junctions_selected": 0,
                "pipes_selected": 0,
                "tanks_selected": 0,
                "readings_generated": 0,
            },
            "error": None,
        }

    status = _simulator.get_status()
    # Convert datetime objects to ISO format strings
    if status.get("started_at"):
        status["started_at"] = status["started_at"].isoformat()
    if status.get("last_generation_time"):
        status["last_generation_time"] = status["last_generation_time"].isoformat()

    return status


@router.get("/logs")
async def get_logs(
    network_id: UUID = Query(..., description="UUID of the network"),
    limit: int = Query(50, ge=1, le=1000, description="Number of logs to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get generation logs for a network.
    
    Returns recent generation cycle logs showing how many readings
    were generated and which items were selected.
    """
    # Query logs from database
    stmt = (
        select(SCADAGenerationLog)
        .where(SCADAGenerationLog.network_id == network_id)
        .order_by(SCADAGenerationLog.generation_timestamp.desc())
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(stmt)
    logs = result.scalars().all()

    # Count total logs
    count_stmt = select(SCADAGenerationLog).where(
        SCADAGenerationLog.network_id == network_id
    )
    count_result = await db.execute(count_stmt)
    total = len(count_result.scalars().all())

    # Format logs for response
    log_list = []
    for log in logs:
        log_list.append(
            {
                "id": log.id,
                "generation_timestamp": log.generation_timestamp.isoformat(),
                "readings_generated": log.readings_generated,
                "junctions_selected": log.junctions_selected,
                "pipes_selected": log.pipes_selected,
                "tanks_selected": log.tanks_selected,
                "created_at": log.created_at.isoformat(),
            }
        )

    return {
        "logs": log_list,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint.
    
    Verifies database connectivity and returns service health status.
    """
    try:
        # Try a simple database query
        await db.execute(select(1))
        return {
            "status": "healthy",
            "database_connected": True,
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {
            "status": "unhealthy",
            "database_connected": False,
            "error": str(e),
        }

