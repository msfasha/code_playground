import React, { useEffect, useContext } from "react";
import axios from "axios";
import { IncidentContext } from "../context/IncidentContext";

const IncidentList = () => {
  const { incidents, setIncidents, setSelectedIncident, selectedIncident } = useContext(IncidentContext);

  useEffect(() => {
    axios.get("http://localhost:4000/api/incidents").then(res => setIncidents(res.data));
  }, [setIncidents]);

  return (
    <div>
      {incidents.map(incident => (
        <div
          key={incident.id}
          style={{
            padding: "10px",
            margin: "5px 0",
            border: incident.id === selectedIncident?.id ? "2px solid #007bff" : "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => setSelectedIncident(incident)}
        >
          <h4>{incident.title}</h4>
          <p><b>Type:</b> {incident.type}</p>
          <p><b>Status:</b> {incident.status}</p>
          <p><b>Agency:</b> {incident.agency}</p>
        </div>
      ))}
    </div>
  );
};

export default IncidentList;
