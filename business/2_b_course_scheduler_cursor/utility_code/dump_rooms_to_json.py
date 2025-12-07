import json

# Data structure of rooms and labs
rooms_and_labs = [
    {"floor": "Fourth Floor", "number": "9416", "type": "Lab", "capacity": 30},
    {"floor": "Fourth Floor", "number": "9420", "type": "Lab", "capacity": 30},
    {"floor": "Fourth Floor", "number": "9419", "type": "Lab", "capacity": 60},
    {"floor": "Fourth Floor", "number": "9421", "type": "Lab", "capacity": 60},
    {"floor": "Fourth Floor", "number": "9422", "type": "Classroom", "capacity": 40},
    {"floor": "Fourth Floor", "number": "9424", "type": "Classroom", "capacity": 58},
    {"floor": "Fourth Floor", "number": "9417", "type": "Classroom", "capacity": 40},
    {"floor": "Fourth Floor", "number": "9428", "type": "Classroom", "capacity": 60},
    
    {"floor": "Third Floor", "number": "9315", "type": "Classroom", "capacity": 42},
    {"floor": "Third Floor", "number": "9316", "type": "Classroom", "capacity": 60},
    {"floor": "Third Floor", "number": "9317", "type": "Classroom", "capacity": 40},
    {"floor": "Third Floor", "number": "9318", "type": "Classroom", "capacity": 60},
    {"floor": "Third Floor", "number": "9319", "type": "Classroom", "capacity": 60},
    {"floor": "Third Floor", "number": "9320", "type": "Classroom", "capacity": 40},
    {"floor": "Third Floor", "number": "9321", "type": "Classroom", "capacity": 60},
    {"floor": "Third Floor", "number": "9322", "type": "Classroom", "capacity": 60},
    {"floor": "Third Floor", "number": "9324", "type": "Classroom", "capacity": 60},

    {"floor": "Second Floor", "number": "9215", "type": "Lab", "capacity": 24},
    {"floor": "Second Floor", "number": "9216", "type": "Lab", "capacity": 36},
    {"floor": "Second Floor", "number": "9220", "type": "Lab", "capacity": 24},
    {"floor": "Second Floor", "number": "9217", "type": "Lab", "capacity": 36},
    {"floor": "Second Floor", "number": "9219", "type": "Classroom", "capacity": 40},
    {"floor": "Second Floor", "number": "9222", "type": "Classroom", "capacity": 40},
    {"floor": "Second Floor", "number": "9223", "type": "Classroom", "capacity": 40},
    {"floor": "Second Floor", "number": "9226", "type": "Classroom", "capacity": 40},
    {"floor": "Second Floor", "number": "9230", "type": "Classroom", "capacity": 40},

    {"floor": "First Floor", "number": "9115", "type": "Lab", "capacity": 24},
    {"floor": "First Floor", "number": "9116", "type": "Lab", "capacity": 21},
    {"floor": "First Floor", "number": "9118", "type": "Lab", "capacity": 24},
    {"floor": "First Floor", "number": "9120", "type": "Lab", "capacity": 24},
    {"floor": "First Floor", "number": "9117", "type": "Classroom", "capacity": 42},
    {"floor": "First Floor", "number": "9119", "type": "Classroom", "capacity": 60},
    {"floor": "First Floor", "number": "9121", "type": "Classroom", "capacity": 60},
    {"floor": "First Floor", "number": "9122", "type": "Classroom", "capacity": 40},
    {"floor": "First Floor", "number": "9124", "type": "Classroom", "capacity": 60},
    {"floor": "First Floor", "number": "9126", "type": "Classroom", "capacity": 60},

    {"floor": "Ground Floor", "number": "9001", "type": "Lab", "capacity": 22},
    {"floor": "Ground Floor", "number": "9002", "type": "Lab", "capacity": 22},
    {"floor": "Ground Floor", "number": "9003", "type": "Lab", "capacity": 25},
    {"floor": "Ground Floor", "number": "9004", "type": "Lab", "capacity": 24},
]

# Save to JSON file
json_path = "rooms_and_labs.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(rooms_and_labs, f, ensure_ascii=False, indent=4)

