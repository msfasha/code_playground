import * as turf from '@turf/turf';
import type { LatLng } from '../utils/coordinateTransform';

/**
 * Check if a point (junction) is inside a polygon
 * @param point - The point coordinates [lng, lat]
 * @param polygon - Array of polygon vertices as [lng, lat] pairs
 * @returns true if point is inside polygon
 */
export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false;
  
  // Convert to Turf.js format: [lng, lat]
  const pointGeoJSON = turf.point([point.lng, point.lat]);
  
  // Create polygon GeoJSON (close the polygon by repeating first point)
  const polygonCoords = [...polygon.map(p => [p.lng, p.lat]), [polygon[0].lng, polygon[0].lat]];
  const polygonGeoJSON = turf.polygon([polygonCoords]);
  
  return turf.booleanPointInPolygon(pointGeoJSON, polygonGeoJSON);
}

/**
 * Check if a line segment (pipe) intersects with or is inside a polygon
 * @param lineStart - Start point of the line [lng, lat]
 * @param lineEnd - End point of the line [lng, lat]
 * @param polygon - Array of polygon vertices as [lng, lat] pairs
 * @returns true if line intersects polygon or both endpoints are inside
 */
export function isLineInPolygon(lineStart: LatLng, lineEnd: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false;
  
  // Check if both endpoints are inside the polygon
  const startInside = isPointInPolygon(lineStart, polygon);
  const endInside = isPointInPolygon(lineEnd, polygon);
  
  if (startInside && endInside) {
    return true; // Entire line is inside polygon
  }
  
  // Check if line intersects polygon boundary
  const lineGeoJSON = turf.lineString([
    [lineStart.lng, lineStart.lat],
    [lineEnd.lng, lineEnd.lat]
  ]);
  
  // Create polygon GeoJSON
  const polygonCoords = [...polygon.map(p => [p.lng, p.lat]), [polygon[0].lng, polygon[0].lat]];
  const polygonGeoJSON = turf.polygon([polygonCoords]);
  
  // Check for intersection
  const intersects = turf.booleanIntersects(lineGeoJSON, polygonGeoJSON);
  
  return intersects || startInside || endInside;
}

/**
 * Convert Leaflet LatLng array to our LatLng format
 * @param leafletLatLngs - Array of Leaflet LatLng objects
 * @returns Array of LatLng objects
 */
export function convertLeafletToLatLng(leafletLatLngs: L.LatLng[]): LatLng[] {
  return leafletLatLngs.map(ll => ({ lat: ll.lat, lng: ll.lng }));
}



