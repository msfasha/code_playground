import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ParsedNetwork, Coordinate } from '../utils/epanetParser';
import { transformPalestinianUTMToWGS84, isPalestinianUTM } from '../utils/coordinateTransform';

interface Anomaly {
  id: number;
  network_id: string;
  timestamp: string;
  sensor_id: string;
  sensor_type: string;
  location_id: string;
  actual_value: number;
  expected_value: number;
  deviation_percent: number;
  threshold_percent: number;
  severity: 'medium' | 'high' | 'critical';
  created_at: string;
}

interface NetworkOverlayProps {
  map: L.Map | null;
  network: ParsedNetwork | null;
  anomalies?: Anomaly[];
  highlightLocation?: string | null;
  highlightSensorType?: string | null;
}

export const NetworkOverlay: React.FC<NetworkOverlayProps> = ({ map, network, anomalies = [], highlightLocation = null, highlightSensorType = null }) => {
  const layersRef = useRef<L.LayerGroup | null>(null);

  // Helper function to get severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return '#dc3545'; // Red
      case 'high':
        return '#fd7e14'; // Orange
      case 'medium':
        return '#ffc107'; // Yellow (consistent with monitoring records)
      default:
        return '#ffc107'; // Yellow (default)
    }
  };

  useEffect(() => {
    if (!map || !network) return;

    // Build lookup maps for anomalies
    const junctionAnomalies = new Map<string, Anomaly>();
    const pipeAnomalies = new Map<string, Anomaly>();

    if (anomalies && anomalies.length > 0) {
      // Process anomalies: for each location, keep the most recent one with highest severity
      const anomalyMap = new Map<string, Anomaly>();
      
      anomalies.forEach(anomaly => {
        const key = `${anomaly.location_id}_${anomaly.sensor_type}`;
        const existing = anomalyMap.get(key);
        
        if (!existing) {
          anomalyMap.set(key, anomaly);
        } else {
          // Keep the one with higher severity (critical > high > medium)
          const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
          if (severityOrder[anomaly.severity] > severityOrder[existing.severity]) {
            anomalyMap.set(key, anomaly);
          } else if (severityOrder[anomaly.severity] === severityOrder[existing.severity]) {
            // Same severity, keep the most recent (anomalies are already sorted by timestamp desc)
            if (new Date(anomaly.timestamp) > new Date(existing.timestamp)) {
              anomalyMap.set(key, anomaly);
            }
          }
        }
      });

      // Separate into junction and pipe maps
      anomalyMap.forEach((anomaly) => {
        if (anomaly.sensor_type === 'pressure') {
          junctionAnomalies.set(anomaly.location_id, anomaly);
        } else if (anomaly.sensor_type === 'flow') {
          pipeAnomalies.set(anomaly.location_id, anomaly);
        }
      });
    }

    console.log('NetworkOverlay: Map and network available');
    console.log('Network coordinates count:', network.coordinates.length);
    console.log('First few coordinates:', network.coordinates.slice(0, 3));

    // Clear existing layers
    if (layersRef.current) {
      map.removeLayer(layersRef.current);
    }

    // Create new layer group
    const layerGroup = L.layerGroup().addTo(map);
    layersRef.current = layerGroup;

    // Transform coordinates to WGS 84
    const transformedCoords = network.coordinates.map(coord => {
      if (isPalestinianUTM(coord.x, coord.y)) {
        const latLng = transformPalestinianUTMToWGS84(coord.x, coord.y);
        return {
          nodeId: coord.nodeId,
          latLng: latLng,
          originalCoord: coord
        };
      }
      return null;
    }).filter(Boolean) as Array<{
      nodeId: string;
      latLng: { lat: number; lng: number };
      originalCoord: Coordinate;
    }>;

    console.log('Transformed coordinates count:', transformedCoords.length);
    console.log('First few transformed coordinates:', transformedCoords.slice(0, 3));

    if (transformedCoords.length === 0) {
      console.warn('No valid coordinates found for transformation');
      return;
    }

    // Create node markers
    transformedCoords.forEach(({ nodeId, latLng }) => {
      // Find node data
      const junction = network.junctions.find(j => j.id === nodeId);
      const reservoir = network.reservoirs.find(r => r.id === nodeId);
      const tank = network.tanks.find(t => t.id === nodeId);

      let nodeType = 'Junction';
      let nodeData: any = junction;
      let markerColor = '#007bff'; // Blue for junctions (default)

      if (reservoir) {
        nodeType = 'Reservoir';
        nodeData = reservoir;
        markerColor = '#28a745'; // Green for reservoirs
      } else if (tank) {
        nodeType = 'Tank';
        nodeData = tank;
        markerColor = '#ffc107'; // Yellow for tanks
      } else if (junction) {
        // Check for pressure anomaly for this junction
        const anomaly = junctionAnomalies.get(nodeId);
        if (anomaly) {
          markerColor = getSeverityColor(anomaly.severity);
        }
      }

      // Create custom marker
      const marker = L.circleMarker([latLng.lat, latLng.lng], {
        radius: 6,
        fillColor: markerColor,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Get monitoring data for this junction (if available)
      const anomaly = junction && junctionAnomalies.get(nodeId);
      const popupBorderColor = anomaly ? getSeverityColor(anomaly.severity) : '#007bff';
      
      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; border-left: 4px solid ${popupBorderColor}; padding-left: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${nodeType}: ${nodeId}</h4>
          ${nodeData ? `
            <div style="font-size: 12px; line-height: 1.4;">
              ${nodeType === 'Junction' ? `
                <p><strong>Elevation:</strong> ${nodeData.elevation} m</p>
                <p><strong>Demand:</strong> ${nodeData.demand} L/s</p>
              ` : ''}
              ${nodeType === 'Reservoir' ? `
                <p><strong>Head:</strong> ${nodeData.head} m</p>
              ` : ''}
              ${nodeType === 'Tank' ? `
                <p><strong>Elevation:</strong> ${nodeData.elevation} m</p>
                <p><strong>Initial Level:</strong> ${nodeData.initLevel} m</p>
                <p><strong>Diameter:</strong> ${nodeData.diameter} m</p>
              ` : ''}
              ${anomaly && nodeType === 'Junction' ? `
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #dee2e6;">
                  <p style="font-weight: 600; color: ${popupBorderColor}; margin-bottom: 4px;">Monitoring Data</p>
                  <p><strong>Last Pressure Reading:</strong> ${anomaly.actual_value.toFixed(3)} m</p>
                  <p><strong>Expected Pressure:</strong> ${anomaly.expected_value.toFixed(3)} m</p>
                  <p><strong>Deviation:</strong> ${anomaly.deviation_percent.toFixed(2)}%</p>
                  <p><strong>Severity:</strong> <span style="color: ${popupBorderColor}; font-weight: 600;">${anomaly.severity.toUpperCase()}</span></p>
                  <p><strong>Reading Time:</strong> ${new Date(anomaly.timestamp).toLocaleString()}</p>
                </div>
              ` : ''}
              <p style="margin-top: 8px; font-size: 10px; color: #666;">
                Lat: ${latLng.lat.toFixed(6)}, Lng: ${latLng.lng.toFixed(6)}
              </p>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      // Store location_id for lookup when highlighting
      (marker as any).locationId = nodeId;
      marker.addTo(layerGroup);
    });

    // Create pipe lines
    network.pipes.forEach(pipe => {
      const node1Coord = transformedCoords.find(c => c.nodeId === pipe.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === pipe.node2);

      if (node1Coord && node2Coord) {
        // Check for flow anomaly for this pipe
        const anomaly = pipeAnomalies.get(pipe.id);
        const pipeColor = anomaly ? getSeverityColor(anomaly.severity) : '#000000'; // Black if no anomaly
        
        const line = L.polyline([
          [node1Coord.latLng.lat, node1Coord.latLng.lng],
          [node2Coord.latLng.lat, node2Coord.latLng.lng]
        ], {
          color: pipeColor,
          weight: 2,
          opacity: 0.4
        });

        // Get monitoring data for this pipe (if available)
        const pipeAnomaly = pipeAnomalies.get(pipe.id);
        const pipePopupBorderColor = pipeAnomaly ? getSeverityColor(pipeAnomaly.severity) : '#000000';
        
        // Create pipe popup
        const pipePopupContent = `
          <div style="min-width: 200px; border-left: 4px solid ${pipePopupBorderColor}; padding-left: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">Pipe: ${pipe.id}</h4>
            <div style="font-size: 12px; line-height: 1.4;">
              <p><strong>From:</strong> ${pipe.node1}</p>
              <p><strong>To:</strong> ${pipe.node2}</p>
              <p><strong>Length:</strong> ${pipe.length} m</p>
              <p><strong>Diameter:</strong> ${pipe.diameter} mm</p>
              <p><strong>Roughness:</strong> ${pipe.roughness}</p>
              <p><strong>Status:</strong> ${pipe.status}</p>
              ${pipeAnomaly ? `
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #dee2e6;">
                  <p style="font-weight: 600; color: ${pipePopupBorderColor}; margin-bottom: 4px;">Monitoring Data</p>
                  <p><strong>Last Flow Reading:</strong> ${pipeAnomaly.actual_value.toFixed(3)} L/s</p>
                  <p><strong>Expected Flow:</strong> ${pipeAnomaly.expected_value.toFixed(3)} L/s</p>
                  <p><strong>Deviation:</strong> ${pipeAnomaly.deviation_percent.toFixed(2)}%</p>
                  <p><strong>Severity:</strong> <span style="color: ${pipePopupBorderColor}; font-weight: 600;">${pipeAnomaly.severity.toUpperCase()}</span></p>
                  <p><strong>Reading Time:</strong> ${new Date(pipeAnomaly.timestamp).toLocaleString()}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `;

        line.bindPopup(pipePopupContent);
        // Store location_id for lookup when highlighting
        (line as any).locationId = pipe.id;
        line.addTo(layerGroup);
      }
    });

    // Create pump lines
    network.pumps.forEach(pump => {
      const node1Coord = transformedCoords.find(c => c.nodeId === pump.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === pump.node2);

      if (node1Coord && node2Coord) {
        const line = L.polyline([
          [node1Coord.latLng.lat, node1Coord.latLng.lng],
          [node2Coord.latLng.lat, node2Coord.latLng.lng]
        ], {
          color: '#6f42c1', // Purple for pumps
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 5'
        });

        const pumpPopupContent = `
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">Pump: ${pump.id}</h4>
            <div style="font-size: 12px; line-height: 1.4;">
              <p><strong>From:</strong> ${pump.node1}</p>
              <p><strong>To:</strong> ${pump.node2}</p>
              <p><strong>Parameters:</strong> ${pump.parameters}</p>
            </div>
          </div>
        `;

        line.bindPopup(pumpPopupContent);
        line.addTo(layerGroup);
      }
    });

    // Fit map to show all network elements
    if (transformedCoords.length > 0) {
      const bounds = L.latLngBounds(
        transformedCoords.map(c => [c.latLng.lat, c.latLng.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Handle highlighting when highlightLocation is provided
    if (highlightLocation && layerGroup) {
      if (highlightSensorType === 'pressure') {
        // Find junction marker
        const marker = layerGroup.getLayers().find((layer) => {
          if (layer instanceof L.CircleMarker) {
            return (layer as any).locationId === highlightLocation;
          }
          return false;
        }) as L.CircleMarker | undefined;
        
        if (marker) {
          const latLng = marker.getLatLng();
          map.setView(latLng, Math.max(map.getZoom(), 15));
          marker.openPopup();
          // Add temporary highlight
          const originalColor = marker.options.fillColor;
          const originalRadius = marker.options.radius;
          marker.setStyle({ fillColor: '#ff0000', radius: 10, weight: 3 });
          setTimeout(() => {
            marker.setStyle({ fillColor: originalColor, radius: originalRadius, weight: 2 });
          }, 3000);
        }
      } else if (highlightSensorType === 'flow') {
        // Find pipe line
        const line = layerGroup.getLayers().find((layer) => {
          if (layer instanceof L.Polyline) {
            return (layer as any).locationId === highlightLocation;
          }
          return false;
        }) as L.Polyline | undefined;
        
        if (line) {
          const bounds = line.getBounds();
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
          line.openPopup();
          // Add temporary highlight
          const originalColor = line.options.color;
          const originalWeight = line.options.weight;
          line.setStyle({ color: '#ff0000', weight: 6 });
          setTimeout(() => {
            line.setStyle({ color: originalColor, weight: originalWeight });
          }, 3000);
        }
      }
    }

    // Cleanup function
    return () => {
      if (layersRef.current) {
        map.removeLayer(layersRef.current);
        layersRef.current = null;
      }
    };
  }, [map, network, anomalies, highlightLocation, highlightSensorType]); // Add highlight props to dependencies

  return null; // This component doesn't render anything visible
};
