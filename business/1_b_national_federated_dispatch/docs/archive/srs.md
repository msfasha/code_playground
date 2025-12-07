# System Requirements Specification (SRS)

**Project:** Multi-Agency, Multi-Jurisdiction Crisis Management System (CMS)
**Version:** 1.0 (Draft)
**Date:** October 2025
**Prepared by:** [Your Organization / Team Name]

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for the Multi-Agency, Multi-Jurisdiction Crisis Management System (CMS). The system enables multiple government and private agencies to coordinate efficiently during crisis and emergency events. It provides capabilities for incident creation, inter-agency coordination, jurisdiction-based routing, and geospatial visualization of events.

### 1.2 Scope

The CMS will serve as a unified national platform used by authorized personnel across public safety, health, defense, infrastructure, and administrative agencies in Jordan.
The system will:

* Allow users to create, manage, and share incident reports.
* Automatically notify and dispatch relevant agencies based on incident type and geographic location.
* Support real-time collaboration and updates across jurisdictions.
* Integrate a GIS module for incident visualization and spatial analysis.
* Maintain secure, auditable records of all actions and communications.

### 1.3 Definitions, Acronyms, and Abbreviations

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

### 1.4 References

* National Crisis and Disaster Management Framework (Jordan)
* ISO 22320:2018 – Emergency Management Guidelines
* ISO/IEC 27001 – Information Security Management
* Esri ArcGIS REST API documentation (if applicable)
* Jordan Open Data & National GIS Infrastructure standards

---

## 2. Overall Description

### 2.1 Product Perspective

The CMS is a new centralized web-based platform with potential mobile extensions. It interfaces with existing systems (e.g., dispatch systems, hospital ER systems, and GIS services) through secure APIs.
The system will include:

* A centralized application server and database
* Web-based frontend for all agencies
* Integrated GIS visualization module
* Notification and messaging subsystem
* Access management and audit modules

### 2.2 Product Functions

At a high level, CMS will:

1. Record, classify, and manage crisis incidents.
2. Route incident notifications based on incident type and jurisdiction.
3. Support collaboration among multiple agencies.
4. Provide real-time geospatial visualization.
5. Maintain audit trails for all actions.
6. Produce analytical and statistical reports.
7. Integrate with external data and alerting systems.

### 2.3 User Characteristics

| User Type             | Description                                          | Typical Access Level |
| --------------------- | ---------------------------------------------------- | -------------------- |
| System Administrator  | Manages system settings, users, and roles            | Full                 |
| Agency Administrator  | Manages users and configurations within their agency | Agency scope         |
| Dispatcher / Operator | Creates and manages incidents, coordinates responses | Operational scope    |
| Field Officer         | Updates incident details from the field              | Limited              |
| Analyst / Observer    | Views incidents and generates reports                | Read-only            |

### 2.4 Constraints

* Must comply with Jordanian government data security regulations.
* Should operate in both Arabic and English.
* Must be accessible via secure internet and private government network.
* System should support both desktop and mobile web access.
* Performance target: system response time ≤ 2 seconds for typical operations.

### 2.5 Assumptions and Dependencies

* Agencies will agree on shared data standards and access permissions.
* Reliable internet connectivity is available at all command centers.
* GIS data layers will be available through national mapping services.
* Authentication may be integrated with a national Single Sign-On (SSO) service.

---

## 3. System Features

### 3.1 Incident Management Module

**Description:**
Allows authorized users to create, update, and close incidents.

**Functional Requirements:**

1. The system shall allow users to create incidents with the following minimum fields:

   * Incident ID (auto-generated)
   * Title / Description
   * Type (predefined categories)
   * Severity level
   * Date and time
   * Location (GIS point or polygon)
   * Reporting agency and user
2. The system shall allow attaching files, images, or videos.
3. The system shall allow authorized agencies to update incident status and details.
4. The system shall maintain a change history for each incident.
5. The system shall support incident closure with final reports and resolution notes.

