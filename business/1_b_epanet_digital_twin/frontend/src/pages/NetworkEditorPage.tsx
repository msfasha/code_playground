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

  type SnapInputs = {
    nodes: Array<{ nodeId: string; latlng: L.LatLng }>;
    pipes: Array<{ pipeId: string; latlngs: L.LatLng[] }>;
  };

  // Refs to avoid re-binding Leaflet handlers on every render/mousemove
  const modeRef = useRef(mode);
  const networkRef = useRef(network);
  const snapInputsRef = useRef<SnapInputs | null>(null);
  const snapRef = useRef<SnapCandidate | null>(snap);
  const draftLinkRef = useRef(draftLink);
  const hoverRafRef = useRef<number | null>(null);
  const pendingHoverRef = useRef<L.LatLng | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    networkRef.current = network;
  }, [network]);

  useEffect(() => {
    snapRef.current = snap;
  }, [snap]);

  useEffect(() => {
    draftLinkRef.current = draftLink;
  }, [draftLink]);

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

  useEffect(() => {
    snapInputsRef.current = snapInputs;
  }, [snapInputs]);

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
        const poly = L.polyline(previewPts, {
          color: draftLink.kind === 'pipe' ? '#111827' : draftLink.kind === 'pump' ? '#6f42c1' : '#0ea5e9',
          weight: 3,
          opacity: 0.9,
          dashArray: '6, 6',
          interactive: false,
        }).addTo(g);

        // Draw a symbol for pumps/valves (EPANET-like), so it doesn't look like just a line.
        if (draftLink.kind === 'pump' || draftLink.kind === 'valve') {
          // Compute midpoint and angle based on polyline distance
          const latlngs = poly.getLatLngs() as L.LatLng[];
          let total = 0;
          const segLens: number[] = [];
          for (let i = 0; i < latlngs.length - 1; i++) {
            const d = map.distance(latlngs[i], latlngs[i + 1]);
            segLens.push(d);
            total += d;
          }
          const half = total / 2;
          let acc = 0;
          let pos: L.LatLng | null = null;
          let angle = 0;
          for (let i = 0; i < segLens.length; i++) {
            const nextAcc = acc + segLens[i];
            if (nextAcc >= half) {
              const t = segLens[i] > 0 ? (half - acc) / segLens[i] : 0;
              const a = latlngs[i];
              const b = latlngs[i + 1];
              pos = L.latLng(a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t);
              const pa = map.latLngToLayerPoint(a);
              const pb = map.latLngToLayerPoint(b);
              angle = (Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180) / Math.PI;
              break;
            }
            acc = nextAcc;
          }
          if (!pos) {
            const a = latlngs[0];
            const b = latlngs[latlngs.length - 1];
            pos = L.latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
            const pa = map.latLngToLayerPoint(a);
            const pb = map.latLngToLayerPoint(b);
            angle = (Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180) / Math.PI;
          }

          const html =
            draftLink.kind === 'pump'
              ? `<div style="width:22px;height:22px;transform: rotate(${angle}deg);pointer-events:none;">
                   <svg viewBox="0 0 24 24" width="22" height="22">
                     <circle cx="9" cy="12" r="5" fill="#ffffff" stroke="#6f42c1" stroke-width="2" />
                     <path d="M14 8 L22 12 L14 16 Z" fill="#6f42c1" />
                   </svg>
                 </div>`
              : `<div style="width:22px;height:22px;transform: rotate(${angle}deg);pointer-events:none;">
                   <svg viewBox="0 0 24 24" width="22" height="22">
                     <path d="M2 12 L10 7 L10 17 Z" fill="#0ea5e9" />
                     <path d="M22 12 L14 7 L14 17 Z" fill="#0ea5e9" />
                     <rect x="10" y="10" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" stroke-width="1.5" />
                   </svg>
                 </div>`;

          L.marker(pos, {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: '',
              html,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          }).addTo(g);
        }
      }
    }
  }, [mapReady, mode, snap, draftLink, hoverLatLng]);

  // Leaflet mode handlers (snap + create)
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    map.doubleClickZoom.disable();

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      // Throttle hover updates to once per animation frame
      pendingHoverRef.current = e.latlng;
      if (hoverRafRef.current == null) {
        hoverRafRef.current = window.requestAnimationFrame(() => {
          hoverRafRef.current = null;
          if (pendingHoverRef.current) setHoverLatLng(pendingHoverRef.current);
        });
      }

      const currentMode = modeRef.current;
      const inputs = snapInputsRef.current;
      if (!inputs || currentMode === 'select') {
        if (snapRef.current) {
          snapRef.current = null;
          setSnap(null);
        }
        return;
      }

      const cursorPx = map.latLngToContainerPoint(e.latlng);
      const n = findNearestNode(map, inputs.nodes, cursorPx, 12);
      const p = findNearestPipe(map, inputs.pipes, cursorPx, 12, 10);

      const d2 = (c: SnapCandidate | null) => {
        if (!c) return Number.POSITIVE_INFINITY;
        const pt = map.latLngToContainerPoint(c.latlng);
        const dx = pt.x - cursorPx.x;
        const dy = pt.y - cursorPx.y;
        return dx * dx + dy * dy;
      };

      const best = d2(n) <= d2(p) ? n : p;
      const prev = snapRef.current;
      const same =
        (!prev && !best) ||
        (prev &&
          best &&
          prev.kind === best.kind &&
          ((prev.kind === 'node' && best.kind === 'node' && prev.nodeId === best.nodeId) ||
            (prev.kind === 'pipe' && best.kind === 'pipe' && prev.pipeId === best.pipeId)));

      if (!same) {
        snapRef.current = best;
        setSnap(best);
      }
    };

    const onClick = (e: L.LeafletMouseEvent) => {
      const currentNetwork = networkRef.current;
      const currentMode = modeRef.current;
      const currentSnap = snapRef.current;
      const currentDraft = draftLinkRef.current;

      if (!currentNetwork) return;
      if (currentMode === 'select' || currentMode === 'select-area') return;

      // Node tools
      if (currentMode === 'junction' || currentMode === 'reservoir' || currentMode === 'tank') {
        if (currentSnap?.kind === 'node') {
          const updated = replaceNodeKind(currentNetwork, currentSnap.nodeId, currentMode);
          networkRef.current = updated;
          setNetwork(updated);
          setSelected({ kind: currentMode, id: currentSnap.nodeId });
          return;
        }

        const placeLatLng = (currentSnap?.latlng ?? e.latlng) as L.LatLng;
        const splitPipeId = currentSnap?.kind === 'pipe' ? currentSnap.pipeId : undefined;

        const { network: updated, nodeId } = addNode(
          currentNetwork,
          currentMode,
          { lat: placeLatLng.lat, lng: placeLatLng.lng },
          splitPipeId ? { splitPipeId, splitAtLatLng: { lat: placeLatLng.lat, lng: placeLatLng.lng } } : undefined,
        );

        networkRef.current = updated;
        setNetwork(updated);
        setSelected({ kind: currentMode, id: nodeId });
        return;
      }

      // Inline device placement: click on an existing pipe to place a pump/valve "on" it.
      // EPANET models pumps/valves as links, so we split the pipe at the clicked location
      // and convert one of the resulting segments into the device link.
      if ((currentMode === 'pump' || currentMode === 'valve') && currentSnap?.kind === 'pipe') {
        const pipeId = currentSnap.pipeId;
        const originalPipe = currentNetwork.pipes.find((p) => p.id === pipeId);
        if (!originalPipe) return;

        const placeLatLng = (currentSnap.latlng ?? e.latlng) as L.LatLng;

        const { network: withSplit, nodeId: splitNodeId } = addNode(
          currentNetwork,
          'junction',
          { lat: placeLatLng.lat, lng: placeLatLng.lng },
          { splitPipeId: pipeId, splitAtLatLng: { lat: placeLatLng.lat, lng: placeLatLng.lng } },
        );

        const segUp =
          withSplit.pipes.find((p) => p.node1 === originalPipe.node1 && p.node2 === splitNodeId) || null;
        const segDown =
          withSplit.pipes.find((p) => p.node1 === splitNodeId && p.node2 === originalPipe.node2) || null;

        if (!segUp || !segDown) {
          networkRef.current = withSplit;
          setNetwork(withSplit);
          setSelected({ kind: 'junction', id: splitNodeId });
          return;
        }

        // Convert the downstream segment into a device; keep upstream as a pipe.
        const segmentToConvert = segDown;

        // Preserve any internal vertices from the segment being converted.
        const segVerts = (withSplit.vertices || []).filter((v) => v.linkId === segmentToConvert.id);
        const segVertsLatLng = segVerts.map((v) =>
          coordSystem === 'utm' ? transformPalestinianUTMToWGS84(v.x, v.y) : ({ lat: v.y, lng: v.x } satisfies LatLng),
        );

        const cleaned = {
          ...withSplit,
          pipes: withSplit.pipes.filter((p) => p.id !== segmentToConvert.id),
          vertices: (withSplit.vertices || []).filter((v) => v.linkId !== segmentToConvert.id),
        };

        const { network: updated, linkId } = addLink(
          cleaned,
          currentMode,
          segmentToConvert.node1,
          segmentToConvert.node2,
          segVertsLatLng,
        );

        networkRef.current = updated;
        setNetwork(updated);
        setSelected({ kind: currentMode, id: linkId });
        draftLinkRef.current = null;
        setDraftLink(null);
        return;
      }

      // Link tools
      if (currentMode === 'pipe' || currentMode === 'pump' || currentMode === 'valve') {
        const point = currentSnap?.latlng ?? e.latlng;

        if (!currentDraft) {
          const next = {
            kind: currentMode,
            points: [{ lat: point.lat, lng: point.lng }],
            startSnap: currentSnap ?? undefined,
          };
          draftLinkRef.current = next;
          setDraftLink(next);
          return;
        }

        const next = {
          ...currentDraft,
          points: [...currentDraft.points, { lat: point.lat, lng: point.lng }],
        };
        draftLinkRef.current = next;
        setDraftLink(next);
      }
    };

    const onDblClick = (e: L.LeafletMouseEvent) => {
      const currentNetwork = networkRef.current;
      const currentMode = modeRef.current;
      const currentSnap = snapRef.current;
      const currentDraft = draftLinkRef.current;

      if (!currentNetwork) return;
      if (!(currentMode === 'pipe' || currentMode === 'pump' || currentMode === 'valve')) return;
      if (!currentDraft) return;

      if (e.originalEvent) {
        L.DomEvent.stop(e.originalEvent);
      }

      const endPoint = currentSnap?.latlng ?? e.latlng;
      const endSnap = currentSnap ?? undefined;

      const pts = [...currentDraft.points];
      const last = pts[pts.length - 1];
      if (!last || Math.abs(last.lat - endPoint.lat) > 1e-12 || Math.abs(last.lng - endPoint.lng) > 1e-12) {
        pts.push({ lat: endPoint.lat, lng: endPoint.lng });
      }

      if (pts.length < 2) return;

      let working = currentNetwork;

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

      const startResolved = resolveEndpoint(currentDraft.startSnap, startLatLng);
      const endResolved = resolveEndpoint(endSnap, endLatLng);

      const internal = pts.slice(1, -1);

      let lengthMeters = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        lengthMeters += map.distance(L.latLng(pts[i].lat, pts[i].lng), L.latLng(pts[i + 1].lat, pts[i + 1].lng));
      }

      const { network: updated, linkId } = addLink(
        working,
        currentDraft.kind,
        startResolved.nodeId,
        endResolved.nodeId,
        internal,
        currentDraft.kind === 'pipe' ? { lengthMeters } : undefined,
      );

      networkRef.current = updated;
      setNetwork(updated);
      setSelected({ kind: currentDraft.kind, id: linkId });
      draftLinkRef.current = null;
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
      if (hoverRafRef.current != null) {
        window.cancelAnimationFrame(hoverRafRef.current);
        hoverRafRef.current = null;
      }
    };
  }, [mapReady, setNetwork, setDraftLink, setSelected]);

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
          onItemClick={mode === 'select' ? (kind, id) => {
            setSelected({ kind, id });
          } : undefined}
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
