import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetwork } from '../context/NetworkContext';

const API_BASE = 'http://localhost:8000';

interface MonitoringStatus {
  status: 'stopped' | 'starting' | 'running' | 'error';
  network_id: string | null;
  started_at: string | null;
  last_check_time: string | null;
  last_processed_timestamp: string | null;
  total_anomalies_detected: number;
  configuration: {
    monitoring_interval_minutes: number;
    time_window_minutes: number;
    pressure_threshold_percent: number;
    flow_threshold_percent: number;
    tank_level_threshold_percent: number;
    enable_tank_feedback: boolean;
  } | null;
  eps_synchronization: {
    synced: boolean;
    current_eps_hour: number;
    real_time_hour: number;
    elapsed_minutes: number;
  };
  last_check_stats: {
    readings_processed: number;
    anomalies_found: number;
    comparison_time_ms: number;
  };
  error: string | null;
}

interface Anomaly {
  id: number;
  network_id: string;
  timestamp: string;
  sensor_id: string;
  sensor_type: string;
  location_id: string;
  actual_value: number;
  expected_value: number;
  deviation_percent: number;
  threshold_percent: number;
  severity: 'medium' | 'high' | 'critical';
  created_at: string;
}

interface DashboardMetrics {
  time_window_minutes: number;
  start_time: string;
  end_time: string;
  demand: {
    total_scada_demand: number;
    total_expected_demand: number;
    deviation_percent: number;
    unit: string;
  };
  pressure: {
    avg_scada_pressure: number;
    avg_expected_pressure: number;
    deviation_percent: number;
    unit: string;
  };
  sensor_coverage: {
    active_sensors: number;
    total_sensors: number;
    coverage_percent: number;
  };
  anomalies: {
    total_count: number;
    rate_percent: number;
    by_severity: {
      medium: number;
      high: number;
      critical: number;
    };
    total_readings: number;
  };
  tank_levels: Array<{
    tank_id: string;
    actual_level: number | null;
    expected_level: number | null;
    deviation_percent: number;
  }>;
  network_health: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    breakdown: {
      anomaly_score: number;
      pressure_score: number;
      demand_score: number;
      coverage_score: number;
    };
  };
}

