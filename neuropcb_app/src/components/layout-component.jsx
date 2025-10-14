import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Brain, AlertTriangle, BarChart3, Info, CheckCircle, Wifi, Bluetooth, WifiOff, Menu, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from './ui-components';

// Navigation Component
export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto glass-card border-t md:border-b md:border-t-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center py-3">
          <div className="text-white font-bold text-lg">Self Healing PCB</div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-start md:gap-8 py-4">
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
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="space-y-2">
              {links.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full',
                    location.pathname === path
                      ? 'bg-primary text-primary-foreground glow-green'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
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
      'glass-card rounded-2xl p-4 md:p-6 border-2 animate-slide-up',
      config.border,
      severity === 'high' && 'animate-pulse-glow',
      severity !== 'low' && config.glow
    )}>
      <div className="flex items-start gap-3 md:gap-4">
        <div className={cn('p-2 md:p-3 rounded-xl', config.bg)}>
          <Brain className={cn('w-6 h-6 md:w-8 md:h-8', config.color)} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-base md:text-lg font-bold', config.color)}>🧠 AI Diagnostic</h3>
            <Icon className={cn('w-4 h-4 md:w-5 md:h-5', config.color)} />
          </div>
          <p className="text-foreground/90 leading-relaxed text-sm md:text-base">{suggestion}</p>
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
      'glass-card rounded-full px-3 py-1 md:px-4 md:py-2 flex items-center gap-2 border-2 transition-all',
      isConnected 
        ? 'border-[hsl(var(--neon-green))] glow-green' 
        : 'border-[hsl(var(--neon-red))] glow-red'
    )}>
      <Icon className={cn(
        'w-3 h-3 md:w-4 md:h-4',
        isConnected ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-red))]'
      )} />
      <span className={cn(
        'text-xs md:text-sm font-medium',
        isConnected ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-red))]'
      )}>
        {isConnected ? mode : 'Disconnected'}
      </span>
      <div className={cn(
        'w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse-glow',
        isConnected ? 'bg-[hsl(var(--neon-green))]' : 'bg-[hsl(var(--neon-red))]'
      )} />
    </div>
  );
};

// Data Chart Component
export const DataChart = ({ data, dataKey, color, label, height = 200 }) => {
  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '10px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '10px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`
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
  criticalThreshold,
  size = 'normal' // 'normal' or 'small'
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

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-32 h-32',
      text: 'text-2xl',
      label: 'text-xs',
      strokeWidth: '6'
    },
    normal: {
      container: 'w-48 h-48',
      text: 'text-4xl',
      label: 'text-sm',
      strokeWidth: '8'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4">
      <div className="text-center">
        <h3 className={cn('font-medium text-muted-foreground uppercase tracking-wider', config.label)}>
          {label}
        </h3>
      </div>
      
      <div className={cn('relative mx-auto', config.container)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={config.strokeWidth}
            strokeDasharray="267 267"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke={`hsl(var(--neon-${currentColor}))`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${(percentage / 100) * 267} 267`}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${glowClass}`}
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--neon-${currentColor})))`
            }}
          />
        </svg>
        
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-16 md:h-20 origin-bottom transition-transform duration-700"
          style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
        >
          <div className={`w-full h-full bg-gradient-to-t from-${currentColor === 'green' ? 'primary' : currentColor === 'cyan' ? 'secondary' : 'destructive'} to-transparent rounded-full ${glowClass}`} />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('font-bold transition-colors', config.text, colorClass)}>
            {displayValue.toFixed(1)}
          </div>
          <div className={cn('text-muted-foreground mt-1', size === 'small' ? 'text-xs' : 'text-sm')}>
            {unit}
          </div>
        </div>
      </div>
      
      <div className={cn('flex justify-between text-muted-foreground px-2 md:px-4', size === 'small' ? 'text-xs' : 'text-sm')}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

// Status Card Component
export const StatusCard = ({ title, value, icon, status = 'normal', subtitle, size = 'normal' }) => {
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

  const sizeConfig = {
    small: {
      title: 'text-xs',
      value: 'text-lg',
      subtitle: 'text-xs',
      icon: 'p-1 rounded',
      iconSize: 'w-4 h-4'
    },
    normal: {
      title: 'text-xs',
      value: 'text-2xl',
      subtitle: 'text-xs',
      icon: 'p-2 rounded-lg',
      iconSize: 'w-6 h-6'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn(
      'glass-card rounded-xl p-3 md:p-4 border-l-4 transition-all duration-300',
      statusColors[status],
      status !== 'normal' && glowColors[status]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn('text-muted-foreground uppercase tracking-wider mb-1', config.title)}>
            {title}
          </p>
          <p className={cn('font-bold', statusColors[status], config.value)}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-muted-foreground mt-1', config.subtitle)}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn(statusColors[status], config.icon)}>
          {React.cloneElement(icon, { className: config.iconSize })}
        </div>
      </div>
    </div>
  );
};