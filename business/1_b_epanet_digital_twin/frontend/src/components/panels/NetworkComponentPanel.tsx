import { useEffect, useMemo, useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useEditor } from '../../context/EditorContext';
import type {
  Junction,
  Pipe,
  Reservoir,
  Tank,
  Pump,
  Valve,
  ParsedNetwork,
} from '../../utils/epanetParser';

type Draft =
  | { kind: 'junction'; value: Junction }
  | { kind: 'reservoir'; value: Reservoir }
  | { kind: 'tank'; value: Tank }
  | { kind: 'pipe'; value: Pipe }
  | { kind: 'pump'; value: Pump }
  | { kind: 'valve'; value: Valve };

function replaceById<T extends { id: string }>(items: T[], next: T): T[] {
  return items.map((it) => (it.id === next.id ? next : it));
}

function updateNetworkWithDraft(network: ParsedNetwork, draft: Draft): ParsedNetwork {
  switch (draft.kind) {
    case 'junction':
      return { ...network, junctions: replaceById(network.junctions, draft.value) };
    case 'reservoir':
      return { ...network, reservoirs: replaceById(network.reservoirs, draft.value) };
    case 'tank':
      return { ...network, tanks: replaceById(network.tanks, draft.value) };
    case 'pipe':
      return { ...network, pipes: replaceById(network.pipes, draft.value) };
    case 'pump':
      return { ...network, pumps: replaceById(network.pumps, draft.value) };
    case 'valve':
      return { ...network, valves: replaceById(network.valves, draft.value) };
  }
}

