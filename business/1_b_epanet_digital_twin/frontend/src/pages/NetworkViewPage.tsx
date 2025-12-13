// Import React hooks: useState for component state, useRef for DOM/element references, useEffect for side effects
import { useState, useRef, useEffect, useCallback } from 'react';
// Import TypeScript type definitions (type-only imports, not runtime values)
import type { ParsedNetwork, Zone } from '../utils/epanetParser'; // Type for parsed EPANET network data structure
import type { LatLng } from '../utils/coordinateTransform'; // Type for latitude/longitude coordinate pairs
// Import React Router for navigation state
import { useLocation } from 'react-router-dom';
// Import custom React components
import { useNetwork } from '../context/NetworkContext'; // Hook to access global network state
import { FileUpload } from '../components/FileUpload'; // Component for uploading and parsing .inp files
import { NetworkMap } from '../components/NetworkMap'; // Leaflet map component that displays the geographic map
import { NetworkOverlay } from '../components/NetworkOverlay'; // Component that draws network elements (junctions, pipes) on the map
import { ZoneSelector } from '../components/ZoneSelector'; // Component for polygon zone selection
import { SensorSelectionTable } from '../components/SensorSelectionTable'; // Component for selecting sensors
import { ZoneManager } from '../components/ZoneManager'; // Component for managing zones
// Import Leaflet library for interactive maps (L is the global Leaflet namespace)
import L from 'leaflet';
// Import geometry utilities
import { isPointInPolygon, isLineInPolygon } from '../utils/geometryUtils';
import { transformPalestinianUTMToWGS84, isPalestinianUTM } from '../utils/coordinateTransform';
import { epanetParser } from '../utils/epanetParser';
import type { SelectedAsset, SelectedKind } from '../context/EditorContext';

/**
 * NetworkViewPage Component
 * 
 * Main page component that displays the uploaded EPANET network on an interactive map.
 * Features:
 * - File upload interface for .inp files
 * - Network information display (junctions, pipes, etc.)
 * - Interactive Leaflet map with network overlay
 * - Real-time coordinate transformation from Palestinian UTM to WGS 84
 */
const API_ROOT = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const API_BASE = API_ROOT.replace(/\/$/, '');
const API = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

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

interface MonitoringStatus {
  status: 'stopped' | 'starting' | 'running' | 'error';
  network_id: string | null;
  last_check_time: string | null;
}

