'use client';

import React, { useMemo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TripProgressProps {
  progress: number; // 0-100
  completedStops: number;
  remainingStops: number;
  totalStops: number;
  completedDistance: number; // meters
  remainingDistance: number; // meters
  totalDistance: number; // meters
  status?: 'moving' | 'stopped' | 'boarding' | 'waiting' | 'delayed' | 'traffic' | 'completed';
  className?: string;
}

export default function TripProgress({
  progress,
  completedStops,
  remainingStops,
  totalStops,
  completedDistance,
  remainingDistance,
  totalDistance,
  status = 'moving',
  className,
}: TripProgressProps) {
  // Calculate formatted distances
  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Status colors
  const statusColors: Record<string, string> = {
    moving: 'bg-green-500',
    stopped: 'bg-gray-500',
    boarding: 'bg-yellow-500',
    waiting: 'bg-orange-500',
    delayed: 'bg-red-500',
    traffic: 'bg-amber-500',
    completed: 'bg-emerald-500',
  };
  const statusColor = statusColors[status] || 'bg-blue-500';

  return (
    <div className={cn(
      'bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Trip Progress</h3>
        <div className="text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={cn('h-full rounded-full transition-all duration-500', statusColor)}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Completed Stops</div>
          <div className="text-lg font-bold text-gray-800">
            {completedStops} <span className="text-xs text-gray-500">/ {totalStops}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Remaining Stops</div>
          <div className="text-lg font-bold text-gray-800">
            {remainingStops} <span className="text-xs text-gray-500">/ {totalStops}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Completed</div>
          <div className="text-lg font-bold text-gray-800">{formatDistance(completedDistance)}</div>
        </div>

        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Remaining</div>
          <div className="text-lg font-bold text-gray-800">{formatDistance(remainingDistance)}</div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-200">
        <div className={cn('w-2 h-2 rounded-full', statusColor)} />
        <div className="text-sm text-gray-700">
          Status: <span className="font-semibold capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
}
