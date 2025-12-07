# Crisis Management System - Consolidated Requirements

**Version:** 1.0  
**Date:** 2025  
**Project:** Multi-Agency, Multi-Jurisdiction Crisis Management System (CMS) MVP

---

## 1. Project Vision

A unified digital platform for efficient coordination, information sharing, and situational awareness among multiple Jordanian agencies during crisis and emergency events. The system enables real-time decision-making, resource allocation, and inter-agency communication across jurisdictions.

**Primary User Role:** Crisis Management Center Administrator (human user who sends commands and receives feedback from agencies)

---

## 2. Core System Features (Phase 1 MVP)

### 2.1 Incident Metadata Management

**Essential Fields:**
- Incident ID (auto-generated)
- Title/Description
- Type (Traffic, Fire, Flood, Medical, Infrastructure, etc.)
- Severity level
- Date and time
- Location (GIS coordinates - lat/lng)
- Status (Reported → Verified → Responding → Contained → Closed)
- Reporting agency and user
- Attachments (images, documents, videos)

**Functionality:**
- Create, view, update, and close incidents
- Change history/audit trail
- Basic filtering and search

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

- **Real-time messaging** - Messages appear instantly in chat interface
- **Message history** - All messages stored with audit trail

### 2.3 GIS Mapping

**Core Functionality:**
- Interactive map displaying incidents as markers/points
- Click incident in list → map automatically zooms to location
- Click marker on map → incident details load in panel
- Basic filtering by type, status, agency
- Synchronized views (list and map stay in sync)
- Support for point-based incidents (polygon support deferred to later phases)

---

## 3. User Interface Design

### 3.1 Split-Screen Layout

**Current POC Structure:**
- **Left Panel:** Incident Operations
  - Incident list
  - Selected incident details
  - Action buttons (update, dispatch, close)
  - Agency collaboration tools (messaging integrated here)

- **Right Panel:** GIS Map
  - Interactive map view
  - Incident markers
  - Map controls and filters

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

---

## 4. Technical Stack

### 4.1 Phase 1 (Local Development)

**Backend:**
- Node.js with Express
- PostgreSQL with PostGIS extension
- WebSocket (Socket.io) for real-time updates
- AI Integration: OpenAI API or similar for agency response simulation

**Frontend:**
- React with Context API for state management
- Leaflet for GIS mapping
- Web Speech API for voice input and transcription
- Socket.io client for real-time communication

**Database:**
- PostgreSQL 16+ with PostGIS
- Tables: incidents, agencies, messages, audit_logs

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

## 5. Jordanian Agencies

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

---

## 6. Implementation Phases

### Phase 1: MVP - Core Functionality (Local)
- Incident metadata management
- Agency messaging with AI simulation
- Voice command input with transcription
- GIS mapping with synchronization
- Split-screen interface
- PostgreSQL with PostGIS

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
- Advanced GIS features
- Mobile app
- External integrations
- Analytics and reporting

---

## 7. Key Design Principles

1. **Simplicity First** - Focus on demonstrating concepts rather than building a fully production-ready system
2. **Iterative Development** - Each phase builds upon the previous one
3. **Jordanian Context** - Use Jordanian agency names and Arabic language support
4. **AI Simulation** - Keep AI agency responses simple and contextual
5. **Voice Input** - Use browser-based Web Speech API for simplicity
6. **Real-time Updates** - WebSocket for live synchronization across all views

---

## 8. Success Criteria for Phase 1 MVP

- User can create and manage incidents
- User can send text and voice messages in incident threads
- AI generates contextual responses from Jordanian agencies
- Voice messages display with icon, transcript, and metadata
- Map and list views stay synchronized
- All data persists in PostgreSQL database
- System runs locally and demonstrates core concept

---

## 9. Out of Scope for MVP

- Full user authentication system (deferred to Phase 2)
- Advanced GIS features (polygons, geofencing - deferred)
- Mobile app (future phase)
- External system integrations (future phase)
- Advanced analytics and reporting (future phase)
- Multi-language UI switching (Arabic/English - future enhancement)
- Production-grade security hardening (concept demonstration focus)

---

## 10. References

- Original requirements: `readme.md`, `srs.md`, `Concept of Operations.md`
- UI design: `dual_web_screen.md`
- Architecture: `System Architecture Data.md`, `technology stack.md`
- Implementation plan: See phased MVP plan document


