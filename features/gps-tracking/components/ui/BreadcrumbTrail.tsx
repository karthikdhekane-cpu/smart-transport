'use client';

import React, { useMemo } from 'react';
import { GPSPosition } from '../../types';

interface BreadcrumbTrailProps {
  history: GPSPosition[];
  showHistory?: boolean;
  color?: string;
  className?: string;
}

export default function BreadcrumbTrail({
  history,
  showHistory = false,
  color = '#A855F7',
  className,
}: BreadcrumbTrailProps) {
  if (!showHistory || !history || history.length < 2) {
    return null;
  }

  // Convert positions to SVG path
  const pathData = useMemo(() => {
    if (history.length < 2) return '';
    
    return history.map((pos, i) => {
      const x = pos.lng;
      const y = pos.lat;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  }, [history]);

  return (
    <path
      d={pathData}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeOpacity="0.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  );
}
