import gurobipy as gp
from gurobipy import GRB

# Create a new model
model = gp.Model("simple_factory")

# Create decision variables
x = model.addVar(vtype=GRB.CONTINUOUS, name="Product_A")
y = model.addVar(vtype=GRB.CONTINUOUS, name="Product_B")

# Set the objective function
model.setObjective(30*x + 20*y, GRB.MAXIMIZE)

# Add constraints
model.addConstr(2*x + 1*y <= 100, "Machine_Time_Constraint")
model.addConstr(1*x + 2*y <= 80, "Labor_Constraint")

# Optimize the model
model.optimize()

# # Print the optimal solution
# if model.status == GRB.OPTIMAL:
#     print(f"Optimal number of Product A to produce: {x.x}")
#     print(f"Optimal number of Product B to produce: {y.x}")
#     print(f"Maximum profit: {model.objVal}")
# else:
#     print("No optimal solution found.")
