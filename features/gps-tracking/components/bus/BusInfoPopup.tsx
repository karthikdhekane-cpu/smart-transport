'use client';

import React, { useMemo } from 'react';
import { GPSPosition, VehicleStatus } from '../../types';
import { formatDistance, formatSpeed } from '../../utils/math';
import useBusETA from '../../hooks/useBusETA';
import useBusRoute from '../../hooks/useBusRoute';

interface BusInfoPopupProps {
  busId: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupancy: number;
  status: VehicleStatus;
  color: string;
  position: GPSPosition;
  currentSpeed: number;
  averageSpeed: number;
  batteryLevel: number;
  currentStop?: string;
  nextStop?: string;
  remainingDistance?: number;
  eta?: string;
  onClose?: () => void;
}

export default function BusInfoPopup({
  busId,
  busNumber,
  driverName,
  driverPhone,
  capacity,
  occupancy,
  status,
  color,
  position,
  currentSpeed,
  averageSpeed,
  batteryLevel,
  currentStop,
  nextStop,
  remainingDistance,
  eta,
  onClose,
}: BusInfoPopupProps) {
  const { etaSeconds, etaText, estimatedArrival, isEstimating } = useBusETA(busId);
  const { route, nextStop: routeNextStop, previousStop } = useBusRoute(busId);
  
  const nextStopName = nextStop || routeNextStop?.name || 'N/A';
  const currentStopName = currentStop || previousStop?.name || 'N/A';
  
  const statusColors: Record<VehicleStatus, string> = {
    moving: 'bg-green-500',
    stopped: 'bg-gray-500',
    boarding: 'bg-yellow-500',
    waiting: 'bg-orange-500',
    delayed: 'bg-red-500',
    traffic: 'bg-amber-500',
    completed: 'bg-emerald-500',
    offline: 'bg-gray-400',
  };
  
  const statusColor = statusColors[status] || 'bg-gray-500';

  return (
    <div className="w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
      {/* Header */}
      <div
        className="px-4 py-3 text-white flex items-center justify-between"
        style={{ backgroundColor: color }}
      >
        <div>
          <div className="text-lg font-bold flex items-center gap-2">
            🚌 {busNumber}
          </div>
          <div className="text-xs opacity-90">{driverName}</div>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-semibold ${statusColor} text-white shadow-sm`}
        >
          {status.toUpperCase()}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Status indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">Speed</div>
          <div className="font-semibold text-gray-800">
            {formatSpeed(currentSpeed)} (Avg: {formatSpeed(averageSpeed)})
          </div>
        </div>

        {/* Route info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📍</span>
            <span className="text-gray-600">Current Stop:</span>
            <span className="font-medium text-gray-800">{currentStopName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">➡️</span>
            <span className="text-gray-600">Next Stop:</span>
            <span className="font-medium text-gray-800">{nextStopName}</span>
          </div>
        </div>

        {/* ETA */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">ETA</div>
          <div className="font-semibold text-blue-600">
            {isEstimating ? 'Calculating...' : etaText}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Occupancy</span>
            <span className="font-semibold text-gray-800">{occupancy}/{capacity} ({Math.round((occupancy/capacity)*100)}%)</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(occupancy/capacity)*100}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        {/* GPS info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500 mb-1">Latitude</div>
            <div className="font-mono text-gray-700">{position.lat.toFixed(5)}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500 mb-1">Longitude</div>
            <div className="font-mono text-gray-700">{position.lng.toFixed(5)}</div>
          </div>
        </div>

        {/* Driver info */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Driver Contact</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{driverPhone}</span>
            <button className="text-blue-600 text-xs hover:underline">
              Call
            </button>
          </div>
        </div>

        {/* Battery */}
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-600">Battery</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-gray-700">
              <span>{batteryLevel}%</span>
              <span className={`w-2 h-2 rounded-full ${batteryLevel > 50 ? 'bg-green-500' : batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {onClose && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}
