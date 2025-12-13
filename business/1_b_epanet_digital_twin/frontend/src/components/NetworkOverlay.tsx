import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import type { ParsedNetwork } from '../utils/epanetParser';

/**
 * MapLibre overlay: renders the EPANET network from GeoJSON sources.
 * 
 * Assumption: the network is normalized to WGS84 in NetworkContext (x=lng, y=lat).
 */
interface NetworkOverlayProps {
  map: maplibregl.Map | null;
  network: ParsedNetwork | null;
}

type NodeKind = 'junction' | 'reservoir' | 'tank';
type LinkKind = 'pipe' | 'pump' | 'valve';
type NodeProps = { id: string; kind: NodeKind };
type LinkProps = { id: string; kind: LinkKind };

export function NetworkOverlay({ map, network }: NetworkOverlayProps) {
  const hasInitialFitRef = useRef(false);

  const geojson = useMemo(() => {
    if (!network) {
      return {
        nodes: { type: 'FeatureCollection', features: [] } as FeatureCollection<Point, NodeProps>,
        links: { type: 'FeatureCollection', features: [] } as FeatureCollection<LineString, LinkProps>,
        bounds: null as null | [[number, number], [number, number]],
      };
    }

    const nodeById = new Map<string, { lng: number; lat: number }>();
    for (const c of network.coordinates || []) {
      nodeById.set(c.nodeId, { lng: c.x, lat: c.y });
    }

    const vertsByLink = new Map<string, Array<{ lng: number; lat: number }>>();
    for (const v of network.vertices || []) {
      const arr = vertsByLink.get(v.linkId) ?? [];
      arr.push({ lng: v.x, lat: v.y });
      vertsByLink.set(v.linkId, arr);
    }

    const nodeKindById = new Map<string, NodeKind>();
    for (const j of network.junctions || []) nodeKindById.set(j.id, 'junction');
    for (const r of network.reservoirs || []) nodeKindById.set(r.id, 'reservoir');
    for (const t of network.tanks || []) nodeKindById.set(t.id, 'tank');

    const nodes: FeatureCollection<Point, NodeProps> = {
      type: 'FeatureCollection',
      features: Array.from(nodeById.entries())
        .map(([id, ll]): Feature<Point, NodeProps> | null => {
          const kind = nodeKindById.get(id);
          if (!kind) return null;
          return {
            type: 'Feature',
            properties: { id, kind },
            geometry: { type: 'Point', coordinates: [ll.lng, ll.lat] },
          };
        })
        .filter((x): x is Feature<Point, NodeProps> => x !== null),
    };

    const makeLine = (kind: LinkKind, id: string, node1: string, node2: string): Feature<LineString, LinkProps> | null => {
      const a = nodeById.get(node1);
      const b = nodeById.get(node2);
      if (!a || !b) return null;
      const verts = vertsByLink.get(id) ?? [];
      const coords: Array<[number, number]> = [
        [a.lng, a.lat],
        ...verts.map((x) => [x.lng, x.lat] as [number, number]),
        [b.lng, b.lat],
      ];
      return {
        type: 'Feature',
        properties: { id, kind },
        geometry: { type: 'LineString', coordinates: coords },
      };
    };

    const links: FeatureCollection<LineString, LinkProps> = {
      type: 'FeatureCollection',
      features: [
        ...(network.pipes || []).map((p) => makeLine('pipe', p.id, p.node1, p.node2)),
        ...(network.pumps || []).map((p) => makeLine('pump', p.id, p.node1, p.node2)),
        ...(network.valves || []).map((v) => makeLine('valve', v.id, v.node1, v.node2)),
      ].filter((x): x is Feature<LineString, LinkProps> => x !== null),
    };

    let minLng = Number.POSITIVE_INFINITY;
    let minLat = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;

    const push = (lng: number, lat: number) => {
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    };

    for (const f of nodes.features) {
      const [lng, lat] = f.geometry.coordinates;
      push(lng, lat);
    }
    for (const f of links.features) {
      for (const [lng, lat] of f.geometry.coordinates) push(lng, lat);
    }

    const bounds =
      Number.isFinite(minLng) && Number.isFinite(minLat) && Number.isFinite(maxLng) && Number.isFinite(maxLat)
        ? ([[minLng, minLat], [maxLng, maxLat]] as [[number, number], [number, number]])
        : null;

    return { nodes, links, bounds };
  }, [network]);

  // Add sources/layers once; update data on changes.
  useEffect(() => {
    if (!map) return;

    const ensure = () => {
      // Sources
      if (!map.getSource('rtdwms-links')) {
        map.addSource('rtdwms-links', { type: 'geojson', data: geojson.links });
      }
      if (!map.getSource('rtdwms-nodes')) {
        map.addSource('rtdwms-nodes', { type: 'geojson', data: geojson.nodes });
      }

      // Layers
      if (!map.getLayer('rtdwms-links')) {
        map.addLayer({
          id: 'rtdwms-links',
          type: 'line',
          source: 'rtdwms-links',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': [
              'match',
              ['get', 'kind'],
              'pump',
              '#6f42c1',
              'valve',
              '#0ea5e9',
              /* pipe */ '#111827',
            ],
            'line-width': ['match', ['get', 'kind'], 'pipe', 2.5, 3],
            'line-opacity': ['match', ['get', 'kind'], 'pipe', 0.65, 0.85],
            'line-dasharray': [
              'match',
              ['get', 'kind'],
              'pump',
              ['literal', [2, 2]],
              'valve',
              ['literal', [1, 3]],
              ['literal', [1, 0]],
            ],
          },
        });
      }

      if (!map.getLayer('rtdwms-nodes')) {
        map.addLayer({
          id: 'rtdwms-nodes',
          type: 'circle',
          source: 'rtdwms-nodes',
          paint: {
            'circle-radius': 5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-color': [
              'match',
              ['get', 'kind'],
              'reservoir',
              '#22c55e',
              'tank',
              '#f59e0b',
              /* junction */ '#3b82f6',
            ],
            'circle-opacity': 0.9,
          },
        });
      }

      // Data
      (map.getSource('rtdwms-links') as maplibregl.GeoJSONSource).setData(geojson.links);
      (map.getSource('rtdwms-nodes') as maplibregl.GeoJSONSource).setData(geojson.nodes);
    };

    if (map.loaded()) ensure();
    else map.once('load', ensure);

    return () => {
      map.off('load', ensure);
    };
  }, [map, geojson.links, geojson.nodes]);

  // Fit once after first network load.
  useEffect(() => {
    if (!map || !geojson.bounds) return;
    if (hasInitialFitRef.current) return;

    map.fitBounds(geojson.bounds, { padding: 30, maxZoom: 18, duration: 0 });
    hasInitialFitRef.current = true;
  }, [map, geojson.bounds]);

  return null;
}
