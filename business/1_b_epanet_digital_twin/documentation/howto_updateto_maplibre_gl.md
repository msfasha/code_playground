Good, now we are at the **actionable step**. I will be very concrete and pragmatic.

Below I will tell you **exactly which files to touch**, **what their responsibility should become**, and **how to update them** so your architecture becomes *explicitly model-centric* while upgrading the map safely.

I will assume your current structure is roughly as you described earlier (React + Leaflet).

---

# 1. First: Lock the Architectural Rule (Non-Negotiable)

Before touching code, adopt this rule:

> **No file under `components/` is allowed to create, mutate, or infer network topology.**

Components may:

* render
* subscribe
* dispatch commands

They may NOT:

* loop and “construct” pipes
* split geometry
* infer node connections
* attach domain meaning

This rule drives all changes below.

---

# 2. Files You MUST Update (Priority Order)

## A. Network Domain Layer (If Not Already Clean)

### Files

```
src/domain/
  Network.ts
  Node.ts
  Pipe.ts
  Valve.ts
  commands/
```

### What to do

If this layer already exists, **do not weaken it**. Strengthen it.

#### Add explicit command methods

```ts
class Network {
  addPipe(cmd: AddPipeCommand): Network
  insertValve(cmd: InsertValveCommand): Network
  moveNode(cmd: MoveNodeCommand): Network
}
```

Commands should:

* validate
* return a NEW network state (immutable or controlled mutation)

❗ If you currently mutate `network.pipes.push(...)` anywhere outside this layer — that is a bug.

---

## B. Introduce a Map Adapter Layer (NEW)

### Create this folder

```
src/map-adapter/
```

### Add these files

```
src/map-adapter/
  NetworkToGeoJSON.ts
  GeoJSONTypes.ts
```

### Responsibility

This layer does **ONE thing only**:

> Convert **Network → GeoJSON**

Example:

```ts
export function networkToGeoJSON(network: Network) {
  return {
    pipes: {
      type: "FeatureCollection",
      features: network.pipes.map(pipeToFeature),
    },
    valves: {
      type: "FeatureCollection",
      features: network.valves.map(valveToFeature),
    },
    nodes: {
      type: "FeatureCollection",
      features: network.nodes.map(nodeToFeature),
    },
  };
}
```

🚫 No Leaflet
🚫 No Mapbox
🚫 No events
🚫 No mutation

This file becomes **the seam** between truth and visualization.

---

## C. Replace NetworkOverlay.tsx (Critical)

### File to update

```
src/components/NetworkOverlay.tsx
```

### What it does TODAY (wrong)

* Loops over pipes
* Creates Leaflet objects
* Attaches click handlers
* Encodes styling logic

### What it MUST do after change

* Subscribe to **GeoJSON**
* Render via renderer only
* Dispatch commands upward

#### BEFORE (anti-pattern)

```ts
network.pipes.forEach(pipe => {
  L.polyline(...).addTo(map);
});
```

#### AFTER (Leaflet version, transitional)

```ts
const geo = networkToGeoJSON(network);

<L.GeoJSON
  data={geo.pipes}
  onEachFeature={(feature, layer) => {
    layer.on("click", () =>
      dispatch(selectPipe(feature.properties.id))
    );
  }}
/>
```

Notice:

* No loops
* No domain logic
* No geometry math

---

## D. NetworkMap.tsx (Renderer Only)

### File

```
src/components/NetworkMap.tsx
```

### Responsibility (clarified)

* Initialize map
* Host layers
* Handle high-level interactions (pan/zoom)

It must **NOT** know:

* what a pipe is
* how valves behave
* how nodes connect

If you migrate later to MapLibre GL, this file changes again — safely.

---

# 3. How to Prepare for Mapbox / MapLibre Migration

Once the adapter exists, migration becomes trivial.

### Replace

```
NetworkOverlay.tsx (Leaflet)
```

### With

```
MapboxLayers.ts
```

That file will:

```ts
map.addSource("pipes", {
  type: "geojson",
  data: geo.pipes,
});

map.addLayer({
  id: "pipes-layer",
  type: "line",
  source: "pipes",
  paint: { ... },
});
```

💡 The **Network model does not change at all**.

This is the payoff of correctness.

---

# 4. Event Handling: Where Clicks Go Now

### Old (wrong)

```
Leaflet layer → mutate network
```

### New (correct)

```
Map click
  → identify feature id
    → dispatch Command
      → Domain Model updates
        → GeoJSON regenerated
          → Map re-renders
```

Example:

```ts
map.on("click", e => {
  const feature = map.queryRenderedFeatures(e.point)[0];
  dispatch(new SelectElementCommand(feature.properties.id));
});
```

---

# 5. Summary Table (Very Important)

| File                 | Status                        |
| -------------------- | ----------------------------- |
| `Network.ts`         | Authoritative – DO NOT weaken |
| `commands/*`         | Add more, not less            |
| `NetworkOverlay.tsx` | Rewrite to be renderer-only   |
| `NetworkMap.tsx`     | Keep dumb                     |
| `map-adapter/*`      | NEW – critical                |
| Leaflet / Mapbox     | Swappable backend             |

---

# 6. Minimal Step-by-Step Plan (Do This Order)

1. **Add `map-adapter/NetworkToGeoJSON.ts`**
2. Refactor `NetworkOverlay.tsx` to consume GeoJSON
3. Delete all manual loops creating Leaflet objects
4. Ensure NO component mutates `network`
5. Only then consider MapLibre GL migration

---

# 7. Final Reality Check (This Is Why You Were Confused)

epanet-js feels simpler because:

* it skips steps
* it mixes concerns
* it lets the map decide truth

You are building something **harder but correct**.

Once this refactor is done:

* the difference will be obvious
* the Mapbox upgrade will feel trivial
* your system will scale intellectually and technically

---

If you want, next I can:

* Map this **line-by-line** to your actual repo
* Write the first `NetworkToGeoJSON.ts` for you
* Sketch the MapLibre GL version side-by-side with Leaflet

Tell me which one you want.
