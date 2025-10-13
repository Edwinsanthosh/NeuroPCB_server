const API_BASE_URL = 'https://neuropcb-server.onrender.com';

export const apiService = {
  async getLatestData() {
    try {
      const response = await fetch(`${API_BASE_URL}/data/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest data:', error);
      throw error;
    }
  },

  async postReading(reading) {
    try {
      const response = await fetch(`${API_BASE_URL}/data/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reading),
      });
      if (!response.ok) {
        throw new Error('Failed to post data');
      }
    } catch (error) {
      console.error('Error posting reading:', error);
      throw error;
    }
  },

  async getAIAnalysis(reading) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reading),
      });
      if (!response.ok) {
        return this.localAIAnalysis(reading);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return this.localAIAnalysis(reading);
    }
  },

  localAIAnalysis(reading) {
    const { voltage = 0, temperature = 0, fault_status } = reading;
    
    if (fault_status === 'Overheated' || temperature > 60) {
      return {
        ai_suggestion: '⚠️ Critical: Reduce load on the circuit. Possible overheating in power section. Consider adding cooling or reducing current draw.',
        severity: 'high'
      };
    }
    
    if (fault_status === 'Voltage Drop' || voltage < 2.8) {
      return {
        ai_suggestion: '⚠️ Warning: Check solder joints and connections. Inconsistent voltage pattern detected. Verify power supply stability.',
        severity: 'medium'
      };
    }
    
    if (fault_status === 'Broken Trace') {
      return {
        ai_suggestion: '🔴 Critical: Broken trace detected. Inspect PCB for physical damage. Use multimeter to verify continuity.',
        severity: 'high'
      };
    }
    
    if (temperature > 45) {
      return {
        ai_suggestion: 'ℹ️ Notice: Temperature elevated but within safe range. Monitor closely and ensure adequate ventilation.',
        severity: 'low'
      };
    }
    
    return {
      ai_suggestion: '✅ System operating normally. All parameters within expected ranges. Continue monitoring.',
      severity: 'low'
    };
  }
};