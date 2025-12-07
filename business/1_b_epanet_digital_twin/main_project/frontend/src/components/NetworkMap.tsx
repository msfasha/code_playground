import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng } from '../utils/coordinateTransform';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Fix for default markers in Leaflet with Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface NetworkMapProps {
  center?: LatLng;
  zoom?: number;
  className?: string;
  onMapReady?: (map: L.Map) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ 
  center = { lat: 31.9522, lng: 35.2332 }, // Default to Amman, Jordan
  zoom = 10,
  className = 'network-map',
  onMapReady
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: true,
      attributionControl: true
    });

    // Add OpenStreetMap tiles (free open mapping service)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Add additional tile layers for better visualization
    const cartoDBLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    });

    // Add layer control
    const baseMaps = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }),
      'CartoDB Light': cartoDBLayer,
      'Satellite': satelliteLayer
    };

    L.control.layers(baseMaps).addTo(map);

    mapInstanceRef.current = map;

    // Notify parent component that map is ready
    if (onMapReady) {
      onMapReady(map);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Update map center when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  return (
    <>
      <div ref={mapRef} className={className} />
      <style>{`
        .network-map {
          width: 100%;
          height: 100%;
        }
        
        /* Override Leaflet styles for better integration */
        :global(.leaflet-container) {
          font-family: inherit;
        }
        
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 8px;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
        }
        
        :global(.leaflet-popup-content) {
          margin: 12px 16px;
          line-height: 1.4;
        }
        
        :global(.leaflet-control-layers) {
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
        }
        
        :global(.leaflet-control-layers-toggle) {
          background-color: white;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

