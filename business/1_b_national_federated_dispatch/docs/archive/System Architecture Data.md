## System Architecture & Data Flow (Concept)

### 1. Core Components

1. **CMS Core Application Server**

   * Hosts web services, business logic, and workflow engine.
   * Processes incident creation, routing, and notifications.

2. **Central Database (with GIS Extension)**

   * Stores incident data, user roles, audit logs, and spatial data (PostGIS or equivalent).

3. **GIS Engine**

   * Provides mapping, geofencing, and spatial analysis.
   * Integrates with external national GIS servers.

4. **Notification Gateway**

   * Handles outbound SMS, email, and push notifications.

5. **API Gateway / Integration Layer**

   * Exposes REST APIs for external systems (e.g., hospitals, dispatch, weather services).
   * Enables bidirectional data exchange.

---

### 2. External Systems & Data Sources

1. **Agency Systems**

   * **PSD Dispatch**: Sends and receives incident status updates.
   * **Civil Defense**: Integrates rescue operation data.
   * **MoH Hospital Systems**: Share bed capacity, ambulance status.
   * **MoPW Infrastructure Systems**: Report road closures or structural damage.

2. **Geospatial and Environmental Data Sources**

   * National GIS and mapping databases.
   * Meteorological data (weather, rainfall, flood warnings).
   * IoT sensors or remote monitoring stations (future integration).

3. **User Interfaces**

   * Web Application (multi-agency portal).
   * Mobile Application (field responders).
   * Command Center Dashboards (for NCSCM and governorates).

---

### 3. Data Flow Overview

**Step 1: Incident Creation**
A user (dispatcher, officer, or automated system) creates an incident in the CMS portal. Data flows from the **User Interface → Application Server → Database**.

**Step 2: Incident Classification & Routing**
The CMS Core consults configuration tables to determine:

* Incident type
* Geographic jurisdiction
* Relevant agencies and dispatch groups

The CMS then routes notifications and data via the **API Gateway** and **Notification Gateway**.

**Step 3: Agency Integration**
External agency systems receive incident data (JSON/XML via REST API). Agencies can acknowledge, update, or close incidents directly through:

* Their own integrated systems, or
* The CMS web portal interface.

**Step 4: GIS & Visualization**
The GIS Engine queries location and jurisdiction data to display incidents on the operational map.
Spatial data and layers are requested from **National GIS servers** and rendered in the CMS dashboard.

**Step 5: Analytics & Reporting**
All incident data flows to the **Analytics Service**, which aggregates data for dashboards, KPIs, and historical reports.

**Step 6: Security & Audit**
Every transaction is logged in the **Audit Database**, and data exchanges occur over **HTTPS (TLS 1.3)** with **token-based authentication**.

---

### 4. Key Data Flows (Summary Table)

| Source             | Destination             | Data Type               | Protocol / Method         |
| ------------------ | ----------------------- | ----------------------- | ------------------------- |
| CMS Web/Mobile App | Application Server      | Incident data input     | HTTPS (REST API)          |
| Application Server | Database                | CRUD operations         | SQL/PostGIS               |
| Application Server | Notification Gateway    | Alert payloads          | HTTPS/SMTP/SMS API        |
| Application Server | External Agency Systems | Incident updates        | REST API (JSON/XML)       |
| External Systems   | API Gateway             | Status, feedback        | REST API (JSON)           |
| GIS Engine         | CMS Web App             | Map layers, coordinates | Web Map Service (WMS/WFS) |
| Analytics Engine   | Dashboard               | Aggregated metrics      | API / WebSocket           |


