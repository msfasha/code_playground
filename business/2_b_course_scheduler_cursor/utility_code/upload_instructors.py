import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import Base, InstructorDB, CourseDB, DATABASE_URL

# Paths
BASE_DIR = os.path.dirname(__file__)
INSTRUCTORS_JSON = os.path.abspath(os.path.join(BASE_DIR, 'data', 'instructors.json'))

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Migrate instructors
if os.path.exists(INSTRUCTORS_JSON):
    with open(INSTRUCTORS_JSON, 'r', encoding='utf-8') as f:
        instructors = json.load(f)
    
    if session.query(InstructorDB).count() == 0:
        for instructor_data in instructors:
            # Create instructor
            instructor = InstructorDB(
                name=instructor_data['name'],
                department=instructor_data['department']
            )
            session.add(instructor)
            session.flush()  # Flush to get the ID
            
            # Attach courses if they exist
            if instructor_data.get('course_codes'):
                courses = session.query(CourseDB).filter(
                    CourseDB.course_code.in_(instructor_data['course_codes'])
                ).all()
                instructor.courses = courses
            
        session.commit()
        print(f"Migrated {len(instructors)} instructors.")
    else:
        print("Instructors table is not empty. Skipping instructors migration.")
else:
    print("instructors.json not found.")

session.close() 