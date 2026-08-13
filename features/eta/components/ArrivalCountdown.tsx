// ArrivalCountdown Component - Live countdown to arrival
import React, { useState, useEffect, memo } from 'react';

interface ArrivalCountdownProps {
  etaSeconds: number;
  showSeconds?: boolean;
  className?: string;
}

const ArrivalCountdown = React.memo(function ArrivalCountdown({
  etaSeconds,
  showSeconds = false,
  className = '',
}: ArrivalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(etaSeconds);

  useEffect(() => {
    setTimeLeft(etaSeconds);
  }, [etaSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return showSeconds ? `${seconds}s` : '0m';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className={`text-lg font-black neon-text ${className}`}>
      {formatTime(timeLeft)}
    </div>
  );
});

export default ArrivalCountdown;
