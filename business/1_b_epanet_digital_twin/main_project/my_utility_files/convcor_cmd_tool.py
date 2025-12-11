#!/usr/bin/env python3
"""
===============================================================================
EPANET INP Coordinate Reprojection Tool
===============================================================================
Author: ChatGPT (OpenAI)
Version: 1.0
Date: 2025-11-07

DESCRIPTION:
    This script reprojects the [COORDINATES] section of an EPANET .inp file
    from one coordinate reference system (CRS) to another using EPSG codes.

    It leaves the rest of the .inp file (junctions, pipes, pumps, etc.)
    unchanged.

USAGE:
    python3 reproject_inp.py <input.inp> <output.inp> <source_epsg> <target_epsg>

ARGUMENTS:
    input.inp      Path to the input EPANET file.
    output.inp     Path where the reprojected file will be saved.
    source_epsg    EPSG code of the source coordinate system.
    target_epsg    EPSG code of the desired target coordinate system.

EXAMPLE:
    python3 reproject_inp.py network.inp network_wgs84.inp 32636 4326

REQUIREMENTS:
    pip install epanettools pyproj

NOTES:
    - Only the [COORDINATES] section is modified.
    - Make sure your source EPSG code matches the coordinate system used
      in the original .inp file (e.g., UTM zone).
    - The script will safely skip malformed coordinate lines.

===============================================================================
"""

from pyproj import Transformer
from epanettools.epanettools import EPANetSimulation
import sys, re

if len(sys.argv) < 5:
    print("Usage: python3 reproject_inp.py <input.inp> <output.inp> <source_epsg> <target_epsg>")
    sys.exit(1)

inp, outp, src_epsg, dst_epsg = sys.argv[1:5]
transformer = Transformer.from_crs(f"EPSG:{src_epsg}", f"EPSG:{dst_epsg}", always_xy=True)

with open(inp) as f:
    lines = f.readlines()

out = []
coord_section = False
for line in lines:
    if line.strip().startswith('[COORDINATES]'):
        coord_section = True
        out.append(line)
        continue
    if coord_section:
        if line.strip().startswith('['):  # next section
            coord_section = False
            out.append(line)
            continue
        if re.match(r'^\s*[A-Za-z0-9]', line):
            parts = line.split()
            if len(parts) >= 3:
                try:
                    node, x, y = parts[0], float(parts[1]), float(parts[2])
                    x2, y2 = transformer.transform(x, y)
                    out.append(f"  {node:<8} {x2:.3f} {y2:.3f}\n")
                    continue
                except Exception:
                    pass
    out.append(line)

with open(outp, "w") as f:
    f.writelines(out)

print(f"✅ Reprojected coordinates written to {outp}")
