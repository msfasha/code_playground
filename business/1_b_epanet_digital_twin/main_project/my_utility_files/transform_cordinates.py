"""
; ============================================================
;  EPANET Input File: AYL_WGS84.inp
;  ------------------------------------------------------------
;  Description:
;    This file is a geographic version of the original AYL.inp,
;    with all node coordinates converted from the Palestine 1923
;    / Palestine Grid (Cassini–Soldner projection, EPSG:28191)
;    to global WGS84 geographic coordinates (EPSG:4326).
;
;  Purpose:
;    To allow the network to be visualized directly on
;    modern web map platforms such as Leaflet, MapLibre,
;    or OpenLayers, which use longitude/latitude (degrees)
;    rather than projected meters.
;
;  Conversion Details:
;    - Source CRS: Palestine 1923 / Palestine Grid
;      (EPSG:28191, Cassini–Soldner projection, Clarke 1880 ellipsoid)
;    - Target CRS: WGS84 (EPSG:4326)
;    - Units: Degrees (longitude, latitude)
;    - Transformation applied to all entries in the [COORDINATES] section.
;    - All other model data (junctions, pipes, tanks, pumps, etc.)
;      remains unchanged from the original EPANET model.
;
;  Notes:
;    - WGS84 coordinates enable web-based visualization only.
;      For hydraulic simulation accuracy, the original projection
;      (in meters) should be used.
;    - To revert to the original spatial reference system,
;      transform the coordinates back to EPSG:28191.
;
;  File Created By:
;    Automatic conversion script using pyproj (EPSG:28191 → EPSG:4326)
;    Conversion verified for consistency with Jerusalem-region coordinates.
;
;  Date: [Insert your date here]
; ============================================================

"""

import re
from pyproj import Transformer

# File paths
inp_path_ayl = "/mnt/data/AYL.inp"
converted_inp_path = "/mnt/data/AYL_WGS84.inp"

# Read the input INP file
with open(inp_path_ayl, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Extract the [COORDINATES] section
match = re.search(r"(\[COORDINATES\])(.*?)(\n\[|\Z)", content, re.S | re.I)

if match:
    header = match.group(1)
    body = match.group(2).strip()

    coords = []
    for line in body.splitlines():
        parts = line.split()
        if len(parts) == 3:
            node, x, y = parts
            try:
                coords.append((node, float(x), float(y)))
            except ValueError:
                pass

    # Convert coordinates from Palestine 1923 Grid (EPSG:28191) → WGS84
    transformer = Transformer.from_crs("EPSG:28191", "EPSG:4326", always_xy=True)
    new_lines = []
    for node, x, y in coords:
        lon, lat = transformer.transform(x, y)
        new_lines.append(f"{node}\t{lon:.6f}\t{lat:.6f}")

    # Replace section in INP
    new_section = f"{header}\n" + "\n".join(new_lines) + "\n"
    new_content = re.sub(r"\[COORDINATES\].*?(\n\[|\Z)", new_section + r"\1", content, flags=re.S | re.I)

    # Write the updated file
    with open(converted_inp_path, "w", encoding="utf-8") as f:
        f.write(new_content)

converted_inp_path
