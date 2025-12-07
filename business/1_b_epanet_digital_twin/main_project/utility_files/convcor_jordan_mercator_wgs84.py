import re
from pyproj import Transformer

# ---- CONFIG ----
input_file = "inp_files/WGEMS/EPANET/AYL.inp"                # your input file
output_file = "inp_files/WGEMS/EPANET/AYL_WGS84_JTM.inp"     # output file name
src_crs = "EPSG:3149"                 # Jordan Transverse Mercator
dst_crs = "EPSG:4326"                 # WGS84
# ----------------

with open(input_file, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

match = re.search(r"(\[COORDINATES\])(.*?)(\n\[|\Z)", content, re.S | re.I)
if match:
    header = match.group(1)
    body = match.group(2).strip()

    transformer = Transformer.from_crs(src_crs, dst_crs, always_xy=True)

    new_lines = []
    for line in body.splitlines():
        parts = line.split()
        if len(parts) == 3:
            node, x, y = parts
            try:
                lon, lat = transformer.transform(float(x), float(y))
                new_lines.append(f"{node}\t{lon:.6f}\t{lat:.6f}")
            except Exception:
                pass

    new_section = f"{header}\n" + "\n".join(new_lines) + "\n"
    new_content = re.sub(r"\[COORDINATES\].*?(\n\[|\Z)",
                         new_section + r"\1",
                         content, flags=re.S | re.I)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(new_content)

print(f"Converted file saved as: {output_file}")
