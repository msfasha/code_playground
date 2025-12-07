## 1. Objective

Create a **single web application interface** composed of two synchronized modules:

1. **Operational Panel** – for managing incidents (list, details, updates, task assignments).
2. **GIS Map Panel** – for spatial visualization of the same incidents in real time.

Whenever a user **creates, selects, or updates** an incident in one panel, the other panel updates automatically.

---

## 2. Interface Design Concept

**Layout Structure:**

```
--------------------------------------------------------
|        Top Bar / Header (search, filters, controls)   |
--------------------------------------------------------
| Operational Panel |          GIS Map Panel            |
| (left pane)       |          (right pane)             |
|-------------------------------------------------------|
| - Incident list                                      |
| - Selected incident details                          |
| - Action buttons (update, dispatch, close)           |
| - Agency collaboration tools                         |
|-------------------------------------------------------|
| [Optional: resizable split divider between panels]   |
--------------------------------------------------------
```

**UX Interaction Example:**

* A dispatcher clicks on an incident in the left panel → the right GIS map automatically zooms to that incident’s coordinates.
* A user clicks a marker on the map → the left panel loads the incident’s operational data.
* Filters (type, status, agency, jurisdiction) apply to both panels simultaneously.

---

## 3. Implementation Architecture

### 3.1 Frontend Synchronization

Use a **state management layer** (shared memory within the browser) so both panels stay in sync.

* If using **React**, use **Redux** or **Recoil** for shared state.
* If using **Angular**, use a **shared service with RxJS observables**.

Example:

* Incident selection updates the `currentIncident` object in the shared state.
* Both panels subscribe to this state; when it changes, both update accordingly.

**Pseudocode (React example):**

```js
// Shared incident state using Redux
const [selectedIncident, setSelectedIncident] = useState(null);

// Left panel: when incident clicked
onIncidentClick = (incident) => setSelectedIncident(incident);

// Right panel: subscribe to selectedIncident
useEffect(() => {
  if (selectedIncident) map.zoomTo(selectedIncident.location);
}, [selectedIncident]);
```

### 3.2 Real-Time Data Synchronization

To update both panels (and all connected users) when incidents are modified:

* Use **WebSockets** or **SignalR** for real-time updates.
* Backend pushes event messages (e.g., new incident, update, closure) to all connected clients.

**Example:**

* Dispatcher A updates an incident’s status → backend emits an `incidentUpdated` event → all users’ UIs automatically refresh relevant data and map markers.

### 3.3 Modular Frontend Components

Structure the application as **micro frontends** or **modular components**:

* `IncidentListComponent`
* `IncidentDetailsComponent`
* `MapViewComponent`
* `ToolbarComponent`

Each module listens to or emits shared state events.

---

## 4. GIS Integration Approaches

### Option 1: Embedded Map Component

* Integrate the GIS directly within the same web application (React or Angular component).
* Use **OpenLayers**, **Leaflet**, or **ArcGIS JS API**.
* The map div is simply one component within the UI grid.

Advantages:

* Single-page app, easier to keep synchronized.
* Better performance and user experience.

Example:

```html
<div class="split-layout">
  <incident-panel></incident-panel>
  <map-panel></map-panel>
</div>
```

### Option 2: Separate Map Module (iframe or micro frontend)

* Each module (operations & map) runs independently and communicates via browser events or WebSocket.
* Useful if the GIS map is developed by a different team or uses a separate technology stack (e.g., Esri portal).

Synchronization via:

```js
// Window event communication
window.postMessage({type: 'INCIDENT_SELECTED', data: incident});
```

---

## 5. Backend Support

Your backend services should:

* Serve incidents with both **attribute data** and **geometry (lat/lon or polygon)**.
* Provide an endpoint for **WebSocket events** (e.g., `incident_created`, `incident_updated`).
* Allow bidirectional updates (map edits can trigger form updates).

**Example Workflow:**

1. User creates a new incident in operational module → backend stores it → map immediately receives it via WebSocket and plots it.
2. GIS user edits location → backend updates record → operational module updates the location field.

---

## 6. Example Technology Stack for This Setup

| Layer                   | Technology                                                    |
| ----------------------- | ------------------------------------------------------------- |
| Frontend                | React (with Redux) or Angular (with RxJS shared service)      |
| Map Engine              | OpenLayers, Leaflet, or ArcGIS JS API                         |
| Real-Time Communication | WebSocket / SignalR                                           |
| Backend                 | Node.js (NestJS) or .NET Core with REST + WebSocket endpoints |
| Database                | PostgreSQL + PostGIS                                          |
| State Management        | Redux or NgRx (Angular)                                       |
| Notifications           | Toast messages and visual markers on map refresh              |

---

## 7. CAD-like Features (Optional Enhancements)

You can extend the dual-screen setup into a full web-based CAD system by adding:

* **Real-time unit tracking** (e.g., police cars, ambulances via GPS feed).
* **Drag-and-drop dispatching** (from incident list onto unit icons on map).
* **Color-coded statuses** (New, Assigned, En Route, On Scene, Closed).
* **Geofencing** alerts (auto-notify when incidents occur in specific zones).
* **Time-tracking dashboards** for response analysis.

---

## 8. Deployment Considerations

* Use **WebSockets over HTTPS (wss://)** for secure, real-time communication.
* Optimize GIS rendering (limit visible layers and markers).
* Consider a **split-view toggle** (users can expand either panel).
* Use **lazy loading** for large map layers or historical data.
* Store user layout preferences locally (e.g., left-right split ratio, layer visibility).


