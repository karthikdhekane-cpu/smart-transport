'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CurrentStopCardProps {
  stopName: string;
  eta: string;
  distance: string;
  studentsWaiting?: number;
  arrivalStatus: 'on-time' | 'delayed' | 'early';
  className?: string;
}

export default function CurrentStopCard({
  stopName,
  eta,
  distance,
  studentsWaiting = 0,
  arrivalStatus,
  className,
}: CurrentStopCardProps) {
  const getStatusColor = () => {
    switch (arrivalStatus) {
      case 'on-time':
        return 'bg-green-500 text-white';
      case 'delayed':
        return 'bg-red-500 text-white';
      case 'early':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = () => {
    switch (arrivalStatus) {
      case 'on-time':
        return '✓';
      case 'delayed':
        return '⚠';
      case 'early':
        return '⚡';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      'bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl',
      className
    )}>
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: getStatusColor() }}
      >
        <div>
          <div className="text-xs opacity-90">Current Stop</div>
          <div className="font-bold text-lg">{stopName}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-lg',
            arrivalStatus === 'delayed' ? 'bg-red-600' : 'bg-white/20'
          )}>
            {getStatusIcon()}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* ETA */}
        <div className="flex items-center justify-between">
          <div className="text-gray-600 text-sm">Estimated Arrival</div>
          <div className="font-bold text-lg text-blue-600">{eta}</div>
        </div>

        {/* Distance */}
        <div className="flex items-center justify-between">
          <div className="text-gray-600 text-sm">Distance</div>
          <div className="font-semibold text-gray-800">{distance}</div>
        </div>

        {/* Students waiting */}
        {studentsWaiting > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">Students Waiting</div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold">
                {studentsWaiting}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
