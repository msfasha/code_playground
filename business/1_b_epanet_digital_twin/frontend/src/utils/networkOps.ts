import type { ParsedNetwork, Junction, Reservoir, Tank, Pipe, Pump, Valve, Coordinate, Vertex } from './epanetParser';
import type { LatLng } from './coordinateTransform';
import { isPalestinianUTM, transformWGS84ToPalestinianUTM } from './coordinateTransform';

export type NetworkCoordSystem = 'utm' | 'wgs84';

export function detectNetworkCoordSystem(network: ParsedNetwork): NetworkCoordSystem {
  for (const c of network.coordinates || []) {
    if (isPalestinianUTM(c.x, c.y)) return 'utm';
  }
  for (const v of network.vertices || []) {
    if (isPalestinianUTM(v.x, v.y)) return 'utm';
  }
  return 'wgs84';
}

function latLngToModelXY(network: ParsedNetwork, latlng: LatLng): { x: number; y: number; system: NetworkCoordSystem } {
  const system = detectNetworkCoordSystem(network);
  if (system === 'utm') {
    const { x, y } = transformWGS84ToPalestinianUTM(latlng.lat, latlng.lng);
    return { x, y, system };
  }
  return { x: latlng.lng, y: latlng.lat, system };
}

function getExistingIds(network: ParsedNetwork, kind: 'junction' | 'reservoir' | 'tank' | 'pipe' | 'pump' | 'valve'): string[] {
  switch (kind) {
    case 'junction':
      return network.junctions.map((x) => x.id);
    case 'reservoir':
      return network.reservoirs.map((x) => x.id);
    case 'tank':
      return network.tanks.map((x) => x.id);
    case 'pipe':
      return network.pipes.map((x) => x.id);
    case 'pump':
      return network.pumps.map((x) => x.id);
    case 'valve':
      return network.valves.map((x) => x.id);
  }
}

function prefixForKind(kind: 'junction' | 'reservoir' | 'tank' | 'pipe' | 'pump' | 'valve'): string {
  switch (kind) {
    case 'junction':
      return 'J';
    case 'reservoir':
      return 'R';
    case 'tank':
      return 'T';
    case 'pipe':
      return 'P';
    case 'pump':
      return 'PU';
    case 'valve':
      return 'V';
  }
}

