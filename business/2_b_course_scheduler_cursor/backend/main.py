import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, String, Integer, Table, ForeignKey, Date, Time
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from sqlalchemy.exc import IntegrityError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = f"sqlite:///" + os.path.join(os.path.dirname(__file__), "scheduler.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Association table for many-to-many relationship
semester_courses = Table(
    'semester_courses', Base.metadata,
    Column('semester_code', String, ForeignKey('semesters.semester_code'), primary_key=True),
    Column('course_code', String, ForeignKey('courses.course_code'), primary_key=True),
    Column('instructor_id', Integer, ForeignKey('instructors.id')),
    Column('room_number', String),
    Column('students_capacity', Integer),
    Column('registered_students', Integer)
)

# New table for lecture schedules
lecture_schedules = Table(
    'lecture_schedules', Base.metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('semester_code', String, ForeignKey('semesters.semester_code')),
    Column('course_code', String, ForeignKey('courses.course_code')),
    Column('day_of_week', String),
    Column('start_time', String),
    Column('duration', Integer)
)

# Association table for instructor-default-courses relationship
instructor_default_courses = Table(
    'instructor_default_courses', Base.metadata,
    Column('instructor_id', Integer, ForeignKey('instructors.id'), primary_key=True),
    Column('course_code', String, ForeignKey('courses.course_code'), primary_key=True)
)

class CourseDB(Base):
    __tablename__ = 'courses'
    course_code = Column(String, primary_key=True, index=True)
    course_title = Column(String)
    course_room_type = Column(String)
    course_type = Column(String)
    level = Column(Integer)
    department = Column(String)

class SemesterDB(Base):
    __tablename__ = 'semesters'
    semester_code = Column(String, primary_key=True, index=True)
    start_date = Column(String)
    end_date = Column(String)
    mid_exam_date = Column(String)
    final_exam_date = Column(String)
    courses = relationship('CourseDB', secondary=semester_courses, backref='semesters')

class RoomDB(Base):
    __tablename__ = 'rooms'
    room_number = Column(String, primary_key=True, index=True)
    floor_level = Column(Integer)
    capacity = Column(Integer)
    room_type = Column(String)

class InstructorDB(Base):
    __tablename__ = 'instructors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    courses = relationship('CourseDB', secondary=instructor_default_courses, backref='instructors')

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Course(BaseModel):
    course_code: str
    course_title: str
    course_room_type: str
    course_type: str
    level: Optional[int]
    department: str
    class Config:
        orm_mode = True

class Semester(BaseModel):
    semester_code: str
    courses: List[str]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    mid_exam_date: Optional[str] = None
    final_exam_date: Optional[str] = None
    class Config:
        orm_mode = True

class Room(BaseModel):
    room_number: str
    floor_level: int
    capacity: int
    room_type: str
    class Config:
        orm_mode = True

class InstructorCreate(BaseModel):
    name: str
    department: str
    course_codes: Optional[List[str]] = []

class Instructor(InstructorCreate):
    id: int
    course_codes: list[str] = []
    class Config:
        from_attributes = True

    @staticmethod
    def from_orm_with_courses(obj):
        # obj is an InstructorDB instance
        data = Instructor.from_orm(obj)
        data.course_codes = [c.course_code for c in obj.courses]
        return data

class LectureSchedule(BaseModel):
    day_of_week: str
    start_time: str
    duration: int
    class Config:
        orm_mode = True

class CourseAssignment(BaseModel):
    course_code: str
    instructor_id: Optional[int] = None
    instructor: Optional[Instructor] = None
    room_number: Optional[str] = None
    students_capacity: Optional[int] = None
    registered_students: Optional[int] = None
    lecture_schedules: Optional[List[LectureSchedule]] = []

class SemesterWithAssignments(BaseModel):
    semester_code: str
    course_assignments: List[CourseAssignment]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    mid_exam_date: Optional[str] = None
    final_exam_date: Optional[str] = None
    class Config:
        orm_mode = True

@app.get("/courses", response_model=List[Course])
def get_courses(db: Session = Depends(get_db)):
    return db.query(CourseDB).all()

@app.post("/courses", status_code=201)
def add_course(course: Course, db: Session = Depends(get_db)):
    db_course = CourseDB(**course.dict())
    db.add(db_course)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Course code already exists")
    return {"message": "Course added"}

@app.put("/courses/{course_code}")
def update_course(course_code: str, course: Course, db: Session = Depends(get_db)):
    db_course = db.query(CourseDB).filter(CourseDB.course_code == course_code).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    for field, value in course.dict().items():
        setattr(db_course, field, value)
    db.commit()
    return {"message": "Course updated"}

@app.delete("/courses/{course_code}")
def delete_course(course_code: str, db: Session = Depends(get_db)):
    db_course = db.query(CourseDB).filter(CourseDB.course_code == course_code).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted"}

@app.get("/semesters", response_model=List[SemesterWithAssignments])
def get_semesters(db: Session = Depends(get_db)):
    semesters = db.query(SemesterDB).all()
    result = []
    for s in semesters:
        course_assignments = []
        for course in s.courses:
            assignment = db.execute(
                semester_courses.select().where(
                    (semester_courses.c.semester_code == s.semester_code) &
                    (semester_courses.c.course_code == course.course_code)
                )
            ).first()
            instructor = None
            if assignment and assignment.instructor_id:
                instructor_obj = db.query(InstructorDB).filter(InstructorDB.id == assignment.instructor_id).first()
                if instructor_obj:
                    instructor = Instructor.from_orm_with_courses(instructor_obj)
            # Fetch lecture schedules for this course in this semester
            schedules = db.execute(
                lecture_schedules.select().where(
                    (lecture_schedules.c.semester_code == s.semester_code) &
                    (lecture_schedules.c.course_code == course.course_code)
                )
            ).fetchall()
            lecture_schedules_list = [LectureSchedule(
                day_of_week=sched.day_of_week,
                start_time=sched.start_time,
                duration=sched.duration
            ) for sched in schedules]
            course_assignments.append(CourseAssignment(
                course_code=course.course_code,
                instructor_id=assignment.instructor_id if assignment else None,
                instructor=instructor,
                room_number=assignment.room_number if assignment else None,
                students_capacity=assignment.students_capacity if assignment else None,
                registered_students=assignment.registered_students if assignment else None,
                lecture_schedules=lecture_schedules_list
            ))
        result.append(SemesterWithAssignments(
            semester_code=s.semester_code,
            course_assignments=course_assignments,
            start_date=s.start_date,
            end_date=s.end_date,
            mid_exam_date=s.mid_exam_date,
            final_exam_date=s.final_exam_date
        ))
    return result

@app.post("/semesters", status_code=201)
def add_semester(semester: SemesterWithAssignments, db: Session = Depends(get_db)):
    if db.query(SemesterDB).filter(SemesterDB.semester_code == semester.semester_code).first():
        raise HTTPException(status_code=400, detail="Semester code already exists")
    db_semester = SemesterDB(
        semester_code=semester.semester_code,
        start_date=semester.start_date,
        end_date=semester.end_date,
        mid_exam_date=semester.mid_exam_date,
        final_exam_date=semester.final_exam_date
    )
    
    # First, add the semester to get it committed
    db.add(db_semester)
    db.commit()
    db.refresh(db_semester)
    
    # Now handle course assignments
    for assignment in semester.course_assignments:
        course = db.query(CourseDB).filter(CourseDB.course_code == assignment.course_code).first()
        if course:
            # Add course to semester relationship
            db_semester.courses.append(course)
            
            # Update the semester_courses table with additional data
            db.execute(
                semester_courses.update().where(
                    (semester_courses.c.semester_code == semester.semester_code) &
                    (semester_courses.c.course_code == assignment.course_code)
                ).values(
                    instructor_id=assignment.instructor_id,
                    room_number=assignment.room_number,
                    students_capacity=assignment.students_capacity,
                    registered_students=assignment.registered_students
                )
            )
            
            # Insert lecture schedules
            if assignment.lecture_schedules:
                for sched in assignment.lecture_schedules:
                    db.execute(
                        lecture_schedules.insert().values(
                            semester_code=semester.semester_code,
                            course_code=assignment.course_code,
                            day_of_week=sched.day_of_week,
                            start_time=sched.start_time,
                            duration=sched.duration
                        )
                    )
    
    db.commit()
    return {"message": "Semester added"}

@app.put("/semesters/{semester_code}")
def update_semester(semester_code: str, semester: SemesterWithAssignments, db: Session = Depends(get_db)):
    db_semester = db.query(SemesterDB).filter(SemesterDB.semester_code == semester_code).first()
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    
    # Update semester basic info
    db_semester.start_date = semester.start_date
    db_semester.end_date = semester.end_date
    db_semester.mid_exam_date = semester.mid_exam_date
    db_semester.final_exam_date = semester.final_exam_date
    
    # Clear existing course assignments and lecture schedules
    db.execute(
        semester_courses.delete().where(semester_courses.c.semester_code == semester_code)
    )
    db.execute(
        lecture_schedules.delete().where(lecture_schedules.c.semester_code == semester_code)
    )
    db_semester.courses = []
    
    # Add new course assignments
    for assignment in semester.course_assignments:
        course = db.query(CourseDB).filter(CourseDB.course_code == assignment.course_code).first()
        if course:
            # Add course to semester relationship
            db_semester.courses.append(course)
            
            # Insert additional assignment data
            db.execute(
                semester_courses.insert().values(
                    semester_code=semester_code,
                    course_code=assignment.course_code,
                    instructor_id=assignment.instructor_id,
                    room_number=assignment.room_number,
                    students_capacity=assignment.students_capacity,
                    registered_students=assignment.registered_students
                )
            )
            
            # Insert lecture schedules
            if assignment.lecture_schedules:
                for sched in assignment.lecture_schedules:
                    db.execute(
                        lecture_schedules.insert().values(
                            semester_code=semester_code,
                            course_code=assignment.course_code,
                            day_of_week=sched.day_of_week,
                            start_time=sched.start_time,
                            duration=sched.duration
                        )
                    )
    
    db.commit()
    return {"message": "Semester updated"}

@app.delete("/semesters/{semester_code}")
def delete_semester(semester_code: str, db: Session = Depends(get_db)):
    db_semester = db.query(SemesterDB).filter(SemesterDB.semester_code == semester_code).first()
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    
    # Delete all course assignments for this semester
    db.execute(
        semester_courses.delete().where(semester_courses.c.semester_code == semester_code)
    )
    
    # Delete all lecture schedules for this semester
    db.execute(
        lecture_schedules.delete().where(lecture_schedules.c.semester_code == semester_code)
    )
    
    # Clear the courses relationship
    db_semester.courses = []
    
    # Delete the semester record
    db.delete(db_semester)
    db.commit()
    return {"message": "Semester deleted"}

@app.get("/rooms", response_model=List[Room])
def get_rooms(db: Session = Depends(get_db)):
    return db.query(RoomDB).all()

@app.post("/rooms", status_code=201)
def add_room(room: Room, db: Session = Depends(get_db)):
    db_room = RoomDB(**room.dict())
    db.add(db_room)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Room number already exists")
    return {"message": "Room added"}

@app.put("/rooms/{room_number}")
def update_room(room_number: str, room: Room, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.room_number == room_number).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    db_room.floor_level = room.floor_level
    db_room.capacity = room.capacity
    db_room.room_type = room.room_type
    db.commit()
    return {"message": "Room updated"}

@app.delete("/rooms/{room_number}")
def delete_room(room_number: str, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.room_number == room_number).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(db_room)
    db.commit()
    return {"message": "Room deleted"}

@app.get("/instructors", response_model=List[Instructor])
def get_instructors(db: Session = Depends(get_db), department: Optional[str] = None):
    query = db.query(InstructorDB)
    if department:
        query = query.filter(InstructorDB.department == department)
    instructors = query.all()
    return [Instructor.from_orm_with_courses(inst) for inst in instructors]

@app.post("/instructors", status_code=201)
def add_instructor(instructor: InstructorCreate, db: Session = Depends(get_db)):
    db_instructor = InstructorDB(name=instructor.name, department=instructor.department)
    db.add(db_instructor)
    db.commit()
    if instructor.course_codes:
        courses = db.query(CourseDB).filter(CourseDB.course_code.in_(instructor.course_codes)).all()
        db_instructor.courses = courses
        db.commit()
    return {"message": "Instructor added"}

@app.put("/instructors/{instructor_id}")
def update_instructor(instructor_id: int, instructor: InstructorCreate, db: Session = Depends(get_db)):
    db_instructor = db.query(InstructorDB).filter(InstructorDB.id == instructor_id).first()
    if not db_instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    db_instructor.name = instructor.name
    db_instructor.department = instructor.department
    if instructor.course_codes is not None:
        db_instructor.courses.clear()
        courses = db.query(CourseDB).filter(CourseDB.course_code.in_(instructor.course_codes)).all()
        db_instructor.courses = courses
    db.commit()
    db.refresh(db_instructor)
    return {"message": "Instructor updated"}

@app.delete("/instructors/{instructor_id}")
def delete_instructor(instructor_id: int, db: Session = Depends(get_db)):
    db_instructor = db.query(InstructorDB).filter(InstructorDB.id == instructor_id).first()
    if not db_instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    db.delete(db_instructor)
    db.commit()
    return {"message": "Instructor deleted"}

@app.get("/instructors/{instructor_id}/courses", response_model=List[Course])
def get_instructor_courses(instructor_id: int, db: Session = Depends(get_db)):
    instructor = db.query(InstructorDB).filter(InstructorDB.id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    return instructor.courses

@app.put("/instructors/{instructor_id}/courses")
def update_instructor_courses(instructor_id: int, course_codes: List[str], db: Session = Depends(get_db)):
    instructor = db.query(InstructorDB).filter(InstructorDB.id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    courses = db.query(CourseDB).filter(CourseDB.course_code.in_(course_codes)).all()
    instructor.courses = courses
    db.commit()
    return {"message": "Instructor courses updated"}

@app.get("/")
def index():
    return {"message": "Courses API is running!"} 