---

### 3.2 Agency and Jurisdiction Management

**Description:**
Configures participating agencies, their jurisdictions, and dispatch groups.

**Functional Requirements:**

1. The system shall allow administrators to define agencies and assign jurisdictions using GIS polygons.
2. The system shall allow defining dispatch groups within each agency.
3. The system shall route incident notifications automatically based on incident type and location.
4. The system shall allow manual inclusion or exclusion of agencies for specific incidents.

---

### 3.3 GIS Integration

**Description:**
Provides map-based visualization and spatial analysis.

**Functional Requirements:**

1. The system shall display all active and historical incidents on an interactive map.
2. The system shall support point and area (polygon) incident types.
3. The system shall allow overlaying additional map layers (e.g., roads, hospitals, flood zones).
4. The system shall allow filtering incidents by location, type, or severity.
5. The system shall support integration with external GIS services via APIs.

---

### 3.4 Communication and Notification

**Description:**
Enables alerting and messaging between agencies.

**Functional Requirements:**

1. The system shall send automatic notifications to relevant agencies when incidents are created or updated.
2. The system shall support notifications via email, SMS, and in-app alerts.
3. The system shall allow users to communicate via an incident-specific chat or message thread.
4. The system shall allow configurable escalation rules for unacknowledged alerts.

---

### 3.5 Reporting and Analytics

**Description:**
Generates dashboards and analytical reports.

**Functional Requirements:**

1. The system shall display real-time dashboards of active incidents and response metrics.
2. The system shall allow users to export reports in PDF, Excel, or CSV formats.
3. The system shall generate statistical summaries by incident type, region, and agency.
4. The system shall support configurable date ranges and filters for analytics.

---

### 3.6 User and Access Management

**Description:**
Controls system access using roles and permissions.

**Functional Requirements:**

1. The system shall support role-based access control (RBAC).
2. The system shall allow agency administrators to manage their users.
3. The system shall require secure login with optional two-factor authentication.
4. The system shall log all user actions for auditing.

---

## 4. Non-Functional Requirements

| Category             | Requirement                                         |
| -------------------- | --------------------------------------------------- |
| **Performance**      | Average response time < 2 seconds under normal load |
| **Availability**     | System uptime ≥ 99.5%                               |
| **Scalability**      | Support at least 10,000 concurrent users            |
| **Security**         | Data encryption (TLS 1.3); user audit logging; RBAC |
| **Usability**        | Arabic/English interface; responsive web design     |
| **Interoperability** | REST APIs for external system integration           |
| **Reliability**      | Redundant database and failover mechanisms          |
| **Maintainability**  | Modular architecture; versioned API documentation   |

---

## 5. External Interface Requirements

* **User Interface:** Web-based (HTML5/React/Angular or equivalent).
* **GIS Interface:** RESTful services to ArcGIS or OpenLayers.
* **Notification Services:** Integration with SMS gateways and email servers.
* **External Systems:** APIs for integration with hospital ER systems, police dispatch, and weather data feeds.

---

## 6. Data Requirements

* All incident data must be stored in a central database.
* Spatial data must be stored using a GIS-enabled database (e.g., PostGIS).
* Data retention: Minimum 10 years or as per national policy.
* Backup policy: Hourly incremental and daily full backups.

---

## 7. System Architecture (Conceptual)

* **Presentation Layer:** Web and mobile interfaces.
* **Application Layer:** RESTful backend APIs, workflow engine.
* **Database Layer:** Relational and spatial databases.
* **Integration Layer:** API gateway for external systems.
* **Security Layer:** Authentication, authorization, and encryption.

---

## 8. Future Enhancements

* AI-based incident classification and prioritization.
* Integration with drones and IoT sensors for real-time data feeds.
* Predictive modeling for disaster prevention.
* Offline mobile app for field reporting.

---

