import proj4 from 'proj4';

// Palestinian UTM Projection (EPSG:28193) - Palestine 1923 / Israeli CS Grid
const PALESTINIAN_UTM_PROJ = '+proj=cass +lat_0=31.73409694444445 +lon_0=35.21208055555556 +x_0=170251.555 +y_0=126867.909 +datum=potsdam +units=m +no_defs';

// WGS 84 (EPSG:4326) - Standard lat/lng
const WGS84_PROJ = '+proj=longlat +datum=WGS84 +no_defs';

// Define the projections
proj4.defs('EPSG:28193', PALESTINIAN_UTM_PROJ);
proj4.defs('EPSG:4326', WGS84_PROJ);

export interface Coordinate {
  x: number;
  y: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Transform Palestinian UTM coordinates to WGS 84 (lat/lng)
 * @param utmX - Palestinian UTM X coordinate
 * @param utmY - Palestinian UTM Y coordinate
 * @returns LatLng object with latitude and longitude
 */
export function transformPalestinianUTMToWGS84(utmX: number, utmY: number): LatLng {
  try {
    const [lng, lat] = proj4('EPSG:28193', 'EPSG:4326', [utmX, utmY]);
    return { lat, lng };
  } catch (error) {
    console.error('Error transforming coordinates:', error);
    throw new Error(`Failed to transform coordinates: ${error}`);
  }
}

/**
 * Transform multiple Palestinian UTM coordinates to WGS 84
 * @param coordinates - Array of UTM coordinates
 * @returns Array of LatLng objects
 */
export function transformMultipleUTMToWGS84(coordinates: Coordinate[]): LatLng[] {
  return coordinates.map(coord => 
    transformPalestinianUTMToWGS84(coord.x, coord.y)
  );
}

/**
 * Check if coordinates appear to be Palestinian UTM based on their magnitude
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns boolean indicating if coordinates are likely Palestinian UTM
 */
export function isPalestinianUTM(x: number, y: number): boolean {
  // Palestinian UTM coordinates are typically in the range:
  // X: 170,000 - 250,000
  // Y: 120,000 - 150,000
  return x > 100000 && x < 300000 && y > 100000 && y < 200000;
}

/**
 * Get coordinate bounds for a set of UTM coordinates
 * @param coordinates - Array of UTM coordinates
 * @returns Bounds object with min/max values
 */
export function getCoordinateBounds(coordinates: Coordinate[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (coordinates.length === 0) {
    throw new Error('No coordinates provided');
  }

  const xs = coordinates.map(coord => coord.x);
  const ys = coordinates.map(coord => coord.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

/**
 * Get center point of a set of coordinates
 * @param coordinates - Array of coordinates
 * @returns Center coordinate
 */
export function getCenterPoint(coordinates: Coordinate[]): Coordinate {
  if (coordinates.length === 0) {
    throw new Error('No coordinates provided');
  }

  const bounds = getCoordinateBounds(coordinates);
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2
  };
}
