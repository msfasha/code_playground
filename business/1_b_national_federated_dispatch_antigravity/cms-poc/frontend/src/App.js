import React from "react";
import { IncidentProvider } from "./context/IncidentContext";
import IncidentList from "./components/IncidentList";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  return (
    <IncidentProvider>
      <div className="app-container">
        <div className="left-panel">
          <h2>Incident Operations</h2>
          <IncidentList />
        </div>
        <div className="right-panel">
          <MapView />
        </div>
      </div>
    </IncidentProvider>
  );
}

export default App;