function maxNumericSuffix(ids: string[], prefix: string): number {
  let max = 0;
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue;
    const rest = id.slice(prefix.length);
    const n = Number.parseInt(rest, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

export function generateNextId(
  network: ParsedNetwork,
  kind: 'junction' | 'reservoir' | 'tank' | 'pipe' | 'pump' | 'valve',
): string {
  const prefix = prefixForKind(kind);
  const ids = getExistingIds(network, kind);
  const next = maxNumericSuffix(ids, prefix) + 1;
  return `${prefix}${next}`;
}

function generateNextNIds(
  network: ParsedNetwork,
  kind: 'junction' | 'reservoir' | 'tank' | 'pipe' | 'pump' | 'valve',
  n: number,
): string[] {
  const prefix = prefixForKind(kind);
  const ids = getExistingIds(network, kind);
  const start = maxNumericSuffix(ids, prefix) + 1;
  return Array.from({ length: n }, (_, i) => `${prefix}${start + i}`);
}

export function replaceNodeKind(
  network: ParsedNetwork,
  nodeId: string,
  nextKind: 'junction' | 'reservoir' | 'tank',
): ParsedNetwork {
  const junction = network.junctions.find((j) => j.id === nodeId) || null;
  const reservoir = network.reservoirs.find((r) => r.id === nodeId) || null;
  const tank = network.tanks.find((t) => t.id === nodeId) || null;

  const nextJunctions = network.junctions.filter((j) => j.id !== nodeId);
  const nextReservoirs = network.reservoirs.filter((r) => r.id !== nodeId);
  const nextTanks = network.tanks.filter((t) => t.id !== nodeId);

  if (!junction && !reservoir && !tank) return network;

  if (nextKind === 'junction') {
    const value: Junction = {
      id: nodeId,
      elevation: junction?.elevation ?? tank?.elevation ?? 0,
      demand: junction?.demand ?? 0,
      pattern: junction?.pattern,
    };
    return { ...network, junctions: [...nextJunctions, value], reservoirs: nextReservoirs, tanks: nextTanks };
  }

  if (nextKind === 'reservoir') {
    const value: Reservoir = {
      id: nodeId,
      head: reservoir?.head ?? 0,
      pattern: reservoir?.pattern,
    };
    return { ...network, junctions: nextJunctions, reservoirs: [...nextReservoirs, value], tanks: nextTanks };
  }

  const value: Tank = {
    id: nodeId,
    elevation: tank?.elevation ?? junction?.elevation ?? 0,
    initLevel: tank?.initLevel ?? 0,
    minLevel: tank?.minLevel ?? 0,
    maxLevel: tank?.maxLevel ?? 0,
    diameter: tank?.diameter ?? 0,
    minVol: tank?.minVol ?? 0,
    volCurve: tank?.volCurve,
  };
  return { ...network, junctions: nextJunctions, reservoirs: nextReservoirs, tanks: [...nextTanks, value] };
}

export function addNode(
  network: ParsedNetwork,
  kind: 'junction' | 'reservoir' | 'tank',
  latlng: LatLng,
  opts?: { splitPipeId?: string; splitAtLatLng?: LatLng },
): { network: ParsedNetwork; nodeId: string } {
  const nodeId = generateNextId(network, kind);
  const { x, y } = latLngToModelXY(network, latlng);

  const coord: Coordinate = { nodeId, x, y };

  let next: ParsedNetwork = {
    ...network,
    coordinates: [...(network.coordinates || []), coord],
  };

  if (kind === 'junction') {
    const j: Junction = { id: nodeId, elevation: 0, demand: 0 };
    next = { ...next, junctions: [...next.junctions, j] };
  } else if (kind === 'reservoir') {
    const r: Reservoir = { id: nodeId, head: 0 };
    next = { ...next, reservoirs: [...next.reservoirs, r] };
  } else {
    const t: Tank = {
      id: nodeId,
      elevation: 0,
      initLevel: 0,
      minLevel: 0,
      maxLevel: 0,
      diameter: 0,
      minVol: 0,
    };
    next = { ...next, tanks: [...next.tanks, t] };
  }

  if (opts?.splitPipeId) {
    const splitAt = opts.splitAtLatLng ?? latlng;
    next = splitPipe(next, opts.splitPipeId, nodeId, splitAt).network;
  }

  return { network: next, nodeId };
}

function getNodeCoord(network: ParsedNetwork, nodeId: string): Coordinate {
  const c = (network.coordinates || []).find((x) => x.nodeId === nodeId);
  if (!c) throw new Error(`Missing coordinate for node ${nodeId}`);
  return c;
}

function getPipeVertices(network: ParsedNetwork, pipeId: string): Vertex[] {
  return (network.vertices || []).filter((v) => v.linkId === pipeId);
}

function dist2XY(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function closestPointOnSegmentXY(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): { x: number; y: number; t: number } {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;

  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return { x: a.x, y: a.y, t: 0 };
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));
  return { x: a.x + abx * t, y: a.y + aby * t, t };
}

function polylineLengthXY(points: Array<{ x: number; y: number }>): number {
  let sum = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    sum += Math.sqrt(dx * dx + dy * dy);
  }
  return sum;
}

