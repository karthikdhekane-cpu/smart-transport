// StatusBadge Component - Display bus status
import React, { memo } from 'react';
import { BusStatus } from '../types';

interface StatusBadgeProps {
  status: BusStatus;
  className?: string;
}

const StatusBadge = React.memo(function StatusBadge({
  status,
  className = '',
}: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'on-time': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'approaching': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'arriving': return 'bg-[#FF5722]/20 text-[#FF5722]';
      case 'waiting': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'departed': return 'bg-[#9E9E9E]/20 text-[#9E9E9E]';
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
      case 'departed': return '✓';
      case 'delayed': return '⚠️';
      case 'heavy-traffic': return '🚧';
      case 'completed': return '🏁';
      default: return '?';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'approaching': return 'Approaching';
      case 'arriving': return 'Arriving';
      case 'waiting': return 'Waiting';
      case 'departed': return 'Departed';
      case 'delayed': return 'Delayed';
      case 'heavy-traffic': return 'Heavy Traffic';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${getStatusColor()} ${className}`}>
      <span>{getStatusIcon()}</span>
      <span className="font-semibold">{getStatusText()}</span>
    </div>
  );
});

export default StatusBadge;
