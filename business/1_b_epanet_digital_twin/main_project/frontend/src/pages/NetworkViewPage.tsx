// Import React hooks: useState for component state, useRef for DOM/element references, useEffect for side effects
import { useState, useRef, useEffect } from 'react';
// Import TypeScript type definitions (type-only imports, not runtime values)
import type { ParsedNetwork } from '../utils/epanetParser'; // Type for parsed EPANET network data structure
import type { LatLng } from '../utils/coordinateTransform'; // Type for latitude/longitude coordinate pairs
// Import React Router for navigation state
import { useLocation } from 'react-router-dom';
// Import custom React components
import { useNetwork } from '../context/NetworkContext'; // Hook to access global network state
import { FileUpload } from '../components/FileUpload'; // Component for uploading and parsing .inp files
import { NetworkMap } from '../components/NetworkMap'; // Leaflet map component that displays the geographic map
import { NetworkOverlay } from '../components/NetworkOverlay'; // Component that draws network elements (junctions, pipes) on the map
// Import Leaflet library for interactive maps (L is the global Leaflet namespace)
import L from 'leaflet';

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
const API_BASE = 'http://localhost:8000';

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
  const { network, networkId } = useNetwork(); // Get the network and networkId from the context
  
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
        const response = await fetch(`${API_BASE}/api/monitoring/anomalies?network_id=${networkId}&limit=1000`);
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
        const response = await fetch(`${API_BASE}/api/monitoring/status`);
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


  // Return JSX structure for the Network View page
  return (
    <div className="app">
      {/* Application header with title and subtitle */}
      <header className="app-header">
        <h1>RTDWMS - Water Network Monitor</h1>
        <p>Real-Time Dynamic Water Network Monitoring System for Jordanian Networks</p>
      </header>

      {/* Main content area: sidebar + map container */}
      <main className="app-main">
        {/* Left sidebar: contains file upload and network info */}
        <div className="sidebar">
          {/* File upload section: drag-and-drop interface for .inp files */}
          <div className="upload-section">
            {/* FileUpload component handles file selection, parsing, and storage in context */}
            <FileUpload 
              onNetworkParsed={handleNetworkParsed} // Callback when file is successfully parsed
              onError={handleError} // Callback when parsing fails
            />
            
            {/* Conditionally render error message if error state is set */}
            {/* Only displays when error !== null */}
            {error && (
              <div className="error-message">
                <h4>Error:</h4>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Conditionally render network information panel */}
          {/* Only displays when network is loaded (not null) */}
          {network && (
            <div className="network-info">
              <h3>Network Information</h3>
              {/* Grid layout displaying network statistics */}
              <div className="info-grid">
                {/* Network title from .inp file [TITLE] section */}
                <div className="info-item">
                  <span className="label">Title:</span>
                  <span className="value">{network.title}</span>
                </div>
                {/* Count of junction nodes (water distribution points) */}
                <div className="info-item">
                  <span className="label">Junctions:</span>
                  <span className="value">{network.junctions.length}</span>
                </div>
                {/* Count of reservoir nodes (water source, fixed head) */}
                <div className="info-item">
                  <span className="label">Reservoirs:</span>
                  <span className="value">{network.reservoirs.length}</span>
                </div>
                {/* Count of tank nodes (storage with variable level) */}
                <div className="info-item">
                  <span className="label">Tanks:</span>
                  <span className="value">{network.tanks.length}</span>
                </div>
                {/* Count of pipe links (conduits connecting nodes) */}
                <div className="info-item">
                  <span className="label">Pipes:</span>
                  <span className="value">{network.pipes.length}</span>
                </div>
                {/* Count of pump links (pressurized flow) */}
                <div className="info-item">
                  <span className="label">Pumps:</span>
                  <span className="value">{network.pumps.length}</span>
                </div>
                {/* Count of valve links (flow/head control) */}
                <div className="info-item">
                  <span className="label">Valves:</span>
                  <span className="value">{network.valves.length}</span>
                </div>
                {/* Count of nodes with geographic coordinates */}
                <div className="info-item">
                  <span className="label">Coordinates:</span>
                  <span className="value">{network.coordinates.length}</span>
                </div>
              </div>
            </div>
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
            <NetworkOverlay 
              map={mapRef.current!} // Pass Leaflet map instance to overlay (non-null assertion safe because mapReady is true)
              network={network} // Pass parsed network data for rendering
              anomalies={anomalies} // Pass monitoring anomalies for coloring
              highlightLocation={highlightLocation} // Pass location to highlight
              highlightSensorType={highlightSensorType} // Pass sensor type for highlighting
            />
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
        
        /* Header styling: blue gradient background, white text, centered */
        .app-header {
          background: linear-gradient(135deg, #007bff, #0056b3); /* Blue gradient */
          color: white; /* White text */
          padding: 1rem 1rem; /* Vertical and horizontal padding */
          text-align: center; /* Center-align text */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          flex-shrink: 0; /* Don't shrink when space is limited */
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
        
        /* Upload section: white card with shadow */
        .upload-section {
          background: white; /* White background */
          border-radius: 8px; /* Rounded corners */
          padding: 1.5rem; /* Internal padding */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          flex-shrink: 0; /* Don't shrink */
        }
        
        /* Error message box: red-themed alert */
        .error-message {
          background-color: #f8d7da; /* Light red background */
          border: 1px solid #f5c6cb; /* Red border */
          color: #721c24; /* Dark red text */
          padding: 1rem; /* Internal padding */
          border-radius: 4px; /* Rounded corners */
          margin-top: 1rem; /* Top margin for spacing */
        }
        
        /* Error message heading */
        .error-message h4 {
          margin: 0 0 0.5rem 0; /* Remove top/left/right margins, small bottom margin */
        }
        
        /* Error message paragraph */
        .error-message p {
          margin: 0; /* Remove default margin */
        }
        
        /* Network info panel: white card with shadow */
        .network-info {
          background: white; /* White background */
          border-radius: 8px; /* Rounded corners */
          padding: 1.5rem; /* Internal padding */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          flex-shrink: 0; /* Don't shrink */
        }
        
        /* Network info heading: blue underline */
        .network-info h3 {
          margin: 0 0 1rem 0; /* Remove top/left/right margins, bottom margin */
          color: #333; /* Dark gray text */
          border-bottom: 2px solid #007bff; /* Blue underline */
          padding-bottom: 0.5rem; /* Space between text and border */
          font-size: 1.1rem; /* Slightly larger font */
        }
        
        /* Grid layout for network statistics */
        .info-grid {
          display: grid; /* CSS Grid layout */
          grid-template-columns: 1fr; /* Single column (stacks items vertically) */
          gap: 0.75rem; /* Gap between grid items */
        }
        
        /* Individual info item: label + value pair */
        .info-item {
          display: flex; /* Flexbox for horizontal layout */
          justify-content: space-between; /* Space between label and value */
          align-items: center; /* Vertical center alignment */
          padding: 0.5rem; /* Internal padding */
          background-color: #f8f9fa; /* Light gray background */
          border-radius: 4px; /* Rounded corners */
          border-left: 4px solid #007bff; /* Blue left border accent */
        }
        
        /* Info item label: semi-bold, gray */
        .info-item .label {
          font-weight: 600; /* Semi-bold */
          color: #495057; /* Medium gray */
          font-size: 0.9rem; /* Small font */
        }
        
        /* Info item value: bold, blue */
        .info-item .value {
          font-weight: 700; /* Bold */
          color: #007bff; /* Blue color */
          font-size: 0.9rem; /* Small font */
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
          .upload-section,
          .network-info {
            padding: 1rem; /* Reduced from 1.5rem */
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

