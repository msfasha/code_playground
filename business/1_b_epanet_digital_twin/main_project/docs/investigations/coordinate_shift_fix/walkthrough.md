# Coordinate Shift Fix Walkthrough

## Changes Made
- Modified `frontend/src/utils/coordinateTransform.ts` to update the `PALESTINIAN_UTM_PROJ` definition.
- Added 7-parameter `towgs84` transformation values (EPSG:1074) to correct the datum shift between Palestine 1923 and WGS84.

## Verification Steps
### Manual Verification
1. Reload the application.
2. Open the map view with `yasmin.inp` loaded.
3. Check if the network nodes and pipes now align correctly with the underlying satellite or street map.
4. The shift of ~200-300 meters should be resolved.

## Technical Details
The original projection definition relied on `+datum=potsdam` which might not have had the precise shift parameters for this specific region. By explicitly providing the `+towgs84` parameters, we ensure accurate transformation to WGS84.
