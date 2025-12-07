# Problem Constraints
# You have a set of instructors, courses, time slots, and rooms. The main constraints are:
# Instructor Workload: Each instructor must cover a specific number of courses.
# Time Slots: Lectures are scheduled within defined time slots on specific days.
# Room Availability: Multiple instructors can teach at the same time because you have enough rooms.
# Instructor Preferences: Instructors have preferred courses they would like to teach.
# Course Levels: Courses have levels (e.g., 1st-year, 2nd-year), and courses at the same level should not overlap.
# Free Slots: Preferably, instructors should have a free slot between consecutive lectures on the same day.

from gurobipy import Model, GRB, quicksum

# Sets
instructors = range(5)
courses = range(16)
timeslots = range(10)  # Assuming 5 slots on Sun, Tue, Thu and 5 on Mon, Wed
levels = [1, 2, 3]  # Example levels (1st year, 2nd year, etc.)

# Parameters
course_limit = [4, 4, 4, 4, 2]  # Max courses per instructor
room_count = 10  # Available rooms
duration = [1]*5 + [1.5]*5  # 5 slots of 1 hour, 5 slots of 1.5 hours
preferences = [
    # Example preference matrix (1 if preferred, 0 otherwise)
    [1, 0, 0, 1, ...],  # Instructor 1
    [0, 1, 1, 0, ...],  # Instructor 2
    ...
]
course_levels = [1, 1, 2, 3, ...]  # Levels of the courses

# Model
m = Model()

# Variables
x = m.addVars(instructors, courses, vtype=GRB.BINARY, name="x")
y = m.addVars(instructors, courses, timeslots, vtype=GRB.BINARY, name="y")
z = m.addVars(instructors, courses, vtype=GRB.BINARY, name="z")

# Constraints
# 1. Instructor assignment
for i in instructors:
    m.addConstr(quicksum(x[i, j] for j in courses) <= course_limit[i], f"Instructor_Assignment_{i}")

# 2. Course assignment
for j in courses:
    m.addConstr(quicksum(x[i, j] for i in instructors) == 1, f"Course_Assignment_{j}")

# 3. Time slot assignment
for i in instructors:
    for j in courses:
        m.addConstr(quicksum(y[i, j, t] for t in timeslots) == x[i, j], f"Time_Assignment_{i}_{j}")

# 4. Non-overlapping same-level courses
for l in levels:
    for t in timeslots:
        m.addConstr(quicksum(y[i, j, t] for i in instructors for j in courses if course_levels[j] == l) <= 1, f"Non_Overlap_Level_{l}_Time_{t}")

# 5. Instructor preference assignment
for i in instructors:
    for j in courses:
        m.addConstr(z[i, j] <= preferences[i][j], f"Instructor_Preference_{i}_{j}")
        m.addConstr(z[i, j] <= x[i, j], f"Instructor_Assignment_Preference_{i}_{j}")

# 6. Free slot preference
for i in instructors:
    for j in courses:
        for t in range(len(timeslots) - 1):  # No need to check last slot
            m.addConstr(y[i, j, t] + y[i, j, t+1] <= 1, f"Free_Slot_{i}_{j}_{t}")

# Objective: Maximize preferences and minimize gaps
m.setObjective(quicksum(z[i, j] for i in instructors for j in courses) - quicksum(y[i, j, t] * (y[i, j, t+1] if t < len(timeslots) - 1 else 0) for i in instructors for j in courses for t in timeslots), GRB.MAXIMIZE)

# Optimize
m.optimize()

# Output results
if m.status == GRB.OPTIMAL:
    for i in instructors:
        for j in courses:
            if x[i, j].X > 0.5:
                print(f"Instructor {i} assigned to course {j}")
                for t in timeslots:
                    if y[i, j, t].X > 0.5:
                        print(f" - Scheduled at timeslot {t}")
