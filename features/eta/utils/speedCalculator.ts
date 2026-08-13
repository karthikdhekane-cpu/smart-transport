// Speed Calculator - Calculate and track bus speeds

import { Position } from '../types';
import { calculateDistance } from './math';

/**
 * Calculate speed between two positions
 * @param pos1 - Previous position
 * @param pos2 - Current position
 * @param timeDelta - Time difference in milliseconds
 * @returns Speed in km/h
 */
export function calculateSpeed(pos1: Position, pos2: Position, timeDelta: number): number {
  if (timeDelta <= 0) return 0;

  const dist = calculateDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
  const speedMps = dist / (timeDelta / 1000); // meters per second
  return speedMps * 3.6; // Convert to km/h
}

/**
 * Calculate average speed from position array
 * @param positions - Array of positions
 * @returns Average speed in km/h
 */
export function calculateAverageSpeed(positions: Position[]): number {
  if (positions.length < 2) return 0;

  let totalDistance = 0;
  let totalTime = 0;

  for (let i = 1; i < positions.length; i++) {
    const d = calculateDistance(
      positions[i - 1].lat,
      positions[i - 1].lng,
      positions[i].lat,
      positions[i].lng
    );
    const t = positions[i].timestamp - positions[i - 1].timestamp;
    
    totalDistance += d;
    totalTime += t;
  }

  if (totalTime <= 0) return 0;
  
  const avgSpeedMps = totalDistance / (totalTime / 1000);
  return avgSpeedMps * 3.6; // Convert to km/h
}

/**
 * Calculate speed history average (weighted by time)
 * @param positions - Array of positions with timestamps
 * @param windowSize - Number of samples to consider
 * @returns Weighted average speed in km/h
 */
export function calculateWeightedAverageSpeed(positions: Position[], windowSize: number = 10): number {
  if (positions.length < 2) return 0;
  
  const recentPositions = positions.slice(-windowSize);
  return calculateAverageSpeed(recentPositions);
}

/**
 * Smooth speed with exponential moving average
 * @param currentSpeed - Current speed
 * @param previousSmoothed - Previous smoothed speed
 * @param alpha - Smoothing factor (0-1)
 * @returns Smoothed speed
 */
export function smoothSpeed(currentSpeed: number, previousSmoothed: number, alpha: number = 0.3): number {
  if (previousSmoothed === 0) return currentSpeed;
  return alpha * currentSpeed + (1 - alpha) * previousSmoothed;
}

/**
 * Calculate speed variance (noise level)
 * @param speeds - Array of recent speeds
 * @returns Variance in km/h
 */
export function calculateSpeedVariance(speeds: number[]): number {
  if (speeds.length < 2) return 0;
  
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const variance = speeds.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / speeds.length;
  
  return Math.sqrt(variance);
}

/**
 * Get speed category based on value
 */
export function getSpeedCategory(speed: number): 'stopped' | 'slow' | 'moderate' | 'fast' | 'very-fast' {
  if (speed < 5) return 'stopped';
  if (speed < 20) return 'slow';
  if (speed < 40) return 'moderate';
  if (speed < 60) return 'fast';
  return 'very-fast';
}

/**
 * Format speed for display
 */
export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

/**
 * Get speed indicator color based on value
 */
export function getSpeedColor(speed: number): string {
  if (speed < 10) return 'text-gray-400';
  if (speed < 30) return 'text-[#FFD700]';
  if (speed < 50) return 'text-[#00C853]';
  return 'text-[#2196F3]';
}
