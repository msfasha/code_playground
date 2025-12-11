import { useState, useEffect } from 'react';
import { useNetwork } from '../context/NetworkContext';

const API_BASE = 'http://localhost:8000';

interface SimulatorStatus {
  status: 'stopped' | 'starting' | 'running' | 'error';
  network_id: string | null;
  started_at: string | null;
  last_generation_time: string | null;
  total_readings_generated: number;
  configuration: {
    generation_rate_minutes: number;
    data_loss_Ratio: number;
    data_loss_variance: number;
    delay_mean: number;
    delay_std_dev: number;
    delay_max: number;
    pressure_noise_percent: number;
    flow_noise_percent: number;
    tank_level_noise_percent: number;
  } | null;
  current_cycle: {
    junctions_selected: number;
    pipes_selected: number;
    tanks_selected: number;
    readings_generated: number;
  };
  error: string | null;
}

interface GenerationLog {
  id: number;
  generation_timestamp: string;
  readings_generated: number;
  junctions_selected: number;
  pipes_selected: number;
  tanks_selected: number;
  created_at: string;
}

export function SimulatorPage() {
  const { network, networkFile, networkId: contextNetworkId, setNetworkId } = useNetwork();
  const [networkId, setLocalNetworkId] = useState<string | null>(contextNetworkId);
  const [simulatorStatus, setSimulatorStatus] = useState<SimulatorStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Configuration state
  const [generationRate, setGenerationRate] = useState<number>(.3);
  const [dataLossRatio, setDataLossRatio] = useState<number>(0.10); // 10% lost, 90% kept
  const [dataLossVariance, setDataLossVariance] = useState<number>(0.05);
  const [delayMean, setDelayMean] = useState<number>(2.5);
  const [delayStdDev, setDelayStdDev] = useState<number>(2.0);
  const [delayMax, setDelayMax] = useState<number>(10.0);
  const [pressureNoise, setPressureNoise] = useState<number>(2.0);
  const [flowNoise, setFlowNoise] = useState<number>(3.0);
  const [tankLevelNoise, setTankLevelNoise] = useState<number>(1.0);
  
  // Logs state
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  
  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Sync local networkId with context
  useEffect(() => {
    if (contextNetworkId) {
      setLocalNetworkId(contextNetworkId);
    }
  }, [contextNetworkId]);

  // Poll simulator status
  const checkSimulatorStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/scada-simulator/status`);
      if (response.ok) {
        const data: SimulatorStatus = await response.json();
        setSimulatorStatus(data);
      }
    } catch (err) {
      console.error('Error checking simulator status:', err);
    }
  };

  // Poll status every 3 seconds
  useEffect(() => {
    const interval = setInterval(checkSimulatorStatus, 3000);
    checkSimulatorStatus(); // Check immediately
    return () => clearInterval(interval);
  }, []);

  // Poll logs at generation rate interval
  useEffect(() => {
    if (!networkId || !simulatorStatus || simulatorStatus.status !== 'running') {
      return;
    }

    const generationRateMs = (simulatorStatus.configuration?.generation_rate_minutes || 5) * 60 * 1000;
    const interval = setInterval(() => {
      fetchLogs();
    }, generationRateMs);
    
    fetchLogs(); // Fetch immediately
    
    return () => clearInterval(interval);
  }, [networkId, simulatorStatus?.status, simulatorStatus?.configuration?.generation_rate_minutes]);

  const fetchLogs = async () => {
    if (!networkId) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/scada-simulator/logs?network_id=${networkId}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const startSimulator = async () => {
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
    setMessage('Starting SCADA simulator...');

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

      // 3. Start SCADA simulator
      setMessage('Starting SCADA simulator...');
      const startResponse = await fetch(`${API_BASE}/api/scada-simulator/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network_id: id,
          generation_rate_minutes: generationRate,
          data_loss_Ratio: dataLossRatio,
          data_loss_variance: dataLossVariance,
          delay_mean: delayMean,
          delay_std_dev: delayStdDev,
          delay_max: delayMax,
          pressure_noise_percent: pressureNoise,
          flow_noise_percent: flowNoise,
          tank_level_noise_percent: tankLevelNoise,
        })
      });
      
      if (!startResponse.ok) {
        const errorData = await startResponse.json().catch(() => ({ detail: 'Failed to start simulator' }));
        throw new Error(errorData.detail || 'Failed to start simulator');
      }
      
      const startData = await startResponse.json();
      
      if (startData.success) {
        setMessage('SCADA simulator started successfully');
        setError(null);
        checkSimulatorStatus(); // Refresh status
      } else {
        throw new Error('Simulator failed to start');
      }
    } catch (err: any) {
      setError(`Failed to start simulator: ${err.message}`);
      setMessage(null);
    }
  };

  const stopSimulator = async () => {
    if (!networkId) return;
    
    setMessage('Stopping SCADA simulator...');
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/scada-simulator/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network_id: networkId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to stop simulator' }));
        throw new Error(errorData.detail || 'Failed to stop simulator');
      }
      
      const data = await response.json();
      if (data.success) {
        setMessage('SCADA simulator stopped');
        checkSimulatorStatus(); // Refresh status
      }
    } catch (err: any) {
      setError(`Failed to stop simulator: ${err.message}`);
    }
  };

  const clearReadings = async () => {
    if (!networkId) return;
    
    // Confirm action
    if (!window.confirm('Are you sure you want to clear all SCADA readings and logs for this network? This action cannot be undone.')) {
      return;
    }
    
    setMessage('Clearing SCADA readings...');
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/scada-simulator/clear-readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network_id: networkId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to clear readings' }));
        throw new Error(errorData.detail || 'Failed to clear readings');
      }
      
      const data = await response.json();
      if (data.success) {
        setMessage(`Cleared ${data.readings_deleted} readings and ${data.logs_deleted} logs`);
        setLogs([]); // Clear logs from UI
        fetchLogs(); // Refresh logs (will be empty now)
      }
    } catch (err: any) {
      setError(`Failed to clear readings: ${err.message}`);
    }
  };

  const isRunning = simulatorStatus?.status === 'running';
  const isStarting = simulatorStatus?.status === 'starting';

  return (
    <div className="simulator-page">
      <h2>SCADA Simulator</h2>
      
      {!network && (
        <div className="warning-box">
          <strong>⚠️ No network loaded</strong>
          <p>Please upload a network file on the Network View page first.</p>
        </div>
      )}
      
      {network && (
        <div className="simulator-controls">
          <div className="network-info">
            <p><strong>Network:</strong> {network.title || 'Loaded network'}</p>
            <p><strong>Junctions:</strong> {network.junctions.length}</p>
            <p><strong>Status:</strong> {simulatorStatus?.status || 'unknown'}</p>
            {simulatorStatus && simulatorStatus.total_readings_generated > 0 && (
              <p><strong>Total Readings Generated:</strong> {simulatorStatus.total_readings_generated}</p>
            )}
          </div>

          {/* Configuration */}
          {!isRunning && (
            <div className="config-section">
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
              <div className="config-grid">
                <div className="config-item">
                  <label>Data Generation Rate (minutes):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1440"
                    step="0.1"
                    value={generationRate}
                    onChange={(e) => setGenerationRate(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Data Loss Ratio (0-1):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={dataLossRatio}
                    onChange={(e) => setDataLossRatio(parseFloat(e.target.value))}
                  />
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    Ratio of items LOST. Example: 0.10 = 10% lost, 90% kept
                  </small>
                </div>
                <div className="config-item">
                  <label>Data Loss Variance (0-0.5):</label>
                  <input
                    type="number"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={dataLossVariance}
                    onChange={(e) => setDataLossVariance(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Delay Mean (minutes):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={delayMean}
                    onChange={(e) => setDelayMean(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Delay Std Dev (minutes):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={delayStdDev}
                    onChange={(e) => setDelayStdDev(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Max Delay (minutes):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={delayMax}
                    onChange={(e) => setDelayMax(parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>Pressure Noise (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={pressureNoise}
                    onChange={(e) => setPressureNoise(parseFloat(e.target.value))}
                  />
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    Noise level for pressure sensors. Example: 2.0 = ±2% noise
                  </small>
                </div>
                <div className="config-item">
                  <label>Flow Noise (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={flowNoise}
                    onChange={(e) => setFlowNoise(parseFloat(e.target.value))}
                  />
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    Noise level for flow sensors. Example: 3.0 = ±3% noise
                  </small>
                </div>
                <div className="config-item">
                  <label>Tank Level Noise (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={tankLevelNoise}
                    onChange={(e) => setTankLevelNoise(parseFloat(e.target.value))}
                  />
                  <small style={{color: '#666', fontSize: '0.85em'}}>
                    Noise level for tank level sensors. Example: 1.0 = ±1% noise
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
                  <h2>SCADA Simulator Configuration Help</h2>
                  <button 
                    className="help-modal-close"
                    onClick={() => setShowHelpModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="help-modal-body">
                  {/* Generation Rate */}
                  <div className="help-section">
                    <h3>Generation Rate (minutes)</h3>
                    <p><strong>What it does:</strong> Controls how often the simulator generates new sensor readings.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 5 minutes means new readings are generated every 5 minutes. 
                      If you start at 10:00 AM, readings will be generated at 10:00, 10:05, 10:10, 10:15, etc.
                    </div>
                    <p><strong>Range:</strong> 0.1 to 1440 minutes (0.1 min = 6 seconds, 1440 min = 24 hours)</p>
                    <p><strong>Tip:</strong> Lower values (e.g., 1-5 minutes) = more frequent data, useful for real-time monitoring. 
                    Higher values (e.g., 15-60 minutes) = less frequent data, useful for periodic monitoring.</p>
                  </div>

                  {/* Data Loss Ratio */}
                  <div className="help-section">
                    <h3>Data Loss Ratio (0-1)</h3>
                    <p><strong>What it does:</strong> Determines what percentage of network items (junctions, pipes, tanks) will NOT have readings generated (simulating data loss).</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 0.10 (10%) means 10% of items are lost, 90% are kept.
                      <br />
                      If you have 100 junctions, approximately 90 will have readings generated, and 10 will not.
                      <br />
                      If you have 50 pipes, approximately 45 will have readings, and 5 will not.
                    </div>
                    <p><strong>Range:</strong> 0.0 to 1.0 (0.0 = no data loss, 1.0 = 100% data loss)</p>
                    <p><strong>Tip:</strong> Use this to simulate sensor failures, communication issues, or network problems. 
                    A value of 0.10-0.20 (10-20% loss) is typical for realistic scenarios.</p>
                  </div>

                  {/* Data Loss Variance */}
                  <div className="help-section">
                    <h3>Data Loss Variance (0-0.5)</h3>
                    <p><strong>What it does:</strong> Adds randomness to the data loss Ratio. Each generation cycle, the actual loss percentage varies around the configured mean.</p>
                    <div className="help-example">
                      <strong>Example:</strong> With Data Loss Ratio = 0.10 (10%) and Variance = 0.05:
                      <br />
                      • Cycle 1 might have 8% loss (12% kept)
                      <br />
                      • Cycle 2 might have 12% loss (8% kept)
                      <br />
                      • Cycle 3 might have 10% loss (10% kept)
                      <br />
                      The actual loss varies randomly between approximately 5% and 15% each cycle.
                    </div>
                    <p><strong>Range:</strong> 0.0 to 0.5</p>
                    <p><strong>Tip:</strong> Higher variance = more variation in data loss between cycles, making the simulation more realistic. 
                    A variance of 0.05 is a good starting point for natural variation.</p>
                  </div>

                  {/* Delay Mean */}
                  <div className="help-section">
                    <h3>Delay Mean (minutes)</h3>
                    <p><strong>What it does:</strong> Sets the average delay applied to reading timestamps. Readings are timestamped in the past to simulate transmission delays from sensors to the SCADA system.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 2.5 minutes means readings are timestamped 2.5 minutes in the past on average.
                      <br />
                      If a reading is generated at 10:00 AM, it might be timestamped as 9:57 AM, 9:58 AM, 9:59 AM, etc. (depending on the actual delay sampled).
                    </div>
                    <p><strong>Range:</strong> 0.0 and above (0.0 = no delay)</p>
                    <p><strong>Tip:</strong> This simulates realistic transmission delays. Typical values are 1-5 minutes for most SCADA systems. 
                    The delay is subtracted from the generation time, so readings appear to have arrived late.</p>
                  </div>

                  {/* Delay Std Dev */}
                  <div className="help-section">
                    <h3>Delay Std Dev (minutes)</h3>
                    <p><strong>What it does:</strong> Controls the variation in delay values. Higher values mean more variation around the mean delay.</p>
                    <div className="help-example">
                      <strong>Example:</strong> With Delay Mean = 2.5 minutes and Std Dev = 2.0 minutes:
                      <br />
                      • Most delays will be between 0.5 and 4.5 minutes
                      <br />
                      • Some delays might be as low as 0 minutes (no delay)
                      <br />
                      • Some delays might be as high as 5-6 minutes
                      <br />
                      The distribution is bounded by Max Delay, so no delay exceeds that value.
                    </div>
                    <p><strong>Range:</strong> 0.0 and above (0.0 = no variation, all delays are exactly the mean)</p>
                    <p><strong>Tip:</strong> Higher standard deviation = more realistic variation in transmission times. 
                    A value of 1.5-2.5 minutes works well with a mean of 2.5 minutes.</p>
                  </div>

                  {/* Max Delay */}
                  <div className="help-section">
                    <h3>Max Delay (minutes)</h3>
                    <p><strong>What it does:</strong> Sets the maximum delay that can be applied to any reading timestamp. This ensures no reading has a future timestamp and bounds the delay distribution.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 10.0 minutes means no reading will be delayed more than 10 minutes.
                      <br />
                      If a reading is generated at 10:00 AM, the earliest timestamp it can have is 9:50 AM (10 minutes ago).
                      <br />
                      Even if the delay distribution would suggest a 15-minute delay, it will be capped at 10 minutes.
                    </div>
                    <p><strong>Range:</strong> 0.0 and above (must be greater than Delay Mean)</p>
                    <p><strong>Tip:</strong> This prevents unrealistic delays and ensures all readings are in the past. 
                    A value of 5-10 minutes is typical. Make sure Max Delay is greater than Delay Mean for the distribution to work properly.</p>
                  </div>

                  {/* Pressure Noise */}
                  <div className="help-section">
                    <h3>Pressure Noise (%)</h3>
                    <p><strong>What it does:</strong> Controls the amount of random noise added to pressure sensor readings. Noise simulates sensor measurement uncertainty and environmental variations.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 2.0% means pressure readings will have ±2% random noise.
                      <br />
                      If baseline pressure is 45.0 m, the reading might be anywhere from 44.1 m to 45.9 m (45.0 × 0.98 to 45.0 × 1.02).
                      <br />
                      The noise is uniformly distributed, so any value in that range is equally likely.
                    </div>
                    <p><strong>Range:</strong> 0.0 to 50.0% (0.0 = no noise, 50.0 = ±50% noise)</p>
                    <p><strong>Tip:</strong> Real pressure sensors typically have 1-3% noise. Lower values (1-2%) = more accurate readings.
                    Higher values (5-10%) = more variation, useful for testing anomaly detection sensitivity.</p>
                  </div>

                  {/* Flow Noise */}
                  <div className="help-section">
                    <h3>Flow Noise (%)</h3>
                    <p><strong>What it does:</strong> Controls the amount of random noise added to flow sensor readings. Flow sensors typically have more variation than pressure sensors.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 3.0% means flow readings will have ±3% random noise.
                      <br />
                      If baseline flow is 100 L/s, the reading might be anywhere from 97 L/s to 103 L/s (100 × 0.97 to 100 × 1.03).
                      <br />
                      The noise is uniformly distributed across this range.
                    </div>
                    <p><strong>Range:</strong> 0.0 to 50.0% (0.0 = no noise, 50.0 = ±50% noise)</p>
                    <p><strong>Tip:</strong> Real flow sensors typically have 2-5% noise due to turbulence and measurement challenges.
                    Default of 3% is realistic. Higher values simulate less accurate sensors or turbulent conditions.</p>
                  </div>

                  {/* Tank Level Noise */}
                  <div className="help-section">
                    <h3>Tank Level Noise (%)</h3>
                    <p><strong>What it does:</strong> Controls the amount of random noise added to tank level sensor readings. Tank levels are usually more stable than pressure or flow.</p>
                    <div className="help-example">
                      <strong>Example:</strong> Setting this to 1.0% means tank level readings will have ±1% random noise.
                      <br />
                      If baseline tank level is 10.0 m, the reading might be anywhere from 9.9 m to 10.1 m (10.0 × 0.99 to 10.0 × 1.01).
                      <br />
                      Tank levels change slowly, so lower noise is more realistic.
                    </div>
                    <p><strong>Range:</strong> 0.0 to 50.0% (0.0 = no noise, 50.0 = ±50% noise)</p>
                    <p><strong>Tip:</strong> Real tank level sensors are very accurate, typically 0.5-2% noise. Default of 1% is realistic.
                    Lower values (0.5-1%) = more stable readings. Higher values (3-5%) = more variation, useful for testing.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Configuration Display */}
          {isRunning && simulatorStatus?.configuration && (
            <div className="config-display">
              <h3>Current Configuration</h3>
              <p>Generation Rate: {simulatorStatus.configuration.generation_rate_minutes} minutes</p>
              <p>Data Loss: {(simulatorStatus.configuration.data_loss_Ratio * 100).toFixed(0)}% lost, {(100 - simulatorStatus.configuration.data_loss_Ratio * 100).toFixed(0)}% kept (variance: {simulatorStatus.configuration.data_loss_variance})</p>
              <p>Delay: {simulatorStatus.configuration.delay_mean} ± {simulatorStatus.configuration.delay_std_dev} (max: {simulatorStatus.configuration.delay_max}) minutes</p>
              <p>Noise: Pressure {simulatorStatus.configuration.pressure_noise_percent}% | Flow {simulatorStatus.configuration.flow_noise_percent}% | Tank Level {simulatorStatus.configuration.tank_level_noise_percent}%</p>
            </div>
          )}
          
          <div className="button-group">
            <button 
              onClick={startSimulator}
              disabled={isRunning || isStarting}
              className="btn-primary"
            >
              {isStarting ? 'Starting...' : 'Start Simulator'}
            </button>
            
            <button 
              onClick={stopSimulator}
              disabled={!isRunning}
              className="btn-secondary"
            >
              Stop Simulator
            </button>
            
            <button 
              onClick={clearReadings}
              disabled={!networkId}
              className="btn-clear"
            >
              Clear SCADA Readings
            </button>
          </div>

          {/* Current Cycle Info */}
          {isRunning && simulatorStatus?.current_cycle && (
            <div className="cycle-info">
              <h3>Last Generation Cycle</h3>
              <p>Readings Generated: {simulatorStatus.current_cycle.readings_generated}</p>
              <p>Junctions: {simulatorStatus.current_cycle.junctions_selected}</p>
              <p>Pipes: {simulatorStatus.current_cycle.pipes_selected}</p>
              <p>Tanks: {simulatorStatus.current_cycle.tanks_selected}</p>
              {simulatorStatus.last_generation_time && (
                <p>Last Generation: {new Date(simulatorStatus.last_generation_time).toLocaleString()}</p>
              )}
            </div>
          )}

          {/* Recent Logs */}
          {logs.length > 0 && (
            <div className="logs-section">
              <h3>Recent Generation Logs</h3>
              <div className="logs-list">
                {logs.map((log) => (
                  <div key={log.id} className="log-item">
                    <p><strong>{new Date(log.generation_timestamp).toLocaleString()}</strong></p>
                    <p>Readings: {log.readings_generated} | Junctions: {log.junctions_selected} | Pipes: {log.pipes_selected} | Tanks: {log.tanks_selected}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {message && (
            <div className="message-box">
              {message}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}
      
      <style>{`
        .simulator-page {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .warning-box {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .simulator-controls {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .network-info {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .network-info p {
          margin: 0.5rem 0;
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .config-item {
          display: flex;
          flex-direction: column;
        }

        .config-item label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .config-item input {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }

        .config-display {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #e7f3ff;
          border-radius: 4px;
        }

        .config-display h3 {
          margin-top: 0;
        }

        .cycle-info {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .cycle-info h3 {
          margin-top: 0;
        }

        .logs-section {
          margin-top: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .logs-section h3 {
          margin-top: 0;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        /* Custom scrollbar styling for logs list */
        .logs-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .logs-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .logs-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .logs-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .log-item {
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .log-item p {
          margin: 0.25rem 0;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
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
        
        .btn-clear {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          background-color: #ff9800;
          color: white;
        }
        
        .btn-clear:hover:not(:disabled) {
          background-color: #f57c00;
        }
        
        .btn-clear:disabled {
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

        /* Custom scrollbar for help modal body */
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
      `}</style>
    </div>
  );
}
