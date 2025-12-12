import L from 'leaflet';

export type SnapCandidate =
  | { kind: 'node'; nodeId: string; latlng: L.LatLng }
  | { kind: 'pipe'; pipeId: string; latlng: L.LatLng; vertexIndex?: number };

export type NodeSnapInput = { nodeId: string; latlng: L.LatLng };
export type PipeSnapInput = { pipeId: string; latlngs: L.LatLng[] };

function dist2(a: L.Point, b: L.Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function closestPointOnSegmentPx(p: L.Point, a: L.Point, b: L.Point): { point: L.Point; t: number } {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;

  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return { point: a, t: 0 };

  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));
  return { point: L.point(a.x + abx * t, a.y + aby * t), t };
}

export function findNearestNode(
  map: L.Map,
  nodes: NodeSnapInput[],
  cursorPointPx: L.Point,
  thresholdPx = 12,
): SnapCandidate | null {
  const thr2 = thresholdPx * thresholdPx;

  let best: { nodeId: string; latlng: L.LatLng; d2: number } | null = null;

  for (const n of nodes) {
    const pt = map.latLngToContainerPoint(n.latlng);
    const d = dist2(pt, cursorPointPx);
    if (d <= thr2 && (!best || d < best.d2)) {
      best = { nodeId: n.nodeId, latlng: n.latlng, d2: d };
    }
  }

  return best ? { kind: 'node', nodeId: best.nodeId, latlng: best.latlng } : null;
}

export function findNearestPipe(
  map: L.Map,
  pipes: PipeSnapInput[],
  cursorPointPx: L.Point,
  thresholdPx = 12,
  vertexThresholdPx = 10,
): SnapCandidate | null {
  const thr2 = thresholdPx * thresholdPx;
  const vthr2 = vertexThresholdPx * vertexThresholdPx;

  let best:
    | {
        pipeId: string;
        latlng: L.LatLng;
        vertexIndex?: number;
        d2: number;
      }
    | null = null;

  for (const p of pipes) {
    if (p.latlngs.length < 2) continue;

    // vertex snap first
    for (let i = 0; i < p.latlngs.length; i++) {
      const vPt = map.latLngToContainerPoint(p.latlngs[i]);
      const d = dist2(vPt, cursorPointPx);
      if (d <= vthr2 && (!best || d < best.d2)) {
        best = { pipeId: p.pipeId, latlng: p.latlngs[i], vertexIndex: i, d2: d };
      }
    }

    // segment snap
    for (let i = 0; i < p.latlngs.length - 1; i++) {
      const a = map.latLngToContainerPoint(p.latlngs[i]);
      const b = map.latLngToContainerPoint(p.latlngs[i + 1]);
      const { point } = closestPointOnSegmentPx(cursorPointPx, a, b);
      const d = dist2(point, cursorPointPx);
      if (d <= thr2 && (!best || d < best.d2)) {
        best = {
          pipeId: p.pipeId,
          latlng: map.containerPointToLatLng(point),
          d2: d,
        };
      }
    }
  }

  return best
    ? { kind: 'pipe', pipeId: best.pipeId, latlng: best.latlng, vertexIndex: best.vertexIndex }
    : null;
}
