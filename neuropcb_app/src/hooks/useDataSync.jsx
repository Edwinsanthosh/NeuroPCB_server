import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { toast } from '../components/ui-components';

// Hardware status analyzer based on voltage and temperature
const analyzeHardwareStatus = (voltage, temperature) => {
  let fault_status = 'Normal';
  let severity = 'low';
  
  // Voltage analysis
  const voltageStatus = 
    voltage >= 3.0 ? 'normal' :
    voltage >= 2.8 ? 'low' :
    voltage >= 2.5 ? 'very_low' : 'critical';
  
  // Temperature analysis
  const tempStatus = 
    temperature <= 45 ? 'normal' :
    temperature <= 60 ? 'high' :
    temperature <= 80 ? 'very_high' : 'critical';
  
  // Determine overall fault status
  if (voltageStatus === 'critical' && tempStatus === 'critical') {
    fault_status = 'Broken Trace';
    severity = 'high';
  } else if (tempStatus === 'critical' || tempStatus === 'very_high') {
    fault_status = 'Overheated';
    severity = tempStatus === 'critical' ? 'high' : 'medium';
  } else if (voltageStatus === 'critical' || voltageStatus === 'very_low') {
    fault_status = 'Voltage Drop';
    severity = voltageStatus === 'critical' ? 'high' : 'medium';
  } else if (voltageStatus === 'low' || tempStatus === 'high') {
    fault_status = 'Normal';
    severity = 'low';
  }
  
  return { fault_status, severity };
};

// Enhanced mock data generator with analysis
const generateMockReading = (scenario = 'normal', connectionMode = 'Wi-Fi', manualVoltage = null, manualTemperature = null) => {
  const scenarios = {
    normal: { voltage: 3.3, temp: 35 },
    overheating: { voltage: 3.1, temp: 75 },
    voltage_drop: { voltage: 2.6, temp: 32 },
    broken_trace: { voltage: 2.3, temp: 85 },
    random: { 
      voltage: 2.5 + Math.random() * 1.0, 
      temp: 20 + Math.random() * 50 
    }
  };

  const scenarioData = scenarios[scenario] || scenarios.normal;
  
  // Use manual inputs if provided, otherwise use scenario data with some variation
  const voltage = manualVoltage !== null ? manualVoltage : 
    scenarioData.voltage + (Math.random() * 0.4 - 0.2);
  const temperature = manualTemperature !== null ? manualTemperature : 
    scenarioData.temp + (Math.random() * 10 - 5);
  
  const analysis = analyzeHardwareStatus(voltage, temperature);
  
  return {
    voltage: Number(voltage.toFixed(2)),
    temperature: Number(temperature.toFixed(1)),
    fault_status: analysis.fault_status,
    connection_mode: connectionMode,
    timestamp: new Date().toISOString(),
    severity: analysis.severity
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
  const [manualVoltage, setManualVoltage] = useState(3.3);
  const [manualTemperature, setManualTemperature] = useState(25);
  
  // Use refs to track toast states without causing re-renders
  const toastState = useRef({
    hasShownDemo: false,
    hasShownConnection: false,
    lastSeverity: null,
    lastToastTime: 0
  });

  const analyzeHardwareStatusCallback = useCallback((voltage, temperature) => {
    const analysis = analyzeHardwareStatus(voltage, temperature);
    
    const reading = {
      voltage: Number(voltage.toFixed(2)),
      temperature: Number(temperature.toFixed(1)),
      fault_status: analysis.fault_status,
      connection_mode: connectionMode,
      timestamp: new Date().toISOString(),
      severity: analysis.severity
    };
    
    setCurrentReading(reading);
    
    setHistoricalData(prev => {
      const newData = [...prev, {
        time: new Date().toLocaleTimeString(),
        voltage: reading.voltage,
        temperature: reading.temperature,
        fault_status: reading.fault_status
      }];
      // Keep only last 20 readings
      return newData.slice(-20);
    });
    
    // Generate AI analysis based on the status
    const aiSuggestion = generateAISuggestion(reading);
    setAiAnalysis(aiSuggestion);
    
    // Show appropriate toast
    const now = Date.now();
    if (analysis.severity !== toastState.current.lastSeverity && 
        (now - toastState.current.lastToastTime > 3000)) {
      
      if (analysis.severity === 'high') {
        toast.error('🚨 Critical Hardware Fault!', {
          description: `Detected: ${reading.fault_status}`,
          duration: 10000,
        });
      } else if (analysis.severity === 'medium') {
        toast.warning('⚠️ Hardware Warning', {
          description: `Issue: ${reading.fault_status}`,
          duration: 7000,
        });
      }
      
      toastState.current.lastSeverity = analysis.severity;
      toastState.current.lastToastTime = now;
    }
    
    return reading;
  }, [connectionMode]);

  const generateAISuggestion = (reading) => {
    const suggestions = {
      'Normal': {
        ai_suggestion: 'System operating within normal parameters. Continue regular monitoring.',
        severity: 'low'
      },
      'Voltage Drop': {
        ai_suggestion: reading.voltage < 2.5 
          ? 'Critical voltage drop detected! Check power supply, traces, and components immediately.'
          : 'Moderate voltage drop detected. Inspect power supply and check for loose connections.',
        severity: reading.voltage < 2.5 ? 'high' : 'medium'
      },
      'Overheated': {
        ai_suggestion: reading.temperature > 80
          ? 'Critical overheating! Power down immediately and inspect cooling systems.'
          : 'High temperature detected. Improve ventilation and check for cooling system issues.',
        severity: reading.temperature > 80 ? 'high' : 'medium'
      },
      'Broken Trace': {
        ai_suggestion: 'Hardware fault detected. Perform visual inspection and continuity testing of PCB traces.',
        severity: 'high'
      }
    };
    
    return suggestions[reading.fault_status] || suggestions['Normal'];
  };

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
          toast.info('Hardware Analysis Mode Active', {
            description: 'Analyzing hardware status based on input parameters',
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
      
      const analysis = generateAISuggestion(data);
      setAiAnalysis(analysis);
      
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
      toast.info('Auto Analysis Mode', {
        description: 'Automatically analyzing hardware scenarios',
      });
    } else {
      toast.info('Manual Analysis Mode', {
        description: 'Ready for manual hardware input',
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
    manualVoltage,
    setManualVoltage,
    manualTemperature,
    setManualTemperature,
    analyzeHardwareStatus: analyzeHardwareStatusCallback,
    refresh
  };
};