import React, { useState } from 'react';
import { Settings as SettingsIcon, Wifi, Bluetooth, Server, Bell } from 'lucide-react';
import { Button, Input, Label, Switch } from '../components/ui-components';
import { toast } from 'sonner';
import { Navigation } from '../components/layout-component';

const Settings = () => {
  const [apiUrl, setApiUrl] = useState('https://neuropcb-server.onrender.com');
  const [connectionMode, setConnectionMode] = useState('WiFi');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-4xl font-bold text-gradient">Settings</h1>
              <p className="text-gray-400">Configure your NeuroPCB AI preferences</p>
            </div>
          </div>

          {/* Connection Settings */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Connection Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="api-url" className="text-white">Backend API URL</Label>
                <Input
                  id="api-url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="mt-2"
                  placeholder="https://neuropcb-server.onrender.com"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the URL of your NeuroPCB backend server
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-600">
                <div className="flex items-center gap-3">
                  {connectionMode === 'BLE' ? (
                    <Bluetooth className="w-5 h-5 text-green-400" />
                  ) : (
                    <Wifi className="w-5 h-5 text-cyan-400" />
                  )}
                  <div>
                    <p className="font-medium text-white">Connection Mode</p>
                    <p className="text-sm text-gray-400">
                      {connectionMode === 'BLE' ? 'Bluetooth Low Energy' : 'Wi-Fi Network'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={connectionMode === 'WiFi' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConnectionMode('WiFi')}
                  >
                    Wi-Fi
                  </Button>
                  <Button
                    variant={connectionMode === 'BLE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConnectionMode('BLE')}
                  >
                    BLE
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">AI & Diagnostics</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-600">
                <div>
                  <p className="font-medium text-white">AI Diagnostic Mode</p>
                  <p className="text-sm text-gray-400">
                    Enable real-time AI fault analysis and suggestions
                  </p>
                </div>
                <Switch checked={aiEnabled} onChange={setAiEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-600">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-gray-400">
                      Get alerts for critical faults and system issues
                    </p>
                  </div>
                </div>
                <Switch checked={notificationsEnabled} onChange={setNotificationsEnabled} />
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-green-400">
            <h3 className="font-semibold mb-2 text-green-400">Mobile App Coming Soon</h3>
            <p className="text-sm text-gray-400">
              This web app can be converted to a native mobile application with Bluetooth support using Capacitor. 
              Contact support for mobile deployment instructions.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="bg-green-600 text-white hover:bg-green-700">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;