import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Listen for incident updates
    newSocket.on("incident_created", () => {
      loadIncidents();
    });

    newSocket.on("incident_updated", (data) => {
      loadIncidents();
      // Update selected incident if it was the one updated
      if (selectedIncident && selectedIncident.id === data.id) {
        loadIncidentDetails(data.id);
      }
    });

    newSocket.on("message_created", (data) => {
      // Refresh messages if this incident is selected
      if (selectedIncident && selectedIncident.id === data.incidentId) {
        // Messages will be reloaded by MessageList component
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Load incidents from API
  const loadIncidents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.error("Error loading incidents:", error);
    }
  };

  // Load single incident details
  const loadIncidentDetails = async (incidentId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/incidents/${incidentId}`);
      setSelectedIncident(response.data);
    } catch (error) {
      console.error("Error loading incident details:", error);
    }
  };

  // Load incidents on mount
  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <IncidentContext.Provider 
      value={{ 
        selectedIncident, 
        setSelectedIncident, 
        incidents, 
        setIncidents,
        loadIncidents,
        socket
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
