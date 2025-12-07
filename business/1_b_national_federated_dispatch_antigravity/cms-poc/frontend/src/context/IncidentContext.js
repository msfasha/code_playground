import { createContext, useState } from "react";

export const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);

  return (
    <IncidentContext.Provider value={{ selectedIncident, setSelectedIncident, incidents, setIncidents }}>
      {children}
    </IncidentContext.Provider>
  );
};
