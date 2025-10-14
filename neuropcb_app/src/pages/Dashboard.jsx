import React, { useState } from 'react';
import { Activity, Zap, Thermometer, AlertCircle, Play, Pause, RotateCcw, MessageCircle, Settings } from 'lucide-react';
import { Gauge, StatusCard, AIAdvisor, ConnectionStatus, DataChart, Navigation } from '../components/layout-component';
import { Button } from '../components/ui-components';
import { useDataSync } from '../hooks/useDataSync';
import { ChatBox } from '../components/ChatBox';

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
    setSimulationScenario,
    manualVoltage,
    setManualVoltage,
    manualTemperature,
    setManualTemperature,
    analyzeHardwareStatus
  } = useDataSync();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

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

  // Get hardware connection details for chat
  const getHardwareDetails = () => {
    return {
      connectionMode: currentReading?.connection_mode || 'Unknown',
      isConnected,
      isSimulationRunning,
      simulationScenario,
      currentVoltage: getSafeVoltage(),
      currentTemperature: getSafeTemperature(),
      faultStatus: getSafeFaultStatus(),
      dataPoints: historicalData.length,
      lastUpdate: getLastUpdated()
    };
  };

  const handleManualMode = () => {
    // Stop auto simulation when entering manual mode
    if (isSimulationRunning) {
      toggleSimulation();
    }
    setShowManualInput(true);
  };

  const handleAutoMode = () => {
    // Start auto simulation when leaving manual mode
    if (!isSimulationRunning) {
      toggleSimulation();
    }
    setShowManualInput(false);
  };

  const handleAnalyze = () => {
    analyzeHardwareStatus(manualVoltage, manualTemperature);
    // Keep manual input open for further adjustments
  };

  // Calculate slider position for proper range alignment
  const getSliderBackground = (value, min, max, color) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
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
              <Button 
                onClick={() => setIsChatOpen(true)}
                variant="default" 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <MessageCircle className="w-4 h-4" />
                AI Assistant
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Simulation Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Simulation Control Panel */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Hardware Analysis</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      showManualInput 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : isSimulationRunning 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {showManualInput ? 'Manual Mode' : isSimulationRunning ? 'Auto Mode' : 'Stopped'}
                    </span>
                    
                    {/* Auto Mode Button */}
                    <Button 
                      onClick={handleAutoMode}
                      variant={!showManualInput && isSimulationRunning ? "default" : "outline"}
                      size="sm"
                    >
                      <Play className="w-4 h-4" />
                      Auto Mode
                    </Button>
                    
                    {/* Manual Mode Button */}
                    <Button
                      onClick={handleManualMode}
                      variant={showManualInput ? "default" : "outline"}
                      size="sm"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                    >
                      <Settings className="w-4 h-4" />
                      Manual Mode
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Analysis Mode</label>
                    <select 
                      value={simulationScenario}
                      onChange={(e) => setSimulationScenario(e.target.value)}
                      disabled={showManualInput}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <option value="normal">Normal Operation</option>
                      <option value="overheating">Overheating Analysis</option>
                      <option value="voltage_drop">Voltage Analysis</option>
                      <option value="broken_trace">Hardware Fault Analysis</option>
                      <option value="random">Random Analysis</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Connection Mode</label>
                    <div className="flex gap-2">
                      <Button
                        variant={currentReading?.connection_mode === 'Wi-Fi' ? "default" : "outline"}
                        size="sm"
                        onClick={() => refresh('Wi-Fi')}
                        disabled={showManualInput}
                      >
                        Wi-Fi
                      </Button>
                      <Button
                        variant={currentReading?.connection_mode === 'BLE' ? "default" : "outline"}
                        size="sm"
                        onClick={() => refresh('BLE')}
                        disabled={showManualInput}
                      >
                        BLE
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Current Status</label>
                    <div className={`text-lg font-semibold ${
                      currentReading?.fault_status === 'Normal' ? 'text-green-400' :
                      currentReading?.fault_status === 'Voltage Drop' ? 'text-yellow-400' :
                      currentReading?.fault_status === 'Overheated' ? 'text-orange-400' :
                      currentReading?.fault_status === 'Broken Trace' ? 'text-red-400' : 'text-gray-400'
                    }`}>
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
                  status={currentReading && currentReading.voltage < 2.8 ? 'warning' : 'normal'}
                  subtitle="Power Supply"
                />
                <StatusCard
                  title="Temperature"
                  value={`${getSafeTemperature().toFixed(1)} °C`}
                  icon={<Thermometer className="w-6 h-6" />}
                  status={
                    currentReading && currentReading.temperature > 60 ? 'critical' :
                    currentReading && currentReading.temperature > 45 ? 'warning' : 'normal'
                  }
                  subtitle="Thermal Reading"
                />
              </div>

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
            </div>

            {/* Right Side - Hardware Analysis Panel */}
            <div className="space-y-6">
              {/* Manual Input Section */}
              {showManualInput && (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Manual Hardware Analysis
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Adjust voltage and temperature values to analyze hardware status in real-time
                  </p>
                  
                  <div className="space-y-6">
                    {/* Voltage Control */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          Voltage Input
                        </label>
                        <span className="text-cyan-400 font-mono text-lg font-bold">{manualVoltage.toFixed(2)}V</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.01"
                          value={manualVoltage}
                          onChange={(e) => setManualVoltage(parseFloat(e.target.value))}
                          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: getSliderBackground(manualVoltage, 0, 5, '#22d3ee')
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="text-center">
                            <div>0V</div>
                            <div className="text-[10px]">Min</div>
                          </span>
                          <span className="text-center">
                            <div>2.5V</div>
                            <div className="text-[10px]">Critical</div>
                          </span>
                          <span className="text-center">
                            <div>3.3V</div>
                            <div className="text-[10px]">Optimal</div>
                          </span>
                          <span className="text-center">
                            <div>5V</div>
                            <div className="text-[10px]">Max</div>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Temperature Control */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-400" />
                          Temperature Input
                        </label>
                        <span className="text-red-400 font-mono text-lg font-bold">{manualTemperature}°C</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="-20"
                          max="120"
                          step="1"
                          value={manualTemperature}
                          onChange={(e) => setManualTemperature(parseInt(e.target.value))}
                          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: getSliderBackground(manualTemperature, -20, 120, '#f87171')
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="text-center">
                            <div>-20°C</div>
                            <div className="text-[10px]">Min</div>
                          </span>
                          <span className="text-center">
                            <div>25°C</div>
                            <div className="text-[10px]">Room</div>
                          </span>
                          <span className="text-center">
                            <div>45°C</div>
                            <div className="text-[10px]">Optimal</div>
                          </span>
                          <span className="text-center">
                            <div>80°C</div>
                            <div className="text-[10px]">Critical</div>
                          </span>
                          <span className="text-center">
                            <div>120°C</div>
                            <div className="text-[10px]">Max</div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleAnalyze}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1"
                    >
                      Analyze Hardware Status
                    </Button>
                    <Button
                      onClick={handleAutoMode}
                      variant="outline"
                    >
                      Auto Mode
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Advisor */}
              {aiAnalysis && (
                <AIAdvisor 
                  suggestion={aiAnalysis.ai_suggestion} 
                  severity={aiAnalysis.severity} 
                />
              )}

              {/* Analysis Results */}
              {currentReading && (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-purple-400">
                  <h3 className="font-semibold mb-4 text-purple-400">Analysis Results</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Voltage Analysis
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reading:</span>
                          <span className="text-white font-mono">{getSafeVoltage().toFixed(2)}V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={
                            getSafeVoltage() >= 3.0 ? 'text-green-400' :
                            getSafeVoltage() >= 2.8 ? 'text-yellow-400' : 'text-red-400'
                          }>
                            {getSafeVoltage() >= 3.0 ? 'Normal' :
                             getSafeVoltage() >= 2.8 ? 'Low' : 'Critical'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-red-400" />
                        Temperature Analysis
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reading:</span>
                          <span className="text-white font-mono">{getSafeTemperature().toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={
                            getSafeTemperature() <= 45 ? 'text-green-400' :
                            getSafeTemperature() <= 60 ? 'text-yellow-400' : 'text-red-400'
                          }>
                            {getSafeTemperature() <= 45 ? 'Normal' :
                             getSafeTemperature() <= 60 ? 'High' : 'Critical'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Overall Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getFaultStatus() === 'normal' ? 'bg-green-500/20 text-green-400' :
                          getFaultStatus() === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {getSafeFaultStatus()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hardware Info */}
              <div className="glass-card rounded-2xl p-6 border-l-4 border-cyan-400">
                <h3 className="font-semibold mb-3 text-cyan-400">Hardware Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connection:</span>
                    <span className="text-white">{currentReading?.connection_mode || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Points:</span>
                    <span className="text-cyan-400">{Array.isArray(historicalData) ? historicalData.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Update:</span>
                    <span className="text-gray-300 text-xs">{getLastUpdated()}</span>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Chat Box */}
      <ChatBox 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        hardwareDetails={getHardwareDetails()}
        currentReading={currentReading}
        aiAnalysis={aiAnalysis}
        historicalData={historicalData}
        refreshData={refresh}
        toggleSimulation={toggleSimulation}
        setSimulationScenario={setSimulationScenario}
      />
    </>
  );
};

export default Dashboard;