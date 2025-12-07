# Crisis Management System - Complete Requirements Document

**Version:** 1.0  
**Date:** 2025  
**Project:** Multi-Agency, Multi-Jurisdiction Crisis Management System (CMS) MVP

---

## Table of Contents

1. [Project Vision](#1-project-vision)
2. [Core System Features (Phase 1 MVP)](#2-core-system-features-phase-1-mvp)
3. [User Interface Design](#3-user-interface-design)
4. [Technical Stack](#4-technical-stack)
5. [System Architecture](#5-system-architecture)
6. [Jordanian Agencies](#6-jordanian-agencies)
7. [Implementation Phases](#7-implementation-phases)
8. [Operational Scenarios](#8-operational-scenarios)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Project Vision

A unified digital platform for efficient coordination, information sharing, and situational awareness among multiple Jordanian agencies during crisis and emergency events. The system enables real-time decision-making, resource allocation, and inter-agency communication across jurisdictions.

**Primary User Role:** Crisis Management Center Administrator (human user who sends commands and receives feedback from agencies)

**Key Objectives:**
1. Enable timely creation, reporting, and management of incident records
2. Facilitate seamless collaboration among agencies with well-defined roles and permissions
3. Provide a clear operational picture through an integrated geographic information system (GIS)
4. Support jurisdiction-based workflows and automated routing of incident information
5. Enhance transparency, accountability, and coordination in multi-agency responses

---

## 2. Core System Features (Phase 1 MVP)

### 2.1 Incident Metadata Management

**Essential Fields:**
- Incident ID (auto-generated)
- Title/Description
- Type (Traffic, Fire, Flood, Medical, Infrastructure, etc.)
- Severity level (Low, Medium, High, Critical)
- Date and time
- Location (GIS coordinates - lat/lng, with future polygon support)
- Status (Reported → Verified → Responding → Contained → Closed)
- Reporting agency and user
- Attachments (images, documents, videos)

**Functionality:**
- Create, view, update, and close incidents
- Change history/audit trail
- Basic filtering and search
- Incident lifecycle tracking

### 2.2 Agency Messaging/Chatting with AI Simulation

**Key Features:**
- **Incident-specific chat threads** - Each incident has its own messaging thread
- **AI-simulated agency responses** - When the Crisis Management Center admin sends commands, AI generates contextual responses from Jordanian agencies:
  - Public Security Directorate (PSD) - دائرة الأمن العام
  - Civil Defense Directorate - الدفاع المدني
  - Ministry of Health (MoH) - وزارة الصحة
  - Ministry of Public Works (MoPW) - وزارة الأشغال العامة
  - Armed Forces - القوات المسلحة
  - Governorate Headquarters - مقر المحافظة

- **Voice command input:**
  - Users can record voice messages (Arabic support)
  - Voice messages appear in chat with:
    - Microphone icon indicator
    - Transcript displayed below icon (Arabic transcription)
    - Timestamp and user information
  - Voice input button in messaging interface

- **Real-time messaging** - Messages appear instantly in chat interface via WebSocket
- **Message history** - All messages stored with audit trail

### 2.3 GIS Mapping

**Core Functionality:**
- Interactive map displaying incidents as markers/points
- Click incident in list → map automatically zooms to location
- Click marker on map → incident details load in panel
- Basic filtering by type, status, agency
- Synchronized views (list and map stay in sync)
- Support for point-based incidents (polygon support deferred to later phases)
- Color-coded markers based on incident status

---

## 3. User Interface Design

### 3.1 Split-Screen Layout

**Current Structure:**
- **Left Panel (50%):** Incident Operations
  - Top section: Incident list with create button
  - Bottom section: Selected incident details with integrated messaging
  
- **Right Panel (50%):** GIS Map
  - Interactive map view with Leaflet
  - Incident markers
  - Filter controls (type, status)
  - Map controls and zoom

**Phase 3 Enhancement:**
- Enhanced split-screen with better integration
- Resizable panels
- Improved messaging interface within incident details panel

### 3.2 Voice Input Interface

- Voice recording button (microphone icon)
- Visual indicator when recording
- Display format for voice messages:
  ```
  [Mic Icon] Voice Message
  [Transcript in Arabic]
  [Timestamp] [User]
  ```

### 3.3 Synchronization

- State management using React Context API
- WebSocket for real-time updates across all panels
- Automatic refresh when incidents are created/updated
- Bidirectional synchronization (list ↔ map ↔ details)

---

## 4. Technical Stack

### 4.1 Phase 1 (Local Development)

**Backend:**
- Node.js with Express
- PostgreSQL with PostGIS extension
- WebSocket (Socket.io) for real-time updates
- AI Integration: OpenAI API or similar for agency response simulation (with fallback)

**Frontend:**
- React with Context API for state management
- Leaflet for GIS mapping
- Web Speech API for voice input and transcription
- Socket.io client for real-time communication
- Axios for HTTP requests

**Database:**
- PostgreSQL 16+ with PostGIS
- Tables: incidents, agencies, messages, audit_logs, incident_attachments

**Authentication:**
- Deferred to Phase 2 (simple concept demonstration for MVP)

### 4.2 Phase 2 (Cloud Deployment)

- Google Cloud Run for backend and frontend
- Cloud SQL (PostgreSQL with PostGIS)
- Docker containerization
- CI/CD with Cloud Build

### 4.3 Future Phases

- User authentication and RBAC
- Advanced GIS features (polygons, geofencing)
- Mobile app
- External system integrations
- Advanced analytics

---

## 5. System Architecture

### 5.1 Core Components

1. **CMS Core Application Server**
   - Hosts web services, business logic, and workflow engine
   - Processes incident creation, routing, and notifications
   - RESTful API endpoints
   - WebSocket server for real-time updates

2. **Central Database (with GIS Extension)**
   - Stores incident data, user roles, audit logs, and spatial data (PostGIS)
   - PostgreSQL with PostGIS extension

3. **GIS Engine**
   - Provides mapping, geofencing, and spatial analysis
   - Leaflet-based interactive maps
   - Future: Integration with external national GIS servers

4. **Notification Gateway** (Future)
   - Handles outbound SMS, email, and push notifications

5. **API Gateway / Integration Layer** (Future)
   - Exposes REST APIs for external systems
   - Enables bidirectional data exchange

### 5.2 Data Flow

**Step 1: Incident Creation**
- User creates incident in web interface
- Data flows: User Interface → Application Server → Database
- WebSocket event emitted to all connected clients

**Step 2: Incident Classification & Routing**
- System classifies incident by type and location
- Determines relevant agencies (future: automated routing)

**Step 3: Agency Communication**
- User sends message (text or voice)
- AI generates agency response
- Messages stored in database
- WebSocket updates all connected clients

**Step 4: GIS & Visualization**
- GIS queries location data
- Displays incidents on operational map
- Synchronizes with list and details views

**Step 5: Security & Audit**
- All transactions logged in audit database
- Data exchanges over HTTPS (TLS)
- Future: Token-based authentication

---

## 6. Jordanian Agencies

**Primary Agencies in System:**
1. Public Security Directorate (PSD) - دائرة الأمن العام
2. Civil Defense Directorate - الدفاع المدني
3. Ministry of Health (MoH) - وزارة الصحة
4. Ministry of Public Works (MoPW) - وزارة الأشغال العامة
5. Armed Forces - القوات المسلحة
6. Governorate Headquarters - مقر المحافظة

**Additional Agencies (Future):**
- Private hospitals
- Utility providers (water, electricity, telecom)
- NGOs and humanitarian responders
- National Centre for Security and Crisis Management (NCSCM)

---

## 7. Implementation Phases

### Phase 1: MVP - Core Functionality (Local)
- ✅ Incident metadata management
- ✅ Agency messaging with AI simulation
- ✅ Voice command input with transcription
- ✅ GIS mapping with synchronization
- ✅ Split-screen interface
- ✅ PostgreSQL with PostGIS
- ✅ WebSocket real-time updates

### Phase 2: Cloud Deployment
- Deploy to Google Cloud Run
- Cloud SQL database
- Docker containerization
- CI/CD pipeline

### Phase 3: Enhanced Split-Screen
- Improved UI/UX
- Better panel integration
- Enhanced messaging interface
- Resizable panels

### Phase 4: Future Enhancements (TBD)
- Authentication and RBAC
- Advanced GIS features (polygons, geofencing)
- Mobile app
- External integrations
- Analytics and reporting
- Automated incident routing
- Jurisdiction management

---

## 8. Operational Scenarios

### Scenario A – Traffic Accident with Multiple Injuries

1. User (Crisis Management Center admin) creates incident in CMS
2. System logs incident with type, location, and severity
3. User sends command via messaging interface
4. AI generates responses from relevant agencies (PSD, Civil Defense, MoH)
5. Incident appears on shared map
6. User monitors responses and updates incident status
7. After resolution, user closes incident with summary

### Scenario B – Flooding in Multiple Districts

1. User creates area incident for flooding
2. System displays incident on map
3. User coordinates with multiple agencies via messaging
4. AI simulates responses from MoPW, Civil Defense, Governorate HQ
5. User tracks progress and updates incident status
6. Incident marked as contained when resolved

### Scenario C – Hospital Overload during Public Event

1. User logs mass-casualty incident
2. User sends messages to coordinate medical response
3. AI generates responses from MoH and hospitals
4. User monitors capacity and coordinates via messaging
5. After stabilization, incident marked contained

---

## 9. Non-Functional Requirements

| Category             | Requirement                                         |
| -------------------- | --------------------------------------------------- |
| **Performance**      | Average response time < 2 seconds under normal load |
| **Availability**     | System uptime ≥ 99.5% (Phase 2+)                    |
| **Scalability**      | Support at least 10,000 concurrent users (future)   |
| **Security**         | Data encryption (TLS 1.3); user audit logging       |
| **Usability**        | Arabic/English interface; responsive web design     |
| **Interoperability** | REST APIs for external system integration           |
| **Reliability**      | Redundant database and failover mechanisms (Phase 2+) |
| **Maintainability**  | Modular architecture; versioned API documentation   |

---

## 10. Future Enhancements

### Short-term (Phase 2-3)
- User authentication and role-based access control (RBAC)
- Advanced GIS features (polygons, geofencing, routing)
- Enhanced UI with resizable panels
- Multi-language interface (Arabic/English switching)

### Medium-term (Phase 4+)
- Mobile app for field responders
- External system integrations (dispatch, hospital ER, weather)
- Automated incident routing based on type and jurisdiction
- Advanced analytics and reporting dashboards
- Predictive analytics and risk modeling
- Integration with drones and IoT sensors

### Long-term
- AI-assisted incident classification and prioritization
- Real-time unit tracking (police cars, ambulances via GPS)
- Drag-and-drop dispatching interface
- Geofencing alerts
- Time-tracking dashboards for response analysis
- Integration with national GIS infrastructure

---

## 11. Key Design Principles

1. **Simplicity First** - Focus on demonstrating concepts rather than building a fully production-ready system
2. **Iterative Development** - Each phase builds upon the previous one
3. **Jordanian Context** - Use Jordanian agency names and Arabic language support
4. **AI Simulation** - Keep AI agency responses simple and contextual
5. **Voice Input** - Use browser-based Web Speech API for simplicity
6. **Real-time Updates** - WebSocket for live synchronization across all views
7. **Modular Architecture** - Components can be enhanced independently

---

## 12. Success Criteria for Phase 1 MVP

- ✅ User can create and manage incidents
- ✅ User can send text and voice messages in incident threads
- ✅ AI generates contextual responses from Jordanian agencies
- ✅ Voice messages display with icon, transcript, and metadata
- ✅ Map and list views stay synchronized
- ✅ All data persists in PostgreSQL database
- ✅ System runs locally and demonstrates core concept
- ✅ Real-time updates via WebSocket

---

## 13. Out of Scope for MVP

- Full user authentication system (deferred to Phase 2)
- Advanced GIS features (polygons, geofencing - deferred)
- Mobile app (future phase)
- External system integrations (future phase)
- Advanced analytics and reporting (future phase)
- Multi-language UI switching (Arabic/English - future enhancement)
- Production-grade security hardening (concept demonstration focus)
- Automated incident routing (future phase)
- Jurisdiction management (future phase)

---

## 14. Definitions and Acronyms

| Term  | Definition                        |
| ----- | --------------------------------- |
| CMS   | Crisis Management System          |
| GIS   | Geographic Information System     |
| RBAC  | Role-Based Access Control         |
| API   | Application Programming Interface |
| PSD   | Public Security Directorate       |
| MoH   | Ministry of Health                |
| MoPW  | Ministry of Public Works          |
| GovHQ | Governorate Headquarters          |
| NCSCM | National Centre for Security and Crisis Management |

---

## 15. References

- National Crisis and Disaster Management Framework (Jordan)
- ISO 22320:2018 – Emergency Management Guidelines
- ISO/IEC 27001 – Information Security Management
- Jordan Open Data & National GIS Infrastructure standards

---

**Note:** This document consolidates all requirements from the original documentation. For historical reference, original documents are archived in the `docs/archive/` folder.

