"""
EPANET Network Demand Updater
Assigns realistic base demand values to all junctions based on connected 
pipe diameters and overall population demand target.
"""
import numpy as np
from epyt import epanet

# ================================================================
# USER PARAMETERS
# ================================================================
inp_file = "yasmin.inp"              # Input EPANET network file (.inp)
out_file = "yasmin_demanded.inp"    # Output file name

# Estimated population: total number of people served
population = 1_000_000

# Average demand: liters per capita per day (L/cap/day)
avg_demand_lpcd = 180

# Weighting exponent: determines how strongly pipe diameter influences demand distribution
# Higher values (>1.0) emphasize larger pipes more; 1.0 gives linear weighting
weighting_exponent = 1.5

# ================================================================
# STEP 1 - LOAD THE NETWORK
# ================================================================
print("=" * 60)
print("EPANET Network Demand Updater")
print("=" * 60)
print(f"\nLoading network from: {inp_file}")

d = epanet(inp_file)
print(f"EPANET version {d.getVersion()} loaded successfully.")
print(f"Input file {inp_file} loaded successfully.\n")

# Retrieve node names, node types (junction, tank, reservoir, etc.)
node_names = d.getNodeNameID()
node_types = d.getNodeType()

# Retrieve link diameters for all pipes
pipe_diams = np.array(d.getLinkDiameter())

# Retrieve link start and end node indices
# Handle EPyT library version differences
link_nodes = d.getLinkNodesIndex()

if isinstance(link_nodes, tuple):
    # Older EPyT: returns tuple of two arrays (start_nodes, end_nodes)
    start_nodes, end_nodes = link_nodes
elif isinstance(link_nodes, np.ndarray):
    if link_nodes.shape[0] == 2:
        # EPyT returns 2×N array: [start_nodes, end_nodes]
    start_nodes, end_nodes = link_nodes[0, :], link_nodes[1, :]
    elif link_nodes.shape[1] == 2:
        # EPyT returns N×2 array: each row is [start_node, end_node]
        start_nodes, end_nodes = link_nodes[:, 0], link_nodes[:, 1]
    else:
        raise RuntimeError(
            f"Unexpected array shape from getLinkNodesIndex(): {link_nodes.shape}"
        )
else:
    raise RuntimeError(
        f"Unexpected format from getLinkNodesIndex(): {type(link_nodes)}, "
        f"shape={getattr(link_nodes, 'shape', None)}"
    )

pipe_start = np.array(start_nodes, dtype=int)
pipe_end = np.array(end_nodes, dtype=int)

print(f"Found {len(pipe_diams)} pipes in the network.")

# ================================================================
# STEP 2 - IDENTIFY JUNCTIONS
# ================================================================
# Filter nodes to include only those of type "JUNCTION"
junction_indices = [i for i, t in enumerate(node_types) if t == 'JUNCTION']
num_junctions = len(junction_indices)
print(f"Found {num_junctions} junctions.\n")

# ================================================================
# STEP 3 - COMPUTE TOTAL CONNECTED DIAMETERS
# ================================================================
# Initialize an array to store the sum of pipe diameters connected to each node
node_diam_sum = np.zeros(len(node_types))

# For every pipe in the network, add the pipe's diameter to the start and end node's total
for i in range(len(pipe_diams)):
    dia = pipe_diams[i]
    start_node = pipe_start[i] - 1  # EPyT uses 1-based indexing, convert to 0-based
    end_node = pipe_end[i] - 1
    
    if 0 <= start_node < len(node_diam_sum):
        node_diam_sum[start_node] += dia
    if 0 <= end_node < len(node_diam_sum):
        node_diam_sum[end_node] += dia

# Extract total connected diameters for junctions only
junction_diams = node_diam_sum[junction_indices]

# Handle junctions with no connected pipes by assigning median network diameter
junctions_with_no_pipes = np.sum(junction_diams == 0)
if junctions_with_no_pipes > 0:
    median_diameter = np.median(junction_diams[junction_diams > 0])
    if np.isnan(median_diameter):
        median_diameter = np.median(pipe_diams)  # Fallback to overall median
    junction_diams[junction_diams == 0] = median_diameter
    print(f"⚠️  {junctions_with_no_pipes} junctions had no connected pipes; "
          f"assigned median diameter value ({median_diameter:.2f} mm).\n")

# ================================================================
# STEP 4 - CALCULATE WEIGHTING FACTORS
# ================================================================
# Each junction's demand weight is calculated from its total connected pipe diameter
# using a power function: weight = (sum_of_connected_diameters) ^ exponent
weights = junction_diams ** weighting_exponent

# Normalize weights so that the sum of all junction weights equals 1
weights_normalized = weights / np.sum(weights)

print(f"Using weighting exponent: {weighting_exponent}")
print(f"Weight normalization complete.\n")

# ================================================================
# STEP 5 - DETERMINE TARGET TOTAL DEMAND
# ================================================================
# Total system demand = population × average_demand (L/cap/day)
total_liters_per_day = population * avg_demand_lpcd

# Convert to cubic meters per second:
# (total_liters_per_day) ÷ (86,400 seconds/day) ÷ (1,000 L/m³)
target_total_demand_m3s = total_liters_per_day / 86400 / 1000

print(f"Target total system demand:")
print(f"  Population: {population:,} people")
print(f"  Average demand: {avg_demand_lpcd} L/cap/day")
print(f"  Total daily demand: {total_liters_per_day/1e6:.2f} ML/day")
print(f"  Total system demand: {target_total_demand_m3s:.3f} m³/s\n")

