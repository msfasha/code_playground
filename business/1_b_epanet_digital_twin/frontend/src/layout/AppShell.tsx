import { Outlet, Link, useLocation } from 'react-router-dom';
import { TopToolbar } from '../components/toolbar/TopToolbar';
import { NetworkComponentPanel } from '../components/panels/NetworkComponentPanel';
import { EditorProvider } from '../context/EditorContext';

export function AppShell() {
  const location = useLocation();

  return (
    <EditorProvider>
      <div className="rtdwms-shell">
      <header className="rtdwms-topbar">
        <div className="rtdwms-topbar-left">
          <div className="rtdwms-brand">Hydro-Twin</div>
          <TopToolbar />
        </div>

        <nav className="rtdwms-viewtabs" aria-label="Views">
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Network View
          </Link>
          <Link
            to="/simulator"
            className={location.pathname === '/simulator' ? 'active' : ''}
          >
            SCADA Simulator
          </Link>
          <Link
            to="/monitoring"
            className={location.pathname === '/monitoring' ? 'active' : ''}
          >
            Live Monitoring
          </Link>
        </nav>
      </header>

      <div className="rtdwms-main">
        <div className="rtdwms-canvas">
          <Outlet />
        </div>
        <aside className="rtdwms-rightpanel" aria-label="Network Component">
          <NetworkComponentPanel />
        </aside>
      </div>
      </div>
    </EditorProvider>
  );
}