export function NetworkComponentPanel() {
  const { network, setNetwork } = useNetwork();
  const { selected, setSelected } = useEditor();

  const selectedAsset = useMemo(() => {
    if (!network || !selected) return null;

    switch (selected.kind) {
      case 'junction':
        return network.junctions.find((x) => x.id === selected.id) || null;
      case 'reservoir':
        return network.reservoirs.find((x) => x.id === selected.id) || null;
      case 'tank':
        return network.tanks.find((x) => x.id === selected.id) || null;
      case 'pipe':
        return network.pipes.find((x) => x.id === selected.id) || null;
      case 'pump':
        return network.pumps.find((x) => x.id === selected.id) || null;
      case 'valve':
        return network.valves.find((x) => x.id === selected.id) || null;
    }
  }, [network, selected]);

  const [draft, setDraft] = useState<Draft | null>(null);

  // Reset draft when selection changes
  useEffect(() => {
    if (!network || !selected) {
      setDraft(null);
      return;
    }

    if (!selectedAsset) {
      setDraft(null);
      return;
    }

    // clone the selected asset into a draft object
    switch (selected.kind) {
      case 'junction':
        setDraft({ kind: 'junction', value: { ...(selectedAsset as Junction) } });
        break;
      case 'reservoir':
        setDraft({ kind: 'reservoir', value: { ...(selectedAsset as Reservoir) } });
        break;
      case 'tank':
        setDraft({ kind: 'tank', value: { ...(selectedAsset as Tank) } });
        break;
      case 'pipe':
        setDraft({ kind: 'pipe', value: { ...(selectedAsset as Pipe) } });
        break;
      case 'pump':
        setDraft({ kind: 'pump', value: { ...(selectedAsset as Pump) } });
        break;
      case 'valve':
        setDraft({ kind: 'valve', value: { ...(selectedAsset as Valve) } });
        break;
    }
  }, [network, selected, selectedAsset]);

  const applyDraft = () => {
    if (!network || !draft) return;
    setNetwork(updateNetworkWithDraft(network, draft));
  };

  return (
    <div className="rtdwms-panel">
      <div className="rtdwms-panel-header">
        <div className="rtdwms-panel-title">Network Component</div>
      </div>

      {!network ? (
        <div className="rtdwms-panel-empty">
          <div className="rtdwms-panel-empty-title">No network loaded</div>
          <div className="rtdwms-panel-empty-subtitle">
            Use <strong>Project → Open INP</strong> to load a model.
          </div>
        </div>
      ) : (
        <div className="rtdwms-panel-body">
          <div className="rtdwms-kv">
            <div className="k">Title</div>
            <div className="v">{network.title || 'Untitled'}</div>
          </div>

          <div className="rtdwms-divider" />

          {!selected ? (
            <div className="rtdwms-panel-section">
              <div className="rtdwms-panel-section-title">Selection</div>
              <div className="rtdwms-panel-section-note">Click a component on the map to edit it here.</div>
            </div>
          ) : !selectedAsset || !draft ? (
            <div className="rtdwms-panel-section">
              <div className="rtdwms-panel-section-title">Selection</div>
              <div className="rtdwms-panel-section-note">
                Selected item not found in the current network.
              </div>
              <div className="rtdwms-row">
                <button type="button" onClick={() => setSelected(null)}>
                  Clear selection
                </button>
              </div>
            </div>
          ) : (
            <div className="rtdwms-panel-section">
              <div className="rtdwms-panel-section-title">
                {draft.kind.toUpperCase()} — {draft.value.id}
              </div>

              {draft.kind === 'junction' && (
                <div className="rtdwms-form">
                  <label>
                    Elevation
                    <input
                      type="number"
                      value={draft.value.elevation}
                      onChange={(e) =>
                        setDraft({
                          kind: 'junction',
                          value: { ...draft.value, elevation: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Demand
                    <input
                      type="number"
                      value={draft.value.demand}
                      onChange={(e) =>
                        setDraft({
                          kind: 'junction',
                          value: { ...draft.value, demand: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Pattern
                    <input
                      value={draft.value.pattern ?? ''}
                      onChange={(e) =>
                        setDraft({
                          kind: 'junction',
                          value: {
                            ...draft.value,
                            pattern: e.target.value ? e.target.value : undefined,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {draft.kind === 'reservoir' && (
                <div className="rtdwms-form">
                  <label>
                    Head
                    <input
                      type="number"
                      value={draft.value.head}
                      onChange={(e) =>
                        setDraft({
                          kind: 'reservoir',
                          value: { ...draft.value, head: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Pattern
                    <input
                      value={draft.value.pattern ?? ''}
                      onChange={(e) =>
                        setDraft({
                          kind: 'reservoir',
                          value: {
                            ...draft.value,
                            pattern: e.target.value ? e.target.value : undefined,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {draft.kind === 'tank' && (
                <div className="rtdwms-form">
                  <label>
                    Elevation
                    <input
                      type="number"
                      value={draft.value.elevation}
                      onChange={(e) =>
                        setDraft({
                          kind: 'tank',
                          value: { ...draft.value, elevation: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Init level
                    <input
                      type="number"
                      value={draft.value.initLevel}
                      onChange={(e) =>
                        setDraft({
                          kind: 'tank',
                          value: { ...draft.value, initLevel: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Min level
                    <input
                      type="number"
                      value={draft.value.minLevel}
                      onChange={(e) =>
                        setDraft({
                          kind: 'tank',
                          value: { ...draft.value, minLevel: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Max level
                    <input
                      type="number"
                      value={draft.value.maxLevel}
                      onChange={(e) =>
                        setDraft({
                          kind: 'tank',
                          value: { ...draft.value, maxLevel: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Diameter
                    <input
                      type="number"
                      value={draft.value.diameter}
                      onChange={(e) =>
                        setDraft({
                          kind: 'tank',
                          value: { ...draft.value, diameter: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {draft.kind === 'pipe' && (
                <div className="rtdwms-form">
                  <div className="rtdwms-inline-note">
                    From <strong>{draft.value.node1}</strong> → <strong>{draft.value.node2}</strong>
                  </div>
                  <label>
                    Length
                    <input
                      type="number"
                      value={draft.value.length}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pipe',
                          value: { ...draft.value, length: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Diameter
                    <input
                      type="number"
                      value={draft.value.diameter}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pipe',
                          value: { ...draft.value, diameter: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Roughness
                    <input
                      type="number"
                      value={draft.value.roughness}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pipe',
                          value: { ...draft.value, roughness: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Minor loss
                    <input
                      type="number"
                      value={draft.value.minorLoss}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pipe',
                          value: { ...draft.value, minorLoss: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Status
                    <input
                      value={draft.value.status}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pipe',
                          value: { ...draft.value, status: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {draft.kind === 'pump' && (
                <div className="rtdwms-form">
                  <div className="rtdwms-inline-note">
                    From <strong>{draft.value.node1}</strong> → <strong>{draft.value.node2}</strong>
                  </div>
                  <label>
                    Parameters
                    <input
                      value={draft.value.parameters}
                      onChange={(e) =>
                        setDraft({
                          kind: 'pump',
                          value: { ...draft.value, parameters: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {draft.kind === 'valve' && (
                <div className="rtdwms-form">
                  <div className="rtdwms-inline-note">
                    From <strong>{draft.value.node1}</strong> → <strong>{draft.value.node2}</strong>
                  </div>
                  <label>
                    Diameter
                    <input
                      type="number"
                      value={draft.value.diameter}
                      onChange={(e) =>
                        setDraft({
                          kind: 'valve',
                          value: { ...draft.value, diameter: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Type
                    <input
                      value={draft.value.type}
                      onChange={(e) =>
                        setDraft({
                          kind: 'valve',
                          value: { ...draft.value, type: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Setting
                    <input
                      type="number"
                      value={draft.value.setting}
                      onChange={(e) =>
                        setDraft({
                          kind: 'valve',
                          value: { ...draft.value, setting: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    Minor loss
                    <input
                      type="number"
                      value={draft.value.minorLoss}
                      onChange={(e) =>
                        setDraft({
                          kind: 'valve',
                          value: { ...draft.value, minorLoss: Number(e.target.value) },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              <div className="rtdwms-row">
                <button type="button" onClick={() => setSelected(null)}>
                  Clear selection
                </button>
                <button type="button" className="rtdwms-primary" onClick={applyDraft}>
                  Apply
                </button>
              </div>
            </div>
          )}

          <style>{`
            .rtdwms-form {
              display: grid;
              grid-template-columns: 1fr;
              gap: 10px;
              margin-top: 10px;
            }

            .rtdwms-form label {
              display: grid;
              gap: 6px;
              font-size: 12px;
              color: #111827;
            }

            .rtdwms-form input {
              padding: 8px 10px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              font-size: 13px;
            }

            .rtdwms-inline-note {
              font-size: 12px;
              color: #6b7280;
              margin-top: 6px;
            }

            .rtdwms-row {
              display: flex;
              gap: 8px;
              margin-top: 12px;
            }

            .rtdwms-primary {
              background: #111827;
              color: #ffffff;
              border-color: #111827;
            }

            .rtdwms-primary:hover {
              background: #0b1220;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
