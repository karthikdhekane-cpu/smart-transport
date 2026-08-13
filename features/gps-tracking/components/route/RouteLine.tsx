'use client';

import React, { useMemo } from 'react';
import { BusRoute } from '../../types';
import { calculateBearing } from '../../utils/math';

interface RouteLineProps {
  route: BusRoute;
  currentProgress: number; // 0-100
  showRoute?: boolean;
  showStops?: boolean;
  routeColor?: string;
  completedColor?: string;
  remainingColor?: string;
  onStopClick?: (stop: BusRoute['stops'][0]) => void;
}

export default function RouteLine({
  route,
  currentProgress,
  showRoute = true,
  showStops = true,
  routeColor = '#00C853',
  completedColor = '#10b981',
  remainingColor = '#d1d5db',
  onStopClick,
}: RouteLineProps) {
  if (!showRoute || !route || route.stops.length < 2) {
    return null;
  }

  // Split route at current progress point
  const progressPointIndex = Math.floor((currentProgress / 100) * route.stops.length);
  
  // For simplicity, we'll just show the entire route with color based on progress
  // In a real implementation, we'd calculate the exact position along the route
  
  const renderRoute = () => {
    const stops = route.stops;
    
    return (
      <g>
        {/* Completed route segment */}
        {stops.slice(0, Math.min(progressPointIndex + 1, stops.length)).map((stop, i) => {
          if (i === 0) return null;
          const prevStop = stops[i - 1];
          
          return (
            <line
              key={`completed-${i}`}
              x1={prevStop.lng}
              y1={prevStop.lat}
              x2={stop.lng}
              y2={stop.lat}
              stroke={completedColor}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
          );
        })}
        
        {/* Remaining route segment */}
        {stops.slice(progressPointIndex).map((stop, i) => {
          if (i === 0) return null;
          const prevStop = stops[progressPointIndex + i - 1];
          
          return (
            <line
              key={`remaining-${i}`}
              x1={prevStop.lng}
              y1={prevStop.lat}
              x2={stop.lng}
              y2={stop.lat}
              stroke={remainingColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          );
        })}
      </g>
    );
  };

  const renderStops = () => {
    if (!showStops) return null;

    return (
      <g>
        {route.stops.map((stop, i) => {
          const isCompleted = i < progressPointIndex;
          const isCurrent = i === progressPointIndex;
          const isNext = i === progressPointIndex + 1;
          
          return (
            <g
              key={stop.id}
              onClick={() => onStopClick && onStopClick(stop)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {/* Stop marker */}
              <circle
                cx={stop.lng}
                cy={stop.lat}
                r={isCurrent ? 6 : 4}
                fill={isCompleted ? completedColor : isCurrent ? '#FFD700' : remainingColor}
                stroke={isCurrent ? '#FFD700' : 'transparent'}
                strokeWidth="2"
              />
              
              {/* Stop label */}
              <text
                x={stop.lng + 0.0002}
                y={stop.lat - 0.0001}
                fontSize="10"
                fill="#374151"
                fontWeight="500"
              >
                {stop.name.split(' ')[0]}
              </text>
              
              {/* Current stop pulse */}
              {isCurrent && (
                <circle
                  cx={stop.lng}
                  cy={stop.lat}
                  r="10"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="1"
                  opacity="0.5"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <g className="route-layer">
      {renderRoute()}
      {renderStops()}
    </g>
  );
}
