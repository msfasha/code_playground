import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import type { LatLng } from '../utils/coordinateTransform';
import { convertLeafletToLatLng } from '../utils/geometryUtils';

interface ZoneSelectorProps {
  map: L.Map | null;
  isActive: boolean;
  onPolygonDrawn: (polygon: LatLng[]) => void;
  onPolygonCleared: () => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({ 
  map, 
  isActive, 
  onPolygonDrawn, 
  onPolygonCleared 
}) => {
  const drawnPolygonRef = useRef<L.Polygon | null>(null);

  // Handle polygon creation
  useEffect(() => {
    if (!map) return;

    const handlePolygonCreate = (e: any) => {
      const layer = e.layer;
      
      // Only handle polygons
      if (!(layer instanceof L.Polygon)) {
        return;
      }

      // Clear previous polygon if exists
      if (drawnPolygonRef.current) {
        map.removeLayer(drawnPolygonRef.current);
      }

      // Store reference to new polygon
      drawnPolygonRef.current = layer;

      // Extract coordinates from polygon
      const latLngs = layer.getLatLngs()[0] as L.LatLng[];
      const polygon = convertLeafletToLatLng(latLngs);

      // Notify parent component
      onPolygonDrawn(polygon);

      // Disable drawing mode after polygon is created
      map.pm.disableDraw();
    };

    // Handle polygon removal
    const handlePolygonRemove = (e: any) => {
      if (drawnPolygonRef.current && e.layer === drawnPolygonRef.current) {
        drawnPolygonRef.current = null;
        onPolygonCleared();
      }
    };

    map.on('pm:create', handlePolygonCreate);
    map.on('pm:remove', handlePolygonRemove);

    return () => {
      map.off('pm:create', handlePolygonCreate);
      map.off('pm:remove', handlePolygonRemove);
    };
  }, [map, onPolygonDrawn, onPolygonCleared]);

  // Handle drawing mode activation/deactivation
  useEffect(() => {
    if (!map) return;

    if (isActive) {
      // Set polygon styling
      map.pm.setPathOptions({
        color: '#3388ff',
        weight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.2,
      });

      // Enable polygon drawing directly (no toolbar needed)
      map.pm.enableDraw('Polygon');
    } else {
      // Disable drawing mode
      map.pm.disableDraw();

      // Clear polygon when deactivated
      if (drawnPolygonRef.current) {
        map.removeLayer(drawnPolygonRef.current);
        drawnPolygonRef.current = null;
      }
    }

    return () => {
      // Cleanup on unmount or when isActive changes
      map.pm.disableDraw();
    };
  }, [map, isActive]);

  return null; // This component doesn't render anything visible
};
