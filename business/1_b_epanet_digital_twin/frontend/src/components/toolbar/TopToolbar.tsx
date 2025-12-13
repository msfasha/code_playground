import { useRef } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useEditor } from '../../context/EditorContext';
import { epanetParser } from '../../utils/epanetParser';

export function TopToolbar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setNetwork, setNetworkFile, setNetworkId, setSelectedSensors } = useNetwork();
  const { mode, setMode, setSelected, setDraftLink, setSelectedArea } = useEditor();

  const onNewProject = () => {
    setNetwork(null);
    setNetworkFile(null);
    setNetworkId(null);
    setSelectedSensors({ pipes: [], junctions: [] });
    setSelected(null);
    setSelectedArea([]);
    setMode('select');
    setDraftLink(null);
  };

  const onOpenInpClick = () => {
    fileInputRef.current?.click();
  };

  const onFilePicked: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const network = await epanetParser.parseINPFileFromFile(file);
      setNetworkFile(file);
      setNetwork(network);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      window.alert(`Failed to open INP: ${msg}`);
    } finally {
      // allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="rtdwms-toolbar">
      <div className="rtdwms-toolbar-group">
        <div className="rtdwms-menu">
          <button className="rtdwms-menu-button" type="button">
            Project ▾
          </button>
          <div className="rtdwms-menu-popover" role="menu">
            <button type="button" role="menuitem" onClick={onNewProject}>
              Create new project
            </button>
            <button type="button" role="menuitem" onClick={onOpenInpClick}>
              Open INP
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".inp"
          onChange={onFilePicked}
          style={{ display: 'none' }}
        />
      </div>

      <div className="rtdwms-toolbar-sep" />

      <div className="rtdwms-toolbar-group">
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'select' ? 'rtdwms-tool--active' : ''}`}
          title="Select"
          onClick={() => {
            setMode('select');
            setSelectedArea([]);
            setDraftLink(null);
          }}
        >
          Select
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'select-area' ? 'rtdwms-tool--active' : ''}`}
          title="Select Area"
          onClick={() => {
            setMode('select-area');
            setSelected(null);
            setDraftLink(null);
          }}
        >
          Select Area
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'junction' ? 'rtdwms-tool--active' : ''}`}
          title="Add junction"
          onClick={() => {
            setMode('junction');
            setDraftLink(null);
          }}
        >
          Junction
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'reservoir' ? 'rtdwms-tool--active' : ''}`}
          title="Add reservoir"
          onClick={() => {
            setMode('reservoir');
            setDraftLink(null);
          }}
        >
          Reservoir
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'tank' ? 'rtdwms-tool--active' : ''}`}
          title="Add tank"
          onClick={() => {
            setMode('tank');
            setDraftLink(null);
          }}
        >
          Tank
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'pipe' ? 'rtdwms-tool--active' : ''}`}
          title="Draw pipe"
          onClick={() => {
            setMode('pipe');
            setSelected(null);
            setDraftLink(null);
          }}
        >
          Pipe
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'pump' ? 'rtdwms-tool--active' : ''}`}
          title="Draw pump"
          onClick={() => {
            setMode('pump');
            setSelected(null);
            setDraftLink(null);
          }}
        >
          Pump
        </button>
        <button
          type="button"
          className={`rtdwms-tool ${mode === 'valve' ? 'rtdwms-tool--active' : ''}`}
          title="Draw valve"
          onClick={() => {
            setMode('valve');
            setSelected(null);
            setDraftLink(null);
          }}
        >
          Valve
        </button>
      </div>

      <div className="rtdwms-toolbar-sep" />

      <div className="rtdwms-toolbar-group">
        <button type="button" className="rtdwms-tool" disabled title="Save INP (coming next)">
          Save INP
        </button>
      </div>
    </div>
  );
}


