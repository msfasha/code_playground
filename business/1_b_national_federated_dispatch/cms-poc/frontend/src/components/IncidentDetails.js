import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { IncidentContext } from '../context/IncidentContext';
import MessageList from './MessageList';

const IncidentDetails = () => {
  const { selectedIncident, setSelectedIncident } = useContext(IncidentContext);
  const [incident, setIncident] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedIncident) {
      loadIncidentDetails();
    } else {
      setIncident(null);
    }
  }, [selectedIncident]);

  const loadIncidentDetails = async () => {
    if (!selectedIncident?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:4000/api/incidents/${selectedIncident.id}`);
      setIncident(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error loading incident details:', error);
    }
  };

  const handleUpdate = async () => {
    if (!incident) return;
    
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/incidents/${incident.id}`, editForm);
      await loadIncidentDetails();
      setIsEditing(false);
      // Refresh incident in context
      if (setSelectedIncident) {
        setSelectedIncident({ ...incident, ...editForm });
      }
    } catch (error) {
      console.error('Error updating incident:', error);
      alert('Failed to update incident');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!incident) return;
    
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/incidents/${incident.id}`, {
        status: newStatus
      });
      await loadIncidentDetails();
      if (setSelectedIncident) {
        setSelectedIncident({ ...incident, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedIncident) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Select an incident to view details
      </div>
    );
  }

  if (!incident) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading incident details...
      </div>
    );
  }

  const statusColors = {
    'Reported': '#ff9800',
    'Verified': '#2196f3',
    'Responding': '#9c27b0',
    'Contained': '#4caf50',
    'Closed': '#757575'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        padding: '15px', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#fff',
        overflowY: 'auto',
        flex: '0 0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>{incident.title}</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Title
              </label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Type
              </label>
              <select
                value={editForm.type || ''}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Traffic">Traffic</option>
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Medical">Medical</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                Severity
              </label>
              <select
                value={editForm.severity || ''}
                onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              style={{
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ 
                display: 'inline-block',
                padding: '5px 10px',
                borderRadius: '4px',
                backgroundColor: statusColors[incident.status] || '#999',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {incident.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
              <strong>Type:</strong> {incident.type}
            </div>
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
              <strong>Severity:</strong> {incident.severity}
            </div>
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
              <strong>Agency:</strong> {incident.agency}
            </div>
            {incident.description && (
              <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                <strong>Description:</strong>
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {incident.description}
                </div>
              </div>
            )}
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
              <strong>Location:</strong> {incident.lat?.toFixed(4)}, {incident.lng?.toFixed(4)}
            </div>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {['Reported', 'Verified', 'Responding', 'Contained', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isLoading || incident.status === status}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: isLoading || incident.status === status ? 'not-allowed' : 'pointer',
                    backgroundColor: incident.status === status ? statusColors[status] : 'white',
                    color: incident.status === status ? 'white' : '#333',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, borderTop: '1px solid #ddd' }}>
        <MessageList incidentId={incident.id} />
      </div>
    </div>
  );
};

export default IncidentDetails;


