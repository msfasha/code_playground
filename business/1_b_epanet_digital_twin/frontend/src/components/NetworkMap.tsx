import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { LatLng } from '../utils/coordinateTransform';

interface NetworkMapProps {
  center?: LatLng;
  zoom?: number;
  className?: string;
  onMapReady?: (map: maplibregl.Map) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ 
  center = { lat: 31.9522, lng: 35.2332 }, // Default to Amman, Jordan
  zoom = 10,
  className = 'network-map',
  onMapReady
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const onMapReadyRef = useRef<NetworkMapProps['onMapReady']>(onMapReady);
  const initialViewRef = useRef({ center, zoom });

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map only once on mount
    const map = new maplibregl.Map({
      container: mapRef.current,
      center: [initialViewRef.current.center.lng, initialViewRef.current.center.lat],
      zoom: initialViewRef.current.zoom,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    mapInstanceRef.current = map;

    // Notify parent component that map is ready
    onMapReadyRef.current?.(map);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only run once on mount - don't recreate map when props change

  // Removed the second useEffect that was resetting the map view
  // The map is initialized with the correct center/zoom, and NetworkOverlay
  // will fit bounds when the network loads. We don't want to interfere with
  // user zoom/pan interactions.

  return (
    <>
      <div ref={mapRef} className={className} />
      <style>{`
        .network-map {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