# ================================================================
# STEP 6 - ASSIGN BASE DEMANDS
# ================================================================
# Each junction's base demand = normalized_weight × total_system_demand
demands_m3s = weights_normalized * target_total_demand_m3s

# Convert from cubic meters per second to liters per second (EPANET's standard flow unit)
demands_ls = demands_m3s * 1000

# ================================================================
# STEP 7 - WRITE UPDATED NETWORK
# ================================================================
# Get total number of nodes
num_nodes = len(d.getNodeNameID())
print(f"Total nodes in network: {num_nodes}")
print(f"Updating {len(junction_indices)} junction demands...")

# Method: Clear existing demands and add new ones for each junction
# First, get junction IDs (1-based) and clear existing demands
junction_ids = [idx + 1 for idx in junction_indices]  # Convert to 1-based for EPyT

# Clear all existing junction demands by deleting them
print("Clearing existing junction demands...")
for junc_id in junction_ids:
    # Get number of demand categories for this junction
    num_categories = d.getNodeDemandCategoriesNumber(junc_id)
    # Delete all existing demand categories
    for cat_idx in range(1, num_categories + 1):
        try:
            d.deleteNodeJunctionDemand(junc_id, cat_idx)
        except:
            pass  # Ignore if demand category doesn't exist

# Now add new demands for all junctions
print("Setting new junction demands...")
for idx, junc_id in enumerate(junction_ids):
    demand_value = float(demands_ls[idx])
    if demand_value > 0:  # Only add non-zero demands
        d.addNodeJunctionDemand(junc_id, demand_value)

# Verify the update worked immediately after setting
verify_demands = np.array(d.getNodeBaseDemands()[1])
verify_junction_demands = verify_demands[junction_indices]
total_verify = np.sum(verify_junction_demands)
print(f"Sample updated demands (first 5): {verify_junction_demands[:5]}")
print(f"Verification - Total junction demands after update: {total_verify:.1f} L/s")
print(f"Expected total: {np.sum(demands_ls):.1f} L/s")

if abs(total_verify - np.sum(demands_ls)) > 1.0:
    print(f"⚠️  WARNING: Demand mismatch! Expected {np.sum(demands_ls):.1f} L/s, got {total_verify:.1f} L/s")

# Write a new .inp file, preserving all original network elements
d.saveInputFile(out_file)

# Post-process: Reformat file to put demands in JUNCTIONS section (matching original format)
print("Reformatting file to match original structure (demands in JUNCTIONS section)...")
import re

# Read the generated file
with open(out_file, 'r') as f:
    lines = f.readlines()

# Create a mapping of junction ID to demand
junction_names = d.getNodeNameID()
junction_id_to_demand = {}
for idx, junc_idx in enumerate(junction_indices):
    junction_id = junction_names[junc_idx]
    junction_id_to_demand[junction_id] = demands_ls[idx]

# Process file line by line
output_lines = []
in_junctions = False
skip_demands_section = False

for line in lines:
    if line.strip().upper() == '[JUNCTIONS]':
        in_junctions = True
        output_lines.append(line)
    elif line.strip().upper() == '[DEMANDS]':
        skip_demands_section = True
        # Don't add this line - we're removing DEMANDS section
    elif line.strip().startswith('[') and in_junctions:
        # End of JUNCTIONS section
        in_junctions = False
        output_lines.append(line)
    elif in_junctions and line.strip() and not line.strip().startswith(';'):
        # This is a junction line - update it
        parts = line.split()
        if len(parts) >= 2:
            junc_id = parts[0].strip()
            elevation = parts[1] if len(parts) > 1 else "0"
            if junc_id in junction_id_to_demand:
                demand = junction_id_to_demand[junc_id]
                # Format: ID Elevation Demand (matching original format)
                output_lines.append(f" {junc_id:>10}{elevation:>15} {demand:.6f} \n")
            else:
                output_lines.append(line)
        else:
            output_lines.append(line)
    elif skip_demands_section:
        # Skip lines in DEMANDS section until we hit next section
        if line.strip().startswith('['):
            skip_demands_section = False
            output_lines.append(line)
        # Otherwise skip this line
    else:
        output_lines.append(line)

# Write the reformatted file
with open(out_file, 'w') as f:
    f.writelines(output_lines)

print(f"✅ Updated network saved as: {out_file}\n")

# Final verification by reloading the saved file
d_verify = epanet(out_file)
verify_demands_final = np.array(d_verify.getNodeBaseDemands()[1])
verify_junction_demands_final = verify_demands_final[junction_indices]
total_final = np.sum(verify_junction_demands_final)
print(f"Final verification (from saved file): {total_final:.1f} L/s")
d_verify.unload()

# ================================================================
# STEP 8 - DISPLAY SUMMARY
# ================================================================
total_demand_ls = np.sum(demands_ls)
total_demand_m3s = total_demand_ls / 1000

print("=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Total assigned demand: {total_demand_ls:.1f} L/s ({total_demand_m3s:.3f} m³/s)")
print(f"Average demand per junction: {np.mean(demands_ls):.2f} L/s")
print(f"Minimum demand per junction: {np.min(demands_ls):.2f} L/s")
print(f"Maximum demand per junction: {np.max(demands_ls):.2f} L/s")
print("=" * 60)
print(f"\nThe resulting file should open and simulate normally in EPANET,")
print(f"QGIS, or any compatible tool.")
print()
