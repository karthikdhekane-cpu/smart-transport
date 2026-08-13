// ETACard Component - Display ETA information for a bus
import React, { memo } from 'react';
import { BusETAState } from '../types';
import { formatSpeed, formatDistance } from '../utils/math';

interface ETACardProps {
  busState: BusETAState;
  className?: string;
  onClick?: () => void;
}

const ETACard = React.memo(function ETACard({
  busState,
  className = '',
  onClick,
}: ETACardProps) {
  const { currentETA, routeInfo, status, traffic, delay, speed, currentStop, nextStop } = busState;

  const getStatusColor = () => {
    switch (status) {
      case 'on-time': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'approaching': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'arriving': return 'bg-[#FF5722]/20 text-[#FF5722]';
      case 'waiting': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'delayed': return 'bg-[#FF9800]/20 text-[#FF9800]';
      case 'heavy-traffic': return 'bg-[#f44336]/20 text-[#f44336]';
      case 'completed': return 'bg-[#607D8B]/20 text-[#607D8B]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'on-time': return '✅';
      case 'approaching': return '➡️';
      case 'arriving': return '🚌';
      case 'waiting': return '⏸️';
      case 'delayed': return '⚠️';
      case 'heavy-traffic': return '🚧';
      case 'completed': return '🏁';
      default: return '?';
    }
  };

  const formatETA = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  if (!busState) {
    return (
      <div className={`glass rounded-2xl p-4 text-center ${className}`}>
        <p className="text-gray-400">No bus data available</p>
      </div>
    );
  }

  return (
    <div 
      className={`glass rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gray-100">
            🚌
          </div>
          <div>
            <div className="font-bold text-white text-sm">{routeInfo.name}</div>
            <div className="text-xs text-gray-400">{currentStop?.name || 'Unknown'}</div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor()}`}>
          {getStatusIcon()} {status}
        </span>
      </div>

      {/* ETA Display */}
      <div className="flex items-end gap-2 mb-3">
        <div className="text-3xl font-black neon-text">
          {formatETA(currentETA.seconds)}
        </div>
        <div className="text-sm text-gray-400 mb-1">
          to {nextStop?.name || 'destination'}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">Speed</div>
          <div className="text-sm font-bold text-white">{formatSpeed(speed)}</div>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">Progress</div>
          <div className="text-sm font-bold text-white">{Math.round(routeInfo.progressPercentage)}%</div>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">Traffic</div>
          <div className={`text-xs font-bold ${traffic.config.color}`}>{traffic.config.name}</div>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">Delay</div>
          <div className="text-xs font-bold text-gray-300">{delay.minutes} min</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ 
            width: `${routeInfo.progressPercentage}%`, 
            background: routeInfo.color 
          }} 
        />
      </div>
    </div>
  );
});

export default ETACard;
