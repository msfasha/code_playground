import React, { useState, useEffect, useRef } from 'react';
import type { ParsedNetwork, Pipe, Junction } from '../utils/epanetParser';
import type { SelectedSensors } from '../context/NetworkContext';

interface SensorSelectionTableProps {
  network: ParsedNetwork;
  pipesInZone: string[]; // Pipe IDs within the selected zone
  junctionsInZone: string[]; // Junction IDs within the selected zone
  selectedSensors: SelectedSensors;
  onSelectionChange: (sensors: SelectedSensors) => void;
  onRowClick?: (type: 'junction' | 'pipe', id: string) => void;
  selectedItem?: { type: 'junction' | 'pipe', id: string } | null;
}

export const SensorSelectionTable: React.FC<SensorSelectionTableProps> = ({
  network,
  pipesInZone,
  junctionsInZone,
  selectedSensors,
  onSelectionChange,
  onRowClick,
  selectedItem = null,
}) => {
  const [localSelectedPipes, setLocalSelectedPipes] = useState<Set<string>>(
    new Set(selectedSensors.pipes)
  );
  const [localSelectedJunctions, setLocalSelectedJunctions] = useState<Set<string>>(
    new Set(selectedSensors.junctions)
  );
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSelectedPipes(new Set(selectedSensors.pipes));
    setLocalSelectedJunctions(new Set(selectedSensors.junctions));
  }, [selectedSensors]);

  // Scroll to selected row when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      const key = `${selectedItem.type}-${selectedItem.id}`;
      const rowElement = rowRefs.current.get(key);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedItem]);

  const handlePipeToggle = (pipeId: string) => {
    const newSet = new Set(localSelectedPipes);
    if (newSet.has(pipeId)) {
      newSet.delete(pipeId);
    } else {
      newSet.add(pipeId);
    }
    setLocalSelectedPipes(newSet);
    
    // Update parent
    onSelectionChange({
      pipes: Array.from(newSet),
      junctions: Array.from(localSelectedJunctions),
    });
  };

  const handleJunctionToggle = (junctionId: string) => {
    const newSet = new Set(localSelectedJunctions);
    if (newSet.has(junctionId)) {
      newSet.delete(junctionId);
    } else {
      newSet.add(junctionId);
    }
    setLocalSelectedJunctions(newSet);
    
    // Update parent
    onSelectionChange({
      pipes: Array.from(localSelectedPipes),
      junctions: Array.from(newSet),
    });
  };

  // Get pipe and junction objects for display
  const pipes = pipesInZone
    .map(id => network.pipes.find(p => p.id === id))
    .filter((p): p is Pipe => p !== undefined);
  
  const junctions = junctionsInZone
    .map(id => network.junctions.find(j => j.id === id))
    .filter((j): j is Junction => j !== undefined);

  const totalSelected = localSelectedPipes.size + localSelectedJunctions.size;

  return (
    <div className="sensor-selection-table">
      <div className="sensor-selection-header">
        <h4>Items in Zone</h4>
        <span className="selection-count">
          {totalSelected} selected
        </span>
      </div>
      
      {pipes.length === 0 && junctions.length === 0 ? (
        <div className="empty-zone-message">
          No items found in selected zone
        </div>
      ) : (
        <div className="sensor-table-container">
          <table className="sensor-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>ID</th>
                <th>Sensor</th>
              </tr>
            </thead>
            <tbody>
              {/* Render junctions first */}
              {junctions.map(junction => {
                const key = `junction-${junction.id}`;
                const isSelected = selectedItem?.type === 'junction' && selectedItem.id === junction.id;
                return (
                  <tr
                    key={key}
                    ref={(el) => {
                      if (el) {
                        rowRefs.current.set(key, el);
                      } else {
                        rowRefs.current.delete(key);
                      }
                    }}
                    className={isSelected ? 'selected-row' : ''}
                    onClick={(e) => {
                      // Don't trigger row click if clicking on checkbox
                      if ((e.target as HTMLElement).tagName !== 'INPUT') {
                        onRowClick?.('junction', junction.id);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>Junction</td>
                    <td>{junction.id}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={localSelectedJunctions.has(junction.id)}
                        onChange={() => handleJunctionToggle(junction.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="sensor-type">Pressure</span>
                    </td>
                  </tr>
                );
              })}
              
              {/* Render pipes */}
              {pipes.map(pipe => {
                const key = `pipe-${pipe.id}`;
                const isSelected = selectedItem?.type === 'pipe' && selectedItem.id === pipe.id;
                return (
                  <tr
                    key={key}
                    ref={(el) => {
                      if (el) {
                        rowRefs.current.set(key, el);
                      } else {
                        rowRefs.current.delete(key);
                      }
                    }}
                    className={isSelected ? 'selected-row' : ''}
                    onClick={(e) => {
                      // Don't trigger row click if clicking on checkbox
                      if ((e.target as HTMLElement).tagName !== 'INPUT') {
                        onRowClick?.('pipe', pipe.id);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>Pipe</td>
                    <td>{pipe.id}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={localSelectedPipes.has(pipe.id)}
                        onChange={() => handlePipeToggle(pipe.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="sensor-type">Flow</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <style>{`
        .sensor-selection-table {
          margin-top: 1rem;
          background: white;
          border-radius: 6px;
          padding: 0.75rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .sensor-selection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .sensor-selection-header h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
        }
        
        .selection-count {
          font-size: 0.8rem;
          color: #007bff;
          font-weight: 600;
        }
        
        .empty-zone-message {
          text-align: center;
          padding: 1rem;
          color: #666;
          font-size: 0.85rem;
        }
        
        .sensor-table-container {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .sensor-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        
        .sensor-table thead {
          background-color: #f8f9fa;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        
        .sensor-table th {
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          font-size: 0.75rem;
          border-bottom: 2px solid #dee2e6;
        }
        
        .sensor-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .sensor-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .sensor-table input[type="checkbox"] {
          margin-right: 0.5rem;
          cursor: pointer;
        }
        
        .sensor-type {
          font-size: 0.75rem;
          color: #666;
        }
        
        .sensor-table tbody tr.selected-row {
          background-color: #e3f2fd !important;
          border-left: 3px solid #2196f3;
        }
        
        .sensor-table tbody tr.selected-row:hover {
          background-color: #bbdefb !important;
        }
      `}</style>
    </div>
  );
};


