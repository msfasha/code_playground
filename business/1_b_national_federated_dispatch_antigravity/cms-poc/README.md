# CMS POC

A browser-based split-screen crisis operations dashboard.

## Structure

```
cms-poc/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   └── data/
│       └── incidents.json
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── components/
│       │   ├── IncidentList.js
│       │   └── MapView.js
│       └── context/
│           └── IncidentContext.js
└── README.md
```

## Backend — Node.js + Express

File: `backend/server.js`

- Serves `/api/incidents` from an in-memory list.

Install & Run:

```bash
cd backend
npm install
npm start
```

## Frontend — React + Leaflet

Create and run the app:

```bash
cd frontend
npm install
npm start
```

Then open http://localhost:3000

## Expected Behavior

- The left panel lists all active incidents.
- Clicking an incident centers and zooms the map to its location.
- Clicking a marker on the map highlights that incident on the left.
- Both panels remain synchronized.
