import { useRef } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { epanetParser } from '../../utils/epanetParser';

export function TopToolbar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setNetwork, setNetworkFile, setNetworkId, setSelectedSensors } = useNetwork();

  const onNewProject = () => {
    setNetwork(null);
    setNetworkFile(null);
    setNetworkId(null);
    setSelectedSensors({ pipes: [], junctions: [] });
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
        <button type="button" className="rtdwms-tool" title="Select (soon)">
          Select
        </button>
        <button type="button" className="rtdwms-tool" title="Add junction (soon)">
          Junction
        </button>
        <button type="button" className="rtdwms-tool" title="Add reservoir (soon)">
          Reservoir
        </button>
        <button type="button" className="rtdwms-tool" title="Add tank (soon)">
          Tank
        </button>
        <button type="button" className="rtdwms-tool" title="Draw pipe (soon)">
          Pipe
        </button>
        <button type="button" className="rtdwms-tool" title="Add pump (soon)">
          Pump
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

