// Import React Router DOM components for client-side routing (navigation between pages without page reload)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import NetworkProvider (context provider) for global network state management
import { NetworkProvider } from './context/NetworkContext';
// Import page components
import { NetworkEditorPage } from './pages/NetworkEditorPage'; // Network editor (map workspace)
import { SimulatorPage } from './pages/SimulatorPage'; // Page component for simulation control and monitoring
import { MonitoringPage } from './pages/MonitoringPage'; // Page component for monitoring service control and anomaly detection
import { AppShell } from './layout/AppShell';

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
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<NetworkEditorPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
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