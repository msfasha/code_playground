import { useNetwork } from '../../context/NetworkContext';

export function NetworkComponentPanel() {
  const { network, networkId } = useNetwork();

  return (
    <div className="rtdwms-panel">
      <div className="rtdwms-panel-header">
        <div className="rtdwms-panel-title">Network</div>
      </div>

      {!network ? (
        <div className="rtdwms-panel-empty">
          <div className="rtdwms-panel-empty-title">No network loaded</div>
          <div className="rtdwms-panel-empty-subtitle">Use <strong>Project → Open INP</strong> to load a model.</div>
        </div>
      ) : (
        <div className="rtdwms-panel-body">
          <div className="rtdwms-kv">
            <div className="k">Title</div>
            <div className="v">{network.title || 'Untitled'}</div>
          </div>

          {networkId && (
            <div className="rtdwms-kv">
              <div className="k">Network ID</div>
              <div className="v">{networkId}</div>
            </div>
          )}

          <div className="rtdwms-divider" />

          <div className="rtdwms-kv"><div className="k">Junctions</div><div className="v">{network.junctions.length}</div></div>
          <div className="rtdwms-kv"><div className="k">Reservoirs</div><div className="v">{network.reservoirs.length}</div></div>
          <div className="rtdwms-kv"><div className="k">Tanks</div><div className="v">{network.tanks.length}</div></div>
          <div className="rtdwms-kv"><div className="k">Pipes</div><div className="v">{network.pipes.length}</div></div>
          <div className="rtdwms-kv"><div className="k">Pumps</div><div className="v">{network.pumps.length}</div></div>
          <div className="rtdwms-kv"><div className="k">Valves</div><div className="v">{network.valves.length}</div></div>

          <style>{`
            .rtdwms-kv { display: grid; grid-template-columns: 120px 1fr; gap: 8px; font-size: 12px; padding: 6px 0; }
            .rtdwms-kv .k { color: #6b7280; }
            .rtdwms-kv .v { color: #111827; word-break: break-word; }
            .rtdwms-divider { height: 1px; background: #e5e7eb; margin: 10px 0; }
            .rtdwms-panel-empty { padding: 12px; }
            .rtdwms-panel-empty-title { font-weight: 700; color: #111827; }
            .rtdwms-panel-empty-subtitle { margin-top: 6px; font-size: 12px; color: #6b7280; }
            .rtdwms-panel-body { padding: 12px; }
            .rtdwms-panel-header { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .rtdwms-panel-title { font-weight: 700; color: #111827; }
          `}</style>
        </div>
      )}
    </div>
  );
}
