# Coordinate Shift Investigation Plan

## Goal Description
The user reports that the network locations in `yasmin.inp` are shifted from actual coordinates on the map. The goal is to identify the cause (e.g., coordinate system mismatch, missing projection, or offset) and solve it.

## User Review Required
- None at this stage.

## Proposed Changes
- **Investigation Phase**:
    - Analyze `yasmin.inp` to identify the coordinate range.
    - Search the codebase for how `.inp` files are parsed and how coordinates are projected on the map (Leaflet, Mapbox, etc.).
    - Check if the application correctly detects or allows specifying the projection.
    - **Findings**: The coordinates are in Palestine 1923 / Palestine Grid (Cassini-Soldner). The current projection definition in `coordinateTransform.ts` lacks `towgs84` datum transformation parameters, causing a shift of ~200-300 meters.

- **Fix Coordinate Projection**:
    - Modify `frontend/src/utils/coordinateTransform.ts`.
    - Update `PALESTINIAN_UTM_PROJ` string to include accurate `towgs84` parameters (EPSG:1074 or EPSG:8650).
    - Recommended parameters (EPSG:1074): `+towgs84=-275.7224,94.7824,340.8944,-8.001,-4.42,-11.821,1.0`.

## Verification Plan
- **Manual Verification**:
    - Apply the fix.
    - Ask the user to reload the map and check if the network aligns with the satellite/street map.
