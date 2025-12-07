import React from "react";
import { IncidentProvider } from "./context/IncidentContext";
import IncidentList from "./components/IncidentList";
import IncidentDetails from "./components/IncidentDetails";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  return (
    <IncidentProvider>
      <div className="app-container">
        <div className="left-panel">
          <div style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Incident Operations</h2>
          </div>
          <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
            <div style={{ width: '40%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
              <IncidentList />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <IncidentDetails />
            </div>
          </div>
        </div>
        <div className="right-panel">
          <MapView />
        </div>
      </div>
    </IncidentProvider>
  );
}

export default App;
