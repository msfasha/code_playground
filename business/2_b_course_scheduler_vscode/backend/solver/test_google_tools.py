from ortools.sat.python import cp_model

# More efficient approach using AddNoOverlap2D
def solve_with_no_overlap_2d():
    print("=== APPROACH 1: Using AddNoOverlap2D ===")
    
    # Same problem setup
    num_lab_rooms = 10
    num_normal_rooms = 10
    num_rooms = num_lab_rooms + num_normal_rooms
    lab_rooms = set(range(num_lab_rooms))
    normal_rooms = set(range(num_lab_rooms, num_rooms))
    
    num_lab_courses = 40
    num_normal_courses = 40
    num_courses = num_lab_courses + num_normal_courses
    lab_courses = set(range(num_lab_courses))
    normal_courses = set(range(num_lab_courses, num_courses))
    
    num_lecturers = 20
    courses_per_lecturer = 4
    num_time_slots = 30
    
    # Lecturer-course mapping
    lecturer_courses = {}
    course_lecturer = {}
    course_id = 0
    for l in range(num_lecturers):
        lecturer_courses[l] = []
        for _ in range(courses_per_lecturer):
            lecturer_courses[l].append(course_id)
            course_lecturer[course_id] = l
            course_id += 1
    
    model = cp_model.CpModel()
    
    # Variables - each course is a "task" with duration 1
    course_time = [model.NewIntVar(0, num_time_slots - 1, f"time_{c}") for c in range(num_courses)]
    course_room = [model.NewIntVar(0, num_rooms - 1, f"room_{c}") for c in range(num_courses)]
    
    # Room type constraints
    for c in lab_courses:
        model.AddAllowedAssignments([course_room[c]], [[r] for r in lab_rooms])
    for c in normal_courses:
        model.AddAllowedAssignments([course_room[c]], [[r] for r in normal_rooms])
    
    # Use AddNoOverlap2D for room-time conflicts (much more efficient!)
    # Each course is an interval of duration 1 in time, size 1 in room
    intervals_time = []
    intervals_room = []
    
    for c in range(num_courses):
        # Time interval: [start_time, start_time + 1)
        interval_time = model.NewIntervalVar(course_time[c], 1, course_time[c] + 1, f"interval_time_{c}")
        # Room interval: [room, room + 1)  
        interval_room = model.NewIntervalVar(course_room[c], 1, course_room[c] + 1, f"interval_room_{c}")
        
        intervals_time.append(interval_time)
        intervals_room.append(interval_room)
    
    # No two courses can overlap in the 2D space of (time, room)
    model.AddNoOverlap2D(intervals_time, intervals_room)
    
    # Lecturer constraints (same as before)
    for lecturer, courses in lecturer_courses.items():
        for i in range(len(courses)):
            for j in range(i + 1, len(courses)):
                c1, c2 = courses[i], courses[j]
                model.Add(course_time[c1] != course_time[c2])
    
    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30.0
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print(f"✅ Solution found! Time: {solver.WallTime():.2f}s")
        return True
    else:
        print(f"❌ No solution found. Status: {solver.StatusName(status)}")
        return False

# Alternative: Using assignment variables (binary variables)
def solve_with_assignment_variables():
    print("\n=== APPROACH 2: Using Assignment Variables ===")
    
    # Same setup as before
    num_rooms = 20
    num_courses = 80
    num_time_slots = 30
    
    # Lecturer setup (simplified for this example)
    lecturer_courses = {}
    for l in range(20):
        lecturer_courses[l] = list(range(l*4, (l+1)*4))
    
    model = cp_model.CpModel()
    
    # Binary variables: x[c][t][r] = 1 if course c is at time t in room r
    x = {}
    for c in range(num_courses):
        x[c] = {}
        for t in range(num_time_slots):
            x[c][t] = {}
            for r in range(num_rooms):
                # Only allow valid room types
                if ((c < 40 and r < 10) or  # lab course in lab room
                    (c >= 40 and r >= 10)):   # normal course in normal room
                    x[c][t][r] = model.NewBoolVar(f"x_{c}_{t}_{r}")
                else:
                    x[c][t][r] = 0  # Not allowed
    
    # Each course must be scheduled exactly once
    for c in range(num_courses):
        valid_assignments = []
        for t in range(num_time_slots):
            for r in range(num_rooms):
                if x[c][t][r] != 0:  # Valid assignment
                    valid_assignments.append(x[c][t][r])
        model.AddExactlyOne(valid_assignments)
    
    # No room conflicts: at most one course per room per time
    for t in range(num_time_slots):
        for r in range(num_rooms):
            assignments_at_tr = []
            for c in range(num_courses):
                if x[c][t][r] != 0:
                    assignments_at_tr.append(x[c][t][r])
            if assignments_at_tr:  # If there are valid assignments
                model.AddAtMostOne(assignments_at_tr)
    
    # Lecturer conflicts
    for lecturer, courses in lecturer_courses.items():
        for t in range(num_time_slots):
            lecturer_assignments_at_t = []
            for c in courses:
                for r in range(num_rooms):
                    if x[c][t][r] != 0:
                        lecturer_assignments_at_t.append(x[c][t][r])
            if lecturer_assignments_at_t:
                model.AddAtMostOne(lecturer_assignments_at_t)
    
    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 60.0
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print(f"✅ Solution found! Time: {solver.WallTime():.2f}s")
        
        # Extract solution
        print("\nSample assignments:")
        count = 0
        for c in range(min(10, num_courses)):  # Show first 10 courses
            for t in range(num_time_slots):
                for r in range(num_rooms):
                    if x[c][t][r] != 0 and solver.Value(x[c][t][r]) == 1:
                        course_type = "LAB" if c < 40 else "NOR"
                        print(f"Course {c}({course_type}): Time {t}, Room {r}")
                        count += 1
                        break
                if count > c:  # Found assignment for this course
                    break
        return True
    else:
        print(f"❌ No solution found. Status: {solver.StatusName(status)}")
        return False

# Run both approaches
if __name__ == "__main__":
    success1 = solve_with_no_overlap_2d()
    # success2 = solve_with_assignment_variables()
    
    print(f"\n=== SUMMARY ===")
    print(f"AddNoOverlap2D approach: {'✅ Success' if success1 else '❌ Failed'}")
    # print(f"Assignment variables approach: {'✅ Success' if success2 else '❌ Failed'}")
    print(f"\nRecommendation: Use AddNoOverlap2D for better performance!")