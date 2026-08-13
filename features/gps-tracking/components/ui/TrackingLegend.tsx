'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrackingLegendProps {
  className?: string;
  showGPSStatus?: boolean;
  showRouteColors?: boolean;
  showStopStatus?: boolean;
}

export default function TrackingLegend({
  className,
  showGPSStatus = true,
  showRouteColors = true,
  showStopStatus = true,
}: TrackingLegendProps) {
  return (
    <div className={cn(
      'bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 max-w-xs',
      className
    )}>
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-lg">📋</span>
        Tracking Legend
      </h3>

      {/* Bus Status */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-semibold text-gray-600 uppercase">Bus Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-700">Stopped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-700">Boarding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">Waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-700">Delayed/Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-700">GPS Offline</span>
          </div>
        </div>
      </div>

      {/* Route Colors */}
      {showRouteColors && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-600 uppercase">Routes</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-700">Route A — Gandhipuram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-yellow-500" />
              <span className="text-gray-700">Route B — RS Puram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-blue-500" />
              <span className="text-gray-700">Route C — Peelamedu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-orange-500" />
              <span className="text-gray-700">Route D — Singanallur</span>
            </div>
          </div>
        </div>
      )}

      {/* Stop Status */}
      {showStopStatus && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-600 uppercase">Stop Status</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-700">Current (Pulsing)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-gray-700">Upcoming</span>
            </div>
          </div>
        </div>
      )}

      {/* GPS History */}
      {showGPSStatus && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">GPS History</h4>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 rounded-full bg-purple-500" />
            <span className="text-xs text-gray-700">Last 100 positions (dashed)</span>
          </div>
        </div>
      )}
    </div>
  );
}
