import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import Base, InstructorDB, DATABASE_URL

# Paths
BASE_DIR = os.path.dirname(__file__)
INSTRUCTORS_JSON = os.path.abspath(os.path.join(BASE_DIR, 'data', 'instructors.json'))

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Fetch all instructors with their courses
instructors = session.query(InstructorDB).all()

# Convert to JSON format
instructors_data = []
for instructor in instructors:
    instructor_dict = {
        "id": instructor.id,
        "name": instructor.name,
        "department": instructor.department,
        "course_codes": [course.course_code for course in instructor.courses]
    }
    instructors_data.append(instructor_dict)

# Save as JSON
with open(INSTRUCTORS_JSON, "w", encoding="utf-8") as json_file:
    json.dump(instructors_data, json_file, indent=4, ensure_ascii=False)

print(f"Dumped {len(instructors_data)} instructors to {INSTRUCTORS_JSON}")

session.close() 