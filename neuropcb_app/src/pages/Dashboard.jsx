import React from 'react';
import { Activity, Zap, Thermometer, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { Gauge, StatusCard, AIAdvisor, ConnectionStatus, DataChart, Navigation } from '../components/layout-component';
import { Button } from '../components/ui-components';
import { useDataSync } from '../hooks/useDataSync';

const Dashboard = () => {
  const { 
    currentReading, 
    aiAnalysis, 
    isConnected, 
    historicalData, 
    refresh,
    isSimulationRunning,
    toggleSimulation,
    simulationScenario,
    setSimulationScenario
  } = useDataSync();

  // Safe value getters
  const getSafeFaultStatus = () => {
    if (!currentReading || typeof currentReading.fault_status !== 'string') {
      return 'Unknown';
    }
    return currentReading.fault_status;
  };

  const getSafeVoltage = () => {
    if (!currentReading || typeof currentReading.voltage !== 'number') {
      return 0;
    }
    return currentReading.voltage;
  };

  const getSafeTemperature = () => {
    if (!currentReading || typeof currentReading.temperature !== 'number') {
      return 0;
    }
    return currentReading.temperature;
  };

  const getFaultStatus = () => {
    if (!currentReading) return 'normal';
    const faultStatus = currentReading.fault_status;
    
    if (typeof faultStatus !== 'string') return 'normal';
    
    if (faultStatus === 'Overheated' || faultStatus === 'Broken Trace') {
      return 'critical';
    }
    if (faultStatus === 'Voltage Drop') {
      return 'warning';
    }
    return 'normal';
  };

  // Safe timestamp display
  const getLastUpdated = () => {
    if (!currentReading?.timestamp) return 'Never';
    
    try {
      return new Date(currentReading.timestamp).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Simulation Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">NeuroPCB AI</h1>
              <p className="text-gray-400">Real-time PCB Fault Detection & Diagnostics</p>
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus 
                mode={currentReading?.connection_mode || 'disconnected'} 
                isConnected={isConnected} 
              />
              <Button 
                onClick={() => refresh()} 
                variant="outline" 
                size="sm" 
                className="border-green-400 text-green-400 hover:bg-green-400/10"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Simulation Control Panel */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Hardware Simulation</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isSimulationRunning 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {isSimulationRunning ? 'Running' : 'Paused'}
                </span>
                <Button 
                  onClick={toggleSimulation}
                  variant={isSimulationRunning ? "destructive" : "default"}
                  size="sm"
                >
                  {isSimulationRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause Sim
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Sim
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Scenario</label>
                <select 
                  value={simulationScenario}
                  onChange={(e) => setSimulationScenario(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="normal">Normal Operation</option>
                  <option value="overheating">Overheating</option>
                  <option value="voltage_drop">Voltage Drop</option>
                  <option value="broken_trace">Broken Trace</option>
                  <option value="random">Random Faults</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Connection Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={currentReading?.connection_mode === 'Wi-Fi' ? "default" : "outline"}
                    size="sm"
                    onClick={() => refresh('Wi-Fi')}
                  >
                    Wi-Fi
                  </Button>
                  <Button
                    variant={currentReading?.connection_mode === 'BLE' ? "default" : "outline"}
                    size="sm"
                    onClick={() => refresh('BLE')}
                  >
                    BLE
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Current Status</label>
                <div className="text-lg font-semibold text-green-400">
                  {getSafeFaultStatus()}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Data Points</label>
                <div className="text-lg font-semibold text-cyan-400">
                  {Array.isArray(historicalData) ? historicalData.length : 0}
                </div>
              </div>
            </div>
          </div>

          {/* Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Gauge
              value={getSafeVoltage()}
              min={0}
              max={5}
              label="Voltage"
              unit="V"
              color="cyan"
              warningThreshold={4.5}
              criticalThreshold={4.8}
            />
            <Gauge
              value={getSafeTemperature()}
              min={0}
              max={100}
              label="Temperature"
              unit="°C"
              color="green"
              warningThreshold={50}
              criticalThreshold={60}
            />
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard
              title="System Status"
              value={getSafeFaultStatus()}
              icon={<Activity className="w-6 h-6" />}
              status={getFaultStatus()}
            />
            <StatusCard
              title="Voltage"
              value={`${getSafeVoltage().toFixed(2)} V`}
              icon={<Zap className="w-6 h-6" />}
              status={getSafeVoltage() < 2.8 ? 'warning' : 'normal'}
              subtitle="Power Supply"
            />
            <StatusCard
              title="Temperature"
              value={`${getSafeTemperature().toFixed(1)} °C`}
              icon={<Thermometer className="w-6 h-6" />}
              status={
                getSafeTemperature() > 60 ? 'critical' :
                getSafeTemperature() > 45 ? 'warning' : 'normal'
              }
              subtitle="Thermal Reading"
            />
          </div>

          {/* AI Advisor */}
          {aiAnalysis && (
            <AIAdvisor 
              suggestion={aiAnalysis.ai_suggestion} 
              severity={aiAnalysis.severity} 
            />
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataChart
              data={Array.isArray(historicalData) ? historicalData : []}
              dataKey="voltage"
              color="#22d3ee"
              label="Voltage Trend"
            />
            <DataChart
              data={Array.isArray(historicalData) ? historicalData : []}
              dataKey="temperature"
              color="#48bb78"
              label="Temperature Trend"
            />
          </div>

          {/* Hardware Simulation Info */}
          <div className="glass-card rounded-xl p-6 border-l-4 border-cyan-400">
            <h3 className="font-semibold mb-2 text-cyan-400">Hardware Simulation Active</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Current Scenario</p>
                <p className="text-white font-medium">
                  {simulationScenario ? simulationScenario.replace('_', ' ').toUpperCase() : 'NORMAL'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Update Interval</p>
                <p className="text-white font-medium">5 seconds</p>
              </div>
              <div>
                <p className="text-gray-400">Data Source</p>
                <p className="text-white font-medium">Simulated Sensors</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              This is a simulation environment. Connect real hardware via BLE/Wi-Fi in production.
            </p>
          </div>

          {/* Footer Info */}
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-400">
              Last updated: {getLastUpdated()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;