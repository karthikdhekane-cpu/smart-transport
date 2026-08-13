'use client';

import React, { useMemo } from 'react';
import { GPSPosition, VehicleStatus } from '../../types';

interface BusMarkerProps {
  position: GPSPosition;
  busId: string;
  busNumber: string;
  status: VehicleStatus;
  color: string;
  isCurrent?: boolean;
  onClick?: (busId: string) => void;
  showLabel?: boolean;
}

// Status colors
const statusColors: Record<VehicleStatus, string> = {
  moving: '#00C853',
  stopped: '#607D8B',
  boarding: '#FFD700',
  waiting: '#FFA000',
  delayed: '#F44336',
  traffic: '#FF9800',
  completed: '#4CAF50',
  offline: '#9E9E9E',
};

// Status pulse animation
const getStatusAnimation = (status: VehicleStatus) => {
  switch (status) {
    case 'delayed':
    case 'traffic':
      return 'animate-pulse-fast';
    case 'boarding':
      return 'animate-bounce-slow';
    case 'offline':
      return 'animate-fade-out';
    default:
      return 'animate-pulse-slow';
  }
};

export default function BusMarker({
  position,
  busId,
  busNumber,
  status,
  color,
  isCurrent = false,
  onClick,
  showLabel = true,
}: BusMarkerProps) {
  const statusColor = useMemo(() => statusColors[status] || color, [status, color]);
  
  const handleMarkerClick = () => {
    if (onClick) {
      onClick(busId);
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${getStatusAnimation(status)}`}
      onClick={handleMarkerClick}
      style={{
        transform: `translate(-50%, -50%) rotate(${position.heading || 0}deg)`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Status indicator ring */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          backgroundColor: statusColor,
          boxShadow: `0 0 20px ${statusColor}`,
          animation: 'pulse-ring 2s cubic-bezier(0.215,0.61,0.355,1) infinite',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />

      {/* Bus marker body */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: color,
          borderRadius: '50%',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Bus icon */}
        <span className="text-2xl animate-float">
          🚌
        </span>

        {/* Current indicator dot */}
        {isCurrent && (
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
            style={{
              backgroundColor: statusColor,
              boxShadow: '0 0 8px currentColor',
            }}
          />
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap shadow-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"
          style={{
            minWidth: '60px',
            textAlign: 'center',
          }}
        >
          <div
            className="text-[10px] font-bold"
            style={{ color: statusColor }}
          >
            {status}
          </div>
          <div className="text-gray-700 text-xs">
            {busNumber}
          </div>
        </div>
      )}
    </div>
  );
}
