from ortools.sat.python import cp_model

model = cp_model.CpModel()
# Integer variables from 0 to 5
xs = [model.new_int_var(0, 5, f"x_{i}") for i in range(10)]

# Example constraint: sum of all xs equals 12
model.add(sum(xs) == 12)

solver = cp_model.CpSolver()
status = solver.Solve(model)

print(f"Status: {solver.StatusName(status)}")
print("Values for xs:")

for i, x in enumerate(xs):
    print(f"x_{i} = {solver.Value(x)}")