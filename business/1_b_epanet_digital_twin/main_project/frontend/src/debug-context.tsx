// Debug component to test context state
import { useNetwork } from './context/NetworkContext';

export function DebugContext() {
  const { network, networkFile, networkId } = useNetwork();
  
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'white', padding: '10px', border: '1px solid black', zIndex: 9999 }}>
      <h4>Debug Context State:</h4>
      <p>Network: {network ? 'Loaded' : 'None'}</p>
      <p>NetworkFile: {networkFile ? 'Loaded' : 'None'}</p>
      <p>NetworkId: {networkId || 'None'}</p>
      {network && (
        <div>
          <p>Junctions: {network.junctions.length}</p>
          <p>Pipes: {network.pipes.length}</p>
        </div>
      )}
    </div>
  );
}



