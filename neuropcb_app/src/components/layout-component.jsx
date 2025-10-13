import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Brain, AlertTriangle,BarChart3, Info, CheckCircle, Wifi, Bluetooth, WifiOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from './ui-components';

// Navigation Component
export const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto glass-card border-t md:border-b md:border-t-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 py-4">
          {links.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                location.pathname === path
                  ? 'bg-primary text-primary-foreground glow-green'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

// AI Advisor Component
export const AIAdvisor = ({ suggestion, severity }) => {
  const severityConfig = {
    low: {
      icon: CheckCircle,
      color: 'text-[hsl(var(--neon-green))]',
      bg: 'bg-[hsl(var(--neon-green))]/10',
      border: 'border-[hsl(var(--neon-green))]',
      glow: 'glow-green'
    },
    medium: {
      icon: Info,
      color: 'text-[hsl(var(--neon-cyan))]',
      bg: 'bg-[hsl(var(--neon-cyan))]/10',
      border: 'border-[hsl(var(--neon-cyan))]',
      glow: 'glow-cyan'
    },
    high: {
      icon: AlertTriangle,
      color: 'text-[hsl(var(--neon-red))]',
      bg: 'bg-[hsl(var(--neon-red))]/10',
      border: 'border-[hsl(var(--neon-red))]',
      glow: 'glow-red'
    }
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={cn(
      'glass-card rounded-2xl p-6 border-2 animate-slide-up',
      config.border,
      severity === 'high' && 'animate-pulse-glow',
      severity !== 'low' && config.glow
    )}>
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl', config.bg)}>
          <Brain className={cn('w-8 h-8', config.color)} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-lg font-bold', config.color)}>🧠 AI Diagnostic</h3>
            <Icon className={cn('w-5 h-5', config.color)} />
          </div>
          <p className="text-foreground/90 leading-relaxed">{suggestion}</p>
          <div className="flex items-center gap-2 pt-2">
            <div className={cn('w-2 h-2 rounded-full animate-pulse-glow', config.bg, config.border, 'border')} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {severity === 'high' ? 'Critical Alert' : severity === 'medium' ? 'Warning' : 'System Normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connection Status Component
export const ConnectionStatus = ({ mode, isConnected }) => {
  const Icon = mode === 'BLE' ? Bluetooth : mode === 'Wi-Fi' ? Wifi : WifiOff;
  
  return (
    <div className={cn(
      'glass-card rounded-full px-4 py-2 flex items-center gap-2 border-2 transition-all',
      isConnected 
        ? 'border-[hsl(var(--neon-green))] glow-green' 
        : 'border-[hsl(var(--neon-red))] glow-red'
    )}>
      <Icon className={cn(
        'w-4 h-4',
        isConnected ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-red))]'
      )} />
      <span className={cn(
        'text-sm font-medium',
        isConnected ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-red))]'
      )}>
        {isConnected ? mode : 'Disconnected'}
      </span>
      <div className={cn(
        'w-2 h-2 rounded-full animate-pulse-glow',
        isConnected ? 'bg-[hsl(var(--neon-green))]' : 'bg-[hsl(var(--neon-red))]'
      )} />
    </div>
  );
};

// Data Chart Component
export const DataChart = ({ data, dataKey, color, label }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Gauge Component
export const Gauge = ({ 
  value, 
  min, 
  max, 
  label, 
  unit, 
  color = 'green',
  warningThreshold,
  criticalThreshold 
}) => {
  const [displayValue, setDisplayValue] = useState(min);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value]);

  const percentage = Math.min(Math.max(((displayValue - min) / (max - min)) * 100, 0), 100);
  const angle = (percentage / 100) * 180 - 90;
  
  const getColor = () => {
    if (criticalThreshold && displayValue >= criticalThreshold) return 'red';
    if (warningThreshold && displayValue >= warningThreshold) return 'cyan';
    return color;
  };

  const currentColor = getColor();
  const colorClass = {
    green: 'text-[hsl(var(--neon-green))]',
    cyan: 'text-[hsl(var(--neon-cyan))]',
    red: 'text-[hsl(var(--neon-red))]'
  }[currentColor];

  const glowClass = {
    green: 'glow-green',
    cyan: 'glow-cyan',
    red: 'glow-red'
  }[currentColor];

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</h3>
      </div>
      
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            strokeDasharray="267 267"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke={`hsl(var(--neon-${currentColor}))`}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 267} 267`}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${glowClass}`}
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--neon-${currentColor})))`
            }}
          />
        </svg>
        
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom transition-transform duration-700"
          style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
        >
          <div className={`w-full h-full bg-gradient-to-t from-${currentColor === 'green' ? 'primary' : currentColor === 'cyan' ? 'secondary' : 'destructive'} to-transparent rounded-full ${glowClass}`} />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${colorClass} transition-colors`}>
            {displayValue.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{unit}</div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground px-4">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

// Status Card Component
export const StatusCard = ({ title, value, icon, status = 'normal', subtitle }) => {
  const statusColors = {
    normal: 'border-[hsl(var(--neon-green))] text-[hsl(var(--neon-green))]',
    warning: 'border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]',
    critical: 'border-[hsl(var(--neon-red))] text-[hsl(var(--neon-red))]'
  };

  const glowColors = {
    normal: 'glow-green',
    warning: 'glow-cyan',
    critical: 'glow-red'
  };

  return (
    <div className={cn(
      'glass-card rounded-xl p-4 border-l-4 transition-all duration-300',
      statusColors[status],
      status !== 'normal' && glowColors[status]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', statusColors[status])}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-2 rounded-lg', statusColors[status])}>
          {icon}
        </div>
      </div>
    </div>
  );
};