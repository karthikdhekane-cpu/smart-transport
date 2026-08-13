// TrafficBadge Component - Display traffic condition
import React, { memo } from 'react';
import { TrafficLevel, TrafficLevelConfig } from '../types';

interface TrafficBadgeProps {
  level: TrafficLevel;
  config: TrafficLevelConfig;
  className?: string;
}

const TrafficBadge = React.memo(function TrafficBadge({
  level,
  config,
  className = '',
}: TrafficBadgeProps) {
  const getTrafficColor = () => {
    switch (level) {
      case 'very-low': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'low': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'medium': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'high': return 'bg-[#FF9800]/20 text-[#FF9800]';
      case 'heavy': return 'bg-[#f44336]/20 text-[#f44336]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${getTrafficColor()} ${className}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-semibold">{config.name} Traffic</span>
    </div>
  );
});

export default TrafficBadge;
