import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import Base, CourseDB, SemesterDB, semester_courses, DATABASE_URL

# Paths
BASE_DIR = os.path.dirname(__file__)
COURSES_JSON = os.path.abspath(os.path.join(BASE_DIR, 'data', 'courses.json'))
SEMESTERS_JSON = os.path.abspath(os.path.join(BASE_DIR, 'data', 'semesters.json'))

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Migrate courses
if os.path.exists(COURSES_JSON):
    with open(COURSES_JSON, 'r') as f:
        courses = json.load(f)
    if session.query(CourseDB).count() == 0:
        for c in courses:
            course = CourseDB(
                course_code=c['course_code'],
                course_title=c['course_title'],
                course_room_type=c['course_type'],
                course_type='On-Premise',
                level=c.get('level'),
                department=c['department']
            )
            session.add(course)
        session.commit()
        print(f"Migrated {len(courses)} courses.")
    else:
        print("Courses table is not empty. Skipping courses migration.")
else:
    print("courses.json not found.")

# Migrate semesters
if os.path.exists(SEMESTERS_JSON):
    with open(SEMESTERS_JSON, 'r') as f:
        semesters = json.load(f)
    if session.query(SemesterDB).count() == 0:
        for s in semesters:
            semester = SemesterDB(
                semester_code=s['semester_code'],
                start_date=s.get('start_date'),
                end_date=s.get('end_date'),
                mid_exam_date=s.get('mid_exam_date'),
                final_exam_date=s.get('final_exam_date')
            )
            # Attach courses
            if s.get('courses'):
                semester.courses = session.query(CourseDB).filter(CourseDB.course_code.in_(s['courses'])).all()
            session.add(semester)
        session.commit()
        print(f"Migrated {len(semesters)} semesters.")
    else:
        print("Semesters table is not empty. Skipping semesters migration.")
else:
    print("semesters.json not found.")

session.close() 