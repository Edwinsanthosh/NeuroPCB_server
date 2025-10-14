import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Zap, Thermometer, Wifi, Bluetooth, Activity, AlertTriangle } from 'lucide-react';
import { Button } from './ui-components';

export const ChatBox = ({ 
  isOpen, 
  onClose, 
  hardwareDetails, 
  currentReading, 
  aiAnalysis, 
  historicalData,
  refreshData,
  toggleSimulation,
  setSimulationScenario
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when new messages are added or when loading state changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Only auto-scroll if user is near the bottom
      const isNearBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 100;
      
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your Self Healing PCB AI Assistant. I can help you with:\n\n• Hardware connection details\n• Real-time sensor readings\n• Fault diagnosis and solutions\n• System troubleshooting\n• Performance optimization\n\nWhat would you like to know about your PCB system?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const predefinedQuestions = [
    "What's the current system status?",
    "Show hardware connection details",
    "Diagnose current faults",
    "How to fix voltage issues?",
    "Temperature troubleshooting",
    "System optimization tips"
  ];

  // AI Model for matching user input with existing solutions
  const matchUserInput = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Define patterns and their corresponding responses
    const patterns = [
      {
        keywords: ['status', 'how is', 'current', 'what\'s happening', 'system health'],
        response: 'system_status'
      },
      {
        keywords: ['connection', 'hardware', 'details', 'connect', 'wifi', 'bluetooth', 'ble'],
        response: 'connection_details'
      },
      {
        keywords: ['diagnose', 'fault', 'problem', 'issue', 'error', 'wrong', 'broken'],
        response: 'diagnose_faults'
      },
      {
        keywords: ['voltage', 'power', 'battery', 'vcc', '3.3v', '5v'],
        response: 'voltage_analysis'
      },
      {
        keywords: ['temperature', 'heat', 'hot', 'cool', 'thermal', '°c', 'celsius'],
        response: 'temperature_analysis'
      },
      {
        keywords: ['fix', 'solution', 'repair', 'resolve', 'troubleshoot'],
        response: 'fix_solutions'
      },
      {
        keywords: ['optimize', 'improve', 'better', 'enhance', 'performance', 'efficient'],
        response: 'optimization_tips'
      },
      {
        keywords: ['refresh', 'update', 'reload', 'sync'],
        response: 'refresh_data'
      },
      {
        keywords: ['simulation', 'scenario', 'mode', 'test'],
        response: 'simulation_control'
      }
    ];

    // Calculate match score for each pattern
    const matches = patterns.map(pattern => {
      const score = pattern.keywords.reduce((total, keyword) => {
        return total + (lowerMessage.includes(keyword) ? 1 : 0);
      }, 0);
      
      return {
        response: pattern.response,
        score: score,
        confidence: score / pattern.keywords.length
      };
    });

    // Find the best match
    const bestMatch = matches.reduce((best, current) => {
      return current.score > best.score ? current : best;
    }, { score: 0, confidence: 0, response: null });

    // Return best match if confidence is high enough, otherwise use default
    return bestMatch.confidence > 0.3 ? bestMatch.response : 'general_help';
  };

  const getSystemStatus = () => {
    const status = hardwareDetails.faultStatus;
    const voltage = hardwareDetails.currentVoltage;
    const temp = hardwareDetails.currentTemperature;
    
    if (status === 'Normal' && voltage >= 3.0 && temp <= 45) {
      return "🟢 System is operating normally";
    } else if (status === 'Voltage Drop' || voltage < 2.8) {
      return "🟡 Voltage issues detected";
    } else if (status === 'Overheated' || temp > 60) {
      return "🔴 Critical overheating detected";
    } else if (status === 'Broken Trace') {
      return "🔴 Hardware fault detected";
    } else {
      return "🟠 System requires attention";
    }
  };

  const getConnectionDetails = () => {
    return `
**Hardware Connection Details:**

🔗 **Connection Mode**: ${hardwareDetails.connectionMode}
📶 **Connection Status**: ${hardwareDetails.isConnected ? 'Connected' : 'Disconnected'}
🔄 **Simulation**: ${hardwareDetails.isSimulationRunning ? 'Running' : 'Paused'}
🎯 **Scenario**: ${hardwareDetails.simulationScenario.replace('_', ' ').toUpperCase()}

**Current Readings:**
⚡ Voltage: ${hardwareDetails.currentVoltage.toFixed(2)}V
🌡️ Temperature: ${hardwareDetails.currentTemperature.toFixed(1)}°C
🚦 Status: ${hardwareDetails.faultStatus}
📊 Data Points: ${hardwareDetails.dataPoints}
⏰ Last Update: ${hardwareDetails.lastUpdate}
    `.trim();
  };

  const getFaultSolutions = (faultType) => {
    const solutions = {
      'Voltage Drop': `
**🔧 Solutions for Voltage Drop:**

1. **Check Power Supply**
   • Verify 3.3V power source stability
   • Measure input voltage with multimeter
   • Check for loose connections

2. **Inspect PCB Traces**
   • Look for damaged traces
   • Check solder joints
   • Verify component placement

3. **Component Testing**
   • Test voltage regulators
   • Check capacitor values
   • Verify load current

4. **Immediate Actions**
   • Reduce system load
   • Check for short circuits
   • Monitor temperature
      `,

      'Overheated': `
**🔧 Solutions for Overheating:**

1. **Immediate Cooling**
   • Apply thermal paste if needed
   • Ensure proper ventilation
   • Reduce processor load

2. **Hardware Inspection**
   • Check heatsink attachment
   • Verify fan operation
   • Inspect for dust buildup

3. **Power Management**
   • Reduce clock speeds temporarily
   • Check for stuck processes
   • Monitor power consumption

4. **Long-term Solutions**
   • Improve airflow design
   • Consider better heatsink
   • Optimize power settings
      `,

      'Broken Trace': `
**🔧 Solutions for Broken Trace:**

1. **Visual Inspection**
   • Use magnifying glass
   • Check under good lighting
   • Look for physical damage

2. **Continuity Testing**
   • Use multimeter continuity mode
   • Test trace end-to-end
   • Check adjacent traces

3. **Repair Methods**
   • Jumper wire repair
   • Conductive epoxy
   • Trace rebuilding

4. **Prevention**
   • Avoid mechanical stress
   • Proper PCB handling
   • Environmental protection
      `,

      'Normal': `
**✅ System is Operating Normally**

**Maintenance Tips:**
• Regular voltage monitoring
• Keep system clean
• Update firmware regularly
• Monitor temperature trends
• Backup configuration settings
      `
    };

    return solutions[faultType] || `
**🔧 General Troubleshooting:**

1. **System Reset**
   • Power cycle the hardware
   • Reset to factory settings
   • Check firmware version

2. **Connection Check**
   • Verify all cables
   • Test different ports
   • Check signal integrity

3. **Diagnostic Tools**
   • Use multimeter for measurements
   • Check with oscilloscope
   • Monitor system logs
    `;
  };

  const handlePredefinedQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with pattern matching
    setTimeout(() => {
      let response = '';
      const matchedResponse = matchUserInput(message);
      
      // Add context about what the AI understood
      let contextNote = `\n\n💡 *I detected you're asking about ${matchedResponse.replace('_', ' ')}*`;

      switch (matchedResponse) {
        case 'system_status':
          response = `${getSystemStatus()}\n\n${getConnectionDetails()}${contextNote}`;
          break;
          
        case 'connection_details':
          response = `${getConnectionDetails()}${contextNote}`;
          break;
          
        case 'diagnose_faults':
          response = `**Diagnosis Report:**\n\n${getSystemStatus()}\n\n${getFaultSolutions(hardwareDetails.faultStatus)}${contextNote}`;
          break;
          
        case 'voltage_analysis':
          response = `**Voltage Analysis:**\n\nCurrent: ${hardwareDetails.currentVoltage.toFixed(2)}V\n\n${getFaultSolutions('Voltage Drop')}${contextNote}`;
          break;
          
        case 'temperature_analysis':
          response = `**Temperature Analysis:**\n\nCurrent: ${hardwareDetails.currentTemperature.toFixed(1)}°C\n\n${getFaultSolutions('Overheated')}${contextNote}`;
          break;
          
        case 'fix_solutions':
          response = `${getFaultSolutions(hardwareDetails.faultStatus)}${contextNote}`;
          break;
          
        case 'optimization_tips':
          response = `
**🚀 System Optimization Tips:**

1. **Power Optimization**
   • Use efficient voltage regulators
   • Implement sleep modes
   • Optimize clock speeds

2. **Thermal Management**
   • Improve PCB layout for heat dissipation
   • Add thermal vias
   • Use appropriate copper weight

3. **Signal Integrity**
   • Proper grounding techniques
   • Decoupling capacitor placement
   • Trace width optimization

4. **Monitoring**
   • Implement predictive maintenance
   • Set up alert thresholds
   • Regular calibration checks
          ${contextNote}`;
          break;
          
        case 'refresh_data':
          refreshData();
          response = "🔄 Refreshing hardware data... Check the updated readings above.";
          break;
          
        case 'simulation_control':
          const lowerMessage = message.toLowerCase();
          if (lowerMessage.includes('overheat')) {
            setSimulationScenario('overheating');
            response = "🔥 Switching to overheating scenario...";
          } else if (lowerMessage.includes('voltage')) {
            setSimulationScenario('voltage_drop');
            response = "⚡ Switching to voltage drop scenario...";
          } else if (lowerMessage.includes('broken')) {
            setSimulationScenario('broken_trace');
            response = "🔧 Switching to broken trace scenario...";
          } else {
            setSimulationScenario('normal');
            response = "✅ Switching to normal operation scenario...";
          }
          response += contextNote;
          break;
          
        default:
          response = `I understand you're asking about the PCB system. I can help you with:\n\n• Current system status and readings\n• Hardware connection details\n• Fault diagnosis and repair solutions\n• System optimization tips\n• Simulation control\n\nTry asking about specific issues like voltage problems, overheating, or connection status.\n\n💡 *Try using more specific keywords like "voltage", "temperature", or "connection" for better assistance.*`;
          break;
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle scroll behavior
  const handleScroll = () => {
    // You can add custom scroll behavior here if needed
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-white">Self Healing PCB AI Assistant</h3>
              <p className="text-xs text-gray-400">Intelligent Hardware Diagnostics & Support</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Container with proper scrolling */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.isBot
                    ? 'bg-gray-800 text-white rounded-bl-none'
                    : 'bg-blue-500 text-white rounded-br-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.isBot ? (
                    <Bot className="w-4 h-4 text-green-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-300" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl rounded-bl-none p-3 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-3 border-t border-gray-700 bg-gray-900 rounded-b-2xl">
          <div className="flex overflow-x-auto pb-2 mb-3 gap-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedQuestion(question)}
                className="flex-shrink-0 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about hardware status, faults, or solutions..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};