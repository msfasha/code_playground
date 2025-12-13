import { useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useNetwork } from '../context/NetworkContext';
import type { LatLng } from '../utils/coordinateTransform';
import { NetworkMap } from '../components/NetworkMap';
import { NetworkOverlay } from '../components/NetworkOverlay';

/**
 * Main map page.
 * Current milestone: view-only MapLibre rendering.
 */
export function NetworkEditorPage() {
  const { network } = useNetwork();

  const mapCenter: LatLng = { lat: 31.9522, lng: 35.2332 };
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="rtdwms-editor">
      <NetworkMap
        center={mapCenter}
        zoom={10}
        className="rtdwms-editor-map"
        onMapReady={(map) => {
          mapRef.current = map;
          setMapReady(true);
        }}
      />

      {network && mapReady && <NetworkOverlay map={mapRef.current} network={network} />}

      <style>{`
        .rtdwms-editor {
          position: absolute;
          inset: 0;
          background: #ffffff;
        }

        .rtdwms-editor-map {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
