import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
import re
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import Base, RoomDB, DATABASE_URL

# Paths
BASE_DIR = os.path.dirname(__file__)
ROOMS_JSON = os.path.join(BASE_DIR, 'data', 'rooms_and_labs.json')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def get_floor_level(floor_str):
    """Extracts the integer from floor strings like 'Fourth Floor'."""
    match = re.search(r'\d+', floor_str)
    if match:
        return int(match.group(0))
    # Simple mapping for text
    floor_map = {
        'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 
        'fifth': 5, 'sixth': 6, 'ground': 0
    }
    for key, value in floor_map.items():
        if key in floor_str.lower():
            return value
    return 0 # Default if no number or keyword found

# Migrate rooms
if os.path.exists(ROOMS_JSON):
    with open(ROOMS_JSON, 'r') as f:
        rooms_data = json.load(f)
    
    if session.query(RoomDB).count() == 0:
        for r in rooms_data:
            room = RoomDB(
                room_number=r['number'],
                floor_level=get_floor_level(r['floor']),
                capacity=r['capacity'],
                room_type=r['type']
            )
            session.add(room)
        
        try:
            session.commit()
            print(f"Successfully migrated {len(rooms_data)} rooms.")
        except Exception as e:
            print(f"An error occurred: {e}")
            session.rollback()
    else:
        print("Rooms table is not empty. Skipping migration.")
else:
    print(f"Rooms data file not found at {ROOMS_JSON}")

session.close() 