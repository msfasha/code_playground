import React, { useContext, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { IncidentContext } from "../context/IncidentContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapView = () => {
  const { incidents, selectedIncident, setSelectedIncident } = useContext(IncidentContext);

  const FlyToIncident = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedIncident) {
        map.flyTo([selectedIncident.lat, selectedIncident.lng], 12);
      }
    }, [selectedIncident]);
    return null;
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <MapContainer center={[31.963158, 35.930359]} zoom={8} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={markerIcon}
          eventHandlers={{
            click: () => setSelectedIncident(incident)
          }}
        >
          <Popup>
            <b>{incident.title}</b><br />
            {incident.description}
          </Popup>
        </Marker>
      ))}
      <FlyToIncident />
    </MapContainer>
  );
};

export default MapView;