export function splitPipe(
  network: ParsedNetwork,
  pipeId: string,
  splitNodeId: string,
  splitLatLng: LatLng,
): { network: ParsedNetwork; newPipeIds: [string, string] } {
  const pipe = network.pipes.find((p) => p.id === pipeId);
  if (!pipe) throw new Error(`Pipe not found: ${pipeId}`);

  const start = getNodeCoord(network, pipe.node1);
  const end = getNodeCoord(network, pipe.node2);
  const verts = getPipeVertices(network, pipeId);

  const poly: Array<{ x: number; y: number; kind: 'start' | 'vertex' | 'end'; vertexIdx?: number }> = [
    { x: start.x, y: start.y, kind: 'start' },
    ...verts.map((v, i) => ({ x: v.x, y: v.y, kind: 'vertex' as const, vertexIdx: i })),
    { x: end.x, y: end.y, kind: 'end' },
  ];

  const { x: sx, y: sy } = latLngToModelXY(network, splitLatLng);
  const splitPt = { x: sx, y: sy };

  // choose closest segment
  let best: { segIdx: number; d2: number; on: { x: number; y: number; t: number } } | null = null;
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i];
    const b = poly[i + 1];
    const on = closestPointOnSegmentXY(splitPt, a, b);
    const d2 = dist2XY({ x: on.x, y: on.y }, splitPt);
    if (!best || d2 < best.d2) best = { segIdx: i, d2, on };
  }

  if (!best) throw new Error(`Pipe has no segments: ${pipeId}`);

  // If very close to an existing vertex, treat it as the split location.
  // This avoids creating odd geometry if the snap was to a vertex.
  const EPS2 = 1e-12;

  let splitAtVertexIdx: number | null = null; // index in verts array
  for (let i = 0; i < verts.length; i++) {
    if (dist2XY({ x: verts[i].x, y: verts[i].y }, splitPt) <= EPS2) {
      splitAtVertexIdx = i;
      break;
    }
  }

  // Partition vertex arrays.
  // - If splitAtVertexIdx !== null, that vertex becomes the node coordinate, so it is removed from vertices.
  // - Else split occurs on a segment between poly[best.segIdx] and poly[best.segIdx+1].
  let leftVerts: Vertex[] = [];
  let rightVerts: Vertex[] = [];

  if (splitAtVertexIdx !== null) {
    leftVerts = verts.slice(0, splitAtVertexIdx);
    rightVerts = verts.slice(splitAtVertexIdx + 1);
  } else {
    // segment index in poly: 0=start->v0, 1=v0->v1, ..., last=vk->end
    // vertices before segment end are <= segIdx-1 (in verts space)
    const leftCount = Math.max(0, best.segIdx); // number of vertices before the segment
    leftVerts = verts.slice(0, leftCount);
    rightVerts = verts.slice(leftCount);
  }

  const [id1, id2] = generateNextNIds(network, 'pipe', 2) as [string, string];

  const totalGeomLen = polylineLengthXY(poly.map((p) => ({ x: p.x, y: p.y })));

  // Approximate geometry lengths for split proportion.
  // Rebuild left/right polylines in model coords using split point as endpoint.
  const leftPolyXY = [
    { x: start.x, y: start.y },
    ...leftVerts.map((v) => ({ x: v.x, y: v.y })),
    splitPt,
  ];
  const rightPolyXY = [
    splitPt,
    ...rightVerts.map((v) => ({ x: v.x, y: v.y })),
    { x: end.x, y: end.y },
  ];

  const leftLen = polylineLengthXY(leftPolyXY);
  const rightLen = polylineLengthXY(rightPolyXY);
  const denom = leftLen + rightLen;
  const leftRatio = denom > 0 ? leftLen / denom : 0.5;
  const rightRatio = 1 - leftRatio;

  const pipe1: Pipe = {
    ...pipe,
    id: id1,
    node1: pipe.node1,
    node2: splitNodeId,
    length: pipe.length > 0 && totalGeomLen > 0 ? pipe.length * leftRatio : pipe.length,
  };

  const pipe2: Pipe = {
    ...pipe,
    id: id2,
    node1: splitNodeId,
    node2: pipe.node2,
    length: pipe.length > 0 && totalGeomLen > 0 ? pipe.length * rightRatio : pipe.length,
  };

  const nextPipes = [...network.pipes.filter((p) => p.id !== pipeId), pipe1, pipe2];

  // Remove old vertices and append new vertices for new pipes.
  const remainingVerts = (network.vertices || []).filter((v) => v.linkId !== pipeId);
  const nextVerts: Vertex[] = [
    ...remainingVerts,
    ...leftVerts.map((v) => ({ ...v, linkId: id1 })),
    ...rightVerts.map((v) => ({ ...v, linkId: id2 })),
  ];

  return {
    network: {
      ...network,
      pipes: nextPipes,
      vertices: nextVerts,
    },
    newPipeIds: [id1, id2],
  };
}

export function addLink(
  network: ParsedNetwork,
  kind: 'pipe' | 'pump' | 'valve',
  startNodeId: string,
  endNodeId: string,
  verticesLatLng: LatLng[],
  opts?: { lengthMeters?: number },
): { network: ParsedNetwork; linkId: string } {
  const linkId = generateNextId(network, kind === 'pipe' ? 'pipe' : kind);

  let next: ParsedNetwork = network;

  if (kind === 'pipe') {
    const p: Pipe = {
      id: linkId,
      node1: startNodeId,
      node2: endNodeId,
      length: opts?.lengthMeters ?? 0,
      diameter: 0,
      roughness: 0,
      minorLoss: 0,
      status: 'Open',
    };
    next = { ...next, pipes: [...next.pipes, p] };
  } else if (kind === 'pump') {
    const p: Pump = {
      id: linkId,
      node1: startNodeId,
      node2: endNodeId,
      parameters: '',
    };
    next = { ...next, pumps: [...next.pumps, p] };
  } else {
    const v: Valve = {
      id: linkId,
      node1: startNodeId,
      node2: endNodeId,
      diameter: 0,
      type: '',
      setting: 0,
      minorLoss: 0,
    };
    next = { ...next, valves: [...next.valves, v] };
  }

  const modelVerts: Vertex[] = verticesLatLng.map((ll) => {
    const { x, y } = latLngToModelXY(next, ll);
    return { linkId, x, y };
  });

  next = { ...next, vertices: [...(next.vertices || []), ...modelVerts] };

  return { network: next, linkId };
}
