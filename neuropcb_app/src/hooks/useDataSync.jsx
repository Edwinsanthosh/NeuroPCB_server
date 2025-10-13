import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { toast } from '../components/ui-components';

// Enhanced mock data generator with scenarios
const generateMockReading = (scenario = 'normal', connectionMode = 'Wi-Fi') => {
  const scenarios = {
    normal: [
      { voltage: 3.3 + (Math.random() * 0.2 - 0.1), temp: 25 + Math.random() * 5, fault: 'Normal' },
      { voltage: 3.2 + (Math.random() * 0.2 - 0.1), temp: 28 + Math.random() * 5, fault: 'Normal' },
    ],
    overheating: [
      { voltage: 3.1 + (Math.random() * 0.1), temp: 65 + Math.random() * 10, fault: 'Overheated' },
      { voltage: 3.0 + (Math.random() * 0.1), temp: 70 + Math.random() * 8, fault: 'Overheated' },
    ],
    voltage_drop: [
      { voltage: 2.7 + Math.random() * 0.1, temp: 30 + Math.random() * 5, fault: 'Voltage Drop' },
      { voltage: 2.6 + Math.random() * 0.1, temp: 32 + Math.random() * 5, fault: 'Voltage Drop' },
    ],
    broken_trace: [
      { voltage: 2.5 + Math.random() * 0.2, temp: 35 + Math.random() * 10, fault: 'Broken Trace' },
      { voltage: 2.4 + Math.random() * 0.2, temp: 38 + Math.random() * 10, fault: 'Broken Trace' },
    ],
    random: [
      { voltage: 2.5 + Math.random() * 1.0, temp: 20 + Math.random() * 50, fault: ['Normal', 'Voltage Drop', 'Overheated', 'Broken Trace'][Math.floor(Math.random() * 4)] },
    ]
  };

  const scenarioData = scenarios[scenario] || scenarios.normal;
  const dataPoint = scenarioData[Math.floor(Math.random() * scenarioData.length)];
  
  return {
    voltage: Number(dataPoint.voltage.toFixed(2)),
    temperature: Number(dataPoint.temp.toFixed(1)),
    fault_status: dataPoint.fault,
    connection_mode: connectionMode,
    timestamp: new Date().toISOString()
  };
};

export const useDataSync = () => {
  const [currentReading, setCurrentReading] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [simulationScenario, setSimulationScenario] = useState('normal');
  const [connectionMode, setConnectionMode] = useState('Wi-Fi');
  
  // Use refs to track toast states without causing re-renders
  const toastState = useRef({
    hasShownDemo: false,
    hasShownConnection: false,
    lastSeverity: null,
    lastToastTime: 0
  });

  const fetchData = useCallback(async (newConnectionMode = null) => {
    if (!isSimulationRunning) return;
    
    try {
      let data;
      let isMockData = false;
      
      // Update connection mode if provided
      if (newConnectionMode && typeof newConnectionMode === 'string') {
        setConnectionMode(newConnectionMode);
      }
      
      try {
        // Try to get real data first
        data = await apiService.getLatestData();
        setIsConnected(true);
        
        // Show connection toast only once
        if (!toastState.current.hasShownConnection && data) {
          toast.success('Connected to NeuroPCB Server', {
            description: 'Real-time data streaming active',
          });
          toastState.current.hasShownConnection = true;
        }
      } catch {
        // Fallback to simulation data
        data = generateMockReading(simulationScenario, connectionMode);
        setIsConnected(true);
        isMockData = true;
        
        // Show mock data toast only once
        if (!toastState.current.hasShownDemo) {
          toast.info('Hardware Simulation Active', {
            description: 'Using simulated sensor data - Connect real hardware for live monitoring',
          });
          toastState.current.hasShownDemo = true;
        }
      }
      
      setCurrentReading(data);
      
      setHistoricalData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          voltage: data.voltage,
          temperature: data.temperature,
          fault_status: data.fault_status
        }];
        // Keep only last 20 readings
        return newData.slice(-20);
      });
      
      const analysis = await apiService.getAIAnalysis(data);
      setAiAnalysis(analysis);
      
      // Prevent toast spam - only show if severity changed and enough time passed
      const now = Date.now();
      if (analysis.severity !== toastState.current.lastSeverity && 
          (now - toastState.current.lastToastTime > 3000)) {
        
        if (analysis.severity === 'high') {
          toast.error('🚨 Critical Fault Detected!', {
            description: analysis.ai_suggestion,
            duration: 10000,
          });
        } else if (analysis.severity === 'medium') {
          toast.warning('⚠️ System Warning', {
            description: analysis.ai_suggestion,
            duration: 7000,
          });
        } else if (analysis.severity === 'low' && toastState.current.lastSeverity === 'high') {
          toast.success('✅ System Normal', {
            description: 'All parameters returned to safe levels',
            duration: 5000,
          });
        }
        
        toastState.current.lastSeverity = analysis.severity;
        toastState.current.lastToastTime = now;
      }
      
    } catch (error) {
      console.error('Data sync error:', error);
      if (!toastState.current.hasShownDemo) {
        toast.error('Connection Error', {
          description: 'Failed to sync with data source',
        });
      }
    }
  }, [isSimulationRunning, simulationScenario, connectionMode]);

  const toggleSimulation = useCallback(() => {
    const newState = !isSimulationRunning;
    setIsSimulationRunning(newState);
    
    // Use toast.info for simulation status
    if (newState) {
      toast.info('Simulation Started', {
        description: 'Receiving simulated sensor data',
      });
    } else {
      toast.info('Simulation Paused', {
        description: 'Data updates paused',
      });
    }
  }, [isSimulationRunning]);

  const refresh = useCallback((newConnectionMode = null) => {
    // Safety check: if it looks like an event object, ignore the parameter
    if (newConnectionMode && 
        typeof newConnectionMode === 'object' && 
        (newConnectionMode.nativeEvent || newConnectionMode.target)) {
      console.warn('Event object detected in refresh, using default connection mode');
      fetchData();
    } else {
      fetchData(newConnectionMode);
    }
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up polling interval - every 5 seconds, but only if simulation is running
    const interval = setInterval(() => {
      if (isSimulationRunning) {
        fetchData();
      }
    }, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchData, isSimulationRunning]);

  return {
    currentReading,
    aiAnalysis,
    isConnected,
    historicalData,
    isSimulationRunning,
    toggleSimulation,
    simulationScenario,
    setSimulationScenario,
    refresh
  };
};