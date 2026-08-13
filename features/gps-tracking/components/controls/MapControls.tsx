'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MapControlsProps {
  followsBus: boolean;
  showRoute: boolean;
  showStops: boolean;
  showHistory: boolean;
  satelliteMode: boolean;
  
  onFollowBus: () => void;
  onToggleRoute: () => void;
  onToggleStops: () => void;
  onToggleHistory: () => void;
  onToggleSatellite: () => void;
  
  className?: string;
}

export default function MapControls({
  followsBus,
  showRoute,
  showStops,
  showHistory,
  satelliteMode,
  
  onFollowBus,
  onToggleRoute,
  onToggleStops,
  onToggleHistory,
  onToggleSatellite,
  
  className,
}: MapControlsProps) {
  return (
    <div className={cn(
      'flex flex-col gap-2 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg',
      className
    )}>
      {/* Follow Bus */}
      <button
        onClick={onFollowBus}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          followsBus
            ? 'bg-blue-500 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title={followsBus ? 'Cancel Follow' : 'Follow Bus'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
      </button>

      {/* Toggle Route */}
      <button
        onClick={onToggleRoute}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          showRoute
            ? 'bg-green-500 text-white shadow-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title="Toggle Route"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </button>

      {/* Toggle Stops */}
      <button
        onClick={onToggleStops}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          showStops
            ? 'bg-yellow-500 text-white shadow-yellow-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title="Toggle Stops"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>

      {/* Toggle History */}
      <button
        onClick={onToggleHistory}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          showHistory
            ? 'bg-purple-500 text-white shadow-purple-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title="Toggle History"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
        </svg>
      </button>

      {/* Toggle Satellite */}
      <button
        onClick={onToggleSatellite}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          satelliteMode
            ? 'bg-blue-500 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title="Toggle Satellite View"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </button>
    </div>
  );
}
