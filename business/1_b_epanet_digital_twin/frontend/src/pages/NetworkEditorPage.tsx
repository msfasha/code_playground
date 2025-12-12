import { useRef, useState } from 'react';
import L from 'leaflet';
import { useNetwork } from '../context/NetworkContext';
import { useEditor } from '../context/EditorContext';
import type { LatLng } from '../utils/coordinateTransform';
import { NetworkMap } from '../components/NetworkMap';
import { NetworkOverlay } from '../components/NetworkOverlay';

export function NetworkEditorPage() {
  const { network } = useNetwork();
  const { selected, setSelected } = useEditor();

  const mapCenter: LatLng = { lat: 31.9522, lng: 35.2332 };
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  return (
    <div className="rtdwms-editor">
      <NetworkMap
        center={mapCenter}
        zoom={10}
        className="rtdwms-editor-map"
        onMapReady={handleMapReady}
      />

      {network && mapReady && (
        <NetworkOverlay
          map={mapRef.current}
          network={network}
          anomalies={[]}
          selectedItem={selected}
          onItemClick={(kind, id) => setSelected({ kind, id })}
        />
      )}

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

