import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ParsedNetwork } from '../utils/epanetParser';

/**
 * NetworkContext provides global state management for the EPANET network data.
 * 
 * This context stores:
 * - network: The parsed EPANET network object (persisted to localStorage)
 * - networkFile: The raw File object (not persisted, lost on refresh)
 * - networkId: The backend-assigned UUID after network upload (persisted to localStorage)
 * 
 * The network object is automatically saved to localStorage whenever it's updated,
 * and restored when the app initializes, ensuring persistence across page refreshes
 * and navigation between routes.
 */
interface NetworkContextType {
  network: ParsedNetwork | null; // Parsed network data (junctions, pipes, coordinates, etc.)
  networkFile: File | null; // Raw .inp file object (memory only, not persisted)
  networkId: string | null; // Backend UUID after network upload and baseline calculation
  setNetwork: (network: ParsedNetwork | null) => void; // Updates network and persists to localStorage
  setNetworkFile: (file: File | null) => void; // Updates networkFile (memory only)
  setNetworkId: (id: string | null) => void; // Updates networkId and persists to localStorage
}

// Create React Context for network state (undefined when accessed outside provider)
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// localStorage keys for persisting network data across page refreshes
const NETWORK_STORAGE_KEY = 'rtdwms_network'; // Stores parsed network as JSON
const NETWORK_ID_STORAGE_KEY = 'rtdwms_networkId'; // Stores backend network UUID

/**
 * NetworkProvider component that wraps the app and provides network state globally.
 * 
 * On mount, it attempts to restore network and networkId from localStorage.
 * All updates to network and networkId are automatically persisted.
 * 
 * @param children - React components that will have access to network context
 */
