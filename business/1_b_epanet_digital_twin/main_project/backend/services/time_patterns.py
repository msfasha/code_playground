"""Time-of-day patterns for SCADA simulation."""
import numpy as np
from datetime import datetime, timedelta


def get_diurnal_multiplier(hour: float) -> float:
    """
    Get demand/flow multiplier based on time of day.
    
    Returns a multiplier (0.6 to 1.4) representing typical diurnal pattern:
    - Early morning (6am): Rising (0.8)
    - Morning peak (8am): High (1.4)
    - Midday (12pm): Medium (1.0)
    - Afternoon (2pm): Low (0.6)
    - Evening peak (7pm): High (1.3)
    - Night (11pm): Low (0.7)
    """
    # Normalize hour to 0-24
    hour = hour % 24
    
    # Define key points for diurnal pattern
    if 0 <= hour < 6:
        # Night: gradual decrease from 0.8 to 0.7
        return 0.8 - (hour / 6) * 0.1
    elif 6 <= hour < 8:
        # Morning rise: 0.7 to 1.4
        return 0.7 + ((hour - 6) / 2) * 0.7
    elif 8 <= hour < 10:
        # Morning peak: 1.4
        return 1.4
    elif 10 <= hour < 12:
        # Post-morning: 1.4 to 1.0
        return 1.4 - ((hour - 10) / 2) * 0.4
    elif 12 <= hour < 14:
        # Midday: 1.0 to 0.6
        return 1.0 - ((hour - 12) / 2) * 0.4
    elif 14 <= hour < 18:
        # Afternoon: 0.6 to 0.9
        return 0.6 + ((hour - 14) / 4) * 0.3
    elif 18 <= hour < 20:
        # Evening peak: 0.9 to 1.3
        return 0.9 + ((hour - 18) / 2) * 0.4
    elif 20 <= hour < 22:
        # Post-evening: 1.3 to 1.0
        return 1.3 - ((hour - 20) / 2) * 0.3
    else:
        # Late night: 1.0 to 0.8
        return 1.0 - ((hour - 22) / 2) * 0.2


def generate_time_range(start: datetime, end: datetime, interval_minutes: int = 1):
    """Generate time range with specified interval."""
    current = start
    while current <= end:
        yield current
        current += timedelta(minutes=interval_minutes)



