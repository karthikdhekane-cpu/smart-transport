'use client';

import React, { useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export default function PlaybackControls({
  isPlaying,
  speed,
  onPlayPause,
  onRestart,
  onSpeedChange,
  className,
}: PlaybackControlsProps) {
  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
  }, [onSpeedChange]);

  return (
    <div className={cn(
      'flex items-center gap-2 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg',
      className
    )}>
      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          isPlaying
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-green-500 text-white hover:bg-green-600 shadow-green-200'
        )}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Speed selector */}
      <div className="flex items-center gap-1">
        {[1, 2, 4].map((s) => (
          <button
            key={s}
            onClick={() => handleSpeedChange(s)}
            className={cn(
              'w-8 h-8 rounded-md text-xs font-bold transition-all duration-200',
              speed === s
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
        title="Restart"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      </button>
    </div>
  );
}
