"""
SCADA Simulator Service.

Generates realistic sensor readings with configurable data loss,
timestamp delays, and diurnal patterns. Runs as an autonomous
asyncio background task.
"""
import asyncio
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from uuid import UUID

import numpy as np
from scipy.stats import truncnorm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import AsyncSessionLocal
from models import (
    BaselineData,
    NetworkItem,
    SCADAGenerationLog,
    SCADAReading,
)

from .time_patterns import get_diurnal_multiplier

logger = logging.getLogger(__name__)


class SCADASimulator:
    """
    SCADA Simulator that generates sensor readings autonomously.
    
    The simulator runs as a background asyncio task, generating readings
    at configurable intervals. It simulates data loss and transmission delays.
    """

    def __init__(
        self,
        network_id: UUID,
        generation_rate_minutes: float = 5.0,
        data_loss_proportion: float = 0.10,
        data_loss_variance: float = 0.05,
        delay_mean: float = 2.5,
        delay_std_dev: float = 2.0,
        delay_max: float = 10.0,
        pressure_noise_percent: float = 2.0,
        flow_noise_percent: float = 3.0,
        tank_level_noise_percent: float = 1.0,
    ):
        """
        Initialize SCADA simulator.
        
        Args:
            network_id: UUID of the network to simulate
            generation_rate_minutes: How often to generate readings (minutes)
            data_loss_proportion: Mean proportion of items to lose/exclude (0.0-1.0)
                Example: 0.10 means 10% of items are lost, 90% are kept
            data_loss_variance: Variance for randomizing data loss proportion (0.0-0.5)
                Applied to the loss proportion, so actual loss varies around the mean
            delay_mean: Mean delay for timestamp distribution (minutes)
            delay_std_dev: Standard deviation for delays (minutes)
            delay_max: Maximum delay bound (minutes)
            pressure_noise_percent: Noise level for pressure sensors as percentage (0.0-50.0)
                Example: 2.0 means ±2% noise (uniform distribution from -2% to +2%)
            flow_noise_percent: Noise level for flow sensors as percentage (0.0-50.0)
                Example: 3.0 means ±3% noise (uniform distribution from -3% to +3%)
            tank_level_noise_percent: Noise level for tank level sensors as percentage (0.0-50.0)
                Example: 1.0 means ±1% noise (uniform distribution from -1% to +1%)
        """
        self.network_id = network_id
        self.generation_rate_minutes = generation_rate_minutes
        self.data_loss_proportion = data_loss_proportion
        self.data_loss_variance = data_loss_variance
        self.delay_mean = delay_mean
        self.delay_std_dev = delay_std_dev
        self.delay_max = delay_max
        self.pressure_noise_percent = pressure_noise_percent
        self.flow_noise_percent = flow_noise_percent
        self.tank_level_noise_percent = tank_level_noise_percent

        # Background task
        self.task: Optional[asyncio.Task] = None

        # Status stored in memory
        self.status = {
            "status": "stopped",
            "network_id": str(network_id),
            "started_at": None,
            "last_generation_time": None,
            "total_readings_generated": 0,
            "configuration": {
                "generation_rate_minutes": generation_rate_minutes,
                "data_loss_proportion": data_loss_proportion,
                "data_loss_variance": data_loss_variance,
                "delay_mean": delay_mean,
                "delay_std_dev": delay_std_dev,
                "delay_max": delay_max,
                "pressure_noise_percent": pressure_noise_percent,
                "flow_noise_percent": flow_noise_percent,
                "tank_level_noise_percent": tank_level_noise_percent,
            },
            "current_cycle": {
                "junctions_selected": 0,
                "pipes_selected": 0,
                "tanks_selected": 0,
                "readings_generated": 0,
            },
            "error": None,
        }

        # Network data (loaded on start)
        self.baseline_data: Dict[str, Dict[str, float]] = {}  # {location_id: {sensor_type: value}}
        self.network_items: Dict[str, List[str]] = {
            "junction": [],
            "pipe": [],
            "tank": [],
        }

        # Truncated normal distribution for delays
        # Bounds: [0, delay_max], mean=delay_mean, std=delay_std_dev
        a = (0 - delay_mean) / delay_std_dev  # Lower bound in standard normal
        b = (delay_max - delay_mean) / delay_std_dev  # Upper bound in standard normal
        self.delay_distribution = truncnorm(a, b, loc=delay_mean, scale=delay_std_dev)

    async def load_network_data(self):
        """
        Load network items and baseline data from database.
        
        This must be called before starting the simulator.
        Raises exception if network or baseline data not found.
        """
        async with AsyncSessionLocal() as session:
            # Load network items (junctions, pipes, tanks)
            stmt = select(NetworkItem).where(NetworkItem.network_id == self.network_id)
            result = await session.execute(stmt)
            items = result.scalars().all()

            self.network_items = {"junction": [], "pipe": [], "tank": []}
            for item in items:
                if item.item_type in self.network_items:
                    self.network_items[item.item_type].append(item.item_id)

            if not any(self.network_items.values()):
                raise ValueError(f"No network items found for network {self.network_id}")

            # Load baseline data
            stmt = select(BaselineData).where(BaselineData.network_id == self.network_id)
            result = await session.execute(stmt)
            baseline_records = result.scalars().all()

            self.baseline_data = {}
            for record in baseline_records:
                location_id = record.location_id
                if location_id not in self.baseline_data:
                    self.baseline_data[location_id] = {}
                self.baseline_data[location_id][record.sensor_type] = record.baseline_value

            if not self.baseline_data:
                raise ValueError(f"No baseline data found for network {self.network_id}")

            logger.info(
                f"Loaded network data: {len(self.network_items['junction'])} junctions, "
                f"{len(self.network_items['pipe'])} pipes, {len(self.network_items['tank'])} tanks, "
                f"{len(self.baseline_data)} locations with baseline data"
            )

    async def start(self):
        """
        Start the simulator.
        
        Loads network data, creates background task, and starts generation loop.
        Sets status to "starting" then "running".
        
        Raises:
            ValueError: If network data or baseline not found
        """
        if self.status["status"] == "running":
            logger.warning("Simulator is already running")
            return

        try:
            self.status["status"] = "starting"
            self.status["error"] = None

            # Load network data
            await self.load_network_data()

            # Create and start background task
            self.task = asyncio.create_task(self._generation_loop())
            self.status["status"] = "running"
            self.status["started_at"] = datetime.now()

            logger.info(f"SCADA simulator started for network {self.network_id}")
        except Exception as e:
            self.status["status"] = "error"
            self.status["error"] = str(e)
            logger.error(f"Failed to start simulator: {e}", exc_info=True)
            raise

    async def stop(self):
        """
        Stop the simulator.
        
        Cancels the background task gracefully and updates status.
        """
        if self.status["status"] == "stopped":
            logger.warning("Simulator is already stopped")
            return

        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

        self.status["status"] = "stopped"
        logger.info(f"SCADA simulator stopped for network {self.network_id}")

    def get_status(self) -> dict:
        """
        Get current simulator status.
        
        Returns:
            Dictionary with current status, configuration, and statistics
        """
        return self.status.copy()

    def _sample_delay(self) -> float:
        """
        Sample a delay from truncated normal distribution.
        
        Returns:
            Delay in minutes (always positive, bounded by delay_max)
        """
        delay = self.delay_distribution.rvs()
        # Ensure non-negative (shouldn't happen, but safety check)
        return max(0.0, min(delay, self.delay_max))

    def _select_items(self, item_type: str, total_count: int) -> List[str]:
        """
        Randomly select items to keep (data loss simulation).
        
        The data_loss_proportion represents the proportion of items that are LOST.
        This method selects the items that are KEPT (1 - loss_proportion).
        The loss proportion varies randomly each cycle around the configured mean,
        using a normal distribution with the configured variance.
        
        Args:
            item_type: Type of item ("junction", "pipe", "tank")
            total_count: Total number of items of this type
            
        Returns:
            List of selected item IDs (items that are kept, not lost)
        """
        if total_count == 0:
            return []

        # Sample random loss proportion from normal distribution around configured mean
        # Bounded to [0.0, 1.0] to ensure valid proportion
        random_loss_proportion = random.gauss(self.data_loss_proportion, self.data_loss_variance)
        random_loss_proportion = max(0.0, min(1.0, random_loss_proportion))
        
        # Calculate proportion to keep (inverse of loss)
        # Example: if 10% lost, then 90% kept
        keep_proportion = 1.0 - random_loss_proportion
        
        # Calculate number of items to select (keep) based on keep proportion
        select_count = max(1, int(total_count * keep_proportion))
        all_items = self.network_items[item_type]
        return random.sample(all_items, min(select_count, len(all_items)))

    def _generate_reading(
        self, location_id: str, sensor_type: str, current_hour: float
    ) -> Optional[float]:
        """
        Generate a single sensor reading.
        
        Formula: baseline × pattern_multiplier × (1 + noise)
        
        Args:
            location_id: ID of the location (junction, pipe, or tank)
            sensor_type: Type of sensor ("pressure", "flow", "level")
            current_hour: Current hour of day (0-24) for diurnal pattern
            
        Returns:
            Generated reading value, or None if no baseline data
        """
        # Get baseline value
        if location_id not in self.baseline_data:
            return None
        if sensor_type not in self.baseline_data[location_id]:
            return None

        baseline = self.baseline_data[location_id][sensor_type]

        # Get diurnal pattern multiplier
        pattern_multiplier = get_diurnal_multiplier(current_hour)

        # Add noise based on sensor type (using configurable noise levels)
        if sensor_type == "pressure":
            noise_percent = self.pressure_noise_percent
        elif sensor_type == "flow":
            noise_percent = self.flow_noise_percent
        elif sensor_type == "level":
            noise_percent = self.tank_level_noise_percent
        else:
            noise_percent = self.pressure_noise_percent  # Default to pressure noise
        
        # Convert percentage to decimal and apply uniform distribution
        noise = random.uniform(-noise_percent / 100.0, noise_percent / 100.0)

        # Calculate reading
        value = baseline * pattern_multiplier * (1 + noise)
        return value

    async def _generation_loop(self):
        """
        Main generation loop (runs as background task).
        
        Generates readings at configured intervals, applies delays,
        and stores them in the database.
        """
        try:
            while True:
                generation_start = datetime.now()  # Use local time instead of UTC
                current_hour = generation_start.hour + generation_start.minute / 60.0

                # Select items (data loss simulation)
                selected_junctions = self._select_items("junction", len(self.network_items["junction"]))
                selected_pipes = self._select_items("pipe", len(self.network_items["pipe"]))
                selected_tanks = self._select_items("tank", len(self.network_items["tank"]))

                # Generate readings
                readings = []
                readings_count = 0

                # Generate pressure readings for selected junctions
                for junction_id in selected_junctions:
                    value = self._generate_reading(junction_id, "pressure", current_hour)
                    if value is not None:
                        delay_minutes = self._sample_delay()
                        timestamp = generation_start - timedelta(minutes=delay_minutes)
                        readings.append(
                            {
                                "network_id": self.network_id,
                                "timestamp": timestamp,
                                "sensor_id": f"PRESSURE_{junction_id}",
                                "sensor_type": "pressure",
                                "value": value,
                                "location_id": junction_id,
                            }
                        )
                        readings_count += 1

                # Generate flow readings for selected pipes
                for pipe_id in selected_pipes:
                    value = self._generate_reading(pipe_id, "flow", current_hour)
                    if value is not None:
                        delay_minutes = self._sample_delay()
                        timestamp = generation_start - timedelta(minutes=delay_minutes)
                        readings.append(
                            {
                                "network_id": self.network_id,
                                "timestamp": timestamp,
                                "sensor_id": f"FLOW_{pipe_id}",
                                "sensor_type": "flow",
                                "value": value,
                                "location_id": pipe_id,
                            }
                        )
                        readings_count += 1

                # Generate level readings for selected tanks
                for tank_id in selected_tanks:
                    value = self._generate_reading(tank_id, "level", current_hour)
                    if value is not None:
                        delay_minutes = self._sample_delay()
                        timestamp = generation_start - timedelta(minutes=delay_minutes)
                        readings.append(
                            {
                                "network_id": self.network_id,
                                "timestamp": timestamp,
                                "sensor_id": f"LEVEL_{tank_id}",
                                "sensor_type": "level",
                                "value": value,
                                "location_id": tank_id,
                            }
                        )
                        readings_count += 1

                # Store readings in database
                if readings:
                    async with AsyncSessionLocal() as session:
                        # Bulk insert readings
                        reading_objects = [SCADAReading(**reading) for reading in readings]
                        session.add_all(reading_objects)

                        # Insert generation log
                        log = SCADAGenerationLog(
                            network_id=self.network_id,
                            generation_timestamp=generation_start,
                            readings_generated=readings_count,
                            junctions_selected=len(selected_junctions),
                            pipes_selected=len(selected_pipes),
                            tanks_selected=len(selected_tanks),
                        )
                        session.add(log)

                        await session.commit()

                # Update status
                self.status["last_generation_time"] = generation_start
                self.status["total_readings_generated"] += readings_count
                self.status["current_cycle"] = {
                    "junctions_selected": len(selected_junctions),
                    "pipes_selected": len(selected_pipes),
                    "tanks_selected": len(selected_tanks),
                    "readings_generated": readings_count,
                }

                logger.info(
                    f"Generated {readings_count} readings: "
                    f"{len(selected_junctions)} junctions, "
                    f"{len(selected_pipes)} pipes, {len(selected_tanks)} tanks"
                )

                # Wait for next generation cycle
                await asyncio.sleep(self.generation_rate_minutes * 60)

        except asyncio.CancelledError:
            logger.info("Generation loop cancelled")
            raise
        except Exception as e:
            self.status["status"] = "error"
            self.status["error"] = str(e)
            logger.error(f"Error in generation loop: {e}", exc_info=True)

