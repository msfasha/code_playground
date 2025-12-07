"""
API endpoints for network management.

Handles network file upload, parsing, and baseline calculation.
"""
import logging
import os
import shutil
from datetime import datetime
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import BaselineData, Network, NetworkItem

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/network", tags=["network"])

# Directory to store uploaded network files
NETWORKS_DIR = Path("networks")
NETWORKS_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_network(
    file: UploadFile = File(...), db: AsyncSession = Depends(get_db)
):
    """
    Upload and store a network .inp file.
    
    Saves the file to disk and creates a Network record in the database.
    Returns the network ID for use in subsequent operations.
    """
    # Validate file extension
    if not file.filename or not file.filename.lower().endswith(".inp"):
        raise HTTPException(status_code=400, detail="File must be a .inp file")

    try:
        # Generate unique network ID
        network_id = uuid4()

        # Save file to disk
        file_path = NETWORKS_DIR / f"{network_id}.inp"
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Create network record
        network = Network(
            id=network_id,
            name=file.filename,
            file_path=str(file_path),
            uploaded_at=datetime.now(),  # Use local time instead of UTC
        )
        db.add(network)
        await db.commit()
        await db.refresh(network)

        logger.info(f"Network uploaded: {network_id} - {file.filename}")

        return {"network_id": str(network_id), "name": file.filename}
    except Exception as e:
        logger.error(f"Failed to upload network: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload network: {str(e)}")


@router.post("/{network_id}/baseline")
async def calculate_baseline(
    network_id: UUID, db: AsyncSession = Depends(get_db)
):
    """
    Calculate baseline values for a network.
    
    Runs an EPANET simulation to extract baseline pressures, flows, and tank levels.
    Stores the baseline data and network items in the database.
    """
    try:
        # Get network from database
        stmt = select(Network).where(Network.id == network_id)
        result = await db.execute(stmt)
        network = result.scalar_one_or_none()

        if not network:
            raise HTTPException(status_code=404, detail=f"Network {network_id} not found")

        # Check if baseline already calculated
        if network.baseline_calculated_at:
            logger.info(f"Baseline already calculated for network {network_id}")
            return {
                "success": True,
                "message": "Baseline already calculated",
                "network_id": str(network_id),
            }

        # Load network file using epyt
        try:
            from epyt import epanet

            # Open network file
            en = epanet(str(network.file_path))

            # Get network structure
            junctions = en.getNodeJunctionIndex()
            tanks = en.getNodeTankIndex()
            pipes = en.getLinkPipeIndex()

            # Store network items
            network_items = []

            # Store junctions
            for junc_idx in junctions:
                junc_id = en.getNodeNameID(junc_idx)
                network_items.append(
                    NetworkItem(
                        network_id=network_id,
                        item_type="junction",
                        item_id=junc_id,
                        properties=None,
                    )
                )

            # Store tanks
            for tank_idx in tanks:
                tank_id = en.getNodeNameID(tank_idx)
                network_items.append(
                    NetworkItem(
                        network_id=network_id,
                        item_type="tank",
                        item_id=tank_id,
                        properties=None,
                    )
                )

            # Store pipes
            for pipe_idx in pipes:
                pipe_id = en.getLinkNameID(pipe_idx)
                network_items.append(
                    NetworkItem(
                        network_id=network_id,
                        item_type="pipe",
                        item_id=pipe_id,
                        properties=None,
                    )
                )

            db.add_all(network_items)

            # Run hydraulic simulation to get baseline values
            en.solveCompleteHydraulics()

            # Get pressures and flows - epyt returns arrays with 1-based indexing
            all_pressures = en.getNodePressure()  # Returns array/list of all node pressures
            all_flows = en.getLinkFlows()  # Returns array/list of all link flows

            # Extract baseline data
            baseline_records = []

            # Get pressures for junctions
            # epyt node indices are 1-based, array indices are 0-based
            for junc_idx in junctions:
                junc_id = en.getNodeNameID(junc_idx)
                # Convert to array index (1-based to 0-based)
                pressure = all_pressures[junc_idx - 1]
                baseline_records.append(
                    BaselineData(
                        network_id=network_id,
                        location_id=junc_id,
                        location_type="junction",
                        sensor_type="pressure",
                        baseline_value=float(pressure),
                    )
                )

            # Get pressures and levels for tanks
            for tank_idx in tanks:
                tank_id = en.getNodeNameID(tank_idx)
                # Get pressure (convert 1-based to 0-based index)
                pressure = all_pressures[tank_idx - 1]
                baseline_records.append(
                    BaselineData(
                        network_id=network_id,
                        location_id=tank_id,
                        location_type="tank",
                        sensor_type="pressure",
                        baseline_value=float(pressure),
                    )
                )
                # Get initial tank level
                try:
                    level = en.getNodeTankInitialLevel(tank_idx)
                except Exception:
                    # Fallback: try to get elevation
                    try:
                        elevations = en.getNodeElevations()
                        level = float(elevations[tank_idx - 1]) if isinstance(elevations, (list, tuple)) else float(pressure)
                    except Exception:
                        # Final fallback: use pressure as level estimate
                        level = float(pressure)
                baseline_records.append(
                    BaselineData(
                        network_id=network_id,
                        location_id=tank_id,
                        location_type="tank",
                        sensor_type="level",
                        baseline_value=float(level),
                    )
                )

            # Get flows for pipes
            # epyt link indices are 1-based, array indices are 0-based
            for pipe_idx in pipes:
                pipe_id = en.getLinkNameID(pipe_idx)
                # Convert to array index (1-based to 0-based)
                flow = all_flows[pipe_idx - 1]
                baseline_records.append(
                    BaselineData(
                        network_id=network_id,
                        location_id=pipe_id,
                        location_type="pipe",
                        sensor_type="flow",
                        baseline_value=float(flow),
                    )
                )

            db.add_all(baseline_records)

            # Update network baseline timestamp
            network.baseline_calculated_at = datetime.now()  # Use local time instead of UTC

            await db.commit()

            # Close EPANET
            en.unload()

            logger.info(
                f"Baseline calculated for network {network_id}: "
                f"{len(network_items)} items, {len(baseline_records)} baseline values"
            )

            return {
                "success": True,
                "message": "Baseline calculated successfully",
                "network_id": str(network_id),
                "items_count": len(network_items),
                "baseline_count": len(baseline_records),
            }

        except ImportError:
            raise HTTPException(
                status_code=500,
                detail="epyt library not available. Please install it: pip install epyt",
            )
        except Exception as e:
            logger.error(f"Failed to calculate baseline: {e}", exc_info=True)
            raise HTTPException(
                status_code=500, detail=f"Failed to calculate baseline: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in baseline calculation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

