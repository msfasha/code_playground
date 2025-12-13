import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ParsedNetwork, Coordinate } from '../utils/epanetParser';
import { transformPalestinianUTMToWGS84, isPalestinianUTM } from '../utils/coordinateTransform';
import type { SelectedAsset, SelectedKind } from '../context/EditorContext';

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
  onItemClick?: (kind: SelectedKind, id: string) => void;
  selectedItem?: SelectedAsset | null;
  selectedArea?: SelectedAsset[];
  shouldPanToSelected?: boolean; // Only pan when selection comes from table, not map click
}

export const NetworkOverlay: React.FC<NetworkOverlayProps> = ({ 
  map, 
  network, 
  anomalies = [], 
  highlightLocation = null, 
  highlightSensorType = null,
  onItemClick,
  selectedItem = null,
  selectedArea = [],
  shouldPanToSelected = false
}) => {
  const layersRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const lastMapClickRef = useRef<SelectedAsset | null>(null);
  const hasInitialFitRef = useRef<boolean>(false);
  const lastNetworkIdRef = useRef<string | null>(null);
  const onItemClickRef = useRef<NetworkOverlayProps['onItemClick']>(onItemClick);

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

  const buildAnomalyMaps = (items: Anomaly[]) => {
    // For each (location_id, sensor_type) keep the most severe; if tie, keep most recent.
    const byLocationAndType = new Map<string, Anomaly>();
    const severityOrder: Record<Anomaly['severity'], number> = { critical: 3, high: 2, medium: 1 };

    items.forEach((anomaly) => {
      const key = `${anomaly.location_id}_${anomaly.sensor_type}`;
      const existing = byLocationAndType.get(key);

      if (!existing) {
        byLocationAndType.set(key, anomaly);
        return;
      }

      const a = severityOrder[anomaly.severity];
      const b = severityOrder[existing.severity];

      if (a > b) {
        byLocationAndType.set(key, anomaly);
        return;
      }

      if (a === b && new Date(anomaly.timestamp) > new Date(existing.timestamp)) {
        byLocationAndType.set(key, anomaly);
      }
    });

    const junctionAnomalies = new Map<string, Anomaly>();
    const pipeAnomalies = new Map<string, Anomaly>();
    byLocationAndType.forEach((anomaly) => {
      if (anomaly.sensor_type === 'pressure') {
        junctionAnomalies.set(anomaly.location_id, anomaly);
      } else if (anomaly.sensor_type === 'flow') {
        pipeAnomalies.set(anomaly.location_id, anomaly);
      }
    });

    return { junctionAnomalies, pipeAnomalies };
  };

  // Keep latest callback without forcing geometry rebuilds
  useEffect(() => {
    onItemClickRef.current = onItemClick;
  }, [onItemClick]);

  useEffect(() => {
    if (!map || !network) return;

    console.log('NetworkOverlay: Map and network available');
    console.log('Network coordinates count:', network.coordinates.length);
    console.log('First few coordinates:', network.coordinates.slice(0, 3));

    // Clear existing layers
    if (layersRef.current) {
      map.removeLayer(layersRef.current);
    }
    
    // Clear refs
    markersRef.current.clear();
    polylinesRef.current.clear();
    
    // Only reset initial fit flag when network actually changes, not when anomalies update
    const currentNetworkId = network.title + '_' + network.junctions.length + '_' + network.pipes.length;
    if (lastNetworkIdRef.current !== currentNetworkId) {
      hasInitialFitRef.current = false;
      lastNetworkIdRef.current = currentNetworkId;
    }
    // If network hasn't changed, keep hasInitialFitRef as is (don't reset it)

    // Transform coordinates to WGS 84 (supports both Palestinian UTM and already-WGS84 stored as x=lng,y=lat)
    const transformedCoords = network.coordinates.map(coord => {
      const latLng = isPalestinianUTM(coord.x, coord.y)
        ? transformPalestinianUTMToWGS84(coord.x, coord.y)
        : { lat: coord.y, lng: coord.x };

      return {
        nodeId: coord.nodeId,
        latLng,
        originalCoord: coord
      };
    }) as Array<{
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

    // Create new layer group
    const layerGroup = L.layerGroup().addTo(map);
    layersRef.current = layerGroup;

    // Create node markers
    transformedCoords.forEach(({ nodeId, latLng }) => {
      // Find node data
      const junction = network.junctions.find(j => j.id === nodeId);
      const reservoir = network.reservoirs.find(r => r.id === nodeId);
      const tank = network.tanks.find(t => t.id === nodeId);

      if (!junction && !reservoir && !tank) return;

      let markerColor = '#007bff'; // Blue for junctions (default)
      let kind: SelectedKind = 'junction';

      if (reservoir) {
        markerColor = '#28a745'; // Green for reservoirs
        kind = 'reservoir';
      } else if (tank) {
        markerColor = '#ffc107'; // Yellow for tanks
        kind = 'tank';
      } else if (junction) {
        kind = 'junction';
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

      // Popups are intentionally disabled: selection is shown in the right panel.
      // Store location_id for lookup when highlighting
      (marker as any).locationId = nodeId;
      
      // Add click handler for selection
      if (onItemClickRef.current) {
        marker.on('click', () => {
          // Track that this selection came from a map click
          lastMapClickRef.current = { kind, id: nodeId };
          onItemClickRef.current?.(kind, nodeId);
        });
      }
      
      // Store marker reference for highlighting
      markersRef.current.set(nodeId, marker);
      
      marker.addTo(layerGroup);
    });

    // Create pipe lines
    network.pipes.forEach(pipe => {
      const node1Coord = transformedCoords.find(c => c.nodeId === pipe.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === pipe.node2);

      if (node1Coord && node2Coord) {
        const pipeColor = '#000000'; // Default pipe color (anomaly styling applied in separate effect)

        // Get vertices for this pipe
        const pipeVertices = (network.vertices || [])
          .filter(v => v.linkId === pipe.id)
          .map(v => (isPalestinianUTM(v.x, v.y) ? transformPalestinianUTMToWGS84(v.x, v.y) : { lat: v.y, lng: v.x })) as {
          lat: number;
          lng: number;
        }[];

        // Construct polyline coordinates: [start, ...vertices, end]
        const latLngs = [
          [node1Coord.latLng.lat, node1Coord.latLng.lng],
          ...pipeVertices.map(v => [v.lat, v.lng]),
          [node2Coord.latLng.lat, node2Coord.latLng.lng]
        ] as L.LatLngExpression[];

        // Create pipe line
        const line = L.polyline(latLngs, {
          color: pipeColor,
          weight: 3, // Reduced width for better appearance
          opacity: 0.6,
          interactive: true
        });

        // Popups are intentionally disabled: selection is shown in the right panel.
        // Store location_id for lookup when highlighting
        (line as any).locationId = pipe.id;
        
        // Add click handler for selection (popup will open automatically via Leaflet)
        if (onItemClickRef.current) {
          line.on('click', () => {
            // Track that this selection came from a map click
            lastMapClickRef.current = { kind: 'pipe', id: pipe.id };
            onItemClickRef.current?.('pipe', pipe.id);
          });
        }
        
        // Store polyline reference for highlighting
        polylinesRef.current.set(pipe.id, line);
        
        line.addTo(layerGroup);
      }
    });

    // Create pump lines
    network.pumps.forEach(pump => {
      const node1Coord = transformedCoords.find(c => c.nodeId === pump.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === pump.node2);

      if (node1Coord && node2Coord) {
        const pumpVertices = (network.vertices || [])
          .filter(v => v.linkId === pump.id)
          .map(v => (isPalestinianUTM(v.x, v.y) ? transformPalestinianUTMToWGS84(v.x, v.y) : { lat: v.y, lng: v.x })) as {
          lat: number;
          lng: number;
        }[];

        const latLngs = [
          [node1Coord.latLng.lat, node1Coord.latLng.lng],
          ...pumpVertices.map(v => [v.lat, v.lng]),
          [node2Coord.latLng.lat, node2Coord.latLng.lng]
        ] as L.LatLngExpression[];

        const line = L.polyline(latLngs, {
          color: '#6f42c1', // Purple for pumps
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 5',
          interactive: true
        });

        // Popups are intentionally disabled: selection is shown in the right panel.
        (line as any).locationId = pump.id;

        if (onItemClickRef.current) {
          line.on('click', () => {
            lastMapClickRef.current = { kind: 'pump', id: pump.id };
            onItemClickRef.current?.('pump', pump.id);
          });
        }

        polylinesRef.current.set(pump.id, line);
        line.addTo(layerGroup);
      }
    });

    // Create valve lines
    network.valves.forEach(valve => {
      const node1Coord = transformedCoords.find(c => c.nodeId === valve.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === valve.node2);

      if (node1Coord && node2Coord) {
        const valveVertices = (network.vertices || [])
          .filter(v => v.linkId === valve.id)
          .map(v => (isPalestinianUTM(v.x, v.y) ? transformPalestinianUTMToWGS84(v.x, v.y) : { lat: v.y, lng: v.x })) as {
          lat: number;
          lng: number;
        }[];

        const latLngs = [
          [node1Coord.latLng.lat, node1Coord.latLng.lng],
          ...valveVertices.map(v => [v.lat, v.lng]),
          [node2Coord.latLng.lat, node2Coord.latLng.lng]
        ] as L.LatLngExpression[];

        const line = L.polyline(latLngs, {
          color: '#0ea5e9', // Sky for valves
          weight: 3,
          opacity: 0.8,
          dashArray: '2, 6',
          interactive: true
        });

        (line as any).locationId = valve.id;

        if (onItemClickRef.current) {
          line.on('click', () => {
            lastMapClickRef.current = { kind: 'valve', id: valve.id };
            onItemClickRef.current?.('valve', valve.id);
          });
        }

        polylinesRef.current.set(valve.id, line);
        line.addTo(layerGroup);
      }
    });

    // Fit map to show all network elements (only on initial load)
    if (transformedCoords.length > 0 && !hasInitialFitRef.current) {
      const bounds = L.latLngBounds(
        transformedCoords.map(c => [c.latLng.lat, c.latLng.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
      hasInitialFitRef.current = true;
    }

    // Cleanup function
    return () => {
      if (layersRef.current) {
        map.removeLayer(layersRef.current);
        layersRef.current = null;
      }
    };
  }, [map, network]);

  // Handle highlighting from navigation without rebuilding geometry
  useEffect(() => {
    if (!map || !highlightLocation || !highlightSensorType) return;

    if (highlightSensorType === 'pressure') {
      const marker = markersRef.current.get(highlightLocation);
      if (!marker) return;

      const latLng = marker.getLatLng();
      map.setView(latLng, Math.max(map.getZoom(), 15));

      const originalColor = marker.options.fillColor as string | undefined;
      const originalRadius = marker.options.radius as number | undefined;
      marker.setStyle({ fillColor: '#ff0000', radius: 10, weight: 3 });
      setTimeout(() => {
        marker.setStyle({
          fillColor: originalColor ?? '#007bff',
          radius: originalRadius ?? 6,
          weight: 2
        });
      }, 3000);
    } else if (highlightSensorType === 'flow') {
      const line = polylinesRef.current.get(highlightLocation);
      if (!line) return;

      const bounds = line.getBounds();
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });

      const originalColor = line.options.color as string | undefined;
      const originalWeight = line.options.weight as number | undefined;
      line.setStyle({ color: '#ff0000', weight: 10 });
      setTimeout(() => {
        line.setStyle({
          color: originalColor ?? '#000000',
          weight: originalWeight ?? 3
        });
      }, 3000);
    }
  }, [map, highlightLocation, highlightSensorType]);

  // Handle selection highlighting
  useEffect(() => {
    if (!map || !network || !layersRef.current) return;

    const { junctionAnomalies, pipeAnomalies } = buildAnomalyMaps(anomalies);

    // Reset all markers to default style (junction/reservoir/tank)
    markersRef.current.forEach((marker, id) => {
      const junction = network.junctions.find(j => j.id === id);
      const reservoir = network.reservoirs.find(r => r.id === id);
      const tank = network.tanks.find(t => t.id === id);

      if (!junction && !reservoir && !tank) return;

      const defaultColor = reservoir
        ? '#28a745'
        : tank
          ? '#ffc107'
          : (junctionAnomalies.get(id)
            ? getSeverityColor(junctionAnomalies.get(id)!.severity)
            : '#007bff');

      const isSelected = !!selectedItem &&
        (selectedItem.kind === 'junction' ||
          selectedItem.kind === 'reservoir' ||
          selectedItem.kind === 'tank') &&
        selectedItem.id === id;
      
      const isInAreaSelection = selectedArea.some(
        (item) => (item.kind === 'junction' || item.kind === 'reservoir' || item.kind === 'tank') && item.id === id
      );

      if (!isSelected && !isInAreaSelection) {
        marker.setStyle({
          radius: 6,
          fillColor: defaultColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    });

    // Reset all polylines to default style (pipe/pump/valve)
    polylinesRef.current.forEach((polyline, id) => {
      const pipe = network.pipes.find(p => p.id === id);
      const pump = network.pumps.find(p => p.id === id);
      const valve = network.valves.find(v => v.id === id);

      if (!pipe && !pump && !valve) return;

      const defaultColor = pipe
        ? (pipeAnomalies.get(id)
          ? getSeverityColor(pipeAnomalies.get(id)!.severity)
          : '#000000')
        : pump
          ? '#6f42c1'
          : '#0ea5e9';

      const defaultOpacity = pipe ? 0.6 : 0.8;

      const isSelected = !!selectedItem &&
        (selectedItem.kind === 'pipe' ||
          selectedItem.kind === 'pump' ||
          selectedItem.kind === 'valve') &&
        selectedItem.id === id;
      
      const isInAreaSelection = selectedArea.some(
        (item) => (item.kind === 'pipe' || item.kind === 'pump' || item.kind === 'valve') && item.id === id
      );

      if (!isSelected && !isInAreaSelection) {
        polyline.setStyle({
          color: defaultColor,
          weight: 3,
          opacity: defaultOpacity
        });
      }
    });

    // Apply highlighting to selected item
    if (selectedItem) {
      const isFromMapClick = lastMapClickRef.current &&
        lastMapClickRef.current.kind === selectedItem.kind &&
        lastMapClickRef.current.id === selectedItem.id;

      // Clear the map click flag after using it
      if (isFromMapClick) {
        lastMapClickRef.current = null;
      }

      const highlightColor = '#ef4444';

      if (selectedItem.kind === 'junction' || selectedItem.kind === 'reservoir' || selectedItem.kind === 'tank') {
        const marker = markersRef.current.get(selectedItem.id);
        if (marker) {
          marker.setStyle({
            radius: 10,
            fillColor: highlightColor,
            color: '#fff',
            weight: 4,
            opacity: 1,
            fillOpacity: 0.9
          });

          if (shouldPanToSelected && !isFromMapClick) {
            map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15));
          }
        }
      } else if (selectedItem.kind === 'pipe' || selectedItem.kind === 'pump' || selectedItem.kind === 'valve') {
        const polyline = polylinesRef.current.get(selectedItem.id);
        if (polyline) {
          polyline.setStyle({
            color: highlightColor,
            weight: 6,
            opacity: 0.95
          });

          if (shouldPanToSelected && !isFromMapClick) {
            const bounds = polyline.getBounds();
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
          }
        }
      }
    }

    // Apply highlighting to area-selected items
    if (selectedArea.length > 0) {
      const highlightColor = '#ef4444';
      
      selectedArea.forEach((item) => {
        if (item.kind === 'junction' || item.kind === 'reservoir' || item.kind === 'tank') {
          const marker = markersRef.current.get(item.id);
          if (marker && (!selectedItem || selectedItem.id !== item.id)) {
            marker.setStyle({
              radius: 8,
              fillColor: highlightColor,
              color: '#fff',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.7
            });
          }
        } else if (item.kind === 'pipe' || item.kind === 'pump' || item.kind === 'valve') {
          const polyline = polylinesRef.current.get(item.id);
          if (polyline && (!selectedItem || selectedItem.id !== item.id)) {
            polyline.setStyle({
              color: highlightColor,
              weight: 5,
              opacity: 0.8
            });
          }
        }
      });
    }
  }, [selectedItem, selectedArea, map, network, anomalies, shouldPanToSelected]);

  return null; // This component doesn't render anything visible
};
