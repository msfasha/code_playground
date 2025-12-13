/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ParsedNetwork } from '../utils/epanetParser';
import { isPalestinianUTM, transformPalestinianUTMToWGS84 } from '../utils/coordinateTransform';

interface NetworkContextType {
  network: ParsedNetwork | null;
  networkFile: File | null;
  networkId: string | null;
  setNetwork: (network: ParsedNetwork | null) => void;
  setNetworkFile: (file: File | null) => void;
  setNetworkId: (id: string | null) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const NETWORK_STORAGE_KEY = 'rtdwms_network';
const NETWORK_ID_STORAGE_KEY = 'rtdwms_networkId';

function normalizeNetworkToWGS84(network: ParsedNetwork): ParsedNetwork {
  const hasUtm =
    (network.coordinates || []).some((c) => isPalestinianUTM(c.x, c.y)) ||
    (network.vertices || []).some((v) => isPalestinianUTM(v.x, v.y));

  if (!hasUtm) return network;

  return {
    ...network,
    // Store as WGS84: x=lng, y=lat
    coordinates: (network.coordinates || []).map((c) => {
      const ll = transformPalestinianUTMToWGS84(c.x, c.y);
      return { ...c, x: ll.lng, y: ll.lat };
    }),
    vertices: (network.vertices || []).map((v) => {
      const ll = transformPalestinianUTMToWGS84(v.x, v.y);
      return { ...v, x: ll.lng, y: ll.lat };
    }),
  };
}

function loadNetworkFromStorage(): ParsedNetwork | null {
  try {
    const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed || !Array.isArray(parsed.junctions)) return null;

    return normalizeNetworkToWGS84(parsed);
  } catch {
    return null;
  }
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetworkState] = useState<ParsedNetwork | null>(() => loadNetworkFromStorage());
  const [networkFile, setNetworkFile] = useState<File | null>(null);
  const [networkId, setNetworkIdState] = useState<string | null>(() => localStorage.getItem(NETWORK_ID_STORAGE_KEY));

  // Keep in sync across tabs
  useEffect(() => {
    const handleStorage = () => {
      const n = loadNetworkFromStorage();
      setNetworkState(n);

      const id = localStorage.getItem(NETWORK_ID_STORAGE_KEY);
      setNetworkIdState(id);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setNetwork = useCallback((next: ParsedNetwork | null) => {
    const normalized = next ? normalizeNetworkToWGS84(next) : null;
    setNetworkState(normalized);

    if (normalized) localStorage.setItem(NETWORK_STORAGE_KEY, JSON.stringify(normalized));
    else localStorage.removeItem(NETWORK_STORAGE_KEY);
  }, []);

  const setNetworkId = useCallback((id: string | null) => {
    setNetworkIdState(id);
    if (id) localStorage.setItem(NETWORK_ID_STORAGE_KEY, id);
    else localStorage.removeItem(NETWORK_ID_STORAGE_KEY);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, networkFile, networkId, setNetwork, setNetworkFile, setNetworkId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
