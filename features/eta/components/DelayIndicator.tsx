// DelayIndicator Component - Display delay information
import React, { memo } from 'react';
import { DelayState } from '../types';

interface DelayIndicatorProps {
  delay: DelayState;
  className?: string;
}

const DelayIndicator = React.memo(function DelayIndicator({
  delay,
  className = '',
}: DelayIndicatorProps) {
  if (!delay.active || delay.minutes <= 0) return null;

  const getDelayColor = () => {
    if (delay.minutes >= 15) return 'bg-red-500/20 text-red-400 animate-pulse';
    if (delay.minutes >= 10) return 'bg-[#FF5722]/20 text-[#FF5722]';
    return 'bg-[#FF9800]/20 text-[#FF9800]';
  };

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${getDelayColor()} ${className}`}>
      <span>⚠️</span>
      <span className="font-semibold">{delay.minutes} min delay</span>
      {delay.reason !== 'none' && (
        <span className="text-gray-400 text-[10px]">
          ({delay.reason === 'traffic' ? 'Traffic' : delay.reason === 'road-work' ? 'Road Work' : delay.reason})
        </span>
      )}
    </div>
  );
});

export default DelayIndicator;