export function NetworkViewPage() {
  // Access the network object from NetworkContext (global state, persisted in localStorage)
  // This network data persists across page navigations and refreshes
  const { network, networkId, selectedSensors, setSelectedSensors, setNetwork, networkFile } = useNetwork(); // Get the network, networkId, and selectedSensors from the context
  
  // Access navigation location state for highlighting locations
  const location = useLocation();
  
  // Local component state for error messages displayed to the user
  // null = no error, string = error message to display
  const [error, setError] = useState<string | null>(null);
  
  // Monitoring state
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);
  
  // Highlight state from navigation
  const [highlightLocation, setHighlightLocation] = useState<string | null>(null);
  const [highlightSensorType, setHighlightSensorType] = useState<string | null>(null);
  
  // Read highlight location from navigation state
  useEffect(() => {
    if (location.state && (location.state as any).highlightLocation) {
      const state = location.state as { highlightLocation: string; sensorType?: string };
      setHighlightLocation(state.highlightLocation);
      setHighlightSensorType(state.sensorType || null);
      // Clear state after reading to prevent re-highlighting on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Default map center coordinates (Amman, Jordan)
  // This is used as the initial map view before network overlay fits bounds
  const mapCenter: LatLng = { lat: 31.9522, lng: 35.2332 }; // Amman, Jordan
  
  // React ref to store the Leaflet map instance
  // useRef persists across re-renders but changes don't trigger re-renders
  // Used to pass map instance to NetworkOverlay component
  const mapRef = useRef<L.Map | null>(null);
  
  // State to track when the map is ready (triggers re-render when changed)
  // This is needed because refs don't trigger re-renders, so checking mapRef.current
  // in render conditions won't update when the map becomes ready
  const [mapReady, setMapReady] = useState(false);
  
  // Zone creation state
  const [isZoneSelectionActive, setIsZoneSelectionActive] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState<LatLng[] | null>(null);
  const [pipesInZone, setPipesInZone] = useState<string[]>([]);
  const [junctionsInZone, setJunctionsInZone] = useState<string[]>([]);
  const [showZoneNameDialog, setShowZoneNameDialog] = useState(false);
  const [zoneNameInput, setZoneNameInput] = useState('');
  const [pendingZoneData, setPendingZoneData] = useState<{ polygon: LatLng[], pipes: string[], junctions: string[] } | null>(null);
  
  // Selection state for bidirectional map-table selection (table supports junction/pipe only)
  const [selectedItem, setSelectedItem] = useState<{ type: 'junction' | 'pipe', id: string } | null>(null);
  const [shouldPanToSelected, setShouldPanToSelected] = useState(false);
  const selectedOverlayItem: SelectedAsset | null = selectedItem
    ? { kind: selectedItem.type, id: selectedItem.id }
    : null;
  
  // useEffect hook: Log network state changes to console for debugging
  // Runs whenever the 'network' value changes (dependency array)
  useEffect(() => {
    console.log('[NetworkViewPage] Network state:', network ? `${network.title} (${network.junctions.length} junctions)` : 'null');
  }, [network]); // Dependency: re-run when network changes
  
  // Reset mapReady when component unmounts or network changes (map will be recreated)
  useEffect(() => {
    return () => {
      setMapReady(false);
      mapRef.current = null;
    };
  }, []);

  // Poll monitoring status every 5 seconds
  useEffect(() => {
    if (!networkId) return;

    // Fetch anomalies from monitoring service
    const fetchAnomalies = async () => {
      try {
        const response = await fetch(`${API}/monitoring/anomalies?network_id=${networkId}&limit=1000`);
        if (response.ok) {
          const data = await response.json();
          setAnomalies(data.anomalies || []);
        }
      } catch (err) {
        console.error('Error fetching anomalies:', err);
      }
    };

    const checkMonitoringStatus = async () => {
      try {
        const response = await fetch(`${API}/monitoring/status`);
        if (response.ok) {
          const data: MonitoringStatus = await response.json();
          
          // Only update when last_check_time changes (new monitoring cycle completed)
          if (data.last_check_time && data.last_check_time !== lastCheckTime) {
            setMonitoringStatus(data);
            setLastCheckTime(data.last_check_time);
            // Fetch latest anomalies when monitoring cycle completes
            if (data.status === 'running') {
              fetchAnomalies();
            }
          } else if (!monitoringStatus) {
            // Initial load - set status even if last_check_time hasn't changed yet
            setMonitoringStatus(data);
          }
        }
      } catch (err) {
        console.error('Error checking monitoring status:', err);
      }
    };

    const interval = setInterval(checkMonitoringStatus, 5000);
    checkMonitoringStatus(); // Check immediately
    return () => clearInterval(interval);
  }, [networkId, lastCheckTime]);

  /**
   * Callback function called by FileUpload component when a network file is successfully parsed
   * @param parsedNetwork - The parsed EPANET network object containing junctions, pipes, coordinates, etc.
   */
  const handleNetworkParsed = (parsedNetwork: ParsedNetwork) => {
    // Clear any previous error messages when new network is parsed successfully
    setError(null);
    
    // Log success message if network has coordinates (required for map display)
    if (parsedNetwork.coordinates.length > 0) {
      console.log('Network parsed successfully:', parsedNetwork);
    }
  };

  /**
   * Callback function called by FileUpload component when an error occurs during file parsing
   * @param errorMessage - Error message string to display to the user
   */
  const handleError = (errorMessage: string) => {
    // Update error state to display error message in UI
    setError(errorMessage);
  };

  /**
   * Callback function called by NetworkMap component when the Leaflet map is initialized and ready
   * @param map - The Leaflet map instance (L.Map) that can be used to add overlays
   */
  const handleMapReady = (map: L.Map) => {
    // Store the map instance in ref so NetworkOverlay can access it
    mapRef.current = map;
    // Set mapReady to true to trigger re-render and show NetworkOverlay
    // Using state instead of checking mapRef.current directly ensures React re-evaluates
    // the render condition when the map becomes ready
    setMapReady(true);
  };
  
  /**
   * Handle zone creation button click - toggle zone creation mode
   */
  const handleCreateZoneClick = () => {
    if (isZoneSelectionActive) {
      // Cancel creation
      setIsZoneSelectionActive(false);
      setSelectedPolygon(null);
      setPipesInZone([]);
      setJunctionsInZone([]);
    } else {
      // Start zone creation
      setIsZoneSelectionActive(true);
    }
  };
  
  /**
   * Handle polygon drawn - find all pipes and junctions within the polygon and prompt for zone name
   */
  const handlePolygonDrawn = (polygon: LatLng[]) => {
    if (!network) return;
    
    setSelectedPolygon(polygon);
    setIsZoneSelectionActive(false); // Disable drawing mode after polygon is drawn
    
    // Transform coordinates to WGS84 for comparison
    const transformedCoords = network.coordinates.map(coord => {
      if (isPalestinianUTM(coord.x, coord.y)) {
        const latLng = transformPalestinianUTMToWGS84(coord.x, coord.y);
        return {
          nodeId: coord.nodeId,
          latLng: latLng
        };
      }
      return null;
    }).filter(Boolean) as Array<{
      nodeId: string;
      latLng: { lat: number; lng: number };
    }>;
    
    // Find junctions within polygon
    const junctionsInPolygon: string[] = [];
    transformedCoords.forEach(({ nodeId, latLng }) => {
      if (isPointInPolygon(latLng, polygon)) {
        // Check if it's a junction (not reservoir or tank)
        const isJunction = network.junctions.some(j => j.id === nodeId);
        if (isJunction) {
          junctionsInPolygon.push(nodeId);
        }
      }
    });
    
    // Find pipes within polygon
    const pipesInPolygon: string[] = [];
    network.pipes.forEach(pipe => {
      const node1Coord = transformedCoords.find(c => c.nodeId === pipe.node1);
      const node2Coord = transformedCoords.find(c => c.nodeId === pipe.node2);
      
      if (node1Coord && node2Coord) {
        if (isLineInPolygon(node1Coord.latLng, node2Coord.latLng, polygon)) {
          pipesInPolygon.push(pipe.id);
        }
      }
    });
    
    setJunctionsInZone(junctionsInPolygon);
    setPipesInZone(pipesInPolygon);
    
    // Store pending zone data and show name dialog
    setPendingZoneData({ polygon, pipes: pipesInPolygon, junctions: junctionsInPolygon });
    setShowZoneNameDialog(true);
  };
  
  /**
   * Save zone to network and update .inp file on backend
   */
  const handleSaveZone = async () => {
    if (!network || !pendingZoneData || !zoneNameInput.trim()) {
      return;
    }
    
    // Create new zone
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: zoneNameInput.trim(),
      polygon: pendingZoneData.polygon,
      pipes: pendingZoneData.pipes,
      junctions: pendingZoneData.junctions
    };
    
    // Add zone to network
    const updatedZones = network.zones ? [...network.zones, newZone] : [newZone];
    const updatedNetwork: ParsedNetwork = {
      ...network,
      zones: updatedZones
    };
    
    // Update network in context (this will persist to localStorage)
    setNetwork(updatedNetwork);
    
    // Update .inp file on backend if networkId and file are available
    if (networkId && networkFile) {
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
    }
    
    // Close dialog and reset state
    setShowZoneNameDialog(false);
    setZoneNameInput('');
    setPendingZoneData(null);
    setSelectedPolygon(null);
    setPipesInZone([]);
    setJunctionsInZone([]);
  };
  
  /**
   * Cancel zone creation
   */
  const handleCancelZone = () => {
    setShowZoneNameDialog(false);
    setZoneNameInput('');
    setPendingZoneData(null);
    setSelectedPolygon(null);
    setPipesInZone([]);
    setJunctionsInZone([]);
  };
  
  /**
   * Handle polygon cleared
   */
  const handlePolygonCleared = () => {
    setSelectedPolygon(null);
    setPipesInZone([]);
    setJunctionsInZone([]);
  };
  
  /**
   * Handle map item click (junction or pipe clicked on map)
   */
  const handleMapItemClick = useCallback((kind: SelectedKind, id: string) => {
    // NetworkViewPage only supports junction/pipe selection UI right now.
    if (kind !== 'junction' && kind !== 'pipe') return;
    setShouldPanToSelected(false); // Don't pan when clicking directly on map
    setSelectedItem({ type: kind, id });
  }, []);
  
  /**
   * Handle table row click (junction or pipe row clicked in table)
   */
  const handleTableRowClick = useCallback((type: 'junction' | 'pipe', id: string) => {
    setShouldPanToSelected(true); // Pan when selecting from table
    setSelectedItem({ type, id });
  }, []);


  // Return JSX structure for the Network View page
  return (
    <div className="app">
      {/* Application header with title, subtitle, and file upload */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-upload-section">
            <FileUpload 
              onNetworkParsed={handleNetworkParsed}
              onError={handleError}
            />
          </div>
          <div className="header-title-section">
            <h1>Hydro-Twin (Real Time Water-Networks Monitoring System)</h1>
          </div>
        </div>
        {error && (
          <div className="error-message-header">
            <p>{error}</p>
          </div>
        )}
      </header>

      {/* Main content area: sidebar + map container */}
      <main className="app-main">
        {/* Left sidebar: contains network info */}
        <div className="sidebar">
          {/* Conditionally render network information panel */}
          {/* Only displays when network is loaded (not null) */}
          {network && (
            <>
              <div className="network-info">
                <h3>Network Information</h3>
                {/* Simple text list displaying network statistics */}
                <div className="info-list">
                  <div>Title: {network.title}</div>
                  <div>Junctions: {network.junctions.length}</div>
                  <div>Reservoirs: {network.reservoirs.length}</div>
                  <div>Tanks: {network.tanks.length}</div>
                  <div>Pipes: {network.pipes.length}</div>
                  <div>Pumps: {network.pumps.length}</div>
                  <div>Valves: {network.valves.length}</div>
                  <div>Coordinates: {network.coordinates.length}</div>
                </div>
              </div>
              
              {/* Create Zone button */}
              <button 
                className="select-zone-button"
                onClick={handleCreateZoneClick}
              >
                {isZoneSelectionActive ? 'Cancel Creation' : 'Create Zone'}
              </button>
              
              {/* Zone Name Dialog */}
              {showZoneNameDialog && (
                <div className="zone-name-dialog-overlay">
                  <div className="zone-name-dialog">
                    <h3>Name Your Zone</h3>
                    <p>Enter a name for this zone:</p>
                    <input
                      type="text"
                      value={zoneNameInput}
                      onChange={(e) => setZoneNameInput(e.target.value)}
                      placeholder="Zone name..."
                      className="zone-name-input"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveZone();
                        } else if (e.key === 'Escape') {
                          handleCancelZone();
                        }
                      }}
                    />
                    <div className="zone-name-dialog-buttons">
                      <button onClick={handleCancelZone} className="cancel-button">
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveZone} 
                        className="save-button"
                        disabled={!zoneNameInput.trim()}
                      >
                        Save Zone
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Zone Manager - show existing zones */}
              {network && network.zones && network.zones.length > 0 && (
                <ZoneManager
                  network={network}
                  networkId={networkId}
                  networkFile={networkFile}
                  onZoneUpdate={setNetwork}
                  onZoneSelect={(zone) => {
                    // Highlight zone on map by setting selected polygon
                    setSelectedPolygon(zone.polygon);
                    setPipesInZone(zone.pipes);
                    setJunctionsInZone(zone.junctions);
                  }}
                />
              )}
              
              {/* Sensor selection table - shown when polygon is selected */}
              {selectedPolygon && network && (
                <SensorSelectionTable
                  network={network}
                  pipesInZone={pipesInZone}
                  junctionsInZone={junctionsInZone}
                  selectedSensors={selectedSensors}
                  onSelectionChange={setSelectedSensors}
                  onRowClick={handleTableRowClick}
                  selectedItem={selectedItem}
                />
              )}
            </>
          )}
        </div>

        {/* Right side: map container holding the interactive Leaflet map */}
        <div className="map-container">
          {/* NetworkMap component: creates and initializes Leaflet map with OpenStreetMap tiles */}
          {/* Props: center (initial view), zoom level, CSS class, callback when map is ready */}
          <NetworkMap 
            center={mapCenter} // Initial map center coordinates
            zoom={10} // Initial zoom level (higher = more zoomed in)
            className="main-map" // CSS class for styling
            onMapReady={handleMapReady} // Callback: called when map instance is created
          />
          
          {/* Conditionally render NetworkOverlay component */}
          {/* Only renders when BOTH conditions are true: */}
          {/* 1. network exists (network is not null) */}
          {/* 2. mapReady is true (map has been initialized via onMapReady callback) */}
          {/* 
            FIXED: Using mapReady state instead of mapRef.current ensures React re-evaluates
            the condition when the map becomes ready. When handleMapReady is called, it sets
            mapReady to true, triggering a re-render that causes NetworkOverlay to appear.
            This fixes the issue where overlay would disappear when navigating between pages.
          */}
          {network && mapReady && (
            <>
              <NetworkOverlay 
                map={mapRef.current!} // Pass Leaflet map instance to overlay (non-null assertion safe because mapReady is true)
                network={network} // Pass parsed network data for rendering
                anomalies={anomalies} // Pass monitoring anomalies for coloring
                highlightLocation={highlightLocation} // Pass location to highlight
                highlightSensorType={highlightSensorType} // Pass sensor type for highlighting
                onItemClick={handleMapItemClick} // Handle map item clicks
                selectedItem={selectedOverlayItem} // Pass selected item for highlighting
                shouldPanToSelected={shouldPanToSelected} // Pan only when selection comes from table
              />
              <ZoneSelector
                map={mapRef.current!}
                isActive={isZoneSelectionActive}
                onPolygonDrawn={handlePolygonDrawn}
                onPolygonCleared={handlePolygonCleared}
              />
            </>
          )}
        </div>
      </main>

      {/* Inline CSS styles using template literal (scoped to this component) */}
      {/* Styles defined here are component-specific and don't affect other components */}
      <style>{`
        /* Root container: full viewport height minus nav bar, vertical flex layout */
        .app {
          display: flex; /* Flexbox layout */
          flex-direction: column; /* Stack children vertically */
          height: calc(100vh - 48px); /* Full viewport height minus nav bar height (~48px) */
          overflow: hidden; /* Prevent scrolling on root */
          background-color: #f8f9fa; /* Light gray background */
        }
        
        /* Header styling: blue gradient background, white text */
        .app-header {
          background: linear-gradient(135deg, #007bff, #0056b3); /* Blue gradient */
          color: white; /* White text */
          padding: 0.75rem 1rem; /* Reduced vertical padding to keep height minimal */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          flex-shrink: 0; /* Don't shrink when space is limited */
        }
        
        /* Header content: flex layout for upload and title on same line */
        .header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          max-width: 100%;
        }
        
        /* Header upload section: left side, compact */
        .header-upload-section {
          flex-shrink: 0;
        }
        
        /* Header title section: takes remaining space, centered */
        .header-title-section {
          flex: 1;
          text-align: center;
        }
        
        /* Header title: large, bold font */
        .app-header h1 {
          margin: 0 0 0.25rem 0; /* Remove default margin, small bottom margin */
          font-size: 1.75rem; /* Large font size */
          font-weight: 700; /* Bold */
        }
        
        /* Header subtitle: smaller, slightly transparent */
        .app-header p {
          margin: 0; /* Remove default margin */
          font-size: 0.9rem; /* Smaller than title */
          opacity: 0.9; /* Slightly transparent */
        }
        
        /* Compact file upload styling for header - minimal size */
        .header-upload-section .file-upload-container {
          max-width: 180px;
          margin: 0;
        }
        
        .header-upload-section .file-upload-area {
          padding: 8px 12px;
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          min-height: auto;
        }
        
        .header-upload-section .file-upload-area:hover {
          background-color: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .header-upload-section .file-upload-area.drag-active {
          background-color: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
        }
        
        .header-upload-section .upload-icon {
          display: none; /* Hide icon in header */
        }
        
        .header-upload-section .upload-content h3 {
          display: none; /* Hide title in header */
        }
        
        .header-upload-section .upload-content p {
          display: none; /* Hide description in header */
        }
        
        .header-upload-section .browse-button {
          padding: 6px 12px;
          font-size: 12px;
          margin: 0;
          width: 100%;
          background-color: #22c55e; /* Modern vibrant green */
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
          font-weight: 600;
        }
        
        .header-upload-section .browse-button:hover {
          background-color: #16a34a; /* Darker green on hover */
          box-shadow: 0 4px 8px rgba(34, 197, 94, 0.4);
        }
        
        .header-upload-section .loading-spinner {
          gap: 8px;
        }
        
        .header-upload-section .spinner {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }
        
        .header-upload-section .loading-spinner p {
          font-size: 11px;
          margin: 0;
        }
        
        /* Error message in header - compact */
        .error-message-header {
          background-color: rgba(248, 215, 218, 0.9);
          border: 1px solid rgba(245, 198, 203, 0.8);
          color: #721c24;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }
        
        .error-message-header p {
          margin: 0;
        }
        
        /* Main content area: horizontal flex layout (sidebar + map) */
        .app-main {
          display: flex; /* Flexbox layout */
          flex-direction: row; /* Side-by-side layout */
          height: calc(100vh - 48px - 80px); /* Full height minus nav bar and header */
          overflow: hidden; /* Prevent scrolling */
        }
        
        /* Left sidebar: fixed width, scrollable content */
        .sidebar {
          width: 350px; /* Fixed width */
          flex-shrink: 0; /* Don't shrink */
          background-color: #f8f9fa; /* Light gray */
          overflow-y: auto; /* Vertical scrolling if content overflows */
          padding: 1rem; /* Internal padding */
          border-right: 1px solid #dee2e6; /* Right border separator */
          display: flex; /* Flexbox for internal layout */
          flex-direction: column; /* Stack children vertically */
          gap: 1rem; /* Gap between children */
        }
        
        /* Error message box: red-themed alert */
        .error-message {
          background-color: #f8d7da; /* Light red background */
          border: 1px solid #f5c6cb; /* Red border */
          color: #721c24; /* Dark red text */
          padding: 0.75rem; /* Internal padding */
          border-radius: 4px; /* Rounded corners */
          margin-top: 0.5rem; /* Top margin for spacing */
          font-size: 0.85rem; /* Smaller font for header */
        }
        
        /* Error message heading */
        .error-message h4 {
          margin: 0 0 0.5rem 0; /* Remove top/left/right margins, small bottom margin */
        }
        
        /* Error message paragraph */
        .error-message p {
          margin: 0; /* Remove default margin */
        }
        
        /* Network info panel: simple text box */
        .network-info {
          background: white; /* White background */
          border-radius: 6px; /* Rounded corners */
          padding: 0.75rem; /* Reduced padding */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          flex-shrink: 0; /* Don't shrink */
        }
        
        /* Network info heading: compact */
        .network-info h3 {
          margin: 0 0 0.5rem 0; /* Reduced bottom margin */
          color: #333; /* Dark gray text */
          font-size: 0.95rem; /* Smaller font */
          font-weight: 600; /* Semi-bold */
        }
        
        /* Simple text list for network statistics */
        .info-list {
          font-size: 0.85rem; /* Small font */
          color: #495057; /* Medium gray */
          line-height: 1.6; /* Line spacing */
        }
        
        .info-list > div {
          margin-bottom: 0.25rem; /* Small spacing between items */
        }
        
        .info-list > div:last-child {
          margin-bottom: 0; /* No margin on last item */
        }
        
        /* Select Zone button - green, matches upload button style */
        .select-zone-button {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #22c55e; /* Modern vibrant green */
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
          margin-top: 1rem;
        }
        
        .select-zone-button:hover {
          background-color: #16a34a; /* Darker green on hover */
          box-shadow: 0 4px 8px rgba(34, 197, 94, 0.4);
          transform: translateY(-1px);
        }
        
        .select-zone-button:active {
          transform: translateY(0);
        }
        
        /* Zone Name Dialog */
        .zone-name-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        
        .zone-name-dialog {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          min-width: 400px;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .zone-name-dialog h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.2rem;
        }
        
        .zone-name-dialog p {
          margin: 0 0 1rem 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .zone-name-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 1rem;
          box-sizing: border-box;
        }
        
        .zone-name-input:focus {
          outline: none;
          border-color: #22c55e;
        }
        
        .zone-name-dialog-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        
        .zone-name-dialog-buttons button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .zone-name-dialog-buttons .cancel-button {
          background-color: #6c757d;
          color: white;
        }
        
        .zone-name-dialog-buttons .cancel-button:hover {
          background-color: #5a6268;
        }
        
        .zone-name-dialog-buttons .save-button {
          background-color: #22c55e;
          color: white;
        }
        
        .zone-name-dialog-buttons .save-button:hover:not(:disabled) {
          background-color: #16a34a;
        }
        
        .zone-name-dialog-buttons .save-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        /* Map container: takes remaining space, relative positioning for overlay */
        .map-container {
          flex: 1; /* Take remaining horizontal space */
          height: 100%; /* Full height */
          position: relative; /* For absolute positioning of overlay children */
          background-color: white; /* White background */
        }
        
        /* Map element: full width and height */
        .main-map {
          width: 100%; /* Full width */
          height: 100%; /* Full height */
        }
        
        /* Responsive design: mobile/tablet breakpoint (768px and below) */
        @media (max-width: 768px) {
          /* Smaller header title on mobile */
          .app-header h1 {
            font-size: 1.5rem; /* Reduced from 1.75rem */
          }
          
          /* Smaller header subtitle on mobile */
          .app-header p {
            font-size: 0.85rem; /* Reduced from 0.9rem */
          }
          
          /* Stack sidebar and map vertically on mobile */
          .app-main {
            flex-direction: column; /* Change from row to column */
            height: calc(100vh - 48px - 70px); /* Adjusted height for nav bar and smaller header */
          }
          
          /* Sidebar: full width, limited height on mobile */
          .sidebar {
            width: 100%; /* Full width instead of 350px */
            max-height: 40vh; /* Maximum 40% of viewport height */
            border-right: none; /* Remove right border */
            border-bottom: 1px solid #dee2e6; /* Add bottom border */
            padding: 0.75rem; /* Reduced padding */
          }
          
          /* Reduced padding on mobile */
          .network-info {
            padding: 1rem; /* Reduced from 1.5rem */
          }
          
          /* Stack header content vertically on mobile */
          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          
          /* Header title section: center on mobile */
          .header-title-section {
            text-align: center;
          }
          
          /* Header upload section: full width on mobile */
          .header-upload-section {
            width: 100%;
          }
          
          .header-upload-section .file-upload-container {
            max-width: 100%;
          }
          
          /* Map container adjustments for mobile */
          .map-container {
            flex: 1; /* Take remaining vertical space */
            min-height: 0; /* Allow shrinking */
          }
          
          /* Two-column grid for info items on mobile */
          .info-grid {
            grid-template-columns: repeat(2, 1fr); /* Two columns instead of one */
          }
        }
      `}</style>
    </div>
  );
}

