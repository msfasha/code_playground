import pandas as pd
import json


import os
json_path = os.path.join(os.path.dirname(__file__), "../backend/data/rooms_and_labs.json")
with open(json_path, "r", encoding="utf-8") as f:    
    rooms_and_labs_data = json.load(f)

# Convert to pandas DataFrame
df = pd.DataFrame(rooms_and_labs_data)

room_type_counts = df["type"].value_counts()
print("Room counts by type:")
for room_type, count in room_type_counts.items():
    print(f"{room_type}: {count}")

num1 = df[df["type"] == "Classroom"]["capacity"].sum()
num2 = df[df["type"] == "Lab"]["capacity"].sum()

print(f"Number of seats in classrooms: {num1}")
print(f"Number of seats in labs: {num2}")
print(f"Total number of seats: {num1 + num2}")