// Distance Calculator - Calculate distances along routes

import { Position, BusStop } from '../types';
import { calculateDistance as etaCalculateDistance } from './math';

/**
 * Calculate cumulative distance along route stops
 * @param stops - Array of bus stops
 * @returns Array of cumulative distances in meters
 */
export function calculateCumulativeDistances(stops: BusStop[]): number[] {
  const distances: number[] = [0];
  
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];
    const dist = etaCalculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    distances.push(distances[i - 1] + dist);
  }
  
  return distances;
}

/**
 * Calculate total route distance
 * @param stops - Array of bus stops
 * @returns Total distance in meters
 */
export function calculateTotalDistance(stops: BusStop[]): number {
  const distances = calculateCumulativeDistances(stops);
  return distances[distances.length - 1];
}

/**
 * Calculate distance from start to a specific stop
 * @param stops - Array of bus stops
 * @param stopIndex - Index of the stop
 * @returns Distance in meters
 */
export function distanceToStop(stops: BusStop[], stopIndex: number): number {
  if (stopIndex < 0 || stopIndex >= stops.length) return 0;
  const distances = calculateCumulativeDistances(stops);
  return distances[stopIndex];
}

/**
 * Calculate remaining distance from current position to destination
 * @param stops - Array of bus stops
 * @param currentIndex - Current stop index
 * @returns Remaining distance in meters
 */
export function calculateRemainingDistance(stops: BusStop[], currentIndex: number): number {
  const totalDistance = calculateTotalDistance(stops);
  const completedDistance = distanceToStop(stops, currentIndex);
  return Math.max(0, totalDistance - completedDistance);
}

/**
 * Calculate distance between position and stop
 * @param position - Current position
 * @param stop - Target stop
 * @returns Distance in meters
 */
export function distanceToStopFromPosition(position: Position, stop: BusStop): number {
  return etaCalculateDistance(position.lat, position.lng, stop.lat, stop.lng);
}

/**
 * Find the nearest stop to a position
 * @param position - Current position
 * @param stops - Array of bus stops
 * @returns Nearest stop and its index
 */
export function findNearestStop(position: Position, stops: BusStop[]): { stop: BusStop; index: number; distance: number } {
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  for (let i = 0; i < stops.length; i++) {
    const dist = distanceToStopFromPosition(position, stops[i]);
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearestIndex = i;
    }
  }

  return {
    stop: stops[nearestIndex],
    index: nearestIndex,
    distance: nearestDistance,
  };
}

/**
 * Get progress percentage along route
 * @param stops - Array of bus stops
 * @param currentIndex - Current stop index
 * @param currentStopProgress - Progress within current segment (0-1)
 * @returns Progress percentage (0-100)
 */
export function calculateRouteProgress(stops: BusStop[], currentIndex: number, currentStopProgress: number = 0): number {
  if (stops.length < 2) return 0;
  
  const totalDistance = calculateTotalDistance(stops);
  const completedDistance = distanceToStop(stops, currentIndex);
  const segmentDistance = totalDistance / (stops.length - 1); // Approximate
  
  const progress = completedDistance + (segmentDistance * currentStopProgress);
  return Math.min(100, Math.max(0, (progress / totalDistance) * 100));
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get distance indicator color based on value
 */
export function getDistanceColor(distance: number): string {
  if (distance < 500) return 'text-[#FF5722]';
  if (distance < 2000) return 'text-[#FFD700]';
  if (distance < 5000) return 'text-[#2196F3]';
  return 'text-[#00C853]';
}
