// ETAChip Component - Compact ETA display
import React, { memo } from 'react';
import { BusStatus } from '../types';

interface ETAChipProps {
  etaSeconds: number;
  status: BusStatus;
  className?: string;
}

const ETAChip = React.memo(function ETAChip({
  etaSeconds,
  status,
  className = '',
}: ETAChipProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'on-time': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'approaching': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'arriving': return 'bg-[#FF5722]/20 text-[#FF5722]';
      case 'delayed': return 'bg-[#FF9800]/20 text-[#FF9800]';
      case 'heavy-traffic': return 'bg-[#f44336]/20 text-[#f44336]';
      case 'waiting': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'completed': return 'bg-[#607D8B]/20 text-[#607D8B]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const formatETA = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor()} ${className}`}>
      {formatETA(etaSeconds)}
    </span>
  );
});

export default ETAChip;
