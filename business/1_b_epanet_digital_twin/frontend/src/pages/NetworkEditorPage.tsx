import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useNetwork } from '../context/NetworkContext';
import { useEditor } from '../context/EditorContext';
import type { LatLng } from '../utils/coordinateTransform';
import { isPalestinianUTM, transformPalestinianUTMToWGS84 } from '../utils/coordinateTransform';
import { NetworkMap } from '../components/NetworkMap';
import { NetworkOverlay } from '../components/NetworkOverlay';
import type { SnapCandidate } from '../utils/editorSnap';
import { findNearestNode, findNearestPipe } from '../utils/editorSnap';
import { addLink, addNode, replaceNodeKind } from '../utils/networkOps';
import { filterElementsByPolygon, convertLeafletToLatLng } from '../utils/geometryUtils';

export function NetworkEditorPage() {
  const { network, setNetwork } = useNetwork();
  const { selected, setSelected, selectedArea, setSelectedArea, mode, setMode, draftLink, setDraftLink } = useEditor();

  const mapCenter: LatLng = { lat: 31.9522, lng: 35.2332 };
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [snap, setSnap] = useState<SnapCandidate | null>(null);
  const [hoverLatLng, setHoverLatLng] = useState<L.LatLng | null>(null);
  const uiLayerRef = useRef<L.LayerGroup | null>(null);

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const coordSystem = useMemo(() => {
    if (!network) return 'wgs84' as const;
    return (network.coordinates || []).some((c) => isPalestinianUTM(c.x, c.y)) ? ('utm' as const) : ('wgs84' as const);
  }, [network]);

  const snapInputs = useMemo(() => {
    if (!network) return null;

    const nodeLatLngById = new Map<string, L.LatLng>();
    for (const c of network.coordinates || []) {
      const ll =
        coordSystem === 'utm'
          ? transformPalestinianUTMToWGS84(c.x, c.y)
          : ({ lat: c.y, lng: c.x } satisfies LatLng);
      nodeLatLngById.set(c.nodeId, L.latLng(ll.lat, ll.lng));
    }

    const nodes = Array.from(nodeLatLngById.entries()).map(([nodeId, latlng]) => ({ nodeId, latlng }));

    const verticesByLinkId = new Map<string, Array<{ lat: number; lng: number }>>();
    for (const v of network.vertices || []) {
      const ll =
        coordSystem === 'utm'
          ? transformPalestinianUTMToWGS84(v.x, v.y)
          : ({ lat: v.y, lng: v.x } satisfies LatLng);
      const arr = verticesByLinkId.get(v.linkId) ?? [];
      arr.push(ll);
      verticesByLinkId.set(v.linkId, arr);
    }

    const pipes = (network.pipes || [])
      .map((p) => {
        const a = nodeLatLngById.get(p.node1);
        const b = nodeLatLngById.get(p.node2);
        if (!a || !b) return null;
        const verts = verticesByLinkId.get(p.id) ?? [];
        const latlngs = [a, ...verts.map((x) => L.latLng(x.lat, x.lng)), b];
        return { pipeId: p.id, latlngs };
      })
      .filter(Boolean) as Array<{ pipeId: string; latlngs: L.LatLng[] }>;

    return { nodes, pipes };
  }, [network, coordSystem]);

  // Cursor feedback
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const el = map.getContainer();
    if (mode === 'select-area') {
      el.style.cursor = 'crosshair';
    } else if (mode === 'select') {
      el.style.cursor = '';
    } else {
      el.style.cursor = 'crosshair';
    }
  }, [mode]);

  // UI overlay for draft + snap marker
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (!uiLayerRef.current) {
      uiLayerRef.current = L.layerGroup().addTo(map);
    }

    const g = uiLayerRef.current;
    g.clearLayers();

    if (snap && mode !== 'select') {
      L.circleMarker(snap.latlng, {
        radius: 6,
        color: '#ef4444',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.3,
        interactive: false,
      }).addTo(g);
    }

    if (draftLink) {
      const pts = draftLink.points.map((p) => L.latLng(p.lat, p.lng));
      const previewPts = hoverLatLng ? [...pts, hoverLatLng] : pts;
      if (previewPts.length >= 2) {
        L.polyline(previewPts, {
          color: draftLink.kind === 'pipe' ? '#111827' : draftLink.kind === 'pump' ? '#6f42c1' : '#0ea5e9',
          weight: 3,
          opacity: 0.9,
          dashArray: '6, 6',
          interactive: false,
        }).addTo(g);
      }
    }
  }, [mapReady, mode, snap, draftLink, hoverLatLng]);

  // Leaflet mode handlers (snap + create)
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    map.doubleClickZoom.disable();

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      setHoverLatLng(e.latlng);

      if (!snapInputs || mode === 'select') {
        setSnap(null);
        return;
      }

      const cursorPx = map.latLngToContainerPoint(e.latlng);
      const n = findNearestNode(map, snapInputs.nodes, cursorPx, 12);
      const p = findNearestPipe(map, snapInputs.pipes, cursorPx, 12, 10);

      const d2 = (c: SnapCandidate | null) => {
        if (!c) return Number.POSITIVE_INFINITY;
        const pt = map.latLngToContainerPoint(c.latlng);
        const dx = pt.x - cursorPx.x;
        const dy = pt.y - cursorPx.y;
        return dx * dx + dy * dy;
      };

      const best = d2(n) <= d2(p) ? n : p;
      setSnap(best);
    };

    const onClick = (e: L.LeafletMouseEvent) => {
      if (!network) return;

      if (mode === 'select' || mode === 'select-area') return;

      // Node tools
      if (mode === 'junction' || mode === 'reservoir' || mode === 'tank') {
        if (snap?.kind === 'node') {
          const updated = replaceNodeKind(network, snap.nodeId, mode);
          setNetwork(updated);
          setSelected({ kind: mode, id: snap.nodeId });
          return;
        }

        const placeLatLng = (snap?.latlng ?? e.latlng) as L.LatLng;
        const splitPipeId = snap?.kind === 'pipe' ? snap.pipeId : undefined;

        const { network: updated, nodeId } = addNode(
          network,
          mode,
          { lat: placeLatLng.lat, lng: placeLatLng.lng },
          splitPipeId ? { splitPipeId, splitAtLatLng: { lat: placeLatLng.lat, lng: placeLatLng.lng } } : undefined,
        );

        setNetwork(updated);
        setSelected({ kind: mode, id: nodeId });
        return;
      }

      // Link tools
      if (mode === 'pipe' || mode === 'pump' || mode === 'valve') {
        const point = snap?.latlng ?? e.latlng;

        if (!draftLink) {
          setDraftLink({
            kind: mode,
            points: [{ lat: point.lat, lng: point.lng }],
            startSnap: snap ?? undefined,
          });
          return;
        }

        setDraftLink({
          ...draftLink,
          points: [...draftLink.points, { lat: point.lat, lng: point.lng }],
        });
      }
    };

    const onDblClick = (e: L.LeafletMouseEvent) => {
      if (!network) return;
      if (!(mode === 'pipe' || mode === 'pump' || mode === 'valve')) return;
      if (!draftLink) return;

      if (e.originalEvent) {
        L.DomEvent.stop(e.originalEvent);
      }

      const endPoint = snap?.latlng ?? e.latlng;
      const endSnap = snap ?? undefined;

      const pts = [...draftLink.points];
      const last = pts[pts.length - 1];
      if (!last || Math.abs(last.lat - endPoint.lat) > 1e-12 || Math.abs(last.lng - endPoint.lng) > 1e-12) {
        pts.push({ lat: endPoint.lat, lng: endPoint.lng });
      }

      if (pts.length < 2) return;

      let working = network;

      const resolveEndpoint = (
        candidate: SnapCandidate | undefined,
        fallback: { lat: number; lng: number },
      ): { network: typeof network; nodeId: string } => {
        if (!working) throw new Error('No network loaded');

        if (candidate?.kind === 'node') {
          return { network: working, nodeId: candidate.nodeId };
        }

        if (candidate?.kind === 'pipe') {
          const r = addNode(
            working,
            'junction',
            fallback,
            { splitPipeId: candidate.pipeId, splitAtLatLng: fallback },
          );
          working = r.network;
          return { network: working, nodeId: r.nodeId };
        }

        const r = addNode(working, 'junction', fallback);
        working = r.network;
        return { network: working, nodeId: r.nodeId };
      };

      const startLatLng = pts[0];
      const endLatLng = pts[pts.length - 1];

      const startResolved = resolveEndpoint(draftLink.startSnap, startLatLng);
      const endResolved = resolveEndpoint(endSnap, endLatLng);

      const internal = pts.slice(1, -1);

      let lengthMeters = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        lengthMeters += map.distance(L.latLng(pts[i].lat, pts[i].lng), L.latLng(pts[i + 1].lat, pts[i + 1].lng));
      }

      const { network: updated, linkId } = addLink(
        working,
        draftLink.kind,
        startResolved.nodeId,
        endResolved.nodeId,
        internal,
        draftLink.kind === 'pipe' ? { lengthMeters } : undefined,
      );

      setNetwork(updated);
      setSelected({ kind: draftLink.kind, id: linkId });
      setDraftLink(null);
    };

    map.on('mousemove', onMouseMove);
    map.on('click', onClick);
    map.on('dblclick', onDblClick);

    return () => {
      map.off('mousemove', onMouseMove);
      map.off('click', onClick);
      map.off('dblclick', onDblClick);
      map.doubleClickZoom.enable();
    };
  }, [mapReady, network, setNetwork, mode, snapInputs, snap, draftLink, setDraftLink, setSelected]);

  // Geoman polygon drawing for area selection
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !network) return;

    // Check if Geoman is available (it should be after import, but check to be safe)
    const pm = (map as any).pm;
    if (!pm) {
      // Geoman might not be initialized yet, skip silently
      return;
    }

    if (mode === 'select-area') {
      // Enable polygon drawing
      try {
        pm.enableDraw('Polygon', {
          snappable: false,
          snapDistance: 20,
        });

        const onDrawEnd = (e: any) => {
          const layer = e.layer;
          const latlngs = layer.getLatLngs()[0] as L.LatLng[];
          const polygon = convertLeafletToLatLng(latlngs);
          
          // Filter elements by polygon
          const selected = filterElementsByPolygon(network, polygon);
          setSelectedArea(selected);
          
          // Remove the drawn polygon
          map.removeLayer(layer);
          
          // Switch back to select mode
          setMode('select');
        };

        map.on('pm:create', onDrawEnd);

        return () => {
          map.off('pm:create', onDrawEnd);
          try {
            pm.disableDraw();
          } catch (e) {
            // Ignore errors when disabling
          }
        };
      } catch (e) {
        console.error('Error enabling Geoman drawing:', e);
      }
    } else {
      // Disable drawing when not in select-area mode
      try {
        pm.disableDraw();
      } catch (e) {
        // Ignore errors when disabling
      }
    }
  }, [mapReady, mode, network, setSelectedArea, setMode]);

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
          selectedArea={selectedArea}
          onItemClick={mode === 'select' ? (kind, id) => setSelected({ kind, id }) : undefined}
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
