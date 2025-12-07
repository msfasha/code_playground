import sys
import json
import os

courses = []

class Course:
    def __init__(self, course_id, name, level, department):
        self.course_id = course_id
        self.name = name
        self.level = level
        self.department = department

    def __str__(self):
        return f"ID: {self.course_id}, Name: {self.name}, Level: {self.level}, Department: {self.department}"

COURSES_FILE = "courses.json"

def load_courses():
    if os.path.exists(COURSES_FILE):
        with open(COURSES_FILE, "r") as f:
            data = json.load(f)
            for item in data:
                courses.append(Course(**item))

def save_courses():
    with open(COURSES_FILE, "w") as f:
        json.dump([c.__dict__ for c in courses], f, indent=2)

def add_course():
    course_id = input("Enter course ID: ")
    name = input("Enter course name: ")
    level = input("Enter course level/year: ")
    department = input("Enter course department: ")
    courses.append(Course(course_id, name, level, department))
    save_courses()
    print("Course added.")

def view_courses():
    if not courses:
        print("No courses available.")
    for c in courses:
        print(c)

def update_course():
    course_id = input("Enter course ID to update: ")
    for c in courses:
        if c.course_id == course_id:
            c.name = input(f"Enter new name (current: {c.name}): ") or c.name
            c.level = input(f"Enter new level/year (current: {c.level}): ") or c.level
            c.department = input(f"Enter new department (current: {c.department}): ") or c.department
            print("Course updated.")
            save_courses()
            return
    print("Course not found.")

def delete_course():
    course_id = input("Enter course ID to delete: ")
    for i, c in enumerate(courses):
        if c.course_id == course_id:
            del courses[i]
            save_courses()
            print("Course deleted.")
            return
    print("Course not found.")

def main():
    load_courses()
    while True:
        print("\n1. Add Course\n2. View Courses\n3. Update Course\n4. Delete Course\n5. Exit")
        choice = input("Choose an option: ")
        if choice == '1':
            add_course()
        elif choice == '2':
            view_courses()
        elif choice == '3':
            update_course()
        elif choice == '4':
            delete_course()
        elif choice == '5':
            print("Exiting.")
            sys.exit()
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
