'use client';

import React from 'react';
import { BusStop } from '../../types';

interface StopMarkerProps {
  stop: BusStop;
  status: 'completed' | 'current' | 'upcoming';
  color: string;
  onClick?: (stop: BusStop) => void;
}

export default function StopMarker({
  stop,
  status,
  color,
  onClick,
}: StopMarkerProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#10b981'; // green-500
      case 'current':
        return '#FFD700'; // yellow-500
      case 'upcoming':
        return '#d1d5db'; // gray-300
      default:
        return color;
    }
  };

  const getStatusSize = () => {
    switch (status) {
      case 'current':
        return 8;
      case 'completed':
        return 5;
      case 'upcoming':
        return 4;
      default:
        return 5;
    }
  };

  const handleMarkerClick = () => {
    if (onClick) {
      onClick(stop);
    }
  };

  return (
    <g
      onClick={handleMarkerClick}
      className="cursor-pointer group transition-all duration-200"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      {/* Status indicator ring */}
      {status === 'current' && (
        <circle
          cx={stop.lng}
          cy={stop.lat}
          r="12"
          fill="none"
          stroke={getStatusColor()}
          strokeWidth="1"
          opacity="0.5"
          className="animate-ping"
        />
      )}
      
      {/* Stop marker */}
      <circle
        cx={stop.lng}
        cy={stop.lat}
        r={getStatusSize()}
        fill={getStatusColor()}
        stroke={status === 'current' ? '#FFD700' : 'transparent'}
        strokeWidth="2"
        className="transition-all duration-300 group-hover:r-6 group-hover:stroke-2"
      />
      
      {/* Tooltip (only for current stop) */}
      {status === 'current' && (
        <g
          style={{
            transform: 'translate(-50%, -24px)',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="group-hover:opacity-100"
        >
          <rect
            x={stop.lng - 25}
            y={stop.lat - 14}
            width="50"
            height="14"
            rx="4"
            fill="white"
            opacity="0.95"
          />
          <text
            x={stop.lng}
            y={stop.lat - 4}
            textAnchor="middle"
            fontSize="9"
            fill="#374151"
            fontWeight="500"
          >
            {stop.name}
          </text>
        </g>
      )}
    </g>
  );
}