export function MonitoringPage() {
  const navigate = useNavigate();
  const { network, networkFile, networkId: contextNetworkId, setNetworkId } = useNetwork();
  const [networkId, setLocalNetworkId] = useState<string | null>(contextNetworkId);
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Configuration state
  const [monitoringInterval, setMonitoringInterval] = useState<number>(1.0);
  const [timeWindow, setTimeWindow] = useState<number>(5.0);
  const [pressureThreshold, setPressureThreshold] = useState<number>(10.0);
  const [flowThreshold, setFlowThreshold] = useState<number>(15.0);
  const [tankLevelThreshold, setTankLevelThreshold] = useState<number>(5.0);
  const [enableTankFeedback, setEnableTankFeedback] = useState<boolean>(true);
  
  // Anomalies state
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [anomaliesLoading, setAnomaliesLoading] = useState<boolean>(false);
  
  // Dashboard metrics state
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
  
  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Sync local networkId with context
  useEffect(() => {
    if (contextNetworkId) {
      setLocalNetworkId(contextNetworkId);
    }
  }, [contextNetworkId]);

  // Poll monitoring status every 3 seconds
  const checkMonitoringStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/monitoring/status`);
      if (response.ok) {
        const data: MonitoringStatus = await response.json();
        setMonitoringStatus(data);
      }
    } catch (err) {
      console.error('Error checking monitoring status:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkMonitoringStatus, 3000);
    checkMonitoringStatus(); // Check immediately
    return () => clearInterval(interval);
  }, []);

  // Poll anomalies at monitoring interval
  useEffect(() => {
    if (!networkId || !monitoringStatus || monitoringStatus.status !== 'running') {
      return;
    }

    const monitoringIntervalMs = (monitoringStatus.configuration?.monitoring_interval_minutes || 1.0) * 60 * 1000;
    const interval = setInterval(() => {
      fetchAnomalies();
    }, monitoringIntervalMs);
    
    fetchAnomalies(); // Fetch immediately
    
    return () => clearInterval(interval);
  }, [networkId, monitoringStatus?.status, monitoringStatus?.configuration?.monitoring_interval_minutes]);

  // Fetch dashboard metrics
  const fetchDashboardMetrics = async () => {
    if (!networkId) return;
    
    setDashboardLoading(true);
    try {
      const timeWindow = monitoringStatus?.configuration?.time_window_minutes || 5.0;
      const response = await fetch(`${API_BASE}/api/monitoring/dashboard-metrics?network_id=${networkId}&time_window_minutes=${timeWindow}`);
      if (response.ok) {
        const data: DashboardMetrics = await response.json();
        setDashboardMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Poll dashboard metrics at monitoring interval
  useEffect(() => {
    if (!networkId || !monitoringStatus || monitoringStatus.status !== 'running') {
      return;
    }

    const monitoringIntervalMs = (monitoringStatus.configuration?.monitoring_interval_minutes || 1.0) * 60 * 1000;
    const interval = setInterval(() => {
      fetchDashboardMetrics();
    }, monitoringIntervalMs);
    
    fetchDashboardMetrics(); // Fetch immediately
    
    return () => clearInterval(interval);
  }, [networkId, monitoringStatus?.status, monitoringStatus?.configuration?.monitoring_interval_minutes, monitoringStatus?.configuration?.time_window_minutes]);

  const fetchAnomalies = async () => {
    if (!networkId) return;
    
    setAnomaliesLoading(true);
    try {
      const severityParam = severityFilter !== 'all' ? `&severity=${severityFilter}` : '';
      const response = await fetch(`${API_BASE}/api/monitoring/anomalies?network_id=${networkId}&limit=50${severityParam}`);
      if (response.ok) {
        const data = await response.json();
        setAnomalies(data.anomalies || []);
      }
    } catch (err) {
      console.error('Error fetching anomalies:', err);
    } finally {
      setAnomaliesLoading(false);
    }
  };

  // Fetch anomalies when filter changes
  useEffect(() => {
    if (networkId && monitoringStatus?.status === 'running') {
      fetchAnomalies();
    }
  }, [severityFilter]);

  const startMonitoring = async () => {
    // Check if we have network data
    if (!network) {
      setError('Please load a network file first on the Network View page');
      return;
    }

    // If we don't have networkFile but we have networkId, the network was already uploaded
    if (!networkFile && !networkId) {
      setError('Please load a network file first on the Network View page');
      return;
    }

    setError(null);
    setMessage('Starting monitoring service...');

    try {
      let id = networkId;

      // 1. Upload network to backend (only if not already uploaded)
      if (!id && networkFile) {
        const formData = new FormData();
        formData.append('file', networkFile);
        
        setMessage('Uploading network to backend...');
        const uploadResponse = await fetch(`${API_BASE}/api/network/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload network');
        }
        
        const uploadData = await uploadResponse.json();
        id = uploadData.network_id;
        setLocalNetworkId(id);
        setNetworkId(id);
      }

      if (!id) {
        throw new Error('Network ID is required');
      }

      // 2. Establish baseline (only if not already established)
      setMessage('Establishing baseline...');
      const baselineResponse = await fetch(`${API_BASE}/api/network/${id}/baseline`, {
        method: 'POST'
      });
      
      if (!baselineResponse.ok) {
        const errorData = await baselineResponse.json().catch(() => ({ detail: 'Failed to establish baseline' }));
        // If baseline already exists, that's okay
        if (baselineResponse.status !== 400 || !errorData.detail?.includes('already')) {
          throw new Error(errorData.detail || 'Failed to establish baseline');
        }
      }

      // 3. Start monitoring service
      setMessage('Starting monitoring service...');
      const startResponse = await fetch(`${API_BASE}/api/monitoring/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network_id: id,
          monitoring_interval_minutes: monitoringInterval,
          time_window_minutes: timeWindow,
          pressure_threshold_percent: pressureThreshold,
          flow_threshold_percent: flowThreshold,
          tank_level_threshold_percent: tankLevelThreshold,
          enable_tank_feedback: enableTankFeedback,
        })
      });
      
      if (!startResponse.ok) {
        const errorData = await startResponse.json().catch(() => ({ detail: 'Failed to start monitoring' }));
        throw new Error(errorData.detail || 'Failed to start monitoring');
      }
      
      const startData = await startResponse.json();
      
      if (startData.success) {
        setMessage('Monitoring service started successfully');
        setError(null);
        checkMonitoringStatus(); // Refresh status
        fetchAnomalies(); // Fetch initial anomalies
        fetchDashboardMetrics(); // Fetch initial dashboard metrics
      } else {
        throw new Error('Monitoring service failed to start');
      }
    } catch (err: any) {
      setError(`Failed to start monitoring: ${err.message}`);
      setMessage(null);
    }
  };

  const clearMonitoringData = async () => {
    if (!networkId) {
      setError('No network selected');
      return;
    }
    
    // Confirm before deleting
    const confirmed = window.confirm(
      'WARNING: This will permanently delete monitoring results:\n' +
      '- All Anomalies\n' +
      '- All Expected Values\n\n' +
      'NOTE: Network Items and Baseline Data will NOT be deleted.\n\n' +
      'This action cannot be undone!\n\n' +
      'Are you sure you want to continue?'
    );
    
    if (!confirmed) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/monitoring/clear-data?network_id=${networkId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(
          `Monitoring results cleared successfully:\n` +
          `- ${data.deletion_counts.anomalies} anomalies\n` +
          `- ${data.deletion_counts.expected_values} expected values`
        );
        setError(null);
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
        
        // Refresh anomalies list
        if (monitoringStatus?.status === 'running') {
          fetchAnomalies();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to clear monitoring data');
        setMessage(null);
      }
    } catch (err) {
      console.error('Error clearing monitoring data:', err);
      setError('Failed to clear monitoring data');
      setMessage(null);
    }
  };

  const stopMonitoring = async () => {
    if (!networkId) return;
    
    setMessage('Stopping monitoring service...');
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/monitoring/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network_id: networkId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to stop monitoring' }));
        throw new Error(errorData.detail || 'Failed to stop monitoring');
      }
      
      const data = await response.json();
      if (data.success) {
        setMessage('Monitoring service stopped');
        checkMonitoringStatus(); // Refresh status
      }
    } catch (err: any) {
      setError(`Failed to stop monitoring: ${err.message}`);
    }
  };

  const isRunning = monitoringStatus?.status === 'running';
  const isStarting = monitoringStatus?.status === 'starting';

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc3545'; // Red
      case 'high':
        return '#fd7e14'; // Orange
      case 'medium':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray
    }
  };

  return (
    <div className="monitoring-page">
      <h2>Monitoring Service</h2>
      
      {!network && (
        <div className="warning-box">
          <strong>⚠️ No network loaded</strong>
          <p>Please upload a network file on the Network View page first.</p>
        </div>
      )}
      
      {network && (
        <div className="monitoring-layout">
          {/* Side Panel */}
          <div className="side-panel">
            <div className="panel-section">
              <h3>Network Info</h3>
              <div className="network-info">
                <p><strong>Network:</strong> {network.title || 'Loaded network'}</p>
                <p><strong>Junctions:</strong> {network.junctions.length}</p>
                <p><strong>Status:</strong> {monitoringStatus?.status || 'unknown'}</p>
                {monitoringStatus && monitoringStatus.total_anomalies_detected > 0 && (
                  <p><strong>Total Anomalies:</strong> {monitoringStatus.total_anomalies_detected}</p>
                )}
              </div>
            </div>

            {/* Configuration */}
            {!isRunning && (
              <div className="panel-section">
                <div className="config-header-with-help">
                  <h3>Configuration</h3>
                  <button 
                    className="help-button"
                    onClick={() => setShowHelpModal(true)}
                    title="Show configuration help"
                  >
                    Help
                  </button>
                </div>
                <div className="config-list">
                <div className="config-item">
                  <label>Monitoring Interval (minutes):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1440"
                    step="0.1"
                    value={monitoringInterval}
                    onChange={(e) => setMonitoringInterval(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Time Window (minutes):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="60"
                    step="0.1"
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(parseFloat(e.target.value))}
                  />
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    How far back to query SCADA readings
                  </small>
                </div>
                <div className="config-item">
                  <label>Pressure Threshold (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={pressureThreshold}
                    onChange={(e) => setPressureThreshold(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Flow Threshold (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={flowThreshold}
                    onChange={(e) => setFlowThreshold(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Tank Level Threshold (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={tankLevelThreshold}
                    onChange={(e) => setTankLevelThreshold(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={enableTankFeedback}
                      onChange={(e) => setEnableTankFeedback(e.target.checked)}
                    />
                    Enable Tank Feedback
                  </label>
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    Update EPANET tank levels from SCADA readings
                  </small>
                </div>
                </div>
              </div>
            )}

          {/* Help Modal */}
          {showHelpModal && (
            <div 
              className="help-modal-overlay"
              onClick={() => setShowHelpModal(false)}
            >
              <div 
                className="help-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="help-modal-header">
                  <h2>Monitoring Service Configuration Help</h2>
                  <button 
                    className="help-modal-close"
                    onClick={() => setShowHelpModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="help-modal-body">
                  <div className="help-section">
                    <h3>Monitoring Interval (minutes)</h3>
                    <p><strong>What it does:</strong> How often the monitoring service runs a comparison cycle.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 1.0 minute means the service checks for anomalies every minute.
                      If you start at 2:00 PM, checks will run at 2:00, 2:01, 2:02, 2:03, etc.
                    </div>
                    <p><strong>Range:</strong> 0.1 to 1440 minutes (0.1 min = 6 seconds, 1440 min = 24 hours)</p>
                    <p><strong>Tip:</strong> Lower values (e.g., 1-5 minutes) = more frequent checks, better real-time monitoring.
                    Higher values (e.g., 15-60 minutes) = less frequent checks, lower server load.</p>
                  </div>

                  <div className="help-section">
                    <h3>Time Window (minutes)</h3>
                    <p><strong>What it does:</strong> How far back to query SCADA readings from the database for comparison.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 5.0 minutes means the service queries SCADA readings
                      from the last 5 minutes. If monitoring runs at 2:05 PM, it queries readings with timestamps
                      between 2:00 PM and 2:05 PM.
                    </div>
                    <p><strong>Range:</strong> 0.1 to 60 minutes</p>
                    <p><strong>Tip:</strong> Should be at least as large as the monitoring interval. A value of 5 minutes
                    works well with 1-minute monitoring intervals, allowing for late-arriving readings.</p>
                  </div>

                  <div className="help-section">
                    <h3>Pressure Threshold (%)</h3>
                    <p><strong>What it does:</strong> Maximum allowed deviation percentage for pressure sensor readings.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 10.0% means a pressure reading is flagged as an anomaly
                      if it deviates more than 10% from the expected value.
                      <br />
                      Expected: 45.0 m, Actual: 40.0 m → Deviation: 11.1% → <strong>Anomaly</strong>
                      <br />
                      Expected: 45.0 m, Actual: 42.0 m → Deviation: 6.7% → <strong>Normal</strong>
                    </div>
                    <p><strong>Range:</strong> 0.0 to 100.0%</p>
                    <p><strong>Tip:</strong> Typical values are 5-15%. Lower values = more sensitive (more anomalies detected).
                    Higher values = less sensitive (fewer anomalies, but may miss issues).</p>
                  </div>

                  <div className="help-section">
                    <h3>Flow Threshold (%)</h3>
                    <p><strong>What it does:</strong> Maximum allowed deviation percentage for flow sensor readings.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 15.0% means a flow reading is flagged as an anomaly
                      if it deviates more than 15% from the expected value.
                      <br />
                      Expected: 100 L/s, Actual: 120 L/s → Deviation: 20.0% → <strong>Anomaly</strong>
                    </div>
                    <p><strong>Range:</strong> 0.0 to 100.0%</p>
                    <p><strong>Tip:</strong> Flow typically has more variation than pressure, so thresholds are usually
                    higher (10-20%). Default of 15% is a good starting point.</p>
                  </div>

                  <div className="help-section">
                    <h3>Tank Level Threshold (%)</h3>
                    <p><strong>What it does:</strong> Maximum allowed deviation percentage for tank level sensor readings.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 5.0% means a tank level reading is flagged as an anomaly
                      if it deviates more than 5% from the expected value.
                      <br />
                      Expected: 10.0 m, Actual: 9.4 m → Deviation: 6.0% → <strong>Anomaly</strong>
                    </div>
                    <p><strong>Range:</strong> 0.0 to 100.0%</p>
                    <p><strong>Tip:</strong> Tank levels are usually more stable than pressure/flow, so thresholds are
                    typically lower (3-10%). Default of 5% is appropriate for most systems.</p>
                  </div>

                  <div className="help-section">
                    <h3>Enable Tank Feedback</h3>
                    <p><strong>What it does:</strong> When enabled, the monitoring service updates EPANET tank initial levels
                    with actual values from SCADA readings. This improves future prediction accuracy.</p>
                    <div className="help-example">
                      <strong>Example:</strong> If enabled and a SCADA reading shows tank level = 8.5 m, EPANET's
                      tank initial level is updated to 8.5 m. Future EPANET predictions will use this updated value,
                      making them more accurate.
                    </div>
                    <p><strong>Default:</strong> Enabled (recommended)</p>
                    <p><strong>Tip:</strong> Enabling this reduces false positives from tank level predictions and
                    improves overall monitoring accuracy. Disable only if you want EPANET to use its own calculated
                    tank levels without SCADA feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Current Configuration Display */}
            {isRunning && monitoringStatus?.configuration && (
              <div className="panel-section">
                <h3>Current Configuration</h3>
                <div className="config-display">
                  <p>Interval: {monitoringStatus.configuration.monitoring_interval_minutes} min</p>
                  <p>Time Window: {monitoringStatus.configuration.time_window_minutes} min</p>
                  <p>Thresholds: P {monitoringStatus.configuration.pressure_threshold_percent}% | 
                     F {monitoringStatus.configuration.flow_threshold_percent}% | 
                     T {monitoringStatus.configuration.tank_level_threshold_percent}%</p>
                  <p>Tank Feedback: {monitoringStatus.configuration.enable_tank_feedback ? 'On' : 'Off'}</p>
                </div>
              </div>
            )}
            
            {/* Buttons */}
            <div className="panel-section">
              <div className="button-group-vertical">
                <button 
                  onClick={startMonitoring}
                  disabled={isRunning || isStarting}
                  className="btn-primary"
                >
                  {isStarting ? 'Starting...' : 'Start Monitoring'}
                </button>
                
                <button 
                  onClick={stopMonitoring}
                  disabled={!isRunning}
                  className="btn-secondary"
                >
                  Stop Monitoring
                </button>
                
                <button 
                  onClick={clearMonitoringData}
                  disabled={!networkId}
                  className="btn-danger"
                  style={{
                    marginTop: '1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: networkId ? 'pointer' : 'not-allowed',
                    opacity: networkId ? 1 : 0.6
                  }}
                >
                  Clear All Monitoring Data
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-content">
            {/* Dashboard Metrics - At the top */}
            {isRunning && (
              <div className="dashboard-section">
                <h3>Dashboard Metrics</h3>
              
              {dashboardLoading && (
                <p style={{color: '#666', fontStyle: 'italic'}}>Loading dashboard metrics...</p>
              )}
              
              {!dashboardLoading && dashboardMetrics && (
                <div className="dashboard-grid">
                  {/* Network Health Card */}
                  <div className={`dashboard-card health-card ${dashboardMetrics.network_health.status}`}>
                    <div className="card-header">
                      <h4>Network Health</h4>
                      <span className={`health-badge ${dashboardMetrics.network_health.status}`}>
                        {dashboardMetrics.network_health.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="card-value health-score">
                      {dashboardMetrics.network_health.score.toFixed(1)}/100
                    </div>
                    <div className="card-details">
                      <p>Anomaly: {dashboardMetrics.network_health.breakdown.anomaly_score.toFixed(1)}</p>
                      <p>Pressure: {dashboardMetrics.network_health.breakdown.pressure_score.toFixed(1)}</p>
                      <p>Demand: {dashboardMetrics.network_health.breakdown.demand_score.toFixed(1)}</p>
                      <p>Coverage: {dashboardMetrics.network_health.breakdown.coverage_score.toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Total Demand Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h4>Total Demand</h4>
                    </div>
                    <div className="card-value">
                      {dashboardMetrics.demand.total_scada_demand.toFixed(2)} {dashboardMetrics.demand.unit}
                    </div>
                    <div className="card-comparison">
                      <span className="comparison-label">Expected:</span>
                      <span className="comparison-value">{dashboardMetrics.demand.total_expected_demand.toFixed(2)} {dashboardMetrics.demand.unit}</span>
                    </div>
                    <div className={`card-deviation ${Math.abs(dashboardMetrics.demand.deviation_percent) > 15 ? 'high' : Math.abs(dashboardMetrics.demand.deviation_percent) > 5 ? 'medium' : 'low'}`}>
                      {dashboardMetrics.demand.deviation_percent >= 0 ? '↑' : '↓'} {Math.abs(dashboardMetrics.demand.deviation_percent).toFixed(2)}%
                    </div>
                  </div>

                  {/* Average Pressure Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h4>Average Pressure</h4>
                    </div>
                    <div className="card-value">
                      {dashboardMetrics.pressure.avg_scada_pressure.toFixed(2)} {dashboardMetrics.pressure.unit}
                    </div>
                    <div className="card-comparison">
                      <span className="comparison-label">Expected:</span>
                      <span className="comparison-value">{dashboardMetrics.pressure.avg_expected_pressure.toFixed(2)} {dashboardMetrics.pressure.unit}</span>
                    </div>
                    <div className={`card-deviation ${Math.abs(dashboardMetrics.pressure.deviation_percent) > 10 ? 'high' : Math.abs(dashboardMetrics.pressure.deviation_percent) > 5 ? 'medium' : 'low'}`}>
                      {dashboardMetrics.pressure.deviation_percent >= 0 ? '↑' : '↓'} {Math.abs(dashboardMetrics.pressure.deviation_percent).toFixed(2)}%
                    </div>
                  </div>

                  {/* Sensor Coverage Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h4>Sensor Coverage</h4>
                    </div>
                    <div className="card-value">
                      {dashboardMetrics.sensor_coverage.coverage_percent.toFixed(1)}%
                    </div>
                    <div className="card-details">
                      <p>{dashboardMetrics.sensor_coverage.active_sensors} / {dashboardMetrics.sensor_coverage.total_sensors} sensors active</p>
                    </div>
                  </div>

                  {/* Anomaly Rate Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h4>Anomaly Rate</h4>
                    </div>
                    <div className="card-value">
                      {dashboardMetrics.anomalies.rate_percent.toFixed(2)}%
                    </div>
                    <div className="card-details">
                      <p>{dashboardMetrics.anomalies.total_count} anomalies from {dashboardMetrics.anomalies.total_readings} readings</p>
                      <div className="anomaly-severity-breakdown">
                        <span className="severity-item medium">M: {dashboardMetrics.anomalies.by_severity.medium}</span>
                        <span className="severity-item high">H: {dashboardMetrics.anomalies.by_severity.high}</span>
                        <span className="severity-item critical">C: {dashboardMetrics.anomalies.by_severity.critical}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tank Levels Card */}
                  {dashboardMetrics.tank_levels.length > 0 && (
                    <div className="dashboard-card tank-levels-card">
                      <div className="card-header">
                        <h4>Tank Levels</h4>
                      </div>
                      <div className="tank-levels-list">
                        {dashboardMetrics.tank_levels.map((tank) => (
                          <div key={tank.tank_id} className="tank-level-item">
                            <div className="tank-id">{tank.tank_id}</div>
                            <div className="tank-values">
                              <span>Actual: {tank.actual_level !== null ? tank.actual_level.toFixed(2) : 'N/A'} m</span>
                              <span>Expected: {tank.expected_level !== null ? tank.expected_level.toFixed(2) : 'N/A'} m</span>
                            </div>
                            {tank.actual_level !== null && tank.expected_level !== null && (
                              <div className={`tank-deviation ${Math.abs(tank.deviation_percent) > 10 ? 'high' : Math.abs(tank.deviation_percent) > 5 ? 'medium' : 'low'}`}>
                                {tank.deviation_percent >= 0 ? '↑' : '↓'} {Math.abs(tank.deviation_percent).toFixed(2)}%
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
                {!dashboardLoading && !dashboardMetrics && (
                  <p style={{color: '#666', fontStyle: 'italic'}}>No dashboard metrics available yet.</p>
                )}
              </div>
            )}

            {/* Status & Statistics */}
            {isRunning && monitoringStatus && (
              <div className="status-section">
                <h3>Status & Statistics</h3>
                {monitoringStatus.last_check_time && (
                  <p><strong>Last Check:</strong> {new Date(monitoringStatus.last_check_time).toLocaleString()}</p>
                )}
                {monitoringStatus.last_processed_timestamp && (
                  <p><strong>Last Processed:</strong> {new Date(monitoringStatus.last_processed_timestamp).toLocaleString()}</p>
                )}
                <p><strong>Total Anomalies Detected:</strong> {monitoringStatus.total_anomalies_detected}</p>
                {monitoringStatus.eps_synchronization && (
                  <div className="eps-info">
                    <p><strong>EPS Synchronization:</strong></p>
                    <p>Status: {monitoringStatus.eps_synchronization.synced ? '✅ Synced' : '❌ Not Synced'}</p>
                    <p>EPS Hour: {monitoringStatus.eps_synchronization.current_eps_hour.toFixed(3)}</p>
                    <p>Real-Time Hour: {monitoringStatus.eps_synchronization.real_time_hour.toFixed(3)}</p>
                  </div>
                )}
                {monitoringStatus.last_check_stats && (
                  <div className="last-check-stats">
                    <p><strong>Last Check Statistics:</strong></p>
                    <p>Readings Processed: {monitoringStatus.last_check_stats.readings_processed}</p>
                    <p>Anomalies Found: {monitoringStatus.last_check_stats.anomalies_found}</p>
                    <p>Comparison Time: {monitoringStatus.last_check_stats.comparison_time_ms.toFixed(2)} ms</p>
                  </div>
                )}
              </div>
            )}

            {/* Anomalies Section */}
            {isRunning && (
              <div className="anomalies-section">
              <div className="anomalies-header">
                <h3>Recent Anomalies</h3>
                <div className="anomalies-filter">
                  <label>Filter by Severity: </label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {anomaliesLoading && (
                <p style={{color: '#666', fontStyle: 'italic'}}>Loading anomalies...</p>
              )}
              
              {!anomaliesLoading && anomalies.length === 0 && (
                <p style={{color: '#666', fontStyle: 'italic'}}>No anomalies detected.</p>
              )}
              
              {!anomaliesLoading && anomalies.length > 0 && (
                <div className="anomalies-list">
                  {anomalies.map((anomaly) => (
                    <div 
                      key={anomaly.id} 
                      className="anomaly-item"
                      style={{borderLeftColor: getSeverityColor(anomaly.severity)}}
                    >
                      <div className="anomaly-header">
                        <span 
                          className="severity-badge"
                          style={{backgroundColor: getSeverityColor(anomaly.severity)}}
                        >
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <span className="sensor-id">{anomaly.sensor_id}</span>
                        <span className="anomaly-time">
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="anomaly-details">
                        <p><strong>Location:</strong> {anomaly.location_id} | <strong>Type:</strong> {anomaly.sensor_type}</p>
                        <p><strong>Actual:</strong> {anomaly.actual_value.toFixed(3)} | 
                           <strong> Expected:</strong> {anomaly.expected_value.toFixed(3)}</p>
                        <p><strong>Deviation:</strong> {anomaly.deviation_percent.toFixed(2)}% 
                           (Threshold: {anomaly.threshold_percent}%)</p>
                        <button 
                          className="show-on-map-btn"
                          onClick={() => navigate('/', { state: { highlightLocation: anomaly.location_id, sensorType: anomaly.sensor_type } })}
                          style={{ 
                            marginTop: '8px', 
                            padding: '4px 12px', 
                            cursor: 'pointer',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          Show on Map
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            )}
            
            {message && (
              <div className="message-box">
                {message}
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}
      
      <style>{`
        .monitoring-page {
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }
        
        .warning-box {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .monitoring-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .side-panel {
          width: 320px;
          flex-shrink: 0;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }

        .panel-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #dee2e6;
        }

        .panel-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .panel-section h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: #333;
        }
        
        .network-info {
          margin: 0;
        }
        
        .network-info p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .config-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .config-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .config-header-with-help {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .config-section h3 {
          margin: 0;
        }

        .help-button {
          padding: 0.5rem 1rem;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .help-button:hover {
          background-color: #5a6268;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .main-content {
          flex: 1;
          min-width: 0;
        }

        .config-item {
          display: flex;
          flex-direction: column;
        }

        .config-item label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .config-item input[type="number"] {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }

        .config-item input[type="checkbox"] {
          margin-right: 0.5rem;
        }

        .config-display {
          margin: 0;
          padding: 0;
          background: transparent;
        }

        .config-display p {
          margin: 0.5rem 0;
          font-size: 0.85rem;
          color: #666;
        }

        .status-section {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .status-section h3 {
          margin-top: 0;
        }

        .eps-info, .last-check-stats {
          margin-top: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
        }

        .anomalies-section {
          margin-top: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .anomalies-section h3 {
          margin-top: 0;
        }

        .anomalies-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .anomalies-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .anomalies-filter select {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }

        .anomalies-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .anomalies-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .anomalies-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .anomalies-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .anomalies-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .anomaly-item {
          padding: 1rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #dee2e6;
          border-left-width: 4px;
        }

        .anomaly-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          font-size: 0.85rem;
        }

        .sensor-id {
          font-weight: 600;
          color: #333;
        }

        .anomaly-time {
          margin-left: auto;
          color: #666;
          font-size: 0.9rem;
        }

        .anomaly-details {
          font-size: 0.9rem;
          color: #555;
        }

        .anomaly-details p {
          margin: 0.5rem 0;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .button-group-vertical {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .button-group-vertical .btn-primary,
        .button-group-vertical .btn-secondary {
          width: 100%;
        }
        
        .btn-primary, .btn-secondary {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }
        
        .btn-primary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: #dc3545;
          color: white;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        .btn-secondary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .message-box {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }
        
        .error-box {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        /* Help Modal Styles */
        .help-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .help-modal-content {
          background: white;
          border-radius: 8px;
          max-width: 800px;
          max-height: 85vh;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }

        .help-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #dee2e6;
        }

        .help-modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .help-modal-close {
          width: 36px;
          height: 36px;
          border: none;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          padding: 0;
          color: #666;
        }

        .help-modal-close:hover {
          background: #e9ecef;
          color: #333;
        }

        .help-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .help-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .help-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .help-section h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #007bff;
          font-size: 1.2rem;
        }

        .help-section p {
          margin: 0.75rem 0;
          line-height: 1.6;
          color: #495057;
        }

        .help-section strong {
          color: #212529;
        }

        .help-example {
          background-color: #e7f3ff;
          border-left: 4px solid #007bff;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 4px;
          line-height: 1.6;
        }

        .help-example strong {
          color: #0056b3;
        }

        .help-modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .help-modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .help-modal-body::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .help-modal-body::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Dashboard Styles */
        .dashboard-section {
          margin-top: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .dashboard-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #dee2e6;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dashboard-card.health-card {
          border-left: 4px solid #007bff;
        }

        .dashboard-card.health-card.excellent {
          border-left-color: #28a745;
        }

        .dashboard-card.health-card.good {
          border-left-color: #17a2b8;
        }

        .dashboard-card.health-card.fair {
          border-left-color: #ffc107;
        }

        .dashboard-card.health-card.poor {
          border-left-color: #dc3545;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .health-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .health-badge.excellent {
          background-color: #d4edda;
          color: #155724;
        }

        .health-badge.good {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .health-badge.fair {
          background-color: #fff3cd;
          color: #856404;
        }

        .health-badge.poor {
          background-color: #f8d7da;
          color: #721c24;
        }

        .card-value {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.75rem;
        }

        .card-value.health-score {
          font-size: 2.5rem;
        }

        .card-comparison {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .comparison-label {
          font-weight: 500;
        }

        .comparison-value {
          color: #495057;
        }

        .card-deviation {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .card-deviation.low {
          background-color: #d4edda;
          color: #155724;
        }

        .card-deviation.medium {
          background-color: #fff3cd;
          color: #856404;
        }

        .card-deviation.high {
          background-color: #f8d7da;
          color: #721c24;
        }

        .card-details {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #666;
        }

        .card-details p {
          margin: 0.5rem 0;
        }

        .anomaly-severity-breakdown {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }

        .severity-item {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .severity-item.medium {
          background-color: #fff3cd;
          color: #856404;
        }

        .severity-item.high {
          background-color: #ffeaa7;
          color: #d63031;
        }

        .severity-item.critical {
          background-color: #f8d7da;
          color: #721c24;
        }

        .tank-levels-card {
          grid-column: 1 / -1;
        }

        .tank-levels-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tank-level-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .tank-id {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .tank-values {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .tank-deviation {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .tank-deviation.low {
          background-color: #d4edda;
          color: #155724;
        }

        .tank-deviation.medium {
          background-color: #fff3cd;
          color: #856404;
        }

        .tank-deviation.high {
          background-color: #f8d7da;
          color: #721c24;
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .monitoring-layout {
            flex-direction: column;
          }

          .side-panel {
            width: 100%;
            position: static;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
}

