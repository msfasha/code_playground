import React, { useState } from 'react';
import type { Zone, ParsedNetwork } from '../utils/epanetParser';
import { epanetParser } from '../utils/epanetParser';

interface ZoneManagerProps {
  network: ParsedNetwork;
  networkId: string | null;
  networkFile: File | null;
  onZoneUpdate: (updatedNetwork: ParsedNetwork) => void;
  onZoneSelect?: (zone: Zone) => void;
}

const API_ROOT = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const API_BASE = API_ROOT.replace(/\/$/, '');
const API = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

export const ZoneManager: React.FC<ZoneManagerProps> = ({
  network,
  networkId,
  networkFile,
  onZoneUpdate,
  onZoneSelect
}) => {
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editZoneName, setEditZoneName] = useState('');
  
  const zones = network.zones || [];
  
  const handleEditZone = (zone: Zone) => {
    setEditingZoneId(zone.id);
    setEditZoneName(zone.name);
  };
  
  const updateBackendFile = async (updatedZones: Zone[]) => {
    if (!networkId || !networkFile) return;
    
    try {
      // Read original file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(networkFile);
      });
      
      // Update file content with zones
      const updatedContent = epanetParser.writeZonesToINP(fileContent, updatedZones);
      
      // Send to backend
      const response = await fetch(`${API}/network/${networkId}/zones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
      });
      
      if (!response.ok) {
        console.error('Failed to update zones in backend file');
      } else {
        console.log('Zones updated in backend file');
      }
    } catch (error) {
      console.error('Error updating zones in backend:', error);
      // Don't fail the operation - zones are still saved in localStorage
    }
  };
  
  const handleSaveEdit = async () => {
    if (!editingZoneId || !editZoneName.trim()) return;
    
    const updatedZones = zones.map(zone =>
      zone.id === editingZoneId
        ? { ...zone, name: editZoneName.trim() }
        : zone
    );
    
    const updatedNetwork: ParsedNetwork = {
      ...network,
      zones: updatedZones
    };
    
    onZoneUpdate(updatedNetwork);
    await updateBackendFile(updatedZones);
    setEditingZoneId(null);
    setEditZoneName('');
  };
  
  const handleCancelEdit = () => {
    setEditingZoneId(null);
    setEditZoneName('');
  };
  
  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) {
      return;
    }
    
    const updatedZones = zones.filter(zone => zone.id !== zoneId);
    const updatedNetwork: ParsedNetwork = {
      ...network,
      zones: updatedZones
    };
    
    onZoneUpdate(updatedNetwork);
    await updateBackendFile(updatedZones);
  };
  
  const handleZoneClick = (zone: Zone) => {
    if (onZoneSelect) {
      onZoneSelect(zone);
    }
  };
  
  if (zones.length === 0) {
    return (
      <div className="zone-manager">
        <h4>Zones</h4>
        <div className="no-zones-message">
          No zones created yet. Use "Create Zone" to add zones.
        </div>
      </div>
    );
  }
  
  return (
    <div className="zone-manager">
      <h4>Zones ({zones.length})</h4>
      <div className="zone-list">
        {zones.map(zone => (
          <div key={zone.id} className="zone-item">
            {editingZoneId === zone.id ? (
              <div className="zone-edit-form">
                <input
                  type="text"
                  value={editZoneName}
                  onChange={(e) => setEditZoneName(e.target.value)}
                  className="zone-edit-input"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                />
                <div className="zone-edit-buttons">
                  <button onClick={handleSaveEdit} className="save-edit-btn" disabled={!editZoneName.trim()}>
                    ✓
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-edit-btn">
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="zone-info"
                  onClick={() => handleZoneClick(zone)}
                  style={{ cursor: onZoneSelect ? 'pointer' : 'default' }}
                >
                  <div className="zone-name">{zone.name}</div>
                  <div className="zone-stats">
                    {zone.pipes.length} pipe{zone.pipes.length !== 1 ? 's' : ''}, {zone.junctions.length} junction{zone.junctions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="zone-actions">
                  <button 
                    onClick={() => handleEditZone(zone)}
                    className="edit-zone-btn"
                    title="Edit zone name"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteZone(zone.id)}
                    className="delete-zone-btn"
                    title="Delete zone"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <style>{`
        .zone-manager {
          background: white;
          border-radius: 6px;
          padding: 0.75rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }
        
        .zone-manager h4 {
          margin: 0 0 0.75rem 0;
          color: #333;
          font-size: 0.95rem;
          font-weight: 600;
        }
        
        .no-zones-message {
          color: #666;
          font-size: 0.85rem;
          padding: 0.5rem 0;
          text-align: center;
        }
        
        .zone-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .zone-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          background-color: #f8f9fa;
          transition: background-color 0.2s ease;
        }
        
        .zone-item:hover {
          background-color: #e9ecef;
        }
        
        .zone-info {
          flex: 1;
          min-width: 0;
        }
        
        .zone-name {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .zone-stats {
          font-size: 0.75rem;
          color: #666;
        }
        
        .zone-actions {
          display: flex;
          gap: 0.25rem;
        }
        
        .zone-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          font-size: 0.9rem;
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        
        .zone-actions button:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .zone-edit-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }
        
        .zone-edit-input {
          flex: 1;
          padding: 0.25rem 0.5rem;
          border: 2px solid #22c55e;
          border-radius: 3px;
          font-size: 0.9rem;
        }
        
        .zone-edit-input:focus {
          outline: none;
          border-color: #16a34a;
        }
        
        .zone-edit-buttons {
          display: flex;
          gap: 0.25rem;
        }
        
        .zone-edit-buttons button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          font-size: 0.9rem;
          border-radius: 3px;
          font-weight: bold;
        }
        
        .save-edit-btn {
          color: #22c55e;
        }
        
        .save-edit-btn:hover:not(:disabled) {
          background-color: rgba(34, 197, 94, 0.1);
        }
        
        .save-edit-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .cancel-edit-btn {
          color: #dc3545;
        }
        
        .cancel-edit-btn:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }
      `}</style>
    </div>
  );
};

