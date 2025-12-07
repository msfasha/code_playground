import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { IncidentContext } from "../context/IncidentContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapView = () => {
  const { incidents, selectedIncident, setSelectedIncident } = useContext(IncidentContext);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const FlyToIncident = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedIncident && selectedIncident.lat && selectedIncident.lng) {
        map.flyTo([selectedIncident.lat, selectedIncident.lng], 14);
      }
    }, [selectedIncident, map]);
    return null;
  };

  // Create different colored icons based on status
  const getMarkerIcon = (status, isSelected) => {
    const size = isSelected ? [35, 50] : [25, 41];
    
    // Use default icon with custom styling
    const icon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      iconSize: size,
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    return icon;
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    if (filterType !== "All" && incident.type !== filterType) return false;
    if (filterStatus !== "All" && incident.status !== filterStatus) return false;
    return true;
  });

  // Get unique types and statuses for filters
  const types = ["All", ...new Set(incidents.map(i => i.type))];
  const statuses = ["All", ...new Set(incidents.map(i => i.status))];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Filter Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <div>
          <label style={{ fontSize: '12px', marginRight: '5px' }}>Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '5px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', marginRight: '5px' }}>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '5px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setFilterType("All");
            setFilterStatus("All");
          }}
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Filters
        </button>
      </div>

      <MapContainer 
        center={[31.963158, 35.930359]} 
        zoom={8} 
        style={{ height: "100%", width: "100%" }}
        key={`${filterType}-${filterStatus}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredIncidents.map((incident) => {
          const isSelected = selectedIncident?.id === incident.id;
          return (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={getMarkerIcon(incident.status, isSelected)}
              eventHandlers={{
                click: () => setSelectedIncident(incident)
              }}
            >
              <Popup>
                <div>
                  <b>{incident.title}</b><br />
                  <small>Type: {incident.type} | Status: {incident.status}</small>
                  {incident.description && (
                    <>
                      <br />
                      <small>{incident.description}</small>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        <FlyToIncident />
      </MapContainer>
    </div>
  );
};

export default MapView;
