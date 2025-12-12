import type { LatLng as LeafletLatLng } from 'leaflet';
import type { LatLng } from '../utils/coordinateTransform';

/**
 * Check if a point (junction) is inside a polygon
 * @param point - The point coordinates [lng, lat]
 * @param polygon - Array of polygon vertices as [lng, lat] pairs
 * @returns true if point is inside polygon
 */
export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false;

  // Ray casting algorithm (odd-even rule)
  // Using lng as x, lat as y
  const x = point.lng;
  const y = point.lat;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

function segmentsIntersect(
  a: LatLng,
  b: LatLng,
  c: LatLng,
  d: LatLng,
): boolean {
  const ax = a.lng, ay = a.lat;
  const bx = b.lng, by = b.lat;
  const cx = c.lng, cy = c.lat;
  const dx = d.lng, dy = d.lat;

  const orient = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => {
    const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
    if (val === 0) return 0;
    return val > 0 ? 1 : 2;
  };

  const onSegment = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => {
    return (
      qx <= Math.max(px, rx) &&
      qx >= Math.min(px, rx) &&
      qy <= Math.max(py, ry) &&
      qy >= Math.min(py, ry)
    );
  };

  const o1 = orient(ax, ay, bx, by, cx, cy);
  const o2 = orient(ax, ay, bx, by, dx, dy);
  const o3 = orient(cx, cy, dx, dy, ax, ay);
  const o4 = orient(cx, cy, dx, dy, bx, by);

  if (o1 !== o2 && o3 !== o4) return true;

  // Collinear cases
  if (o1 === 0 && onSegment(ax, ay, cx, cy, bx, by)) return true;
  if (o2 === 0 && onSegment(ax, ay, dx, dy, bx, by)) return true;
  if (o3 === 0 && onSegment(cx, cy, ax, ay, dx, dy)) return true;
  if (o4 === 0 && onSegment(cx, cy, bx, by, dx, dy)) return true;

  return false;
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

  // Check if segment intersects any polygon edge
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    if (segmentsIntersect(lineStart, lineEnd, a, b)) {
      return true;
    }
  }

  return startInside || endInside;
}

/**
 * Convert Leaflet LatLng array to our LatLng format
 * @param leafletLatLngs - Array of Leaflet LatLng objects
 * @returns Array of LatLng objects
 */
export function convertLeafletToLatLng(leafletLatLngs: LeafletLatLng[]): LatLng[] {
  return leafletLatLngs.map(ll => ({ lat: ll.lat, lng: ll.lng }));
}



