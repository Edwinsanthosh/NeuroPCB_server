import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Wifi, 
  Bluetooth, 
  Server, 
  Bell, 
  Scan, 
  Link, 
  Unlink,
  RefreshCw,
  Signal,
  Battery,
  Cpu,
  Shield,
  Zap,
  Database,
  Smartphone,
  Radio
} from 'lucide-react';
import { Button, Input, Label, Switch } from '../components/ui-components';
import { toast } from 'sonner';
import { Navigation } from '../components/layout-component';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Card component since it's not in ui-components
const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-700/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Settings = () => {
  const [apiUrl, setApiUrl] = useState('https://neuropcb-server.onrender.com');
  const [connectionMode, setConnectionMode] = useState('WiFi');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState(30);
  
  // BLE States
  const [bleDevices, setBleDevices] = useState([]);
  const [isScanningBLE, setIsScanningBLE] = useState(false);
  const [connectedBleDevice, setConnectedBleDevice] = useState(null);
  
  // Wi-Fi States
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [isScanningWifi, setIsScanningWifi] = useState(false);
  const [connectedWifi, setConnectedWifi] = useState(null);
  const [wifiPassword, setWifiPassword] = useState('');
  
  // Device connection states
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if Web Bluetooth API is available
  const isWebBluetoothAvailable = () => {
    return navigator.bluetooth && navigator.bluetooth.requestDevice;
  };

  // Scan for BLE Devices
  const scanBLEDevices = async () => {
    if (!isWebBluetoothAvailable()) {
      toast.error('Web Bluetooth not supported', {
        description: 'Your browser does not support Web Bluetooth API. Try Chrome or Edge.',
      });
      return;
    }

    setIsScanningBLE(true);
    setBleDevices([]);

    try {
      // Simulate BLE device discovery
      const mockDevices = [
        { 
          id: 'ble-1', 
          name: 'NeuroPCB-001', 
          rssi: -45, 
          connected: false, 
          type: 'PCB Monitor',
          battery: 85,
          version: 'v2.1.4'
        },
        { 
          id: 'ble-2', 
          name: 'NeuroPCB-002', 
          rssi: -62, 
          connected: false, 
          type: 'Sensor Hub',
          battery: 72,
          version: 'v2.0.8'
        },
        { 
          id: 'ble-3', 
          name: 'ESP32_Device', 
          rssi: -55, 
          connected: false, 
          type: 'Development Board',
          battery: 45,
          version: 'v1.5.2'
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 2000));
      setBleDevices(mockDevices);
      
      toast.success('BLE Scan Complete', {
        description: `Found ${mockDevices.length} devices`,
      });
    } catch (error) {
      toast.error('BLE Scan Failed', {
        description: error.message,
      });
    } finally {
      setIsScanningBLE(false);
    }
  };

  // Connect to BLE Device
  const connectToBLEDevice = async (device) => {
    if (!isWebBluetoothAvailable()) {
      toast.error('Web Bluetooth not available');
      return;
    }

    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnectedBleDevice(device);
      setBleDevices(prev => prev.map(d => 
        d.id === device.id ? { ...d, connected: true } : d
      ));
      
      toast.success('Connected to BLE Device', {
        description: `Connected to ${device.name}`,
      });
    } catch (error) {
      toast.error('Connection Failed', {
        description: `Could not connect to ${device.name}`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect BLE Device
  const disconnectBLEDevice = async () => {
    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBleDevices(prev => prev.map(d => 
        d.id === connectedBleDevice.id ? { ...d, connected: false } : d
      ));
      setConnectedBleDevice(null);
      
      toast.info('Disconnected from BLE Device', {
        description: `Disconnected from ${connectedBleDevice.name}`,
      });
    } catch (error) {
      toast.error('Disconnection Failed', {
        description: 'Failed to disconnect device',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Scan for Wi-Fi Networks
  const scanWifiNetworks = async () => {
    setIsScanningWifi(true);
    setWifiNetworks([]);

    try {
      // Simulate Wi-Fi network discovery
      const mockNetworks = [
        { 
          id: 'wifi-1', 
          ssid: 'NeuroPCB_Lab', 
          signal: 90, 
          secured: true, 
          connected: false,
          frequency: '5 GHz'
        },
        { 
          id: 'wifi-2', 
          ssid: 'PCB_Development', 
          signal: 75, 
          secured: true, 
          connected: false,
          frequency: '2.4 GHz'
        },
        { 
          id: 'wifi-3', 
          ssid: 'Factory_Network', 
          signal: 60, 
          secured: false, 
          connected: false,
          frequency: '2.4 GHz'
        },
        { 
          id: 'wifi-4', 
          ssid: 'ESP32_AP', 
          signal: 85, 
          secured: true, 
          connected: false,
          frequency: '2.4 GHz'
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 3000));
      setWifiNetworks(mockNetworks);
      
      toast.success('Wi-Fi Scan Complete', {
        description: `Found ${mockNetworks.length} networks`,
      });
    } catch (error) {
      toast.error('Wi-Fi Scan Failed', {
        description: error.message,
      });
    } finally {
      setIsScanningWifi(false);
    }
  };

  // Connect to Wi-Fi Network
  const connectToWifi = async (network) => {
    if (network.secured && !wifiPassword) {
      toast.error('Password Required', {
        description: 'Please enter Wi-Fi password',
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectedWifi(network);
      setWifiNetworks(prev => prev.map(n => 
        n.id === network.id ? { ...n, connected: true } : n
      ));
      
      toast.success('Connected to Wi-Fi', {
        description: `Connected to ${network.ssid}`,
      });
      setWifiPassword('');
    } catch (error) {
      toast.error('Wi-Fi Connection Failed', {
        description: `Could not connect to ${network.ssid}`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Wi-Fi
  const disconnectWifi = async () => {
    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWifiNetworks(prev => prev.map(n => 
        n.id === connectedWifi.id ? { ...n, connected: false } : n
      ));
      setConnectedWifi(null);
      
      toast.info('Disconnected from Wi-Fi', {
        description: `Disconnected from ${connectedWifi.ssid}`,
      });
    } catch (error) {
      toast.error('Disconnection Failed', {
        description: 'Failed to disconnect from Wi-Fi',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.',
    });
  };

  // Signal strength indicator component
  const SignalStrength = ({ strength }) => {
    const bars = Math.ceil(strength / 25);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map(bar => (
          <div
            key={bar}
            className={`w-1 rounded-full transition-all duration-200 ${
              bar <= bars ? 'bg-green-400' : 'bg-gray-600'
            }`}
            style={{ height: `${bar * 4}px` }}
          />
        ))}
      </div>
    );
  };

  // Battery indicator component
  const BatteryIndicator = ({ level }) => {
    const getBatteryColor = (level) => {
      if (level > 70) return 'text-green-400';
      if (level > 30) return 'text-yellow-400';
      return 'text-red-400';
    };

    return (
      <div className="flex items-center gap-1">
        <Battery className={`w-3 h-3 md:w-4 md:h-4 ${getBatteryColor(level)}`} />
        <span className={`text-xs ${getBatteryColor(level)}`}>{level}%</span>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-2xl px-4 md:px-6 py-3 md:py-4">
              <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              <div className="text-left">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-400 text-sm md:text-base">Configure your Self Healing PCB system</p>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Connection Settings */}
            <div className="xl:col-span-2 space-y-6 md:space-y-8">
              {/* Server Configuration */}
              <Card className="p-4 md:p-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="p-2 md:p-3 bg-green-500/10 rounded-xl md:rounded-2xl">
                    <Server className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Server Configuration</h2>
                    <p className="text-gray-400 text-sm md:text-base">Configure your backend server settings</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <Label htmlFor="api-url" className="text-white text-base md:text-lg font-semibold">
                      Backend API URL
                    </Label>
                    <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-3">
                      <Input
                        id="api-url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className="flex-1 text-base md:text-lg py-2 md:py-3 px-3 md:px-4 border-2 border-gray-600 focus:border-green-400 transition-colors"
                        placeholder="https://neuropcb-server.onrender.com"
                      />
                      <Button className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3">
                        Test
                      </Button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                      Enter the URL of your Self Healing PCB backend server
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <Database className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                        <h3 className="font-semibold text-white text-sm md:text-base">Data Retention</h3>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs md:text-sm">Duration</span>
                          <span className="text-white font-semibold text-sm md:text-base">{dataRetention} days</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="365"
                          value={dataRetention}
                          onChange={(e) => setDataRetention(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
                        />
                      </div>
                    </div>

                    <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <h3 className="font-semibold text-white text-sm md:text-base">Security</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-gray-400">SSL Enabled</span>
                          <span className="text-green-400">✅ Active</span>
                        </div>
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-gray-400">API Key</span>
                          <span className="text-cyan-400">🔑 Configured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Connection Methods */}
              <Card className="p-4 md:p-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="p-2 md:p-3 bg-cyan-500/10 rounded-xl md:rounded-2xl">
                    <Radio className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Connection Methods</h2>
                    <p className="text-gray-400 text-sm md:text-base">Choose how to connect to your hardware</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Connection Mode Selector */}
                  <div className="col-span-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 rounded-xl md:rounded-2xl bg-gray-800/50 border-2 border-gray-600 gap-4 md:gap-0">
                      <div className="flex items-center gap-3 md:gap-4">
                        {connectionMode === 'BLE' ? (
                          <div className="p-2 md:p-3 bg-green-500/20 rounded-lg md:rounded-xl">
                            <Bluetooth className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="p-2 md:p-3 bg-cyan-500/20 rounded-lg md:rounded-xl">
                            <Wifi className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white text-base md:text-lg">Connection Mode</p>
                          <p className="text-gray-400 text-sm">
                            {connectionMode === 'BLE' ? 'Bluetooth Low Energy' : 'Wi-Fi Network'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                        <Button
                          variant={connectionMode === 'WiFi' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConnectionMode('WiFi')}
                          className="flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3"
                        >
                          <Wifi className="w-4 h-4 mr-1 md:mr-2" />
                          <span className="text-sm">Wi-Fi</span>
                        </Button>
                        <Button
                          variant={connectionMode === 'BLE' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConnectionMode('BLE')}
                          className="flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3"
                        >
                          <Bluetooth className="w-4 h-4 mr-1 md:mr-2" />
                          <span className="text-sm">BLE</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* BLE Status */}
                    <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <Bluetooth className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <h3 className="font-semibold text-white text-sm md:text-base">Bluetooth Status</h3>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs md:text-sm">Available</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            isWebBluetoothAvailable() 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {isWebBluetoothAvailable() ? 'Supported' : 'Not Supported'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs md:text-sm">Connected</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            connectedBleDevice 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {connectedBleDevice ? connectedBleDevice.name : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wi-Fi Status */}
                    <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <Wifi className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                        <h3 className="font-semibold text-white text-sm md:text-base">Wi-Fi Status</h3>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs md:text-sm">Available</span>
                          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                            Ready
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs md:text-sm">Connected</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            connectedWifi 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {connectedWifi ? connectedWifi.ssid : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Device Management & AI Settings */}
            <div className="space-y-6 md:space-y-8">
              {/* AI Settings */}
              <Card>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="p-1 md:p-2 bg-purple-500/10 rounded-lg md:rounded-xl">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">AI & Intelligence</h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-800/50 border border-gray-700">
                    <div>
                      <p className="font-semibold text-white text-sm md:text-base">AI Diagnostics</p>
                      <p className="text-gray-400 text-xs md:text-sm">Real-time fault analysis</p>
                    </div>
                    <Switch checked={aiEnabled} onChange={setAiEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-800/50 border border-gray-700">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Bell className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                      <div>
                        <p className="font-semibold text-white text-sm md:text-base">Notifications</p>
                        <p className="text-gray-400 text-xs md:text-sm">Alerts & warnings</p>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onChange={setNotificationsEnabled} />
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <Button
                    onClick={scanBLEDevices}
                    disabled={isScanningBLE}
                    variant="outline"
                    className="h-12 md:h-14 border-green-400 text-green-400 hover:bg-green-400/10 text-xs md:text-sm"
                  >
                    {isScanningBLE ? (
                      <RefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                    ) : (
                      <Bluetooth className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                    Scan BLE
                  </Button>
                  <Button
                    onClick={scanWifiNetworks}
                    disabled={isScanningWifi}
                    variant="outline"
                    className="h-12 md:h-14 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 text-xs md:text-sm"
                  >
                    {isScanningWifi ? (
                      <RefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                    ) : (
                      <Wifi className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                    Scan Wi-Fi
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 md:h-14 border-purple-400 text-purple-400 hover:bg-purple-400/10 text-xs md:text-sm"
                  >
                    <Database className="w-3 h-3 md:w-4 md:h-4" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 md:h-14 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 text-xs md:text-sm"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4" />
                    Security
                  </Button>
                </div>
              </Card>

              {/* System Info */}
              <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 border border-cyan-400/20 bg-cyan-400/5">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  <h2 className="text-lg md:text-xl font-bold text-white">System Ready</h2>
                </div>
                <p className="text-cyan-300 text-xs md:text-sm mb-3 md:mb-4">
                  All systems operational. Ready for hardware connections and real-time monitoring.
                </p>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Web Bluetooth</span>
                  <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs">Wi-Fi Ready</span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">AI Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* BLE Devices */}
            <Card>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Bluetooth className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <h2 className="text-lg md:text-xl font-bold text-white">Bluetooth Devices</h2>
                </div>
                <span className="text-xs md:text-sm text-gray-400">{bleDevices.length} found</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {bleDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 ${
                      device.connected
                        ? 'bg-green-500/10 border-green-400/30'
                        : 'bg-gray-800/30 border-gray-600/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 md:gap-3">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <Cpu className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-sm md:text-base truncate">{device.name}</p>
                          <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-400 flex-wrap">
                            <span className="truncate">{device.type}</span>
                            <span>•</span>
                            <SignalStrength strength={Math.abs(device.rssi)} />
                            <span>{device.rssi} dBm</span>
                            <span>•</span>
                            <BatteryIndicator level={device.battery} />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => device.connected ? disconnectBLEDevice() : connectToBLEDevice(device)}
                        disabled={isConnecting}
                        size="sm"
                        variant={device.connected ? "default" : "outline"}
                        className={cn(
                          "flex-shrink-0",
                          device.connected 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "border-green-400 text-green-400 hover:bg-green-400/10"
                        )}
                      >
                        {device.connected ? (
                          <Unlink className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <Link className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                        <span className="hidden md:inline ml-1">
                          {device.connected ? 'Connected' : 'Connect'}
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
                
                {bleDevices.length === 0 && !isScanningBLE && (
                  <div className="text-center py-6 md:py-8 text-gray-400">
                    <Bluetooth className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm">No BLE devices found</p>
                    <p className="text-xs md:text-sm mt-1">Click "Scan BLE" to discover nearby devices</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Wi-Fi Networks */}
            <Card>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Wifi className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  <h2 className="text-lg md:text-xl font-bold text-white">Wi-Fi Networks</h2>
                </div>
                <span className="text-xs md:text-sm text-gray-400">{wifiNetworks.length} found</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {wifiNetworks.map((network) => (
                  <div
                    key={network.id}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 ${
                      network.connected
                        ? 'bg-cyan-500/10 border-cyan-400/30'
                        : 'bg-gray-800/30 border-gray-600/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center justify-between gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <Wifi className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white text-sm md:text-base truncate">{network.ssid}</p>
                            <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-400 flex-wrap">
                              <SignalStrength strength={network.signal} />
                              <span>{network.signal}% signal</span>
                              <span>•</span>
                              <span className="truncate">{network.frequency}</span>
                              <span>•</span>
                              <span>{network.secured ? '🔒 Secured' : '🌐 Open'}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => network.connected ? disconnectWifi() : connectToWifi(network)}
                          disabled={isConnecting}
                          size="sm"
                          variant={network.connected ? "default" : "outline"}
                          className={cn(
                            "flex-shrink-0",
                            network.connected 
                              ? "bg-cyan-500 hover:bg-cyan-600" 
                              : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                          )}
                        >
                          {network.connected ? (
                            <Unlink className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <Link className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                          <span className="hidden md:inline ml-1">
                            {network.connected ? 'Connected' : 'Connect'}
                          </span>
                        </Button>
                      </div>
                      
                      {!network.connected && network.secured && (
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="Enter Wi-Fi password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="flex-1 text-xs md:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {wifiNetworks.length === 0 && !isScanningWifi && (
                  <div className="text-center py-6 md:py-8 text-gray-400">
                    <Wifi className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm">No Wi-Fi networks found</p>
                    <p className="text-xs md:text-sm mt-1">Click "Scan Wi-Fi" to discover available networks</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Save Section */}
          <Card className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-white">Apply Changes</h3>
                <p className="text-gray-400 text-sm">Save your configuration settings</p>
              </div>
              <Button 
                onClick={handleSave} 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-6 md:px-8 py-2 md:py-3 w-full md:w-auto"
              >
                Save Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;