export function NetworkProvider({ children }: { children: ReactNode }) {
  /**
   * Helper function to load and validate network from localStorage.
   * Returns null if not found, invalid, or parse error occurs.
   * 
   * @returns ParsedNetwork object or null
   */
  const loadNetworkFromStorage = (): ParsedNetwork | null => {
    try {
      const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[NetworkContext] Loaded network from localStorage:', parsed?.title, `(${parsed?.junctions?.length || 0} junctions)`);
        // Validate it's a proper network object (must have junctions array)
        if (parsed && parsed.junctions && Array.isArray(parsed.junctions)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('[NetworkContext] Failed to load network from localStorage:', e);
    }
    return null;
  };

  // Initialize network state from localStorage on mount (lazy initialization via function)
  // This ensures network persists across page refreshes and navigation
  const [network, setNetworkState] = useState<ParsedNetwork | null>(() => {
    const loaded = loadNetworkFromStorage();
    console.log('[NetworkContext] Initial network state:', loaded ? 'Loaded from storage' : 'None');
    return loaded;
  });
  
  // networkFile is not persisted (File objects cannot be serialized to localStorage)
  // It's kept in memory for file upload operations but lost on refresh
  const [networkFile, setNetworkFile] = useState<File | null>(null);
  
  // Initialize networkId from localStorage (UUID assigned by backend after upload)
  const [networkId, setNetworkIdState] = useState<string | null>(() => {
    const id = localStorage.getItem(NETWORK_ID_STORAGE_KEY);
    console.log('[NetworkContext] Initial networkId:', id || 'None');
    return id;
  });
  
  /**
   * Listen for localStorage changes from other browser tabs/windows.
   * This ensures the network state stays synchronized if the user opens multiple tabs.
   * 
   * The 'storage' event fires when localStorage is modified in another tab,
   * allowing cross-tab synchronization of network data.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.junctions && Array.isArray(parsed.junctions)) {
            setNetworkState(parsed);
            console.log('[NetworkContext] Synced network from storage event');
          }
        } catch (e) {
          console.error('[NetworkContext] Failed to parse on storage change:', e);
        }
      }
    };
    
    // Register event listener and cleanup on unmount
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  /**
   * Updates the network state and persists it to localStorage.
   * This function is wrapped in useCallback to prevent unnecessary re-renders
   * of components that depend on it.
   * 
   * @param newNetwork - The parsed network object to store, or null to clear
   */
  const setNetwork = useCallback((newNetwork: ParsedNetwork | null) => {
    console.log('[NetworkContext] Setting network:', newNetwork ? `${newNetwork.title} (${newNetwork.junctions?.length || 0} junctions)` : 'null');
    setNetworkState(newNetwork); // Update React state immediately
    if (newNetwork) {
      try {
        const serialized = JSON.stringify(newNetwork);
        localStorage.setItem(NETWORK_STORAGE_KEY, serialized); // Persist to localStorage
        console.log('[NetworkContext] Network saved to localStorage, size:', serialized.length, 'bytes');
        
        // Verify it was saved successfully (safety check)
        const verify = localStorage.getItem(NETWORK_STORAGE_KEY);
        if (!verify) {
          console.error('[NetworkContext] WARNING: Network not found in localStorage after save!');
        }
      } catch (e) {
        console.error('[NetworkContext] Failed to save network to localStorage:', e);
        if (e instanceof Error) {
          console.error('[NetworkContext] Error details:', e.message, e.stack);
        }
      }
    } else {
      // If network is null, remove it from localStorage
      localStorage.removeItem(NETWORK_STORAGE_KEY);
      console.log('[NetworkContext] Network removed from localStorage');
    }
  }, []);
  
  /**
   * Updates the networkId state and persists it to localStorage.
   * networkId is the backend UUID assigned after network upload and baseline calculation.
   * 
   * @param id - The backend network UUID, or null to clear
   */
  const setNetworkId = useCallback((id: string | null) => {
    setNetworkIdState(id); // Update React state
    if (id) {
      localStorage.setItem(NETWORK_ID_STORAGE_KEY, id); // Persist to localStorage
    } else {
      localStorage.removeItem(NETWORK_ID_STORAGE_KEY); // Remove if null
    }
  }, []);
  
  /**
   * Safety mechanism: If network state becomes null but localStorage has data,
   * automatically restore it. This prevents accidental state loss.
   * Also logs network state changes for debugging.
   */
  useEffect(() => {
    console.log('[NetworkContext] Current network state:', network ? `${network.title} (${network.junctions?.length || 0} junctions)` : 'null');
    
    // Safety check: if network is null but localStorage has it, restore it
    // This handles edge cases where state might be lost due to React re-renders
    if (!network) {
      const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.junctions && Array.isArray(parsed.junctions)) {
            console.warn('[NetworkContext] Network state was null but found in localStorage - restoring...');
            setNetworkState(parsed);
          }
        } catch (e) {
          console.error('[NetworkContext] Failed to restore from localStorage:', e);
        }
      }
    }
  }, [network]);
  
  /**
   * Log networkFile changes for debugging.
   * Note: networkFile is not persisted and will be lost on refresh.
   */
  useEffect(() => {
    console.log('[NetworkContext] Current networkFile:', networkFile ? networkFile.name : 'null');
  }, [networkFile]);
  
  /**
   * Log networkId changes for debugging.
   */
  useEffect(() => {
    console.log('[NetworkContext] Current networkId:', networkId || 'null');
  }, [networkId]);

  // Provide network state and setters to all child components
  return (
    <NetworkContext.Provider value={{ network, networkFile, networkId, setNetwork, setNetworkFile, setNetworkId }}>
      {children}
    </NetworkContext.Provider>
  );
}

/**
 * Custom hook to access the NetworkContext.
 * 
 * This hook must be used within a NetworkProvider component.
 * 
 * @returns NetworkContextType object with network state and setters
 * @throws Error if used outside NetworkProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { network, setNetwork } = useNetwork();
 *   // Use network data...
 * }
 * ```
 */
export function useNetwork() {
  const context = useContext(NetworkContext); // Access the context value
  // Safety check: ensure hook is used within provider
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
}



