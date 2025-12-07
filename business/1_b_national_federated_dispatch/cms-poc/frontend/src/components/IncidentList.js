import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { IncidentContext } from "../context/IncidentContext";

const IncidentList = () => {
  const { incidents, setIncidents, setSelectedIncident, selectedIncident, loadIncidents } = useContext(IncidentContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    type: "Traffic",
    severity: "Medium",
    lat: 31.963158,
    lng: 35.930359
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (loadIncidents) {
      loadIncidents();
    }
  }, [loadIncidents]);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!newIncident.title.trim()) return;

    setIsCreating(true);
    try {
      const response = await axios.post("http://localhost:4000/api/incidents", {
        ...newIncident,
        reportingUser: "Admin"
      });
      
      if (loadIncidents) {
        await loadIncidents();
      }
      
      // Select the newly created incident
      const createdIncident = incidents.find(i => i.id === response.data.id) || 
        { id: response.data.id, ...newIncident };
      setSelectedIncident(createdIncident);
      
      setShowCreateForm(false);
      setNewIncident({
        title: "",
        description: "",
        type: "Traffic",
        severity: "Medium",
        lat: 31.963158,
        lng: 35.930359
      });
    } catch (error) {
      console.error("Error creating incident:", error);
      alert("Failed to create incident");
    } finally {
      setIsCreating(false);
    }
  };

  const statusColors = {
    'Reported': '#ff9800',
    'Verified': '#2196f3',
    'Responding': '#9c27b0',
    'Contained': '#4caf50',
    'Closed': '#757575'
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Incident'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
          <form onSubmit={handleCreateIncident}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Incident Title"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea
                placeholder="Description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
              <select
                value={newIncident.type}
                onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Traffic">Traffic</option>
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Medical">Medical</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={newIncident.severity}
                onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                opacity: isCreating ? 0.6 : 1
              }}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {incidents.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            No incidents. Create one to get started.
          </div>
        ) : (
          incidents.map(incident => (
            <div
              key={incident.id}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: incident.id === selectedIncident?.id ? "2px solid #007bff" : "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: incident.id === selectedIncident?.id ? "#e3f2fd" : "white"
              }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '5px' }}>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{incident.title}</h4>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: statusColors[incident.status] || '#999',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {incident.status}
                </span>
              </div>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><b>Type:</b> {incident.type}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><b>Severity:</b> {incident.severity}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><b>Agency:</b> {incident.agency}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentList;
