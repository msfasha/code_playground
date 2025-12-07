// Import React Router DOM components for client-side routing (navigation between pages without page reload)
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
// Import NetworkProvider (context provider) for global network state management
import { NetworkProvider } from './context/NetworkContext';
// Import page components
import { NetworkViewPage } from './pages/NetworkViewPage'; // Page component for network visualization
import { SimulatorPage } from './pages/SimulatorPage'; // Page component for simulation control and monitoring
import { MonitoringPage } from './pages/MonitoringPage'; // Page component for monitoring service control and anomaly detection

/**
 * App Component
 * 
 * Main routing component that handles navigation between pages.
 * This component is rendered inside BrowserRouter (see AppWithRouter below).
 * 
 * Responsibilities:
 * - Render navigation bar with page links
 * - Define routes and their corresponding page components
 * - Highlight active route in navigation
 */
function App() {
  // useLocation hook from react-router-dom: returns current route location object
  // location.pathname contains the current path (e.g., "/" or "/simulator")
  // Used to conditionally apply 'active' class to the current page's nav link
  const location = useLocation();

  return (
    <>
      {/* Navigation bar: top-level navigation between pages */}
      <nav className="main-nav">
        {/* Link to Network View page (home route) */}
        {/* className: conditionally adds 'active' when current path is exactly "/" */}
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Network View
        </Link>
        
        {/* Link to Simulator page */}
        {/* className: conditionally adds 'active' when current path is "/simulator" */}
        <Link to="/simulator" className={location.pathname === '/simulator' ? 'active' : ''}>
          Simulator
        </Link>
        
        {/* Link to Monitoring page */}
        {/* className: conditionally adds 'active' when current path is "/monitoring" */}
        <Link to="/monitoring" className={location.pathname === '/monitoring' ? 'active' : ''}>
          Monitoring
        </Link>
      </nav>
      
      {/* React Router Routes: defines which component renders for each URL path */}
      {/* Routes component contains Route definitions */}
      <Routes>
        {/* Root path "/" renders NetworkViewPage component */}
        <Route path="/" element={<NetworkViewPage />} />
        
        {/* Path "/simulator" renders SimulatorPage component */}
        <Route path="/simulator" element={<SimulatorPage />} />
        
        {/* Path "/monitoring" renders MonitoringPage component */}
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Routes>
      
      {/* Inline CSS styles for navigation bar */}
      <style>{`
        /* Navigation bar container */
        .main-nav {
          background-color: #f8f9fa; /* Light gray background */
          border-bottom: 1px solid #dee2e6; /* Bottom border separator */
          padding: 0.5rem 2rem; /* Vertical and horizontal padding */
          display: flex; /* Flexbox for horizontal layout */
          gap: 1rem; /* Gap between navigation links */
        }
        
        /* Navigation link styling: default state */
        .main-nav a {
          padding: 0.5rem 1rem; /* Internal padding for clickable area */
          text-decoration: none; /* Remove underline */
          color: #495057; /* Medium gray text */
          border-radius: 4px; /* Rounded corners */
          transition: all 0.3s; /* Smooth transitions for hover/active states */
        }
        
        /* Navigation link: hover state (mouse over) */
        .main-nav a:hover {
          background-color: #e9ecef; /* Light gray background on hover */
        }
        
        /* Navigation link: active state (current page) */
        .main-nav a.active {
          background-color: #007bff; /* Blue background */
          color: white; /* White text */
        }
      `}</style>
    </>
  );
}

/**
 * AppWithRouter Component (Default Export)
 * 
 * Root component that wraps the entire application.
 * 
 * Component Hierarchy (outer to inner):
 * 1. NetworkProvider - Provides global network state context to all children
 * 2. BrowserRouter - Enables client-side routing (no page reloads on navigation)
 * 3. App - Main routing component (renders navigation and routes)
 * 
 * Why NetworkProvider wraps BrowserRouter:
 * - NetworkContext must be available to ALL route components
 * - If BrowserRouter was outside, routes wouldn't have access to context
 * - This ensures network state persists across page navigations
 * 
 * Why BrowserRouter is needed:
 * - Enables React Router's client-side routing features
 * - Allows useLocation, useNavigate, Link components to work
 * - Provides routing context to Route components
 * 
 * @returns Root component tree with providers and routing
 */
export default function AppWithRouter() {
  return (
    // NetworkProvider: Wraps entire app to provide global network state
    // All child components can access network data via useNetwork() hook
    // Network data is persisted to localStorage automatically
    <NetworkProvider>
      {/* BrowserRouter: Enables client-side routing (URL changes without page reload) */}
      {/* Provides routing context to Link, Route, useLocation, etc. */}
      <BrowserRouter>
        {/* App component: Contains navigation bar and route definitions */}
        <App />
      </BrowserRouter>
    </NetworkProvider>
  );
}